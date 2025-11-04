import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import heroImage from "../assets/hero-image.png";
import logo from "../assets/logo-himalayas.png";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { contactFormHandler } from "@/store/slices/contactSlice";
import { Helmet } from "react-helmet";

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


  return (
    <div>
      <div className="relative h-72 sm:h-96">
      <Helmet>
        <title>Contact us - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
        {/* Background Image can be uncommented */}
        {/* <img src={heroImage} alt="Hero" className="w-full h-full object-cover" /> */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="text-white text-4xl sm:text-5xl font-extrabold text-center">
            We're here to help!
          </h1>
        </div>
      </div>

      <section className="bg-[#F08C7D] p-8 sm:p-20 rounded-b-3xl">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Contact Information
          </h1>
          <p className="text-white text-lg max-w-3xl mx-auto">
            We’d love to hear about your experience with Range of Himalayas.
            Please feel free to get in touch with any comments, suggestions, or
            questions you might have—we’re always here to help and improve your
            journey with us.
          </p>
        </header>

        <form
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
              aria-label="Name"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              aria-label="Email"
              required
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
            />
          </div>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            aria-label="Phone Number"
            required
            className="w-full mt-6 px-4 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F08C7D] transition"
          />

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment"
            rows={6}
            aria-label="Comment"
            required
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

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full py-3 font-semibold rounded-lg bg-[#F08C7D] text-white hover:bg-[#e36c5d] focus:ring-4 focus:ring-[#F08C7D]/60 transition disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "SEND MESSAGE"}
          </button>
        </form>
      </section>

      <section className="bg-[#8DA55A] flex flex-col sm:flex-row justify-around items-center p-8 sm:p-10 text-center space-y-6 sm:space-y-0">
        <img
          src={logo}
          alt="Range of Himalayas Logo"
          className="w-48 sm:w-72"
        />
        <p className="text-white text-lg max-w-xs sm:max-w-md italic">
          "Bringing you pure organic produce from the heart of the Himalayas."
        </p>
      </section>

      <footer className="bg-[#F08C7D] text-white p-8 sm:p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-lg">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Helpful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Lab Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Help
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <ul className="flex gap-6 text-3xl justify-center sm:justify-start">
              <li>
                <a
                  href="https://www.instagram.com/range.of.himalayas?igsh=eXZ4OHVidGk1c3M4&utm_source=ig_contact_invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-yellow-300 transition"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/rangeofhimalayas"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-yellow-300 transition"
                >
                  <FaFacebook />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
