// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { Plus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "./ui/dialog";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createCustomBox,
//   updateCustomBox,
//   deleteCustomBox,
//   fetchUserCustomBoxes,
// } from "@/store/slices/customBoxSlice";
// import CustomBoxTile from "./CustomBoxTile";

// export default function CustomBox() {
//   const [openBoxDialog, setOpenBoxDialog] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingBoxId, setEditingBoxId] = useState(null);

//   const { productList } = useSelector((state) => state.products);
//   const { user } = useSelector((state) => state.auth);
//   const { boxes } = useSelector((state) => state.customBox);
//   const dispatch = useDispatch();

//   const [box, setBox] = useState({
//     boxName: "My Custom Box",
//     boxSize: 6,
//     items: [],
//     isGift: false,
//     message: "",
//     totalPrice: 0,
//     discount: 0,
//     finalPrice: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBox((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const calculateTotals = (items) => {
//     const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
//     const totalPrice = items.reduce(
//       (sum, item) => sum + item.quantity * (item.pricePerUnit || 0),
//       0
//     );
//     const discountPercent = totalQuantity >= 10 ? 10 : 0;
//     const discountAmount = (totalPrice * discountPercent) / 100;
//     const finalPrice = totalPrice - discountAmount;
//     return { totalPrice, discount: discountAmount, finalPrice, discountPercent };
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...box.items];
//     updatedItems[index][field] = value;

//     const productId = updatedItems[index].productId;
//     const size = updatedItems[index].size;

//     if (productId && size) {
//       const product = productList.find((p) => p._id === productId);
//       const priceObj = product?.customBoxPrices.find((p) => p.size === size);
//       if (!priceObj) {
//         console.warn(
//           `Price not defined for size "${size}" of product "${product?.title}"`
//         );
//         updatedItems[index].pricePerUnit = 0;
//       } else {
//         updatedItems[index].pricePerUnit = priceObj.pricePerPiece;
//       }
//     } else {
//       updatedItems[index].pricePerUnit = 0;
//     }

//     const { totalPrice, discount, finalPrice } = calculateTotals(updatedItems);

//     setBox((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalPrice,
//       discount,
//       finalPrice,
//     }));
//   };

//   const addItem = () => {
//     const totalQuantity = box.items.reduce((sum, item) => sum + item.quantity, 0);
//     if (totalQuantity >= box.boxSize) {
//       alert(`You can only add up to ${box.boxSize} total items in this box.`);
//       return;
//     }

//     setBox((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         { productId: "", size: "", quantity: 1, pricePerUnit: 0 },
//       ],
//     }));
//   };

//   const removeItem = (index) => {
//     const updatedItems = box.items.filter((_, i) => i !== index);
//     const { totalPrice, discount, finalPrice } = calculateTotals(updatedItems);

//     setBox((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalPrice,
//       discount,
//       finalPrice,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     for (const item of box.items) {
//       if (!item.productId || !item.size || !item.quantity) {
//         alert("All items must have a product, size, and quantity.");
//         return;
//       }
//     }

//     const payload = {
//       userId: user._id,
//       boxName: box.boxName,
//       boxSize: box.boxSize,
//       items: box.items,
//       isGift: box.isGift,
//       message: box.message,
//       totalPrice: box.totalPrice,
//       discount: box.discount,
//       finalPrice: box.finalPrice,
//     };

//     if (isEditMode) {
//       dispatch(updateCustomBox({ id: editingBoxId, boxData: payload }));
//     } else {
//       dispatch(createCustomBox(payload));
//     }

//     setOpenBoxDialog(false);
//     resetForm();
//   };

//   const handleEdit = (boxToEdit) => {
//     setIsEditMode(true);
//     setEditingBoxId(boxToEdit._id);

//     const normalizedItems = (boxToEdit.items || []).map((item) => ({
//       productId: item.productId?._id || item.productId,
//       size: item.size || "",
//       quantity: item.quantity || 1,
//       pricePerUnit: item.pricePerUnit || 0,
//       totalPrice:
//         item.totalPrice || (item.pricePerUnit || 0) * (item.quantity || 1),
//     }));

//     const { totalPrice, discount, finalPrice } = calculateTotals(normalizedItems);

//     setBox({
//       boxName: boxToEdit.boxName || "",
//       boxSize: boxToEdit.boxSize || 6,
//       items: normalizedItems,
//       isGift: boxToEdit.isGift || false,
//       message: boxToEdit.message || "",
//       totalPrice: boxToEdit.totalPrice || totalPrice,
//       discount: boxToEdit.discount || discount,
//       finalPrice: boxToEdit.finalPrice || finalPrice,
//     });

