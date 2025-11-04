import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
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
} from "lucide-react";
import { PiPinterestLogoBold, PiTelegramLogoBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [activeShare, setActiveShare] = useState(null);
  let closeTimer = null;

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleLike = (e, blogId) => {
    e.preventDefault(); // prevent <a> navigation when liking
    e.stopPropagation();
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
    <div className="bg-[#FFF8E1] min-h-screen">
      <Helmet>
        <title>Our Blogs | Range of Himalayas</title>
        <meta
          name="description"
          content="Explore the Range of Himalayas blog — stories, wellness insights, and Himalayan freshness. Learn about our apples, kiwis, and the pure natural lifestyle we promote."
        />
        <meta
          name="keywords"
          content="Himalayan apples, fresh fruits, organic kiwis, health blog, natural lifestyle, Range of Himalayas"
        />
        <meta property="og:title" content="Our Blogs | Range of Himalayas" />
        <meta
          property="og:description"
          content="Discover the latest stories, tips, and insights from the Himalayas. Fresh perspectives on health, nature, and taste."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dwxebof4m/image/upload/v1729934210/himalayas-cover.jpg"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-center text-[#3B2F2F] mb-4 tracking-tight">
          Our Blogs
        </h2>
        <p className="text-center text-[#5C4033] mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover stories, tips, and insights fresh from the Himalayas —
          crafted to inspire a healthy, natural lifestyle.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {blogs?.map((b) => {
            const shareUrl = `${window.location.origin}/blog/${b.slug}`;
            return (
              <motion.div
                key={b._id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300"
              >
                {/* Wrap the card inside <a> */}
                <a href={`/blog/${b.slug}`} className="block cursor-pointer">
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

                        <div className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          <span>{b.comments?.length || 0}</span>
                        </div>

                        <div
                          className="relative"
                          onMouseEnter={() => handleMouseEnter(b._id)}
                          onMouseLeave={handleMouseLeave}
                          onClick={(e) => e.preventDefault()}
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
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
