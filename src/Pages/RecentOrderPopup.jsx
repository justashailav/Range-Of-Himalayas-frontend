import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ShoppingBag } from "lucide-react"; // Added ShoppingBag for a refined icon
import { motion, AnimatePresence } from "framer-motion";
import { getRecentOrders } from "@/store/slices/orderSlice";

const RecentOrderToast = () => {
  const dispatch = useDispatch();
  const { recentOrders = [] } = useSelector((state) => state.orders || {});
  const [visibleOrder, setVisibleOrder] = useState(null);

  useEffect(() => {
    dispatch(getRecentOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!recentOrders.length) return;
    let index = 0;

    const cycleOrders = () => {
      setVisibleOrder(recentOrders[index]);
      const hideTimer = setTimeout(() => setVisibleOrder(null), 6000); // Slightly longer view time
      const nextTimer = setTimeout(() => {
        index = (index + 1) % recentOrders.length;
        cycleOrders();
      }, 20000); // 20s interval

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(nextTimer);
      };
    };

    const cleanup = cycleOrders();
    return cleanup;
  }, [recentOrders]);

  if (!visibleOrder) return null;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <AnimatePresence>
      {visibleOrder && (
        <motion.div
          key={visibleOrder._id}
          initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed bottom-6 left-6 z-[100] w-[20rem] bg-[#111111] border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Top accent line */}
          <div className="h-[2px] w-full bg-[#F08C7D]/40 absolute top-0 left-0" />

          <div className="p-4 flex items-center gap-4 relative">
            {/* Image Section */}
            <div className="relative shrink-0">
              <img
                src={visibleOrder.productImage || "/placeholder.png"}
                alt={visibleOrder.productName}
                className="w-16 h-16 object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -top-1 -left-1 bg-[#F08C7D] p-1">
                <ShoppingBag size={10} className="text-white" />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F08C7D]">
                  Live Dispatch
                </span>
                <button
                  onClick={() => setVisibleOrder(null)}
                  className="text-stone-600 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-white text-[13px] font-bold tracking-tight truncate mt-1">
                {visibleOrder.productName}
              </p>

              <p className="text-stone-400 text-[11px] font-serif italic mt-0.5">
                Verified purchase in {visibleOrder.city}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">
                  {timeAgo(visibleOrder.timeAgo || visibleOrder.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Progress bar for the 6s hide timer */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-[1px] bg-white/10 w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentOrderToast;