import React, { useState, useMemo } from "react";

export default function CartProductCard({
  product,
  handleAddToCart,
  setOpenCartSheet,
}) {
  const variants = product?.variants || [];

  // 🔹 check if size actually exists in backend
  const hasSize = useMemo(
    () => variants.some((v) => v.size && v.size !== ""),
    [variants]
  );

  const sizes = hasSize
    ? [...new Set(variants.map((v) => v.size).filter(Boolean))]
    : [""]; // default empty size

  const getWeightsBySize = (size) =>
    variants
      .filter((v) => (hasSize ? v.size === size : true))
      .map((v) => v.weight);

  const getVariant = (size, weight) =>
    variants.find(
      (v) =>
        (hasSize ? v.size === size : true) &&
        v.weight === weight
    ) || {
      size: "",
      weight,
      stock: 0,
      price: 0,
      salesPrice: 0,
    };

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(sizes[0])[0]
  );

  const selectedVariant = getVariant(selectedSize, selectedWeight);

  const totalStock = Number(selectedVariant.stock) || 0;
  const price = Number(selectedVariant.price) || 0;
  const salePrice = Number(selectedVariant.salesPrice) || 0;

  const handleAddClick = () => {
    handleAddToCart(
      product._id,
      totalStock,
      hasSize ? selectedSize : "", // ✅ size optional
      selectedWeight
    );
    setOpenCartSheet(true);
  };

  return (
    <div className="flex items-center bg-white m-4 p-4 rounded-md shadow-md border border-gray-200 space-x-4 w-full max-w-md relative">
      {/* IMAGE */}
      <div className="w-24 h-24 rounded-md overflow-hidden border">
        <img
          src={product?.image || "/default-image.png"}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* BADGE */}
      <div className="absolute top-2 left-2">
        {totalStock === 0 ? (
          <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">
            Out of Stock
          </span>
        ) : totalStock < 10 ? (
          <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded">
            Only {totalStock} left
          </span>
        ) : salePrice > 0 && salePrice < price ? (
          <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
            Sale
          </span>
        ) : null}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1">
        <h2 className="text-sm font-semibold text-gray-800">
          {product?.title}
        </h2>

        {/* PRICE */}
        <div className="flex gap-2 items-center">
          <span
            className={`text-sm font-semibold ${
              salePrice > 0 ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            ₹{price.toFixed(2)}
          </span>
          {salePrice > 0 && (
            <span className="text-sm font-semibold text-red-600">
              ₹{salePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* VARIANT SELECTORS */}
        <div className="flex gap-2 mt-2">
          {/* SIZE → only if exists */}
          {hasSize && (
            <select
              value={selectedSize}
              onChange={(e) => {
                const size = e.target.value;
                setSelectedSize(size);
                setSelectedWeight(getWeightsBySize(size)[0]);
              }}
              className="flex-1 border rounded px-2 py-1 text-xs"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* WEIGHT */}
          <select
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-xs"
          >
            {getWeightsBySize(selectedSize).map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={handleAddClick}
          disabled={totalStock === 0}
          className={`mt-2 w-full text-sm font-semibold rounded-md transition ${
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
