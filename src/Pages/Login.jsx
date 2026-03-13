import { login, resetAuthSlice } from "@/store/slices/authSlice";
import { fetchCartItems } from "@/store/slices/cartSlice"; // Import fetchCartItems
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, isAuthencated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }

    if (isAuthencated && user) {
      console.log("User logged in:", user);

      // Fetch cart items for logged-in user
      if (user._id) {
        console.log("Fetching cart for user:", user._id);
        dispatch(fetchCartItems(user._id))
          .then(() => console.log("Cart fetched successfully"))
          .catch((err) => console.log("Error fetching cart:", err));
      }

      // Redirect based on role
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, error, isAuthencated, user, navigate]);

  if (isAuthencated) {
    // Prevent login page rendering after successful login (redirect handled in useEffect)
    return null;
  }

  return (
    <div>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-[#FFECE8]">
      <Helmet>
        <title>Login - Range Of Himalayas </title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-stone-50 p-12 relative overflow-hidden">
  {/* Subtle Background Detail: A faint watermark or texture */}
  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
    <span className="text-8xl font-black uppercase tracking-tighter">Login</span>
  </div>

  <div className="max-w-sm w-full relative z-10">
    {/* 1. EDITORIAL HEADER */}
    <div className="text-center mb-16 space-y-4">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="h-[1px] w-8 bg-[#B23A2E]" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
          Member Access
        </span>
        <div className="h-[1px] w-8 bg-[#B23A2E]" />
      </div>
      
      <h1 className="text-5xl font-black text-stone-900 leading-none tracking-tighter uppercase">
        Return to <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-stone-700">
          The Orchard
        </span>
      </h1>
      <p className="text-stone-500 font-serif italic text-sm pt-2">
        "Enter your credentials to access your harvest records."
      </p>
    </div>

    {/* 2. ARCHIVE-STYLE FORM */}
    <form onSubmit={handleLogin} className="space-y-8">
      <div className="relative group">
        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2 block transition-colors group-focus-within:text-[#B23A2E]">
          Email Address
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-[#B23A2E] transition-all duration-500 font-serif"
          required
        />
      </div>

      <div className="relative group">
        <div className="flex justify-between items-end mb-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 transition-colors group-focus-within:text-[#B23A2E]">
            Secret Key / Password
          </label>
          <Link
            to="/password/forgot"
            className="text-[9px] font-black uppercase tracking-widest text-stone-400 hover:text-[#B23A2E] transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-[#B23A2E] transition-all duration-500"
          required
        />
      </div>

      {/* 3. PREMIUM ACTION */}
      <div className="pt-6 space-y-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full group relative overflow-hidden bg-stone-900 text-white py-5 px-8 transition-all duration-700"
        >
          {/* Hover Slide Effect */}
          <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
            {loading ? "Verifying..." : "Authenticate"}
          </span>
        </button>

        {/* 4. SECONDARY LINK */}
        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            New to the harvest?{" "}
            <Link
              to="/register"
              className="text-stone-900 hover:text-[#B23A2E] underline underline-offset-4 transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </form>
  </div>
</div>
        <div className="hidden w-full md:w-1/2 bg-stone-900 md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
  
  {/* --- 1. THE ARCHIVAL BACKGROUND --- */}
  {/* Subtle texture overlay to make the black feel like high-end paper */}
  <div className="absolute inset-0 opacity-20 pointer-events-none grayscale contrast-125" 
       style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/p6.png')` }} />
  
  {/* Decorative "Mountain" line art in the background */}
  <div className="absolute bottom-[-10%] left-[-10%] opacity-10">
     <div className="w-96 h-96 border-[1px] border-white rounded-full" />
  </div>

  <div className="relative z-10 flex flex-col items-center max-w-xs">
    
    {/* --- 2. THE LOGO AS A SEAL --- */}
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      className="mb-12 relative"
    >
      {/* Decorative ring around logo */}
      <div className="absolute -inset-4 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
      <img src={logo} alt="logo" className="h-32 w-auto brightness-0 invert opacity-90" />
    </motion.div>

    {/* --- 3. EDITORIAL TEXT --- */}
    <div className="text-center space-y-6 mb-12">
      <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
        The Harvest <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-stone-400">
          awaits you.
        </span>
      </h2>
      
      <div className="flex justify-center items-center gap-2">
        <div className="h-[1px] w-4 bg-[#B23A2E]" />
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Join the Registry
        </p>
        <div className="h-[1px] w-4 bg-[#B23A2E]" />
      </div>

      <p className="text-stone-500 font-serif italic text-sm leading-relaxed px-4">
        "Become a part of our seasonal journey and gain early access to limited mountain yields."
      </p>
    </div>

    {/* --- 4. THE BOUTIQUE BUTTON --- */}
    <Link
      to="/register"
      className="group relative px-12 py-4 overflow-hidden border border-white/20 transition-all duration-500 hover:border-white"
    >
      {/* Hover fill animation */}
      <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      
      <span className="relative z-10 text-white group-hover:text-stone-900 text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500">
        Create Account
      </span>
    </Link>
    
  </div>

  {/* --- 5. BOTTOM BRANDING --- */}
  <div className="absolute bottom-10">
    <span className="text-[8px] font-mono text-white/20 uppercase tracking-[1em]">
      Himalayan Origins © 2026
    </span>
  </div>
</div>
      </div>
    </div>
  );
}
