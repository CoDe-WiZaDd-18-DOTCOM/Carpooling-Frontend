import React, { useState, useRef, useEffect } from "react";
import { CHATBOT_POST } from "../utils/apis";

// ChatBotModal Component
function ChatBotModal({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendQuestion = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { sender: "user", text: input };
    setMessages((msg) => [...msg, userMessage]);

    try {
      const response = await fetch(CHATBOT_POST, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: input,
      });
      const text = await response.text();
      setMessages((msg) => [...msg, { sender: "bot", text }]);
    } catch (err) {
      setMessages((msg) => [
        ...msg,
        { sender: "bot", text: "❗ Error: Unable to get response." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
    className="fixed bottom-28 right-10 w-[350px] max-h-[440px] rounded-2xl shadow-2xl bg-white border-2 border-emerald-200 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-emerald-300 to-emerald-500 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-gray-800 text-lg">CarpoolBot</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-700 hover:text-red-500 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 bg-emerald-50 overflow-y-auto max-h-[320px] space-y-4 rounded-b-2xl">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-8">
            <span className="animate-pulse">Ask anything about CarpoolConnect! 🚗</span>
          </div>
        )}
        {messages.map((msg, i) =>
          msg.sender === "bot" ? (
            <div key={i} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-lg shadow">
                🤖
              </div>
              <div className="bg-white text-gray-900 rounded-xl px-4 py-2 max-w-[75%] shadow bot-message">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-end gap-2 justify-end">
              <div className="bg-emerald-100 text-gray-800 rounded-xl px-4 py-2 max-w-[75%] shadow self-end user-message">
                {msg.text}
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                <span role="img" aria-label="User">👤</span>
              </div>
            </div>
          )
        )}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center text-lg shadow">
              🤖
            </div>
            <div className="bg-white text-gray-400 rounded-xl px-4 py-2 max-w-[75%] shadow">
              <span className="animate-pulse">CarpoolBot is typing…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-3 bg-white border-t rounded-b-2xl">
        <input
          className="flex-grow rounded-full border px-3 py-2 mr-2 bg-gray-50 focus:outline-emerald-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && sendQuestion()}
          disabled={loading}
          maxLength={400}
          placeholder="Type your question…"
        />
        <button
          onClick={sendQuestion}
          disabled={loading || !input.trim()}
          className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-800 text-white text-xl shadow"
          aria-label="Send message"
        >
          📨
        </button>
      </div>
    </div>
  );
}

export default ChatBotModal;
