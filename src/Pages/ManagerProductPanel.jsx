import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Layers,
  Plus,
  X,
  Package,
  ChevronRight,
  LayoutGrid,
  Zap,
  Tag,
  Eye,
  Trash2,
} from "lucide-react";

import {
  fetchStoreProducts,
  addStoreProduct,
} from "@/store/slices/storeProductsSlice";

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
      {
        size: "",
        weight: "",
        price: "",
        salesPrice: "",
        costPrice: "",
        stock: "",
        barcode: "",
      },
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
        sku: `${newProduct.title.replace(/\s+/g, "-")}-${v.weight || "std"}-${Date.now()}`,
        barcode: v.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      })),
    };

    dispatch(addStoreProduct(payload));
    setShowAdd(false);
    resetForm();

    setTimeout(() => {
      isManager ? dispatch(fetchStoreProducts()) : dispatch(fetchStoreProducts(storeId));
    }, 300);
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
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[1px] w-8 bg-blue-600"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600">
                Inventory Intelligence
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">
              {myStore?.name || "Premium"}{" "}
              <span className="text-slate-300 font-light italic tracking-normal">Vault</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 items-center w-full md:w-auto"
          >
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all shadow-sm"
              />
            </div>

            {isManager && (
              <button
                onClick={() => setShowAdd(true)}
                className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-200 font-bold"
              >
                <Plus size={20} />
                <span>New SKU</span>
              </button>
            )}
          </motion.div>
        </header>

        {/* STATUS BAR */}
        <div className="flex gap-6 mb-10 overflow-x-auto pb-2 no-scrollbar">
          <StatCard label="Total Products" value={productList?.length || 0} icon={<Layers size={16} />} color="blue" />
          <StatCard label="Live on Store" value={productList?.filter(p => p.isAvailable).length || 0} icon={<Eye size={16} />} color="emerald" />
          <StatCard label="Low Stock" value={0} icon={<Zap size={16} />} color="amber" />
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
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

      {/* MODAL OVERLAY */}
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
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50"
  };
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center gap-4 min-w-[200px] shadow-sm">
      <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{label}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ProductCard({ product, idx, navigate, isManager, storeId }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80"} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
              {product.category}
            </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{product.title}</h3>
        <p className="text-slate-400 text-sm line-clamp-1 mb-6 italic">{product.displayName}</p>

        <div className="space-y-3">
          {product.variants.map((v, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/variant hover:bg-blue-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">{v.weight || 'Standard'}</span>
                <span className={`text-[10px] font-medium ${v.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                   {v.stock} in units
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-900">₹{v.price}</span>
                <button
                  onClick={() => navigate(isManager ? `/manager/pos?sku=${v.sku}` : `/admin/store/${storeId}/pos?sku=${v.sku}`)}
                  className="bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-500 transition-all active:scale-90 shadow-sm"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AddProductModal({ setShowAdd, newProduct, setNewProduct, handleAddProduct }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        onClick={() => setShowAdd(false)} 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-black italic tracking-tight">Add Product</h2>
            <p className="text-slate-400 text-sm tracking-wide uppercase font-bold text-[10px] mt-1">New Inventory Entry</p>
          </div>
          <button onClick={() => setShowAdd(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="p-10 overflow-y-auto custom-scrollbar space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Product Title" placeholder="e.g. Wild Himalayan Honey" value={newProduct.title} onChange={(v) => setNewProduct({...newProduct, title: v})} />
            <InputField label="Display Name" placeholder="Marketing Name" value={newProduct.displayName} onChange={(v) => setNewProduct({...newProduct, displayName: v})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
            <textarea
              className="w-full bg-slate-50 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[100px]"
              placeholder="Tell the story of this product..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField label="Category" placeholder="e.g. Wellness" value={newProduct.category} onChange={(v) => setNewProduct({...newProduct, category: v})} />
            <InputField label="Image Source" placeholder="URL Link" value={newProduct.image} onChange={(v) => setNewProduct({...newProduct, image: v})} />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Tag size={18} className="text-blue-500" /> Variants</h3>
              <button 
                type="button" 
                onClick={() => setNewProduct({...newProduct, variants: [...newProduct.variants, { size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }]})}
                className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
              >
                + Add Tier
              </button>
            </div>

            {newProduct.variants.map((v, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] relative group/v">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <VariantInput label="Size" val={v.size} onChange={(val) => { const a = [...newProduct.variants]; a[idx].size = val; setNewProduct({...newProduct, variants: a}) }} />
                  <VariantInput label="Weight" val={v.weight} onChange={(val) => { const a = [...newProduct.variants]; a[idx].weight = val; setNewProduct({...newProduct, variants: a}) }} />
                  <VariantInput label="Stock" type="number" val={v.stock} onChange={(val) => { const a = [...newProduct.variants]; a[idx].stock = val; setNewProduct({...newProduct, variants: a}) }} />
                  <VariantInput label="Price (₹)" type="number" val={v.price} onChange={(val) => { const a = [...newProduct.variants]; a[idx].price = val; setNewProduct({...newProduct, variants: a}) }} />
                </div>
                {idx > 0 && (
                  <button type="button" onClick={() => { const a = newProduct.variants.filter((_, i) => i !== idx); setNewProduct({...newProduct, variants: a}) }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/v:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-[0.98]">
            Authorize & Save Product
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <input
        className="w-full bg-slate-50 border-none rounded-[1.2rem] px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
        placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function VariantInput({ label, val, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">{label}</span>
      <input 
        type={type} value={val} onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b-2 border-slate-200 focus:border-blue-500 outline-none px-1 py-1 text-sm font-bold transition-colors"
      />
    </div>
  );
}