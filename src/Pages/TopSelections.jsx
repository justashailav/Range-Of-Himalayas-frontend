import React from "react";

export default function TopSelections({ product }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* The main product image */}
      <img
        src={product?.image || "/default-image.png"}
        alt={product?.name || "Product Image"}
        className="w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
      />

      {/* Subtle "Inner Shadow" to give the product depth within the frame */}
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />

      {/* Decorative "Quality Seal" or Badge (Optional) */}
      {product?.isNew && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-[#D84C3C] text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
            New Arrival
          </div>
        </div>
      )}
      
      {/* Glossy Overlay effect for that "glass" look */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-700" />
    </div>
  );
}