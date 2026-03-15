import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Clock,
  Search,
  Fingerprint,
} from "lucide-react";
import { Helmet } from "react-helmet";

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

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setOrder(res.data.data);
        socket.emit("joinOrderRoom", id);
      } else setError("Order not found!");
    } catch (err) {
      console.error(err);
      setError("Could not fetch order. Please check your Order ID.");
    } finally {
      setLoading(false);
    }
  };

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

  const getCurrentStageIndex = (status) =>
    ORDER_STAGES.findIndex(
      (stage) => stage.key.toLowerCase() === status?.toLowerCase(),
    );

  const currentIndex = getCurrentStageIndex(order?.orderStatus || "Pending");

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return {
      date: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-pink-50 flex justify-center items-start md:items-center px-4 py-10 md:py-20">
      <Helmet>
        <title>Track Order - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl backdrop-blur-xl bg-white/70 shadow-[0_8px_40px_rgba(229,115,115,0.15)] rounded-3xl border border-white/30 p-6 md:p-10"
      >
        <div className="text-center mb-10 md:mb-16 space-y-4 md:space-y-5 px-4">
  {/* --- 1. THE BRAND MARKER --- */}
  <div className="flex items-center justify-center gap-2 md:gap-3">
    <div className="h-[1px] w-6 md:w-8 bg-[#B23A2E] opacity-30" />
    
    {/* Added a pulse dot for 'Live' effect */}
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B23A2E] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B23A2E]"></span>
    </span>

    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#B23A2E] whitespace-nowrap">
      Live Monitoring
    </span>
    <div className="h-[1px] w-6 md:w-8 bg-[#B23A2E] opacity-30" />
  </div>

  {/* --- 2. MAIN HEADLINE --- */}
  {/* Using text-3xl for mobile to ensure 'Surveillance' doesn't break poorly */}
  <h2 className="text-3xl md:text-6xl font-black text-stone-900 uppercase tracking-tighter leading-[0.9] md:leading-none">
    Transit <br className="md:hidden" /> 
    <span className="text-stone-800">Surveillance</span>
  </h2>

  {/* --- 3. REFINED DESCRIPTION --- */}
  <p className="text-stone-500 font-serif italic text-sm md:text-lg max-w-sm md:max-w-xl mx-auto leading-relaxed px-2">
    "Trace the precise movements of your Himalayan harvest as it
    descends from the valleys to your doorstep."
  </p>

  {/* --- 4. SUBTLE VISUAL ANCHOR --- */}
  <div className="pt-2 md:pt-4 flex justify-center">
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-1.5 bg-stone-900 rounded-full" />
      <div className="h-[1px] w-12 md:w-16 bg-stone-200" />
      <div className="h-1 w-1 bg-stone-200 rounded-full" />
    </div>
  </div>
</div>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12 max-w-2xl mx-auto">
          <div className="relative flex-1 group">
            {/* Minimalist Icon Replacement for Emojis */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#B23A2E] transition-colors">
              <Fingerprint size={18} strokeWidth={1.5} />
            </div>

            <input
              type="text"
              placeholder="Reference ID (e.g. #65c2...)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="
        w-full
        bg-stone-50 border border-stone-200 
        pl-12 pr-4 py-4 
        rounded-2xl 
        text-stone-900 font-medium tracking-tight
        placeholder-stone-300
        focus:bg-white focus:ring-4 focus:ring-stone-100 focus:border-stone-400 
        outline-none 
        shadow-sm transition-all duration-300
      "
            />
          </div>

          <button
            onClick={() => fetchOrder(orderId)}
            disabled={!orderId || loading}
            className="
      bg-stone-900 hover:bg-[#B23A2E] 
      text-white 
      px-10 py-4 
      rounded-2xl 
      shadow-xl hover:shadow-[#B23A2E]/20
      transition-all duration-500 
      disabled:opacity-30 disabled:grayscale
      flex justify-center items-center gap-3
      group
    "
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  Locate
                </span>
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center mb-4 bg-red-50 py-2 rounded-lg border border-red-100"
          >
            {error}
          </motion.p>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* SUMMARY CARD: THE SHIPPING LABEL */}
            <div className="bg-stone-50 border border-stone-200 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-stone-100 flex items-center justify-center rounded-bl-[2rem] border-l border-b border-stone-200">
                <Package size={20} className="text-stone-400" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                    Logistics Ref.
                  </p>
                  <p className="font-mono text-sm font-bold text-stone-900 bg-white inline-block px-3 py-1 rounded-lg border border-stone-100">
                    {order._id}
                  </p>
                </div>

                <div className="space-y-1 md:text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                    Current Status
                  </p>
                  <p className="text-[#B23A2E] font-black uppercase tracking-widest text-sm">
                    {order.orderStatus || "Processing Archive"}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                    Dispatch Date
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                    Market Value
                  </p>
                  <p className="text-sm font-bold text-stone-800">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* THE TIMELINE STEPPER */}
            <div className="relative pt-4 px-4">
              {/* Background Track */}
              <div className="absolute top-[24px] left-[5%] w-[90%] h-[1px] bg-stone-200 -z-10" />

              {/* Progress Track */}
              <motion.div
                className="absolute top-[24px] left-[5%] h-[1px] bg-stone-900 -z-10"
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentIndex / (ORDER_STAGES.length - 1)) * 90}%`,
                }}
                transition={{ duration: 1, ease: "circOut" }}
              />

              <div className="flex justify-between items-start relative z-10">
                {ORDER_STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const completed = index <= currentIndex;
                  const active = index === currentIndex;
                  const historyItem = order.statusHistory?.find(
                    (s) => s.status.toLowerCase() === stage.key.toLowerCase(),
                  );

                  return (
                    <div
                      key={stage.key}
                      className="flex flex-col items-center w-1/5 group"
                    >
                      <motion.div
                        className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-700 ${
                          completed
                            ? "bg-stone-900 border-stone-900 text-white shadow-xl"
                            : "bg-white border-stone-200 text-stone-300"
                        } ${active ? "ring-8 ring-stone-900/5 scale-110" : ""}`}
                      >
                        {completed ? (
                          <Check size={18} strokeWidth={3} />
                        ) : (
                          <Icon size={18} strokeWidth={1.5} />
                        )}
                      </motion.div>

                      <div className="mt-4 text-center">
                        <p
                          className={`text-[9px] font-black uppercase tracking-widest ${completed ? "text-stone-900" : "text-stone-300"}`}
                        >
                          {stage.label}
                        </p>

                        {historyItem && (
                          <div className="mt-2 text-[8px] font-bold text-stone-400 uppercase tracking-tight leading-none">
                            <p>
                              {new Date(
                                historyItem.updatedAt,
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </p>
                            <p className="mt-1 opacity-60 font-medium">
                              {new Date(
                                historyItem.updatedAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FINAL MESSAGE BANNER */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-12 py-5 px-8 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-center border ${
                order.orderStatus === "delivered"
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-stone-50 text-stone-600 border-stone-200"
              }`}
            >
              {order.orderStatus === "delivered"
                ? "✓ Consignment Successfully Delivered"
                : "◌ Transit in Progress — Anticipate Arrival"}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