//     setOpenBoxDialog(true);
//   };

//   const handleDelete = (id) => {
//     dispatch(deleteCustomBox(id));
//   };

//   const resetForm = () => {
//     setIsEditMode(false);
//     setEditingBoxId(null);
//     setBox({
//       boxName: "My Custom Box",
//       boxSize: 6,
//       items: [],
//       isGift: false,
//       message: "",
//       totalPrice: 0,
//       discount: 0,
//       finalPrice: 0,
//     });
//   };

//   useEffect(() => {
//     if (user?._id) {
//       dispatch(fetchUserCustomBoxes(user._id));
//     }
//   }, [user]);

//   const totalQuantity = box.items.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div className="bg-[#FFF8E1] min-h-screen">
//       <div className="p-4 sm:p-6 md:p-10 w-full flex justify-center md:justify-start">
//         <Button
//           className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
//           onClick={() => {
//             resetForm();
//             setOpenBoxDialog(true);
//           }}
//         >
//           <Plus size={18} />
//           Create Custom Box
//         </Button>
//       </div>
//       <div className="m-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
//         {boxes.map((item) => (
//           <CustomBoxTile
//             key={item._id}
//             box={item}
//             handleDelete={handleDelete}
//             setCurrentEditedId={() => handleEdit(item)}
//             setOpenCreateProductDialog={setOpenBoxDialog}
//           />
//         ))}
//       </div>

//       {/* Dialog for Create/Edit */}
//       <Dialog open={openBoxDialog} onOpenChange={setOpenBoxDialog}>
//         <DialogContent className="bg-[#FFECE8] w-[95%] sm:w-[90%] md:max-w-2xl lg:max-w-3xl mt-4 mx-auto rounded-lg p-4 sm:p-6 md:p-8 shadow-lg max-h-[85vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
//               {isEditMode ? "Edit Custom Box" : "Create New Custom Box"}
//             </DialogTitle>
//             <DialogDescription>
//               <form
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//                 autoComplete="off"
//               >
//                 {/* Box Name */}
//                 <div>
//                   <label htmlFor="boxName" className="block font-medium mb-1">
//                     Box Name
//                   </label>
//                   <input
//                     type="text"
//                     id="boxName"
//                     name="boxName"
//                     value={box.boxName}
//                     onChange={handleChange}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#F08C7D]"
//                   />
//                 </div>

//                 {/* Box Size */}
//                 <div>
//                   <label htmlFor="boxSize" className="block font-medium mb-1">
//                     Box Size
//                   </label>
//                   <select
//                     id="boxSize"
//                     name="boxSize"
//                     value={box.boxSize}
//                     onChange={handleChange}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-[#F08C7D]"
//                   >
//                     <option value={6}>6</option>
//                     <option value={12}>12</option>
//                     <option value={24}>24</option>
//                   </select>
//                 </div>

//                 {/* Box Items */}
//                 <div>
//                   <label className="block font-medium mb-2">Box Items</label>
//                   {box.items.map((item, index) => {
//                     const selectedProduct = productList.find(
//                       (p) => p._id === item.productId
//                     );
//                     const availableSizes =
//                       selectedProduct?.customBoxPrices?.filter(
//                         (s) => s.pricePerPiece > 0
//                       ) || [];

//                     const remainingQuantity =
//                       box.boxSize -
//                       box.items.reduce(
//                         (sum, it, idx) =>
//                           idx !== index ? sum + it.quantity : sum,
//                         0
//                       );

