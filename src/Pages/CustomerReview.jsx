// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllReviews } from "@/store/slices/reviewSlice";
// import { FaStar } from "react-icons/fa";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// dayjs.extend(relativeTime);

// export default function CustomerReviews() {
//   const dispatch = useDispatch();
//   const { allReviews: reviews, isLoading } = useSelector(
//     (state) => state.reviews
//   );

//   useEffect(() => {
//     dispatch(getAllReviews());
//   }, [dispatch]);

//   const averageRating =
//     reviews && reviews.length
//       ? (
//           reviews.reduce((sum, r) => sum + (r.reviewValue || 0), 0) /
//           reviews.length
//         ).toFixed(1)
//       : 0;

//   return (
//     <div>
//       <div className="text-center mb-12">
//         <div className="inline-flex items-center bg-green-100 text-green-700 font-medium px-4 py-1 rounded-full text-sm mb-4">
//           🍏 Customer Reviews
//         </div>
//         <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//           What Our Customers Say
//         </h2>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//           Real feedback from those who’ve experienced our Himalayan freshness.
//         </p>
//       </div>
//       <div className="flex justify-center mb-16">
//         <div className="bg-white shadow-md rounded-2xl px-10 py-6 flex items-center gap-8">
//           <div className="text-center">
//             <div className="flex justify-center mb-2">
//               {[...Array(5)].map((_, i) => (
//                 <FaStar
//                   key={i}
//                   className={`text-xl ${
//                     i < Math.round(averageRating)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//             <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
//             <p className="text-gray-500 font-medium text-sm mt-1">
//               Average Rating
//             </p>
//           </div>
//           <div className="border-l border-gray-200 h-14"></div>
//           <div className="text-center">
//             <p className="text-4xl font-bold text-gray-900">
//               {reviews?.length || 0}
//             </p>
//             <p className="text-gray-500 font-medium text-sm mt-1">
//               Total Reviews
//             </p>
//           </div>
//         </div>
//       </div>
//       {isLoading ? (
//         <p className="text-center text-gray-500">Loading reviews...</p>
//       ) : reviews?.length === 0 ? (
//         <p className="text-center text-gray-500">No reviews yet.</p>
//       ) : (
//         <div className="relative max-w-6xl mx-auto">
//           <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-gray-50">
//             <ChevronLeft className="w-5 h-5 text-gray-700" />
//           </button>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
//             {reviews.map((r, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-semibold text-red-500">
//                     {r.productId?.title }
//                   </h3>
//                   <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">
//                     Verified
//                   </span>
//                 </div>

//                 <div className="flex mb-3">
//                   {[...Array(r.reviewValue)].map((_, i) => (
//                     <FaStar key={i} className="text-yellow-400" />
//                   ))}
//                   {[...Array(5 - r.reviewValue)].map((_, i) => (
//                     <FaStar key={i} className="text-gray-300" />
//                   ))}
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4">
//                   "{r.reviewMessage}"
//                 </p>

//                 {r.reviewImages?.length > 0 && (
//                   <div className="mb-4">
//                     <img
//                       src={`http://localhost:3000/${r.reviewImages[0].replace(
//                         "\\",
//                         "/"
//                       )}`}
//                       alt="review"
//                       className="w-full h-40 object-cover rounded-lg shadow-sm"
//                     />
//                   </div>
//                 )}

