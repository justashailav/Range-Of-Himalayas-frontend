// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Badge } from "@/components/ui/badge";
// import rajmaImg from "./../assets/Rajma.png";
// import { useState, useEffect } from "react";
// import { cancelOrder, cancelOrderItem } from "@/store/slices/orderSlice";

// export default function ShoppingOrderDetailsView() {
//   const { state } = useLocation();
//   const { user } = useSelector((state) => state.auth);
//   const { orderDetails: initialOrderDetails } = state || {};
//   const { productList } = useSelector((state) => state.products);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { orderId } = useParams();

//   const [orderDetails, setOrderDetails] = useState(initialOrderDetails);

//   const [loadingCancelOrder, setLoadingCancelOrder] = useState(false);
//   const [successMsg, setSuccessMsg] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   const [partialCancelLoading, setPartialCancelLoading] = useState({});
//   const [partialCancelSuccess, setPartialCancelSuccess] = useState({});
//   const [partialCancelError, setPartialCancelError] = useState({});
//   const [cancelQtyInput, setCancelQtyInput] = useState({});
//   const [cancelReasonInput, setCancelReasonInput] = useState({});

//   if (!orderDetails) {
//     return (
//       <p className="text-center mt-20 text-gray-500 text-lg">
//         Order details not found.
//       </p>
//     );
//   }

//   // Compute displayed quantity after partial cancellations
//   const getDisplayedQty = (item) => {
//     const cancelledQty = orderDetails.cancelledItems
//       ?.filter((ci) => ci.productId === item.productId)
//       .reduce((sum, ci) => sum + ci.quantity, 0) || 0;
//     return item.quantity - cancelledQty;
//   };

//   // Free gift logic
//   const getFreeGift = (total) => {
//     if (total > 3000) return { name: "Pahadi Rajma", quantity: 3 };
//     if (total >= 3000) return { name: "Pahadi Rajma", quantity: 2 };
//     if (total >= 2000) return { name: "Pahadi Rajma", quantity: 1 };
//     return null;
//   };
//   const freeGift = getFreeGift(orderDetails.totalAmount);

//   // Cancel eligibility: within 24 hrs & confirmed
//   const isCancelable = () => {
//     if (!orderDetails.orderDate) return false;
//     const orderTime = new Date(orderDetails.orderDate).getTime();
//     const now = Date.now();
//     const hoursPassed = (now - orderTime) / (1000 * 60 * 60);
//     return hoursPassed <= 24 && orderDetails.orderStatus === "confirmed";
//   };

//   // Return eligibility: after delivered
//   const isReturnable = () => orderDetails.orderStatus === "delivered";

//   // Full order return check
//   const isFullOrderReturned =
//     orderDetails.returnStatus === "requested" ||
//     orderDetails.returnStatus === "processed";

//   // Check if item already requested for return
//   const isItemReturned = (item) =>
//     orderDetails.returnRequests?.some((r) => r.productId === item.productId);

//   // Full order cancellation
//   const handleCancelOrder = async () => {
//     setLoadingCancelOrder(true);
//     setErrorMsg(null);
//     setSuccessMsg(null);
//     try {
//       const response = await dispatch(cancelOrder(orderDetails._id));
//       setSuccessMsg(response?.payload?.message || "Order cancelled successfully");
//       // Optionally, you can update orderDetails state
//       setOrderDetails((prev) => ({
//         ...prev,
//         orderStatus: "cancelled",
//         cancelStatus: "requested",
//       }));
//     } catch (error) {
//       setErrorMsg(error?.message || "Failed to cancel order");
//     } finally {
//       setLoadingCancelOrder(false);
//     }
//   };

//   // Redirect to Return Request Page
//   const handleReturnFullOrder = () => {
//     navigate(`/return-request/${orderDetails._id}`, {
//       state: { orderDetails },
//     });
//   };

//   // Partial cancellation per item
//   const handleCancelItem = async (item) => {
//     const remainingQty = getDisplayedQty(item);
//     const inputVal = Number(cancelQtyInput[item.productId]) || 0;

//     // Clamp quantity to min 1 and max remainingQty
//     const quantity = Math.min(Math.max(inputVal, 1), remainingQty);
//     if (quantity <= 0) return;

//     const reason = cancelReasonInput[item.productId] || "User requested cancellation";

//     setPartialCancelLoading((prev) => ({ ...prev, [item.productId]: true }));
//     setPartialCancelSuccess((prev) => ({ ...prev, [item.productId]: null }));
//     setPartialCancelError((prev) => ({ ...prev, [item.productId]: null }));

