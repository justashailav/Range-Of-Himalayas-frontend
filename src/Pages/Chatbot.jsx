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

  // Auto-scroll to bottom on new messages
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
      {/* 1. Floating Action Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#B23A2E] rounded-full shadow-2xl z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in zoom-in duration-300"
        >
          <MessageCircle className="text-white w-6 h-6 md:w-7 md:h-7" />
        </button>
      )}

      {/* 2. Chat Window Container */}
      {open && (
        <>
          {/* Mobile Backdrop Overlay (Optional: dims background when chat is open) */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[55] md:hidden" onClick={() => setOpen(false)} />

          <div 
            className={`
              fixed z-[60] flex flex-col bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 border border-stone-100
              /* Mobile: Adjust 'top-[64px]' to match your actual Navbar height */
              inset-x-0 bottom-0 top-[64px] 
              /* Desktop: Standard floating dimensions */
              md:top-auto md:inset-auto md:bottom-28 md:right-8 md:w-[400px] md:h-[600px] md:rounded-3xl 
              animate-in fade-in slide-in-from-bottom-10
            `}
          >
            
            {/* Header: Cinematic & Responsive (Removed mt-8) */}
            <div className="bg-stone-900 px-6 py-5 md:py-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xl">
                    🏔️
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-stone-900 animate-pulse" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-stone-500 mb-0.5">
                    Live Concierge
                  </p>
                  <h3 className="text-sm font-black tracking-tight uppercase">
                    Range of Himalayas
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6 md:hidden text-stone-400" />
                <X className="w-5 h-5 hidden md:block" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto no-scrollbar space-y-6 bg-[#FCFAF7]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 px-6">
                  <MessageSquare className="w-10 h-10 mb-4 text-stone-300 stroke-[1px]" />
                  <p className="text-xs font-serif italic text-stone-600 leading-relaxed">
                    Namaste. How may we assist your exploration of the Himalayas today?
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] px-5 py-3.5 text-[13px] md:text-sm leading-relaxed shadow-sm transition-all ${
                      msg.role === "user"
                        ? "bg-stone-900 text-white rounded-2xl rounded-tr-none"
                        : "bg-white text-stone-800 rounded-2xl rounded-tl-none border border-stone-200/40"
                    }`}
                  >
                    {msg.text}

                    {msg.role === "assistant" && msg.text.toLowerCase().includes("whatsapp") && (
                      <button
                        onClick={() => navigate("/whatsapp-support")}
                        className="mt-4 w-full bg-[#25D366] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                      >
                        📲 Connect on WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-100 px-4 py-3 rounded-2xl flex gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-[#B23A2E] rounded-full animate-bounce [animation-duration:0.8s]" />
                    <div className="w-1.5 h-1.5 bg-[#B23A2E] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[#B23A2E] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area: Sticky & Modern */}
            <div className="p-4 md:p-5 bg-white border-t border-stone-100 pb-[env(safe-area-inset-bottom,16px)]">
              <div className="relative flex items-center bg-stone-50 rounded-2xl px-4 py-1.5 border border-stone-200/60 focus-within:bg-white focus-within:border-stone-900/20 focus-within:shadow-inner transition-all duration-300">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none placeholder:text-stone-400 font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 text-[#B23A2E] hover:scale-110 disabled:opacity-20 disabled:grayscale transition-all"
                >
                  <Send className="w-5 h-5 fill-current" />
                </button>
              </div>
              <p className="text-[8px] text-center text-stone-300 uppercase tracking-widest mt-3 font-bold">
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