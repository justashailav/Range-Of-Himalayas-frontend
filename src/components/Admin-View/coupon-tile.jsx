// import React from "react";
// import { Button } from "../ui/button";

// export default function CouponTile({ coupon, handleDelete, handleEdit }) {
//   const formattedExpiry = new Date(coupon.expiresAt).toLocaleDateString("en-CA");

//   return (
//     <div className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition-all duration-200">
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
//           {coupon.code}
//         </h2>
//         <span
//           className={`inline-block px-2 py-1 text-xs font-medium rounded ${
//             coupon.isActive
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {coupon.isActive ? "Active" : "Inactive"}
//         </span>
//       </div>

//       <div className="p-4 space-y-2">
//         <p className="text-gray-700">
//           <span className="font-medium">Discount:</span>{" "}
//           {coupon.discountType === "percentage"
//             ? `${coupon.discountValue}%`
//             : `₹${coupon.discountValue.toFixed(2)}`}
//         </p>
//         <p className="text-gray-700">
//           <span className="font-medium">Min Order:</span> ₹
//           {coupon.minOrderAmount.toFixed(2)}
//         </p>

//         <p className="text-gray-700">
//           <span className="font-medium">Usage Limit:</span> {coupon.usageLimit}
//         </p>
//         <p className="text-gray-700">
//           <span className="font-medium">Expires At:</span> {formattedExpiry}
//         </p>
//         <div className="flex justify-end mt-4 gap-2">
//           <Button
//             onClick={() => handleEdit(coupon)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//           >
//             Edit
//           </Button>
//           <Button
//             onClick={() => handleDelete(coupon._id)}
//             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
//           >
//             Delete
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Button } from "../ui/button";
import { Tag, Calendar, DollarSign, Users, Percent } from "lucide-react";

export default function CouponTile({ coupon, handleDelete, handleEdit }) {
  const formattedExpiry = coupon.expiresAt
    ? new Date(coupon.expiresAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No expiry";

  return (
    <div className="relative bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFF5F3] p-4 flex items-center justify-between border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
            {coupon.code}
          </h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              coupon.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {coupon.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="text-sm text-gray-500 italic">
          {coupon.discountType === "percentage" ? (
            <span className="flex items-center gap-1 text-[#F08C7D] font-semibold">
              <Percent size={16} /> {coupon.discountValue}% Off
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#F08C7D] font-semibold">
              <DollarSign size={16} /> ₹{coupon.discountValue.toFixed(2)} Off
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 text-gray-700">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#F08C7D]" />
          <span>
            <span className="font-medium">Min Order:</span> ₹
            {coupon.minOrderAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#F08C7D]" />
          <span>
            <span className="font-medium">Usage Limit:</span>{" "}
            {coupon.usageLimit || "Unlimited"}
          </span>
        </div>

        {coupon.maxUniqueUsers > 0 && (
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#F08C7D]" />
            <span>
              <span className="font-medium">First N Users:</span>{" "}
              {coupon.maxUniqueUsers}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#F08C7D]" />
          <span>
            <span className="font-medium">Expires:</span> {formattedExpiry}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <Button
          onClick={() => handleEdit(coupon)}
          className="bg-[#F08C7D] hover:bg-[#e67a6d] text-white px-4 py-2 rounded-md"
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(coupon._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
