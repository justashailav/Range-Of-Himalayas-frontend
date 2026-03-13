import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import logo from "../assets/logo-himalayas.png";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { contactFormHandler } from "@/store/slices/contactSlice";
import { Helmet } from "react-helmet";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function ContactUs() {
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(contactFormHandler(formData));
  };

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: 0.55, ease: "easeOut", delay },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, ease: "easeOut", delay },
    }),
  };

  return (
    <div>
      {/* HERO */}
      <motion.div
  initial="hidden"
  animate="visible"
  variants={fadeUp}
  className="relative h-[60vh] min-h-[400px] overflow-hidden bg-stone-900"
>
  <Helmet>
    <title>Correspondence — Range Of Himalayas</title>
    <meta
      name="description"
      content="Reach out to the source. Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
    />
  </Helmet>

  {/* Background Texture/Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-900"></div>
  
  {/* Optional: Add a subtle mountain peak silhouette or texture here */}
  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('your-texture-url.jpg')] bg-cover bg-center" />

  <motion.div
    variants={fadeIn}
    custom={0.2}
    className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-6"
  >
    {/* Minimalist Subtitle */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-3"
    >
      <span className="h-[1px] w-6 bg-[#B23A2E]" />
      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B23A2E]">
        Direct Correspondence
      </span>
      <span className="h-[1px] w-6 bg-[#B23A2E]" />
    </motion.div>

    {/* Main Headline */}
    <h1 className="text-white text-5xl sm:text-7xl font-black text-center uppercase tracking-tighter leading-[0.85] max-w-4xl">
      How May We <br /> 
      <span className="font-serif italic font-light lowercase tracking-normal">assist</span> your discovery?
    </h1>

    {/* Breadcrumb or Fine Print */}
    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-8">
      Himalayan Headquarters — Global Transit
    </p>
  </motion.div>
</motion.div>

      {/* CONTACT INFO SECTION */}
     <motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeUp}
  className="bg-stone-50 p-8 sm:p-24 rounded-b-[3rem]"
>
  <motion.header
    variants={fadeIn}
    custom={0.05}
    className="max-w-4xl mx-auto text-center mb-16 space-y-4"
  >
    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
      Direct Channel
    </h4>
    <h1 className="text-4xl md:text-5xl font-black text-stone-900 uppercase tracking-tighter">
      Lodge an Inquiry
    </h1>
    <p className="text-stone-500 font-serif italic text-lg max-w-2xl mx-auto leading-relaxed">
      Whether you seek guidance on our seasonal harvests or wish to share your experience, 
      our Himalayan team is attentive to every word.
    </p>
  </motion.header>

  {/* FORM: THE STATIONERY CARD */}
  <motion.form
    variants={scaleIn}
    custom={0.1}
    className="max-w-3xl mx-auto p-8 sm:p-16 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100"
    onSubmit={handleSubmit}
  >
    <div className="space-y-8">
      {/* ROW 1: Name & Email */}
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-medium text-stone-900"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-medium text-stone-900"
          />
        </div>
      </div>

      {/* ROW 2: Phone */}
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Contact Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 00000 00000"
          required
          className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-medium text-stone-900"
        />
      </div>

      {/* ROW 3: Comment */}
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Message / Suggestion</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="How may we assist you?"
          rows={5}
          required
          className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all font-medium text-stone-900 resize-none shadow-inner"
        />
      </div>
    </div>

    {/* FEEDBACK MESSAGES */}
    <div className="mt-4">
      {message && <p className="text-green-600 text-[11px] font-black uppercase tracking-widest text-center animate-pulse">{message}</p>}
      {error && <p className="text-[#B23A2E] text-[11px] font-black uppercase tracking-widest text-center">{error}</p>}
    </div>

    {/* SUBMIT BUTTON */}
    <motion.button
      type="submit"
      disabled={isLoading}
      whileTap={{ scale: 0.98 }}
      className="mt-10 w-full py-5 bg-stone-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#B23A2E] transition-all duration-500 shadow-xl disabled:opacity-50"
    >
      {isLoading ? "Dispatching..." : "Send Correspondence"}
    </motion.button>
  </motion.form>
</motion.section>

      {/* LOGO + TAGLINE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="bg-[#8DA55A] flex flex-col sm:flex-row justify-around items-center p-8 sm:p-10 text-center space-y-6 sm:space-y-0"
      >
        <motion.img
          variants={scaleIn}
          src={logo}
          alt="Range of Himalayas Logo"
          className="w-48 sm:w-72"
        />

        <motion.p
          variants={fadeIn}
          custom={0.1}
          className="text-white text-lg max-w-xs sm:max-w-md italic"
        >
          "Bringing you pure organic produce from the heart of the Himalayas."
        </motion.p>
      </motion.section>

      {/* PRELAUNCH CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="px-6 py-14 bg-gradient-to-br from-[#FFF5EC] to-[#FFE8D6] text-center shadow-inner"
      >
        <motion.h2
          variants={fadeIn}
          custom={0.02}
          className="text-3xl sm:text-4xl font-bold text-[#d97706] mb-3"
        >
          🍎 Prelaunch Is Live!
        </motion.h2>

        <motion.p
          variants={fadeIn}
          custom={0.08}
          className="text-gray-700 text-lg max-w-2xl mx-auto mb-8"
        >
          Our fresh Himalayan apples and seasonal produce are launching soon.
          Join our prelaunch list to get early access, member-only pricing, and
          updates straight from our orchards.
        </motion.p>

        <motion.a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#d97706] text-white px-10 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-[#b76104] transition"
          >
            Join Prelaunch Waitlist 🚀
          </motion.button>
        </motion.a>
      </motion.section>

      <Footer />
    </div>
  );
}
