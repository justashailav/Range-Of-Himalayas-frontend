import React from "react";

export default function CartSuggestions({
  products = [],
  handleAddToCart,
  setOpenCartSheet,
}) {
  return (
    <div className="mt-6">
      {/* TITLE */}
      <h3 className="text-[14px] font-bold text-blue-600 border-b-2 border-blue-600 inline-block mb-4">
        You may also like
      </h3>

      {/* LIST */}
      <div className="space-y-3">
        {products.slice(0, 4).map((product) => {
          const variant = product?.variants?.[0] || {};
          const price =
            variant.salesPrice > 0 ? variant.salesPrice : variant.price;

          return (
            <div
              key={product._id}
              className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-3"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                <div>
                  <p className="text-[13px] font-medium text-stone-700 line-clamp-1">
                    {product.title}
                  </p>
                  <p className="text-[14px] font-bold text-stone-900 mt-1">
                    ₹{price}
                  </p>
                </div>
              </div>

              {/* ADD BUTTON */}
              <button
                onClick={() => {
                  handleAddToCart(
                    product._id,
                    variant.stock || 10,
                    variant.size || "",
                    variant.weight
                  );
                  setOpenCartSheet(true);
                }}
                className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg text-[12px] font-semibold hover:bg-blue-500 hover:text-white transition"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}