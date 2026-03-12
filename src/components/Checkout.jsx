import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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

  useEffect(() => {
    if (!code) dispatch(resetCoupon());
  }, [code, dispatch]);

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

  useEffect(() => {
    if ((cartItems.length === 0 && boxes.length === 0) || !user) {
      toast.error("Your cart is empty or you are not logged in.");
      navigate("/");
    }
  }, [cartItems, boxes, navigate, user]);

  async function handlePlaceOrder() {
    if (cartItems.length === 0 && boxes.length === 0)
      return toast.error("Your cart is empty.");

    if (!currentSelectedAddress)
      return toast.error("Please select a delivery address.");

    if (!paymentMethod) return toast.error("Please select payment method.");

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
              await dispatch(
                capturePayment({
                  orderId: response.orderId,
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                }),
              );

              toast.success("Payment successful!");
              navigate("/order-success");
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },

          prefill: {
            name: user?.name,
            email: user?.email,
            contact: currentSelectedAddress?.phone,
          },

          theme: {
            color: "#16a34a",
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function () {
          toast.error("Payment failed. Please try again.");
        });

        rzp.open();
        return;
      }

      toast.success(response.message || "Order placed successfully");
      navigate("/order-success");
    } catch (err) {
      toast.error(err.message || "Order failed");
    } finally {
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Checkout | Range of Himalayas</title>
      </Helmet>

      <div className="max-w-xl mx-auto mb-16 px-6">
        <div className="relative flex items-center justify-between">
          {/* Background Progress Track */}
          <div className="absolute top-[18px] left-0 w-full h-[1px] bg-stone-200 z-0" />

          {/* Animated Active Track */}
          <div
            className="absolute top-[18px] left-0 h-[1px] bg-[#B23A2E] transition-all duration-500 ease-in-out z-0"
            style={{
              width: `${currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%"}`,
            }}
          />

          {/* STEP 1: Address */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${
            currentStep >= 1
              ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]"
              : "bg-white border-stone-200 text-stone-300"
          }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : "01"}
            </div>
            <span
              className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 1 ? "text-stone-900" : "text-stone-300"}`}
            >
              Address
            </span>
          </div>

          {/* STEP 2: Review */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${
            currentStep >= 2
              ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]"
              : "bg-white border-stone-200 text-stone-300"
          }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : "02"}
            </div>
            <span
              className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 2 ? "text-stone-900" : "text-stone-300"}`}
            >
              Review
            </span>
          </div>

          {/* STEP 3: Payment */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${
            currentStep >= 3
              ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]"
              : "bg-white border-stone-200 text-stone-300"
          }`}
            >
              "03"
            </div>
            <span
              className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 3 ? "text-stone-900" : "text-stone-300"}`}
            >
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT SECTION ================= */}
        <div className="lg:col-span-2 space-y-10">
          {/* ADDRESS SECTION */}
          <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                <MapPin className="w-5 h-5 text-stone-900" />
              </div>
              <div>
                <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em]">
                  Shipping Destination
                </h2>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                  Where your harvest is headed
                </p>
              </div>
            </div>

            <div className="pl-2">
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>
          </section>

          {/* CART ITEMS SECTION */}
          {cartItems.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                </div>
                <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em]">
                  Review Basket
                </h2>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="group flex items-center justify-between border-b border-stone-50 pb-4 last:border-0"
                  >
                    <div className="flex gap-5">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-black text-stone-900 uppercase tracking-tight">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.size && (
                            <span className="text-[9px] font-bold text-stone-400 uppercase bg-stone-50 px-2 py-0.5 rounded-md">
                              {item.size}
                            </span>
                          )}
                          <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-black text-stone-900 tracking-tighter">
                      ₹
                      {(
                        (item.salesPrice > 0 ? item.salesPrice : item.price) *
                        item.quantity
                      ).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM BOXES SECTION */}
          {boxes.length > 0 && (
            <section className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center border border-stone-100">
                  <Box className="w-5 h-5 text-stone-900" />
                </div>
                <h2 className="text-sm font-black text-stone-900 uppercase tracking-[0.2em]">
                  Curated Boxes
                </h2>
              </div>

              <div className="grid gap-6">
                {boxes.map((box) => (
                  <div
                    key={box._id || box.boxId}
                    className="bg-stone-50/50 rounded-[2rem] border border-stone-100 p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[11px] font-black text-[#B23A2E] uppercase tracking-[0.3em]">
                        {box.boxName || "Custom Collection"}
                      </h3>
                      <div className="h-px flex-1 mx-4 bg-stone-200" />
                    </div>

                    <ul className="space-y-4">
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
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-stone-100">
                                <img
                                  src={product.image || "/placeholder.png"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-stone-900 uppercase leading-tight">
                                  {product.title}
                                </p>
                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter mt-0.5">
                                  {item.size} · {item.quantity} Units
                                </p>
                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter mt-0.5">
                                  {item.weight} 
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-black text-stone-900 tracking-tighter">
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
        <div className="rounded-[2.5rem] p-8 h-fit sticky top-6 bg-white border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
  
  {/* HEADER */}
  <div className="flex items-center gap-3 mb-8">
    <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
      <CreditCard className="w-4 h-4 text-white" />
    </div>
    <h2 className="text-xs font-black text-stone-900 uppercase tracking-[0.3em]">Payment Summary</h2>
  </div>

  {/* BREAKDOWN */}
  <div className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-stone-400">
    <div className="flex justify-between items-center">
      <span>Artisan Harvest</span>
      <span className="text-stone-900 font-black tracking-tighter text-sm">₹{totalCartAmount.toFixed(0)}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Curated Boxes</span>
      <span className="text-stone-900 font-black tracking-tighter text-sm">₹{boxesTotal.toFixed(0)}</span>
    </div>

    {discountAmount > 0 && (
      <div className="flex justify-between items-center text-[#B23A2E]">
        <span className="italic">Seasonal Offer ({code})</span>
        <span className="font-black tracking-tighter text-sm">-₹{discountAmount.toFixed(0)}</span>
      </div>
    )}

    <div className="h-px bg-stone-50 w-full my-4" />
  </div>

  {/* FINAL PAYABLE */}
  <div className="mt-6 p-6 rounded-3xl bg-stone-50 border border-stone-100 relative overflow-hidden">
    <div className="relative z-10 flex justify-between items-end">
      <div>
        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Final Amount</p>
        <p className="text-3xl font-black text-stone-900 tracking-tighter">
          ₹{payableAmount.toFixed(0)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[9px] text-green-600 font-black uppercase tracking-tighter">Free Shipping</p>
      </div>
    </div>
    {/* Subtle decorative mountain-like curve or texture could go here */}
  </div>

  {/* PAYMENT METHODS */}
  <div className="mt-8 space-y-3">
    <h3 className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 ml-1">Select Method</h3>
    
    {/* ONLINE */}
    <label
      onClick={() => setPaymentMethod("razorpay")}
      className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
        ${paymentMethod === "razorpay" 
          ? "border-stone-900 bg-stone-900 text-white" 
          : "border-stone-50 bg-stone-50 text-stone-600 hover:border-stone-200"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
          ${paymentMethod === "razorpay" ? "border-white" : "border-stone-300"}`}>
          {paymentMethod === "razorpay" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Secure Online Pay</span>
      </div>
      <ShieldCheck className={`w-4 h-4 ${paymentMethod === "razorpay" ? "text-white/50" : "text-stone-300"}`} />
    </label>

    {/* COD */}
    <label
      onClick={() => setPaymentMethod("cod")}
      className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
        ${paymentMethod === "cod" 
          ? "border-stone-900 bg-stone-900 text-white" 
          : "border-stone-50 bg-stone-50 text-stone-600 hover:border-stone-200"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
          ${paymentMethod === "cod" ? "border-white" : "border-stone-300"}`}>
          {paymentMethod === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest block">Partial COD</span>
          <span className={`text-[8px] font-bold uppercase tracking-tighter opacity-60
            ${paymentMethod === "cod" ? "text-white" : "text-stone-400"}`}>₹200 Advance Required</span>
        </div>
      </div>
      <Truck className={`w-4 h-4 ${paymentMethod === "cod" ? "text-white/50" : "text-stone-300"}`} />
    </label>
  </div>

  {/* ACTION BUTTON */}
  <button
    onClick={handlePlaceOrder}
    disabled={currentStep < 3 || isProcessing}
    className={`group relative w-full mt-8 py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500
      ${currentStep < 3 || isProcessing
        ? "bg-stone-100 text-stone-300 cursor-not-allowed"
        : "bg-[#B23A2E] text-white hover:bg-stone-900 shadow-[0_20px_40px_rgba(178,58,46,0.3)] active:scale-95"
      }`}
  >
    <span className="relative z-10">
      {isProcessing ? "Authenticating..." : paymentMethod === "cod" ? "Pay Deposit & Order" : "Complete Purchase"}
    </span>
    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
  </button>

  {/* TRUST FOOTER */}
  <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
    <div className="flex items-center gap-1 opacity-40">
      <Lock size={10} />
      <span className="text-[8px] font-black uppercase tracking-widest">SSL Encrypted</span>
    </div>
    <div className="flex items-center gap-1 opacity-40">
      <Star size={10} />
      <span className="text-[8px] font-black uppercase tracking-widest">Himalayan Quality</span>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
