import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cancelOrder, getAllOrderDetails } from "@/store/slices/orderSlice";
import { Receipt } from "lucide-react";

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
        response?.payload?.message || "Order cancelled successfully",
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
        <div className="relative border-b border-stone-200 pb-10">
          {/* TOP DECORATIVE ELEMENT */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-stone-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
              Official Manifest
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-900 leading-none">
                Order{" "}
                <span className="text-stone-300 font-light italic">
                  Details
                </span>
              </h1>
              <div className="flex items-center gap-2 pt-2">
                <div className="px-2 py-0.5 bg-stone-100 rounded text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                  ID
                </div>
                <p className="text-sm font-black tracking-widest text-stone-400 uppercase">
                  {orderDetails._id}
                </p>
              </div>
            </div>

            {/* QUICK STATS - Adds professional weight */}
            <div className="flex gap-10 md:text-right border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                  Items Summary
                </p>
                <p className="text-sm font-black text-stone-900 italic">
                  {orderDetails.cartItems.length}{" "}
                  {orderDetails.cartItems.length === 1 ? "Parcel" : "Parcels"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">
                  Status
                </p>
                <p className="text-sm font-black text-green-700 uppercase tracking-tighter flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {orderDetails.orderStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
  {/* BACKGROUND DECORATION */}
  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
    <Receipt textAnchor="middle" size={120} className="-rotate-12" />
  </div>

  <div className="relative z-10">
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.3em]">
        Transaction Details
      </h2>
      <div className="h-px flex-1 bg-stone-100" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {[
        ["Placement Date", orderDetails.orderDate?.split("T")[0]],
        ["Payment Method", orderDetails.paymentMethod],
        ["Settlement", orderDetails.paymentStatus],
        ["Cancellation", orderDetails.cancelStatus],
        ["Refund Issue", orderDetails.refundStatus],
        ["Return Log", orderDetails.returnStatus || "None Recorded"],
      ].map(([label, value]) => (
        <div key={label} className="group flex justify-between items-end border-b border-stone-50 pb-3 hover:border-stone-200 transition-colors">
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
            {label}
          </span>
          <span className="text-xs font-black text-stone-900 uppercase tracking-tighter transition-all group-hover:pr-1">
            {value || "-"}
          </span>
        </div>
      ))}
    </div>

    {/* TOTAL & STATUS HIGHLIGHT */}
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* FINAL PRICE CARD */}
      <div className="p-6 rounded-[2rem] bg-stone-50 border border-stone-100">
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Total Transaction</p>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-stone-900">₹</span>
          <span className="text-4xl font-black text-stone-900 tracking-tighter italic">
            {orderDetails.totalAmount}
          </span>
        </div>
      </div>

      {/* COD BREAKDOWN (IF APPLICABLE) */}
      {orderDetails.paymentMethod === "cod" ? (
        <div className="p-6 rounded-[2rem] bg-[#B23A2E]/5 border border-[#B23A2E]/10 flex flex-col justify-center">
          <div className="flex justify-between text-[10px] font-black uppercase mb-1">
            <span className="text-stone-400">Advance Paid</span>
            <span className="text-stone-900">₹{orderDetails.codAdvanceAmount || 200}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase">
            <span className="text-[#B23A2E]">Due at Delivery</span>
            <span className="text-[#B23A2E] text-lg tracking-tighter font-black">₹{orderDetails.codRemainingAmount}</span>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-[2rem] bg-stone-900 flex flex-col justify-center items-center text-center">
           <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mb-2">Order Status</p>
           <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
             {orderDetails.orderStatus}
           </span>
        </div>
      )}
    </div>

    {/* ACTION BUTTONS */}
    <div className="mt-10 flex flex-wrap items-center gap-6">
      {isCancelable() && orderDetails.orderStatus !== "cancelled" && (
        <button
          onClick={handleCancelOrder}
          disabled={loadingCancelOrder}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-red-600 transition-colors flex items-center gap-2 group"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping" />
          {loadingCancelOrder ? "Processing..." : "Void Order"}
        </button>
      )}

      {isReturnable() && (
        <button
          onClick={handleReturnFullOrder}
          disabled={isFullOrderReturned}
          className="px-8 py-3 rounded-full bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#B23A2E] transition-all shadow-xl shadow-stone-200"
        >
          {isFullOrderReturned ? "Return Initiated" : "Request Return"}
        </button>
      )}
      
      {successMsg && <span className="text-[10px] font-bold text-green-600 uppercase italic">✓ {successMsg}</span>}
      {errorMsg && <span className="text-[10px] font-bold text-red-600 uppercase italic">! {errorMsg}</span>}
    </div>
  </div>
</section>

        {/* ================= ORDERED ITEMS ================= */}
       <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
  {/* SECTION HEADER */}
  <div className="flex items-center gap-4 mb-10">
    <h2 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.3em]">
      Parcel Contents
    </h2>
    <div className="h-px flex-1 bg-stone-50" />
    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
      {orderDetails.cartItems.length} {orderDetails.cartItems.length === 1 ? 'Item' : 'Items'}
    </span>
  </div>

  <div className="divide-y divide-stone-50">
    {orderDetails.cartItems.map((item) => {
      const product = productList.find((p) => p._id === item.productId) || {};

      return (
        <div
          key={item.productId}
          className="group flex flex-col sm:flex-row gap-6 py-8 first:pt-0 last:pb-0 transition-all"
        >
          {/* PRODUCT IMAGE CONTAINER */}
          <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
               <p className="text-[10px] font-black text-stone-900 uppercase tracking-tighter">
                 Qty {item.quantity}
               </p>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-black text-stone-900 uppercase tracking-tight leading-tight group-hover:text-[#B23A2E] transition-colors">
                  {product.title}
                </h3>
                <p className="text-lg font-black text-stone-900 tracking-tighter italic shrink-0">
                  ₹{item.price * item.quantity}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Weight</span>
                  <span className="text-[11px] font-bold text-stone-600 uppercase tracking-tighter">{item.weight}</span>
                </div>
                
                {item.size && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Size</span>
                    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-tighter">{item.size}</span>
                  </div>
                )}
              </div>
            </div>

            {/* DECORATIVE BRAND TAG */}
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              <span className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em]">
                Authentic Himalayan Harvest
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

        {/* ================= SHIPPING INFO ================= */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
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
