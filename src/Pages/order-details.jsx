
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
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
            {orderDetails.paymentMethod === "cod" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
                <p className="text-sm sm:text-base text-gray-800">
                  <span className="font-medium">Advance Paid:</span> ₹
                  {orderDetails.codAdvanceAmount || 200}
                </p>

                <p className="text-sm sm:text-base text-gray-800">
                  <span className="font-medium">
                    Remaining Amount (Pay on Delivery):
                  </span>{" "}
                  ₹{orderDetails.codRemainingAmount}
                </p>
              </div>
            )}

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
