import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs, toggleLikeBlog } from "@/store/slices/blogSlice";
import {
  Calendar,
  User,
  MessageSquare,
  Share2,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PiPinterestLogoBold, PiTelegramLogoBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";

export default function HomeBlog() {
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
    <div className="bg-[#FFF8E1] min-h-screen relative">
      <div className="max-w-6xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-16 md:mb-20 space-y-6">
          {/* MINIMALIST BADGE */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-[1px] bg-stone-300" />{" "}
            {/* Vertical line for editorial feel */}
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B23A2E]">
              The Field Notes
            </span>
          </div>

          {/* MAIN HEADLINE */}
          <h2 className="text-4xl md:text-6xl font-black text-stone-900 uppercase tracking-tighter leading-none">
            Himalayan <br className="hidden md:block" />
            <span className="font-serif italic font-light lowercase tracking-normal">
              Journal
            </span>
          </h2>

          {/* REFINED DESCRIPTION */}
          <p className="text-stone-500 font-serif italic text-lg max-w-2xl mx-auto leading-relaxed border-t border-stone-100 pt-6">
            "A collection of seasonal observations, orchard wisdom, and natural
            insights harvested from the heart of the Himachal valleys."
          </p>

          {/* DECORATIVE ELEMENT */}
          <div className="flex justify-center items-center gap-4 pt-2">
            <div className="h-[1px] w-4 bg-stone-200" />
            <div className="w-1 h-1 bg-stone-400 rotate-45" />
            <div className="h-[1px] w-4 bg-stone-200" />
          </div>
        </div>

        {/* Swiper Controls */}
        {/* PREVIOUS BUTTON */}
        <button
          className="swiper-button-prev-blog absolute top-1/2 -left-4 lg:-left-12 z-20 -translate-y-1/2 
             bg-white/80 backdrop-blur-sm text-stone-900 
             border border-stone-200 rounded-full 
             w-14 h-14 flex items-center justify-center 
             shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
             hover:bg-stone-900 hover:text-white hover:border-stone-900
             transition-all duration-500 group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[1.5px] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* NEXT BUTTON */}
        <button
          className="swiper-button-next-blog absolute top-1/2 -right-4 lg:-right-12 z-20 -translate-y-1/2 
             bg-white/80 backdrop-blur-sm text-stone-900 
             border border-stone-200 rounded-full 
             w-14 h-14 flex items-center justify-center 
             shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
             hover:bg-stone-900 hover:text-white hover:border-stone-900
             transition-all duration-500 group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[1.5px] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Swiper Component */}
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".swiper-button-prev-blog",
            nextEl: ".swiper-button-next-blog",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {blogs?.map((b) => {
            const shareUrl = b.slug
              ? `${window.location.origin}/blog/${b.slug}`
              : window.location.origin;
            const encodedUrl = encodeURIComponent(shareUrl);
            return (
              <SwiperSlide key={b._id}>
                <a
                  href={`/blog/${b.slug}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                  }
                  className="block"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer"
                  >
                    {b.coverImage && (
                      <div className="relative w-full h-72 overflow-hidden bg-stone-100">
                        {/* THE IMAGE: Subtle desaturation that "wakes up" on hover */}
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="
        w-full h-full object-cover 
        transition-all duration-[1.5s] ease-out
        grayscale-[20%] group-hover:grayscale-0 
        group-hover:scale-110
      "
                        />

                        {/* THE VIGNETTE: Adds a soft "film" depth to the corners */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700" />

                        {/* THE CATEGORY: The "Archive Tag" */}
                        {b.category && (
                          <div className="absolute top-6 left-6 flex flex-col items-start gap-1">
                            <span
                              className="
          bg-stone-900/90 backdrop-blur-md 
          text-white text-[9px] font-black uppercase tracking-[0.25em] 
          px-4 py-1.5 rounded-sm shadow-xl
        "
                            >
                              {b.category}
                            </span>
                            {/* Decorative corner mark to make it look like a physical tag */}
                            <div className="w-[1px] h-3 bg-white/50 ml-2" />
                          </div>
                        )}

                        {/* DATE STAMP: Mimicking a film negative or printed date */}
                        <div className="absolute bottom-6 left-6 text-white/90">
                          <p className="text-[10px] font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            EXT. HIMALAYAS // 2026
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex flex-col justify-between h-[260px]">
                      <div className="p-8 space-y-4">
                        {/* METADATA: THE DISPATCH LOG */}
                        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 gap-6">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B23A2E]" />{" "}
                            {/* Signature red dot */}
                            <span>
                              {new Date(b.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-[1px] bg-stone-300" />
                            <span className="italic font-serif lowercase tracking-normal text-stone-500">
                              By {b.author || "Archive Admin"}
                            </span>
                          </div>
                        </div>

                        {/* TITLE: THE HEADLINE */}
                        <h3 className="text-xl font-black text-stone-900 leading-tight group-hover:text-[#B23A2E] transition-colors duration-500 uppercase tracking-tighter">
                          {b.title}
                        </h3>

                        {/* EXCERPT: THE PREVIEW */}
                        <p className="text-sm text-stone-500 font-serif italic leading-relaxed line-clamp-3">
                          {b.metaDescription ||
                            b.content?.replace(/<[^>]+>/g, "").slice(0, 150) +
                              "..."}
                        </p>

                        {/* DECORATIVE FOOTER: THE "READ MORE" ANCHOR */}
                        <div className="pt-2 flex items-center gap-2">
                          <div className="h-[1px] w-8 bg-stone-100 group-hover:w-12 group-hover:bg-[#B23A2E] transition-all duration-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900 transition-colors duration-500">
                            Open Entry
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-gray-500 text-xs border-t border-gray-100 pt-3 relative">
                        <div className="flex items-center gap-6 pt-4 border-t border-stone-100">
  {/* ❤️ APPRECIATE */}
  <button
    onClick={(e) => handleLike(e, b._id)}
    className="group flex items-center gap-1.5 transition-colors"
  >
    <Heart
      size={16}
      strokeWidth={b.isLiked ? 0 : 2}
      fill={b.isLiked ? "#B23A2E" : "none"}
      className={`transition-transform duration-300 group-hover:scale-125 ${
        b.isLiked ? "text-[#B23A2E]" : "text-stone-400 group-hover:text-stone-900"
      }`}
    />
    <span className={`text-[10px] font-black tracking-widest ${
      b.isLiked ? "text-stone-900" : "text-stone-400"
    }`}>
      {b.likesCount || 0}
    </span>
  </button>

  {/* 💬 NOTES */}
  <div className="flex items-center gap-1.5 text-stone-400">
    <MessageSquare size={16} strokeWidth={2} className="group-hover:text-stone-900 transition-colors" />
    <span className="text-[10px] font-black tracking-widest">
      {b.comments?.length || 0}
    </span>
  </div>

  {/* 🔗 CIRCULATE (Share) */}
  <div className="relative ml-auto" ref={shareRef}>
    <button
      onClick={(e) => handleShareClick(e, b._id)}
      className="flex items-center gap-2 group"
    >
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-400 group-hover:text-[#B23A2E] transition-colors">
        Circulate
      </span>
      <Share2 size={14} className="text-stone-400 group-hover:text-[#B23A2E] transition-transform group-hover:rotate-12" />
    </button>

    <AnimatePresence>
      {openShareId === b._id && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute bottom-12 right-0 bg-stone-900 text-white rounded-2xl p-3 shadow-2xl flex gap-3 z-50 border border-white/10"
        >
          {[
            { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <FaFacebook /> },
            { href: `https://twitter.com/intent/tweet?url=${encodedUrl}`, icon: <FaTwitter /> },
            { href: `https://whatsapp.com/send?text=${encodedUrl}`, icon: <FaWhatsapp /> },
            { href: `https://t.me/share/url?url=${encodedUrl}`, icon: <FaTelegramPlane /> },
          ].map((btn, i) => (
            <a
              key={i}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-[#B23A2E] hover:text-white transition-all duration-300"
            >
              {btn.icon}
            </a>
          ))}
          {/* Arrow pointing down to the button */}
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-stone-900 rotate-45 border-r border-b border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

                        <div className="group/link inline-flex items-center gap-3 cursor-pointer">
  {/* The Expanding Line */}
  <div className="relative w-8 h-[1px] bg-stone-200 overflow-hidden transition-all duration-500 group-hover/link:w-12 group-hover/link:bg-[#B23A2E]">
    <motion.div 
      className="absolute inset-0 bg-[#B23A2E]"
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  </div>

  {/* The Text */}
  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 group-hover/link:text-stone-900 transition-colors duration-500">
    Explore Entry
  </span>

  {/* The Subtle Chevron */}
  <ChevronRight 
    size={10} 
    className="text-stone-300 transform transition-all duration-500 group-hover/link:translate-x-1 group-hover/link:text-[#B23A2E]" 
  />
</div>
                      </div>
                    </div>
                  </motion.div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
