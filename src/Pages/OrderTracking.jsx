import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Home,
  Clock,
  Search,
  Fingerprint,
  Check,
} from "lucide-react";
import { Helmet } from "react-helmet";

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

// 🔥 ICC STATUS MAPPING
const mapICCStatus = (status) => {
  if (!status) return "Confirmed";

  status = status.toLowerCase();

  if (status.includes("delivered")) return "Delivered";
  if (status.includes("out")) return "Out for Delivery";
  if (status.includes("transit")) return "Shipped";

  return "Confirmed";
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // 🔥 REDUX STATE
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

        // 🔥 CALL REDUX TRACKING
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
  // 🔥 USE LIVE STATUS
  // ===============================
  const liveStatusMapped = mapICCStatus(tracking?.currentStatus);

  const getCurrentStageIndex = (status) =>
    ORDER_STAGES.findIndex(
      (stage) => stage.key.toLowerCase() === status?.toLowerCase(),
    );

  const currentIndex = getCurrentStageIndex(
    liveStatusMapped || order?.orderStatus || "Confirmed",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-pink-50 flex justify-center items-start md:items-center px-4 py-10 md:py-20">
      <Helmet>
        <title>Track Order - Range Of Himalayas</title>
      </Helmet>

      <motion.div className="w-full max-w-3xl backdrop-blur-xl bg-white/70 shadow-xl rounded-3xl p-6 md:p-10 mt-10">
        
        {/* INPUT */}
        <div className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 p-4 rounded-xl border"
          />

          <button
            onClick={() => fetchOrder(orderId)}
            className="bg-black text-white px-6 rounded-xl"
          >
            Track
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* ===============================
            ORDER DATA
        =============================== */}
        {order && (
          <>
            {/* 🔥 STATUS */}
            <h2 className="text-lg font-bold mb-4">
              Status:{" "}
              {tracking?.currentStatus || order.orderStatus}
            </h2>

            {/* ===============================
                TIMELINE
            =============================== */}
            <div className="flex justify-between mb-10">
              {ORDER_STAGES.map((stage, index) => {
                const Icon = stage.icon;

                const completed = index <= currentIndex;

                return (
                  <div key={stage.key} className="text-center">
                    <div
                      className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${
                        completed
                          ? "bg-black text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {completed ? <Check size={16} /> : <Icon size={16} />}
                    </div>

                    <p className="text-xs mt-2">{stage.label}</p>
                  </div>
                );
              })}
            </div>

            {/* ===============================
                TRACKING EVENTS
            =============================== */}
            {tracking?.trackingEvents && (
              <div className="space-y-3">
                <h3 className="font-semibold">Tracking History</h3>

                {tracking.trackingEvents.map((event, i) => (
                  <div
                    key={i}
                    className="border p-3 rounded-lg text-sm"
                  >
                    <p className="font-semibold">{event.status}</p>
                    <p className="text-gray-500">{event.location}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* ===============================
                FINAL STATUS
            =============================== */}
            <div className="mt-8 text-center font-bold">
              {tracking?.currentStatus
                ?.toLowerCase()
                .includes("delivered")
                ? "✅ Delivered"
                : "🚚 In Transit"}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}