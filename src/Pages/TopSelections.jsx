// import React from "react";

// export default function TopSelections({ product, handleGetProductDetails }) {
//   return (
//     <div
//       className="group relative cursor-pointer bg-[#FFF8E1] rounded-2xl shadow-md transition hover:shadow-xl hover:-translate-y-1 max-w-sm mx-auto overflow-hidden"
//       onClick={() => handleGetProductDetails(product)}
//     >
//       <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
//         <img
//           src={product?.image || "/default-image.png"}
//           alt={product?.title || "Product Image"}
//           className="w-full h-full transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="p-5 text-center">
//         <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#F08C7D] transition">
//           {product?.title}
//         </h2>

//         <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//           {product?.description}
//         </p>

//         <button
//           className="mt-4 inline-block w-full rounded-lg bg-[#F08C7D] text-white text-sm font-semibold py-2.5 transition duration-200 hover:bg-[#e67a6c] hover:shadow-md"
//         >
//           Shop Now
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function TopSelections({ product }) {
  return (
    <div
      className="group relative bg-[#FFF8E1] rounded-2xl shadow-md transition hover:shadow-xl hover:-translate-y-1 max-w-sm mx-auto overflow-hidden"
    >
      <div className="relative w-full h-full bg-white flex items-center justify-center overflow-hidden">
        <img
          src={product?.image || "/default-image.png"}
          alt={product?.title || "Product Image"}
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5 text-center">
        <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#F08C7D] transition">
          {product?.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {product?.description}
        </p>
      </div>
    </div>
  );
}
