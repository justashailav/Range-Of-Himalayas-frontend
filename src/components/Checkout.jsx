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
          (p) => p.size === item.size
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

  if (!paymentMethod)
    return toast.error("Please select payment method.");

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

    const response = await dispatch(
      createNewOrder(orderData)
    )

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
          paymentMethod === "cod"
            ? "₹200 COD Advance"
            : "Secure Payment",

        handler: async function (rzpResponse) {
          try {
            await dispatch(
              capturePayment({
                orderId: response.orderId,
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
              })
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
      style={{ width: `${currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%'}` }}
    />

    {/* STEP 1: Address */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${currentStep >= 1 
            ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]" 
            : "bg-white border-stone-200 text-stone-300"
          }`}
      >
        {currentStep > 1 ? <Check className="w-4 h-4" /> : "01"}
      </div>
      <span className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 1 ? "text-stone-900" : "text-stone-300"}`}>
        Address
      </span>
    </div>

    {/* STEP 2: Review */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${currentStep >= 2 
            ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]" 
            : "bg-white border-stone-200 text-stone-300"
          }`}
      >
        {currentStep > 2 ? <Check className="w-4 h-4" /> : "02"}
      </div>
      <span className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 2 ? "text-stone-900" : "text-stone-300"}`}>
        Review
      </span>
    </div>

    {/* STEP 3: Payment */}
    <div className="relative z-10 flex flex-col items-center">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-500 border
          ${currentStep >= 3 
            ? "bg-white border-[#B23A2E] text-[#B23A2E] shadow-[0_0_15px_rgba(178,58,46,0.2)]" 
            : "bg-white border-stone-200 text-stone-300"
          }`}
      >
        "03"
      </div>
      <span className={`text-[10px] mt-3 font-black uppercase tracking-[0.2em] transition-colors duration-500
        ${currentStep >= 3 ? "text-stone-900" : "text-stone-300"}`}>
        Payment
      </span>
    </div>

  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT SECTION ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADDRESS */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              🏠 Delivery Address
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4" />
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* CART ITEMS */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-2">🛍️ Cart Items</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4" />

              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="flex items-center justify-between border rounded-xl p-4
                transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-green-700">
                      ₹
                      {(
                        (item.salesPrice > 0 ? item.salesPrice : item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BOXES */}
          {boxes.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-2">📦 Boxes</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4" />

              <div className="space-y-4">
                {boxes.map((box) => (
                  <div
                    key={box._id || box.boxId}
                    className="border rounded-xl p-4 transition hover:shadow-sm"
                  >
                    <h3 className="font-semibold text-blue-700 mb-3">
                      {box.boxName || "Custom Box"}
                    </h3>

                    <ul className="space-y-2">
                      {box.items.map((item, idx) => {
                        const product =
                          productList.find((p) => p._id === item.productId) ||
                          {};
                        const sizePrice = (product.customBoxPrices || []).find(
                          (p) => p.size === item.size
                        );
                        const price = sizePrice
                          ? Number(sizePrice.pricePerPiece)
                          : 0;

                        return (
                          <li
                            key={`${item.productId}-${idx}`}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image || "/placeholder.png"}
                                className="w-10 h-10 rounded-md border"
                              />
                              <div>
                                <p className="font-medium">{product.title}</p>
                                <p className="text-gray-500">
                                  {item.size} · Qty {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-green-700">
                              ₹{(price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT SUMMARY ================= */}
        <div
          className="rounded-2xl p-6 h-fit sticky top-6
      bg-white/70 backdrop-blur-xl
      shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      border border-white/50"
        >
          <h2 className="text-xl font-bold mb-2">💰 Order Summary</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4" />

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Cart Items</span>
              <span>₹{totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Boxes</span>
              <span>₹{boxesTotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon ({code})</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <hr />
          </div>

          {/* PRICE HIGHLIGHT */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex justify-between text-lg font-extrabold">
              <span>You Pay</span>
              <span className="text-green-700">
                ₹{payableAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-6 space-y-3">
            {/* ONLINE */}
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition
          ${
            paymentMethod === "razorpay"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="hidden"
              />
              <div className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                {paymentMethod === "razorpay" && (
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </div>
              <span className="font-medium">Pay Online (Razorpay)</span>
            </label>

            {/* COD */}
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition
          ${
            paymentMethod === "cod"
              ? "border-green-600 bg-green-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="hidden"
              />
              <div className="w-4 h-4 rounded-full border-2 border-green-600 flex items-center justify-center">
                {paymentMethod === "cod" && (
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </div>
              <span className="font-medium">
                Cash on Delivery (₹200 advance)
              </span>
            </label>
          </div>

          {/* PAY BUTTON */}
          <Button
            onClick={handlePlaceOrder}
            disabled={currentStep < 3 || isProcessing}
            className="w-full mt-6 py-4 text-lg rounded-xl text-white
  bg-gradient-to-r from-green-600 to-emerald-500
  hover:from-green-700 hover:to-emerald-600
  shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isProcessing
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Pay ₹200 & Place Order"
              : "Pay Securely"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            🔒 Free delivery · Fresh from Himalayas · Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
