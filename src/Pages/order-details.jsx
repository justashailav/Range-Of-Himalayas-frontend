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
    <div className="min-h-screen bg-stone-50/50 p-4 sm:p-12 font-sans">
  <div className="max-w-4xl mx-auto space-y-10">
    
    {/* HEADER: Minimalist & Clean */}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-8">
      <div>
        <h1 className="text-xs font-black text-stone-400 uppercase tracking-[0.4em] mb-2">Order Manifest</h1>
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter italic">
          #{orderDetails._id.slice(-8).toUpperCase()}
        </h2>
      </div>
      <div className="text-sm sm:text-right">
        <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Ordered On</p>
        <p className="font-black text-stone-900">{orderDetails.orderDate?.split("T")[0]}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* LEFT COLUMN: Summary & Items */}
      <div className="lg:col-span-2 space-y-10">
        
        {/* STATUS BAR */}
        <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em]">Live Status</h3>
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                ${orderDetails.orderStatus === "confirmed" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"}`}>
                {orderDetails.orderStatus}
             </span>
          </div>
          
          {/* Simple Timeline Track */}
          <div className="relative h-1 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-[#B23A2E] transition-all duration-1000"
              style={{ width: orderDetails.orderStatus === 'delivered' ? '100%' : '40%' }}
            />
          </div>
        </div>

        {/* ITEMS SECTION */}
        <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm">
          <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] mb-8">Ordered Harvest</h3>
          <div className="space-y-6">
            {orderDetails.cartItems.map((item) => {
              const product = productList.find((p) => p._id === item.productId) || {};
              return (
                <div key={item.productId} className="flex gap-6 items-center group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-stone-900 uppercase tracking-tight">{product.title}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase mt-1 tracking-tighter">
                      {item.weight} · Qty {item.quantity} {item.size && ` · ${item.size}`}
                    </p>
                  </div>
                  <p className="text-sm font-black text-stone-900 tracking-tighter">₹{item.price * item.quantity}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Details & Actions */}
      <div className="space-y-8">
        
        {/* SHIPPING INFO */}
        <section className="bg-stone-900 text-white rounded-[2.5rem] p-8 shadow-xl shadow-stone-200">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-stone-400">Shipping To</h3>
          <div className="space-y-1 text-sm font-bold tracking-tight">
            <p className="text-white">{user.name}</p>
            <p className="text-stone-400 font-medium leading-relaxed">{orderDetails.addressInfo.address}</p>
            <p className="text-stone-400 font-medium uppercase text-xs">{orderDetails.addressInfo.city} - {orderDetails.addressInfo.pincode}</p>
            <div className="pt-4 flex items-center gap-2 text-stone-500 italic text-xs">
              <Phone size={12} />
              <span>{orderDetails.addressInfo.phone}</span>
            </div>
          </div>
        </section>

        {/* FINANCIAL SUMMARY */}
        <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm">
          <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-6">Payment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold uppercase text-stone-500">
              <span>Method</span>
              <span className="text-stone-900">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold uppercase text-stone-500">
              <span>Status</span>
              <span className="text-stone-900">{orderDetails.paymentStatus}</span>
            </div>
            
            {orderDetails.paymentMethod === "cod" && (
              <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-stone-400">Advance</span>
                  <span className="text-stone-900">₹{orderDetails.codAdvanceAmount}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-stone-400">Balance</span>
                  <span className="text-[#B23A2E]">₹{orderDetails.codRemainingAmount}</span>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-50 flex justify-between items-end">
               <span className="text-[10px] font-black uppercase text-stone-400 mb-1">Total Amount</span>
               <span className="text-2xl font-black text-stone-900 tracking-tighter italic">₹{orderDetails.totalAmount}</span>
            </div>
          </div>

          {/* ACTIONS BUTTONS */}
          <div className="mt-8 space-y-3">
            {isCancelable() && orderDetails.orderStatus !== "cancelled" && (
              <button onClick={handleCancelOrder} className="w-full py-4 rounded-xl border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                Cancel Order
              </button>
            )}
            {isReturnable() && (
              <button onClick={handleReturnFullOrder} className="w-full py-4 rounded-xl bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest hover:bg-stone-200 transition-all">
                Request Return
              </button>
            )}
          </div>
        </section>
      </div>

    </div>
  </div>
</div>
  );
}
