import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { capturePayment, createNewOrder } from "@/store/slices/orderSlice";
import Address from "@/Pages/Address";

export default function ShoppingProductTile({
  product,
  handleAddToCart,
  handleAddToWishList,
  setOpenCartSheet,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const getWeightsBySize = (size) => {
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(sizes[0])[0] || ""
  );

  const selectedVariant =
    variants.find(
      (v) => v.size === selectedSize && v.weight === selectedWeight
    ) || {};

  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const finalPrice =
    selectedVariant?.salesPrice > 0
      ? selectedVariant.salesPrice
      : selectedVariant?.price || product?.price;

  // 🔥 BUY NOW CLICK
  const handleBuyNow = () => {
    setShowAddressModal(true);
  };

  // 🔥 FINAL PAYMENT
  const handleBuyNowWithAddress = async () => {
    if (!selectedAddress) return alert("Select address");

    const orderData = {
      userId: user?._id,
      cartItems: [
        {
          productId: product._id,
          title: product.title,
          image: product.image,
          price: finalPrice,
          quantity: 1,
          size: selectedSize,
          weight: selectedWeight,
        },
      ],
      totalAmount: finalPrice,
      paymentMethod: "razorpay",
      addressInfo: selectedAddress,
    };

    const response = await dispatch(createNewOrder(orderData));

    const rzp = new window.Razorpay({
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      order_id: response.razorpayOrderId,

      handler: async function (rzpResponse) {
        await dispatch(
          capturePayment({
            orderId: response.orderId,
            razorpay_order_id: rzpResponse.razorpay_order_id,
            razorpay_payment_id: rzpResponse.razorpay_payment_id,
            razorpay_signature: rzpResponse.razorpay_signature,
          })
        );

        window.location.href = "/order-success";
      },
    });

    rzp.open();
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div className="bg-white rounded-2xl shadow p-4 max-w-sm">
        <img src={product.image} className="rounded-xl mb-3" />

        <h2 className="font-semibold">{product.title}</h2>
        <p className="font-bold">₹{finalPrice}</p>

        {/* VARIANTS */}
        {sizes.length > 0 && (
          <select
            value={selectedSize}
            onChange={(e) => {
              const size = e.target.value;
              setSelectedSize(size);
              setSelectedWeight(getWeightsBySize(size)[0]);
            }}
            className="w-full mt-2 border p-2 rounded"
          >
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}

        <select
          value={selectedWeight}
          onChange={(e) => setSelectedWeight(e.target.value)}
          className="w-full mt-2 border p-2 rounded"
        >
          {getWeightsBySize(selectedSize).map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>

        {/* BUTTONS */}
        <button
          onClick={handleBuyNow}
          className="w-full mt-3 bg-red-500 text-white py-3 rounded-xl"
        >
          Buy Now
        </button>

        <button
          onClick={() =>
            handleAddToCart(product._id, stock, selectedSize, selectedWeight)
          }
          className="w-full mt-2 bg-black text-white py-3 rounded-xl"
        >
          Add to Cart
        </button>
      </div>

      {/* 🔥 FULL SCREEN MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">

          {/* CENTER BOX */}
          <div className="w-[95%] max-w-3xl h-[90vh] bg-white rounded-2xl flex flex-col shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold">
                Select Delivery Address
              </h2>
              <button onClick={() => setShowAddressModal(false)}>
                <X />
              </button>
            </div>

            {/* ADDRESS LIST */}
            <div className="flex-1 overflow-y-auto p-5">
              <Address
                selectedId={selectedAddress?._id}
                setCurrentSelectedAddress={setSelectedAddress}
              />
            </div>

            {/* FOOTER */}
            <div className="p-5 border-t">
              <button
                disabled={!selectedAddress}
                onClick={handleBuyNowWithAddress}
                className={`w-full py-4 rounded-xl font-bold text-lg ${
                  !selectedAddress
                    ? "bg-gray-300"
                    : "bg-red-500 text-white"
                }`}
              >
                Proceed to Pay ₹{finalPrice}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}