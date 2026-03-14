import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Map, Calendar, ArrowRight, Home, User } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extracting data from state
  const { orderId, totalAmount = 0, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!orderId || !paymentMethod) {
      navigate("/", { replace: true });
    }
  }, [orderId, paymentMethod, navigate]);

  if (!orderId || !paymentMethod) return null;

  const isCOD = paymentMethod === "cod";

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6 py-20 selection:bg-black selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] rounded-none overflow-hidden"
      >
        {/* --- TOP STATUS BAR --- */}
        <div className="bg-[#004D3A] py-12 text-center text-white px-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="text-white" size={32} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-2 tracking-tight">The journey is set.</h1>
          <p className="text-white/70 text-[10px] uppercase font-black tracking-[0.4em]">Confirmation ID: #{orderId}</p>
        </div>

        {/* --- ORDER SUMMARY CONTENT --- */}
        <div className="p-8 md:p-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Payment Details */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Reservation Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                  <span className="text-sm text-gray-500 font-light italic">Experience Fee</span>
                  <span className="text-xl font-serif text-black leading-none">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-800">Method</span>
                  <span className="text-xs text-gray-400 font-medium uppercase">{isCOD ? "Cash on Delivery" : "Online via Razorpay"}</span>
                </div>
              </div>
            </div>

            {/* Note/Status */}
            <div className="bg-gray-50 p-6 space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-800">Note</h3>
              {isCOD ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">₹200 Advance Received</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Your spot is reserved. The balance will be collected by our ground team upon arrival in the village.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  Your full payment has been authenticated. A detailed digital itinerary has been dispatched to your email.
                </p>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- CONCIERGE/NEXT STEPS --- */}
          <div className="space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Next Steps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Prepare your gear</h4>
                  <p className="text-xs text-gray-400 font-light mt-1">Check the packing list sent to your dashboard.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Map size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight">Sync Itinerary</h4>
                  <p className="text-xs text-gray-400 font-light mt-1">Add your dates to Google Calendar or Apple Wallet.</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- ACTIONS --- */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/account")}
              className="flex-1 bg-black text-white py-5 px-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#004D3A] transition-all"
            >
              <User size={16} /> View My Bookings
            </button>

            <Link
              to="/"
              className="flex-1 border border-gray-200 text-black py-5 px-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] hover:border-black transition-all"
            >
              <Home size={16} /> Return Home
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-100/50 to-transparent -z-10" />
    </div>
  );
}