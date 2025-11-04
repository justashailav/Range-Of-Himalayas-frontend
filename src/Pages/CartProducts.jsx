import React, { useState, useEffect } from "react";

export default function CartProductCard({
  product,
  handleAddToCart,
  setOpenCartSheet,
}) {
  // Use dynamic sizes and weights from backend, fallback to defaults
  const backendVariants = product?.variants || [];
  const sizes = [...new Set(backendVariants.map((v) => v.size))];

  const getWeightsBySize = (size) =>
    backendVariants.filter((v) => v.size === size).map((v) => v.weight);

  const getVariant = (size, weight) =>
    backendVariants.find((v) => v.size === size && v.weight === weight) || {
      size,
      weight: "Standard",
      stock: 0,
      price: 0,
      salesPrice: 0,
    };

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(sizes[0])[0] || "Standard"
  );

  const selectedVariant = getVariant(selectedSize, selectedWeight);
  const totalStock = Number(selectedVariant.stock) || 0;
  const price = Number(selectedVariant.price) || 0;
  const salePrice = Number(selectedVariant.salesPrice) || 0;
  const weight = selectedVariant.weight || "Standard";

  const handleAddClick = () => {
    handleAddToCart(product._id, totalStock, selectedSize, selectedWeight);
    setOpenCartSheet(true);
  };

  return (
    <div className="flex items-center bg-white m-4 p-4 rounded-md shadow-md border border-gray-200 space-x-4 w-full max-w-md relative overflow-hidden">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border  relative">
        <img
          src={product?.image || "/default-image.png"}
          alt={product?.title || "Product Image"}
          
        />
      </div>

      {/* Badge */}
      <div className="absolute top-1 left-4">
        {totalStock === 0 ? (
          <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded shadow-lg">
            Out Of Stock
          </span>
        ) : totalStock < 10 ? (
          <span className="bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded shadow-lg">
            Only {totalStock} left
          </span>
        ) : salePrice > 0 && salePrice < price ? (
          <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded shadow-lg">
            Sale
          </span>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow justify-between h-full">
        {/* Title */}
        <h2 className="text-sm font-semibold text-gray-800">{product?.title}</h2>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span
            className={`${
              salePrice > 0 && salePrice < price
                ? "line-through text-gray-400"
                : "text-gray-900"
            } text-sm font-semibold`}
          >
            ₹{price.toFixed(2)}
          </span>
          {salePrice > 0 && salePrice < price && (
            <span className="text-sm font-semibold text-red-600">
              ₹{salePrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600 mt-1">Weight: {weight}</div>
        <div className="flex gap-2 mt-2">
          <select
            value={selectedSize}
            onChange={(e) => {
              const size = e.target.value;
              setSelectedSize(size);
              setSelectedWeight(getWeightsBySize(size)[0] || "Standard");
            }}
            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-[#F08C7D] focus:border-[#F08C7D]"
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
            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-[#F08C7D] focus:border-[#F08C7D]"
          >
            {getWeightsBySize(selectedSize).map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddClick}
          disabled={totalStock === 0}
          className={`mt-2 w-full rounded-md font-semibold text-sm transition duration-300 ${
            totalStock === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-[#F08C7D] text-white hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D]"
          }`}
        >
          {totalStock === 0 ? "Out Of Stock" : "+ Add"}
        </button>
      </div>
    </div>
  );
}
