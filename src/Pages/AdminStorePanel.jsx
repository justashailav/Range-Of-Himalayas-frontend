import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search, Package, ShoppingBag, ArrowUpRight,
  Layers, Zap, Plus, X, Tag, Image as ImageIcon,
  BarChart3, Hash, AlertCircle, Info, Settings2
} from "lucide-react";

import {
  fetchStoreProducts,
  sellStoreProduct,
  addStoreProduct
} from "@/store/slices/storeProductsSlice";

export default function AdminStorePanel() {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const { productList, loading } = useSelector((state) => state.storeProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "", displayName: "", description: "", category: "",
    image: "", searchKeywords: "", lowStockThreshold: 5,
    status: "active", isAvailable: true,
    variants: [{ size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }],
  });

  useEffect(() => {
    dispatch(fetchStoreProducts(storeId));
  }, [storeId, dispatch]);

  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    const payload = {
      ...newProduct,
      storeId,
      lowStockThreshold: Number(newProduct.lowStockThreshold),
      variants: newProduct.variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
        price: Number(v.price),
        salesPrice: Number(v.salesPrice),
        costPrice: Number(v.costPrice),
        sku: `${newProduct.title}-${v.weight}-${Date.now()}`,
        barcode: v.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      })),
    };
    dispatch(addStoreProduct(payload));
    setShowAdd(false);
    resetForm();
    setTimeout(() => { dispatch(fetchStoreProducts(storeId)); }, 300);
  };

  const resetForm = () => {
    setNewProduct({
      title: "", displayName: "", description: "", category: "", image: "",
      searchKeywords: "", lowStockThreshold: 5, status: "active", isAvailable: true,
      variants: [{ size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }],
    });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">

        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2 block">Stock Command</span>
            <h1 className="text-4xl font-black tracking-tight italic">Store <span className="text-slate-400 font-normal">Terminal</span></h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <StatCard label="Total SKU" value={productList.length} icon={<Layers size={14}/>} />
            
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                placeholder="Find a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
              />
            </div>

            <button 
              onClick={() => setShowAdd(true)}
              className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 font-bold text-sm"
            >
              <Plus size={18} /> New Product
            </button>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative">
                
                {/* Visual Marker */}
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-colors ${p.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`} />

                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-blue-200 transition-colors">
                    {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={24} />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${p.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono tracking-tighter">#{p._id.slice(-5)}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black mb-1 tracking-tight">{p.title}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6 italic truncate">{p.displayName || 'Regional Series'}</p>

                <div className="space-y-3">
                  {p.variants.map((v, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-transparent hover:border-blue-100 transition-all">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{v.weight || v.size || 'Standard'}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${v.stock <= p.lowStockThreshold ? 'text-orange-600' : 'text-slate-700'}`}>
                            {v.stock} in stock
                          </span>
                          {v.stock <= p.lowStockThreshold && <Zap size={12} className="text-orange-500 fill-orange-500 animate-pulse" />}
                        </div>
                      </div>

                      <button 
                        onClick={() => dispatch(sellStoreProduct({ sku: v.sku, quantity: 1 }))}
                        disabled={v.stock <= 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          v.stock <= 0 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-white text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white active:scale-95'
                        }`}
                      >
                        {v.stock <= 0 ? 'Empty' : 'Sell'} <ArrowUpRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD PRODUCT MODAL --- */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAdd(false)} />
          
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-10 border-b border-slate-50">
              <h2 className="text-3xl font-black italic tracking-tighter">Add <span className="text-blue-600">Product</span></h2>
              <button onClick={() => setShowAdd(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"><X size={20}/></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
              
              {/* SECTION: Core Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><Info size={14}/> Core Details</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput label="Internal Title" placeholder="e.g. Shilajit Resin 20g" value={newProduct.title} onChange={(e)=>setNewProduct({...newProduct,title:e.target.value})} />
                  <FormInput label="Public Display Name" placeholder="e.g. Pure Himalayan Shilajit" value={newProduct.displayName} onChange={(e)=>setNewProduct({...newProduct,displayName:e.target.value})} />
                </div>
                <FormInput label="Description" placeholder="Detailed product story..." value={newProduct.description} onChange={(e)=>setNewProduct({...newProduct,description:e.target.value})} />
              </div>

              {/* SECTION: Logistics */}
              <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-5 border border-slate-100">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><Settings2 size={14}/> Logistics & Meta</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormInput label="Category" value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct,category:e.target.value})} />
                  <FormInput label="Image URL" icon={<ImageIcon size={14}/>} value={newProduct.image} onChange={(e)=>setNewProduct({...newProduct,image:e.target.value})} />
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Status</label>
                    <select className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer" 
                      value={newProduct.status} onChange={(e)=>setNewProduct({...newProduct,status:e.target.value})}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <FormInput label="Low Stock Alert" type="number" value={newProduct.lowStockThreshold} onChange={(e)=>setNewProduct({...newProduct,lowStockThreshold:e.target.value})} />
                </div>
              </div>

              {/* SECTION: Initial Variant */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><BarChart3 size={14}/> Initial Variant Inventory</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormInput label="Weight (e.g. 500g)" value={newProduct.variants[0].weight} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].weight=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                  <FormInput label="Price (₹)" type="number" value={newProduct.variants[0].price} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].price=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                  <FormInput label="Initial Stock" type="number" value={newProduct.variants[0].stock} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].stock=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                  <FormInput label="Cost Price" type="number" value={newProduct.variants[0].costPrice} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].costPrice=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                  <FormInput label="Barcode" placeholder="Auto-gen if empty" value={newProduct.variants[0].barcode} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].barcode=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]">
                Authorize & Deploy SKU
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-tight leading-none mb-1">{label}</p>
        <p className="text-lg font-black leading-none">{value}</p>
      </div>
    </div>
  );
}

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      <input 
        {...props} 
        className={`w-full bg-white border border-slate-200 px-4 py-3.5 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm ${icon ? 'pl-11' : ''}`} 
      />
    </div>
  </div>
);