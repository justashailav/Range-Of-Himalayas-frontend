import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Layers,
  Plus,
  X,
  ChevronRight,
  Zap,
  Tag,
  Eye,
  Trash2,
  Package,
  Sparkles,
} from "lucide-react";

import {
  fetchStoreProducts,
  addStoreProduct,
} from "@/store/slices/storeProductsSlice";

// --- MAIN COMPONENT ---

export default function ManagerProductsPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams();

  const { productList, loading } = useSelector((state) => state.storeProducts);
  const { user } = useSelector((state) => state.auth);
  const { myStore } = useSelector((state) => state.store);

  const isManager = user?.role === "Manager";

  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    displayName: "",
    description: "",
    category: "",
    image: "",
    searchKeywords: "",
    lowStockThreshold: 5,
    status: "active",
    isAvailable: true,
    variants: [
      { size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" },
    ],
  });

  useEffect(() => {
    if (isManager) {
      dispatch(fetchStoreProducts());
    } else if (storeId) {
      dispatch(fetchStoreProducts(storeId));
    }
  }, [dispatch, isManager, storeId]);

  const filteredProducts = (productList || []).filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!isManager) return;

    const payload = {
      ...newProduct,
      lowStockThreshold: Number(newProduct.lowStockThreshold),
      variants: newProduct.variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
        price: Number(v.price),
        salesPrice: Number(v.salesPrice),
        costPrice: Number(v.costPrice),
        sku: `${newProduct.title.replace(/\s+/g, "-").toLowerCase()}-${v.weight || "std"}-${Date.now()}`,
        barcode: v.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      })),
    };

    dispatch(addStoreProduct(payload));
    setShowAdd(false);
    resetForm();

    setTimeout(() => {
      isManager ? dispatch(fetchStoreProducts()) : dispatch(fetchStoreProducts(storeId));
    }, 400);
  };

  const resetForm = () => {
    setNewProduct({
      title: "", displayName: "", description: "", category: "",
      image: "", searchKeywords: "", lowStockThreshold: 5,
      status: "active", isAvailable: true,
      variants: [{ size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }],
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-blue-100 pb-24">
      {/* Cinematic Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-orange-50/30 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* EDITORIAL HEADER */}
        <header className="pt-16 pb-12 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-200/60 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-12 bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                Range of Himalayas
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-slate-900 leading-none">
              {myStore?.name || "Premium"}
              <span className="block text-4xl font-light italic text-slate-300 tracking-tight mt-1">
                Product Vault.
              </span>
            </h1>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                placeholder="Search collection..."
                className="w-full md:w-80 bg-white border border-slate-200 focus:border-blue-500 rounded-full py-5 pl-14 pr-6 text-sm outline-none transition-all shadow-sm focus:shadow-xl focus:shadow-blue-500/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isManager && (
              <button
                onClick={() => setShowAdd(true)}
                className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-slate-300 font-bold"
              >
                <Plus size={20} strokeWidth={3} />
                <span className="uppercase tracking-widest text-[10px]">New Entry</span>
              </button>
            )}
          </div>
        </header>

        {/* STATS STRIP */}
        <div className="flex gap-6 mb-16 overflow-x-auto pb-4 no-scrollbar">
          <StatCard label="Total SKU" value={productList?.length || 0} icon={<Layers size={18} />} color="blue" />
          <StatCard label="Live Store" value={productList?.filter(p => p.isAvailable).length || 0} icon={<Eye size={18} />} color="emerald" />
          <StatCard label="Low Stock" value={0} icon={<Zap size={18} />} color="amber" />
        </div>

        {/* GRID SECTION */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accessing Vault...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, idx) => (
                <ProductCard 
                  key={p._id} 
                  product={p} 
                  idx={idx} 
                  navigate={navigate} 
                  isManager={isManager} 
                  storeId={storeId} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {showAdd && (
          <AddProductModal 
            setShowAdd={setShowAdd} 
            newProduct={newProduct} 
            setNewProduct={setNewProduct} 
            handleAddProduct={handleAddProduct} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white p-2 pl-8 rounded-full flex items-center gap-8 shadow-sm min-w-[260px]">
      <div>
        <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-400 mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
      <div className="ml-auto w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-inner text-slate-400">
        {icon}
      </div>
    </div>
  );
}

function ProductCard({ product, idx, navigate, isManager, storeId }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: idx * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-[3rem] border border-slate-100 p-5 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700"
    >
      <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-50 overflow-hidden relative mb-8">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80"} 
          className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-6 left-6">
          <span className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="px-2 pb-2">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tighter mb-1 group-hover:text-blue-600 transition-colors leading-none">
          {product.title}
        </h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic">
          {product.displayName}
        </p>

        <div className="space-y-3">
          {product.variants.slice(0, 3).map((v, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.8rem] group/v hover:bg-slate-900 transition-all duration-400">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 group-hover/v:text-slate-500 uppercase tracking-widest">{v.weight || 'Standard'}</span>
                <span className="text-lg font-black text-slate-800 group-hover/v:text-white transition-colors tracking-tight">₹{v.price}</span>
              </div>
              <button
                onClick={() => navigate(isManager ? `/manager/pos?sku=${v.sku}` : `/admin/store/${storeId}/pos?sku=${v.sku}`)}
                className="bg-white w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover/v:scale-110 transition-all active:scale-90"
              >
                <Plus size={20} className="text-slate-900" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AddProductModal({ setShowAdd, newProduct, setNewProduct, handleAddProduct }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" 
        onClick={() => setShowAdd(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter">New SKU Entry</h2>
            <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase font-black mt-2">Inventory Authorization Protocol</p>
          </div>
          <button onClick={() => setShowAdd(false)} className="p-4 hover:bg-slate-100 rounded-full transition-all active:rotate-90">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="p-12 overflow-y-auto custom-scrollbar space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <InputField label="Official Title" placeholder="e.g. Wild Apricot Oil" value={newProduct.title} onChange={(v) => setNewProduct({...newProduct, title: v})} />
            <InputField label="Display Label" placeholder="Brand Name" value={newProduct.displayName} onChange={(v) => setNewProduct({...newProduct, displayName: v})} />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Product Narrative</label>
            <textarea
              className="w-full bg-slate-50 border-none rounded-[2rem] p-8 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[120px] shadow-inner"
              placeholder="Describe the Himalayan origin..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <InputField label="Market Category" placeholder="e.g. Wellness" value={newProduct.category} onChange={(v) => setNewProduct({...newProduct, category: v})} />
            <InputField label="Visual Asset URL" placeholder="https://..." value={newProduct.image} onChange={(v) => setNewProduct({...newProduct, image: v})} />
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Sparkles size={22} className="text-blue-500" /> Inventory Tiers
              </h3>
              <button 
                type="button" 
                onClick={() => setNewProduct({...newProduct, variants: [...newProduct.variants, { size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }]})}
                className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100 transition-all"
              >
                + Add Variant
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {newProduct.variants.map((v, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] relative group/v shadow-inner"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <VariantInput label="Size" val={v.size} onChange={(val) => { const a = [...newProduct.variants]; a[idx].size = val; setNewProduct({...newProduct, variants: a}) }} />
                    <VariantInput label="Weight" val={v.weight} onChange={(val) => { const a = [...newProduct.variants]; a[idx].weight = val; setNewProduct({...newProduct, variants: a}) }} />
                    <VariantInput label="Units" type="number" val={v.stock} onChange={(val) => { const a = [...newProduct.variants]; a[idx].stock = val; setNewProduct({...newProduct, variants: a}) }} />
                    <VariantInput label="Price (₹)" type="number" val={v.price} onChange={(val) => { const a = [...newProduct.variants]; a[idx].price = val; setNewProduct({...newProduct, variants: a}) }} />
                  </div>
                  {idx > 0 && (
                    <button type="button" onClick={() => { const a = newProduct.variants.filter((_, i) => i !== idx); setNewProduct({...newProduct, variants: a}) }}
                      className="absolute -top-3 -right-3 bg-white text-red-500 p-3 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-7 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] mt-8">
            Authorize & Commit SKU
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{label}</label>
      <input
        className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm shadow-inner"
        placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function VariantInput({ label, val, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</span>
      <input 
        type={type} value={val} onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none px-1 py-2 text-base font-black transition-colors"
      />
    </div>
  );
}