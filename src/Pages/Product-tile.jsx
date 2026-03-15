import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function ShoppingProductTile({
  product,
  handleAddToCart,
  handleAddToWishList,
  setOpenCartSheet,
}) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0; // fruits only

  // ----- HELPERS -----
  const getWeightsBySize = (size) => {
    if (!hasSizes) {
      // dry fruits → all weights
      return variants.map((v) => v.weight);
    }
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find(
      (v) => (hasSizes ? v.size === size : true) && v.weight === weight,
    ) || null;

  // ----- STATE -----
  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0] : "");
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(hasSizes ? sizes[0] : "")[0] || "",
  );
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ----- INIT VARIANT -----
  useEffect(() => {
    if (hasVariants) {
      const w = getWeightsBySize(selectedSize)[0];
      setSelectedWeight(w);
      setSelectedVariant(getVariant(selectedSize, w));
    }
  }, [product]);

  useEffect(() => {
    if (hasVariants && selectedWeight) {
      setSelectedVariant(getVariant(selectedSize, selectedWeight));
    }
  }, [selectedSize, selectedWeight]);

  // ----- PRICE / STOCK -----
  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice = selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;
  const finalPrice = salesPrice > 0 ? salesPrice : price;

  const mainImage = product?.image;
  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : [product?.image].filter(Boolean);
  return (
    <div className="group relative bg-[#FCFBFA] rounded-[2.5rem] border border-gray-100 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(142,125,110,0.2)] hover:-translate-y-2 max-w-sm mx-auto overflow-hidden">
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-[2rem] bg-[#F3F0EB]">
        {/* MAIN IMAGE */}
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />

        {/* HOVER IMAGE overlay */}
        {images[1] && (
          <img
            src={images[1]}
            alt={`${product?.title} hover`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {/* LUXE BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {stock === 0 ? (
            <span className="backdrop-blur-md bg-black/40 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          ) : stock < 10 ? (
            <span className="backdrop-blur-md bg-orange-500/60 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Only {stock} left
            </span>
          ) : salesPrice > 0 ? (
            <span className="backdrop-blur-md bg-[#D84C3C]/80 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Sale
            </span>
          ) : null}
        </div>

        {/* WISHLIST BUTTON (Simplified) */}
        <button
          onClick={() =>
            handleAddToWishList(
              product._id,
              stock,
              hasSizes ? selectedSize : "",
              selectedWeight,
            )
          }
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/60 backdrop-blur-md 
                 flex items-center justify-center text-gray-900 shadow-sm
                 hover:bg-white hover:text-[#D84C3C] transition-all duration-300 transform active:scale-90"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Gradient Blend - blends image into card base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F3F0EB]/40 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* CONTENT SECTION */}
      <div className="p-7 pt-2 flex flex-col gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-4 bg-[#D84C3C]" />
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#D84C3C] font-black">
              Himalayan Origin
            </p>
          </div>
          <h2 className="text-xl font-serif text-gray-900 line-clamp-1 group-hover:text-[#D84C3C] transition-colors duration-300">
            {product?.title}
          </h2>
        </div>

        {/* REFINED VARIANTS */}
        {hasVariants && (
          <div className="flex gap-3">
            {hasSizes && (
              <div className="flex-1">
                <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-1.5 block">
                  Size
                </label>
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      const size = e.target.value;
                      setSelectedSize(size);
                      setSelectedWeight(getWeightsBySize(size)[0]);
                    }}
                    className="w-full bg-[#F7F3F0] rounded-xl border-none px-3 py-2.5 text-[11px] font-bold text-gray-700 outline-none appearance-none cursor-pointer hover:bg-[#EBE5E0] transition-colors"
                  >
                    {sizes.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1">
              <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-1.5 block">
                Weight
              </label>
              <div className="relative">
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="w-full bg-[#F7F3F0] rounded-xl border-none px-3 py-2.5 text-[11px] font-bold text-gray-700 outline-none appearance-none cursor-pointer hover:bg-[#EBE5E0] transition-colors"
                >
                  {getWeightsBySize(selectedSize).map((weight) => (
                    <option key={weight}>{weight}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA BUTTON */}
        <div className="pt-1">
          {stock === 0 ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] py-4 rounded-2xl cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={() => {
                handleAddToCart(
                  product._id,
                  stock,
                  hasSizes ? selectedSize : "",
                  selectedWeight,
                );
                setOpenCartSheet?.(true);
              }}
              className="w-full bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] 
                     rounded-2xl py-4 flex items-center justify-center gap-3
                     hover:bg-[#D84C3C] transition-all duration-500 active:scale-[0.98] shadow-xl shadow-black/5"
            >
              <span>Add to Cart</span>
              <span className="opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-500">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
