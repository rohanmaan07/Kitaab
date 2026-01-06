const jwt = require("jsonwebtoken");
const Message = require("./Models/message");
const Conversation = require("./Models/conversation");

// Store online users
const onlineUsers = new Map(); // userId -> socketId

const initializeSocket = (io) => {
    // Middleware for socket authentication
    io.use((socket, next) => {
        try {
            let token = socket.handshake.auth.token;
            
            if (!token) {
                console.log("No token provided in socket connection");
                return next(new Error("Authentication token required"));
            }

            // Remove 'Bearer ' prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            jwt.verify(token, "rohan123", (err, decoded) => {
                if (err) {
                    console.log("Token verification failed:", err.message);
                    return next(new Error("Invalid token"));
                }
                socket.userId = decoded.id;
                console.log("Socket authenticated for user:", decoded.id);
                next();
            });
        } catch (error) {
            console.error("Socket authentication error:", error);
            return next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Add user to online users
        onlineUsers.set(socket.userId, socket.id);

        // Emit online status to all connected clients
        io.emit("user_online", { userId: socket.userId });

        // Join user to their personal room
        socket.join(socket.userId);

        // Handle joining a conversation room
        socket.on("join_conversation", (conversationId) => {
            socket.join(conversationId);
            console.log(`User ${socket.userId} joined conversation ${conversationId}`);
        });

        // Handle leaving a conversation room
        socket.on("leave_conversation", (conversationId) => {
            socket.leave(conversationId);
            console.log(`User ${socket.userId} left conversation ${conversationId}`);
        });

        // Handle sending a message
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, receiverId, content, messageType } = data;

                // Create the message
                const newMessage = new Message({
                    conversationId,
                    sender: socket.userId,
                    receiver: receiverId,
                    content: content.trim(),
                    messageType: messageType || "text",
                });

                await newMessage.save();
                await newMessage.populate("sender", "username name avatar");
                await newMessage.populate("receiver", "username name avatar");

                // Update conversation
                const conversation = await Conversation.findById(conversationId);
                if (conversation) {
                    const currentUnreadCount = conversation.unreadCount || new Map();
                    const receiverUnreadCount = currentUnreadCount.get(receiverId) || 0;
                    currentUnreadCount.set(receiverId, receiverUnreadCount + 1);

                    conversation.lastMessage = newMessage._id;
                    conversation.lastMessageContent = content.substring(0, 100);
                    conversation.lastMessageTime = new Date();
                    conversation.unreadCount = currentUnreadCount;
                    await conversation.save();
                }

                // Emit to conversation room
                io.to(conversationId).emit("receive_message", {
                    message: newMessage,
                    conversationId,
                });

                // Emit to receiver's personal room for notification
                io.to(receiverId).emit("new_message_notification", {
                    message: newMessage,
                    conversationId,
                    unreadCount: conversation.unreadCount.get(receiverId),
                });

                // Send acknowledgment back to sender
                socket.emit("message_sent", {
                    success: true,
                    message: newMessage,
                });
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", {
                    success: false,
                    error: "Failed to send message",
                });
            }
        });

        // Handle typing indicator
        socket.on("typing_start", (data) => {
            const { conversationId, receiverId } = data;
            io.to(receiverId).emit("user_typing", {
                conversationId,
                userId: socket.userId,
                isTyping: true,
            });
        });

        socket.on("typing_stop", (data) => {
            const { conversationId, receiverId } = data;
            io.to(receiverId).emit("user_typing", {
                conversationId,
                userId: socket.userId,
                isTyping: false,
            });
        });

        // Handle message read
        socket.on("mark_as_read", async (data) => {
            try {
                const { conversationId, receiverId } = data;

                // Update messages as read
                await Message.updateMany(
                    {
                        conversationId,
                        receiver: socket.userId,
                        isRead: false,
                    },
                    {
                        $set: {
                            isRead: true,
                            readAt: new Date(),
                        },
                    }
                );

                // Update conversation unread count
                const conversation = await Conversation.findById(conversationId);
                if (conversation) {
                    const currentUnreadCount = conversation.unreadCount || new Map();
                    currentUnreadCount.set(socket.userId, 0);
                    conversation.unreadCount = currentUnreadCount;
                    await conversation.save();
                }

                // Notify sender that messages were read
                io.to(receiverId).emit("messages_read", {
                    conversationId,
                    readBy: socket.userId,
                });
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.userId}`);
            onlineUsers.delete(socket.userId);
            
            // Emit offline status to all connected clients
            io.emit("user_offline", { userId: socket.userId });
        });

        // Get online status of a user
        socket.on("check_online_status", (userId) => {
            const isOnline = onlineUsers.has(userId);
            socket.emit("online_status", {
                userId,
                isOnline,
            });
        });
    });
};

// Helper function to check if user is online
const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
};

// Get all online users
const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};

module.exports = {
    initializeSocket,
    isUserOnline,
    getOnlineUsers,
};
