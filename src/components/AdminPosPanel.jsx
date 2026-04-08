import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Package,
  CreditCard,
  X,
  Store,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchStoreProducts,
  sellStoreProduct,
} from "@/store/slices/storeProductsSlice";

export default function AdminPOSPanel({ storeId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { productList } = useSelector((state) => state.storeProducts);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const isManager = user?.role === "Manager";

  // Ref to prevent double-adding on initial load
  const hasAutoAdded = useRef(false);

  useEffect(() => {
  if (isManager) {
    dispatch(fetchStoreProducts()); // manager auto store
  } else {
    dispatch(fetchStoreProducts(storeId)); // admin view any store
  }
}, [storeId, dispatch, isManager]);

  /* --- FIXED: PRE-SELECTED SKU LOGIC --- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sku = params.get("sku");

    if (sku && productList.length > 0 && !hasAutoAdded.current) {
      for (let p of productList) {
        const variant = p.variants.find((v) => v.sku === sku);
        if (variant) {
          addToCart(p, variant);
          hasAutoAdded.current = true;
          // Optional: Clear URL param so refresh doesn't re-add
          navigate(location.pathname, { replace: true });
          break;
        }
      }
    }
  }, [productList, location.search]);

  const addToCart = (product, variant) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.sku === variant.sku);
      if (existing) {
        if (existing.quantity >= variant.stock) return prevCart;
        return prevCart.map((c) =>
          c.sku === variant.sku ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [
        ...prevCart,
        {
          productId: product._id,
          title: product.title,
          sku: variant.sku,
          price: variant.salesPrice || variant.price,
          quantity: 1,
          stock: variant.stock,
          image: product.image,
          weight: variant.weight,
        },
      ];
    });
  };

  const updateQty = (sku, type) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.sku !== sku) return c;
        if (type === "inc" && c.quantity < c.stock)
          return { ...c, quantity: c.quantity + 1 };
        if (type === "dec" && c.quantity > 1)
          return { ...c, quantity: c.quantity - 1 };
        return c;
      }),
    );
  };

  const removeItem = (sku) =>
    setCart((prev) => prev.filter((c) => c.sku !== sku));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
  if (!isManager) return; // 🔥 ADMIN BLOCK

  if (cart.length === 0) return;

  try {
    for (let item of cart) {
      await dispatch(
        sellStoreProduct({ sku: item.sku, quantity: item.quantity })
      );
    }

    alert("✅ Transaction Successful");

    setCart([]);
    hasAutoAdded.current = false;

    if (isManager) {
      dispatch(fetchStoreProducts());
    } else {
      dispatch(fetchStoreProducts(storeId));
    }

  } catch (err) {
    console.error(err);
  }
};

  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* ---------------- LEFT: CATALOG ---------------- */}
      <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-hidden">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Store size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Live Inventory
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              Terminal{" "}
              <span className="text-slate-300 italic font-light lowercase">
                pos
              </span>
            </h1>
          </div>

          <div className="relative group w-full max-w-sm">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) =>
              p.variants.map((v, i) => (
                <button
                  key={`${p._id}-${v.sku}`}
                  onClick={() => addToCart(p, v)}
                  className="group relative text-left bg-white border border-slate-100 p-3 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-900/5 transition-all active:scale-95 overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] mb-4 overflow-hidden flex items-center justify-center relative">
                    {p.image ? (
                      <img
                        src={p.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt=""
                      />
                    ) : (
                      <Package className="text-slate-200" size={32} />
                    )}
                    {v.stock <= 5 && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-[9px] font-black px-2 py-1 rounded-lg uppercase shadow-sm">
                        Only {v.stock} left
                      </div>
                    )}
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
                      {p.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                      {v.weight}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900">
                        ₹{v.price}
                      </span>
                      <div className="p-2 bg-slate-900 rounded-full text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Plus size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              )),
            )}
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT: THE TICKET ---------------- */}
      <div className="w-full lg:w-[420px] bg-white lg:m-4 lg:rounded-[3rem] border border-slate-100 flex flex-col shadow-2xl relative">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Current Order
            </h2>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-center">
                Terminal is Idle
                <br />
                <span className="font-medium text-slate-400 lowercase">
                  Select items to begin
                </span>
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.sku}
                className="flex gap-4 group animate-in slide-in-from-right-4 duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-50">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 leading-none mb-1">
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.weight} • SKU: {item.sku}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button
                        onClick={() => updateQty(item.sku, "dec")}
                        className="p-1 hover:text-blue-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-black w-8 text-center text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.sku, "inc")}
                        className="p-1 hover:text-blue-600"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-black text-slate-900 font-mono">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER / TOTAL */}
        <div className="p-8 bg-slate-50 lg:rounded-b-[3rem] border-t border-slate-100">
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-900 font-mono">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Handling</span>
              <span className="text-slate-900 font-mono">₹0.00</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
              <span className="text-sm font-black uppercase text-slate-900">
                Payable Amount
              </span>
              <span className="text-3xl font-black text-blue-600 tracking-tighter italic">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
  onClick={handleCheckout}
  disabled={cart.length === 0 || !isManager}
  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-[10px] transition-all
    ${
      !isManager
        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
        : "bg-slate-900 text-white hover:bg-blue-600 shadow-2xl shadow-slate-300"
    }
  `}
>
  <CreditCard size={18} />
  {isManager ? "Process Checkout" : "View Only Mode"}
</button>
        </div>
      </div>
    </div>
  );
}
