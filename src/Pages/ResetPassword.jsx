import { resetAuthSlice, resetPassword } from '@/store/slices/authSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../assets/logo-himalayas.png"
import { Helmet } from 'react-helmet';
import { motion } from "framer-motion";
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useParams();
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append("password", password);
    data.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(data, token))
  }

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error]);

  if (isAuthencated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Helmet>
        <title>Reset Password - Range of Himalayas</title>
        <meta name="description" content="Securely redefine your access keys." />
      </Helmet>

      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* --- LEFT SIDE: THE PARCHMENT FORM --- */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#fdfcf7] p-8 md:p-12 relative">
          
          {/* Floating Back Link */}
          <Link
            to="/password/forgot"
            className="absolute top-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#2d3a2d]/40 hover:text-[#B23A2E] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return
          </Link>

          <div className="max-w-sm w-full relative z-10">
            <div className="mb-16 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-[#2d3a2d]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d3a2d]/60">
                  Security Vault
                </span>
              </div>

              <h1 className="text-5xl font-black text-[#1a241a] leading-[0.9] tracking-tighter uppercase">
                Redefine <br />
                <span className="font-serif italic font-light lowercase tracking-normal text-[#B23A2E]">
                  Your Credentials
                </span>
              </h1>
              <p className="text-[#4a5a4a] font-serif italic text-sm pt-2">
                "Define a new secret key to secure your mountain collection."
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-10">
              {/* NEW PASSWORD */}
              <div className="relative group">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-2 block transition-colors group-focus-within:text-[#B23A2E]">
                  New Secret Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all duration-500"
                  />
                  <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-[#2d3a2d]/20 w-4 h-4 group-focus-within:text-[#B23A2E]/40" />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative group">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-2 block transition-colors group-focus-within:text-[#B23A2E]">
                  Confirm Access Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all duration-500"
                  />
                  <ShieldCheck className="absolute right-0 top-1/2 -translate-y-1/2 text-[#2d3a2d]/20 w-4 h-4 group-focus-within:text-[#B23A2E]/40" />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-[#2d3a2d] text-white py-5 px-8 transition-all duration-700 shadow-xl shadow-[#2d3a2d]/10"
                >
                  <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
                    {isSubmitting && loading ? "Updating Ledger..." : "Commit New Key"}
                  </span>
                </button>
                
                <p className="text-[8px] text-center mt-8 text-[#4a5a4a]/40 uppercase tracking-[0.2em] leading-relaxed">
                  Redefining your key will terminate <br /> all other active sessions.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE FOREST COVER --- */}
        <div className="hidden w-full md:w-1/2 bg-[#2d3a2d] md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
               style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

          <div className="relative z-10 flex flex-col items-center max-w-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-12 relative"
            >
              <div className="absolute -inset-6 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
              <img
                src={logo}
                alt="logo"
                className="h-32 w-auto brightness-0 invert opacity-80"
              />
            </motion.div>

            <div className="text-center space-y-6">
              <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
                Seal Your <br />
                <span className="font-serif italic font-light lowercase tracking-normal text-[#fdfcf7]/60">
                  New passage.
                </span>
              </h2>

              <div className="h-12 w-[1px] bg-gradient-to-b from-[#B23A2E] to-transparent mx-auto" />

              <p className="text-[#fdfcf7]/40 font-serif italic text-sm leading-relaxed px-4">
                "Every key is a promise of quality. Keep yours secure to continue the journey."
              </p>
            </div>
          </div>

          <div className="absolute bottom-10">
            <span className="text-[8px] font-mono text-white/10 uppercase tracking-[1em]">
              Security Protocol v2.6
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}