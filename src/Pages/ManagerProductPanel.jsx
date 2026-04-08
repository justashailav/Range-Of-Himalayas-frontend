import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Package,
  ArrowUpRight,
  Layers,
  Zap,
  Plus,
  X,
  Image as ImageIcon,
  BarChart3,
  Info,
  Settings2,
} from "lucide-react";

import {
  fetchStoreProducts,
  addStoreProduct,
} from "@/store/slices/storeProductsSlice";

export default function ManagerProductsPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeId } = useParams(); // ✅ FIXED

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

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    if (isManager) {
      dispatch(fetchStoreProducts());
    } else if (storeId) {
      dispatch(fetchStoreProducts(storeId));
    }
  }, [dispatch, isManager, storeId]);

  // ✅ SAFE FILTER
  const filteredProducts = (productList || []).filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ ADD PRODUCT
  const handleAddProduct = () => {
    if (!isManager) return;

    const payload = {
      ...newProduct,
      ...(isManager ? {} : { storeId }),
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
    <div className="min-h-screen bg-[#FBFBFD] p-6 lg:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2 block">
              Stock Command
            </span>
            <h1 className="text-4xl font-black italic">
              {myStore?.name || "Store"}{" "}
              <span className="text-slate-400 font-normal">Terminal</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <StatCard
              label="Total SKU"
              value={productList?.length || 0}
              icon={<Layers size={14} />}
            />

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                placeholder="Find a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white border rounded-2xl py-3.5 pl-12 pr-4 text-sm"
              />
            </div>

            {isManager && (
              <button
                onClick={() => setShowAdd(true)}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-2"
              >
                <Plus size={18} /> New Product
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div key={p._id} className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-bold">{p.title}</h3>

                {p.variants.map((v, i) => (
                  <div key={i} className="flex justify-between mt-4">
                    <span>{v.stock} stock</span>

                    <button
                      onClick={() =>
                        navigate(
                          isManager
                            ? `/manager/pos?sku=${v.sku}`
                            : `/admin/store/${storeId}/pos?sku=${v.sku}`
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2>Add Product</h2>

            <input
              placeholder="Title"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
            />

            <button onClick={handleAddProduct}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// SMALL COMPONENT
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white px-4 py-2 rounded-xl flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}