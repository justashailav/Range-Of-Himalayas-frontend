
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
  <div className="max-w-5xl mx-auto space-y-8">

    {/* ================= HEADER ================= */}
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900">
        Order Details
      </h1>
      <p className="text-gray-500 mt-1">
        Order ID: {orderDetails._id}
      </p>
    </div>

    {/* ================= ORDER SUMMARY ================= */}
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-6 border-b pb-3">
        Order Summary
      </h2>

      <div className="grid sm:grid-cols-2 gap-5 text-sm">
        {[
          ["Order Date", orderDetails.orderDate?.split("T")[0]],
          ["Payment Method", orderDetails.paymentMethod],
          ["Payment Status", orderDetails.paymentStatus],
          ["Total Amount", `₹${orderDetails.totalAmount}`],
          ["Cancel Status", orderDetails.cancelStatus],
          ["Refund Status", orderDetails.refundStatus],
          ["Return Status", orderDetails.returnStatus || "none"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between border-b pb-2">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-900">{value || "-"}</span>
          </div>
        ))}

        {/* STATUS */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-500">Order Status</span>
          <Badge
            className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              orderDetails.orderStatus === "confirmed"
                ? "bg-green-100 text-green-700"
                : orderDetails.orderStatus === "packed"
                ? "bg-yellow-100 text-yellow-700"
                : orderDetails.orderStatus === "delivered"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {orderDetails.orderStatus}
          </Badge>
        </div>
      </div>

      {/* COD INFO */}
      {orderDetails.paymentMethod === "cod" && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p>
            <span className="font-medium">Advance Paid:</span> ₹
            {orderDetails.codAdvanceAmount || 200}
          </p>
          <p className="mt-1">
            <span className="font-medium">Pay on Delivery:</span> ₹
            {orderDetails.codRemainingAmount}
          </p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-6 flex flex-wrap gap-3">
        {isCancelable() && orderDetails.orderStatus !== "cancelled" && (
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

      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
    </section>

    {/* ================= ORDERED ITEMS ================= */}
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 border-b pb-3">
        Ordered Items
      </h2>

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
                className="w-24 h-24 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {product.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Qty: {item.quantity}
                  {item.size && ` · Size: ${item.size}`}
                </p>
                <p className="text-sm text-gray-500">
                  Weight: {item.weight}
                </p>
              </div>

              <p className="font-bold text-gray-900">
                ₹{item.price * item.quantity}
              </p>
            </div>
          );
        })}
      </div>
    </section>

    {/* ================= SHIPPING INFO ================= */}
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Shipping Information
      </h2>
      <div className="text-gray-700 space-y-1">
        <p className="font-medium">{user.name}</p>
        <p>{orderDetails.addressInfo.address}</p>
        <p>
          {orderDetails.addressInfo.city} –{" "}
          {orderDetails.addressInfo.pincode}
        </p>
        <p>📞 {orderDetails.addressInfo.phone}</p>
        {orderDetails.addressInfo.notes && (
          <p className="text-sm text-gray-500">
            Note: {orderDetails.addressInfo.notes}
          </p>
        )}
      </div>
    </section>
  </div>
</div>

  );
}