//     try {
//       const response = await dispatch(
//         cancelOrderItem(orderId, [{ productId: item.productId, quantity, reason }])
//       );

//       // Update success
//       setPartialCancelSuccess((prev) => ({
//         ...prev,
//         [item.productId]: response?.payload?.message || "Cancelled successfully",
//       }));

//       // Clear input after successful cancellation
//       setCancelQtyInput((prev) => ({ ...prev, [item.productId]: "" }));
//       setCancelReasonInput((prev) => ({ ...prev, [item.productId]: "" }));

//       // Update orderDetails locally to reflect cancelled item
//       setOrderDetails((prev) => {
//         const updatedCancelledItems = [
//           ...(prev.cancelledItems || []),
//           { productId: item.productId, quantity },
//         ];
//         return { ...prev, cancelledItems: updatedCancelledItems };
//       });
//     } catch (error) {
//       setPartialCancelError((prev) => ({
//         ...prev,
//         [item.productId]: error?.message || "Failed to cancel item",
//       }));
//     } finally {
//       setPartialCancelLoading((prev) => ({ ...prev, [item.productId]: false }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF8E1] p-4 sm:p-6">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* Order Summary */}
//         <section className="bg-white shadow-md rounded-2xl border border-gray-200 p-4 sm:p-6">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-3">
//             Order Summary
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700">
//             {[
//               { label: "Order ID", value: orderDetails._id },
//               { label: "Order Date", value: orderDetails.orderDate?.split("T")[0] },
//               { label: "Order Price", value: `₹${orderDetails.totalAmount}` },
//               { label: "Payment Method", value: orderDetails.paymentMethod },
//               { label: "Payment Status", value: orderDetails.paymentStatus },
//               { label: "Cancel Status", value: orderDetails.cancelStatus },
//               { label: "Refund Status", value: orderDetails.refundStatus },
//               { label: "Return Status", value: orderDetails.returnStatus || "none" },
//             ].map(({ label, value }) => (
//               <div
//                 key={label}
//                 className="flex justify-between items-center border-b border-gray-200 py-2 text-sm sm:text-base overflow-x-auto"
//               >
//                 <span className="font-medium text-gray-600">{label}</span>
//                 <span className="text-gray-900 truncate">{value || "-"}</span>
//               </div>
//             ))}
//             <div className="flex justify-between items-center py-2">
//               <span className="font-medium text-gray-600">Order Status</span>
//               <Badge
//                 className={`py-1 px-3 rounded-full text-white font-semibold text-xs sm:text-sm ${
//                   orderDetails.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails.orderStatus === "packed"
//                     ? "bg-yellow-500"
//                     : orderDetails.orderStatus === "cancelled"
//                     ? "bg-red-500"
//                     : orderDetails.orderStatus === "delivered"
//                     ? "bg-blue-500"
//                     : "bg-gray-400"
//                 }`}
//               >
//                 {orderDetails.orderStatus || "-"}
//               </Badge>
//             </div>
//           </div>

//           {/* Cancel & Return Buttons */}
//           <div className="mt-4 flex flex-col sm:flex-row gap-2">
//             {isCancelable() && orderDetails.orderStatus !== "cancelled" && (
//               <button
//                 onClick={handleCancelOrder}
//                 disabled={loadingCancelOrder}
//                 className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base"
//               >
//                 {loadingCancelOrder ? "Cancelling..." : "Cancel Order"}
//               </button>
//             )}
//             {isReturnable() && (
//               <button
//                 onClick={handleReturnFullOrder}
//                 disabled={isFullOrderReturned}
//                 className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base ${
//                   isFullOrderReturned ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isFullOrderReturned ? "Return Requested" : "Return Entire Order"}
//               </button>
//             )}
//           </div>

//           {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
//           {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
//         </section>

//         {/* Ordered Items */}
//         <section className="bg-[#FAFAFA] shadow-sm rounded-2xl border border-gray-200 p-4 sm:p-6">
//           <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
//             Ordered Items
//           </h3>
//           {orderDetails.cartItems?.length > 0 ? (
//             <ul className="divide-y divide-gray-100">
//               {orderDetails.cartItems.map((item, idx) => {
//                 const product = productList.find((p) => p._id === item.productId) || {};
//                 const rowBg = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
//                 const remainingQty = getDisplayedQty(item);
//                 const itemReturned = isItemReturned(item);

