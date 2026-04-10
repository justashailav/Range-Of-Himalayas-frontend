import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Package,
  ShoppingBag,
  ArrowUpRight,
  Layers,
  Zap,
  Plus,
  X,
  Tag,
  Image as ImageIcon,
  BarChart3,
  Hash,
  AlertCircle,
  Info,
  Settings2,
} from "lucide-react";

import {
  fetchStoreProducts,
  addStoreProduct,
} from "@/store/slices/storeProductsSlice";

export default function AdminStorePanel() {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, loading } = useSelector((state) => state.storeProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const isManager = user?.role === "Manager";
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
      dispatch(fetchStoreProducts()); // manager no storeId
    } else {
      dispatch(fetchStoreProducts(storeId)); // admin needs storeId
    }
  }, [storeId, dispatch, isManager]);

  const filteredProducts = productList.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddProduct = () => {
    if (!isManager) return; // 🔥 safety

    const payload = {
      ...newProduct,
      ...(isManager ? {} : { storeId }), // admin not allowed anyway
      lowStockThreshold: Number(newProduct.lowStockThreshold),
      variants: newProduct.variants.map((v) => ({
        ...v,
        stock: Number(v.stock),
        price: Number(v.price),
        salesPrice: Number(v.salesPrice),
        costPrice: Number(v.costPrice),
        sku: `${newProduct.title}-${v.weight}-${Date.now()}`,
        barcode:
          v.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      })),
    };

    dispatch(addStoreProduct(payload));
    setShowAdd(false);
    resetForm();

    setTimeout(() => {
      if (isManager) {
        dispatch(fetchStoreProducts());
      } else {
        dispatch(fetchStoreProducts(storeId));
      }
    }, 300);
  };

  const resetForm = () => {
    setNewProduct({
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
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2 block">
              Stock Command
            </span>
            <h1 className="text-4xl font-black tracking-tight italic">
              Store <span className="text-slate-400 font-normal">Terminal</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <StatCard
              label="Total SKU"
              value={productList.length}
              icon={<Layers size={14} />}
            />

            <div className="relative flex-grow md:flex-grow-0">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                placeholder="Find a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
              />
            </div>

            {isManager && (
              <button
                onClick={() => setShowAdd(true)}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 font-bold text-sm"
              >
                <Plus size={18} /> New Product
              </button>
            )}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden relative"
              >
                {/* Visual Marker */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-colors ${p.status === "active" ? "bg-green-500" : "bg-slate-500"}`}
                />

                <div className="flex justify-between items-start mb-6">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-blue-200 transition-colors">
                    {p.image ? (
                      <img
                        src={p.image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${p.status === "active" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"}`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono tracking-tighter">
                      #{p._id.slice(-5)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black mb-1 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-6 italic truncate">
                  {p.displayName || "Regional Series"}
                </p>

                <div className="space-y-3">
                  {p.variants.map((v, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-transparent hover:border-blue-100 transition-all"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                          {v.weight || v.size || "Standard"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${v.stock <= p.lowStockThreshold ? "text-orange-600" : "text-slate-700"}`}
                          >
                            {v.stock} in stock
                          </span>
                          {v.stock <= p.lowStockThreshold && (
                            <Zap
                              size={12}
                              className="text-orange-500 fill-orange-500 animate-pulse"
                            />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            isManager
                              ? `/manager/pos?sku=${v.sku}`
                              : `/admin/store/${storeId}/pos?sku=${v.sku}`,
                          )
                        }
                        disabled={v.stock <= 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          v.stock <= 0
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 text-white shadow-sm hover:bg-slate-900 active:scale-95"
                        }`}
                      >
                        {v.stock <= 0 ? "Out" : "Add"}{" "}
                        <ArrowUpRight size={14} />
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
      {/* --- ADD PRODUCT MODAL --- */}
      {/* --- ADD PRODUCT MODAL --- */}
{showAdd && isManager && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    
    {/* BACKDROP with Blur */}
    <div
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      onClick={() => setShowAdd(false)}
    />

    {/* MODAL CONTAINER */}
    <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-sm text-gray-500">Fill in the details to list a new item in your inventory.</p>
        </div>
        <button 
          onClick={() => setShowAdd(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* FORM BODY */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProduct();
        }}
        className="p-8 overflow-y-auto space-y-8"
      >
        {/* SECTION: BASIC INFO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Basic Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Product Title</label>
              <input
                placeholder="e.g. Classic White Tee"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Display Name</label>
              <input
                placeholder="Public name"
                value={newProduct.displayName}
                onChange={(e) => setNewProduct({...newProduct, displayName: e.target.value})}
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Description</label>
            <textarea
              placeholder="Tell customers about this product..."
              rows="3"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Category</label>
              <input
                placeholder="Apparel, Electronics, etc."
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Image URL</label>
              <input
                placeholder="https://..."
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
              />
            </div>
          </div>
        </section>

        {/* SECTION: INVENTORY SETTINGS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Inventory Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Status</label>
              <select
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none bg-gray-50/50 appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Visibility</label>
              <select
                value={newProduct.isAvailable}
                onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.value === "true" })}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none bg-gray-50/50"
              >
                <option value={true}>Available</option>
                <option value={false}>Hidden</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Low Stock Alert</label>
              <input
                type="number"
                placeholder="5"
                value={newProduct.lowStockThreshold}
                onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: e.target.value })}
                className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none bg-gray-50/50"
              />
            </div>
          </div>
        </section>

        {/* SECTION: VARIANTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
              <h3 className="font-semibold text-gray-800">Product Variants</h3>
            </div>
            <button
              type="button"
              onClick={() => setNewProduct({
                ...newProduct,
                variants: [...newProduct.variants, { size: "", weight: "", price: "", salesPrice: "", costPrice: "", stock: "", barcode: "" }]
              })}
              className="text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
            >
              <span className="text-lg">+</span> Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {newProduct.variants.map((v, index) => (
              <div key={index} className="relative p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Size</label>
                    <input value={v.size} placeholder="M, L, XL" onChange={(e) => { const arr = [...newProduct.variants]; arr[index].size = e.target.value; setNewProduct({ ...newProduct, variants: arr }); }} className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Weight</label>
                    <input value={v.weight} placeholder="500g" onChange={(e) => { const arr = [...newProduct.variants]; arr[index].weight = e.target.value; setNewProduct({ ...newProduct, variants: arr }); }} className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Price ($)</label>
                    <input type="number" value={v.price} placeholder="0.00" onChange={(e) => { const arr = [...newProduct.variants]; arr[index].price = e.target.value; setNewProduct({ ...newProduct, variants: arr }); }} className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Stock</label>
                    <input type="number" value={v.stock} placeholder="0" onChange={(e) => { const arr = [...newProduct.variants]; arr[index].stock = e.target.value; setNewProduct({ ...newProduct, variants: arr }); }} className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm" />
                  </div>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const arr = newProduct.variants.filter((_, i) => i !== index);
                      setNewProduct({ ...newProduct, variants: arr });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 sticky bottom-0 bg-white">
          <button className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98]">
            Create Product Listing
          </button>
        </div>
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
      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-tight leading-none mb-1">
          {label}
        </p>
        <p className="text-lg font-black leading-none">{value}</p>
      </div>
    </div>
  );
}

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-white border border-slate-200 px-4 py-3.5 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm ${icon ? "pl-11" : ""}`}
      />
    </div>
  </div>
);
