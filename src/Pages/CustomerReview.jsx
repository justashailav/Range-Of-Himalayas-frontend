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
    (state) => state.reviews
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
  <div className="flex flex-col items-center gap-3">
    <div className="h-16 w-[1px] bg-stone-200" />
    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B23A2E]">
      Testimonials
    </span>
  </div>

  {/* --- 2. THE TYPOGRAPHIC HEADLINE --- */}
  <h2 className="text-5xl md:text-7xl font-black text-stone-900 uppercase tracking-tighter leading-[0.9]">
    Echoes From <br className="hidden md:block" />
    <span className="font-serif italic font-light lowercase tracking-normal text-stone-800">
      The Valley
    </span>
  </h2>

  {/* --- 3. THE ARCHIVE SUBTEXT --- */}
  <div className="relative max-w-2xl mx-auto pt-8">
    {/* Subtle decorative quote mark */}
    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl font-serif text-stone-100 -z-10">
      “
    </span>
    
    <p className="text-stone-500 font-serif italic text-lg leading-relaxed">
      "Authentic reflections from those who have invited our 
      harvest into their homes—a record of shared trust and 
      mountain-grown quality."
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
      <div className="flex justify-center mb-24">
  <div className="relative group">
    {/* --- DECORATIVE ARCHIVE FRAME --- */}
    <div className="absolute -inset-4 border border-stone-100 rounded-[3rem] -z-10 group-hover:border-stone-200 transition-colors duration-700" />
    
    <div className="bg-white border border-stone-200 rounded-[2rem] px-12 py-10 flex flex-col md:flex-row items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      
      {/* 1. SCORE UNIT */}
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-[10px] ${
                i < Math.round(averageRating)
                  ? "text-[#B23A2E]" // Using your signature red instead of yellow
                  : "text-stone-200"
              }`}
            />
          ))}
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black text-stone-900 tracking-tighter">
            {averageRating}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-2">
            Average Grade
          </span>
        </div>
      </div>

      {/* --- VERTICAL DIVIDER WITH DOT --- */}
      <div className="hidden md:flex flex-col items-center gap-2">
        <div className="w-[1px] h-8 bg-stone-100" />
        <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
        <div className="w-[1px] h-8 bg-stone-100" />
      </div>

      {/* 2. VOLUME UNIT */}
      <div className="text-center">
        <div className="flex flex-col items-center">
          {/* Using font-mono for numbers gives it a "Serial Number" or "Logbook" vibe */}
          <span className="text-5xl font-black text-stone-900 tracking-tighter font-mono">
            {String(reviews?.length || 0).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mt-2">
            Total Entries
          </span>
        </div>
      </div>

      {/* 3. VERIFICATION STAMP (New Detail) */}
      <div className="hidden lg:block border-l border-stone-100 pl-12">
        <div className="flex items-center gap-4 opacity-40">
          <div className="w-10 h-10 rounded-full border border-dashed border-stone-400 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-stone-400" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 leading-tight">
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
        <div className="relative max-w-7xl mx-auto px-4 group/slider">
  {/* --- CUSTOM NAVIGATION --- */}
  <button
    onClick={() => scroll("left")}
    className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full p-4 shadow-sm hover:bg-stone-900 hover:text-white transition-all duration-500 z-20 group"
  >
    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
  </button>

  <div
    ref={scrollContainer}
    className="flex overflow-x-auto gap-8 px-4 py-10 scroll-smooth no-scrollbar"
  >
    {reviews.map((r, i) => (
      <div
        key={i}
        className="bg-white min-w-[340px] md:min-w-[400px] border border-stone-100 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-700 p-8 flex-shrink-0 flex flex-col justify-between group/card"
      >
        <div>
          {/* Header: Product & Verification */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
                Product Reference
              </span>
              <h3 className="font-black text-stone-900 uppercase tracking-tighter text-sm">
                {r.productId?.title}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="w-2 h-2 rounded-full bg-[#B23A2E] animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                Verified Dispatch
              </span>
            </div>
          </div>

          {/* Rating: Archive Red Stars */}
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar 
                key={starIndex} 
                className={`text-[10px] ${starIndex < r.reviewValue ? "text-[#B23A2E]" : "text-stone-100"}`} 
              />
            ))}
          </div>

          {/* The Message: Serif Italic */}
          <p className="text-stone-600 font-serif italic text-lg leading-relaxed mb-6">
            "{r.reviewMessage}"
          </p>

          {/* Review Image: Film Frame Style */}
          {r.reviewImages?.length > 0 && (
            <div className="mb-6 relative group/img overflow-hidden rounded-xl bg-stone-100 border border-stone-200 p-1">
              <img
                src={`http://localhost:3000/${r.reviewImages[0].replace("\\", "/")}`}
                alt="review"
                className="w-full h-48 object-cover rounded-lg grayscale-[20%] group-hover/img:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-stone-500">
                IMG_REC_{i+100}
              </div>
            </div>
          )}
        </div>

        {/* Footer: User Details */}
        <div className="flex items-center justify-between border-t border-stone-50 pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-stone-900 text-white font-black text-[10px] rounded-full w-10 h-10 flex items-center justify-center border-4 border-white shadow-sm uppercase">
                {r.userName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#B23A2E] border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="font-black text-stone-900 text-xs uppercase tracking-widest">
                {r.userName}
              </p>
              <p className="text-[10px] font-serif italic text-stone-400">
                {dayjs(r.createdAt).fromNow()}
              </p>
            </div>
          </div>
          
          <div className="opacity-10 group-hover/card:opacity-30 transition-opacity">
             <span className="font-serif italic text-3xl">“</span>
          </div>
        </div>
      </div>
    ))}
  </div>

  <button
    onClick={() => scroll("right")}
    className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full p-4 shadow-sm hover:bg-stone-900 hover:text-white transition-all duration-500 z-20 group"
  >
    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </button>
</div>
      )}
    </div>
  );
}
