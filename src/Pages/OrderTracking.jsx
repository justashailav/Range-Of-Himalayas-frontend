import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Home, Clock, Search } from "lucide-react";
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
      const res = await axios.get(`${API_BASE_URL}/${id}`, { withCredentials: true });
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
            : prev
        );
      }
    });
    return () => socket.off("orderStatusUpdated");
  }, [orderId]);

  const getCurrentStageIndex = (status) =>
    ORDER_STAGES.findIndex((stage) => stage.key.toLowerCase() === status?.toLowerCase());

  const currentIndex = getCurrentStageIndex(order?.orderStatus || "Pending");

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return {
      date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
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
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#E57373] mb-2 tracking-tight">
            Track Your Order
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Get live updates on your order’s journey in real time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8">
          <input
            type="text"
            placeholder="🔍 Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#E57373] outline-none text-gray-700 shadow-sm"
          />
          <Button
            onClick={() => fetchOrder(orderId)}
            disabled={!orderId || loading}
            className="bg-[#E57373] hover:bg-[#d75d5d] text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 flex justify-center items-center"
          >
            {loading ? (
              <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="bg-white/60 border border-[#ffd4d4] p-4 md:p-5 rounded-2xl shadow-sm text-sm md:text-base">
              <p className="font-semibold text-gray-800 mb-1">
                Order ID: <span className="font-mono text-[#E57373]">{order._id}</span>
              </p>
              <p className="text-gray-800 mb-1">
                <strong>Status:</strong>{" "}
                <span className="text-[#E57373] font-semibold capitalize">{order.orderStatus || "Pending"}</span>
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()} |{" "}
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
            </div>
            <div className="relative mt-8 md:mt-10 px-2 md:px-0">
              <div className="absolute top-[22px] left-[7%] w-[86%] h-[4px] bg-gray-200 rounded-full -z-10" />
              <motion.div
                className="absolute top-[22px] left-[7%] h-[4px] bg-gradient-to-r from-[#E57373] to-[#ffb6b6] rounded-full -z-10"
                initial={{ width: 0 }}
                animate={{ width: `${(currentIndex / (ORDER_STAGES.length - 1)) * 86}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center relative z-10">
                {ORDER_STAGES.map((stage, index) => {
                  const Icon = stage.icon;
                  const completed = index <= currentIndex;
                  const active = index === currentIndex;
                  const historyItem = order.statusHistory?.find(
                    (s) => s.status.toLowerCase() === stage.key.toLowerCase()
                  );

                  return (
                    <div key={stage.key} className="flex flex-col items-center w-1/5 sm:w-auto mb-4 sm:mb-0 group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-12 h-12 flex items-center justify-center rounded-full border-4 transition-all duration-300 ${
                          completed
                            ? "bg-[#E57373] border-[#E57373] text-white shadow-lg"
                            : "bg-white border-gray-300 text-gray-400"
                        } ${active ? "ring-4 ring-rose-200 ring-offset-2" : ""}`}
                      >
                        {completed ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </motion.div>

                      <p className={`mt-2 md:mt-3 text-xs md:text-sm font-semibold text-center ${completed ? "text-[#E57373]" : "text-gray-500"}`}>
                        {stage.label}
                      </p>

                      {historyItem && (
                        <div className="mt-1 text-center text-[10px] md:text-xs text-gray-400 leading-tight">
                          <p>{formatTimestamp(historyItem.updatedAt).date}</p>
                          <p>{formatTimestamp(historyItem.updatedAt).time}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 md:mt-6 text-center py-3 rounded-xl font-medium border text-sm md:text-base ${
                order.orderStatus === "delivered"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              {order.orderStatus === "delivered"
                ? "🎉 Your order has been delivered successfully!"
                : "🚚 Your order is on the way — stay tuned for updates!"}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
