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
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

export default function CustomBoxTile() {
  // Animation Variants
  const containerFade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#fdfcf6] min-h-screen flex flex-col font-sans selection:bg-orange-100">
      <Helmet>
        <title>Build Your Own Fruit Box – Range Of Himalayas</title>
        <meta name="description" content="Customize your own Himalayan fruit box with apples, kiwis, pears & more." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden pt-16 pb-20 px-6 text-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-orange-50/50 to-transparent rounded-full blur-3xl -z-10" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerFade}
          className="max-w-4xl mx-auto"
        >
          <motion.span 
            variants={itemUp}
            className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-orange-100 text-[#d97706] rounded-full"
          >
            Coming Soon to 2026
          </motion.span>
          
          <motion.h1 
            variants={itemUp}
            className="text-4xl md:text-7xl font-serif font-black text-slate-900 leading-tight mb-6"
          >
            Your Daily Dose of <br/>
            <span className="text-[#d97706] italic font-medium">Himalayan Freshness</span>
          </motion.h1>

          <motion.p 
            variants={itemUp}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We're handpicking the finest orchards to bring you a fully customizable 
            fruit box experience. Straight from the mountains to your doorstep.
          </motion.p>

          <motion.div variants={itemUp}>
            <a 
              href="https://forms.gle/5M73wYV9Je6SJtow9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#d97706] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-orange-200 hover:bg-[#b66104] hover:-translate-y-1 transition-all duration-300"
            >
              Notify Me on Launch 🚀
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* --- BENEFITS GRID --- */}
      <section className="px-6 py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Crafted for Quality</h2>
            <div className="h-1 w-20 bg-orange-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🍏",
                title: "Your Fruit, Your Way",
                desc: "Forget pre-packed sets. Mix and match apples, kiwis, and pears based on your mood.",
              },
              {
                icon: "📦",
                title: "Flexi-Sizing",
                desc: "From a 2kg 'Taster' pack to a 7kg 'Family' crate, pick the volume that fits your life.",
              },
              {
                icon: "🌿",
                title: "Zero Middlemen",
                desc: "We skip the warehouses. Your fruits stay on the tree until you place your order.",
              },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-[#fdfcf6] border border-orange-50 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{b.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-slate-600 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12 italic underline decoration-orange-300 underline-offset-8">
          Curious?
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "When is the feature launching?",
              a: "We are currently finalizing our logistics to ensure the fruit stays fresh during transit. Join the notification list to be the first to know!",
            },
            {
              q: "What fruits can I add?",
              a: "The list changes with the Himalayan seasons: Crisp Apples, Sun-kissed Kiwis, and juicy Pears are the staples.",
            },
            {
              q: "Will it deliver across India?",
              a: "Absolutely. We are partnering with express delivery partners to reach every corner of the country.",
            },
          ].map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer"
            >
              <summary className="flex items-center justify-between p-6 font-bold text-slate-800 list-none group-open:bg-orange-50 transition-colors">
                {faq.q}
                <span className="text-orange-500 group-open:rotate-45 transition-transform text-2xl">+</span>
              </summary>
              <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}