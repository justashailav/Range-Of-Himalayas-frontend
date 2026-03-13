import { otpVerification, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png"
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
export default function OTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const handleotpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };
  useEffect(() => {
    if (message) {
      toast.success(message)
    }
    if (error) {
      dispatch(resetAuthSlice());
      toast.error(error)
    }
  }, [dispatch, isAuthencated, error, loading]);
  if (isAuthencated) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Verify OTP - Range of Himalayas</title>
        <meta
          name="description"
          content="Enter the OTP sent to your email to verify your account on Range of Himalayas."
        />
        <meta property="og:title" content="Verify OTP - Range of Himalayas" />
        <meta
          property="og:description"
          content="Secure your account by verifying your email using OTP."
        />
      </Helmet>
      <div className="flex flex-col md:flex-row h-screen bg-[#fdfcf7]">
  {/* --- LEFT SIDE: THE VERIFICATION FORM --- */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-12 relative overflow-hidden">
    
    {/* Minimalist Back Navigation */}
    <Link
      to="/register"
      className="absolute top-10 left-10 flex items-center gap-2 group z-20"
    >
      <div className="w-8 h-[1px] bg-[#2d3a2d] group-hover:w-12 transition-all duration-500" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2d3a2d]">
        Return
      </span>
    </Link>

    <div className="max-w-sm w-full relative z-10">
      {/* 1. HEADER */}
      <div className="text-center mb-16 space-y-4">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#B23A2E]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
            Security Clearance
          </span>
          <div className="h-[1px] w-8 bg-[#B23A2E]" />
        </div>
        
        <h1 className="text-5xl font-black text-stone-900 leading-none tracking-tighter uppercase">
          Check Your <br />
          <span className="font-serif italic font-light lowercase tracking-normal text-stone-700">
            Mailbox
          </span>
        </h1>
        <p className="text-stone-500 font-serif italic text-sm pt-4">
          "A unique passage key has been dispatched to your email."
        </p>
      </div>

      {/* 2. OTP FORM */}
      <form onSubmit={handleotpVerification} className="space-y-12">
        <div className="relative group">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2 block">
            Verification Code (OTP)
          </label>
          <input
            type="number"
            placeholder="0 0 0 0 0 0"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-transparent border-b border-stone-200 py-4 text-center text-3xl tracking-[0.5em] text-stone-900 placeholder-stone-200 focus:outline-none focus:border-[#B23A2E] transition-all duration-500 font-mono"
            required
          />
        </div>

        <div className="space-y-6">
          <button
            type="submit"
            className="w-full group relative overflow-hidden bg-[#2d3a2d] text-white py-5 px-8 transition-all duration-700 shadow-xl shadow-[#2d3a2d]/10"
          >
            <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
              Verify Identity
            </span>
          </button>
          
          <button 
            type="button"
            className="w-full text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-[#B23A2E] transition-colors"
          >
            Resend Passkey
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* --- RIGHT SIDE: THE BRANDING COVER --- */}
  <div className="hidden w-full md:w-1/2 bg-[#2d3a2d] md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
    {/* Natural Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
         style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />
    
    <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12 relative"
      >
        <div className="absolute -inset-6 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
        <img src={logo} alt="logo" className="h-32 w-auto brightness-0 invert opacity-80" />
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
          Almost <br />
          <span className="font-serif italic font-light lowercase tracking-normal text-stone-400">
            at the summit.
          </span>
        </h2>
        <p className="text-white/40 font-serif italic text-sm leading-relaxed px-4">
          "Finalize your registration to begin your journey through the Himalayan harvest."
        </p>
      </div>

      {/* Decorative Stamp */}
      <div className="mt-16 w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-[#B23A2E] animate-ping" />
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
