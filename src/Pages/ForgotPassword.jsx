import { forgotPassword, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const navigateTo = useNavigate();
  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthencated, error, loading, message]);
  if (isAuthencated) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Forgot Password - Range of Himalayas</title>
        <meta
          name="description"
          content="Forgot your password? Enter your email to receive a secure OTP and reset your Range of Himalayas account."
        />
        <meta
          property="og:title"
          content="Forgot Password - Range of Himalayas"
        />
        <meta
          property="og:description"
          content="Reset your account password easily by entering your registered email."
        />
      </Helmet>

      <div className="flex flex-col md:flex-row h-screen bg-[#fdfcf7]">
  {/* --- LEFT SIDE: THE FOREST BRANDING --- */}
  <div className="hidden w-full md:w-1/2 bg-[#2d3a2d] md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
    {/* Natural Paper Texture */}
    <div 
      className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} 
    />
    
    <div className="relative z-10 flex flex-col items-center max-w-xs">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-12 relative"
      >
        <div className="absolute -inset-6 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
        <img src={logo} alt="logo" className="h-32 w-auto brightness-0 invert opacity-80" />
      </motion.div>

      <div className="text-center space-y-4">
        <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
          Archive <br />
          <span className="font-serif italic font-light lowercase tracking-normal text-[#fdfcf7]/60">
            Assistance.
          </span>
        </h2>
        <p className="text-[#fdfcf7]/40 font-serif italic text-sm leading-relaxed">
          "The mountains hold many secrets; your access should not be one of them."
        </p>
      </div>
    </div>
  </div>

  {/* --- RIGHT SIDE: THE RECOVERY FORM --- */}
  <div className="w-full md:w-1/2 bg-[#fdfcf7] flex items-center justify-center p-8 relative">
    
    {/* MINIMALIST BACK BUTTON */}
    <Link
      to="/login"
      className="absolute top-10 left-10 flex items-center gap-2 group"
    >
      <div className="w-8 h-[1px] bg-[#2d3a2d] group-hover:w-12 transition-all duration-500" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2d3a2d]">
        Back to Entry
      </span>
    </Link>

    <div className="w-full max-w-sm">
      <div className="text-center mb-16 space-y-4">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#2d3a2d]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d3a2d]/60">
            Recovery
          </span>
          <div className="h-[1px] w-8 bg-[#2d3a2d]" />
        </div>

        <h1 className="text-5xl font-black text-[#1a241a] leading-none tracking-tighter uppercase">
          Forgot <br />
          <span className="font-serif italic font-light lowercase tracking-normal text-[#B23A2E]">
            Credential?
          </span>
        </h1>
        <p className="text-[#4a5a4a] font-serif italic text-sm pt-2">
          "Provide your email to receive recovery instructions."
        </p>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-10">
        <div className="relative group">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-2 block transition-colors group-focus-within:text-[#B23A2E]">
            Registered Email
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all duration-500 font-serif"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full group relative overflow-hidden bg-[#2d3a2d] text-white py-5 px-8 transition-all duration-700 shadow-xl shadow-[#2d3a2d]/10"
        >
          <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
            {loading ? "Transmitting..." : "Reset Password"}
          </span>
        </button>
      </form>
      
      {/* Decorative help text */}
      <div className="mt-12 text-center">
         <p className="text-[9px] font-mono text-stone-300 uppercase tracking-widest">
           System Registry v.2.0.26
         </p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
