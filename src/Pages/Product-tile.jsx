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
    <div className="group relative bg-white rounded-2xl border border-gray-100 
                shadow-sm hover:shadow-xl transition-all duration-300 
                max-w-sm mx-auto overflow-hidden">

  {/* IMAGE SECTION */}
  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">

    {/* MAIN IMAGE */}
    <img
      src={mainImage}
      alt={product?.title}
      className="w-full h-full object-cover transition-all duration-500 
                 group-hover:scale-105 group-hover:opacity-0"
    />

    {/* HOVER IMAGE */}
    {images[1] && (
      <img
        src={images[1]}
        alt="hover"
        className="absolute inset-0 w-full h-full object-cover 
                   opacity-0 transition-all duration-500 
                   group-hover:opacity-100 group-hover:scale-105"
      />
    )}

    {/* BADGE */}
    {stock === 0 ? (
      <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full 
                       bg-red-600 text-white font-medium shadow">
        Out of Stock
      </span>
    ) : stock < 10 ? (
      <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full 
                       bg-orange-500 text-white font-medium shadow">
        Only {stock} left
      </span>
    ) : salesPrice > 0 ? (
      <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full 
                       bg-green-600 text-white font-medium shadow">
        Sale
      </span>
    ) : null}

    {/* WISHLIST */}
    <button
      onClick={() =>
        handleAddToWishList(
          product._id,
          stock,
          hasSizes ? selectedSize : "",
          selectedWeight
        )
      }
      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white 
                 shadow-md flex items-center justify-center 
                 transition hover:scale-110 hover:text-[#F08C7D]"
    >
      <Heart className="w-5 h-5" />
    </button>
  </div>

  {/* CONTENT */}
  <div className="p-4 space-y-3">

    {/* TITLE */}
    <h2 className="text-sm font-medium text-gray-800 line-clamp-2 
                   group-hover:text-[#F08C7D] transition">
      {product?.title}
    </h2>

    {/* PRICE */}
    <div className="flex items-center gap-2">
      {salesPrice > 0 && (
        <span className="text-sm text-gray-400 line-through">
          ₹{price.toFixed(2)}
        </span>
      )}
      <span className="text-lg font-bold text-gray-900">
        ₹{finalPrice.toFixed(2)}
      </span>
    </div>

    {/* VARIANTS */}
    {hasVariants && (
      <div className="flex gap-2">
        {hasSizes && (
          <select
            value={selectedSize}
            onChange={(e) => {
              const size = e.target.value;
              setSelectedSize(size);
              setSelectedWeight(getWeightsBySize(size)[0]);
            }}
            className="flex-1 rounded-lg border border-gray-200 
                       px-2 py-1.5 text-sm bg-white 
                       focus:ring-1 focus:ring-[#F08C7D] 
                       focus:border-[#F08C7D]"
          >
            {sizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        )}

        <select
          value={selectedWeight}
          onChange={(e) => setSelectedWeight(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 
                     px-2 py-1.5 text-sm bg-white 
                     focus:ring-1 focus:ring-[#F08C7D] 
                     focus:border-[#F08C7D]"
        >
          {getWeightsBySize(selectedSize).map((weight) => (
            <option key={weight}>{weight}</option>
          ))}
        </select>
      </div>
    )}

    {/* ADD TO CART */}
    {stock === 0 ? (
      <button disabled
        className="w-full bg-gray-200 text-gray-500 rounded-lg py-2">
        Out of Stock
      </button>
    ) : (
      <button
        onClick={() => {
          handleAddToCart(
            product._id,
            stock,
            hasSizes ? selectedSize : "",
            selectedWeight
          );
          setOpenCartSheet?.(true);
        }}
        className="w-full bg-[#F08C7D] text-white font-medium 
                   rounded-lg py-2.5 
                   hover:bg-[#ee7f6e] 
                   transition duration-300"
      >
        Add to Cart
      </button>
    )}
  </div>
</div>
  );
}
