import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Address from "@/Pages/Address";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { capturePayment, createNewOrder } from "@/store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import rajmaImg from "./../assets/Rajma.png";
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

  const COD_ADVANCE_AMOUNT = 200;

  const amountToPayNow =
    paymentMethod === "cod" ? COD_ADVANCE_AMOUNT : payableAmount;
  useEffect(() => {
    if ((cartItems.length === 0 && boxes.length === 0) || !user) {
      toast.error("Your cart is empty or you are not logged in.");
      navigate("/");
    }
  }, [cartItems, boxes, navigate, user]);

  // 🧾 Place Order
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
      paymentMethod, // 🔥 razorpay or cod
      paymentStatus: "pending",
      totalAmount: payableAmount,
      ...(code ? { code } : {}),
    };

    setIsRazorpayProcessing(true);

    try {
      const data = await dispatch(createNewOrder(orderData));

      if (data?.success) {
        const options = {
          key: razorpayKey,
          amount: amountToPayNow * 100,

          currency: data.razorpayOrder.currency,
          name: "RANGE OF HIMALAYAS",
          description: "Order Payment",
          order_id: data.razorpayOrder.id,
          handler: async function (response) {
            try {
              await dispatch(
                capturePayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: data.orderId,
                })
              );
              toast.success("Payment successful!");
              dispatch(resetCoupon());
              navigate("/order-success", {
                state: { orderId: data.orderId, totalAmount: payableAmount },
              });
            } catch (error) {
              toast.error("Payment verification failed.");
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
      } else {
        throw new Error("Failed to place order.");
      }
    } catch (error) {
      toast.error(error?.message || "Order failed.");
      setIsRazorpayProcessing(false);
    }
  }

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Checkout | Range of Himalayas</title>
        <meta
          name="description"
          content="Complete your order for fresh Himalayan apples, kiwis, and organic produce. Safe and secure Razorpay checkout."
        />
        <meta
          name="keywords"
          content="Range of Himalayas, checkout, apples, kiwis, razorpay, organic fruits"
        />
        <link rel="canonical" href="https://rangeofhimalayas.com/checkout" />
      </Helmet>
      <div className="grid grid-cols-1 gap-6 mt-6 p-6 bg-white shadow-md rounded-xl">
        {/* 🏠 Address Section */}
        <div className="border rounded-lg p-5 shadow-sm bg-gray-50">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>

        <div className="flex flex-col gap-6">
          {/* 🛍️ Cart Items (Read-only Summary) */}
          {cartItems.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 border-b pb-2">
                Cart Items
              </h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size || "default"}`}
                    className="flex justify-between items-center border p-4 rounded-lg shadow-sm bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.title}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-600">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-700">
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

          {/* 📦 Box Items */}
          {boxes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3 border-b pb-2">Boxes</h2>
              <div className="space-y-4">
                {boxes.map((box) => (
                  <div
                    key={box._id || box.boxId}
                    className="border p-4 rounded-lg bg-white shadow-sm"
                  >
                    <h3 className="font-semibold text-lg text-blue-700 mb-2">
                      {box.boxName || "Custom Box"}
                    </h3>
                    <ul className="divide-y divide-gray-200">
                      {box.items.map((item, idx) => {
                        const product =
                          productList.find((p) => p._id === item.productId) ||
                          {};
                        const sizePriceObj = (
                          product.customBoxPrices || []
                        ).find((p) => p.size === item.size);
                        const price = sizePriceObj
                          ? Number(sizePriceObj.pricePerPiece)
                          : 0;

                        return (
                          <li
                            key={`${item.productId}-${idx}`}
                            className="py-2 flex justify-between items-center"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image || "/placeholder.png"}
                                alt={product.title}
                                className="w-12 h-12 rounded-md border"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {product.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-green-700">
                              ₹{(price * item.quantity).toFixed(2)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 💰 Price Summary */}
          <div className="p-5 bg-gray-100 border rounded-lg">
            <h3 className="text-lg font-bold mb-3 border-b pb-2">
              Price Summary
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Cart Items Total: ₹{totalCartAmount.toFixed(2)}</li>
              <li>Boxes Total: ₹{boxesTotal.toFixed(2)}</li>
              <li className="font-semibold">
                Grand Total: ₹{grandTotal.toFixed(2)}
              </li>
              {discountAmount > 0 && (
                <li className="text-green-700 font-medium">
                  Coupon Discount: -₹{discountAmount.toFixed(2)}
                </li>
              )}
            </ul>
            <p className="text-xl font-extrabold mt-3 text-blue-800">
              Payable: ₹{payableAmount.toFixed(2)}
            </p>

            {code && (
              <p className="text-sm text-green-600 mt-2">
                🎟️ Coupon <strong>{code}</strong> applied successfully
              </p>
            )}

            {freeGift && (
              <div className="mt-5 flex items-center gap-3 p-3 rounded-xl border border-green-300 bg-green-50 shadow-sm">
                <img
                  src={rajmaImg}
                  alt={freeGift.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    🎁 Free Gift: {freeGift.name} ({freeGift.quantity}kg)
                  </p>
                  <p className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                    Yours Free!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Payment Method */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                Pay Online
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery (₹200 advance)
              </label>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={isRazorpayProcessing}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              {isRazorpayProcessing
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Pay ₹200 & Place COD Order"
                : "Pay Online"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
