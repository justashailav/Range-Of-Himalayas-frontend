import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "./ui/card";
import { getAllOrdersByUserId } from "@/store/slices/orderSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

const statusSteps = ["confirmed", "packed", "shipping", "delivered"];

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  packed: "bg-blue-100 text-blue-700",
  shipping: "bg-yellow-100 text-yellow-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ShoppingOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orderList, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersByUserId(user._id));
    }
  }, [dispatch, user?._id]);

  if (!user) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Please login to view your orders.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="pb-8 border-b border-stone-100">
          <div className="flex flex-col gap-2">
            {/* Minimalist Subtitle */}
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-4 bg-[#B23A2E]" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
                Personal Archive
              </p>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black text-stone-900 uppercase tracking-tighter">
              My Acquisitions
            </h1>

            {/* Contextual Description */}
            <p className="text-sm font-serif italic text-stone-500 mt-1">
              A record of your seasonal harvests and real-time transit status.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {orderList?.length === 0 && (
          <div className="mt-12 py-24 px-10 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
            <div className="flex flex-col items-center gap-6">
              {/* Minimalist Icon/Graphic placeholder */}
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                <span className="text-2xl">🏔️</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">
                  The Ledger is Silent
                </h3>
                <p className="text-stone-500 font-serif italic text-lg max-w-sm mx-auto">
                  No harvests have been reserved yet. Your journey into the
                  Himalayan valleys begins at the source.
                </p>
              </div>

              <a
                href="/viewproducts"
                className="mt-4 px-10 py-4 bg-stone-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-[#B23A2E] transition-all duration-500 shadow-lg"
              >
                Discover the Harvest
              </a>
            </div>
          </div>
        )}
        {/* ORDERS */}
        <div className="space-y-6">
          {orderList?.map((order) => {
            const currentIndex = statusSteps.indexOf(order.orderStatus);

            return (
              <Card
                key={order._id}
                className="rounded-2xl border shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-6">
                  {/* TOP ROW */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-2">
                    {/* IDENTIFICATION BLOCK */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                          Entry Ref.
                        </span>
                        <p className="font-mono text-[11px] tracking-tighter text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                          {order._id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-stone-400" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-stone-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "Date pending"}
                        </p>
                      </div>
                    </div>

                    {/* VALUE & STATUS BLOCK */}
                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                          Total Yield Value
                        </span>
                        <p className="text-xl font-black text-stone-900 tracking-tighter">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                          Transit Status
                        </span>
                        <Badge
                          className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.15em] border ${
                            order.orderStatus === "delivered"
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-white text-[#B23A2E] border-[#B23A2E]"
                          }`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* STATUS TIMELINE */}
                  {statusSteps.includes(order.orderStatus) && (
  <div className="mt-12 mb-6 px-2">
    <div className="flex items-center">
      {statusSteps.map((step, idx) => (
        <div
          key={step}
          className="flex-1 relative flex flex-col items-center"
        >
          {/* THE TRACKING LINE */}
          {idx !== statusSteps.length - 1 && (
            <div
              className={`absolute top-[6px] left-[50%] w-full h-[1px] transition-colors duration-1000 ${
                idx < currentIndex ? "bg-stone-900" : "bg-stone-200"
              }`}
            />
          )}

          {/* THE NODE (POINT) */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-700 ${
                idx <= currentIndex 
                  ? "bg-stone-900 border-stone-900 shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                  : "bg-white border-stone-200"
              } ${idx === currentIndex ? "animate-pulse ring-4 ring-stone-900/10" : ""}`}
            />
            
            {/* STEP LABEL */}
            <div className="absolute top-6 flex flex-col items-center min-w-[80px]">
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                idx <= currentIndex ? "text-stone-900" : "text-stone-300"
              }`}>
                {step}
              </span>
              
              {/* INDICATOR DOT FOR CURRENT STEP */}
              {idx === currentIndex && (
                <motion.div 
                  layoutId="active-dot"
                  className="w-1 h-1 bg-[#B23A2E] rounded-full mt-1" 
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

                  {/* ACTION */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() =>
                        navigate(`/order-details/${order._id}`, {
                          state: { orderDetails: order },
                        })
                      }
                      className="rounded-xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600
                      hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                    >
                      View Order Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
