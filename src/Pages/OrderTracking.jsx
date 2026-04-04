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
} from "lucide-react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Package, Truck, Home, Search, Loader2 } from "lucide-react";

// 🔥 REDUX
import { useDispatch, useSelector } from "react-redux";
import { getTrackingByOrderId } from "@/store/slices/orderSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/order`;

const socket = io(SOCKET_URL, { withCredentials: true });

const ORDER_STAGES = [
  { key: "Confirmed", label: "Order Placed", icon: Clock },
  { key: "Packed", label: "Packed", icon: Package },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

// 🔥 STATUS MAPPING
const mapICCStatus = (status) => {
  if (!status) return "Confirmed";

  status = status.toLowerCase();

  if (status.includes("delivered")) return "Delivered";
  if (status.includes("out")) return "Out for Delivery";
  if (status.includes("transit") || status.includes("shipped"))
    return "Shipped";
  if (status.includes("pack")) return "Packed";

  return "Confirmed";
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { tracking } = useSelector((state) => state.orders);

  // ===============================
  // 🚀 FETCH ORDER + TRACKING
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

      if (res.data.success && res.data.data) {
        const orderData = res.data.data;

        setOrder(orderData);
        socket.emit("joinOrderRoom", id);

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
  // 🔁 SOCKET LIVE UPDATE
  // ===============================
  useEffect(() => {
    socket.on("orderStatusUpdated", (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: data.status,
                statusHistory: [
                  ...(prev.statusHistory || []),
                  { status: data.status, updatedAt: data.updatedAt },
                ],
              }
            : prev,
        );
      }
    });

    return () => socket.off("orderStatusUpdated");
  }, [orderId]);

  // ===============================
  // 🔁 AUTO REFRESH TRACKING
  // ===============================
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      dispatch(getTrackingByOrderId(orderId));
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // ===============================
  // 🔥 TRACKING LOGIC
  // ===============================
  const trackingData = tracking?.data;

  const displayStatus =
    order?.orderStatus !== "shipped"
      ? order?.orderStatus
      : trackingData?.status || order?.orderStatus;

  const mappedStatus = mapICCStatus(displayStatus);

  const getCurrentStageIndex = (status) =>
    ORDER_STAGES.findIndex(
      (stage) => stage.key.toLowerCase() === status?.toLowerCase(),
    );

  const currentIndex = getCurrentStageIndex(mappedStatus || "Confirmed");

  const trackingEvents =
    trackingData?.activities || order?.statusHistory || [];

  return (
    <div className="min-h-screen bg-[#FDFCFB] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-50 via-orange-50/20 to-slate-50 flex justify-center items-start md:items-center px-4 py-10">
    <Helmet>
      <title>Track Order | Range Of Himalayas</title>
    </Helmet>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl backdrop-blur-2xl bg-white/80 border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12"
    >
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-2">Track Your Journey</h1>
        <p className="text-slate-500 text-sm italic">Bringing the Himalayas to your doorstep</p>
      </div>

      {/* INPUT SECTION */}
      <div className="relative flex items-center gap-3 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ROH-1234)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 transition-all text-slate-800 placeholder:text-slate-300"
          />
        </div>

        <button
          onClick={() => fetchOrder(orderId)}
          disabled={loading}
          className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Track"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center mb-6 text-sm bg-red-50 py-2 rounded-lg">
            {error}
          </motion.p>
        )}

        {order && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
            {/* STATUS BADGE & AWB */}
            <div className="flex flex-col items-center text-center">
              <span className="px-4 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest mb-3">
                {displayStatus || "Processing"}
              </span>
              {trackingData?.awb && (
                <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                  TRACKING ID: {trackingData.awb}
                </p>
              )}
            </div>

            {/* MODERN TIMELINE */}
            <div className="relative flex justify-between items-start px-2">
              {/* Background Line */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0" />
              <div 
                className="absolute top-5 left-0 h-[2px] bg-black transition-all duration-1000 -z-0" 
                style={{ width: `${(currentIndex / (ORDER_STAGES.length - 1)) * 100}%` }}
              />

              {ORDER_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={stage.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 shadow-sm ${
                        isCompleted ? "bg-black text-white" : "bg-white border border-slate-100 text-slate-300"
                      } ${isCurrent ? "ring-4 ring-rose-100 scale-110" : ""}`}
                    >
                      {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <p className={`text-[10px] md:text-xs mt-4 font-medium tracking-tight ${isCompleted ? "text-black" : "text-slate-400"}`}>
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* PRE-SHIPPED INFO */}
            {order?.orderStatus !== "shipped" && (
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3">
                <Package className="text-orange-500" size={18} />
                <p className="text-orange-800 text-sm">
                  Handcrafting your order. It will be dispatched from our Himalayan facility shortly.
                </p>
              </div>
            )}

            {/* TRACKING HISTORY LIST */}
            {trackingEvents.length > 0 && (
              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Journey Updates</h3>
                <div className="space-y-4">
                  {trackingEvents.map((event, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 group-first:bg-rose-500 group-first:ring-4 group-first:ring-rose-100" />
                        <div className="w-[1px] h-full bg-slate-100 group-last:hidden" />
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-slate-800">
                          {event.status || event.statusText}
                        </p>
                        {event.location && <p className="text-xs text-slate-500 italic">{event.location}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(event.updatedAt || event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </div>
  );
}
