import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Address from "@/Pages/Address";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { capturePayment, createNewOrder } from "@/store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { resetCoupon } from "@/store/slices/couponSlice";
import { Helmet } from "react-helmet";
import {
  Check,
  Minus,
  Plus,
  Trash,
  MapPin,
  ShoppingBag,
  Box,
  CreditCard,
  Truck,
  Lock,
  Star,
  ShieldCheck,
  Settings,
  Store,
  Navigation,
  ChevronRight,
} from "lucide-react";
import { getNearestStore } from "@/store/slices/storeSlice";

export default function ShoppingCheckout() {
  const { cartItems = [], boxes = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    discountAmount = 0,
    finalAmount,
    code,
  } = useSelector((state) => state.coupon);
  const { productList = [] } = useSelector((state) => state.products);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderType, setOrderType] = useState("delivery");
  const [selectedStore, setSelectedStore] = useState(null);

  const { nearestStores, loading: storeLoading } = useSelector(
    (state) => state.store,
  );
  const isNavigatingToSuccess = useRef(false);

  useEffect(() => {
    if (!code) dispatch(resetCoupon());
  }, [code, dispatch]);

  useEffect(() => {
  if (orderType === "pickup" && currentSelectedAddress) {
    dispatch(
      getNearestStore({
        lat: currentSelectedAddress?.lat,
        lng: currentSelectedAddress?.lng,
        orderType: "pickup",
      })
    );
  }
}, [orderType, currentSelectedAddress]);

  // 🛒 Calculate totals
  const totalCartAmount = cartItems.reduce((sum, item) => {
    const price =
      item.salesPrice && item.salesPrice > 0
        ? Number(item.salesPrice)
        : Number(item.price);
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const boxesTotal = boxes.reduce((sumBoxes, box) => {
    const boxTotal =
      box?.items?.reduce((sum, item) => {
        const product = productList.find((p) => p._id === item.productId) || {};
        const sizePriceObj = (product.customBoxPrices || []).find(
          (p) => p.size === item.size,
        );
        const price = sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0;
        return sum + price * (Number(item.quantity) || 1);
      }, 0) || 0;
    return sumBoxes + boxTotal;
  }, 0);

  const grandTotal = totalCartAmount + boxesTotal;
  const payableAmount =
    finalAmount !== null && finalAmount !== undefined
      ? finalAmount
      : grandTotal - (Number(discountAmount) || 0);

  async function handlePlaceOrder() {
    if (cartItems.length === 0 && boxes.length === 0)
      return toast.error("Your cart is empty.");

    if (!currentSelectedAddress)
      return toast.error("Please select a delivery address.");

    if (!paymentMethod) return toast.error("Please select payment method.");

    // ✅ COD restriction
    if (paymentMethod === "cod" && payableAmount < 200) {
      return toast.error("COD is available only for orders above ₹200");
    }

    const orderData = {
      userId: user?._id,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salesPrice > 0 ? item.salesPrice : item.price,
        quantity: item.quantity,
        size: item.size,
        weight: item.weight || item.productWeight,
      })),
      boxes,
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      paymentMethod,
      totalAmount: payableAmount,
      ...(code ? { code } : {}),
    };

    try {
      setIsProcessing(true);

      const response = await dispatch(createNewOrder(orderData));

      // 🔥 Razorpay Flow
      if (response.razorpayOrderId) {
        if (!window.Razorpay) {
          toast.error("Payment gateway failed to load. Refresh page.");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: response.key,
          amount: response.amount,
          currency: response.currency,
          order_id: response.razorpayOrderId,
          name: "Range of Himalayas",
          description:
            paymentMethod === "cod" ? "₹200 COD Advance" : "Secure Payment",

          handler: async function (rzpResponse) {
            try {
              isNavigatingToSuccess.current = true;

              await dispatch(
                capturePayment({
                  orderId: response.orderId,
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                }),
              );

              toast.success("Payment successful!");
              setTimeout(() => {
                navigate("/order-success", { replace: true });
              }, 100);
            } catch (err) {
              isNavigatingToSuccess.current = false;
              toast.error("Payment verification failed");
              setIsProcessing(false);
            }
          },

          // ✅ FIX: handle user closing popup
          modal: {
            ondismiss: function () {
              isNavigatingToSuccess.current = false;
              setIsProcessing(false);
              toast.error("Payment cancelled.");
            },
          },

          prefill: {
            name: user?.name,
            email: user?.email,
            contact: currentSelectedAddress?.phone,
          },

          theme: { color: "#16a34a" },
        };

        const rzp = new window.Razorpay(options);

        // ✅ FIX: failure case
        rzp.on("payment.failed", function () {
          isNavigatingToSuccess.current = false;
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        });

        rzp.open();
        return;
      }

      // ✅ Non-Razorpay flow
      isNavigatingToSuccess.current = true;
      toast.success(response.message || "Order placed successfully");
      setTimeout(() => {
        navigate("/order-success", { replace: true });
      }, 100);
    } catch (err) {
      toast.error(err.message || "Order failed");
      setIsProcessing(false);
    }
  }
  // Step 2 → Address selected
  useEffect(() => {
    if (currentSelectedAddress) {
      setCurrentStep(2);
    }
  }, [currentSelectedAddress]);

  // Step 3 → Payment clicked
  useEffect(() => {
    if (paymentMethod) {
      setCurrentStep(3);
    }
  }, [paymentMethod]);
  const isCODDisabled = payableAmount < 200;
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Checkout | Range of Himalayas</title>
      </Helmet>

      <div className="max-w-2xl mx-auto mb-12 px-4 sm:px-6">
        <div className="relative flex items-start justify-between">
          {/* STATIC BACKGROUND TRACK */}
          <div className="absolute top-[18px] left-0 w-full h-[1px] bg-stone-100 z-0" />

          {/* DYNAMIC PROGRESS LINE */}
          <div
            className="absolute top-[18px] left-0 h-[1.5px] bg-stone-900 transition-all duration-700 ease-in-out z-0"
            style={{
              width: `${((currentStep - 1) / 2) * 100}%`,
            }}
          />

          {/* STEPS */}
          {[
            { id: 1, label: "Shipping", sub: "Address" },
            { id: 2, label: "Review", sub: "Details" },
            { id: 3, label: "Payment", sub: "Checkout" },
          ].map((step) => {
            const isActive = currentStep >= step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center group"
              >
                {/* STEP CIRCLE */}
                <div
                  className={`
              w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
              ${
                isActive
                  ? "bg-stone-900 border-stone-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-110"
                  : "bg-white border-stone-200 text-stone-300"
              }
            `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3px]" />
                  ) : (
                    <span className="text-[10px] font-black tracking-tighter">
                      0{step.id}
                    </span>
                  )}

                  {/* Active Pulsing Glow */}
                  {currentStep === step.id && (
                    <div className="absolute inset-0 rounded-2xl bg-stone-900 animate-ping opacity-20" />
                  )}
                </div>

                {/* TEXT LABELS */}
                <div className="mt-4 flex flex-col items-center">
                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-500
              ${isActive ? "text-stone-900" : "text-stone-300"}`}
                  >
                    {step.label}
                  </span>
                  {/* Hidden on very small screens to keep UI clean */}
                  <span className="hidden sm:block text-[8px] font-serif italic text-stone-400 mt-0.5">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT SECTION ================= */}
        <div className="lg:col-span-2 space-y-10">
          {/* ADDRESS SECTION */}
          <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center shadow-lg shadow-stone-200">
                  <MapPin className="w-5 h-5 text-stone-100" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-stone-900 uppercase tracking-[0.25em]">
                    Shipping Destination
                  </h2>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                    Logistics & Final Delivery
                  </p>
                </div>
              </div>
              {/* Visual Indicator of Step Completion */}
              <div
                className={`w-2 h-2 rounded-full ${currentSelectedAddress ? "bg-green-500" : "bg-orange-400 animate-pulse"}`}
              />
            </div>

            <div className="pl-0 sm:pl-2">
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Fulfillment Method
          </h2>
          <p className="text-slate-900 font-bold text-lg">How should we get this to you?</p>
        </div>
        <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
          <Settings size={18} className="animate-spin-slow" />
        </div>
      </div>

      {/* PREMIUM TOGGLE */}
      <div className="flex p-1.5 bg-slate-50 rounded-[1.5rem] mb-8 relative">
        <button
          onClick={() => {
            setOrderType("delivery");
            setSelectedStore(null);
          }}
          className={`relative flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.2rem] text-sm font-black transition-all duration-500 z-10 ${
            orderType === "delivery" ? "text-white" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Truck size={18} strokeWidth={2.5} />
          Doorstep Delivery
          {orderType === "delivery" && (
            <div className="absolute inset-0 bg-slate-900 rounded-[1.2rem] -z-10 shadow-xl shadow-slate-200 animate-in fade-in zoom-in-95 duration-300" />
          )}
        </button>

        <button
          onClick={() => setOrderType("pickup")}
          className={`relative flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.2rem] text-sm font-black transition-all duration-500 z-10 ${
            orderType === "pickup" ? "text-white" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Store size={18} strokeWidth={2.5} />
          Self Pickup
          {orderType === "pickup" && (
            <div className="absolute inset-0 bg-slate-900 rounded-[1.2rem] -z-10 shadow-xl shadow-slate-200 animate-in fade-in zoom-in-95 duration-300" />
          )}
        </button>
      </div>

      {/* STORE LIST SELECTION */}
      {orderType === "pickup" && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-black uppercase text-blue-600 flex items-center gap-2">
              <Navigation size={12} fill="currentColor" /> Nearby Outlets
            </span>
            <span className="text-[10px] font-bold text-slate-400">Showing {nearestStores.length} locations</span>
          </div>

          {storeLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-[1.5rem]" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {nearestStores.map((store) => (
                <div
                  key={store._id}
                  onClick={() => setSelectedStore(store)}
                  className={`group relative p-5 rounded-[1.8rem] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                    selectedStore?._id === store._id
                      ? "bg-white border-blue-600 shadow-2xl shadow-blue-100"
                      : "bg-white border-slate-50 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedStore?._id === store._id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                      }`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className={`font-black text-base transition-colors ${
                          selectedStore?._id === store._id ? "text-slate-900" : "text-slate-600"
                        }`}>
                          {store.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                            {(store.distance / 1000).toFixed(1)} km
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            {store.address?.city || 'Himalayas'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-2 transition-transform duration-300 ${selectedStore?._id === store._id ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}>
                      <div className="bg-blue-600 text-white p-1 rounded-full">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Subtle Background Accent for Active Store */}
                  {selectedStore?._id === store._id && (
                    <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-10">
                       <Store size={80} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Delivery Info Snippet */}
      {orderType === "delivery" && (
        <div className="p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-400">
               <Truck size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Dispatching from our <span className="text-slate-900 font-bold">Himalayan Warehouse</span>. 
              Expected arrival within <span className="text-slate-900 font-bold">3-5 business days</span>.
            </p>
          </div>
        </div>
      )}
    </section>

          {/* CART ITEMS SECTION */}
          {cartItems.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100">
                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-stone-900 uppercase tracking-[0.25em]">
                    Harvest Manifest
                  </h2>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                    {cartItems.length} Individual Items Selected
                  </p>
                </div>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="group flex items-center justify-between bg-stone-50/30 p-4 rounded-3xl border border-transparent hover:border-stone-100 hover:bg-white transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      <div className="relative w-20 h-20 rounded-[1.25rem] overflow-hidden bg-white border border-stone-100 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[11px] font-black text-stone-900 uppercase tracking-tight italic font-serif">
                          {item.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.size && (
                            <span className="text-[8px] font-black text-stone-500 uppercase bg-white border border-stone-100 px-2.5 py-1 rounded-lg">
                              {item.size}
                            </span>
                          )}
                          {(item.weight || item.productWeight) && (
                            <span className="text-[8px] font-black text-stone-500 uppercase bg-white border border-stone-100 px-2.5 py-1 rounded-lg">
                              {item.weight || item.productWeight}
                            </span>
                          )}
                          <span className="text-[8px] font-black text-[#B23A2E] uppercase tracking-widest ml-1">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-stone-900 tracking-tighter">
                        ₹
                        {(
                          (item.salesPrice > 0 ? item.salesPrice : item.price) *
                          item.quantity
                        ).toFixed(0)}
                      </p>
                      <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mt-1">
                        incl. tax
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM BOXES SECTION */}
          {boxes.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center shadow-lg shadow-stone-200">
                  <Box className="w-5 h-5 text-stone-100" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-stone-900 uppercase tracking-[0.25em]">
                    Curated Collections
                  </h2>
                  <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                    Bespoke Gift Boxes
                  </p>
                </div>
              </div>

              <div className="grid gap-8">
                {boxes.map((box) => (
                  <div
                    key={box._id || box.boxId}
                    className="bg-stone-50/50 rounded-[2.5rem] border border-stone-100 p-8 relative overflow-hidden"
                  >
                    {/* Elegant Header for the Box */}
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <div className="px-4 py-1.5 bg-white rounded-full border border-stone-100 shadow-sm">
                        <h3 className="text-[10px] font-black text-[#B23A2E] uppercase tracking-[0.3em]">
                          {box.boxName || "Custom Collection"}
                        </h3>
                      </div>
                      <div className="h-[1px] flex-1 mx-6 bg-stone-200" />
                      <span className="text-[10px] font-serif italic text-stone-400">
                        Pack of {box.items.length}
                      </span>
                    </div>

                    <ul className="space-y-5">
                      {box.items.map((item, idx) => {
                        const product =
                          productList.find((p) => p._id === item.productId) ||
                          {};
                        const sizePrice = (product.customBoxPrices || []).find(
                          (p) => p.size === item.size,
                        );
                        const price = sizePrice
                          ? Number(sizePrice.pricePerPiece)
                          : 0;

                        return (
                          <li
                            key={`${item.productId}-${idx}`}
                            className="flex justify-between items-center group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-stone-100 shadow-sm group-hover:scale-105 transition-transform">
                                <img
                                  src={product.image || "/placeholder.png"}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-stone-900 uppercase leading-tight">
                                  {product.title}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <span className="text-[8px] text-stone-400 font-bold uppercase tracking-tighter">
                                    {item.size} · {item.quantity} Units
                                  </span>
                                  <span className="text-[8px] text-stone-300">
                                    •
                                  </span>
                                  <span className="text-[8px] text-stone-400 font-bold uppercase tracking-tighter">
                                    {item.weight}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] font-black text-stone-900 tracking-tighter">
                              ₹{(price * item.quantity).toFixed(0)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div className="rounded-[2.5rem] p-8 h-fit sticky top-10 bg-white border border-stone-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* TOP DECORATIVE ACCENT */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-100 via-stone-900 to-stone-100 opacity-20" />

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-stone-50 flex items-center justify-center border border-stone-100 shadow-sm">
                <CreditCard className="w-5 h-5 text-stone-900" />
              </div>
              <div>
                <h2 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.3em] leading-none">
                  Settlement
                </h2>
                <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mt-1.5">
                  Order Summary & Payment
                </p>
              </div>
            </div>
          </div>

          {/* BREAKDOWN */}
          <div className="space-y-5 mb-8">
            {/* NEW: Dispatch Info */}
            <div className="text-[11px] font-semibold text-[#B23A2E] bg-[#B23A2E]/5 px-4 py-3 rounded-xl border border-[#B23A2E]/20 text-center">
              🚚 Orders will be dispatched from{" "}
              <span className="font-bold">18 April</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-600 transition-colors">
                Artisan Harvest
              </span>
              <span className="text-stone-900 font-black tracking-tighter text-sm">
                ₹{totalCartAmount.toFixed(0)}
              </span>
            </div>

            <div className="flex justify-between items-center group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-600 transition-colors">
                Curated Boxes
              </span>
              <span className="text-stone-900 font-black tracking-tighter text-sm">
                ₹{boxesTotal.toFixed(0)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 italic">
                  Gift Code: {code}
                </span>
                <span className="text-green-700 font-black tracking-tighter text-sm">
                  -₹{discountAmount.toFixed(0)}
                </span>
              </div>
            )}

            <div className="h-px bg-stone-100 w-full opacity-50" />
          </div>

          {/* FINAL PAYABLE BOX */}
          <div className="p-7 rounded-[2rem] bg-stone-900 relative overflow-hidden shadow-xl shadow-stone-200">
            {/* Subtle Glassmorphism Texture */}
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">
                  Total Payable
                </p>
                <p className="text-4xl font-black text-white tracking-tighter">
                  ₹{payableAmount.toFixed(0)}
                </p>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                <p className="text-[8px] text-white font-black uppercase tracking-tighter">
                  Complimentary <br /> Shipping
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="mt-10 space-y-4">
            <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.25em] mb-4 text-center">
              Select Gateway
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {/* ONLINE */}
              <div
                onClick={() => setPaymentMethod("razorpay")}
                className={`group relative flex items-center justify-between p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-500
          ${
            paymentMethod === "razorpay"
              ? "border-stone-900 bg-stone-50"
              : "border-stone-100 bg-white hover:border-stone-300"
          }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500
            ${paymentMethod === "razorpay" ? "border-stone-900 scale-110" : "border-stone-200"}`}
                  >
                    {paymentMethod === "razorpay" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-900 animate-in zoom-in" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest block text-stone-900">
                      Online Secure
                    </span>
                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-tighter">
                      Cards, UPI, Netbanking
                    </span>
                  </div>
                </div>
                <ShieldCheck
                  className={`w-5 h-5 transition-colors ${paymentMethod === "razorpay" ? "text-stone-900" : "text-stone-200"}`}
                />
              </div>

              {/* COD */}
              <div
                onClick={() => !isCODDisabled && setPaymentMethod("cod")}
                className={`group relative flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all duration-500
          ${
            isCODDisabled
              ? "opacity-40 grayscale cursor-not-allowed bg-stone-50 border-stone-100"
              : paymentMethod === "cod"
                ? "border-stone-900 bg-stone-50 cursor-pointer"
                : "border-stone-100 bg-white hover:border-stone-300 cursor-pointer"
          }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500
            ${paymentMethod === "cod" ? "border-stone-900 scale-110" : "border-stone-200"}`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-900 animate-in zoom-in" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest block text-stone-900">
                      Partial COD
                    </span>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-tighter ${paymentMethod === "cod" ? "text-[#B23A2E]" : "text-stone-400"}`}
                    >
                      {isCODDisabled
                        ? "Available on orders > ₹200"
                        : "₹200 Pre-payment Required"}
                    </span>
                  </div>
                </div>
                <Truck
                  className={`w-5 h-5 transition-colors ${paymentMethod === "cod" ? "text-stone-900" : "text-stone-200"}`}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={currentStep < 3 || isProcessing}
            className={`group relative w-full mt-10 py-6 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase overflow-hidden transition-all duration-700
      ${
        currentStep < 3 || isProcessing
          ? "bg-stone-100 text-stone-300 cursor-not-allowed"
          : "bg-[#B23A2E] text-white hover:bg-stone-900 shadow-[0_30px_60px_-15px_rgba(178,58,46,0.4)] hover:shadow-stone-400 active:scale-95"
      }`}
          >
            <span className="relative z-10">
              {isProcessing
                ? "Validating Ledger..."
                : paymentMethod === "cod"
                  ? "Secure Deposit & Order"
                  : "Authorize Purchase"}
            </span>
            {/* Animated Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
          </button>

          {/* TRUST FOOTER */}
          <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-center gap-8 text-stone-300">
            <div className="flex items-center gap-2">
              <Lock size={12} className="opacity-50" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                256-bit SSL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="opacity-50" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Quality Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
