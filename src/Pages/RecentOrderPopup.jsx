import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ArrowUpRight } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { getRecentOrders } from "@/store/slices/orderSlice";

const RecentOrderToast = () => {
  const dispatch = useDispatch();
  const { recentOrders = [] } = useSelector((state) => state.orders || {});
  const [visibleOrder, setVisibleOrder] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    dispatch(getRecentOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!recentOrders.length) return;
    let index = 0;

    const cycleOrders = () => {
      setVisibleOrder(recentOrders[index]);
      
      // Auto-hide after 6 seconds
      timerRef.current = setTimeout(() => {
        setVisibleOrder(null);
      }, 6000);

      // Show next after 20 seconds
      const nextTimer = setTimeout(() => {
        index = (index + 1) % recentOrders.length;
        cycleOrders();
      }, 20000);

      return () => {
        clearTimeout(timerRef.current);
        clearTimeout(nextTimer);
      };
    };

    const cleanup = cycleOrders();
    return cleanup;
  }, [recentOrders]);

  if (!visibleOrder) return null;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { d: 86400, h: 3600, m: 60 };
    for (let [unit, sec] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / sec);
      if (interval >= 1) return `${interval}${unit} ago`;
    }
    return "Just now";
  };

  return (
    <AnimatePresence mode="wait">
      {visibleOrder && (
        <motion.div
          key={visibleOrder._id}
          initial={{ opacity: 0, x: -20, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(10px)", transition: { duration: 0.3 } }}
          className="fixed bottom-6 left-6 z-[100] w-[22rem] bg-[#0A0A0A] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Subtle Scanning Line Animation */}
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 200 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F08C7D]/20 to-transparent z-0 pointer-events-none"
          />

          <div className="relative z-10 p-5">
            <div className="flex items-start gap-5">
              
              {/* Image Container with Custom Border */}
              <div className="relative shrink-0">
                <div className="absolute -inset-1 border border-[#F08C7D]/20 animate-pulse" />
                <img
                  src={visibleOrder.productImage || "/placeholder.png"}
                  alt={visibleOrder.productName}
                  className="w-16 h-16 object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700 relative z-10"
                />
              </div>

              {/* Content Block */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#F08C7D]">
                    Dispatch Info
                  </span>
                  <button
                    onClick={() => setVisibleOrder(null)}
                    className="text-stone-700 hover:text-white transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="overflow-hidden">
                  <motion.p 
                    className="text-white text-sm font-black uppercase tracking-tight whitespace-nowrap"
                    initial={{ x: 0 }}
                    animate={visibleOrder.productName.length > 20 ? { x: [0, -100, 0] } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    {visibleOrder.productName}
                  </motion.p>
                </div>

                <p className="text-stone-500 text-[10px] font-serif italic mt-1 flex items-center gap-1">
                  Origin: <span className="text-stone-300 not-italic uppercase font-black tracking-widest text-[9px]">{visibleOrder.city}</span>
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#F08C7D] shadow-[0_0_5px_#F08C7D]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-600">
                      {timeAgo(visibleOrder.timeAgo || visibleOrder.createdAt)}
                    </span>
                  </div>
                  {/* Ensure you import Link from 'next/link' or 'react-router-dom' */}
<Link href={`/product/${visibleOrder.slug || visibleOrder._id}`}>
  <motion.div 
    whileHover={{ x: 2, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-1 text-[#F08C7D] text-[8px] font-black uppercase tracking-widest cursor-pointer group/view"
  >
    <span className="group-hover/view:underline decoration-[#F08C7D]/40 underline-offset-4">
      View Archive
    </span> 
    <ArrowUpRight size={10} className="transition-transform group-hover/view:translate-x-0.5" />
  </motion.div>
</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Countdown Bar */}
          <div className="h-[1px] w-full bg-white/5 relative">
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-y-0 left-0 bg-[#F08C7D]/60"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentOrderToast;