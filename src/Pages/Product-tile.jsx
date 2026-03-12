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
    <div className="group relative bg-[#FCFBFA] rounded-[2rem] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 max-w-sm mx-auto overflow-hidden">
  
  {/* IMAGE SECTION */}
  <div className="relative aspect-[4/5] overflow-hidden m-2 rounded-[1.5rem] bg-gray-50">
    {/* MAIN IMAGE */}
    <img
      src={mainImage}
      alt={product?.title}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />

    {/* HOVER IMAGE overlay */}
    {images[1] && (
      <img
        src={images[1]}
        alt={`${product?.title} hover`}
        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    )}

    {/* LUXE BADGES */}
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      {stock === 0 ? (
        <span className="backdrop-blur-md bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          Out of Stock
        </span>
      ) : stock < 10 ? (
        <span className="backdrop-blur-md bg-orange-500/80 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          Rare: {stock} left
        </span>
      ) : salesPrice > 0 ? (
        <span className="backdrop-blur-md bg-[#D84C3C] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          Sale
        </span>
      ) : null}
    </div>

    {/* WISHLIST BUTTON */}
    <button
      onClick={() => handleAddToWishList(product._id, stock, hasSizes ? selectedSize : "", selectedWeight)}
      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md 
                 flex items-center justify-center text-gray-900 shadow-sm
                 hover:bg-[#D84C3C] hover:text-white transition-all duration-300 transform active:scale-90"
    >
      <Heart className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} />
    </button>
  </div>

  {/* CONTENT SECTION */}
  <div className="p-6 pt-2 flex flex-col gap-4">
    <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Himalayan Origin</p>
        <h2 className="text-lg font-serif text-gray-900 line-clamp-1 group-hover:text-[#D84C3C] transition-colors">
        {product?.title}
        </h2>
    </div>

    {/* PRICE AREA */}
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-gray-900">
        ₹{finalPrice.toFixed(0)}
      </span>
      {salesPrice > 0 && (
        <span className="text-sm text-gray-400 line-through decoration-red-400/50">
          ₹{price.toFixed(0)}
        </span>
      )}
    </div>

    {/* REFINED VARIANTS */}
    {hasVariants && (
      <div className="flex gap-3">
        {hasSizes && (
          <div className="flex-1">
            <label className="text-[9px] uppercase font-bold text-gray-400 mb-1 block">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => {
                const size = e.target.value;
                setSelectedSize(size);
                setSelectedWeight(getWeightsBySize(size)[0]);
              }}
              className="w-full bg-transparent rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#D84C3C] focus:border-[#D84C3C] outline-none appearance-none cursor-pointer"
            >
              {sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1">
          <label className="text-[9px] uppercase font-bold text-gray-400 mb-1 block">Weight</label>
          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="w-full bg-transparent rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#D84C3C] focus:border-[#D84C3C] outline-none appearance-none cursor-pointer"
          >
            {getWeightsBySize(selectedSize).map((weight) => (
              <option key={weight}>{weight}</option>
            ))}
          </select>
        </div>
      </div>
    )}

    {/* CTA BUTTON */}
    <div className="pt-2">
      {stock === 0 ? (
        <button disabled className="w-full bg-gray-100 text-gray-400 text-sm font-bold uppercase tracking-widest py-4 rounded-xl cursor-not-allowed">
          Sold Out
        </button>
      ) : (
        <button
          onClick={() => {
            handleAddToCart(product._id, stock, hasSizes ? selectedSize : "", selectedWeight);
            setOpenCartSheet?.(true);
          }}
          className="w-full bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.2em] 
                     rounded-xl py-4 shadow-lg shadow-gray-200
                     hover:bg-[#D84C3C] hover:shadow-[#D84C3C]/20
                     transition-all duration-300 active:scale-[0.98]"
        >
          Add to Cart
        </button>
      )}
    </div>
  </div>
</div>
  );
}
