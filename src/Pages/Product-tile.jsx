import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function ShoppingProductTile({
  product,
  handleAddToCart,
  setOpenCartSheet,
  handleAddToWishList,
}) {
  const backendVariants = product?.variants || [];
  const sizes = [...new Set(backendVariants.map((v) => v.size))];

  const getWeightsBySize = (size) =>
    backendVariants.filter((v) => v.size === size).map((v) => v.weight);

  const getVariant = (size, weight) =>
    backendVariants.find((v) => v.size === size && v.weight === weight) || {
      size,
      weight,
      stock: 0,
      price: 0,
      salesPrice: 0,
      images: [product?.image], 
    };

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(sizes[0])[0] || ""
  );

  const selectedVariant = getVariant(selectedSize, selectedWeight);

  const totalStock = Number(selectedVariant?.stock) || 0;
  const price = Number(selectedVariant?.price) || 0;
  const salePrice = Number(selectedVariant?.salesPrice) || 0;

  // Hover / zoom state
  const [hoverImage, setHoverImage] = useState(
    selectedVariant.images?.[0] || product?.image
  );

  const mainImage = selectedVariant.images?.[0] || product?.image;
  const secondImage = selectedVariant.images?.[1] || mainImage;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
      <div
        className="overflow-hidden rounded-t-xl relative group"
        style={{ cursor: "zoom-in" }}
      >
        <img
          src={hoverImage}
          alt={product?.title || "Product Image"}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 transform group-hover:scale-110"
          onMouseEnter={() => setHoverImage(secondImage)}
          onMouseLeave={() => setHoverImage(mainImage)}
        />
      </div>
      {totalStock === 0 ? (
        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
          Out Of Stock
        </Badge>
      ) : totalStock < 10 ? (
        <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
          Only {totalStock} left
        </Badge>
      ) : salePrice > 0 && salePrice < price ? (
        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
          Sale
        </Badge>
      ) : null}

      <div className="mt-4 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product?.title}
        </h2>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              salePrice > 0 && salePrice < price
                ? "line-through text-gray-400"
                : "text-primary"
            } text-lg font-semibold`}
          >
            ₹{price.toFixed(2)}
          </span>
          {salePrice > 0 && salePrice < price ? (
            <span className="text-lg font-semibold">₹{salePrice.toFixed(2)}</span>
          ) : null}
        </div>
        <div className="mb-3 flex gap-2">
          <select
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              setSelectedWeight(getWeightsBySize(e.target.value)[0] || "");
            }}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#F08C7D] focus:border-[#F08C7D]"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#F08C7D] focus:border-[#F08C7D]"
          >
            {getWeightsBySize(selectedSize).map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        {totalStock === 0 ? (
          <Button className="mt-2 w-full opacity-60 cursor-not-allowed" disabled>
            Out Of Stock
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={() => {
                handleAddToCart(product._id, totalStock, selectedSize, selectedWeight);
                setOpenCartSheet(true);
              }}
              className="mt-2 flex-1 font-semibold bg-[#F08C7D] text-white py-4 rounded-lg 
               hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition"
            >
              Add to cart
            </Button>

            <Button
              onClick={() => {
                handleAddToWishList(product._id, totalStock, selectedSize, selectedWeight);
              }}
              className="mt-2 flex-1 font-semibold bg-[#F08C7D] text-white py-4 rounded-lg 
               hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition flex items-center justify-center gap-2"
            >
              <Heart />
              <span>WishList</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
