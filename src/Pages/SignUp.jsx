import { register, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png"
import { Helmet } from "react-helmet";
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    dispatch(register(data));
  };
  useEffect(() => {
    if (message) {
      navigateTo(`/otp-verification/${email}`);
      toast.success()
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
      <div className="flex flex-col justify-center md:flex-row bg-[#FFECE8] h-screen">
      <Helmet>
        <title>Signup - Range Of Himalayas </title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
        {/* --- LEFT SIDE: THE INVITATION PANEL (Matches Login Right Side) --- */}
<div className="hidden w-full md:w-1/2 bg-[#2d3a2d] md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
  {/* Natural Paper Texture */}
  <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
       style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />
  
  <div className="relative z-10 flex flex-col items-center max-w-xs">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mb-12 relative"
    >
      <div className="absolute -inset-6 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]" />
      <img src={logo} alt="logo" className="h-32 w-auto brightness-0 invert opacity-80" />
    </motion.div>

    <div className="text-center space-y-6 mb-12">
      <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
        Welcome <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-[#fdfcf7]/60">
          Back Home.
        </span>
      </h2>
      <p className="text-[#fdfcf7]/40 font-serif italic text-sm leading-relaxed px-4">
        "Already a part of the harvest? Re-authenticate to access your private ledger."
      </p>
    </div>

    <Link
      to="/login"
      className="group relative px-12 py-4 overflow-hidden border border-[#fdfcf7]/20 transition-all duration-500 hover:border-[#fdfcf7]"
    >
      <div className="absolute inset-0 bg-[#fdfcf7] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10 text-white group-hover:text-[#2d3a2d] text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500">
        Sign In
      </span>
    </Link>
  </div>
</div>

{/* --- RIGHT SIDE: THE REGISTRATION FORM --- */}
<div className="w-full md:w-1/2 flex items-center justify-center bg-[#fdfcf7] p-12 relative overflow-hidden">
  <div className="max-w-sm w-full relative z-10">
    
    {/* 1. HEADER */}
    <div className="text-center mb-12 space-y-4">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="h-[1px] w-8 bg-[#2d3a2d]" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d3a2d]/60">
          New Induction
        </span>
        <div className="h-[1px] w-8 bg-[#2d3a2d]" />
      </div>
      
      <h1 className="text-5xl font-black text-[#1a241a] leading-none tracking-tighter uppercase">
        Unlock <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-[#B23A2E]">
          The Archive
        </span>
      </h1>
      <p className="text-[#4a5a4a] font-serif italic text-sm pt-2">
        "Provide your details to join our seasonal community."
      </p>
    </div>

    {/* 2. ARCHIVE-STYLE FORM */}
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="relative group">
        <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-1 block">Full Name</label>
        <input
          type="text"
          placeholder="e.g. Julian Everest"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all font-serif"
          required
        />
      </div>

      <div className="relative group">
        <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-1 block">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all font-serif"
          required
        />
      </div>

      <div className="relative group">
        <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-1 block">Create Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all"
          required
        />
      </div>

      {/* Mobile-only Link */}
      <div className="block md:hidden text-center pt-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#4a5a4a]/60">
          Already a member? <Link to="/login" className="text-[#B23A2E] underline">Sign In</Link>
        </p>
      </div>

      <button
        type="submit"
        className="w-full group relative overflow-hidden bg-[#2d3a2d] text-white py-5 px-8 transition-all duration-700 mt-8"
      >
        <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
          Establish Account
        </span>
      </button>
    </form>
  </div>
</div>
      </div>
    </div>
  );
}
