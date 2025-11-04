// import React from "react";
// import { Button } from "./ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCustomBoxById } from "@/store/slices/customBoxSlice";
// import { addBoxToCartThunk, fetchCartItems } from "@/store/slices/cartSlice";
// import { toast } from "react-toastify";

// export default function CustomBoxTile({
//   box,
//   setOpenCreateProductDialog,
//   setCurrentEditedId,
//   handleDelete,
//   setOpenCartSheet,
// }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   const handleEditClick = () => {
//     setCurrentEditedId(box._id);
//     setOpenCreateProductDialog(true);
//     dispatch(fetchCustomBoxById(box._id));
//   };

//   const handleAddToCart = async () => {
//     if (!user?._id) {
//       toast.error("Please login to add items to cart");
//       return;
//     }
//     try {
//       const res = await dispatch(
//         addBoxToCartThunk({ userId: user._id, id: box._id })
//       );

//       if (res?.success) {
//         dispatch(fetchCartItems(user._id));
//         toast.success("Custom box added to cart!");
//         if (setOpenCartSheet) setOpenCartSheet(true);
//       } else {
//         toast.error(res?.message || "Failed to add custom box");
//       }
//     } catch (err) {
//       toast.error(err.message || "Failed to add custom box");
//     }
//   };

//   const totalQuantity =
//     box.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
//   const remainingSpace = box.boxSize - totalQuantity;
//   const fillPercent = Math.min((totalQuantity / box.boxSize) * 100, 100);

//   return (
//     <div className="relative bg-white rounded-3xl shadow-lg max-w-2xl mx-auto border border-gray-200 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col gap-4">
//       {/* Edit Button */}
//       <button
//         onClick={handleEditClick}
//         className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition duration-200"
//         aria-label="Edit Box"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M11 5h2m-1-1v2m1 12l6-6m-9 3v3h3l7-7-3-3-7 7z"
//           />
//         </svg>
//       </button>

//       {/* Box Info */}
//       <div className="space-y-2">
//         <h2 className="text-3xl font-bold text-gray-900">{box.boxName}</h2>
//         <div className="flex flex-wrap gap-6 text-gray-700">
//           <div className="flex items-center gap-2">
//             <span className="font-medium">📦 Box Size:</span>
//             <span>{box.boxSize}</span>
//           </div>
//           <div className="flex items-start gap-2">
//             <span className="font-medium">💬 Message:</span>
//             <span>{box.message || "-"}</span>
//           </div>
//         </div>

//         {/* Box Space */}
//         <div className="mt-2">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Used: {totalQuantity}</span>
//             <span>Remaining: {remainingSpace}</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-green-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${fillPercent}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Box Items */}
//       <div className="mt-2">
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">
//           🧾 Items ({box.items?.length || 0})
//         </h3>
//         <div className="max-h-52 overflow-auto border border-gray-200 rounded-lg bg-gray-50">
//           {box.items && box.items.length > 0 ? (
//             box.items.map((item, idx) => {
//               const product = item.productId || {};
//               const title = product.title || "Unknown product";
//               const selectedSize = item.size || "-"; 
//               const quantity = item.quantity || 1;
//               const price = item.pricePerUnit || 0;

//               return (
//                 <div
//                   key={idx}
//                   className="flex justify-between items-center px-4 py-2 border-b last:border-b-0 hover:bg-gray-100 transition duration-150"
//                 >
//                   <div className="flex flex-col">
//                     <span className="font-medium text-gray-900">{title}</span>
//                     <span className="text-gray-600 text-sm">
//                       Size: {selectedSize} • Qty: {quantity}
//                     </span>
//                   </div>
//                   <div className="font-medium text-gray-800">
//                     ₹{(quantity * price).toFixed(2)}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-gray-500 italic p-4">No items</div>
//           )}
//         </div>
//       </div>

//       {/* Price Summary */}
//       <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 text-right space-y-1">
//         <div className="flex justify-between">
//           <span>Total Price:</span>
//           <span>₹{box.totalPrice?.toFixed(2) || 0}</span>
//         </div>
//         <div className="flex justify-between items-center text-sm text-gray-700">
//           <span className="font-medium">Discount</span>
//           <span className="text-green-600 font-semibold">
//             - ₹{box.discount?.toFixed(2) || 0}{" "}
//             {box.discount > 0 && (
//               <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
//                 10% off
//               </span>
//             )}
//           </span>
//         </div>

