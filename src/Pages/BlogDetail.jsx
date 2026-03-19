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
  Clock,
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
import { AnimatePresence } from "framer-motion";
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
    className="relative w-full h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] bg-stone-900 shadow-2xl"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    {/* PARALLAX IMAGE EFFECT */}
    <motion.img
      src={blog.coverImage}
      alt={blog.title}
      className="w-full h-full object-cover opacity-60 md:opacity-70"
      initial={{ scale: 1.15, filter: "blur(10px)" }}
      animate={{ scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    />

    {/* VIGNETTE & OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />

    {/* HERO CONTENT */}
    <div className="absolute inset-0 flex flex-col justify-end pb-8 md:pb-16 px-5 md:px-20 lg:px-32">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="max-w-4xl"
      >
        {/* REFINED CATEGORY TAG */}
        {blog.category && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 md:px-4 md:py-1.5 rounded-full mb-4 md:mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#B23A2E] animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.2em] md:tracking-[0.3em]">
              {blog.category}
            </span>
          </motion.div>
        )}

        {/* HERO TITLE: Responsive Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight md:tracking-tighter leading-[1.1] md:leading-[0.9] drop-shadow-2xl">
          {blog.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="font-light italic text-stone-400 block md:inline mt-1 md:mt-0">
            {blog.title.split(" ").slice(-1)}
          </span>
        </h1>

        {/* META DATA: Minimalist Footer - Grid layout for mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-stone-400 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 group cursor-help">
            <div className="p-1.5 md:p-2 rounded-full bg-white/5 group-hover:bg-[#B23A2E] transition-colors">
              <User size={12} className="text-white md:w-[14px] md:h-[14px]" />
            </div>
            <span className="text-stone-200 truncate max-w-[100px] md:max-w-none">
              {blog.author || "Range Of Himalayas"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 md:p-2 rounded-full bg-white/5">
              <Calendar size={12} className="text-white md:w-[14px] md:h-[14px]" />
            </div>
            <span className="text-stone-200">
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short", // Short month for mobile space
                year: "numeric",
              })}
            </span>
          </div>

          {/* ESTIMATED READ TIME: Visible on all screens for utility */}
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <div className="p-1.5 md:p-2 rounded-full bg-white/5">
              <Clock size={12} className="text-white md:w-[14px] md:h-[14px]" />
            </div>
            <span className="text-stone-200">6 Min Read</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* SCROLL INDICATOR: Hidden on mobile to keep clean UI */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute bottom-6 right-10 hidden lg:block"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 rotate-90 translate-y-8">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </motion.div>
  </motion.div>
)}

      {/* Main Blog Content */}
     <motion.div
  className="max-w-4xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-16 bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] mt-[-30px] md:mt-[-50px] relative z-20 border border-stone-100 mb-10"
  variants={fadeUp}
  initial="hidden"
  animate="visible"
>
  {blog && (
    <>
      {/* ARTICLE CONTENT */}
      <motion.div
        variants={fadeUp}
        custom={0.1}
        className="prose prose-stone prose-sm md:prose-lg max-w-none 
             prose-p:text-stone-600 prose-p:leading-[1.7] md:prose-p:leading-[1.8] prose-p:font-medium
             prose-headings:text-stone-900 prose-headings:tracking-tighter prose-headings:font-black
             prose-strong:text-stone-900 prose-em:text-[#B23A2E]
             prose-img:rounded-[1.5rem] md:prose-img:rounded-[2rem] prose-img:shadow-xl"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* TAGS */}
      {blog.tags?.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={0.15}
          className="flex flex-wrap items-center gap-2 md:gap-3 mt-10 md:mt-12 pt-8 border-t border-stone-50"
        >
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-stone-400 mr-2 w-full mb-2 md:w-auto md:mb-0">
            Tagged:
          </span>
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-stone-50 text-stone-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-300"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* SHARE SECTION: Cinematic Footer */}
      <motion.div
        variants={fadeUp}
        custom={0.2}
        className="mt-12 md:mt-16 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-stone-50 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1 text-center md:text-left">
          <p className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
            Pass it on
          </p>
          <h4 className="text-lg md:text-xl font-black text-stone-900 tracking-tighter">
            Share this story
          </h4>
        </div>

        <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
          {[
            { href: `fb-link`, icon: <FaFacebook size={16} />, color: "hover:bg-blue-600" },
            { href: `tw-link`, icon: <FaTwitter size={16} />, color: "hover:bg-sky-500" },
            { href: `li-link`, icon: <FaLinkedin size={16} />, color: "hover:bg-blue-700" },
            { href: `pt-link`, icon: <FaPinterest size={16} />, color: "hover:bg-red-600" },
          ].map((btn, i) => (
            <motion.a
              key={i}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-white text-stone-400 shadow-sm border border-stone-100 transition-all ${btn.color} hover:text-white hover:shadow-lg`}
            >
              {btn.icon}
            </motion.a>
          ))}

          <motion.button
            whileHover={{ y: -4 }}
            onClick={handleCopyLink}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-stone-900 text-white shadow-xl relative group"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-10 bg-stone-900 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* COMMENTS: The Conversation */}
      <motion.section variants={fadeUp} custom={0.25} className="mt-16 md:mt-20">
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-stone-900 whitespace-nowrap">
            The Conversation{" "}
            <span className="text-stone-300 ml-1">
              ({blog.comments?.length || 0})
            </span>
          </h3>
          <div className="h-px flex-1 bg-stone-100" />
        </div>

        <div className="space-y-6 mb-10 md:mb-12">
          {blog.comments?.length > 0 ? (
            blog.comments.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative pl-5 md:pl-6 border-l-2 border-stone-100 hover:border-[#B23A2E] transition-colors"
              >
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1 group-hover:text-stone-900 transition-colors">
                  {c.username}
                </p>
                <p className="text-stone-600 text-sm md:text-[15px] leading-relaxed italic">
                  "{c.comment}"
                </p>
              </motion.div>
            ))
          ) : (
            <div className="py-8 md:py-10 text-center border-2 border-dashed border-stone-100 rounded-[1.5rem] md:rounded-[2rem]">
              <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest px-4">
                No voices here yet — start the discussion.
              </p>
            </div>
          )}
        </div>

        {/* ADD COMMENT */}
        <div className="bg-stone-50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-stone-100 flex flex-col gap-4">
          <textarea
            rows={1}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-transparent border-none px-4 py-2 text-sm font-medium focus:ring-0 placeholder:text-stone-400 resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddComment}
            disabled={posting}
            className="w-full sm:w-auto self-end bg-stone-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#B23A2E] disabled:opacity-40 transition-all"
          >
            {posting ? "Publishing..." : "Post Comment"}
          </motion.button>
        </div>
      </motion.section>
    </>
  )}
</motion.div>
    </div>
  );
}