//                 return (
//                   <li
//                     key={idx}
//                     className={`flex flex-col md:flex-row justify-between items-start md:items-center py-3 px-3 sm:px-4 rounded-lg ${rowBg} hover:bg-gray-100 transition gap-3`}
//                   >
//                     {/* Item Info */}
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
//                       <span className="font-medium text-gray-800 truncate max-w-[250px] text-sm sm:text-base">
//                         {product.title}
//                       </span>
//                       <span className="text-gray-600 text-sm">
//                         Qty: {remainingQty}
//                       </span>
//                       <span className="text-gray-600 text-sm">
//                         Size: {item.size || "-"}
//                       </span>
//                       <span className="text-gray-900 font-semibold text-sm sm:text-base">
//                         ₹{item.price}
//                       </span>
//                     </div>

//                     {/* Partial Cancel Actions */}
//                     {isCancelable() && remainingQty > 0 && !itemReturned && (
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
//                         <input
//                           type="number"
//                           min={1}
//                           max={remainingQty}
//                           placeholder={remainingQty}
//                           value={cancelQtyInput[item.productId] || ""}
//                           onChange={(e) => {
//                             const val = e.target.value;
//                             if (val === "" || /^[0-9\b]+$/.test(val)) {
//                               setCancelQtyInput((prev) => ({
//                                 ...prev,
//                                 [item.productId]: val,
//                               }));
//                             }
//                           }}
//                           className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Cancel Reason"
//                           value={cancelReasonInput[item.productId] || ""}
//                           onChange={(e) =>
//                             setCancelReasonInput((prev) => ({
//                               ...prev,
//                               [item.productId]: e.target.value,
//                             }))
//                           }
//                           className="border border-gray-300 rounded px-2 py-1 w-full sm:w-40 text-sm"
//                         />
//                         <button
//                           onClick={() => handleCancelItem(item)}
//                           disabled={partialCancelLoading[item.productId]}
//                           className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 disabled:opacity-50 text-sm"
//                         >
//                           {partialCancelLoading[item.productId]
//                             ? "Cancelling..."
//                             : "Cancel Item"}
//                         </button>
//                       </div>
//                     )}

//                     {itemReturned && (
//                       <p className="text-blue-600 text-sm font-medium">
//                         Return Requested
//                       </p>
//                     )}

//                     {/* Success/Error Feedback */}
//                     {partialCancelSuccess[item.productId] && (
//                       <p className="text-green-600 text-sm">
//                         {partialCancelSuccess[item.productId]}
//                       </p>
//                     )}
//                     {partialCancelError[item.productId] && (
//                       <p className="text-red-600 text-sm">
//                         {partialCancelError[item.productId]}
//                       </p>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-gray-500 italic">No items found.</p>
//           )}
//         </section>

//         {/* Boxes Section */}
//         {orderDetails.boxes?.length > 0 && (
//           <section className="bg-[#FAFAFA] shadow-sm rounded-2xl border border-gray-200 p-4 sm:p-6 mt-6">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
//               Custom Boxes
//             </h3>
//             {orderDetails.boxes.map((box, idx) => (
//               <div
//                 key={box._id || idx}
//                 className="bg-white p-3 rounded-lg mb-3 shadow-sm hover:shadow-md transition"
//               >
//                 <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-2">
//                   {box.boxName}
//                 </h4>
//                 {box.items?.length > 0 ? (
//                   <ul className="divide-y divide-gray-100">
//                     {box.items.map((item, i) => {
//                       const product =
//                         productList.find((p) => p._id === item.productId) || {};
//                       const price =
//                         (product.customBoxPrices?.find(
//                           (p) => p.size === item.size
//                         )?.pricePerPiece || 0) * item.quantity;

//                       return (
//                         <li
//                           key={item._id || i}
//                           className="flex justify-between items-center py-2"
//                         >
//                           <div className="flex items-center gap-2">
//                             <img
//                               src={product.image || "/placeholder.png"}
//                               alt={product.title || "Unknown"}
//                               className="w-12 h-12 rounded-lg object-cover border border-gray-200"
//                             />
//                             <span className="text-gray-800 font-medium text-sm sm:text-base">
//                               {product.title || "Unknown Product"} | Qty:{" "}
//                               {item.quantity} | Size: {item.size}
//                             </span>
//                           </div>
//                           <span className="font-semibold text-gray-900 text-sm sm:text-base">
//                             ₹{price}
//                           </span>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-500 text-sm italic">
//                     No items in this box.
//                   </p>
//                 )}
//               </div>
//             ))}
//           </section>
//         )}

