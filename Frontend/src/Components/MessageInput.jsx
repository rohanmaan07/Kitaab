import { useState, useRef, useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { BsEmojiSmile, BsImage } from "react-icons/bs";

function MessageInput({ onSendMessage, onTyping, conversationId }) {
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = ["😊", "😂", "❤️", "👍", "🔥", "✨", "🎉", "💯", "😍", "🥰", "😎", "🤔", "👏", "🙌", "💪", "🎵"];

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Typing indicator logic
    if (onTyping) {
      onTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message);
      setMessage("");

      // Stop typing indicator
      if (onTyping) {
        onTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="sticky bottom-0 bg-black/95 backdrop-blur-md border-t border-gray-800/50 px-4 md:px-6 lg:px-8 py-3 z-10">
      <div className="max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 text-[#E50914] hover:bg-[#E50914]/10 transition-colors duration-200 rounded-full"
            aria-label="Add emoji"
          >
            <BsEmojiSmile size={20} />
          </button>

          {showEmoji && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowEmoji(false)}
              ></div>
              <div className="absolute bottom-full left-0 mb-2 bg-black border border-gray-800/50 rounded-2xl p-3 shadow-2xl z-20 w-64">
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-2xl hover:bg-white/10 rounded-lg p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Image Button */}
        <button
          type="button"
          className="p-2 text-[#E50914] hover:bg-[#E50914]/10 transition-colors duration-200 rounded-full"
          aria-label="Add image"
        >
          <BsImage size={20} />
        </button>

        {/* Message Textarea */}
        <div className="flex-1 bg-[#16181C] border border-gray-800/50 rounded-full px-4 py-2 focus-within:border-[#E50914] transition-colors duration-200">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start a new message"
            className="w-full bg-transparent text-white text-[15px] resize-none focus:outline-none placeholder-gray-500 max-h-[120px]"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full transition-colors duration-200 ${message.trim()
              ? "text-[#E50914] hover:bg-[#E50914]/10"
              : "text-gray-600 cursor-not-allowed"
            }`}
          aria-label="Send message"
        >
          <AiOutlineSend size={20} />
        </button>
      </form>
      </div>
    </div>
  );
}

export default MessageInput;
