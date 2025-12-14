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
      (v) => (hasSizes ? v.size === size : true) && v.weight === weight
    ) || null;

  // ----- STATE -----
  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0] : "");
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(hasSizes ? sizes[0] : "")[0] || ""
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

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto overflow-hidden">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-56 object-cover"
        />

        {/* BADGES */}
        {stock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-600 text-white">
            Out of Stock
          </Badge>
        ) : stock < 10 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
            Only {stock} left
          </Badge>
        ) : salesPrice > 0 ? (
          <Badge className="absolute top-3 left-3 bg-green-600 text-white">
            Sale
          </Badge>
        ) : null}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">
        {/* TITLE */}
        <h2 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
          {product?.title}
        </h2>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          {salesPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{price.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-green-700">
            ₹{finalPrice.toFixed(2)}
          </span>
        </div>

        {/* VARIANTS */}
        {hasVariants && (
          <div className="flex gap-2">
            {/* SIZE */}
            {hasSizes && (
              <select
                value={selectedSize}
                onChange={(e) => {
                  const size = e.target.value;
                  setSelectedSize(size);
                  setSelectedWeight(getWeightsBySize(size)[0]);
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}

            {/* WEIGHT */}
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
            >
              {getWeightsBySize(selectedSize).map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ACTIONS */}
        {stock === 0 ? (
          <Button
            disabled
            className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
          >
            Out of Stock
          </Button>
        ) : (
          <div className="flex gap-2 mt-2">
            <Button
              onClick={() => {
                handleAddToCart(
                  product._id,
                  stock,
                  hasSizes ? selectedSize : "",
                  selectedWeight
                );
                setOpenCartSheet?.(true);
              }}
              className="flex-1 bg-[#F08C7D] text-white font-medium
                     hover:bg-white hover:text-[#F08C7D]
                     border-2 border-[#F08C7D]
                     transition-colors duration-200"
            >
              Add to Cart
            </Button>

            <Button
              onClick={() =>
                handleAddToWishList(
                  product._id,
                  stock,
                  hasSizes ? selectedSize : "",
                  selectedWeight
                )
              }
              className="flex-1 bg-white text-[#F08C7D] font-medium
                     border-2 border-[#F08C7D]
                     hover:bg-[#F08C7D] hover:text-white
                     transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
