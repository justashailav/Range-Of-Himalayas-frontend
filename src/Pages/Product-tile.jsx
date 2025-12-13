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

  // ----- DISTINCT SIZES (ignore empty "") -----
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0; // fruits only

  // ----- HELPERS -----
  const getWeightsBySize = (size) => {
    if (!hasSizes) {
      // dry fruits → all weights
      return variants.map(v => v.weight);
    }
    return variants.filter(v => v.size === size).map(v => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find(
      v =>
        (hasSizes ? v.size === size : true) &&
        v.weight === weight
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
    <div className="relative bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
      {/* IMAGE */}
      <img
        src={mainImage}
        alt={product?.title}
        className="w-full h-56 object-cover rounded-t-2xl"
      />

      {/* BADGES */}
      {stock === 0 ? (
        <Badge className="absolute top-2 left-2 bg-red-500">Out Of Stock</Badge>
      ) : stock < 10 ? (
        <Badge className="absolute top-2 left-2 bg-orange-500">
          Only {stock} left
        </Badge>
      ) : salesPrice > 0 ? (
        <Badge className="absolute top-2 left-2 bg-green-500">Sale</Badge>
      ) : null}

      {/* CONTENT */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product?.title}
        </h2>

        {/* PRICE */}
        <div className="flex justify-between items-center mb-2">
          <span className="line-through text-gray-400">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-green-600 font-bold text-lg">
            ₹{finalPrice.toFixed(2)}
          </span>
        </div>

        {/* VARIANT SELECTORS */}
        {hasVariants && (
          <div className="mb-3 flex gap-2">
            {/* SIZE → ONLY IF EXISTS */}
            {hasSizes && (
              <select
                value={selectedSize}
                onChange={(e) => {
                  const size = e.target.value;
                  setSelectedSize(size);
                  setSelectedWeight(getWeightsBySize(size)[0]);
                }}
                className="flex-1 border rounded-md px-3 py-2"
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
              className="flex-1 border rounded-md px-3 py-2"
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
          <Button disabled className="w-full opacity-60">
            Out Of Stock
          </Button>
        ) : (
          <div className="flex gap-3">
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
              className="flex-1 bg-[#F08C7D] text-white border-2 border-[#F08C7D]
               hover:bg-white hover:text-[#F08C7D]"
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
              className="flex-1 bg-[#F08C7D] text-white border-2 border-[#F08C7D]
               hover:bg-white hover:text-[#F08C7D] flex items-center gap-2"
            >
              <Heart />
              Wishlist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
