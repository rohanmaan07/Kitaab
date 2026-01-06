import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import ConversationList from "../Components/ConversationList";
import ChatWindow from "../Components/ChatWindow";
import api from "../utils/axios";
import { AiOutlineEdit } from "react-icons/ai";

function Messages() {
  const location = useLocation();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle conversation passed from navigation state (e.g., from user profile)
  useEffect(() => {
    if (location.state?.selectedConversation) {
      const conv = location.state.selectedConversation;
      console.log("Auto-selecting conversation from navigation:", conv);

      // Add to conversations list if not already there
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conv._id);
        if (!exists) {
          return [conv, ...prev];
        }
        return prev;
      });

      // Select the conversation
      setSelectedConversation(conv);

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Listen for new message notifications via socket
  useEffect(() => {
    if (socket) {
      socket.on("new_message_notification", (data) => {
        console.log("New message notification received:", data);
        // Refresh conversations to show the new message
        fetchConversations();
      });

      return () => {
        socket.off("new_message_notification");
      };
    }
  }, [socket]);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/conversations");
      setConversations(response.data.conversations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewConversation = async (newConv) => {
    // Check if conversation already exists in the list
    const existingConv = conversations.find(
      (conv) => conv._id === newConv._id
    );

    if (!existingConv) {
      // Only add if it doesn't exist
      setConversations((prev) => [newConv, ...prev]);
    } else {
      // If it exists, just update it
      setConversations((prev) =>
        prev.map((conv) => (conv._id === newConv._id ? newConv : conv))
      );
    }

    setSelectedConversation(newConv);
    setShowNewMessage(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <div style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="flex h-full">
          {/* Left Sidebar - Conversations List */}
          <div
            className={`${selectedConversation ? "hidden md:flex" : "flex"
              } w-full md:w-[350px] lg:w-[400px] xl:w-[420px] border-r border-gray-800/50 flex-col bg-black flex-shrink-0`}
          >
            {/* Header */}
            <header className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-gray-800/50 z-10">
              <div className="px-4 h-[53px] flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Messages</h1>
                <button
                  onClick={() => setShowNewMessage(true)}
                  className="p-2 hover:bg-white/10 active:bg-white/5 rounded-full transition-colors duration-200"
                  aria-label="New message"
                >
                  <AiOutlineEdit size={20} className="text-white" />
                </button>
              </div>
            </header>

            {/* Conversations List */}
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleConversationSelect}
              loading={loading}
              showNewMessage={showNewMessage}
              setShowNewMessage={setShowNewMessage}
              onNewConversation={handleNewConversation}
            />
          </div>

          {/* Right Side - Chat Window */}
          <div className={`${selectedConversation ? "flex" : "hidden md:flex"} flex-1 bg-black w-full`}>
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="max-w-md text-center">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-[#E50914]/10 rounded-full">
                    <AiOutlineEdit size={32} className="text-[#E50914]" />
                  </div>
                  <h2 className="text-[31px] font-bold mb-2 text-white">Select a message</h2>
                  <p className="text-[15px] text-gray-500 mb-7 leading-relaxed">
                    Choose from your existing conversations, start a new one, or just keep swimming.
                  </p>
                  <button
                    onClick={() => setShowNewMessage(true)}
                    className="bg-[#E50914] text-white px-8 py-3 rounded-full hover:bg-[#c4070f] active:bg-[#a00610] transition-colors duration-200 font-bold text-[15px]"
                  >
                    New message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

export default Messages;
