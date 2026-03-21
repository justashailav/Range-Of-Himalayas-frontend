import { resetAuthSlice, resetPassword } from '@/store/slices/authSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../assets/logo-himalayas.png"
import { Helmet } from 'react-helmet';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'; // Added icons

export default function ResetPassword() {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
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
      toast.error(error); // Fixed: should be error, not message
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error]);

  if (isAuthencated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <Helmet>
        <title>Reset Password - Range of Himalayas</title>
      </Helmet>

      {/* LEFT SIDE: Heritage Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-50 relative flex-col items-center justify-center p-12 overflow-hidden border-r border-stone-100">
        {/* Subtle decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#F08C7D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 bg-stone-200/40 rounded-full blur-2xl" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="h-32 w-auto grayscale contrast-125 opacity-80" />
          </div>
          <div className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400">
              Security Protocol
            </h2>
            <p className="font-serif italic text-3xl text-stone-800 max-w-sm mx-auto leading-relaxed">
              Restoring access to your artisan harvest collection.
            </p>
          </div>
        </div>
        
        {/* Archival Badge */}
        <div className="absolute bottom-12 left-12 flex items-center gap-3 opacity-30">
          <div className="w-8 h-8 rounded-lg border border-stone-900 flex items-center justify-center">
            <span className="text-[10px] font-black">H</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-stone-900">
            Est. 2024 / Himalayas
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        
        {/* Floating Back Link */}
        <Link
          to="/password/forgot"
          className="absolute top-10 left-10 lg:left-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#B23A2E] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>

        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase">
              New <br />Credentials
            </h1>
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
              Please define your secure access keys
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              {/* PASSWORD INPUT */}
              <div className="group space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1 group-focus-within:text-[#B23A2E] transition-colors">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-900 text-sm outline-none focus:bg-white focus:border-[#B23A2E]/30 focus:ring-4 focus:ring-[#B23A2E]/5 transition-all duration-300"
                  />
                  <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4 group-focus-within:text-[#B23A2E]/40" />
                </div>
              </div>

              {/* CONFIRM PASSWORD INPUT */}
              <div className="group space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1 group-focus-within:text-[#B23A2E] transition-colors">
                  Confirm Access Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-900 text-sm outline-none focus:bg-white focus:border-[#B23A2E]/30 focus:ring-4 focus:ring-[#B23A2E]/5 transition-all duration-300"
                  />
                  <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4 group-focus-within:text-[#B23A2E]/40" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center gap-3
                ${loading 
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed" 
                  : "bg-stone-900 text-white hover:bg-[#B23A2E] shadow-xl shadow-stone-200 active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Commit Changes"
              )}
            </button>
          </form>

          {/* SECURITY NOTICE */}
          <div className="pt-8 border-t border-stone-50">
            <p className="text-[9px] leading-relaxed text-stone-400 font-medium text-center uppercase tracking-widest">
              By updating your password, you authorize all existing <br /> 
              sessions to be terminated for your security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}