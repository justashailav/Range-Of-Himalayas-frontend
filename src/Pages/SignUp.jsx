import { register, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthencated } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("phone", phone);
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      navigateTo(`/otp-verification/${email}`);
      toast.success("Verification code dispatched.");
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, message, error, navigateTo, email]);

  if (isAuthencated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#fdfcf7] flex flex-col md:flex-row overflow-hidden">
      <Helmet>
        <title>Identity Induction — Range Of Himalayas</title>
      </Helmet>

      {/* --- LEFT SIDE: THE BRAND MANIFESTO --- */}
      <div className="hidden w-full md:w-5/12 bg-[#1a241a] md:flex flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Subtle Himalayan Topography Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-sm text-center"
        >
          <img src={logo} alt="Logo" className="h-24 w-auto mx-auto mb-16 brightness-0 invert opacity-90" />
          
          <div className="space-y-6 mb-16">
            <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-[0.85]">
              The Seasonal <br /> 
              <span className="font-serif italic font-light lowercase tracking-normal text-red-500/80">Collective.</span>
            </h2>
            <p className="text-[#fdfcf7]/40 font-serif italic text-sm leading-relaxed mx-auto max-w-[280px]">
              "Join our circle of connoisseurs and gain first-access to the high-altitude harvest."
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Already hold an account?</p>
            <Link
              to="/login"
              className="group relative px-10 py-4 overflow-hidden border border-white/10 transition-all duration-500 hover:border-white/40"
            >
              <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10 text-white group-hover:text-[#1a241a] text-[10px] font-black uppercase tracking-[0.4em]">
                Enter Archive
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: THE ENROLLMENT FORM --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-6 bg-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600">Form 01.A</span>
            </div>
            <h1 className="text-5xl font-black text-[#1a241a] uppercase tracking-tighter leading-none mb-4">
              Identity <br />
              <span className="font-serif italic font-light lowercase tracking-normal text-slate-400">Enrollment</span>
            </h1>
          </header>

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Full Name */}
              <ArchiveInput 
                label="Legal Name" 
                icon={<User size={14}/>}
                placeholder="Julian Everest"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <ArchiveInput 
                  label="Digital Mail" 
                  type="email"
                  icon={<Mail size={14}/>}
                  placeholder="name@archive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Phone - FIXED BUG: was using email state */}
                <ArchiveInput 
                  label="Contact Registry" 
                  type="tel"
                  icon={<Phone size={14}/>}
                  placeholder="+91 00000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Password */}
              <ArchiveInput 
                label="Secure Keyphrase" 
                type="password"
                icon={<Lock size={14}/>}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-[#1a241a] text-white py-6 transition-all duration-700 disabled:bg-slate-200"
              >
                <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                    {loading ? "Authenticating..." : "Establish Identity"}
                  </span>
                  {!loading && <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />}
                </div>
              </button>
            </div>

            {/* Mobile Footer */}
            <p className="md:hidden text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              Returning? <Link to="/login" className="text-red-600 underline">Sign In</Link>
            </p>
          </form>

          <footer className="mt-20 border-t border-slate-100 pt-6">
            <p className="text-[9px] text-slate-300 font-serif italic leading-relaxed">
              * By enrolling, you agree to our seasonal terms and the preservation of Himalayan privacy standards.
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}

/* --- REUSABLE ARCHIVE COMPONENT --- */
const ArchiveInput = ({ label, icon, ...props }) => (
  <div className="relative group">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-slate-300 group-focus-within:text-red-600 transition-colors">{icon}</span>
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-slate-900 transition-colors">
        {label}
      </label>
    </div>
    <input
      {...props}
      className="w-full bg-transparent border-b border-slate-200 py-2 text-[#1a241a] placeholder-slate-200 focus:outline-none focus:border-red-600 transition-all font-serif text-lg"
      required
    />
  </div>
);