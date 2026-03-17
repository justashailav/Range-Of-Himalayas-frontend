import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../store/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, MessageSquare, ChevronDown, Sparkles, Map, Package } from "lucide-react";

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

  const handleSend = (text = input) => {
    const finalMsg = typeof text === "string" ? text : input;
    if (!finalMsg.trim()) return;
    dispatch(sendChatMessage(finalMsg));
    setInput("");
  };

  const quickActions = [
    { label: "Track Order", icon: <Package className="w-3 h-3" />, query: "Where is my order?" },
    { label: "Our Heritage", icon: <Map className="w-3 h-3" />, query: "Tell me about Range of Himalayas" },
    { label: "Latest Harvest", icon: <Sparkles className="w-3 h-3" />, query: "What are your seasonal products?" },
  ];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#B23A2E] text-white rounded-full shadow-[0_10px_30px_rgba(178,58,46,0.4)] z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] md:inset-auto md:bottom-28 md:right-8 md:w-[420px] md:h-[650px] flex flex-col bg-white md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-500 border border-stone-100">
          
          {/* Cinematic Header */}
          <div className="bg-stone-900 px-6 py-6 text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle,white_0%,transparent_70%)] opacity-20" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                  🏔️
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-[0.1em] uppercase">Himalayan Concierge</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Now</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronDown className="w-5 h-5 md:hidden" />
                <X className="w-5 h-5 hidden md:block" />
              </button>
            </div>
          </div>

          {/* Messages & Quick Actions */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto no-scrollbar space-y-6 bg-[#FCFAF7]">
            {messages.length === 0 && (
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 px-6">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 border border-stone-100">
                    <MessageSquare className="w-6 h-6 text-stone-300" />
                  </div>
                  <h4 className="text-stone-900 font-black text-[11px] uppercase tracking-widest mb-2">Welcome Home</h4>
                  <p className="text-xs font-serif italic text-stone-500 leading-relaxed max-w-[200px]">
                    Your gateway to the purest Himalayan harvest. How can I guide you?
                  </p>
                </div>
                
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 gap-2 mt-auto">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(action.query)}
                      className="flex items-center gap-3 bg-white border border-stone-200/50 p-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-stone-600 hover:border-[#B23A2E] hover:text-[#B23A2E] transition-all group active:scale-[0.98]"
                    >
                      <span className="p-1.5 bg-stone-50 rounded-lg group-hover:bg-[#B23A2E]/5 transition-colors">
                        {action.icon}
                      </span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-3.5 text-[13px] leading-relaxed transition-all shadow-sm ${
                  msg.role === "user" 
                  ? "bg-stone-900 text-white rounded-[1.5rem] rounded-tr-none" 
                  : "bg-white text-stone-800 rounded-[1.5rem] rounded-tl-none border border-stone-200/40"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 px-5 py-3 rounded-2xl flex gap-2">
                  <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce [animation-duration:0.6s]" />
                  <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Modern Input Dock */}
          <div className="p-6 bg-white border-t border-stone-100 pb-[env(safe-area-inset-bottom,24px)]">
            <div className="relative flex items-center bg-stone-100/50 rounded-3xl px-5 py-2 group focus-within:bg-white focus-within:ring-4 focus-within:ring-stone-100/50 transition-all border border-transparent focus-within:border-stone-200">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about apples, honey, or heritage..."
                className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none placeholder:text-stone-400 font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="ml-2 w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
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