//         {/* Free Gift Section */}
//         {freeGift && (
//           <section className="bg-green-50 shadow-sm rounded-2xl border border-green-200 p-4 sm:p-6 mt-6">
//             <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3 border-b border-green-200 pb-2">
//               🎁 Free Gift
//             </h3>
//             <div className="flex flex-col sm:flex-row items-center gap-4">
//               <img
//                 src={rajmaImg}
//                 alt={freeGift.name}
//                 className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
//               />
//               <div className="flex flex-col text-center sm:text-left">
//                 <span className="font-semibold text-green-800 text-sm sm:text-base">
//                   {freeGift.quantity}kg {freeGift.name}
//                 </span>
//                 <span className="text-xs sm:text-sm text-green-700">
//                   Added for free 🎉
//                 </span>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Shipping Info */}
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               <span>{user.name}</span>
//               <span>{orderDetails?.addressInfo?.address}</span>
//               <span>{orderDetails?.addressInfo?.city}</span>
//               <span>{orderDetails?.addressInfo?.pincode}</span>
//               <span>{orderDetails?.addressInfo?.phone}</span>
//               <span>{orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import rajmaImg from "./../assets/Rajma.png";
import { useState, useEffect } from "react";
import { cancelOrder, getAllOrderDetails } from "@/store/slices/orderSlice";

