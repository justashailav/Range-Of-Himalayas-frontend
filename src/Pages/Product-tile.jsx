import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, ChevronDown, ArrowRight } from "lucide-react";

export default function ShoppingProductTile({
  product,
  handleAddToCart,
  handleAddToWishList,
  setOpenCartSheet,
}) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0;

  // ----- STATE & LOGIC -----
  const getWeightsBySize = (size) => {
    if (!hasSizes) return variants.map((v) => v.weight);
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find((v) => (hasSizes ? v.size === size : true) && v.weight === weight) || null;

  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0] : "");
  const [selectedWeight, setSelectedWeight] = useState(getWeightsBySize(hasSizes ? sizes[0] : "")[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(null);

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

  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice = selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;
  const finalPrice = salesPrice > 0 ? salesPrice : price;
  const mainImage = product?.image;
  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [product?.image].filter(Boolean);

  const handleAction = (type) => {
    handleAddToCart(product._id, stock, hasSizes ? selectedSize : "", selectedWeight);
    setOpenCartSheet?.(true);
  };

  return (
    <div className="group relative bg-white rounded-[3rem] p-3 border border-stone-100 transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(40,30,20,0.12)] hover:-translate-y-3 max-w-sm mx-auto overflow-hidden">
      
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#F9F7F4]">
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
        />

        {images[1] && (
          <img
            src={images[1]}
            alt={`${product?.title} hover`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
          />
        )}

        {/* TOP OVERLAYS */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {salesPrice > 0 && (
              <span className="bg-[#D84C3C] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                Special Offer
              </span>
            )}
            <span className="bg-white/80 backdrop-blur-md text-stone-800 text-[9px] font-bold uppercase tracking-tighter px-3 py-1.5 rounded-full border border-stone-200/50">
              {stock > 0 ? `In Stock: ${stock}` : "Sold Out"}
            </span>
          </div>
          
          <button
            onClick={() => handleAddToWishList(product._id, stock, hasSizes ? selectedSize : "", selectedWeight)}
            className="h-12 w-12 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-stone-900 shadow-xl transition-all duration-500 hover:bg-[#D84C3C] hover:text-white transform hover:rotate-12 active:scale-90"
          >
            <Heart className="w-5 h-5" fill={product?.isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* BOTTOM PRICE TAG */}
        <div className="absolute bottom-6 left-6">
          <div className="bg-stone-900/90 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-110">
            <div className="flex items-baseline gap-2">
              <span className="text-white text-xl font-medium tracking-tight">₹{finalPrice}</span>
              {salesPrice > 0 && <span className="text-white/40 text-xs line-through">₹{price}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="px-5 py-6 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D84C3C] font-bold">
            Pure Himalayan
          </p>
          <h2 className="text-2xl font-serif text-stone-900 tracking-tight leading-tight">
            {product?.title}
          </h2>
        </div>

        {/* SELECTION GRID */}
        {hasVariants && (
          <div className="grid grid-cols-2 gap-3">
            {hasSizes && (
              <div className="relative group/select">
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value);
                    setSelectedWeight(getWeightsBySize(e.target.value)[0]);
                  }}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-[11px] font-bold text-stone-700 appearance-none transition-all hover:bg-stone-100 outline-none focus:ring-2 focus:ring-[#D84C3C]/20"
                >
                  {sizes.map((size) => <option key={size}>{size}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
              </div>
            )}
            <div className="relative group/select">
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
                className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-[11px] font-bold text-stone-700 appearance-none transition-all hover:bg-stone-100 outline-none focus:ring-2 focus:ring-[#D84C3C]/20"
              >
                {getWeightsBySize(selectedSize).map((weight) => (
                  <option key={weight}>{weight}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* BUTTON ACTIONS */}
        <div className="space-y-3">
          {stock === 0 ? (
            <button disabled className="w-full bg-stone-100 text-stone-400 text-xs font-bold uppercase tracking-widest py-5 rounded-[1.5rem] cursor-not-allowed">
              Out of Season
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAction("buy-now")}
                className="group/btn w-full bg-[#D84C3C] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all duration-500 hover:bg-[#bd3e31] hover:shadow-[0_20px_40px_-10px_rgba(216,76,60,0.4)] active:scale-[0.97]"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-500 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
              </button>

              <button
                onClick={() => handleAction("add-to-cart")}
                className="w-full bg-stone-900 text-white text-[11px] font-bold uppercase tracking-[0.2em] py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all duration-500 hover:bg-black active:scale-[0.97]"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}