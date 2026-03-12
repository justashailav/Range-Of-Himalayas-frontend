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
    <div className="group relative bg-white rounded-[2rem] p-3 w-[180px] sm:w-[200px] border border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden">
  
  {/* MINIMALIST BADGES */}
  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
    {totalStock === 0 ? (
      <span className="bg-stone-900/80 backdrop-blur-md text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full">
        Sold Out
      </span>
    ) : totalStock < 10 ? (
      <span className="bg-amber-500 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
        Only {totalStock} Left
      </span>
    ) : (salePrice > 0 && salePrice < price) && (
      <span className="bg-[#B23A2E] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
        Special
      </span>
    )}
  </div>

  {/* IMAGE SECTION */}
  <div className="relative w-full h-36 rounded-[1.4rem] overflow-hidden bg-stone-50">
    <img
      src={product?.image || "/default-image.png"}
      alt={product?.title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Subtle gradient overlay on image */}
    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>

  {/* CONTENT */}
  <div className="mt-4 px-1 flex flex-col">
    <h2 className="text-xs font-black text-stone-900 leading-tight tracking-tight h-8 line-clamp-2 uppercase">
      {product?.title}
    </h2>

    {/* PRICE AREA */}
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-sm font-black text-stone-900 tracking-tighter">
        ₹{(salePrice > 0 ? salePrice : price).toFixed(0)}
      </span>
      {salePrice > 0 && (
        <span className="text-[10px] font-bold text-stone-300 line-through tracking-tighter">
          ₹{price.toFixed(0)}
        </span>
      )}
    </div>

    {/* SELECTION AREA - Using subtle custom styling */}
    <div className="grid grid-cols-2 gap-1.5 mt-3">
      {hasSize && (
        <div className="relative">
          <select
            value={selectedSize}
            onChange={(e) => {
              const size = e.target.value;
              setSelectedSize(size);
              setSelectedWeight(getWeightsBySize(size)[0]);
            }}
            className="w-full appearance-none bg-stone-50 border border-stone-100 text-[10px] font-bold text-stone-600 px-2 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-stone-100 transition-colors uppercase tracking-tighter"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <div className={`${!hasSize ? 'col-span-2' : ''} relative`}>
        <select
          value={selectedWeight}
          onChange={(e) => setSelectedWeight(e.target.value)}
          className="w-full appearance-none bg-stone-50 border border-stone-100 text-[10px] font-bold text-stone-600 px-2 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-stone-100 transition-colors uppercase tracking-tighter"
        >
          {getWeightsBySize(selectedSize).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>
    </div>

    {/* ACTION BUTTON */}
    <button
      onClick={handleAddClick}
      disabled={totalStock === 0}
      className={`mt-4 w-full h-10 flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-sm
        ${totalStock === 0
          ? "bg-stone-100 text-stone-300 cursor-not-allowed"
          : "bg-white border border-stone-200 text-stone-900 hover:bg-stone-900 hover:text-white hover:border-stone-900 active:scale-95"
        }`}
    >
      {totalStock === 0 ? "Empty" : "Add to Basket"}
    </button>
  </div>
</div>

  );
}
