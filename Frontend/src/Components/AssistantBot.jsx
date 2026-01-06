import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// --- SVG ICONS ---
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
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const SparkleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9L12 2Z" />
  </svg>
);

const AssistantBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Namaskar!  Main Kitaab Poetry Assistant hoon.\nKuch shayari sunein ya koi sawal poochein?" },
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

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = userInput.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/v1/bot/chat", {
        id: sessionIdRef.current,
        message: text,
      });

      let reply = res.data.reply || "Maaf kijiye, main jawab nahi de paaya.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-3xl h-[85vh] bg-[#1a1d24] rounded-2xl shadow-2xl flex flex-col border border-gray-800 overflow-hidden animate-slide-up">

            {/* HEADER */}
            <div className="p-5 bg-[#E50914] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <BotIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Kitaab Poetry Assistant</h3>
                  <p className="text-white/80 text-xs">Rohan ki shayari se powered</p>
                </div>
              </div>
              <button
                onClick={toggleOpen}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <CloseIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* CHAT AREA */}
            <div
              ref={chatBoxRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#13151a]"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#E50914 #1a1d24'
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2.5 ${msg.sender === "bot" ? "justify-start" : "justify-end"} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center flex-shrink-0">
                      <BotIcon className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all
                      ${msg.sender === "bot"
                        ? "bg-[#1f2329] text-gray-100 rounded-bl-none border border-gray-700"
                        : "bg-[#E50914] text-white rounded-br-none"
                      }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start items-end gap-2.5 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-[#1f2329] border border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-400 text-xs">typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INPUT BAR */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-[#1a1d24]">
              <div className="bg-[#1f2329] rounded-xl flex items-center px-4 py-3 border border-gray-700 focus-within:border-[#E50914] transition">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-500 text-sm"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  className="ml-2 p-2.5 rounded-lg bg-[#E50914] hover:bg-[#c4070f] text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={isLoading || !userInput.trim()}
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING OPEN BUTTON */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-7 right-7 w-[72px] h-[72px] bg-gradient-to-br from-[#E50914] via-[#c4070f] to-[#8a0509] rounded-full flex items-center justify-center text-white shadow-[0_10px_40px_rgba(229,9,20,0.4)] hover:shadow-[0_15px_60px_rgba(229,9,20,0.6)] hover:scale-110 active:scale-95 transition-all duration-500 z-50 border-[3px] border-white/20 group animate-float"
        >
          <BotIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-[#0a0c10] animate-pulse-slow shadow-lg shadow-green-500/50">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E50914] to-[#8a0509] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
        </button>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: #1a1d24;
        }

        div::-webkit-scrollbar-thumb {
          background: #E50914;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #c4070f;
        }
      `}</style>
    </>
  );
};

export default AssistantBot;
