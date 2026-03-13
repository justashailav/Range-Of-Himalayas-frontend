import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, toggleLikeBlog } from "@/store/slices/blogSlice";

import {
  Calendar,
  User,
  MessageSquare,
  Share2,
  Heart,
  ArrowRight,
} from "lucide-react";

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

  // Soft motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut", delay },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay = 0) => ({
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", delay },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: (delay = 0) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", delay },
    }),
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
        {/* Heading */}
        <div className="relative mb-16 text-center">
          {/* DECORATIVE LINE OVERLAY */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "80px", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-px bg-[#B23A2E] mx-auto mb-6"
          />

          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="block text-[10px] font-black uppercase tracking-[0.6em] text-stone-400 mb-2"
          >
            Field Notes & Stories
          </motion.span>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl font-black text-[#2E1F1A] tracking-tighter"
          >
            Our{" "}
            <span className="font-light italic text-stone-400">Journal</span>
          </motion.h2>

          {/* SUBTLE CAPTION */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="mt-4 text-stone-500 text-xs font-medium max-w-xs mx-auto leading-relaxed"
          >
            Exploring the traditions, harvests, and soul of the Himalayan
            foothills.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          custom={0.2}
          className="flex flex-col items-center mb-16"
        >
          {/* DECORATIVE ICON OR ELEMENT */}
          <div className="flex items-center gap-4 mb-6 opacity-20">
            <div className="h-[1px] w-6 bg-[#5C4033]" />
            <div className="w-1 h-1 rounded-full bg-[#5C4033]" />
            <div className="h-[1px] w-6 bg-[#5C4033]" />
          </div>

          <motion.p className="text-center text-[#5C4033] max-w-xl mx-auto font-medium leading-relaxed italic">
            <span className="text-xl md:text-2xl font-serif text-stone-900 not-italic block mb-2">
              Wisdom from the peaks.
            </span>
            <span className="text-[13px] md:text-[15px] tracking-wide text-stone-500 font-light">
              Discover inspiring stories and natural heritage—curated and sent
              <span className="text-[#B23A2E] font-black italic ml-1 underline underline-offset-4 decoration-stone-200">
                straight from the heart of the Himalayas.
              </span>
            </span>
          </motion.p>
        </motion.div>

        {/* Blog Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.2}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16"
        >
          {blogs?.map((b, idx) => {
            const shareUrl = b.slug
              ? `${window.location.origin}/blog/${b.slug}`
              : window.location.origin;
            const encodedUrl = encodeURIComponent(shareUrl);

            return (
              <motion.article
                key={b._id}
                variants={scaleIn}
                custom={idx * 0.1}
                className="group cursor-pointer"
              >
                <a href={`/blog/${b.slug}`} className="block space-y-6">
                  {/* IMAGE CONTAINER: High-End Magazine Style */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 shadow-sm border border-stone-100">
                    <img
                      src={b.coverImage || "/placeholder.png"}
                      alt={b.title}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />

                    {/* FLOATING CATEGORY TAG */}
                    {b.category && (
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-stone-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border border-stone-200/50">
                          {b.category}
                        </span>
                      </div>
                    )}

                    {/* HOVER OVERLAY FOR INTERACTION */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-stone-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#B23A2E]" />
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-200" />
                      <span>By {b.author || "Admin"}</span>
                    </div>

                    <h3 className="text-2xl font-black text-stone-900 leading-[1.1] tracking-tighter group-hover:text-[#B23A2E] transition-colors duration-300">
                      {b.title}
                    </h3>

                    <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 font-medium">
                      {b.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
                    </p>

                    {/* ACTION ROW */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-6">
                        {/* LIKE */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleLike(e, b._id);
                          }}
                          className="flex items-center gap-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Heart
                            size={16}
                            fill={b.isLiked ? "currentColor" : "none"}
                            className={b.isLiked ? "text-red-500" : ""}
                          />
                          <span className="text-[10px] font-black">
                            {b.likesCount || 0}
                          </span>
                        </button>

                        {/* SHARE TRIGGER */}
                        <div className="relative group/share">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleShareClick(e, b._id);
                            }}
                            className="flex items-center gap-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            <Share2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Share
                            </span>
                          </button>

                          <AnimatePresence>
                            {openShareId === b._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-10 left-0 bg-stone-900 p-2 rounded-2xl shadow-2xl flex gap-2 z-50"
                              >
                                {[
                                  {
                                    href: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
                                    icon: <FaTwitter />,
                                    color: "hover:bg-sky-500",
                                  },
                                  {
                                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                                    icon: <FaFacebook />,
                                    color: "hover:bg-blue-600",
                                  },
                                  {
                                    href: `https://t.me/share/url?url=${encodedUrl}`,
                                    icon: <FaTelegramPlane />,
                                    color: "hover:bg-sky-600",
                                  },
                                ].map((btn, i) => (
                                  <a
                                    key={i}
                                    href={btn.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-white transition-all ${btn.color}`}
                                  >
                                    {btn.icon}
                                  </a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B23A2E] flex items-center gap-2 group-hover:gap-3 transition-all underline underline-offset-4 decoration-stone-200">
                        Read Entry <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </a>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* PRELAUNCH CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative px-8 py-20 bg-[#1C1C1C] mt-24 rounded-[3.5rem] max-w-5xl mx-auto overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)]"
      >
        {/* DECORATIVE ORCHARD MIST (Subtle Background Gradient) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-stone-800/40 via-transparent to-transparent opacity-50" />

        {/* TEXTURED WATERMARK */}
        <div className="absolute -bottom-10 -left-10 opacity-[0.03] text-[15rem] font-black text-white pointer-events-none select-none italic tracking-tighter">
          Harvest
        </div>
      </motion.section>
      <Footer />
    </div>
  );
}
