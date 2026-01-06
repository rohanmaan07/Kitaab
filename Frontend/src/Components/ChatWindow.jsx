import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AiOutlineArrowLeft, AiOutlineMore } from "react-icons/ai";
import { BsCheckAll, BsCheck } from "react-icons/bs";
import { useSocket } from "../Context/SocketContext";
import MessageInput from "./MessageInput";
import api from "../utils/axios";
import { Link } from "react-router-dom";

function ChatWindow({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const { socket, onlineUsers } = useSocket();
  const currentUserId = localStorage.getItem("id");

  // Memoized values
  const isOnline = useMemo(
    () => onlineUsers.includes(conversation?.otherUser?._id),
    [onlineUsers, conversation?.otherUser?._id]
  );

  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((msg, index) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      
      if (!currentGroup || currentGroup.date !== msgDate) {
        currentGroup = { date: msgDate, messages: [] };
        groups.push(currentGroup);
      }
      
      currentGroup.messages.push({ ...msg, index });
    });

    return groups;
  }, [messages]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversation?._id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/messages/${conversation._id}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [conversation?._id]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!conversation?._id || !socket) return;

    try {
      await api.put(`/messages/read/${conversation._id}`);
      socket.emit("mark_as_read", {
        conversationId: conversation._id,
        receiverId: conversation.otherUser._id,
      });
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  }, [conversation?._id, conversation?.otherUser?._id, socket]);

  // Format date helpers
  const formatTime = useCallback(
    (date) =>
      new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  const formatDateGroup = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString([], { 
      month: "short", 
      day: "numeric", 
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined 
    });
  }, []);

  // Initial setup
  useEffect(() => {
    if (!conversation) return;

    fetchMessages();
    markMessagesAsRead();

    socket?.emit("join_conversation", conversation._id);

    return () => {
      socket?.emit("leave_conversation", conversation._id);
    };
  }, [conversation, fetchMessages, markMessagesAsRead, socket]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleReceiveMessage = ({ conversationId, message }) => {
      if (conversationId === conversation._id) {
        setMessages((prev) => [...prev, message]);
        markMessagesAsRead();
      }
    };

    const handleUserTyping = (data) => {
      if (
        data.conversationId === conversation._id &&
        data.userId !== currentUserId
      ) {
        setIsTyping(data.isTyping);
      }
    };

    const handleMessagesRead = (data) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender._id === currentUserId ? { ...m, isRead: true } : m
          )
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, conversation, currentUserId, markMessagesAsRead]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Guard clause
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <p className="text-gray-500 text-[15px]">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black w-full">
      {/* Header - X/Twitter Style */}
      <header className="sticky top-0 z-20 bg-black/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-[53px] max-w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="md:hidden -ml-2 p-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors duration-200"
              aria-label="Back to conversations"
            >
              <AiOutlineArrowLeft size={20} className="text-white" />
            </button>

            <Link
              to={`/user/${conversation.otherUser._id}`}
              className="flex items-center gap-3 flex-1 min-w-0 group"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.otherUser.avatar}
                  alt={conversation.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gray-700 transition-all duration-200"
                />
                {isOnline && (
                  <span 
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"
                    aria-label="Online"
                  />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[15px] font-bold text-white truncate group-hover:underline">
                  {conversation.otherUser.name}
                </p>
                <p className="text-[13px] text-gray-500 font-normal">
                  {isOnline ? "Active now" : "Offline"}
                </p>
              </div>
            </Link>
          </div>

          <button
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors duration-200 flex-shrink-0"
            aria-label="More options"
          >
            <AiOutlineMore size={20} className="text-white" />
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <main 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar-visible w-full"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="relative">
              <div className="h-10 w-10 border-3 border-gray-800 border-t-[#E50914] rounded-full animate-spin" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <p className="text-red-500 text-[15px] mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-[#E50914] text-white rounded-full hover:bg-[#c4070f] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto w-full">
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="px-3 py-1 bg-[#16181C] border border-gray-800/50 rounded-full">
                    <span className="text-[13px] text-gray-500 font-medium">
                      {formatDateGroup(group.date)}
                    </span>
                  </div>
                </div>

                {/* Messages in this date group */}
                <div className="space-y-3">
                  {group.messages.map((msg, msgIndex) => {
                    const isSent = msg.sender._id === currentUserId;
                    const prevMsg = msgIndex > 0 ? group.messages[msgIndex - 1] : null;
                    const nextMsg = msgIndex < group.messages.length - 1 ? group.messages[msgIndex + 1] : null;
                    
                    const showAvatar = !isSent && (!prevMsg || prevMsg.sender._id !== msg.sender._id);
                    const isConsecutive = prevMsg && prevMsg.sender._id === msg.sender._id;
                    const isLastInGroup = !nextMsg || nextMsg.sender._id !== msg.sender._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex gap-2 animate-fadeIn ${
                          isSent ? "justify-end" : "justify-start"
                        } ${isConsecutive ? "mt-1" : "mt-3"}`}
                      >
                        {/* Receiver's Avatar */}
                        {!isSent && (
                          <div className="flex-shrink-0 w-8">
                            {showAvatar ? (
                              <img
                                src={conversation.otherUser.avatar}
                                alt={conversation.otherUser.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8" />
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`flex flex-col max-w-[70%] sm:max-w-[60%] md:max-w-[55%] lg:max-w-[50%] ${isSent ? "items-end" : "items-start"}`}>
                          <div
                            className={`px-4 py-2.5 text-[15px] leading-[20px] break-words
                              ${isSent
                                ? "bg-[#E50914] text-white rounded-[20px] rounded-br-[4px] shadow-lg"
                                : "bg-[#16181C] text-white rounded-[20px] rounded-bl-[4px] border border-gray-800/50"
                              }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>

                          {/* Timestamp and Read Status - Show on last message in group */}
                          {isLastInGroup && (
                            <div
                              className={`mt-1 flex items-center gap-1.5 px-1
                                ${isSent ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <span className="text-[11px] text-gray-600 font-normal">
                                {formatTime(msg.createdAt)}
                              </span>
                              {isSent && (
                                <div className="flex items-center">
                                  {msg.isRead ? (
                                    <BsCheckAll size={16} className="text-[#1D9BF0]" />
                                  ) : (
                                    <BsCheck size={16} className="text-gray-600" />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Sender's space placeholder for alignment */}
                        {isSent && <div className="flex-shrink-0 w-8" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center animate-fadeIn mt-3">
                <img
                  src={conversation.otherUser.avatar}
                  alt={`${conversation.otherUser.name} is typing`}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="bg-[#16181C] border border-gray-800/50 rounded-[20px] rounded-bl-[4px] px-5 py-3">
                  <div className="flex gap-1">
                    <span 
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                      style={{ animationDelay: "0ms" }} 
                    />
                    <span 
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                      style={{ animationDelay: "150ms" }} 
                    />
                    <span 
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" 
                      style={{ animationDelay: "300ms" }} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Message Input */}
      <footer className="sticky bottom-0 z-10">
        <MessageInput 
          conversationId={conversation._id}
          onSendMessage={(message) => {
            socket?.emit("send_message", {
              conversationId: conversation._id,
              receiverId: conversation.otherUser._id,
              content: message,
            });
          }}
          onTyping={(isTyping) => {
            socket?.emit("typing", {
              conversationId: conversation._id,
              receiverId: conversation.otherUser._id,
              isTyping,
            });
          }}
        />
      </footer>
    </div>
  );
}

export default ChatWindow;
