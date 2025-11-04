import React, { useEffect, useState } from "react";
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

export default function HomeBlog() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [activeShare, setActiveShare] = useState(null);
  let closeTimer = null;

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleLike = (e, blogId) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent link click
    dispatch(toggleLikeBlog(blogId));
  };

  const handleMouseEnter = (id) => {
    if (closeTimer) clearTimeout(closeTimer);
    setActiveShare(id);
  };

  const handleMouseLeave = () => {
    closeTimer = setTimeout(() => {
      setActiveShare(null);
    }, 200);
  };

  return (
    <div className="bg-[#FFF8E1] min-h-screen relative">
      <div className="max-w-6xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-12">
          <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
            📰 Our Stories
          </span>
          <h2 className="text-4xl mt-4 font-extrabold text-[#3B2F2F] mb-3">
            From Our Himalayan Journal
          </h2>
          <p className="text-[#5C4033] max-w-2xl mx-auto leading-relaxed">
            Discover stories, tips, and insights fresh from the Himalayas — crafted to inspire a healthy, natural lifestyle.
          </p>
        </div>

        {/* Swiper Controls */}
        <button
          className="swiper-button-prev-blog absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          className="swiper-button-next-blog absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
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
            const shareUrl = `${window.location.origin}/blog/${b.slug}`;
            return (
              <SwiperSlide key={b._id}>
                {/* ✅ Replaced navigate() with <a> */}
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
                      <div className="relative w-full h-56 overflow-hidden">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {b.category && (
                          <span className="absolute top-4 left-4 bg-pink-600/80 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {b.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-6 flex flex-col justify-between h-[260px]">
                      <div>
                        <div className="flex items-center text-gray-400 text-xs gap-3 mb-2">
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

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug hover:text-pink-600 transition-colors duration-300">
                          {b.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {b.metaDescription ||
                            b.content?.replace(/<[^>]+>/g, "").slice(0, 150) +
                              "..."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-gray-500 text-xs border-t border-gray-100 pt-3 relative">
                        <div className="flex items-center gap-4">
                          {/* ❤️ Like */}
                          <button
                            onClick={(e) => handleLike(e, b._id)}
                            className="flex items-center gap-1 hover:text-pink-600 transition"
                          >
                            <Heart
                              size={14}
                              fill={b.isLiked ? "currentColor" : "none"}
                              className={b.isLiked ? "text-pink-600" : ""}
                            />
                            <span>{b.likesCount || 0}</span>
                          </button>

                          {/* 💬 Comments */}
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span>{b.comments?.length || 0}</span>
                          </div>

                          {/* 🔗 Share */}
                          <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(b._id)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="flex items-center gap-1 hover:text-pink-600 transition">
                              <Share2 size={14} />
                              <span>Share</span>
                            </button>

                            <AnimatePresence>
                              {activeShare === b._id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-full flex items-center gap-3 px-4 py-2 z-50"
                                >
                                  <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:scale-110 transition-transform"
                                  >
                                    <Facebook size={16} />
                                  </a>
                                  <a
                                    href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-500 hover:scale-110 transition-transform"
                                  >
                                    <Twitter size={16} />
                                  </a>
                                  <a
                                    href={`https://pinterest.com/pin/create/button/?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-500 hover:scale-110 transition-transform"
                                  >
                                    <PiPinterestLogoBold size={17} />
                                  </a>
                                  <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:scale-110 transition-transform"
                                  >
                                    <Linkedin size={16} />
                                  </a>
                                  <a
                                    href={`https://t.me/share/url?url=${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-600 hover:scale-110 transition-transform"
                                  >
                                    <PiTelegramLogoBold size={17} />
                                  </a>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <span className="text-pink-600 text-sm font-medium hover:underline">
                          Read More →
                        </span>
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
