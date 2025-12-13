// // import React, { useState, useEffect, Fragment } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   addProduct,
// //   getAllProduct,
// //   deleteProduct,
// //   editProduct,
// // } from "@/store/slices/productSlice";
// // import { Button } from "@/components/ui/button";
// // import { Plus, X } from "lucide-react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import ProductTile from "@/components/Admin-View/product-tile";
// // import { toast } from "react-toastify";

// // export default function Adminproducts() {
// //   const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
// //   const [currentEditedId, setCurrentEditedId] = useState(null);

// //   const [product, setProduct] = useState({
// //     title: "",
// //     description: "",
// //     nutrition: {
// //       calories: "",
// //       carbohydrates: "",
// //       fiber: "",
// //       sugar: "",
// //       vitaminC: "",
// //       potassium: "",
// //       protein: "",
// //       fat: "",
// //     },
// //     details: {
// //       origin: "",
// //       variety: "",
// //       season: "",
// //       shelfLife: "",
// //       storage: "",
// //       certification: "",
// //       size: "",
// //       packaging: "",
// //     },
// //     rating: 0,
// //     reviewsCount: 0,
// //     badges: ["Bestseller", "Organic"],
// //     images: [],
// //     view360: "",
// //     variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
// //     customBoxPrices: [
// //       { size: "Small", pricePerPiece: 0 },
// //       { size: "Medium", pricePerPiece: 0 },
// //       { size: "Large", pricePerPiece: 0 },
// //     ],
// //   });

// //   const dispatch = useDispatch();
// //   const { productList, error, message } = useSelector((state) => state.products);

// //   useEffect(() => {
// //     dispatch(getAllProduct());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (message) {
// //       toast.success(message);
// //       setOpenCreateProductDialog(false);
// //       setCurrentEditedId(null);
// //       resetForm();
// //     }
// //     if (error) toast.error(error);
// //   }, [message, error]);

// //   const resetForm = () => {
// //     setProduct({
// //       title: "",
// //       description: "",
// //       nutrition: { calories: "", carbohydrates: "", fiber: "", sugar: "", vitaminC: "", potassium: "", protein: "", fat: "" },
// //       details: { origin: "", variety: "", season: "", shelfLife: "", storage: "", certification: "", size: "", packaging: "" },
// //       rating: 0,
// //       reviewsCount: 0,
// //       badges: ["Bestseller", "Organic"],
// //       images: [],
// //       view360: "",
// //       variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
// //       customBoxPrices: [
// //         { size: "Small", pricePerPiece: 0 },
// //         { size: "Medium", pricePerPiece: 0 },
// //         { size: "Large", pricePerPiece: 0 },
// //       ],
// //     });
// //   };

// //   // Handlers
// //   const handleProductChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
// //   const handleDetailChange = (e) => setProduct({ ...product, details: { ...product.details, [e.target.name]: e.target.value } });
// //   const handleNutritionChange = (e) => setProduct({ ...product, nutrition: { ...product.nutrition, [e.target.name]: e.target.value } });
// //   const handleVariantChange = (e, i) => {
// //     const updated = [...product.variants];
// //     updated[i][e.target.name] = ["stock", "price", "salesPrice"].includes(e.target.name)
// //       ? Number(e.target.value) : e.target.value;
// //     setProduct({ ...product, variants: updated });
// //   };
// //   const handleCustomBoxPriceChange = (e, i) => {
// //     const updated = [...product.customBoxPrices];
// //     updated[i].pricePerPiece = Number(e.target.value);
// //     setProduct({ ...product, customBoxPrices: updated });
// //   };
// //   const addVariantField = () => setProduct({ ...product, variants: [...product.variants, { size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }] });
// //   const handleImagesChange = (e) => setProduct({ ...product, images: [...product.images, ...Array.from(e.target.files)] });
// //   const removeImage = (i) => setProduct({ ...product, images: product.images.filter((_, idx) => idx !== i) });
// //   const handleDelete = async (id) => { await dispatch(deleteProduct(id)); dispatch(getAllProduct()); };
// //   const handleEdit = (p) => { setCurrentEditedId(p._id); setOpenCreateProductDialog(true); setProduct({ ...p, images: [] }); };

// //   const handleProductSubmit = async (e) => {
// //     e.preventDefault();
// //     const formData = new FormData();
// //     Object.keys(product).forEach((key) => {
// //       if (["variants", "nutrition", "details", "customBoxPrices"].includes(key)) {
// //         formData.append(key, JSON.stringify(product[key]));
// //       } else if (key === "images") {
// //         product.images.forEach((img) => formData.append("images", img));
// //       } else {
// //         formData.append(key, product[key]);
// //       }
// //     });
// //     currentEditedId
// //       ? dispatch(editProduct({ id: currentEditedId, formData }))
// //       : dispatch(addProduct(formData));
// //   };

