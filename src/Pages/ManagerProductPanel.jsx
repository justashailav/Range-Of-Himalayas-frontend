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
  X,
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
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()),
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
                            : `/admin/store/${storeId}/pos?sku=${v.sku}`,
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
      {/* --- ADD PRODUCT MODAL --- */}
      {showAdd(
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <p className="text-sm text-gray-500">
                  Fill in the details to list a new item in your inventory.
                </p>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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
                  <h3 className="font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Product Title
                    </label>
                    <input
                      placeholder="e.g. Classic White Tee"
                      value={newProduct.title}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, title: e.target.value })
                      }
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Display Name
                    </label>
                    <input
                      placeholder="Public name"
                      value={newProduct.displayName}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          displayName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 ml-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell customers about this product..."
                    rows="3"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Category
                    </label>
                    <input
                      placeholder="Apparel, Electronics, etc."
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Image URL
                    </label>
                    <input
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 px-4 py-3 rounded-2xl outline-none transition-all bg-gray-50/50"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION: INVENTORY SETTINGS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">
                    Inventory Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Status
                    </label>
                    <select
                      value={newProduct.status}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, status: e.target.value })
                      }
                      className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none bg-gray-50/50 appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Visibility
                    </label>
                    <select
                      value={newProduct.isAvailable}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          isAvailable: e.target.value === "true",
                        })
                      }
                      className="w-full border border-gray-200 px-4 py-3 rounded-2xl outline-none bg-gray-50/50"
                    >
                      <option value={true}>Available</option>
                      <option value={false}>Hidden</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      value={newProduct.lowStockThreshold}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          lowStockThreshold: e.target.value,
                        })
                      }
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
                    <h3 className="font-semibold text-gray-800">
                      Product Variants
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNewProduct({
                        ...newProduct,
                        variants: [
                          ...newProduct.variants,
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
                      })
                    }
                    className="text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
                  >
                    <span className="text-lg">+</span> Add Variant
                  </button>
                </div>

                <div className="space-y-4">
                  {newProduct.variants.map((v, index) => (
                    <div
                      key={index}
                      className="relative p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            Size
                          </label>
                          <input
                            value={v.size}
                            placeholder="M, L, XL"
                            onChange={(e) => {
                              const arr = [...newProduct.variants];
                              arr[index].size = e.target.value;
                              setNewProduct({ ...newProduct, variants: arr });
                            }}
                            className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            Weight
                          </label>
                          <input
                            value={v.weight}
                            placeholder="500g"
                            onChange={(e) => {
                              const arr = [...newProduct.variants];
                              arr[index].weight = e.target.value;
                              setNewProduct({ ...newProduct, variants: arr });
                            }}
                            className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            value={v.price}
                            placeholder="0.00"
                            onChange={(e) => {
                              const arr = [...newProduct.variants];
                              arr[index].price = e.target.value;
                              setNewProduct({ ...newProduct, variants: arr });
                            }}
                            className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            Stock
                          </label>
                          <input
                            type="number"
                            value={v.stock}
                            placeholder="0"
                            onChange={(e) => {
                              const arr = [...newProduct.variants];
                              arr[index].stock = e.target.value;
                              setNewProduct({ ...newProduct, variants: arr });
                            }}
                            className="w-full border-b border-gray-200 py-1 focus:border-emerald-500 outline-none text-sm"
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const arr = newProduct.variants.filter(
                              (_, i) => i !== index,
                            );
                            setNewProduct({ ...newProduct, variants: arr });
                          }}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
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
        </div>,
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
