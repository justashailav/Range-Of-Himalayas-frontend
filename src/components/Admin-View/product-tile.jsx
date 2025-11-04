import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

export default function ProductTile({
  setOpenCreateProductDialog,
  setCurrentEditedId,
  product,
  handleDelete,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const variants = product?.variants || [];

  // Get unique sizes
  const sizes = [...new Set(variants.map((v) => v.size))];

  const getWeightsBySize = (size) =>
    variants.filter((v) => v.size === size).map((v) => v.weight);

  const getVariant = (size, weight) =>
    variants.find((v) => v.size === size && v.weight === weight) || {
      size,
      weight,
      stock: 0,
      price: 0,
      salesPrice: 0,
    };

  useEffect(() => {
    if (sizes.length > 0) {
      const initialSize = sizes[0];
      const initialWeight = getWeightsBySize(initialSize)[0];
      setSelectedSize(initialSize);
      setSelectedWeight(initialWeight);
      setSelectedVariant(getVariant(initialSize, initialWeight));
    }
  }, [product]);

  useEffect(() => {
    if (selectedSize && selectedWeight) {
      setSelectedVariant(getVariant(selectedSize, selectedWeight));
    }
  }, [selectedSize, selectedWeight]);

  const handleEditClick = () => {
    setCurrentEditedId(product?._id);
    setOpenCreateProductDialog(true);
  };

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md max-w-sm mx-auto border hover:shadow-xl transition-all duration-200">
      <img
        src={product.image}
        alt={product.title || "Product Image"}
        className="rounded-t-2xl object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.title}
        </h2>

        <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
          <span>Stock: {selectedVariant?.stock ?? 0}</span>
          <span>
            Size: {selectedVariant?.size ?? "-"}, Weight:{" "}
            {selectedVariant?.weight ?? "-"}
          </span>
        </div>

        <div className="mb-3 flex gap-2">
          <select
            value={selectedSize}
            onChange={(e) => {
              const newSize = e.target.value;
              const newWeight = getWeightsBySize(newSize)[0];
              setSelectedSize(newSize);
              setSelectedWeight(newWeight);
            }}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getWeightsBySize(selectedSize).map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 line-through text-sm">
            ₹{selectedVariant?.price?.toFixed(2) ?? "0.00"}
          </span>
          <span className="text-green-600 font-bold text-lg">
            ₹
            {(selectedVariant?.salesPrice
              ? selectedVariant.salesPrice.toFixed(2)
              : selectedVariant?.price?.toFixed(2)) || "0.00"}
          </span>
        </div>

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
