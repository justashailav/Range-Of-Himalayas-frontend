import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { 
  Search, Package, ShoppingBag, ArrowUpRight, 
  Layers, Zap, Plus, X, Tag, DollarSign, Database
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

  /* ---------------- ADD PRODUCT STATE ---------------- */
  const [showAdd, setShowAdd] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    variants: [{ weight: "", price: "", stock: "" }]
  });

  useEffect(() => {
    dispatch(fetchStoreProducts(storeId));
  }, [storeId, dispatch]);

  const filteredProducts = productList.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- ADD PRODUCT FUNCTION ---------------- */
  const handleAddProduct = () => {
    const payload = {
      storeId,
      title: newProduct.title,
      description: "",
      category: "",
      variants: newProduct.variants.map((v) => ({
        weight: v.weight,
        stock: Number(v.stock),
        price: Number(v.price),
        salesPrice: Number(v.price),
        sku: `${newProduct.title}-${v.weight}-${Date.now()}`
      })),
    };

    dispatch(addStoreProduct(payload));

    setShowAdd(false);
    // Reset form
    setNewProduct({ title: "", variants: [{ weight: "", price: "", stock: "" }] });

    setTimeout(() => {
      dispatch(fetchStoreProducts(storeId));
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Inventory Node</h1>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Store <span className="text-blue-600">Operations</span></h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto">
            <StatCard label="Live Products" value={productList.length} icon={<Layers size={14}/>}/>

            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm placeholder:text-slate-300"
              />
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowAdd(true)}
              className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <Plus size={18} strokeWidth={2.5}/> Add Product
            </button>
          </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Package size={24} />
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-50 rounded-full text-slate-400 font-mono">
                    ID: {p._id.toString().slice(-4).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">{p.title}</h3>

                <div className="space-y-3">
                  {p.variants.map((v,i)=>(
                    <div key={i} className="relative overflow-hidden flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:border-blue-100">
                      <div className="z-10">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider leading-none mb-1">{v.weight}</p>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-bold ${v.stock < 10 ? 'text-orange-600' : 'text-slate-700'}`}>
                                {v.stock} in stock
                            </span>
                            {v.stock < 10 && <Zap size={12} className="text-orange-500 fill-orange-500" />}
                        </div>
                      </div>

                      <button
                        onClick={()=>dispatch(sellStoreProduct({sku:v.sku,quantity:1}))}
                        disabled={v.stock <= 0}
                        className={`z-10 flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          v.stock <= 0 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                          : "bg-white text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white active:scale-95"
                        }`}
                      >
                        {v.stock <= 0 ? "Out" : "Sell"} <ArrowUpRight size={14} />
                      </button>

                      {/* Subtle Stock Level Background */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-blue-500/10 transition-all duration-1000" 
                        style={{ width: `${Math.min(v.stock, 100)}%` }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in">
            <ShoppingBag className="text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No products found in this node.</p>
          </div>
        )}

      </div>

      {/* ---------------- ADD PRODUCT MODAL ---------------- */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={()=>setShowAdd(false)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New <span className="text-blue-600">Product</span></h2>
              <button onClick={()=>setShowAdd(false)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={(e)=> {e.preventDefault(); handleAddProduct();}} className="p-8 space-y-5">
              
              <FormInput icon={<Tag size={16}/>} placeholder="Product Title (e.g., Shilajit Resin)" value={newProduct.title} onChange={(e)=>setNewProduct({...newProduct,title:e.target.value})} />
              
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Initial Variant</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Weight / Size" placeholder="20g" value={newProduct.variants[0].weight} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].weight=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                  
                  <FormInput label="Base Price (₹)" placeholder="1499" type="number" value={newProduct.variants[0].price} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].price=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />

                  <FormInput label="Initial Stock" placeholder="50" type="number" value={newProduct.variants[0].stock} onChange={(e)=>{
                    const v=[...newProduct.variants]; v[0].stock=e.target.value; setNewProduct({...newProduct,variants:v});
                  }} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                Confirm & Deploy Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- REFINED SUB-COMPONENTS --- */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

const FormInput = ({ icon, label, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1.5 block">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">{icon}</div>}
      <input
        {...props}
        className={`w-full bg-white border border-slate-200 rounded-xl py-3.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-slate-300 ${icon ? 'pl-11' : 'px-4'}`}
      />
    </div>
  </div>
);