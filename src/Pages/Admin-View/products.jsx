import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  editProduct,
} from "@/store/slices/productSlice";
import { Plus, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductTile from "@/components/Admin-View/product-tile";
import { toast } from "react-toastify";

export default function Adminproducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    isCombo: false,
    nutrition: {
      calories: "",
      energy: "",
      calcium: "",
      iron: "",
      magnesium: "",
      sodium: "",
      carbohydrates: "",
      fiber: "",
      sugar: "",
      vitaminC: "",
      vitaminE: "",
      potassium: "",
      protein: "",
      fat: "",
      fulvicacid: "",
      humicacid: "",
      minerals: "",
    },
    comboNutrition: [
      {
        name: "",
        unit: "",
        nutrition: {
          calories: "",
          energy: "",
          calcium: "",
          iron: "",
          magnesium: "",
          sodium: "",
          carbohydrates: "",
          fiber: "",
          sugar: "",
          vitaminC: "",
          vitaminE: "",
          potassium: "",
          protein: "",
          fat: "",
          fulvicacid: "",
          humicacid: "",
          minerals: "",
        },
      },
    ],
    details: {
      origin: "",
      variety: "",
      season: "",
      shelfLife: "",
      storage: "",
      certification: "",
      packaging: "",
    },
    rating: 0,
    reviewsCount: 0,
    badges: ["Bestseller", "Organic"],
    images: [],
    view360: "",
    variants: [
      {
        size: "",
        weight: "250g",
        stock: 0,
        price: 0,
        salesPrice: 0,
      },
    ],
    customBoxPrices: [
      { size: "Small", pricePerPiece: 0 },
      { size: "Medium", pricePerPiece: 0 },
      { size: "Large", pricePerPiece: 0 },
    ],
  });

  const dispatch = useDispatch();
  const { productList, error, message } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setOpenCreateProductDialog(false);
      setCurrentEditedId(null);
      resetForm();
      dispatch(getAllProduct());
    }
    if (error) toast.error(error);
  }, [message, error, dispatch]);

  const resetForm = () => {
    setProduct({
      title: "",
      description: "",
      isCombo: false,
      comboNutrition: [
        {
          name: "",
          unit: "",
          nutrition: {
            calories: "",
            energy: "",
            calcium: "",
            iron: "",
            magnesium: "",
            sodium: "",
            carbohydrates: "",
            fiber: "",
            sugar: "",
            vitaminC: "",
            vitaminE: "",
            potassium: "",
            protein: "",
            fat: "",
            fulvicacid: "",
            humicacid: "",
            minerals: "",
          },
        },
      ],
      nutrition: {
        calories: "",
        energy: "",
        calcium: "",
        iron: "",
        magnesium: "",
        sodium: "",
        carbohydrates: "",
        fiber: "",
        sugar: "",
        vitaminC: "",
        vitaminE: "",
        potassium: "",
        protein: "",
        fat: "",
        fulvicacid: "",
        humicacid: "",
        minerals: "",
      },
      details: {
        origin: "",
        variety: "",
        season: "",
        shelfLife: "",
        storage: "",
        certification: "",
        packaging: "",
      },
      rating: 0,
      reviewsCount: 0,
      badges: ["Bestseller", "Organic"],
      images: [],
      view360: "",
      variants: [
        {
          size: "",
          weight: "250g",
          stock: 0,
          price: 0,
          salesPrice: 0,
        },
      ],
      customBoxPrices: [
        { size: "Small", pricePerPiece: 0 },
        { size: "Medium", pricePerPiece: 0 },
        { size: "Large", pricePerPiece: 0 },
      ],
    });
  };
  const handleProductChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleDetailChange = (e) =>
    setProduct({
      ...product,
      details: { ...product.details, [e.target.name]: e.target.value },
    });

  const handleNutritionChange = (e) =>
    setProduct({
      ...product,
      nutrition: { ...product.nutrition, [e.target.name]: e.target.value },
    });

  const handleVariantChange = (e, i) => {
    const { name, value } = e.target;
    const updated = product.variants.map((v, idx) =>
      idx === i
        ? {
            ...v,
            [name]: ["stock", "price", "salesPrice"].includes(name)
              ? Number(value)
              : value,
          }
        : v,
    );
    setProduct({ ...product, variants: updated });
  };

  const addVariantField = () =>
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", weight: "250g", stock: 0, price: 0, salesPrice: 0 },
      ],
    });

  const handleImagesChange = (e) =>
    setProduct({
      ...product,
      images: [...product.images, ...Array.from(e.target.files)],
    });

  const removeImage = (i) =>
    setProduct({
      ...product,
      images: product.images.filter((_, idx) => idx !== i),
    });

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(getAllProduct());
  };

  const handleEdit = (p) => {
    setCurrentEditedId(p._id);
    setOpenCreateProductDialog(true);
    setProduct({
      ...p,
      images: [],
      variants: (p.variants || []).map((v) => ({ ...v })),
      customBoxPrices: (p.customBoxPrices || []).map((c) => ({ ...c })),
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      if (
        [
          "variants",
          "nutrition",
          "details",
          "customBoxPrices,comboNutrition",
        ].includes(key)
      ) {
        formData.append(key, JSON.stringify(product[key]));
      } else if (key === "images") {
        product.images.forEach((img) => formData.append("images", img));
      } else {
        formData.append(key, product[key]);
      }
    });

    currentEditedId
      ? dispatch(editProduct({ id: currentEditedId, formData }))
      : dispatch(addProduct(formData));
  };
  return (
    <Fragment>
      <div className="mb-10 w-full flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-100 pb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 italic">
            Inventory Overview
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mt-1">
            Manage your Himalayan Harvest Catalog
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentEditedId(null);
            setOpenCreateProductDialog(true);
          }}
          className="group relative flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-[#B23A2E] hover:shadow-[0_10px_20px_rgba(178,58,46,0.2)] active:scale-95"
        >
          {/* Decorative Plus Icon with a subtle rotation animation */}
          <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-500">
            <Plus size={16} className="text-white" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-[0.25em]">
            Add New Product
          </span>

          {/* Subtle Inner Glow on Hover */}
          <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-colors" />
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {productList.map((item) => (
          <ProductTile
            key={item._id}
            product={item}
            handleDelete={handleDelete}
            setCurrentEditedId={() => handleEdit(item)}
            setOpenCreateProductDialog={setOpenCreateProductDialog}
          />
        ))}
      </div>

      <Dialog
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col gap-1 mb-8 border-b border-stone-100 pb-6">
              {/* The main title uses the elegant serif font */}
              <DialogTitle className="text-2xl sm:text-3xl font-serif italic font-bold text-stone-900 tracking-tight">
                {currentEditedId
                  ? "Refine Product Specs"
                  : "Register New Harvest"}
              </DialogTitle>

              {/* Subtitle adds a professional "Administrative" layer */}
              <div className="flex items-center gap-2">
                <div className="h-px w-8 bg-[#B23A2E]/30" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                  {currentEditedId
                    ? `Record ID: ${currentEditedId.slice(-6)}`
                    : "Catalog Entry Protocol"}
                </p>
              </div>
            </div>
            <DialogDescription>
              <form onSubmit={handleProductSubmit} className="space-y-6">
                <div className="space-y-6">
                  {/* Title Input */}
                  <div className="group flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1 group-focus-within:text-[#B23A2E] transition-colors">
                      Harvest Designation{" "}
                      <span className="text-[#B23A2E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Himalayan Rock Salt (Mint Infused)"
                      value={product.title}
                      onChange={handleProductChange}
                      required
                      className="w-full px-5 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-stone-900 text-sm font-medium placeholder:text-stone-300 outline-none focus:bg-white focus:border-[#B23A2E]/30 focus:ring-4 focus:ring-[#B23A2E]/5 transition-all duration-300"
                    />
                  </div>

                  {/* Description Textarea */}
                  <div className="group flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1 group-focus-within:text-[#B23A2E] transition-colors">
                      Sourcing Notes & Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Briefly describe the origin and unique characteristics..."
                      value={product.description}
                      onChange={handleProductChange}
                      rows={4}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-900 text-sm font-medium placeholder:text-stone-300 outline-none focus:bg-white focus:border-[#B23A2E]/30 focus:ring-4 focus:ring-[#B23A2E]/5 transition-all duration-300 resize-none leading-relaxed"
                    />
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-stone-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-[#B23A2E] rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
                      Harvest Specifications
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {Object.keys(product.details).map((key) => (
                      <div key={key} className="group flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1 group-focus-within:text-[#B23A2E] transition-colors">
                          {key.replace(/_/g, " ")}
                        </label>

                        <div className="relative">
                          <input
                            type="text"
                            name={key}
                            value={product.details[key]}
                            onChange={handleDetailChange}
                            placeholder={`Enter ${key.replace(/_/g, " ")}...`}
                            className="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-900 text-[13px] font-medium placeholder:text-stone-300 outline-none focus:bg-white focus:border-[#B23A2E]/30 focus:ring-4 focus:ring-[#B23A2E]/5 transition-all duration-300 shadow-sm"
                          />
                          {/* Subtle decorative dot to make it feel like a "field" */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-stone-200 group-focus-within:bg-[#B23A2E]/40 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Nutrition Facts */}
                <div className="mt-10 pt-8 border-t border-stone-100">
                  {/* SECTION HEADER */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center border border-stone-200">
                        <span className="text-[10px] font-black text-stone-900">
                          Nº
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 leading-none">
                          Nutrition Analysis
                        </h3>
                        <p className="text-[9px] font-medium text-stone-400 uppercase tracking-widest mt-1">
                          Standardized Value per 100g
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold">
                      Is Combo Product?
                    </label>
                    <input
                      type="checkbox"
                      checked={product.isCombo}
                      onChange={(e) =>
                        setProduct({ ...product, isCombo: e.target.checked })
                      }
                    />
                  </div>
                  {!product.isCombo ? (
                    // 🟢 NORMAL PRODUCT NUTRITION
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(product.nutrition).map((key) => (
                        <input
                          key={key}
                          name={key}
                          value={product.nutrition[key]}
                          onChange={handleNutritionChange}
                          placeholder={key}
                        />
                      ))}
                    </div>
                  ) : (
                    // 🔥 COMBO NUTRITION
                    <div className="space-y-6">
                      {product.comboNutrition.map((item, index) => (
                        <div key={index} className="border p-4 rounded-xl">
                          <input
                            placeholder="Product Name (e.g. Honey)"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...product.comboNutrition];
                              updated[index].name = e.target.value;
                              setProduct({
                                ...product,
                                comboNutrition: updated,
                              });
                            }}
                          />

                          <input
                            placeholder="Unit (per 100g / 100ml)"
                            value={item.unit}
                            onChange={(e) => {
                              const updated = [...product.comboNutrition];
                              updated[index].unit = e.target.value;
                              setProduct({
                                ...product,
                                comboNutrition: updated,
                              });
                            }}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            {Object.keys(item.nutrition).map((key) => (
                              <input
                                key={key}
                                placeholder={key}
                                value={item.nutrition[key]}
                                onChange={(e) => {
                                  const updated = [...product.comboNutrition];
                                  updated[index].nutrition[key] =
                                    e.target.value;
                                  setProduct({
                                    ...product,
                                    comboNutrition: updated,
                                  });
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setProduct({
                            ...product,
                            comboNutrition: [
                              ...product.comboNutrition,
                              {
                                name: "",
                                unit: "",
                                nutrition: {
                                  calories: "",
                                  energy: "",
                                  calcium: "",
                                  iron: "",
                                  magnesium: "",
                                  sodium: "",
                                  carbohydrates: "",
                                  fiber: "",
                                  sugar: "",
                                  vitaminC: "",
                                  vitaminE: "",
                                  potassium: "",
                                  protein: "",
                                  fat: "",
                                  fulvicacid: "",
                                  humicacid: "",
                                  minerals: "",
                                },
                              },
                            ],
                          })
                        }
                      >
                        + Add Combo Item
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-10 pt-8 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900">
                      Product Variants
                    </h3>
                    <button
                      type="button"
                      onClick={addVariantField}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#B23A2E] hover:text-[#d9746a] transition-colors flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100 hover:border-stone-200 transition-all"
                      >
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-stone-400 uppercase ml-1">
                            Size
                          </label>
                          <select
                            name="size"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(e, index)}
                            className="bg-white border border-stone-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B23A2E]/30 transition-all"
                          >
                            <option value="">None</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-stone-400 uppercase ml-1">
                            Weight
                          </label>
                          <select
                            name="weight"
                            value={variant.weight}
                            onChange={(e) => handleVariantChange(e, index)}
                            className="bg-white border border-stone-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B23A2E]/30 transition-all"
                          >
                            <option value="50g">50g</option>
                            <option value="100g">100g</option>
                            <option value="120g">120g</option>
                            <option value="150g">150g</option>
                            <option value="170g">175g</option>
                            <option value="200g">200g</option>
                            <option value="250g">250g</option>
                            <option value="500g">500g</option>
                            <option value="750g">750g</option>
                            <option value="500g">500g</option>
                            <option value="1kg">1kg</option>
                            <option value="2kg">2kg</option>
                            <option value="3kg">3kg</option>
                            <option value="5kg">5kg</option>
                            <option value="10kg">10kg</option>
                            <option value="12kg">12kg</option>
                            <option value="15kg">15kg</option>
                            <option value="100ml">100ml</option>
                            <option value="200ml">200ml</option>
                            <option value="500ml">500ml</option>
                            <option value="1L">1L</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-stone-400 uppercase ml-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            name="stock"
                            placeholder="0"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(e, index)}
                            className="bg-white border border-stone-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B23A2E]/30"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-stone-400 uppercase ml-1">
                            MRP (₹)
                          </label>
                          <input
                            type="number"
                            name="price"
                            placeholder="0.00"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(e, index)}
                            className="bg-white border border-stone-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B23A2E]/30"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-bold text-stone-400 uppercase ml-1">
                            Sale (₹)
                          </label>
                          <input
                            type="number"
                            name="salesPrice"
                            placeholder="0.00"
                            value={variant.salesPrice}
                            onChange={(e) => handleVariantChange(e, index)}
                            className="bg-white border border-stone-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#B23A2E]/30"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------- IMAGE UPLOAD SECTION ---------- */}
                <div className="mt-10 pt-8 border-t border-stone-100">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 block mb-6">
                    Visual Assets
                  </label>

                  <div className="group relative border-2 border-dashed border-stone-200 rounded-[2rem] p-8 transition-all hover:bg-stone-50 hover:border-[#B23A2E]/20 text-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:text-[#B23A2E] transition-colors">
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-bold text-stone-600">
                        Drop harvest images here
                      </p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* PREVIEW GRID */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        className="group relative w-24 h-24 rounded-2xl overflow-hidden border border-stone-100 shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ---------- FOOTER ACTIONS ---------- */}
                <div className="sticky bottom-0 bg-white/80 backdrop-blur-md mt-12 py-6 border-t border-stone-100 flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setOpenCreateProductDialog(false)}
                    className="px-8 py-3 text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-[#B23A2E] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-stone-200 transition-all active:scale-95"
                  >
                    {currentEditedId
                      ? "Commit Updates"
                      : "Finalize Registration"}
                  </button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
