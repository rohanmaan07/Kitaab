import { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineClose, AiOutlineMessage } from "react-icons/ai";
import { useSocket } from "../Context/SocketContext";
import api from "../utils/axios";

function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading,
  showNewMessage,
  setShowNewMessage,
  onNewConversation,
}) {
  const { socket, onlineUsers } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setSearching(true);
    try {
      const response = await api.get(
        `/users/search?query=${searchQuery}`
      );
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    }
    setSearching(false);
  };

  const handleStartConversation = async (user) => {
    try {
      const response = await api.post(
        "/conversations/create",
        { receiverId: user._id }
      );

      console.log("Conversation created:", response.data.conversation);

      // Close the new message modal
      setShowNewMessage(false);
      setSearchQuery("");
      setSearchResults([]);

      // Add the new conversation and select it
      onNewConversation(response.data.conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      alert(`Failed to start conversation: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const messageDate = new Date(date);
    const now = new Date();
    const diffInMs = now - messageDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    return messageDate.toLocaleDateString();
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 border-2 border-gray-800 border-t-[#E50914] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar-visible">
      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[5vh]">
          <div className="bg-black rounded-2xl w-full max-w-[600px] max-h-[650px] flex flex-col border border-gray-800/50 shadow-2xl mx-4">
            {/* Modal Header */}
            <header className="flex items-center px-4 h-[53px] border-b border-gray-800/50">
              <button
                onClick={() => {
                  setShowNewMessage(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-2 -ml-2 hover:bg-white/10 active:bg-white/5 rounded-full transition-colors duration-200"
                aria-label="Close"
              >
                <AiOutlineClose size={20} className="text-white" />
              </button>
              <h2 className="text-xl font-bold ml-8 text-white">New message</h2>
            </header>

            {/* Search Input */}
            <div className="px-4 py-3 border-b border-gray-800/50">
              <div className="relative">
                <AiOutlineSearch
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search people"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-white text-[15px] placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar-visible">
              {searching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 border-2 border-gray-800 border-t-[#E50914] rounded-full animate-spin"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleStartConversation(user)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors duration-200"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {isUserOnline(user._id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px] text-white truncate">{user.name}</p>
                        <p className="text-[15px] text-gray-500 truncate">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-[15px] text-gray-500">No results for "{searchQuery}"</p>
                  <p className="text-[13px] text-gray-600 mt-1">Try searching for something else.</p>
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <AiOutlineSearch size={40} className="mx-auto mb-3 text-gray-700" />
                  <p className="text-[15px] text-gray-500">Search for people</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-[#E50914]/10 rounded-full">
            <AiOutlineMessage size={32} className="text-[#E50914]" />
          </div>
          <p className="text-[31px] font-bold text-white mb-2">Welcome to your inbox!</p>
          <p className="text-[15px] text-gray-500">
            Drop a line, share posts and more with private conversations between you and others on Kitaab.
          </p>
        </div>
      ) : (
        <div>
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 border-b border-gray-800/30 ${selectedConversation?._id === conversation._id
                  ? "bg-white/5"
                  : "hover:bg-white/5"
                }`}
            >
              {/* Avatar with online status */}
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.otherUser?.avatar}
                  alt={conversation.otherUser?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {isUserOnline(conversation.otherUser?._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <p className="font-bold text-[15px] text-white truncate">
                      {conversation.otherUser?.name}
                    </p>
                    <span className="text-[15px] text-gray-500 flex-shrink-0">
                      · {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-[#E50914] rounded-full ml-2"></span>
                  )}
                </div>
                <p
                  className={`text-[15px] truncate ${conversation.unreadCount > 0
                      ? "text-white font-normal"
                      : "text-gray-500"
                    }`}
                >
                  {conversation.lastMessage || "Start a conversation"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConversationList;
