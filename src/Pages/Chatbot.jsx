import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../store/slices/chatSlice";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(sendChatMessage(input));
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-700 text-white w-14 h-14 rounded-full shadow-lg text-2xl z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white rounded-xl shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-green-700 text-white p-3 rounded-t-xl font-semibold">
            Range Of Himalayas 🌿
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-green-100 text-black"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {msg.text}

                  {/* WhatsApp Routed Button */}
                  {msg.role === "assistant" &&
                    msg.text.toLowerCase().includes("whatsapp") && (
                      <div className="mt-2">
                        <button
                          onClick={() => navigate("/whatsapp-support")}
                          className="bg-green-600 text-white px-3 py-2 rounded-md text-xs hover:bg-green-700"
                        >
                          📲 Chat on WhatsApp
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-gray-400">Typing…</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about our products…"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-green-700 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
