const express = require("express");
const router = express.Router();
const Message = require("../Models/message");
const Conversation = require("../Models/conversation");
const User = require("../Models/user");
const { authenticateToken } = require("./userAuth");

// Get all conversations for the logged-in user
router.get("/conversations", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: userId,
            isActive: true,
        })
            .populate("participants", "username name avatar")
            .populate("lastMessage")
            .sort({ lastMessageTime: -1 })
            .lean();

        // Format conversations with other user info
        const formattedConversations = conversations.map((conv) => {
            const otherUser = conv.participants.find(
                (p) => p._id.toString() !== userId
            );
            
            // When using .lean(), Map is converted to plain object
            const unreadCount = conv.unreadCount ? (conv.unreadCount[userId] || 0) : 0;

            return {
                _id: conv._id,
                otherUser: otherUser,
                lastMessage: conv.lastMessageContent,
                lastMessageTime: conv.lastMessageTime,
                unreadCount: unreadCount,
                isBlocked: conv.isBlocked,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt,
            };
        });

        res.status(200).json({
            success: true,
            conversations: formattedConversations,
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
        });
    }
});

// Get or create a conversation with another user
router.post("/conversations/create", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { receiverId } = req.body;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] },
        })
            .populate("participants", "username name avatar")
            .populate("lastMessage");

        if (!conversation) {
            // Create new conversation
            conversation = new Conversation({
                participants: [userId, receiverId],
                unreadCount: new Map([
                    [userId, 0],
                    [receiverId, 0],
                ]),
            });
            await conversation.save();
            await conversation.populate("participants", "username name avatar");
        }

        // Get the other user
        const otherUser = conversation.participants.find(
            (p) => p._id.toString() !== userId
        );

        res.status(200).json({
            success: true,
            conversation: {
                _id: conversation._id,
                otherUser: otherUser,
                lastMessage: conversation.lastMessageContent,
                lastMessageTime: conversation.lastMessageTime,
                unreadCount: conversation.unreadCount?.get ? conversation.unreadCount.get(userId) || 0 : (conversation.unreadCount?.[userId] || 0),
                isBlocked: conversation.isBlocked,
            },
        });
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create conversation",
        });
    }
});

// Get messages for a specific conversation
router.get("/messages/:conversationId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this conversation",
            });
        }

        // Get messages
        const messages = await Message.find({
            conversationId: conversationId,
            deletedBy: { $ne: userId },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "username name avatar")
            .populate("receiver", "username name avatar")
            .lean();

        const totalMessages = await Message.countDocuments({
            conversationId: conversationId,
            deletedBy: { $ne: userId },
        });

        res.status(200).json({
            success: true,
            messages: messages.reverse(),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages: totalMessages,
                hasMore: skip + messages.length < totalMessages,
            },
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }
});

// Send a new message
router.post("/messages/send", authenticateToken, async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content, conversationId, messageType } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({
                success: false,
                message: "Receiver and content are required",
            });
        }

        let conversation;

        if (conversationId) {
            // Use existing conversation
            conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: "Conversation not found",
                });
            }
        } else {
            // Find or create conversation
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            });

            if (!conversation) {
                conversation = new Conversation({
                    participants: [senderId, receiverId],
                    unreadCount: new Map([
                        [senderId, 0],
                        [receiverId, 0],
                    ]),
                });
                await conversation.save();
            }
        }

        // Check if conversation is blocked
        if (conversation.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Cannot send message. Conversation is blocked.",
            });
        }

        // Create new message
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            receiver: receiverId,
            content: content.trim(),
            messageType: messageType || "text",
        });

        await newMessage.save();
        await newMessage.populate("sender", "username name avatar");
        await newMessage.populate("receiver", "username name avatar");

        // Update conversation
        const currentUnreadCount = conversation.unreadCount || new Map();
        const receiverUnreadCount = currentUnreadCount.get(receiverId.toString()) || 0;
        currentUnreadCount.set(receiverId.toString(), receiverUnreadCount + 1);

        conversation.lastMessage = newMessage._id;
        conversation.lastMessageContent = content.substring(0, 100);
        conversation.lastMessageTime = new Date();
        conversation.unreadCount = currentUnreadCount;
        await conversation.save();

        res.status(201).json({
            success: true,
            message: newMessage,
            conversationId: conversation._id,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
});

// Mark messages as read
router.put("/messages/read/:conversationId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        // Verify user is part of conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        // Mark all unread messages as read
        await Message.updateMany(
            {
                conversationId: conversationId,
                receiver: userId,
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            }
        );

        // Reset unread count for this user
        const currentUnreadCount = conversation.unreadCount || new Map();
        currentUnreadCount.set(userId.toString(), 0);
        conversation.unreadCount = currentUnreadCount;
        await conversation.save();

        res.status(200).json({
            success: true,
            message: "Messages marked as read",
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark messages as read",
        });
    }
});

// Delete a message (soft delete)
router.delete("/messages/:messageId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        // Only sender can delete their message
        if (message.sender.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this message",
            });
        }

        // Soft delete - add user to deletedBy array
        if (!message.deletedBy.includes(userId)) {
            message.deletedBy.push(userId);
        }

        // If both users deleted, mark as deleted
        if (message.deletedBy.length >= 2) {
            message.isDeleted = true;
        }

        await message.save();

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete message",
        });
    }
});

// Delete/Clear entire conversation
router.delete("/conversations/:conversationId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        // Soft delete all messages for this user
        await Message.updateMany(
            {
                conversationId: conversationId,
                deletedBy: { $ne: userId },
            },
            {
                $addToSet: { deletedBy: userId },
            }
        );

        res.status(200).json({
            success: true,
            message: "Conversation cleared successfully",
        });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete conversation",
        });
    }
});

// Search users for new conversation
router.get("/users/search", authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;

        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search query must be at least 2 characters",
            });
        }

        const users = await User.find({
            _id: { $ne: userId },
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
            ],
        })
            .select("username name avatar")
            .limit(20)
            .lean();

        res.status(200).json({
            success: true,
            users: users,
        });
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search users",
        });
    }
});

// Block/Unblock conversation
router.put("/conversations/:conversationId/block", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { conversationId } = req.params;
        const { block } = req.body; // true to block, false to unblock

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        conversation.isBlocked = block;
        conversation.blockedBy = block ? userId : null;
        await conversation.save();

        res.status(200).json({
            success: true,
            message: block ? "Conversation blocked" : "Conversation unblocked",
        });
    } catch (error) {
        console.error("Error blocking/unblocking conversation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update conversation",
        });
    }
});

// Get unread message count
router.get("/messages/unread/count", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const conversations = await Conversation.find({
            participants: userId,
            isActive: true,
        }).lean();

        let totalUnread = 0;
        conversations.forEach((conv) => {
            // When using .lean(), Map is converted to plain object
            const unread = conv.unreadCount ? (conv.unreadCount[userId] || 0) : 0;
            totalUnread += unread;
        });

        res.status(200).json({
            success: true,
            unreadCount: totalUnread,
        });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch unread count",
        });
    }
});

module.exports = router;