//                     return (
//                       <div
//                         key={index}
//                         className="space-y-2 border p-4 rounded-lg mb-4"
//                       >
//                         {/* Product Selector */}
//                         <div>
//                           <label className="block mb-1">Product</label>
//                           <select
//                             value={item.productId}
//                             onChange={(e) =>
//                               handleItemChange(index, "productId", e.target.value)
//                             }
//                             className="w-full rounded-md border border-gray-300 px-3 py-2"
//                             required
//                           >
//                             <option value="">Select product</option>
//                             {productList.map((product) => (
//                               <option key={product._id} value={product._id}>
//                                 {product.title}
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         {/* Size + Quantity (Responsive Grid) */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                           {/* Size Selector */}
//                           <div>
//                             <label className="block mb-1">Size</label>
//                             <select
//                               value={item.size}
//                               onChange={(e) =>
//                                 handleItemChange(index, "size", e.target.value)
//                               }
//                               className="w-full rounded-md border border-gray-300 px-3 py-2"
//                               required
//                               disabled={!item.productId}
//                             >
//                               <option value="">Select size</option>
//                               {availableSizes.map((sizeObj, idx) => (
//                                 <option key={idx} value={sizeObj.size}>
//                                   {sizeObj.size} - ₹{sizeObj.pricePerPiece}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>

//                           {/* Quantity */}
//                           <div>
//                             <label className="block mb-1">Quantity</label>
//                             <input
//                               type="number"
//                               value={item.quantity}
//                               min={1}
//                               max={remainingQuantity}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   index,
//                                   "quantity",
//                                   parseInt(e.target.value)
//                                 )
//                               }
//                               className="w-full rounded-md border border-gray-300 px-3 py-2"
//                               required
//                               disabled={!item.size}
//                             />
//                           </div>
//                         </div>

//                         {/* Price */}
//                         <div className="text-right font-medium text-sm sm:text-base">
//                           Price: ₹{item.pricePerUnit.toFixed(2)} × {item.quantity} = ₹
//                           {(item.quantity * (item.pricePerUnit || 0)).toFixed(2)}
//                         </div>

//                         {/* Remove Item */}
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="text-red-600 mt-2 w-full sm:w-auto"
//                           onClick={() => removeItem(index)}
//                         >
//                           Remove Item
//                         </Button>
//                       </div>
//                     );
//                   })}

//                   {/* Add Item Button */}
//                   <Button
//                     type="button"
//                     onClick={addItem}
//                     disabled={totalQuantity >= box.boxSize}
//                     className={`mt-2 w-full text-sm sm:text-base ${
//                       totalQuantity >= box.boxSize
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-[#F08C7D] hover:bg-[#d9746a] text-white"
//                     }`}
//                   >
//                     + Add Item ({totalQuantity}/{box.boxSize})
//                   </Button>
//                 </div>

//                 {/* Gift */}
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     id="isGift"
//                     name="isGift"
//                     checked={box.isGift}
//                     onChange={handleChange}
//                     className="rounded border-gray-300 text-[#F08C7D]"
//                   />
//                   <label htmlFor="isGift" className="font-medium">
//                     This is a gift
//                   </label>
//                 </div>

//                 {/* Gift Message */}
//                 <div>
//                   <label htmlFor="message" className="block font-medium mb-1">
//                     Gift Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={box.message}
//                     onChange={handleChange}
//                     maxLength={300}
//                     className="w-full rounded-md border border-gray-300 px-3 py-2"
//                   />
//                 </div>

//                 {/* Totals */}
//                 <div className="text-right space-y-1 mt-4 text-sm sm:text-base">
//                   <div>Total Price: ₹{box.totalPrice.toFixed(2)}</div>
//                   <div>
//                     Discount: ₹{box.discount.toFixed(2)}{" "}
//                     {box.discount > 0 && <span>(10% off)</span>}
//                   </div>
//                   <div className="font-bold">
//                     Final Price: ₹{box.finalPrice.toFixed(2)}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
//                   <Button
//                     type="button"
//                     onClick={() => {
//                       setOpenBoxDialog(false);
//                       resetForm();
//                     }}
//                     variant="outline"
//                     className="px-4 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-6 py-2 rounded-md w-full sm:w-auto"
//                   >
//                     {isEditMode ? "Update Box" : "Create Box"}
//                   </Button>
//                 </div>
//               </form>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import Footer from "@/Pages/Footer";
import React from "react";

export default function CustomBoxTile() {
  return (
    <div className="text-center bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] p-10 rounded-3xl shadow-lg max-w-xl mx-auto mt-10">
      <h1 className="text-4xl font-extrabold text-[#d97706] mb-3">
        🍎 Build Your Own Box
      </h1>

      <p className="text-gray-700 text-lg mb-6">
        Exciting things are coming! Customize your own Himalayan fruit box —
        launching soon. 🌄
      </p>

      <div className="mt-6">
        <p className="text-3xl font-bold text-[#d97706] mb-2">
          🚀 Coming Soon
        </p>
        <p className="text-sm text-gray-600">
          Stay tuned for our launch — freshness from the Himalayas, soon at your doorstep!
        </p>
      </div>

      <Footer/>
    </div>
  );
}
