import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "@/store/slices/reviewSlice";
import { FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";
dayjs.extend(relativeTime);

export default function CustomerReviews() {
  const dispatch = useDispatch();
  const { allReviews: reviews, isLoading } = useSelector(
    (state) => state.reviews,
  );
  const productDetails = useSelector((state) => state.product.productDetails);
  const scrollContainer = useRef(null);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: direction === "left" ? -350 : 350,
        behavior: "smooth",
      });
    }
  };

  const averageRating =
    reviews && reviews.length
      ? (
          reviews.reduce((sum, r) => sum + (r.reviewValue || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-20 space-y-6">
        {/* --- 1. THE VERTICAL ACCENT --- */}
        <div className="text-center space-y-6 md:space-y-8 px-4 py-12 md:py-20">
          {/* --- 1. EDITORIAL LINE & BADGE --- */}
          <div className="flex flex-col items-center gap-3">
            {/* Height reduced for mobile, full height for desktop */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "3rem" }} /* 48px on mobile */
              viewport={{ once: true }}
              className="md:h-16 w-[1px] bg-stone-200"
            />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#B23A2E] whitespace-nowrap"
            >
              Testimonials
            </motion.span>
          </div>

          {/* --- 2. THE TYPOGRAPHIC HEADLINE --- */}
          {/* text-4xl on mobile prevents letter clipping; text-7xl remains for desktop impact */}
          <h2 className="text-4xl md:text-7xl font-black text-stone-900 uppercase tracking-tight md:tracking-tighter leading-[1] md:leading-[0.85]">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="block"
            >
              Echoes From
            </motion.span>
            <br className="hidden md:block" />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif italic font-light lowercase tracking-normal text-stone-800 block md:inline mt-1 md:mt-0"
            >
              The Valley
            </motion.span>
          </h2>

          {/* --- 3. SUBTLE DECORATIVE BREAK (Optional) --- */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <div className="h-[1px] w-4 bg-stone-200" />
            <div className="w-1 h-1 bg-stone-300 rotate-45" />
            <div className="h-[1px] w-4 bg-stone-200" />
          </div>
        </div>

        {/* --- 3. THE ARCHIVE SUBTEXT --- */}
        <div className="relative max-w-2xl mx-auto pt-8">
          {/* Subtle decorative quote mark */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl font-serif text-stone-100 -z-10">
            “
          </span>

          <p className="text-stone-500 font-serif italic text-lg leading-relaxed">
            "Authentic reflections from those who have invited our harvest into
            their homes—a record of shared trust and mountain-grown quality."
          </p>

          {/* Bottom separator */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="h-[1px] w-12 bg-stone-200" />
            <div className="w-1.5 h-1.5 rounded-full border border-stone-300" />
            <div className="h-[1px] w-12 bg-stone-200" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
     <div className="flex justify-center mb-16 md:mb-24 px-6">
  <div className="w-full max-w-5xl">
    {/* 1. TOP LABEL & DATE */}
    <div className="flex justify-between items-end mb-6 px-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-[1px] bg-[#B23A2E]" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
          Harvest Ledger
        </span>
      </div>
      <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest hidden sm:block">
        Updated: Mar 2026
      </span>
    </div>

    {/* 2. THE FLOATING GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 items-center border-y border-stone-200 py-12 gap-y-12 md:gap-y-0 relative">
      
      {/* 1. SCORE UNIT */}
      <div className="flex flex-col items-center md:items-start md:pl-8 group">
        <div className="flex gap-1 mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`text-[8px] ${i < 5 ? "text-[#B23A2E]" : "text-stone-200"}`} />
          ))}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl md:text-7xl font-black text-stone-900 tracking-tighter leading-none">
            {averageRating}
          </span>
          <span className="text-[#B23A2E] font-serif italic text-xl">/ 5.0</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-4">
          Quality Rating
        </span>
      </div>

      {/* 2. VOLUME UNIT - Centered with vertical markers */}
      <div className="flex flex-col items-center relative py-4 md:py-0">
        {/* Subtle Vertical Borders for Desktop */}
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-16 w-[1px] bg-stone-200" />
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-[1px] bg-stone-200" />
        
        <span className="text-6xl md:text-7xl font-black text-stone-900 tracking-tighter leading-none font-mono">
          {String(reviews?.length || 0).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-4 text-center">
          Customer <br className="md:hidden" /> Manuscripts
        </span>
      </div>

      {/* 3. VERIFICATION STAMP - Stylized as an Official Seal */}
      <div className="flex flex-col items-center md:items-end md:pr-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Rotating Text Border Effect */}
          <div className="absolute inset-0 border border-dashed border-stone-200 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="w-14 h-14 rounded-full border border-stone-100 flex flex-col items-center justify-center bg-stone-50/50">
             <span className="text-[8px] font-black text-stone-900 uppercase">HLYN</span>
             <span className="text-[7px] text-[#B23A2E] font-mono">2026</span>
          </div>
        </div>
        <div className="mt-4 text-center md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">
            Heritage Verified
          </p>
          <p className="text-[9px] font-serif italic text-stone-400 mt-1">
            "Trust grown in stone"
          </p>
        </div>
      </div>
    </div>

    {/* 3. FOOTER TAGS */}
    <div className="flex justify-center md:justify-start gap-8 mt-6 opacity-30 px-2 grayscale">
       <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
         <span className="text-[8px] font-black uppercase tracking-widest">Organic Standard</span>
       </div>
       <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />
         <span className="text-[8px] font-black uppercase tracking-widest">Boutique Batch</span>
       </div>
    </div>
  </div>
</div>

      {/* Reviews Section */}
     {isLoading ? (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-12 h-12 border-t-2 border-[#B23A2E] rounded-full animate-spin" />
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Accessing Archives...</p>
  </div>
) : reviews?.length === 0 ? (
  <div className="text-center py-20 border border-dashed border-stone-200 rounded-[2rem]">
    <p className="font-serif italic text-stone-400">The ledger is currently empty.</p>
  </div>
) : (
  <div className="relative max-w-7xl mx-auto group/slider">
    {/* --- SCROLL CONTAINER --- */}
    <div
      ref={scrollContainer}
      className="flex overflow-x-auto gap-6 md:gap-10 px-6 md:px-12 py-12 scroll-smooth no-scrollbar snap-x snap-mandatory items-end"
    >
      {reviews.map((r, i) => (
        <div
          key={i}
          /* UI CHANGE: Alternate heights for an editorial look */
          className={`bg-white min-w-[80vw] md:min-w-[420px] border-b-4 border-r border-l border-t border-stone-100 rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-xl rounded-br-xl hover:border-[#B23A2E]/30 transition-all duration-700 p-8 md:p-10 flex-shrink-0 flex flex-col justify-between group/card snap-center shadow-sm hover:shadow-xl
          ${i % 2 === 0 ? 'h-[500px] md:h-[550px]' : 'h-[450px] md:h-[500px]'}`}
        >
          <div className="relative">
            {/* Top Left: Archive Index */}
            <span className="absolute -top-4 -left-4 font-mono text-[10px] text-stone-300">
              #{String(i + 1).padStart(3, '0')}
            </span>

            {/* Product Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 bg-[#B23A2E] rounded-full" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B23A2E]">
                  Verified Dispatch
                </span>
              </div>
              <h3 className="font-serif italic text-xl md:text-2xl text-stone-900 leading-none">
                {r.productId?.title}
              </h3>
            </div>

            {/* The Message: Bigger and more impactful */}
            <p className="text-stone-600 font-serif italic text-lg md:text-xl leading-relaxed mb-8 line-clamp-5">
              "{r.reviewMessage}"
            </p>

            {/* Rating: Minimalist Dots instead of Stars */}
            <div className="flex gap-2 mb-8">
              {[...Array(5)].map((_, starIndex) => (
                <div
                  key={starIndex}
                  className={`w-1.5 h-1.5 rounded-full ${starIndex < r.reviewValue ? "bg-[#B23A2E]" : "bg-stone-100"}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Review Image: Stylized with a 'Polaroid' feel */}
            {r.reviewImages?.length > 0 && (
              <div className="relative group/img aspect-video overflow-hidden rounded-lg bg-stone-50 border border-stone-100">
                <img
                  src={`http://localhost:3000/${r.reviewImages[0].replace("\\", "/")}`}
                  alt="review"
                  className="w-full h-full object-cover scale-110 group-hover/img:scale-100 transition-transform duration-1000"
                />
              </div>
            )}

            {/* Footer: Modern Minimalist */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="font-black text-stone-900 text-xs uppercase tracking-[0.2em]">
                  {r.userName}
                </p>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  {dayjs(r.createdAt).format('MM // YYYY')}
                </p>
              </div>
              
              {/* Vertical Text Accent */}
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-stone-200 rotate-180 [writing-mode:vertical-lr]">
                Himalayan Harvest
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* --- FOOTER UI: FRACTIONAL COUNTER --- */}
    <div className="mt-12 flex flex-col items-center space-y-4">
      <div className="flex items-center gap-6">
        <div className="h-[1px] w-12 bg-stone-200" />
        <div className="flex items-baseline gap-2 font-mono">
          <span className="text-xl font-black text-stone-900">01</span>
          <span className="text-stone-300 text-xs">/</span>
          <span className="text-stone-400 text-xs">{String(reviews.length).padStart(2, '0')}</span>
        </div>
        <div className="h-[1px] w-12 bg-stone-200" />
      </div>
      
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-400 animate-pulse">
        Swipe to navigate ledger
      </p>
    </div>
  </div>
)}
    </div>
  );
}
