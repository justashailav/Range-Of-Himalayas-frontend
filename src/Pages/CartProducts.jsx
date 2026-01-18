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
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-3 w-[180px] sm:w-[200px]">
  {/* BADGE */}
  {(totalStock === 0 || totalStock < 10 || (salePrice > 0 && salePrice < price)) && (
    <div className="absolute top-2 left-2 z-10">
      {totalStock === 0 ? (
        <span className="bg-red-600 text-white px-2 py-0.5 text-xs rounded">
          Out of Stock
        </span>
      ) : totalStock < 10 ? (
        <span className="bg-orange-500 text-white px-2 py-0.5 text-xs rounded">
          Only {totalStock} left
        </span>
      ) : (
        <span className="bg-green-600 text-white px-2 py-0.5 text-xs rounded">
          Sale
        </span>
      )}
    </div>
  )}

  {/* IMAGE */}
  <div className="w-full h-36 rounded-lg overflow-hidden bg-gray-50">
    <img
      src={product?.image || "/default-image.png"}
      alt={product?.title}
      className="w-full h-full object-cover"
    />
  </div>

  {/* CONTENT */}
  <div className="mt-3 flex flex-col">
    <h2 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
      {product?.title}
    </h2>

    {/* PRICE */}
    <div className="flex gap-2 items-center mt-1">
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

    {/* VARIANTS */}
    <div className="flex gap-2 mt-2">
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
      className={`mt-3 w-full text-sm font-semibold rounded-lg transition py-2 ${
        totalStock === 0
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-[#F08C7D] text-white hover:bg-white hover:text-[#F08C7D] border border-[#F08C7D]"
      }`}
    >
      {totalStock === 0 ? "Out of Stock" : "+ Add"}
    </button>
  </div>
</div>

  );
}
