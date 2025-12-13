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
    ? selectedVariant?.stock ?? 0
    : product.stock ?? 0;

  const price = hasVariants
    ? selectedVariant?.price ?? 0
    : product.price ?? 0;

  const salesPrice = hasVariants
    ? selectedVariant?.salesPrice ?? 0
    : product.salesPrice ?? 0;

  const finalPrice = salesPrice > 0 ? salesPrice : price;

  return (
    <div className="bg-white rounded-2xl shadow-md max-w-sm mx-auto border hover:shadow-xl transition-all duration-200">
      <img
        src={product.image}
        alt={product.title}
        className="rounded-t-2xl object-cover w-full h-48"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.title}
        </h2>

        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
          <span>Stock: {stock}</span>
          {hasVariants ? (
            <span>
              {hasSize && selectedVariant?.size
                ? `Size: ${selectedVariant.size}, `
                : ""}
              Weight: {selectedVariant?.weight}
            </span>
          ) : (
            <span>Single Pack</span>
          )}
        </div>

        {/* ---------- VARIANT SELECTORS ---------- */}
        {hasVariants && (
          <div className="mb-3 flex gap-2">
            {hasSize && (
              <select
                value={selectedSize}
                onChange={(e) => {
                  const newSize = e.target.value;
                  const newWeight = getWeights(newSize)[0];
                  setSelectedSize(newSize);
                  setSelectedWeight(newWeight);
                }}
                className="flex-1 px-3 py-2 border rounded-md"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}

            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            >
              {getWeights(selectedSize).map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ---------- PRICE ---------- */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 line-through text-sm">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-green-600 font-bold text-lg">
            ₹{finalPrice.toFixed(2)}
          </span>
        </div>

        {/* ---------- ACTIONS ---------- */}
        <div className="flex justify-between">
          <Button
            onClick={handleEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
