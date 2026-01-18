import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/store/slices/chatSlice";
export default function Chatbot() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [input, setInput] = useState("");
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
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-xl flex flex-col">
      <div className="bg-green-700 text-white p-3 rounded-t-xl">
        Range Of Himalayas 🌿
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-gray-100 px-3 py-2 rounded-lg">
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400">Typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-lg px-2"
          placeholder="Ask about products..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-green-700 text-white px-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