export default function ShoppingOrderDetailsView() {
  const { state } = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [orderDetails, setOrderDetails] = useState(state?.orderDetails || null);

  const [loadingCancelOrder, setLoadingCancelOrder] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch order details from backend if not passed via state
  useEffect(() => {
    if (!orderDetails && orderId) {
      dispatch(getAllOrderDetails(orderId)).then((res) => {
        if (res?.payload) setOrderDetails(res.payload);
      });
    }
  }, [orderDetails, orderId, dispatch]);

  if (!orderDetails) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Order details not found.
      </p>
    );
  }

  // Compute displayed quantity after partial cancellations

  // Free gift logic
  const getFreeGift = (total) => {
    if (total > 3000) return { name: "Pahadi Rajma", quantity: 3 };
    if (total >= 3000) return { name: "Pahadi Rajma", quantity: 2 };
    if (total >= 2000) return { name: "Pahadi Rajma", quantity: 1 };
    return null;
  };
  const freeGift = getFreeGift(orderDetails.totalAmount);

  // Cancel eligibility: within 24 hrs & confirmed
  const isCancelable = () => {
    if (!orderDetails.orderDate) return false;
    const orderTime = new Date(orderDetails.orderDate).getTime();
    const now = Date.now();
    const hoursPassed = (now - orderTime) / (1000 * 60 * 60);
    return hoursPassed <= 24 && orderDetails.orderStatus === "confirmed";
  };

  // Return eligibility: after delivered
  const isReturnable = () => orderDetails.orderStatus === "delivered";

  // Full order return check
  const isFullOrderReturned =
    orderDetails.returnStatus === "requested" ||
    orderDetails.returnStatus === "processed";

  // Check if item already requested for return
  const isItemReturned = (item) =>
    orderDetails.returnRequests?.some((r) => r.productId === item.productId);

  // Full order cancellation
  const handleCancelOrder = async () => {
    setLoadingCancelOrder(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await dispatch(cancelOrder(orderDetails._id));
      setSuccessMsg(
        response?.payload?.message || "Order cancelled successfully"
      );

      // Fetch latest order details from backend
      const updatedOrder = await dispatch(getAllOrderDetails(orderDetails._id));
      if (updatedOrder?.payload) setOrderDetails(updatedOrder.payload);
    } catch (error) {
      setErrorMsg(error?.message || "Failed to cancel order");
    } finally {
      setLoadingCancelOrder(false);
    }
  };

  // Redirect to Return Request Page
  const handleReturnFullOrder = () => {
    navigate(`/return-request/${orderDetails._id}`, {
      state: { orderDetails },
    });
  };

  // Partial cancellation per item

  return (
    <div className="min-h-screen bg-[#FFF8E1] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Order Summary */}
        <section className="bg-white shadow-md rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-3">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-700">
            {[
              { label: "Order ID", value: orderDetails._id },
              {
                label: "Order Date",
                value: orderDetails.orderDate?.split("T")[0],
              },
              { label: "Order Price", value: `₹${orderDetails.totalAmount}` },
              { label: "Payment Method", value: orderDetails.paymentMethod },
              { label: "Payment Status", value: orderDetails.paymentStatus },
              { label: "Cancel Status", value: orderDetails.cancelStatus },
              { label: "Refund Status", value: orderDetails.refundStatus },
              {
                label: "Return Status",
                value: orderDetails.returnStatus || "none",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center border-b border-gray-200 py-2 text-sm sm:text-base overflow-x-auto"
              >
                <span className="font-medium text-gray-600">{label}</span>
                <span className="text-gray-900 truncate">{value || "-"}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-600">Order Status</span>
              <Badge
                className={`py-1 px-3 rounded-full text-white font-semibold text-xs sm:text-sm ${
                  orderDetails.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails.orderStatus === "packed"
                    ? "bg-yellow-500"
                    : orderDetails.orderStatus === "cancelled"
                    ? "bg-red-500"
                    : orderDetails.orderStatus === "delivered"
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              >
                {orderDetails.orderStatus || "-"}
              </Badge>
            </div>
          </div>

          {/* Cancel & Return Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            {isCancelable() && orderDetails.orderStatus !== "cancelled" && (
              <button
                onClick={handleCancelOrder}
                disabled={loadingCancelOrder}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 text-sm sm:text-base"
              >
                {loadingCancelOrder ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            {isReturnable() && (
              <button
                onClick={handleReturnFullOrder}
                disabled={isFullOrderReturned}
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base ${
                  isFullOrderReturned ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isFullOrderReturned
                  ? "Return Requested"
                  : "Return Entire Order"}
              </button>
            )}
          </div>

          {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
          {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        </section>

        {/* Ordered Items */}
        <section className="bg-[#FAFAFA] shadow-sm rounded-2xl border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Ordered Items
          </h3>
          {orderDetails.cartItems?.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {orderDetails.cartItems.map((item, idx) => {
                const product =
                  productList.find((p) => p._id === item.productId) || {};
                const rowBg = idx % 2 === 0 ? "bg-white" : "bg-gray-50";

                const itemReturned = isItemReturned(item);

                return (
                  <li
                    key={idx}
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center py-3 px-3 sm:px-4 rounded-lg ${rowBg} hover:bg-gray-100 transition gap-3`}
                  >
                    {/* Item Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full p-4 bg-white rounded-xl shadow hover:shadow-lg transition duration-200">
                      {/* Left side: Product Info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.title || "Product Image"}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 text-base sm:text-lg truncate max-w-[220px]">
                            {product.title}
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="flex items-center gap-1 text-gray-700 text-sm sm:text-base">
                              Qty:{" "}
                              <span className="font-medium">
                                {item.quantity}
                              </span>
                            </span>
                            {item.size && (
                              <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm sm:text-base px-3 py-1 rounded-full font-medium">
                                Size: {item.size}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-gray-700 text-sm sm:text-base">
                              <span className="font-medium">
                               Weight: {item.weight}
                              </span>
                            </span>
                              
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-0 text-gray-900 font-bold text-base sm:text-lg">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>


                    {itemReturned && (
                      <p className="text-blue-600 text-sm font-medium">
                        Return Requested
                      </p>
                    )}

                    {/* Success/Error Feedback */}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No items found.</p>
          )}
        </section>

        {/* Boxes Section */}
        {orderDetails.boxes?.length > 0 && (
          <section className="bg-gray-50 shadow-sm rounded-2xl border border-gray-200 p-4 sm:p-6 mt-6">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
              Custom Boxes
            </h3>

            {orderDetails.boxes.map((box, idx) => (
              <div
                key={box._id || idx}
                className="bg-white p-4 rounded-xl mb-4 shadow-sm hover:shadow-md transition duration-200"
              >
                {/* Box Header */}
                <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-3">
                  {box.boxName || `Box ${idx + 1}`}
                </h4>

                {/* Box Items */}
                {box.items?.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {box.items.map((item, i) => {
                      const product =
                        productList.find((p) => p._id === item.productId) || {};
                      const price =
                        (product.customBoxPrices?.find(
                          (p) => p.size === item.size
                        )?.pricePerPiece || 0) * item.quantity;

                      return (
                        <li
                          key={item._id || i}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors gap-3"
                        >
                          {/* Left: Product Info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder.png"}
                              alt={product.title || "Unknown Product"}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[220px]">
                                {product.title || "Unknown Product"}
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-gray-700 text-sm sm:text-base">
                                  Qty:{" "}
                                  <span className="font-medium">
                                    {item.quantity}
                                  </span>
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-sm sm:text-base px-2 py-0.5 rounded-full font-medium">
                                  Size: {item.size || "-"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Price */}
                          <span className="mt-2 sm:mt-0 text-gray-900 font-semibold text-sm sm:text-base">
                            ₹{price}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No items in this box.
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.name}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
