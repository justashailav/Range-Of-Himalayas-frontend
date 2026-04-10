import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ReceiptText,
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

  const hasAutoAdded = useRef(false);

  useEffect(() => {
    if (isManager) {
      dispatch(fetchStoreProducts());
    } else {
      dispatch(fetchStoreProducts(storeId));
    }
  }, [storeId, dispatch, isManager]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sku = params.get("sku");

    if (sku && productList.length > 0 && !hasAutoAdded.current) {
      for (let p of productList) {
        const variant = p.variants.find((v) => v.sku === sku);
        if (variant) {
          addToCart(p, variant);
          hasAutoAdded.current = true;
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
          c.sku === variant.sku ? { ...c, quantity: c.quantity + 1 } : c
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
      })
    );
  };

  const removeItem = (sku) =>
    setCart((prev) => prev.filter((c) => c.sku !== sku));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!isManager || cart.length === 0) return;
    try {
      for (let item of cart) {
        await dispatch(sellStoreProduct({ sku: item.sku, quantity: item.quantity }));
      }
      alert("✅ Transaction Successful");
      setCart([]);
      hasAutoAdded.current = false;
      isManager ? dispatch(fetchStoreProducts()) : dispatch(fetchStoreProducts(storeId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = (productList || []).filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#FDFCFB] flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-blue-100">
      {/* LEFT: CATALOG NAVIGATION */}
      <div className="flex-1 flex flex-col p-6 lg:p-12 overflow-hidden border-r border-slate-100/60 relative">
        {/* Ambient Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/40 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <span className="h-[2px] w-8 bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Terminal</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
              Checkout <span className="text-slate-300 font-light italic tracking-tight">Vault</span>
            </h1>
          </div>

          <div className="relative group w-full max-w-sm">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              placeholder="Filter products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-5 pl-14 pr-6 text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p) =>
                p.variants.map((v) => (
                  <ProductTile key={v.sku} p={p} v={v} addToCart={addToCart} />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT: THE LUXURY TICKET */}
      <div className="w-full lg:w-[480px] bg-white flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.03)] border-l border-slate-50 relative">
        <div className="p-10 pb-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Cart</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Transaction Instance</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <ReceiptText size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-10 space-y-8 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 opacity-40">
              <Zap size={40} strokeWidth={1} className="mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Terminal Waiting</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map((item) => (
                <CartItem 
                  key={item.sku} 
                  item={item} 
                  removeItem={removeItem} 
                  updateQty={updateQty} 
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="p-10 pt-0">
          <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 mb-8 border border-slate-100 shadow-inner">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span>Subtotal</span>
              <span className="text-slate-900">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span>Service Fee</span>
              <span className="text-slate-900">₹0.00</span>
            </div>
            <div className="pt-6 mt-2 border-t border-slate-200/60 flex justify-between items-end">
              <div>
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payable Total</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <div className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase">INR</div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !isManager}
            className={`w-full py-6 rounded-full flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[11px] transition-all
              ${!isManager || cart.length === 0
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-slate-900 text-white hover:bg-blue-600 shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95"
              }
            `}
          >
            <CreditCard size={18} />
            {isManager ? "Process Transaction" : "Read-Only Terminal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- REFINED MINI-COMPONENTS ---

function ProductTile({ p, v, addToCart }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => addToCart(p, v)}
      className="group relative text-left bg-white border border-slate-100 p-4 rounded-[2.5rem] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all active:scale-95 overflow-hidden"
    >
      <div className="aspect-[1/1] bg-slate-50 rounded-[1.8rem] mb-5 overflow-hidden relative">
        {p.image ? (
          <img src={p.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100"><Package className="text-slate-300" size={32} /></div>
        )}
        {v.stock <= 5 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase">
            Critical {v.stock}
          </div>
        )}
      </div>
      
      <div className="px-1">
        <h3 className="text-sm font-black text-slate-900 leading-tight truncate">{p.title}</h3>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-4 italic">{v.weight}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-black text-slate-900 tracking-tighter">₹{v.price}</span>
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-slate-200">
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function CartItem({ item, removeItem, updateQty }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex gap-5 group"
    >
      <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 relative shadow-sm">
        <img src={item.image} className="w-full h-full object-cover" alt="" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div className="max-w-[180px]">
            <h3 className="text-sm font-black text-slate-900 truncate leading-none mb-1">{item.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none truncate">
              {item.weight} • SKU: {item.sku.slice(-8)}
            </p>
          </div>
          <button onClick={() => removeItem(item.sku)} className="text-slate-200 hover:text-red-500 transition-colors p-1">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
            <button onClick={() => updateQty(item.sku, "dec")} className="w-7 h-7 flex items-center justify-center hover:text-blue-600 transition-colors"><Minus size={12} /></button>
            <span className="text-xs font-black w-6 text-center text-slate-900">{item.quantity}</span>
            <button onClick={() => updateQty(item.sku, "inc")} className="w-7 h-7 flex items-center justify-center hover:text-blue-600 transition-colors"><Plus size={12} /></button>
          </div>
          <p className="text-lg font-black text-slate-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}