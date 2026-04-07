import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { 
  Search, Package, ShoppingBag, ArrowUpRight, 
  Layers, ChevronRight, Zap, RefreshCw 
} from "lucide-react";
import { fetchStoreProducts, sellStoreProduct } from "@/store/slices/storeProductsSlice";

export default function AdminStorePanel() {
  const { storeId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { productList, loading } = useSelector((state) => state.storeProducts);

  useEffect(() => {
    dispatch(fetchStoreProducts(storeId));
  }, [storeId, dispatch]);

  const filteredProducts = productList.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              Inventory Command
            </h1>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">
              Store <span className="text-blue-600">Operations</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <StatCard label="Live Stock" value={productList.length} icon={<Layers size={14}/>} />
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm w-64 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Package size={24} />
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-50 rounded-full text-slate-400">
                    ID: {p._id.toString().slice(-4).toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-black mb-1 text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Himalayan Series</p>

                <div className="space-y-3">
                  {p.variants.map((v, i) => (
                    <div key={i} className="relative overflow-hidden bg-slate-50 rounded-2xl p-4 flex items-center justify-between group/var border border-transparent hover:border-blue-100 transition-all">
                      <div className="z-10">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{v.weight}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-sm font-bold ${v.stock < 10 ? 'text-orange-500' : 'text-slate-700'}`}>
                            {v.stock} in stock
                          </span>
                          {v.stock < 10 && <Zap size={12} className="text-orange-500 fill-orange-500" />}
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(sellStoreProduct({ sku: v.sku, quantity: 1 }))}
                        disabled={v.stock <= 0}
                        className={`z-10 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          v.stock <= 0 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                          : "bg-white text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white active:scale-95"
                        }`}
                      >
                        {v.stock <= 0 ? "Out" : "Sell"} <ArrowUpRight size={14} />
                      </button>

                      {/* Subtle Progress Bar Background */}
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

        {/* --- EMPTY STATE --- */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <ShoppingBag className="text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No products found in this node.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">{label}</p>
        <p className="text-lg font-black text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}