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
        className="relative h-72 sm:h-96"
      >
        <Helmet>
          <title>Contact us - Range Of Himalayas</title>
          <meta
            name="description"
            content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
          />
        </Helmet>

        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          variants={fadeIn}
          custom={0.1}
          className="absolute inset-0 flex items-center justify-center px-4"
        >
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold text-center">
            We're here to help!
          </h1>
        </motion.div>
      </motion.div>

      {/* CONTACT INFO SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="bg-[#F08C7D] p-8 sm:p-20 rounded-b-3xl"
      >
        <motion.header
          variants={fadeIn}
          custom={0.05}
          className="max-w-4xl mx-auto text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Contact Information
          </h1>
          <p className="text-white text-lg max-w-3xl mx-auto">
            We’d love to hear about your experience with Range of Himalayas.
            Please feel free to get in touch with any comments, suggestions, or
            questions — we’re always here to help and improve your journey with
            us.
          </p>
        </motion.header>

        {/* FORM */}
        <motion.form
          variants={scaleIn}
          custom={0.1}
          className="max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              aria-label="Name"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              aria-label="Email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
            />
          </div>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            aria-label="Phone Number"
            className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
          />

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment"
            rows={6}
            required
            aria-label="Comment"
            className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition resize-none"
          />

          {message && (
            <p className="text-green-600 mt-3 text-center font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 mt-3 text-center font-medium">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 w-full py-3 font-semibold rounded-lg bg-[#F08C7D] text-white hover:bg-[#e36c5d] focus:ring-4 focus:ring-[#F08C7D]/60 transition disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "SEND MESSAGE"}
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
