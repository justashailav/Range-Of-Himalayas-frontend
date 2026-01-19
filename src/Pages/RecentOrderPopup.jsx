import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentOrders } from "@/store/slices/orderSlice";

const RecentOrderToast = () => {
  const dispatch = useDispatch();
  const { recentOrders = [] } = useSelector((state) => state.orders || {});
  console.log(recentOrders)
  const [visibleOrder, setVisibleOrder] = useState(null);

  useEffect(() => {
    dispatch(getRecentOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!recentOrders.length) return;
    let index = 0;

    const cycleOrders = () => {
      setVisibleOrder(recentOrders[index]);
      const hideTimer = setTimeout(() => setVisibleOrder(null), 5000);
      const nextTimer = setTimeout(() => {
        index = (index + 1) % recentOrders.length;
        cycleOrders();
      }, 25000);

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
  const weeks = Math.floor(seconds / 604800);

  if (weeks > 0)
    return `About ${weeks} week${weeks > 1 ? "s" : ""} ago`;

  if (days > 0)
    return `About ${days} day${days > 1 ? "s" : ""} ago`;

  if (hours > 0)
    return `About ${hours} hour${hours > 1 ? "s" : ""} ago`;

  if (minutes > 0)
    return `About ${minutes} min${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
};


  return (
    <AnimatePresence>
      {visibleOrder && (
        <motion.div
          key={visibleOrder._id}
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 12 },
          }}
          exit={{
            opacity: 0,
            y: 50,
            scale: 0.9,
            transition: { duration: 0.4, ease: "easeInOut" },
          }}
          className="fixed bottom-8 left-8 z-50 max-w-sm w-[22rem] 
                     bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl 
                     border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] 
                     rounded-2xl p-4 flex items-center gap-4 overflow-hidden 
                     hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] 
                     transition-all duration-500 ease-out"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/40 to-transparent pointer-events-none"></div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.25 }}
            onClick={() => setVisibleOrder(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 z-20"
          >
            <X size={18} />
          </motion.button>
          <motion.img
            src={visibleOrder.productImage || "/placeholder.png"}
            alt={visibleOrder.productName}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-md relative z-10"
          />
          <div className="flex-1 relative z-10">
            <p className="text-gray-700 text-sm">
              Someone in{" "}
              <span className="font-semibold text-gray-900">
                {visibleOrder.city}
              </span>{" "}
              purchased
            </p>
            <p className="font-semibold text-gray-900 text-base mt-1 leading-tight">
              {visibleOrder.productName}
            </p>
            {visibleOrder.quantity && (
              <p className="text-sm text-gray-600 mt-1">
                Quantity: <span className="font-medium">{visibleOrder.quantity}</span>
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              {timeAgo(visibleOrder.timeAgo)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentOrderToast;
