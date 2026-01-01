
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cancelOrder, getAllOrderDetails } from "@/store/slices/orderSlice";
const statusSteps = ["confirmed", "packed", "shipping", "delivered"];
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

 const currentIndex = statusSteps.indexOf(orderDetails.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-3xl font-extrabold">Order Details</h1>
          <p className="text-gray-500 mt-1">
            Order ID: {orderDetails._id}
          </p>
        </div>

        {/* ===== STATUS TIMELINE ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, idx) => (
              <div key={step} className="flex-1 text-center">
                <div
                  className={`w-4 h-4 mx-auto rounded-full ${
                    idx <= currentIndex ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`h-[2px] mt-1 ${
                      idx < currentIndex ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
                <p className="text-xs mt-2 capitalize">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ORDER SUMMARY ===== */}
        <div className="bg-white rounded-2xl shadow p-6 grid sm:grid-cols-2 gap-6">
          {[
            ["Order Date", orderDetails.orderDate.split("T")[0]],
            ["Payment Method", orderDetails.paymentMethod],
            ["Payment Status", orderDetails.paymentStatus],
            ["Total Amount", `₹${orderDetails.totalAmount}`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}

          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">Order Status</p>
            <Badge className="px-3 py-1 rounded-full bg-green-100 text-green-700">
              {orderDetails.orderStatus}
            </Badge>
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex gap-3">
          {isCancelable() && (
            <button
              onClick={handleCancelOrder}
              disabled={loadingCancelOrder}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loadingCancelOrder ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          {isReturnable() && (
            <button
              onClick={handleReturnFullOrder}
              disabled={isFullOrderReturned}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isFullOrderReturned ? "Return Requested" : "Return Order"}
            </button>
          )}
        </div>

        {successMsg && <p className="text-green-600">{successMsg}</p>}
        {errorMsg && <p className="text-red-600">{errorMsg}</p>}

        {/* ===== ORDERED ITEMS ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ordered Items</h2>
          <div className="space-y-4">
            {orderDetails.cartItems.map((item) => {
              const product =
                productList.find((p) => p._id === item.productId) || {};
              return (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition"
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} · Size: {item.size || "-"}
                    </p>
                  </div>
                  <p className="font-bold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== SHIPPING INFO ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-3">Shipping Information</h2>
          <p className="text-gray-700">{user.name}</p>
          <p className="text-gray-600">
            {orderDetails.addressInfo.address},{" "}
            {orderDetails.addressInfo.city} –{" "}
            {orderDetails.addressInfo.pincode}
          </p>
          <p className="text-gray-600">
            📞 {orderDetails.addressInfo.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