//         <div className="flex justify-between font-bold text-lg">
//           <span>Final Price:</span>
//           <span>₹{box.finalPrice?.toFixed(2) || 0}</span>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3 mt-2">
//         <Button
//           onClick={handleAddToCart}
//           className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl transition duration-200"
//         >
//           🛒 Add to Cart
//         </Button>
//         <Button
//           onClick={() => handleDelete(box._id)}
//           className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition duration-200"
//         >
//           🗑️ Delete
//         </Button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomBoxById } from "@/store/slices/customBoxSlice";
import { addBoxToCartThunk, fetchCartItems } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function CustomBoxTile({
  box,
  setOpenCreateProductDialog,
  setCurrentEditedId,
  handleDelete,
  setOpenCartSheet,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentBox, setCurrentBox] = useState(box);
  useEffect(() => {
    setCurrentBox(box);
  }, [box]);

  const handleEditClick = () => {
    setCurrentEditedId(currentBox._id);
    setOpenCreateProductDialog(true);
    dispatch(fetchCustomBoxById(currentBox._id));
  };

  // const handleAddToCart = async () => {
  //   if (!user?._id) {
  //     toast.error("Please login to add items to cart");
  //     return;
  //   }

  //   try {
  //     const res = await dispatch(
  //       addBoxToCartThunk({ userId: user._id, id: currentBox._id })
  //     );

  //     if (res?.success) {
  //       const updatedBox = await dispatch(fetchCustomBoxById(currentBox._id));
  //       setCurrentBox(updatedBox.payload); 
  //       dispatch(fetchCartItems(user._id));
  //       toast.success("Custom box added to cart!");
  //       if (setOpenCartSheet) setOpenCartSheet(true);
  //     } else {
  //       toast.error(res?.message || "Failed to add custom box");
  //     }
  //   } catch (err) {
  //     toast.error(err.message || "Failed to add custom box");
  //   }
  // };
  const handleAddToCart = async () => {
  if (!user?._id) {
    toast.error("Please login to add items to cart");
    return;
  }

  try {
    const res = await dispatch(
      addBoxToCartThunk({ userId: user._id, id: currentBox._id })
    );

    if (res?.success) {
      // ✅ this now works because your thunk returns res.data
      const updatedBox = await dispatch(fetchCustomBoxById(currentBox._id));

      setCurrentBox(updatedBox?.box || updatedBox); // handle structure safely
      dispatch(fetchCartItems(user._id));
      toast.success("Custom box added to cart!");
      if (setOpenCartSheet) setOpenCartSheet(true);
    } else {
      toast.error(res?.message || "Failed to add custom box");
    }
  } catch (err) {
    console.error("AddToCart error:", err);
    toast.error(err?.message || "Failed to add custom box");
  }
};

  const totalQuantity =
    currentBox.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const remainingSpace = currentBox.boxSize - totalQuantity;
  const fillPercent = Math.min((totalQuantity / currentBox.boxSize) * 100, 100);

  return (
    <div className="relative bg-white rounded-3xl shadow-lg max-w-2xl mx-auto border border-gray-200 hover:shadow-2xl transition-all duration-300 p-6 flex flex-col gap-4">
      <Helmet>
        <title>Create Box - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
      <button
        onClick={handleEditClick}
        className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition duration-200"
        aria-label="Edit Box"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5h2m-1-1v2m1 12l6-6m-9 3v3h3l7-7-3-3-7 7z"
          />
        </svg>
      </button>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">{currentBox.boxName}</h2>
        <div className="flex flex-wrap gap-6 text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-medium">📦 Box Size:</span>
            <span>{currentBox.boxSize}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium">💬 Message:</span>
            <span>{currentBox.message || "-"}</span>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Used: {totalQuantity}</span>
            <span>Remaining: {remainingSpace}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fillPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Box Items */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🧾 Items ({currentBox.items?.length || 0})
        </h3>
        <div className="max-h-52 overflow-auto border border-gray-200 rounded-lg bg-gray-50">
          {currentBox.items && currentBox.items.length > 0 ? (
            currentBox.items.map((item, idx) => {
              const title = item.productId?.title || "Loading..."; // only title
              const selectedSize = item.size || "-";
              const quantity = item.quantity || 1;
              const price = item.pricePerUnit || 0;

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center px-4 py-2 border-b last:border-b-0 hover:bg-gray-100 transition duration-150"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{title}</span>
                    <span className="text-gray-600 text-sm">
                      Size: {selectedSize} • Qty: {quantity}
                    </span>
                  </div>
                  <div className="font-medium text-gray-800">
                    ₹{(quantity * price).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 italic p-4">No items</div>
          )}
        </div>
      </div>
      <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50 text-right space-y-1">
        <div className="flex justify-between">
          <span>Total Price:</span>
          <span>₹{currentBox.totalPrice?.toFixed(2) || 0}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span className="font-medium">Discount</span>
          <span className="text-green-600 font-semibold">
            - ₹{currentBox.discount?.toFixed(2) || 0}{" "}
            {currentBox.discount > 0 && (
              <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                10% off
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Final Price:</span>
          <span>₹{currentBox.finalPrice?.toFixed(2) || 0}</span>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <Button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl transition duration-200"
        >
          🛒 Add to Cart
        </Button>
        <Button
          onClick={() => handleDelete(currentBox._id)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl transition duration-200"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
}
