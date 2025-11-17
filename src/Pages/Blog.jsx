import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, toggleLikeBlog } from "@/store/slices/blogSlice";

import { Calendar, User, MessageSquare, Share2, Heart } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";

import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";

export default function Blog() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  const [openShareId, setOpenShareId] = useState(null);

  const shareRef = useRef(null);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setOpenShareId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLikeBlog(blogId));
  };

  const handleShareClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenShareId(openShareId === id ? null : id);
  };

  return (
    <div className="bg-[#F9F5EF] min-h-screen">
      <Helmet>
        <title>Our Blogs | Range of Himalayas</title>
        <meta
          name="description"
          content="Explore Himalayan stories, wellness guides, and insights from Range of Himalayas. Freshness, purity, and nature in every post."
        />
        <meta property="og:title" content="Range of Himalayas Blogs" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-[#2E1F1A] mb-3">
          Our Blogs
        </h2>
        <p className="text-center text-[#5C4033] mb-12 max-w-2xl mx-auto">
          Inspiring stories and natural wisdom — straight from the Himalayas.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {blogs?.map((b) => {
            const shareUrl = b.slug
              ? `${window.location.origin}/blog/${b.slug}`
              : window.location.origin;

            const encodedUrl = encodeURIComponent(shareUrl);

            return (
              <motion.div
                key={b._id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
              >
                <a href={`/blog/${b.slug}`} className="block">
                  {/* COVER IMAGE */}
                  {b.coverImage && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      {b.category && (
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-lime-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md">
                          {b.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col justify-between h-[260px]">
                    <div>
                      <div className="flex items-center text-gray-400 text-xs gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(b.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} /> {b.author || "Admin"}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug hover:text-green-700 transition">
                        {b.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3">
                        {b.content?.replace(/<[^>]+>/g, "").slice(0, 150) +
                          "..."}
                      </p>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-3 relative">
                      <div className="flex items-center gap-5">
                        {/* LIKE */}
                        <button
                          onClick={(e) => handleLike(e, b._id)}
                          className="flex items-center gap-1 hover:text-red-600 transition"
                        >
                          <Heart
                            size={16}
                            fill={b.isLiked ? "currentColor" : "none"}
                            className={b.isLiked ? "text-red-600" : ""}
                          />
                          <span className="text-xs">{b.likesCount || 0}</span>
                        </button>

                        {/* COMMENTS */}
                        <div className="flex items-center gap-1 text-gray-600">
                          <MessageSquare size={16} />
                          <span className="text-xs">
                            {b.comments?.length || 0}
                          </span>
                        </div>

                        {/* SHARE */}
                        <div className="relative" ref={shareRef}>
                          <button
                            onClick={(e) => handleShareClick(e, b._id)}
                            className="flex items-center gap-1 hover:text-green-700 transition"
                          >
                            <Share2 size={16} />
                            <span className="text-xs">Share</span>
                          </button>

                          <AnimatePresence>
                            {openShareId === b._id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-xl flex gap-2 z-50"
                              >
                                {[
                                  {
                                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                                    icon: <FaFacebook />,
                                    bg: "bg-blue-600",
                                  },
                                  {
                                    href: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
                                    icon: <FaTwitter />,
                                    bg: "bg-sky-500",
                                  },
                                  {
                                    href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}`,
                                    icon: <FaPinterest />,
                                    bg: "bg-red-600",
                                  },
                                  {
                                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                                    icon: <FaLinkedin />,
                                    bg: "bg-blue-700",
                                  },
                                  {
                                    href: `https://t.me/share/url?url=${encodedUrl}`,
                                    icon: <FaTelegramPlane />,
                                    bg: "bg-sky-600",
                                  },
                                ].map((btn, i) => (
                                  <a
                                    key={i}
                                    href={btn.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`${btn.bg} text-white w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-transform`}
                                  >
                                    {btn.icon}
                                  </a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <span className="text-green-700 text-sm font-medium hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <section className="px-6 py-16 bg-gradient-to-br from-green-50 to-green-100 mt-10 rounded-3xl max-w-5xl mx-auto shadow-lg text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">
          🍎 Be First to Taste Our Himalayan Harvest
        </h2>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          Our fresh apples and Himalayan produce are launching soon. Join the
          prelaunch waitlist to get early access, member-only prices, and
          behind-the-scenes orchard updates.
        </p>

        <a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-green-700 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-800 transition">
            Join Prelaunch Waitlist 🚀
          </button>
        </a>
      </section>

      <Footer />
    </div>
  );
}
