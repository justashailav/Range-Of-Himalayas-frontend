import React from "react";

export default function TopSelections({ product }) {
  return (
    <div className="relative w-full h-full overflow-hidden group-hover:cursor-zoom-in">
      {/* 1. Base Image with refined scaling */}
      <img
        src={product?.image || "/default-image.png"}
        alt={product?.name || "Product Image"}
        className="w-full h-full object-cover object-center transition-transform duration-[2s] cubic-bezier(0.2, 1, 0.3, 1) group-hover:scale-110"
      />

      {/* 2. Soft Ambient Lighting Overlay (Top-Down) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none" />

      {/* 3. The "Glass Flash" - A subtle light beam that sweeps across on hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.2s] ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* 4. Refined Depth: Double Shadow
          Inner shadow for the "frame" look + Bottom vignette to pop the text later */}
      <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),inset_0_-20px_40px_rgba(0,0,0,0.1)] pointer-events-none" />

      {/* 5. Minimalist Floating Badge */}
      {product?.isNew && (
        <div className="absolute top-5 left-5 z-20 overflow-hidden">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[7px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-sm shadow-xl">
            Limited
          </div>
        </div>
      )}

      {/* 6. Subtle Texture/Grain Overlay (Optional for that 'Premium Print' feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
}