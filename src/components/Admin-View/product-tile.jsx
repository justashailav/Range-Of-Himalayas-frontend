import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

export default function ProductTile({
  setOpenCreateProductDialog,
  setCurrentEditedId,
  product,
  handleDelete,
}) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  // Detect if size is actually used (fruits)
  const hasSize = variants.some((v) => v.size && v.size !== "");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  // ---------- HELPERS ----------
  const sizes = hasSize
    ? [...new Set(variants.map((v) => v.size).filter(Boolean))]
    : [];

  const getWeights = (size) => {
    return hasSize
      ? variants.filter((v) => v.size === size).map((v) => v.weight)
      : variants.map((v) => v.weight);
  };

  const getVariant = (size, weight) => {
    return hasSize
      ? variants.find((v) => v.size === size && v.weight === weight)
      : variants.find((v) => v.weight === weight);
  };

  // ---------- INIT ----------
  useEffect(() => {
    if (!hasVariants) {
      setSelectedVariant(null);
      return;
    }

    if (hasSize && sizes.length > 0) {
      const s = sizes[0];
      const w = getWeights(s)[0];
      setSelectedSize(s);
      setSelectedWeight(w);
      setSelectedVariant(getVariant(s, w));
    } else {
      const w = getWeights()[0];
      setSelectedWeight(w);
      setSelectedVariant(getVariant("", w));
    }
  }, [product]);

  useEffect(() => {
    if (!hasVariants) return;

    if (hasSize && selectedSize && selectedWeight) {
      setSelectedVariant(getVariant(selectedSize, selectedWeight));
    } else if (!hasSize && selectedWeight) {
      setSelectedVariant(getVariant("", selectedWeight));
    }
  }, [selectedSize, selectedWeight]);

  const handleEditClick = () => {
    setCurrentEditedId(product?._id);
    setOpenCreateProductDialog(true);
  };

  if (!product) return null;

  // ---------- PRICE / STOCK ----------
  const stock = hasVariants
    ? (selectedVariant?.stock ?? 0)
    : (product.stock ?? 0);

  const price = hasVariants
    ? (selectedVariant?.price ?? 0)
    : (product.price ?? 0);

  const salesPrice = hasVariants
    ? (selectedVariant?.salesPrice ?? 0)
    : (product.salesPrice ?? 0);

  const finalPrice = salesPrice > 0 ? salesPrice : price;

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 overflow-hidden">
      {/* IMAGE SECTION WITH STOCK BADGE */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dynamic Stock Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${
            stock < 10
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-white/90 text-stone-600 border border-stone-100"
          }`}
        >
          {stock < 10 ? `Low Stock: ${stock}` : `In Stock: ${stock}`}
        </div>
      </div>

      <div className="p-6">
        {/* TITLE & CATEGORY */}
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-1">
            {hasVariants ? "Multi-Variant" : "Single Unit"}
          </p>
          <h2 className="text-lg font-serif font-bold text-stone-900 line-clamp-1 italic">
            {product.title}
          </h2>
        </div>

        {/* VARIANT SELECTORS - Cleaned up to look like a pro tool */}
        {hasVariants && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {hasSize && (
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-stone-400 uppercase ml-1">
                  Grade/Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    const newWeight = getWeights(newSize)[0];
                    setSelectedSize(newSize);
                    setSelectedWeight(newWeight);
                  }}
                  className="appearance-none bg-stone-50 border border-stone-100 text-stone-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-orange-200 transition-colors cursor-pointer"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-stone-400 uppercase ml-1">
                Net Weight
              </label>
              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
                className="appearance-none bg-stone-50 border border-stone-100 text-stone-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-orange-200 transition-colors cursor-pointer"
              >
                {getWeights(selectedSize).map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* PRICE SECTION */}
        <div className="flex items-baseline gap-3 mb-6 bg-stone-50/50 p-3 rounded-2xl border border-stone-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-stone-400 uppercase">
              Current MSRP
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold text-stone-900">
                ₹{finalPrice.toFixed(2)}
              </span>
              <span className="text-xs text-stone-400 line-through decoration-orange-500/30">
                ₹{price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS - Admin Centric */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleEditClick}
            className="flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            <span>Edit Specs</span>
          </button>
          <button
            onClick={() => handleDelete(product?._id)}
            className="flex items-center justify-center gap-2 bg-white border border-red-100 hover:bg-red-50 text-red-500 text-xs font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
