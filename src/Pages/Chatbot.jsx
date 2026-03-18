import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../store/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, MessageSquare, ChevronDown } from "lucide-react";

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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-[#B23A2E] rounded-full shadow-2xl z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <MessageCircle className="text-white w-6 h-6 md:w-7 md:h-7" />
        </button>
      )}

      {open && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[55] md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Chat Container */}
          <div
            className="
              fixed z-[60] flex flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]
              overflow-hidden transition-all duration-500 border border-stone-100

              /* ✅ FIXED HERE */
              inset-x-0 bottom-0 top-[var(--navbar-height)]

              /* Desktop */
              md:top-auto md:inset-auto md:bottom-28 md:right-10
              md:w-[380px] md:h-[600px] md:rounded-3xl
            "
          >
            {/* Header */}
            <div className="bg-stone-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                    🏔️
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-stone-900 animate-pulse" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-stone-500">
                    Live Concierge
                  </p>
                  <h3 className="text-sm font-black uppercase">
                    Range of Himalayas
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <ChevronDown className="w-6 h-6 md:hidden text-stone-400" />
                <X className="w-5 h-5 hidden md:block" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#FCFAF7]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <MessageSquare className="w-10 h-10 mb-4 text-stone-300" />
                  <p className="text-xs italic text-stone-600">
                    Namaste. How may we assist you?
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] px-5 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-stone-900 text-white rounded-2xl"
                        : "bg-white border rounded-2xl"
                    }`}
                  >
                    {msg.text}

                    {msg.role === "assistant" &&
                      msg.text.toLowerCase().includes("whatsapp") && (
                        <button
                          onClick={() => navigate("/whatsapp-support")}
                          className="mt-3 w-full bg-[#25D366] text-white py-2 rounded-lg text-xs"
                        >
                          Connect on WhatsApp
                        </button>
                      )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl flex gap-1">
                    <div className="w-2 h-2 bg-[#B23A2E] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#B23A2E] rounded-full animate-bounce delay-200" />
                    <div className="w-2 h-2 bg-[#B23A2E] rounded-full animate-bounce delay-400" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center bg-stone-50 rounded-xl px-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent py-3 outline-none text-sm"
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 text-[#B23A2E]"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[8px] text-center text-stone-300 mt-2 uppercase">
                Powered by Range of Himalayas
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chatbot;