// //   return (
// //     <Fragment>
// //       {/* Add Button */}
// //       <div className="mb-6 w-full flex justify-start">
// //         <Button
// //           onClick={() => { setCurrentEditedId(null); setOpenCreateProductDialog(true); }}
// //           className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
// //         >
// //           <Plus size={18} />
// //           Add New Product
// //         </Button>
// //       </div>

// //       {/* Product Grid */}
// //       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
// //         {productList.map((item) => (
// //           <ProductTile
// //             key={item._id}
// //             product={item}
// //             handleDelete={handleDelete}
// //             setCurrentEditedId={() => handleEdit(item)}
// //             setOpenCreateProductDialog={setOpenCreateProductDialog}
// //           />
// //         ))}
// //       </div>

// //       {/* Dialog Form */}
// //       <Dialog open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
// //         <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
// //           <DialogHeader>
// //             <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
// //               {currentEditedId ? "Edit Product" : "Add New Product"}
// //             </DialogTitle>
// //             <DialogDescription>
// //               <form onSubmit={handleProductSubmit} className="space-y-6" autoComplete="off">
                
// //                 {/* Title */}
// //                 <div>
// //                   <label className="block mb-1 font-medium text-gray-700">Title</label>
// //                   <input
// //                     type="text"
// //                     name="title"
// //                     placeholder="Product title"
// //                     value={product.title}
// //                     onChange={handleProductChange}
// //                     required
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
// //                   />
// //                 </div>

// //                 {/* Description */}
// //                 <div>
// //                   <label className="block mb-1 font-medium text-gray-700">Description</label>
// //                   <textarea
// //                     name="description"
// //                     placeholder="Product description"
// //                     value={product.description}
// //                     onChange={handleProductChange}
// //                     rows={3}
// //                     className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
// //                   />
// //                 </div>

