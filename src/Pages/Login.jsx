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
    (state) => state.auth,
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
       {/* --- LEFT SIDE: THE PARCHMENT FORM --- */}
<div className="w-full md:w-1/2 flex items-center justify-center bg-[#fdfcf7] p-12 relative overflow-hidden">
  {/* Subtlest hint of a paper texture watermark */}
  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none select-none">
    <span className="text-[12rem] font-black uppercase tracking-tighter">Login</span>
  </div>

  <div className="max-w-sm w-full relative z-10">
    <div className="text-center mb-16 space-y-4">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="h-[1px] w-8 bg-[#2d3a2d]" /> {/* Forest Green accent */}
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2d3a2d]/60">
          Member Access
        </span>
        <div className="h-[1px] w-8 bg-[#2d3a2d]" />
      </div>

      <h1 className="text-5xl font-black text-[#1a241a] leading-none tracking-tighter uppercase">
        Return to <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-[#B23A2E]">
          The Orchard
        </span>
      </h1>
      <p className="text-[#4a5a4a] font-serif italic text-sm pt-2">
        "Enter your credentials to access your harvest records."
      </p>
    </div>

    <form onSubmit={handleLogin} className="space-y-8">
      <div className="relative group">
        <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 mb-2 block transition-colors group-focus-within:text-[#B23A2E]">
          Email Address
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

      <div className="relative group">
        <div className="flex justify-between items-end mb-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/60 transition-colors group-focus-within:text-[#B23A2E]">
            Secret Key / Password
          </label>
          <Link
            to="/password/forgot"
            className="text-[9px] font-black uppercase tracking-widest text-[#4a5a4a]/40 hover:text-[#B23A2E] transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-[#2d3a2d]/10 py-3 text-[#1a241a] placeholder-[#1a241a]/20 focus:outline-none focus:border-[#B23A2E] transition-all duration-500"
          required
        />
      </div>

      <div className="pt-6 space-y-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full group relative overflow-hidden bg-[#2d3a2d] text-white py-5 px-8 transition-all duration-700 shadow-xl shadow-[#2d3a2d]/10"
        >
          <div className="absolute inset-0 bg-[#B23A2E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.5em]">
            {loading ? "Verifying..." : "Authenticate"}
          </span>
        </button>

        <div className="text-center pt-4 border-t border-[#2d3a2d]/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#4a5a4a]/60">
            New to the harvest?{" "}
            <Link
              to="/register"
              className="text-[#2d3a2d] hover:text-[#B23A2E] underline underline-offset-4 transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </form>
  </div>
</div>

{/* --- RIGHT SIDE: THE FOREST COVER --- */}
<div className="hidden w-full md:w-1/2 bg-[#2d3a2d] md:flex flex-col items-center justify-center p-12 relative overflow-hidden">
  {/* Abstract Nature Texture Overlay */}
  <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
       style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />
  
  {/* The "Sunlight" effect (radial gradient to break the flat green) */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05)_0%,_transparent_60%)]" />

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

    <div className="text-center space-y-6 mb-12">
      <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
        The Harvest <br />
        <span className="font-serif italic font-light lowercase tracking-normal text-[#fdfcf7]/60">
          awaits you.
        </span>
      </h2>

      <div className="flex justify-center items-center gap-2">
        <div className="h-[1px] w-4 bg-[#B23A2E]" />
        <p className="text-[#fdfcf7]/40 text-[10px] font-black uppercase tracking-[0.3em]">
          Join the Registry
        </p>
        <div className="h-[1px] w-4 bg-[#B23A2E]" />
      </div>

      <p className="text-[#fdfcf7]/40 font-serif italic text-sm leading-relaxed px-4">
        "Become a part of our seasonal journey and gain early access to limited mountain yields."
      </p>
    </div>

    <Link
      to="/register"
      className="group relative px-12 py-4 overflow-hidden border border-[#fdfcf7]/20 transition-all duration-500 hover:border-[#fdfcf7]"
    >
      <div className="absolute inset-0 bg-[#fdfcf7] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10 text-white group-hover:text-[#2d3a2d] text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500">
        Create Account
      </span>
    </Link>
  </div>

  <div className="absolute bottom-10">
    <span className="text-[8px] font-mono text-white/10 uppercase tracking-[1em]">
      Himalayan Origins © 2026
    </span>
  </div>
</div>
      </div>
    </div>
  );
}
