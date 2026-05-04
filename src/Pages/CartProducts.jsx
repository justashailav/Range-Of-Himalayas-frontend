import React from "react";
import { Plus } from "lucide-react";

export default function CartSuggestions({
  products = [],
  handleAddToCart,
  setOpenCartSheet,
}) {
  if (products.length === 0) return null;

  return (
    <div className="mt-4 px-8 py-6 bg-stone-50/50">
      {/* SECTION TITLE */}
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-stone-200" />
        <h3 className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
          Complete Your Ritual
        </h3>
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      {/* SUGGESTIONS LIST */}
      <div className="grid grid-cols-1 gap-3">
        {products.slice(0, 3).map((product) => {
          const variant = product?.variants?.[0] || {};
          const price = variant.salesPrice > 0 ? variant.salesPrice : variant.price;

          return (
            <div
              key={product._id}
              className="group flex items-center justify-between bg-white border border-stone-100 rounded-2xl p-2.5 transition-all duration-300 hover:shadow-md hover:border-stone-200"
            >
              {/* PRODUCT INFO */}
              <div className="flex items-center gap-3">
                <div className="relative overflow-hidden rounded-xl bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-stone-800 line-clamp-1 tracking-tight">
                    {product.title}
                  </p>
                  <p className="text-[12px] font-light text-stone-500 font-serif italic">
                    ₹{price}
                  </p>
                </div>
              </div>

              {/* QUICK ADD BUTTON */}
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
                className="flex items-center gap-1.5 h-9 px-4 bg-stone-50 text-stone-900 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#B23A2E] hover:text-white active:scale-90"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          );
        })}
      </div>
      
      <p className="text-center mt-4 text-[9px] text-stone-300 font-medium tracking-widest uppercase italic">
        Handpicked for you from the highlands
      </p>
    </div>
  );
}