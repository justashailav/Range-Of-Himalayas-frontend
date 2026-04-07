import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ChevronRight,
  Package,
  CreditCard,
  X,
} from "lucide-react";

import {
  fetchStoreProducts,
  sellStoreProduct,
} from "@/store/slices/storeProductsSlice";
import { useLocation } from "react-router-dom";
export default function AdminPOSPanel({ storeId }) {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.storeProducts);

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preSelectedSKU = params.get("sku");

  useEffect(() => {
    dispatch(fetchStoreProducts(storeId));
  }, [storeId, dispatch]);

  useEffect(() => {
  if (preSelectedSKU && productList.length > 0) {
    for (let p of productList) {
      const variant = p.variants.find(v => v.sku === preSelectedSKU);
      if (variant) {
        addToCart(p, variant);
        break;
      }
    }
  }
}, [preSelectedSKU, productList]);

  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (product, variant) => {
    const existing = cart.find((c) => c.sku === variant.sku);
    if (existing) {
      if (existing.quantity >= variant.stock) return; // Stock limit
      setCart(
        cart.map((c) =>
          c.sku === variant.sku ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          title: product.title,
          sku: variant.sku,
          price: variant.salesPrice || variant.price,
          quantity: 1,
          stock: variant.stock,
          image: product.image,
        },
      ]);
    }
  };

  const updateQty = (sku, type) => {
    setCart(
      cart.map((c) => {
        if (c.sku !== sku) return c;
        if (type === "inc" && c.quantity < c.stock)
          return { ...c, quantity: c.quantity + 1 };
        if (type === "dec" && c.quantity > 1)
          return { ...c, quantity: c.quantity - 1 };
        return c;
      }),
    );
  };

  const removeItem = (sku) => setCart(cart.filter((c) => c.sku !== sku));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      for (let item of cart) {
        await dispatch(
          sellStoreProduct({ sku: item.sku, quantity: item.quantity }),
        );
      }
      alert("✅ Transaction Successful");
      setCart([]);
      dispatch(fetchStoreProducts(storeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-[#FBFBFD] flex flex-col lg:flex-row overflow-hidden font-sans text-slate-900">
      {/* ---------------- LEFT: PRODUCT BROWSER ---------------- */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-hidden">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1 block">
              Retail Terminal
            </span>
            <h1 className="text-3xl font-black tracking-tight italic">
              Product <span className="text-slate-400">Catalog</span>
            </h1>
          </div>
          <div className="relative w-full max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) =>
              p.variants.map((v, i) => (
                <div
                  key={`${p._id}-${i}`}
                  onClick={() => addToCart(p, v)}
                  className="group relative bg-white border border-slate-100 p-4 rounded-[2rem] cursor-pointer hover:shadow-2xl hover:shadow-slate-200 transition-all active:scale-95 overflow-hidden"
                >
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center border border-slate-50">
                    {p.image ? (
                      <img
                        src={p.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt=""
                      />
                    ) : (
                      <Package className="text-slate-200" size={32} />
                    )}
                  </div>
                  <h3 className="text-sm font-black leading-tight mb-1 truncate">
                    {p.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {v.weight}
                    </p>
                    <p className="text-sm font-black text-blue-600">
                      ₹{v.price}
                    </p>
                  </div>
                  {v.stock <= 5 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                      Low
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT: CART & CHECKOUT ---------------- */}
      <div className="w-full lg:w-[400px] bg-white border-l border-slate-100 flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <ShoppingCart size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight">Current Order</h2>
          </div>
          <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase text-slate-500">
            {cart.length} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <ShoppingCart size={48} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">
                Cart is Empty
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.sku}
                className="group flex gap-4 bg-slate-50/50 p-4 rounded-3xl border border-transparent hover:border-slate-100 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package
                      size={16}
                      className="m-auto text-slate-200 h-full"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-black leading-tight max-w-[120px]">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center bg-white border border-slate-100 rounded-xl px-1">
                      <button
                        onClick={() => updateQty(item.sku, "dec")}
                        className="p-1.5 hover:text-blue-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-black w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.sku, "inc")}
                        className="p-1.5 hover:text-blue-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-black tracking-tighter">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="p-8 bg-slate-50/50 rounded-t-[3rem] border-t border-slate-100">
          <div className="space-y-2 mb-6 text-sm font-medium text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-900 font-bold">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST)</span>
              <span className="text-slate-900 font-bold">₹0.00</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200">
              <span>Total</span>
              <span className="text-blue-600 italic">₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
          >
            <CreditCard size={18} /> Complete Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
