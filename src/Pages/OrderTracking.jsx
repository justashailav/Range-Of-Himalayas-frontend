import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Home,
  Clock,
  Check,
  Search,
  Info,
} from "lucide-react";
import { Helmet } from "react-helmet";

import { useDispatch, useSelector } from "react-redux";
import { getTrackingByOrderId } from "@/store/slices/orderSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/order`;

const ORDER_STAGES = [
  { key: "Confirmed", label: "Order Placed", icon: Clock },
  { key: "Packed", label: "Packed", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

// ===============================
// ✅ NORMALIZE STATUS
// ===============================
const normalizeStatus = (status) => {
  if (!status) return "Confirmed";

  status = status.toLowerCase();

  if (status === "confirmed") return "Confirmed";
  if (status === "packed") return "Packed";
  if (status === "shipped") return "Shipped";
  if (status === "out_for_delivery") return "Out for Delivery";
  if (status === "delivered") return "Delivered";

  return "Confirmed";
};

// ===============================
// ✅ ICC STATUS MAP
// ===============================
const mapICCStatus = (status) => {
  if (!status) return "Shipped";

  status = status.toLowerCase();

  if (status.includes("delivered")) return "Delivered";
  if (status.includes("out")) return "Out for Delivery";
  if (status.includes("transit") || status.includes("shipped"))
    return "Shipped";

  return "Shipped";
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socketInstance, setSocketInstance] = useState(null);

  const dispatch = useDispatch();
  const { tracking } = useSelector((state) => state.orders);

  // ===============================
  // 🔌 SOCKET INIT
  // ===============================
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });
    setSocketInstance(socket);
    return () => socket.disconnect();
  }, []);

  // ===============================
  // 🚀 FETCH ORDER
  // ===============================
  const fetchOrder = async (id) => {
    if (!id.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/${id}`, {
        withCredentials: true,
      });

      console.log("ORDER API:", res.data.data);

      if (res.data.success && res.data.data) {
        const orderData = res.data.data;

        setOrder(orderData);
        socketInstance?.emit("joinOrderRoom", id);

        // 🔥 always fetch tracking
        dispatch(getTrackingByOrderId(id));
      } else {
        setError("Order not found!");
      }
    } catch (err) {
      console.error(err);
      setError("Could not fetch order.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔁 SOCKET UPDATE
  // ===============================
  useEffect(() => {
    if (!socketInstance) return;

    socketInstance.on("orderStatusUpdated", (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: data.status?.toLowerCase(),
                statusHistory: [
                  ...(prev.statusHistory || []),
                  {
                    status: data.status?.toLowerCase(),
                    updatedAt: data.updatedAt,
                  },
                ],
              }
            : prev,
        );

        dispatch(getTrackingByOrderId(orderId));
      }
    });

    return () => socketInstance.off("orderStatusUpdated");
  }, [socketInstance, orderId]);
  useEffect(() => {
    if (!orderId || normalizeStatus(order?.orderStatus) !== "Shipped") return;

    const interval = setInterval(() => {
      dispatch(getTrackingByOrderId(orderId));
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, order?.orderStatus]);

  // ===============================
  // 🔥 FINAL STATUS LOGIC
  // ===============================
  const trackingData = tracking?.data;

  let displayStatus = "Confirmed";

  // 🔥 always use latest history
  if (order?.statusHistory?.length > 0) {
    const latest =
      order.statusHistory[order.statusHistory.length - 1];
    displayStatus = normalizeStatus(latest.status);
  } else {
    displayStatus = normalizeStatus(order?.orderStatus);
  }

  // 🔥 ICC override
  if (
    normalizeStatus(order?.orderStatus) === "Shipped" &&
    trackingData?.awb &&
    trackingData?.status
  ) {
    displayStatus = mapICCStatus(trackingData.status);
  }

  const getCurrentStageIndex = (status) =>
    ORDER_STAGES.findIndex(
      (stage) => stage.key.toLowerCase() === status.toLowerCase(),
    );

  const currentIndex = getCurrentStageIndex(displayStatus);

  const trackingEvents =
    trackingData?.activities || order?.statusHistory || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100 via-slate-50 to-teal-50 flex justify-center items-start md:items-center px-4 py-10">
    <Helmet>
    <title>Track Your Journey | Range of Himalayas</title>
    <meta name="description" content="Track your Himalayan treasures in real-time. Enter your Order ID to see your shipment progress." />
    <meta name="theme-color" content="#fff1f2" /> {/* Matches the rose-100 gradient */}
    
    {/* Optional: Social Media Tags */}
    <meta property="og:title" content="Track Order - Range of Himalayas" />
    <meta property="og:type" content="website" />
  </Helmet>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl backdrop-blur-2xl bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 rounded-[2.5rem] overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-8 pb-0 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Track Your Journey
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your Order ID to see the status of your Himalayan treasures.</p>
        </div>

        {/* INPUT SECTION */}
        <div className="p-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="e.g. #ROH-12345"
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-black hover:bg-gray-800 text-white px-6 rounded-xl font-medium transition-all active:scale-95">
              Track
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-8 pb-10">
          {/* PROGRESS STEPPER */}
          <div className="relative flex justify-between mb-12">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 -z-10" />
            
            {ORDER_STAGES.map((stage, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={stage.key} className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted ? "#000" : "#fff",
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                      isCompleted ? "border-black" : "border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} className="text-white" />
                    ) : (
                      <stage.icon size={18} className="text-gray-400" />
                    )}
                  </motion.div>
                  <span className={`text-[10px] uppercase tracking-widest mt-3 font-bold ${
                    isCompleted ? "text-black" : "text-gray-400"
                  }`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* STATUS CARD */}
          <div className="bg-black/5 rounded-3xl p-6 mb-8 border border-black/[0.03]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{displayStatus}</h2>
                {trackingData?.awb && (
                  <code className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border mt-2 inline-block">
                    AWB: {trackingData.awb}
                  </code>
                )}
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <Package className="text-black" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Info size={14} />
              <p>Estimated delivery: <span className="font-semibold text-black">Oct 24, 2023</span></p>
            </div>
          </div>

          {/* HISTORY LIST */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 px-1">Tracking History</h3>
            <div className="max-height-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {trackingEvents.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{event.status}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                      {new Date(event.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium tracking-[0.2em] uppercase">
            Range of Himalayas &copy; 2024
          </p>
        </div>
      </motion.div>
    </div>
  );
}