// //                 {/* Product Details */}
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Details</h3>
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                     {Object.keys(product.details).map((key) => (
// //                       <div key={key}>
// //                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
// //                         <input
// //                           type="text"
// //                           name={key}
// //                           value={product.details[key]}
// //                           onChange={handleDetailChange}
// //                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Nutrition Facts */}
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Facts (per 100g)</h3>
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                     {Object.keys(product.nutrition).map((key) => (
// //                       <div key={key}>
// //                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
// //                         <input
// //                           type="text"
// //                           name={key}
// //                           value={product.nutrition[key]}
// //                           onChange={handleNutritionChange}
// //                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Variants */}
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Variants</h3>
// //                   {product.variants.map((variant, index) => (
// //                     <div key={index} className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
// //                       <select
// //                         name="size"
// //                         value={variant.size}
// //                         onChange={(e) => handleVariantChange(e, index)}
// //                         className="border border-gray-300 rounded-md px-3 py-2"
// //                       >
// //                         <option value="Small">Small</option>
// //                         <option value="Medium">Medium</option>
// //                         <option value="Large">Large</option>
// //                       </select>

// //                       <select
// //                         name="weight"
// //                         value={variant.weight}
// //                         onChange={(e) => handleVariantChange(e, index)}
// //                         className="border border-gray-300 rounded-md px-3 py-2"
// //                       >
// //                        <option value="1kg">1kg</option>
// //                         <option value="2kg">2kg</option>
// //                         <option value="3kg">3kg</option>
                        
// //                         <option value="5kg">5kg</option>
// //                         <option value="10kg">10kg</option>
// //                         <option value="12kg">12kg</option>
// //                         <option value="15kg">15kg</option>
// //                       </select>

// //                       <input
// //                         type="number"
// //                         name="stock"
// //                         placeholder="Stock"
// //                         value={variant.stock}
// //                         onChange={(e) => handleVariantChange(e, index)}
// //                         className="border border-gray-300 rounded-md px-3 py-2"
// //                       />

// //                       <input
// //                         type="number"
// //                         name="price"
// //                         placeholder="Price"
// //                         value={variant.price}
// //                         onChange={(e) => handleVariantChange(e, index)}
// //                         className="border border-gray-300 rounded-md px-3 py-2"
// //                         step="0.01"
// //                       />

// //                       <input
// //                         type="number"
// //                         name="salesPrice"
// //                         placeholder="Sales Price"
// //                         value={variant.salesPrice}
// //                         onChange={(e) => handleVariantChange(e, index)}
// //                         className="border border-gray-300 rounded-md px-3 py-2"
// //                         step="0.01"
// //                       />
// //                     </div>
// //                   ))}
// //                   <Button
// //                     type="button"
// //                     onClick={addVariantField}
// //                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-5 py-2 rounded-md"
// //                   >
// //                     + Add Variant
// //                   </Button>
// //                 </div>

// //                 {/* Custom Box Prices */}
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Box Prices (per piece)</h3>
// //                   <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
// //                     {product.customBoxPrices.map((item, index) => (
// //                       <div key={index} className="flex items-center gap-3">
// //                         <label className="w-20 font-medium">{item.size}</label>
// //                         <input
// //                           type="number"
// //                           min="0"
// //                           step="0.01"
// //                           value={item.pricePerPiece}
// //                           onChange={(e) => handleCustomBoxPriceChange(e, index)}
// //                           className="border border-gray-300 rounded-md px-3 py-2 flex-1"
// //                           placeholder="Price per piece"
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Images */}
// //                 <div>
// //                   <label className="block mb-2 font-medium text-gray-700">Product Images</label>
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     multiple
// //                     onChange={handleImagesChange}
// //                     className="block w-full text-sm text-gray-700
// //                       file:mr-4 file:py-2 file:px-4
// //                       file:rounded-md file:border-0
// //                       file:text-sm file:font-semibold
// //                       file:bg-[#F08C7D] file:text-white
// //                       hover:file:bg-[#d9746a]"
// //                   />
// //                   <div className="flex flex-wrap gap-3 mt-3">
// //                     {product.images.map((img, index) => (
// //                       <div key={index} className="relative w-20 h-20 border rounded-md overflow-hidden">
// //                         <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
// //                         <button
// //                           type="button"
// //                           onClick={() => removeImage(index)}
// //                           className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
// //                         >
// //                           <X size={14} />
// //                         </button>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Buttons */}
// //                 <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
// //                   <Button type="button" onClick={() => setOpenCreateProductDialog(false)} variant="outline" className="px-6 py-2 w-full sm:w-auto">
// //                     Cancel
// //                   </Button>
// //                   <Button type="submit" className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-6 py-2 rounded-md w-full sm:w-auto">
// //                     {currentEditedId ? "Update Product" : "Save Product"}
// //                   </Button>
// //                 </div>
// //               </form>
// //             </DialogDescription>
// //           </DialogHeader>
// //         </DialogContent>
// //       </Dialog>
// //     </Fragment>
// //   );
// // }


// import React, { useState, useEffect, Fragment } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addProduct,
//   getAllProduct, // ✅ Corrected name
//   deleteProduct,
//   editProduct,
// } from "@/store/slices/productSlice";
// import { Button } from "@/components/ui/button";
// import { Plus, X } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import ProductTile from "@/components/Admin-View/product-tile";
// import { toast } from "react-toastify";

// export default function Adminproducts() {
//   const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);

//   const [product, setProduct] = useState({
//     title: "",
//     description: "",
//     nutrition: {
//       calories: "",
//       carbohydrates: "",
//       fiber: "",
//       sugar: "",
//       vitaminC: "",
//       potassium: "",
//       protein: "",
//       fat: "",
//     },
//     details: {
//       origin: "",
//       variety: "",
//       season: "",
//       shelfLife: "",
//       storage: "",
//       certification: "",
//       size: "",
//       packaging: "",
//     },
//     rating: 0,
//     reviewsCount: 0,
//     badges: ["Bestseller", "Organic"],
//     images: [],
//     view360: "",
//     variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
//     customBoxPrices: [
//       { size: "Small", pricePerPiece: 0 },
//       { size: "Medium", pricePerPiece: 0 },
//       { size: "Large", pricePerPiece: 0 },
//     ],
//   });

//   const dispatch = useDispatch();
//   const { productList, error, message } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(getAllProduct());
//   }, [dispatch]);

//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//       setOpenCreateProductDialog(false);
//       setCurrentEditedId(null);
//       resetForm();
//       dispatch(getAllProduct());
//     }
//     if (error) toast.error(error);
//   }, [message, error]);

//   const resetForm = () => {
//     setProduct({
//       title: "",
//       description: "",
//       nutrition: { calories: "", carbohydrates: "", fiber: "", sugar: "", vitaminC: "", potassium: "", protein: "", fat: "" },
//       details: { origin: "", variety: "", season: "", shelfLife: "", storage: "", certification: "", size: "", packaging: "" },
//       rating: 0,
//       reviewsCount: 0,
//       badges: ["Bestseller", "Organic"],
//       images: [],
//       view360: "",
//       variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
//       customBoxPrices: [
//         { size: "Small", pricePerPiece: 0 },
//         { size: "Medium", pricePerPiece: 0 },
//         { size: "Large", pricePerPiece: 0 },
//       ],
//     });
//   };

//   // -------------------- HANDLERS --------------------

//   const handleProductChange = (e) =>
//     setProduct({ ...product, [e.target.name]: e.target.value });

//   const handleDetailChange = (e) =>
//     setProduct({
//       ...product,
//       details: { ...product.details, [e.target.name]: e.target.value },
//     });

//   const handleNutritionChange = (e) =>
//     setProduct({
//       ...product,
//       nutrition: { ...product.nutrition, [e.target.name]: e.target.value },
//     });

//   // ✅ Fixed deep clone variant change
//   const handleVariantChange = (e, i) => {
//     const { name, value } = e.target;
//     const updated = product.variants.map((variant, idx) =>
//       idx === i
//         ? {
//             ...variant,
//             [name]: ["stock", "price", "salesPrice"].includes(name)
//               ? Number(value)
//               : value,
//           }
//         : { ...variant }
//     );
//     setProduct({ ...product, variants: updated });
//   };

//   // ✅ Fixed deep clone custom box price change
//   const handleCustomBoxPriceChange = (e, i) => {
//     const { value } = e.target;
//     const updated = product.customBoxPrices.map((item, idx) =>
//       idx === i ? { ...item, pricePerPiece: Number(value) || 0 } : { ...item }
//     );
//     setProduct({ ...product, customBoxPrices: updated });
//   };

//   const addVariantField = () =>
//     setProduct({
//       ...product,
//       variants: [
//         ...product.variants,
//         { size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 },
//       ],
//     });

//   const handleImagesChange = (e) =>
//     setProduct({
//       ...product,
//       images: [...product.images, ...Array.from(e.target.files)],
//     });

//   const removeImage = (i) =>
//     setProduct({
//       ...product,
//       images: product.images.filter((_, idx) => idx !== i),
//     });

//   const handleDelete = async (id) => {
//     await dispatch(deleteProduct(id));
//     dispatch(getAllProduct());
//   };
//   const handleEdit = (p) => {
//     setCurrentEditedId(p._id);
//     setOpenCreateProductDialog(true);
//     setProduct({
//       ...p,
//       images: [],
//       variants: (p.variants || []).map((v) => ({ ...v })),
//       customBoxPrices: (p.customBoxPrices || []).map((c) => ({ ...c })),
//     });
//   };

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     Object.keys(product).forEach((key) => {
//       if (["variants", "nutrition", "details", "customBoxPrices"].includes(key)) {
//         formData.append(key, JSON.stringify(product[key]));
//       } else if (key === "images") {
//         product.images.forEach((img) => formData.append("images", img));
//       } else {
//         formData.append(key, product[key]);
//       }
//     });

//     if (currentEditedId) {
//       dispatch(editProduct({ id: currentEditedId, formData }));
//     } else {
//       dispatch(addProduct(formData));
//     }
//   };

//   // -------------------- JSX --------------------

//   return (
//     <Fragment>
//       {/* Add Button */}
//       <div className="mb-6 w-full flex justify-start">
//         <Button
//           onClick={() => {
//             setCurrentEditedId(null);
//             setOpenCreateProductDialog(true);
//           }}
//           className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={18} />
//           Add New Product
//         </Button>
//       </div>

//       {/* Product Grid */}
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {productList.map((item) => (
//           <ProductTile
//             key={item._id}
//             product={item}
//             handleDelete={handleDelete}
//             setCurrentEditedId={() => handleEdit(item)}
//             setOpenCreateProductDialog={setOpenCreateProductDialog}
//           />
//         ))}
//       </div>

//       {/* Dialog Form */}
//       <Dialog open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
//         <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
//               {currentEditedId ? "Edit Product" : "Add New Product"}
//             </DialogTitle>
//             <DialogDescription>
//               <form onSubmit={handleProductSubmit} className="space-y-6" autoComplete="off">
//                 {/* Title */}
//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Product title"
//                     value={product.title}
//                     onChange={handleProductChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">Description</label>
//                   <textarea
//                     name="description"
//                     placeholder="Product description"
//                     value={product.description}
//                     onChange={handleProductChange}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
//                   />
//                 </div>

//                 {/* Product Details */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {Object.keys(product.details).map((key) => (
//                       <div key={key}>
//                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
//                         <input
//                           type="text"
//                           name={key}
//                           value={product.details[key]}
//                           onChange={handleDetailChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Nutrition Facts */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Facts (per 100g)</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {Object.keys(product.nutrition).map((key) => (
//                       <div key={key}>
//                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
//                         <input
//                           type="text"
//                           name={key}
//                           value={product.nutrition[key]}
//                           onChange={handleNutritionChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Variants */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Variants</h3>
//                   {product.variants.map((variant, index) => (
//                     <div key={index} className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
//                       <select
//                         name="size"
//                         value={variant.size}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       >
//                         <option value="Small">Small</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Large">Large</option>
//                       </select>

//                       <select
//                         name="weight"
//                         value={variant.weight}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       >
//                         <option value="1kg">1kg</option>
//                         <option value="2kg">2kg</option>
//                         <option value="3kg">3kg</option>
//                         <option value="5kg">5kg</option>
//                         <option value="10kg">10kg</option>
//                         <option value="12kg">12kg</option>
//                         <option value="15kg">15kg</option>
//                       </select>

//                       <input
//                         type="number"
//                         name="stock"
//                         placeholder="Stock"
//                         value={variant.stock ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       />

//                       <input
//                         type="number"
//                         name="price"
//                         placeholder="Price"
//                         value={variant.price ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                         step="0.01"
//                       />

//                       <input
//                         type="number"
//                         name="salesPrice"
//                         placeholder="Sales Price"
//                         value={variant.salesPrice ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                         step="0.01"
//                       />
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={addVariantField}
//                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-5 py-2 rounded-md"
//                   >
//                     + Add Variant
//                   </Button>
//                 </div>

//                 {/* Custom Box Prices */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Box Prices (per piece)</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
//                     {product.customBoxPrices.map((item, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <label className="w-20 font-medium">{item.size}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           value={item.pricePerPiece ?? ""}
//                           onChange={(e) => handleCustomBoxPriceChange(e, index)}
//                           className="border border-gray-300 rounded-md px-3 py-2 flex-1"
//                           placeholder="Price per piece"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Images */}
//                 <div>
//                   <label className="block mb-2 font-medium text-gray-700">Product Images</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImagesChange}
//                     className="block w-full text-sm text-gray-700
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-[#F08C7D] file:text-white
//                       hover:file:bg-[#d9746a]"
//                   />
//                   <div className="flex flex-wrap gap-3 mt-3">
//                     {product.images.map((img, index) => (
//                       <div key={index} className="relative w-20 h-20 border rounded-md overflow-hidden">
//                         <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
//                         >
//                           <X size={14} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
//                   <Button
//                     type="button"
//                     onClick={() => setOpenCreateProductDialog(false)}
//                     variant="outline"
//                     className="px-6 py-2 w-full sm:w-auto"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-6 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     {currentEditedId ? "Update Product" : "Save Product"}
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </Fragment>
//   );
// }


// import React, { useState, useEffect, Fragment } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addProduct,
//   getAllProduct,
//   deleteProduct,
//   editProduct,
// } from "@/store/slices/productSlice";
// import { Button } from "@/components/ui/button";
// import { Plus, X } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import ProductTile from "@/components/Admin-View/product-tile";
// import { toast } from "react-toastify";

// export default function Adminproducts() {
//   const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);

//   const [product, setProduct] = useState({
//     title: "",
//     description: "",
//     // product-level price/stock for single-SKU items
//     price: 0,
//     salesPrice: 0,
//     stock: 0,
//     nutrition: {
//       calories: "",
//       carbohydrates: "",
//       fiber: "",
//       sugar: "",
//       vitaminC: "",
//       potassium: "",
//       protein: "",
//       fat: "",
//     },
//     details: {
//       origin: "",
//       variety: "",
//       season: "",
//       shelfLife: "",
//       storage: "",
//       certification: "",
//       size: "",
//       packaging: "",
//     },
//     rating: 0,
//     reviewsCount: 0,
//     badges: ["Bestseller", "Organic"],
//     images: [],
//     view360: "",
//     variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
//     customBoxPrices: [
//       { size: "Small", pricePerPiece: 0 },
//       { size: "Medium", pricePerPiece: 0 },
//       { size: "Large", pricePerPiece: 0 },
//     ],
//   });

//   const dispatch = useDispatch();
//   const { productList, error, message } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(getAllProduct());
//   }, [dispatch]);

//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//       setOpenCreateProductDialog(false);
//       setCurrentEditedId(null);
//       resetForm();
//       dispatch(getAllProduct());
//     }
//     if (error) toast.error(error);
//   }, [message, error, dispatch]);

//   const resetForm = () => {
//     setProduct({
//       title: "",
//       description: "",
//       price: 0,
//       salesPrice: 0,
//       stock: 0,
//       nutrition: { calories: "", carbohydrates: "", fiber: "", sugar: "", vitaminC: "", potassium: "", protein: "", fat: "" },
//       details: { origin: "", variety: "", season: "", shelfLife: "", storage: "", certification: "", size: "", packaging: "" },
//       rating: 0,
//       reviewsCount: 0,
//       badges: ["Bestseller", "Organic"],
//       images: [],
//       view360: "",
//       variants: [{ size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 }],
//       customBoxPrices: [
//         { size: "Small", pricePerPiece: 0 },
//         { size: "Medium", pricePerPiece: 0 },
//         { size: "Large", pricePerPiece: 0 },
//       ],
//     });
//   };

//   // -------------------- HANDLERS --------------------

//   const handleProductChange = (e) =>
//     setProduct({ ...product, [e.target.name]: e.target.value });

//   const handleDetailChange = (e) =>
//     setProduct({
//       ...product,
//       details: { ...product.details, [e.target.name]: e.target.value },
//     });

//   const handleNutritionChange = (e) =>
//     setProduct({
//       ...product,
//       nutrition: { ...product.nutrition, [e.target.name]: e.target.value },
//     });

//   // Fixed deep clone variant change
//   const handleVariantChange = (e, i) => {
//     const { name, value } = e.target;
//     const updated = product.variants.map((variant, idx) =>
//       idx === i
//         ? {
//             ...variant,
//             [name]: ["stock", "price", "salesPrice"].includes(name)
//               ? Number(value)
//               : value,
//           }
//         : { ...variant }
//     );
//     setProduct({ ...product, variants: updated });
//   };

//   // Fixed deep clone custom box price change
//   const handleCustomBoxPriceChange = (e, i) => {
//     const { value } = e.target;
//     const updated = product.customBoxPrices.map((item, idx) =>
//       idx === i ? { ...item, pricePerPiece: Number(value) || 0 } : { ...item }
//     );
//     setProduct({ ...product, customBoxPrices: updated });
//   };

//   const addVariantField = () =>
//     setProduct({
//       ...product,
//       variants: [
//         ...product.variants,
//         { size: "Small", weight: "5kg", stock: 0, price: 0, salesPrice: 0 },
//       ],
//     });

//   const handleImagesChange = (e) =>
//     setProduct({
//       ...product,
//       images: [...product.images, ...Array.from(e.target.files)],
//     });

//   const removeImage = (i) =>
//     setProduct({
//       ...product,
//       images: product.images.filter((_, idx) => idx !== i),
//     });

//   const handleDelete = async (id) => {
//     await dispatch(deleteProduct(id));
//     dispatch(getAllProduct());
//   };

//   const handleEdit = (p) => {
//     setCurrentEditedId(p._id);
//     setOpenCreateProductDialog(true);
//     setProduct({
//       ...p,
//       // remove remote image urls from `images` state to force re-upload if user wants new files
//       images: [],
//       // deep clone arrays to avoid accidental mutation
//       variants: (p.variants || []).map((v) => ({ ...v })),
//       customBoxPrices: (p.customBoxPrices || []).map((c) => ({ ...c })),
//       // ensure product-level numeric values exist
//       price: p.price ?? 0,
//       salesPrice: p.salesPrice ?? 0,
//       stock: p.stock ?? 0,
//     });
//   };

//   const handleProductSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     // Append keys - for arrays/objects we stringify
//     Object.keys(product).forEach((key) => {
//       if (["variants", "nutrition", "details", "customBoxPrices"].includes(key)) {
//         formData.append(key, JSON.stringify(product[key]));
//       } else if (key === "images") {
//         product.images.forEach((img) => formData.append("images", img));
//       } else {
//         // append even numeric fields (they'll be strings) - server will parse
//         formData.append(key, product[key]);
//       }
//     });

//     if (currentEditedId) {
//       dispatch(editProduct({ id: currentEditedId, formData }));
//     } else {
//       dispatch(addProduct(formData));
//     }
//   };

//   // -------------------- JSX --------------------

//   return (
//     <Fragment>
//       {/* Add Button */}
//       <div className="mb-6 w-full flex justify-start">
//         <Button
//           onClick={() => {
//             setCurrentEditedId(null);
//             setOpenCreateProductDialog(true);
//           }}
//           className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={18} />
//           Add New Product
//         </Button>
//       </div>

//       {/* Product Grid */}
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {productList.map((item) => (
//           <ProductTile
//             key={item._id}
//             product={item}
//             handleDelete={handleDelete}
//             setCurrentEditedId={() => handleEdit(item)}
//             setOpenCreateProductDialog={setOpenCreateProductDialog}
//           />
//         ))}
//       </div>

//       {/* Dialog Form */}
//       <Dialog open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
//         <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
//               {currentEditedId ? "Edit Product" : "Add New Product"}
//             </DialogTitle>
//             <DialogDescription>
//               <form onSubmit={handleProductSubmit} className="space-y-6" autoComplete="off">
//                 {/* Title */}
//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     placeholder="Product title"
//                     value={product.title}
//                     onChange={handleProductChange}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">Description</label>
//                   <textarea
//                     name="description"
//                     placeholder="Product description"
//                     value={product.description}
//                     onChange={handleProductChange}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
//                   />
//                 </div>

//                 {/* Product-level Price / Stock (single-SKU support) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-gray-700">Price</label>
//                     <input
//                       type="number"
//                       name="price"
//                       placeholder="Base price (per unit)"
//                       value={product.price ?? ""}
//                       onChange={(e) => setProduct({ ...product, price: Number(e.target.value) || 0 })}
//                       step="0.01"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium text-gray-700">Sales Price</label>
//                     <input
//                       type="number"
//                       name="salesPrice"
//                       placeholder="Sales price (optional)"
//                       value={product.salesPrice ?? ""}
//                       onChange={(e) => setProduct({ ...product, salesPrice: Number(e.target.value) || 0 })}
//                       step="0.01"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block mb-1 font-medium text-gray-700">Stock</label>
//                     <input
//                       type="number"
//                       name="stock"
//                       placeholder="Stock quantity"
//                       value={product.stock ?? ""}
//                       onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) || 0 })}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                     />
//                   </div>
//                 </div>

//                 {/* Product Details */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Details</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {Object.keys(product.details).map((key) => (
//                       <div key={key}>
//                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
//                         <input
//                           type="text"
//                           name={key}
//                           value={product.details[key]}
//                           onChange={handleDetailChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Nutrition Facts */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Facts (per 100g)</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {Object.keys(product.nutrition).map((key) => (
//                       <div key={key}>
//                         <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
//                         <input
//                           type="text"
//                           name={key}
//                           value={product.nutrition[key]}
//                           onChange={handleNutritionChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Variants */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Variants</h3>
//                   {product.variants.map((variant, index) => (
//                     <div key={index} className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
//                       <select
//                         name="size"
//                         value={variant.size}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       >
//                         <option value="Small">Small</option>
//                         <option value="Medium">Medium</option>
//                         <option value="Large">Large</option>
//                       </select>

//                       <select
//                         name="weight"
//                         value={variant.weight}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       >
//                         <option value="1kg">1kg</option>
//                         <option value="2kg">2kg</option>
//                         <option value="3kg">3kg</option>
//                         <option value="5kg">5kg</option>
//                         <option value="10kg">10kg</option>
//                         <option value="12kg">12kg</option>
//                         <option value="15kg">15kg</option>
//                       </select>

//                       <input
//                         type="number"
//                         name="stock"
//                         placeholder="Stock"
//                         value={variant.stock ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                       />

//                       <input
//                         type="number"
//                         name="price"
//                         placeholder="Price"
//                         value={variant.price ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                         step="0.01"
//                       />

//                       <input
//                         type="number"
//                         name="salesPrice"
//                         placeholder="Sales Price"
//                         value={variant.salesPrice ?? ""}
//                         onChange={(e) => handleVariantChange(e, index)}
//                         className="border border-gray-300 rounded-md px-3 py-2"
//                         step="0.01"
//                       />
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={addVariantField}
//                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-5 py-2 rounded-md"
//                   >
//                     + Add Variant
//                   </Button>
//                 </div>

//                 {/* Custom Box Prices */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Box Prices (per piece)</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
//                     {product.customBoxPrices.map((item, index) => (
//                       <div key={index} className="flex items-center gap-3">
//                         <label className="w-20 font-medium">{item.size}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           value={item.pricePerPiece ?? ""}
//                           onChange={(e) => handleCustomBoxPriceChange(e, index)}
//                           className="border border-gray-300 rounded-md px-3 py-2 flex-1"
//                           placeholder="Price per piece"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Images */}
//                 <div>
//                   <label className="block mb-2 font-medium text-gray-700">Product Images</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImagesChange}
//                     className="block w-full text-sm text-gray-700
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-[#F08C7D] file:text-white
//                       hover:file:bg-[#d9746a]"
//                   />
//                   <div className="flex flex-wrap gap-3 mt-3">
//                     {product.images.map((img, index) => (
//                       <div key={index} className="relative w-20 h-20 border rounded-md overflow-hidden">
//                         <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
//                         >
//                           <X size={14} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
//                   <Button
//                     type="button"
//                     onClick={() => setOpenCreateProductDialog(false)}
//                     variant="outline"
//                     className="px-6 py-2 w-full sm:w-auto"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-6 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     {currentEditedId ? "Update Product" : "Save Product"}
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </Fragment>
//   );
// }



import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  editProduct,
} from "@/store/slices/productSlice";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
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
    nutrition: {
      calories: "",
      carbohydrates: "",
      fiber: "",
      sugar: "",
      vitaminC: "",
      potassium: "",
      protein: "",
      fat: "",
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
        size: "",          // ✅ empty = dry fruits supported
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
    (state) => state.products
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
      nutrition: {
        calories: "",
        carbohydrates: "",
        fiber: "",
        sugar: "",
        vitaminC: "",
        potassium: "",
        protein: "",
        fat: "",
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

  /* ---------------- HANDLERS ---------------- */

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
        : v
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
      if (["variants", "nutrition", "details", "customBoxPrices"].includes(key)) {
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

  /* ---------------- JSX ---------------- */

  return (
    <Fragment>
      <div className="mb-6 w-full flex justify-start">
        <Button
          onClick={() => {
            setCurrentEditedId(null);
            setOpenCreateProductDialog(true);
          }}
          className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Product
        </Button>
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

      <Dialog open={openCreateProductDialog} onOpenChange={setOpenCreateProductDialog}>
        <DialogContent className="bg-[#FFECE8] max-w-3xl w-[95%] mx-auto rounded-lg p-6 sm:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handleProductSubmit} className="space-y-6">

                <div>
//                   <label className="block mb-1 font-medium text-gray-700">Title</label>
//                   <input
                    type="text"
                    name="title"
                    placeholder="Product title"
                    value={product.title}
                    onChange={handleProductChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    placeholder="Product description"
                    value={product.description}
                    onChange={handleProductChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                  />
                </div>

                {/* Product-level Price / Stock (single-SKU support) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Base price (per unit)"
                      value={product.price ?? ""}
                      onChange={(e) => setProduct({ ...product, price: Number(e.target.value) || 0 })}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Sales Price</label>
                    <input
                      type="number"
                      name="salesPrice"
                      placeholder="Sales price (optional)"
                      value={product.salesPrice ?? ""}
                      onChange={(e) => setProduct({ ...product, salesPrice: Number(e.target.value) || 0 })}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock quantity"
                      value={product.stock ?? ""}
                      onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(product.details).map((key) => (
                      <div key={key}>
                        <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
                        <input
                          type="text"
                          name={key}
                          value={product.details[key]}
                          onChange={handleDetailChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Facts (per 100g)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(product.nutrition).map((key) => (
                      <div key={key}>
                        <label className="block mb-1 font-medium text-gray-700 capitalize">{key}</label>
                        <input
                          type="text"
                          name={key}
                          value={product.nutrition[key]}
                          onChange={handleNutritionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* VARIANTS */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Variants</h3>

                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-3"
                    >
                      {/* SIZE (optional) */}
                      <select
                        name="size"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="border rounded-md px-3 py-2"
                      >
                        <option value="">No Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>

                      {/* WEIGHT */}
                      <select
                        name="weight"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="border rounded-md px-3 py-2"
                      >
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="750g">750g</option>
                        <option value="1kg">1kg</option>
                        <option value="2kg">2kg</option>
                        <option value="3kg">3kg</option>
                        <option value="5kg">5kg</option>
                        <option value="10kg">10kg</option>
                        <option value="12kg">12kg</option>
                        <option value="15kg">15kg</option>
                      </select>

                      <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="border rounded-md px-3 py-2"
                      />

                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="border rounded-md px-3 py-2"
                      />

                      <input
                        type="number"
                        name="salesPrice"
                        placeholder="Sale Price"
                        value={variant.salesPrice}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="border rounded-md px-3 py-2"
                      />
                    </div>
                  ))}

                  <Button type="button" onClick={addVariantField}>
                    + Add Variant
                  </Button>
                </div>

                <Button type="submit" className="bg-[#F08C7D] text-white">
                  {currentEditedId ? "Update Product" : "Save Product"}
                </Button>

              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