//                 <div className="flex items-center gap-3 border-t pt-3">
//                   <div className="bg-red-500 text-white font-semibold rounded-full w-10 h-10 flex items-center justify-center">
//                     {r.userName.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{r.userName}</p>
//                     <p className="text-xs text-gray-500">
//                       {dayjs(r.createdAt).fromNow()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-gray-50">
//             <ChevronRight className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews } from "@/store/slices/reviewSlice";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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
      <div className="flex justify-center mb-16 md:mb-24 px-4">
  <div className="relative group w-full max-w-lg md:max-w-5xl">
    {/* --- DECORATIVE ARCHIVE FRAME --- */}
    {/* Hidden on mobile to keep the UI clean, visible on desktop for that 'boxed' feel */}
    <div className="absolute -inset-2 md:-inset-4 border border-stone-100 rounded-[2rem] md:rounded-[3rem] -z-10 group-hover:border-stone-200 transition-colors duration-700" />

    <div className="bg-white border border-stone-200 rounded-[1.5rem] md:rounded-[2rem] px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      
      {/* 1. SCORE UNIT */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-[9px] md:text-[10px] ${
                i < Math.round(averageRating)
                  ? "text-[#B23A2E]" 
                  : "text-stone-200"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
            {averageRating}
          </span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1 md:mt-2">
            Average Grade
          </span>
        </div>
      </div>

      {/* --- RESPONSIVE DIVIDER --- */}
      {/* Horizontal on mobile, Vertical on Desktop */}
      <div className="flex md:flex-col items-center gap-2 w-full md:w-auto">
        <div className="flex-grow md:flex-none w-full md:w-[1px] h-[1px] md:h-8 bg-stone-100" />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-200 flex-shrink-0" />
        <div className="flex-grow md:flex-none w-full md:w-[1px] h-[1px] md:h-8 bg-stone-100" />
      </div>

      {/* 2. VOLUME UNIT */}
      <div className="text-center">
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter font-mono">
            {String(reviews?.length || 0).padStart(2, "0")}
          </span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-1 md:mt-2">
            Total Entries
          </span>
        </div>
      </div>

      {/* 3. VERIFICATION STAMP */}
      {/* Now visible on mobile but styled as a small footer note */}
      <div className="pt-4 md:pt-0 md:border-l border-stone-100 md:pl-12 w-full md:w-auto">
        <div className="flex items-center justify-center md:justify-start gap-4 opacity-40">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-dashed border-stone-400 flex items-center justify-center">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-stone-400" />
          </div>
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 leading-tight text-left">
            Verified <br /> Harvest 2026
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Reviews Section */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews?.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        
        <div className="relative max-w-7xl mx-auto group/slider">
  {/* --- SCROLL CONTAINER --- */}
  <div
    ref={scrollContainer}
    className="flex overflow-x-auto gap-4 md:gap-8 px-4 md:px-10 py-10 scroll-smooth no-scrollbar snap-x snap-mandatory"
  >
    {reviews.map((r, i) => (
      <div
        key={i}
        /* MOBILE FIX: min-w-[85vw] ensures the next card is partially visible, 
           prompting a swipe without needing arrows. 
        */
        className="bg-white min-w-[85vw] md:min-w-[400px] border border-stone-100 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-700 p-6 md:p-8 flex-shrink-0 flex flex-col justify-between group/card snap-center"
      >
        <div>
          {/* Header: Product & Verification */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
                Product Reference
              </span>
              <h3 className="font-black text-stone-900 uppercase tracking-tighter text-xs md:text-sm">
                {r.productId?.title}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#B23A2E] animate-pulse" />
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-stone-400">
                Verified Dispatch
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className={`text-[9px] md:text-[10px] ${starIndex < r.reviewValue ? "text-[#B23A2E]" : "text-stone-100"}`}
              />
            ))}
          </div>

          {/* The Message */}
          <p className="text-stone-600 font-serif italic text-base md:text-lg leading-relaxed mb-6 line-clamp-4">
            "{r.reviewMessage}"
          </p>

          {/* Review Image: Responsive height */}
          {r.reviewImages?.length > 0 && (
            <div className="mb-6 relative group/img overflow-hidden rounded-xl bg-stone-100 border border-stone-200 p-1">
              <img
                src={`http://localhost:3000/${r.reviewImages[0].replace("\\", "/")}`}
                alt="review"
                className="w-full h-40 md:h-48 object-cover rounded-lg grayscale-[20%] group-hover/img:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[7px] font-mono text-stone-500">
                IMG_REC_{i + 100}
              </div>
            </div>
          )}
        </div>

        {/* Footer: User Details */}
        <div className="flex items-center justify-between border-t border-stone-50 pt-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="bg-stone-900 text-white font-black text-[9px] md:text-[10px] rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 md:border-4 border-white shadow-sm uppercase">
                {r.userName.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#B23A2E] border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="font-black text-stone-900 text-[10px] md:text-xs uppercase tracking-widest">
                {r.userName}
              </p>
              <p className="text-[9px] md:text-[10px] font-serif italic text-stone-400">
                {dayjs(r.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <div className="opacity-10 group-hover/card:opacity-30 transition-opacity">
            <span className="font-serif italic text-2xl md:text-3xl">“</span>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* --- MINIMALIST PROGRESS INDICATOR --- */}
  <div className="mt-8 flex justify-center items-center gap-4">
    <div className="h-[1px] w-24 bg-stone-100 relative overflow-hidden">
      <motion.div 
        className="absolute inset-y-0 left-0 bg-[#B23A2E] w-1/3"
        animate={{ x: ["0%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-400">
      Swipe to Browse Archive
    </span>
    <div className="h-[1px] w-24 bg-stone-100" />
  </div>
</div>
      )}
    </div>
  );
}
