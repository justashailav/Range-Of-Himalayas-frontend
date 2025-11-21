import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogBySlug, addCommentToBlog } from "@/store/slices/blogSlice";

import {
  Calendar,
  User,
  Share2,
  MessageSquare,
  Tag,
  Copy,
  Check,
} from "lucide-react";

import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";

export default function BlogDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentBlog: blog } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) dispatch(fetchBlogBySlug(slug));
  }, [slug, dispatch]);

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Oops! You need to login");
      return;
    }
    if (!comment.trim()) return;

    setPosting(true);
    try {
      await dispatch(addCommentToBlog(blog._id, comment));
      setComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const shareUrl = `${window.location.origin}/blog/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Soft animation variant
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut", delay },
    }),
  };

  return (
    <div className="bg-[#FFF8E1] min-h-screen">
      {blog && (
        <Helmet>
          <title>{blog.metaTitle || blog.title}</title>
          <meta
            name="description"
            content={
              blog.metaDescription ||
              blog.content?.replace(/<[^>]+>/g, "").slice(0, 160)
            }
          />
        </Helmet>
      )}

      {/* Header Image */}
      {blog?.coverImage && (
        <motion.div
          className="relative w-full h-[60vh] overflow-hidden rounded-b-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover brightness-75"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

          <motion.div
            className="absolute bottom-10 left-6 md:left-20 text-white"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            {blog.category && (
              <span className="bg-pink-500/80 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {blog.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold mt-3 mb-2 drop-shadow-md">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 text-sm opacity-90 mt-4">
              <span className="flex items-center gap-1">
                <User size={16} /> {blog.author || "Team Range Of Himalayas"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Blog Content */}
      <motion.div
        className="max-w-6xl mx-auto px-6 md:px-10 py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm mt-[-20px] relative z-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {blog && (
          <>
            <motion.div
              variants={fadeUp}
              custom={0.1}
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <motion.div
                variants={fadeUp}
                custom={0.15}
                className="flex flex-wrap items-center gap-2 mt-8 border-t border-gray-200 pt-4"
              >
                <Tag size={18} className="text-pink-600" />
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-pink-100 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              variants={fadeUp}
              custom={0.2}
              className="flex flex-wrap items-center gap-5 mt-10 border-t border-gray-100 pt-6"
            >
              <p className="font-medium text-gray-600 flex items-center gap-2">
                <Share2 size={18} /> Share this post:
              </p>

              <motion.div
                className="flex gap-3 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[
                  {
                    href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                    color: "bg-blue-600",
                    icon: <FaFacebook size={16} />,
                  },
                  {
                    href: `https://twitter.com/intent/tweet?url=${shareUrl}`,
                    color: "bg-sky-400",
                    icon: <FaTwitter size={16} />,
                  },
                  {
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
                    color: "bg-blue-700",
                    icon: <FaLinkedin size={16} />,
                  },
                  {
                    href: `https://pinterest.com/pin/create/button/?url=${shareUrl}`,
                    color: "bg-red-500",
                    icon: <FaPinterest size={16} />,
                  },
                  {
                    href: `https://t.me/share/url?url=${shareUrl}`,
                    color: "bg-sky-600",
                    icon: <FaTelegram size={16} />,
                  },
                ].map((btn, i) => (
                  <motion.a
                    key={i}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.13 }}
                    className={`p-2 rounded-full ${btn.color} text-white shadow-sm`}
                  >
                    {btn.icon}
                  </motion.a>
                ))}

                {/* Copy Link */}
                <motion.button
                  whileHover={{ scale: 1.13 }}
                  onClick={handleCopyLink}
                  className="p-2 rounded-full bg-gray-700 text-white shadow-sm relative"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}

                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-[-26px] left-1/2 -translate-x-1/2 text-[11px] bg-gray-800 text-white px-2 py-1 rounded-md shadow-sm"
                    >
                      Copied!
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Comments */}
            <motion.section
              variants={fadeUp}
              custom={0.25}
              className="mt-12 border-t border-gray-200 pt-8"
            >
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <MessageSquare size={22} /> Comments ({blog.comments?.length || 0})
              </h3>

              {/* Comments List */}
              <div className="space-y-4 mb-8">
                {blog.comments?.length > 0 ? (
                  blog.comments.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <p className="font-semibold text-gray-900">{c.username}</p>

                      <p className="text-gray-600 text-sm mt-1">{c.comment}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">Be the first to comment 🌿</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddComment}
                  disabled={posting}
                  className="bg-pink-600 text-white px-6 py-2 rounded-xl hover:bg-pink-700 disabled:opacity-60 shadow-sm transition"
                >
                  {posting ? "Posting..." : "Post Comment"}
                </motion.button>
              </div>
            </motion.section>
          </>
        )}
      </motion.div>
    </div>
  );
}
