import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../store/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, MessageSquare } from "lucide-react";

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
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl z-50 flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
          open ? "bg-stone-900 rotate-90" : "bg-[#B23A2E]"
        }`}
      >
        {open ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <MessageCircle className="text-white w-7 h-7" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500 border border-stone-100">
          
          {/* Header: Cinematic Style */}
          <div className="bg-stone-900 p-6 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                Assistant
              </p>
              <h3 className="text-lg font-black tracking-tight uppercase leading-none">
                Himalayan Concierge
              </h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6 bg-[#FCFAF7]">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-stone-400" />
                <p className="text-xs font-serif italic text-stone-500">How can we assist your journey today?</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed transition-all ${
                    msg.role === "user"
                      ? "bg-stone-900 text-white rounded-2xl rounded-tr-none shadow-md"
                      : "bg-white text-stone-800 rounded-2xl rounded-tl-none border border-stone-200/50 shadow-sm"
                  }`}
                >
                  {msg.text}

                  {/* Enhanced WhatsApp Button */}
                  {msg.role === "assistant" &&
                    msg.text.toLowerCase().includes("whatsapp") && (
                      <button
                        onClick={() => navigate("/whatsapp-support")}
                        className="mt-4 w-full bg-[#25D366] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        📲 Direct WhatsApp
                      </button>
                    )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area: Minimalist & Floating */}
          <div className="p-4 bg-white border-t border-stone-100">
            <div className="relative flex items-center bg-stone-50 rounded-2xl px-4 py-1 border border-stone-200/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-stone-100 transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message concierge..."
                className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none placeholder:text-stone-400 font-medium"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 text-stone-400 hover:text-stone-900 disabled:opacity-20 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;