import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// --- SVG Icons ---
const BotIcon = ({ className = "w-9 h-9" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="8" width="16" height="10" rx="4" ry="4" />
    <circle cx="9" cy="13" r="1.5" fill="white" />
    <circle cx="15" cy="13" r="1.5" fill="white" />
    <rect x="10.5" y="3" width="3" height="3" rx="1" />
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SendIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const AssistantBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Main Kitaab hoon. Hukam farmaye janaab..!" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const sessionIdRef = useRef(Date.now().toString());

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    const userQuery = userInput;
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("https://kitaabrohan.onrender.com/api/v1/bot/chat", {
        id: sessionIdRef.current,
        message: userQuery,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error("Error communicating with bot:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Maaf kijiye, server se jawab nahi mil raha hai.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-2xl h-[80vh] bg-[#16181C] rounded-2xl shadow-2xl flex flex-col border border-gray-700">
            <div className="p-4 bg-[#202327] flex justify-between items-center border-b border-gray-700 rounded-t-2xl">
              <h3 className="font-bold text-white text-lg">Kitaab Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <CloseIcon className="w-7 h-7" />
              </button>
            </div>

            {/* Chat Messages */}

            <div
              ref={chatBoxRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow 
        ${
          msg.sender === "bot"
            ? "bg-gray-700 text-white rounded-bl-none"
            : "bg-[#E50914] text-white rounded-br-none"
        }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl text-white bg-gray-700 animate-pulse">
                    Khayalon mei...
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-700 bg-[#202327] rounded-b-2xl"
            >
              <div className="bg-[#16181C] rounded-full flex items-center px-3 py-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Kuch puchiye..."
                  className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400 text-sm"
                />
                <button
                  type="submit"
                  className="ml-2 p-2 rounded-full bg-[#E50914] hover:bg-red-700 text-white transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                  disabled={isLoading || !userInput.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 w-16 h-16 bg-[#E50914] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700 transition-all duration-300 z-50"
        >
          <BotIcon />
        </button>
      )}
    </>
  );
};

export default AssistantBot;
