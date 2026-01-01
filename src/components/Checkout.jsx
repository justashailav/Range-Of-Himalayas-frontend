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

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function ShoppingCheckout() {
  const { cartItems = [], boxes = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    discountAmount = 0,
    finalAmount,
    code,
  } = useSelector((state) => state.coupon);
  const { productList = [] } = useSelector((state) => state.products);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [currentStep, setCurrentStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isRazorpayProcessing, setIsRazorpayProcessing] = useState(false);

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
      paymentMethod, // razorpay | cod
      totalAmount: payableAmount,
      ...(code ? { code } : {}),
    };

    setIsRazorpayProcessing(true);

    try {
      const data = await dispatch(createNewOrder(orderData));

      if (!data?.success) {
        throw new Error("Order creation failed");
      }

      // 🔐 Razorpay MUST exist for both Razorpay & COD advance
      if (!data.razorpayOrder || !data.razorpayOrder.id) {
        console.error("❌ Razorpay order missing:", data);
        toast.error("Payment initialization failed");
        setIsRazorpayProcessing(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: data.razorpayOrder.amount, // ✅ ALWAYS from backend
        currency: data.razorpayOrder.currency || "INR",
        name: "RANGE OF HIMALAYAS",
        description:
          paymentMethod === "cod"
            ? "₹200 Advance for COD Order"
            : "Online Payment",
        order_id: data.razorpayOrder.id,

        handler: async (response) => {
          try {
            await dispatch(
              capturePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              })
            );

            toast.success(
              paymentMethod === "cod"
                ? "₹200 advance paid. COD order placed!"
                : "Payment successful!"
            );

            dispatch(resetCoupon());

            navigate("/order-success", {
              state: {
                orderId: data.orderId,
                totalAmount: payableAmount,
                paymentMethod,
              },
            });
          } catch (err) {
            toast.error("Payment verification failed");
          } finally {
            setIsRazorpayProcessing(false);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: currentSelectedAddress?.phone || "",
        },

        theme: { color: "#2E8B57" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || "Order failed");
      setIsRazorpayProcessing(false);
    }
  }
  // Step 2 when address selected
  useEffect(() => {
    if (currentSelectedAddress) {
      setCurrentStep(2);
    }
  }, [currentSelectedAddress]);

  // Step 3 when payment selected
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

      {/* ===== CHECKOUT STEPS ===== */}
      {/* ===== CHECKOUT STEPS ===== */}
      <div className="max-w-3xl mx-auto mb-10 px-4">
        <div className="flex items-center justify-between">
          {/* STEP 1 */}
          <div className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
          ${
            currentStep >= 1
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
              >
                1
              </div>
              <span className="text-xs mt-2 font-medium">Address</span>
            </div>

            <div
              className={`flex-1 h-[3px] mx-3 transition-all duration-300
        ${currentStep >= 2 ? "bg-green-600" : "bg-gray-300"}`}
            />
          </div>

          {/* STEP 2 */}
          <div className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
          ${
            currentStep >= 2
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
              >
                2
              </div>
              <span className="text-xs mt-2 font-medium">Review</span>
            </div>

            <div
              className={`flex-1 h-[3px] mx-3 transition-all duration-300
        ${currentStep >= 3 ? "bg-green-600" : "bg-gray-300"}`}
            />
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
        ${
          currentStep >= 3
            ? "bg-green-600 text-white"
            : "bg-gray-300 text-gray-600"
        }`}
            >
              3
            </div>
            <span className="text-xs mt-2 font-medium">Payment</span>
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
            disabled={currentStep < 3 || isRazorpayProcessing}
            className="w-full mt-6 py-4 text-lg rounded-xl text-white
  bg-gradient-to-r from-green-600 to-emerald-500
  hover:from-green-700 hover:to-emerald-600
  shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isRazorpayProcessing
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
