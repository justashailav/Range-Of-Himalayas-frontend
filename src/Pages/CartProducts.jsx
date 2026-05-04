import React from "react";
import { Plus } from "lucide-react";

export default function CartSuggestions({
  products = [],
  handleAddToCart,
  setOpenCartSheet,
}) {
  if (products.length === 0) return null;

  return (
    <div className="mt-4 py-6 bg-stone-50/50 border-y border-stone-100">
      {/* SECTION TITLE */}
      <div className="px-8 flex items-center gap-3 mb-5">
        <h3 className="text-[10px] font-black text-stone-400 tracking-[0.3em] uppercase whitespace-nowrap">
          Complete Your Ritual
        </h3>
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      {/* HORIZONTAL SCROLLABLE CONTAINER */}
      <div className="flex gap-4 overflow-x-auto px-8 pb-4 no-scrollbar snap-x snap-mandatory">
        {products.slice(0, 6).map((product) => {
          const variant = product?.variants?.[0] || {};
          const price = variant.salesPrice > 0 ? variant.salesPrice : variant.price;

          return (
            <div
              key={product._id}
              className="group min-w-[240px] flex-shrink-0 snap-start bg-white border border-stone-100 rounded-2xl p-3 transition-all duration-300 hover:shadow-md hover:border-stone-200"
            >
              <div className="flex gap-4">
                {/* PRODUCT IMAGE */}
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-stone-100 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* INFO & ACTION */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <p className="text-[11px] font-bold text-stone-800 line-clamp-1 tracking-tight">
                      {product.title}
                    </p>
                    <p className="text-[12px] font-light text-stone-500 font-serif italic mt-0.5">
                      ₹{price}
                    </p>
                  </div>

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
                    className="flex items-center justify-center gap-1.5 h-8 w-full mt-2 bg-stone-50 text-stone-900 rounded-full text-[9px] font-black tracking-widest uppercase transition-all duration-300 hover:bg-stone-900 hover:text-white active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    Quick Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-8 mt-2 flex items-center justify-between">
        <p className="text-[9px] text-stone-300 font-medium tracking-widest uppercase italic">
          Swipe to explore more
        </p>
        <div className="flex gap-1">
          <div className="w-4 h-0.5 bg-stone-200 rounded-full" />
          <div className="w-2 h-0.5 bg-stone-100 rounded-full" />
          <div className="w-1 h-0.5 bg-stone-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}