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
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-green-100 text-green-700 font-medium px-4 py-1 rounded-full text-sm mb-4">
          🍏 Customer Reviews
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Real feedback from those who’ve experienced our Himalayan freshness.
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center mb-16">
        <div className="bg-white shadow-md rounded-2xl px-10 py-6 flex items-center gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Average Rating
            </p>
          </div>
          <div className="border-l border-gray-200 h-14"></div>
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">
              {reviews?.length || 0}
            </p>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Total Reviews
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews?.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="relative max-w-6xl mx-auto">
          {/* Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-gray-50 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div
            ref={scrollContainer}
            className="flex overflow-x-auto gap-6 px-10 scroll-smooth no-scrollbar"
          >
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white min-w-[320px] sm:min-w-[350px] rounded-2xl shadow-sm hover:shadow-md transition p-6 flex-shrink-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-red-500">
                    {r.productId?.title}
                  </h3>
                  <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex mb-3">
                  {[...Array(r.reviewValue)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  {[...Array(5 - r.reviewValue)].map((_, i) => (
                    <FaStar key={i} className="text-gray-300" />
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  "{r.reviewMessage}"
                </p>

                {r.reviewImages?.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={`http://localhost:3000/${r.reviewImages[0].replace(
                        "\\",
                        "/"
                      )}`}
                      alt="review"
                      className="w-full h-40 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 border-t pt-3">
                  <div className="bg-red-500 text-white font-semibold rounded-full w-10 h-10 flex items-center justify-center">
                    {r.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{r.userName}</p>
                    <p className="text-xs text-gray-500">
                      {dayjs(r.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-gray-50 z-10"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
