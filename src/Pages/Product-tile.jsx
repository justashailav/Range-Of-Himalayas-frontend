import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { capturePayment, createNewOrder } from "@/store/slices/orderSlice";

export default function ShoppingProductTile({
  product,
  handleAddToCart,
  handleAddToWishList,
  setOpenCartSheet,
}) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { addressList = [] } = useSelector((state) => state.address);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // ---------------- VARIANTS ----------------
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0;

  const getWeightsBySize = (size) => {
    if (!hasSizes) return variants.map((v) => v.weight);
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find(
      (v) =>
        (hasSizes ? v.size === size : true) && v.weight === weight
    ) || null;

  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? sizes[0] : ""
  );
  const [selectedWeight, setSelectedWeight] = useState(
    getWeightsBySize(hasSizes ? sizes[0] : "")[0] || ""
  );
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (hasVariants) {
      const w = getWeightsBySize(selectedSize)[0];
      setSelectedWeight(w);
      setSelectedVariant(getVariant(selectedSize, w));
    }
  }, [product]);

  useEffect(() => {
    if (hasVariants && selectedWeight) {
      setSelectedVariant(getVariant(selectedSize, selectedWeight));
    }
  }, [selectedSize, selectedWeight]);

  // ---------------- PRICE ----------------
  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice =
    selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;

  const finalPrice = salesPrice > 0 ? salesPrice : price;
  const discount =
    price > salesPrice
      ? Math.round(((price - salesPrice) / price) * 100)
      : 0;

  const mainImage = product?.image;

  // ---------------- CART ----------------
  const handleAddOnly = () => {
    handleAddToCart(
      product._id,
      stock,
      hasSizes ? selectedSize : "",
      selectedWeight
    );
    setOpenCartSheet?.(true);
  };

  // ---------------- BUY NOW ----------------
  const handleBuyNowWithAddress = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const orderData = {
        userId: user?._id,

        cartItems: [
          {
            productId: product._id,
            title: product.title,
            image: product.image,
            price: finalPrice,
            quantity: 1,
            size: hasSizes ? selectedSize : "",
            weight: selectedWeight,
          },
        ],

        boxes: [],
        paymentMethod: "razorpay",
        totalAmount: finalPrice,

        addressInfo: {
          addressId: selectedAddress._id,
          address: selectedAddress.address,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode,
          phone: selectedAddress.phone,
          latitude:
            selectedAddress.location?.coordinates?.[1],
          longitude:
            selectedAddress.location?.coordinates?.[0],
        },
      };

      const response = await dispatch(createNewOrder(orderData));

      if (response?.razorpayOrderId) {
        const rzp = new window.Razorpay({
          key: response.key,
          amount: response.amount,
          currency: response.currency,
          order_id: response.razorpayOrderId,

          name: "Range of Himalayas",
          description: product.title,

          handler: async function (rzpResponse) {
            await dispatch(
              capturePayment({
                orderId: response.orderId,
                razorpay_order_id:
                  rzpResponse.razorpay_order_id,
                razorpay_payment_id:
                  rzpResponse.razorpay_payment_id,
                razorpay_signature:
                  rzpResponse.razorpay_signature,
              })
            );

            window.location.href = "/order-success";
          },

          prefill: {
            name: user?.name,
            email: user?.email,
            contact: selectedAddress.phone,
          },

          theme: { color: "#D84C3C" },
        });

        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // 🔥 AUTO SELECT IF ONLY 1 ADDRESS
  useEffect(() => {
    if (addressList.length === 1) {
      setSelectedAddress(addressList[0]);
    }
  }, [addressList]);

  return (
    <>
      {/* PRODUCT CARD */}
      <div className="group bg-white rounded-2xl border p-4">
        <img
          src={mainImage}
          className="w-full h-60 object-cover rounded-xl"
        />

        <h2 className="mt-3 font-semibold">{product?.title}</h2>

        <p className="font-bold mt-1">₹{finalPrice}</p>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => setShowAddressModal(true)}
            className="w-full bg-[#D84C3C] text-white py-3 rounded-xl flex justify-center gap-2"
          >
            <Zap size={14} /> Buy Now
          </button>

          <button
            onClick={handleAddOnly}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowAddressModal(false)}
          />

          {/* MODAL */}
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 max-h-[80vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Select Address</h2>
              <X onClick={() => setShowAddressModal(false)} />
            </div>

            {/* ADDRESS LIST */}
            {addressList.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No address found
              </p>
            ) : (
              addressList.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-4 rounded-xl border mb-3 cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "border-[#D84C3C] bg-[#fff5f3]"
                      : "border-gray-200"
                  }`}
                >
                  <p className="font-semibold">{addr.address}</p>
                  <p className="text-sm text-gray-500">
                    {addr.city} • {addr.pincode}
                  </p>
                </div>
              ))
            )}

            {/* FOOTER */}
            <button
              disabled={!selectedAddress}
              onClick={handleBuyNowWithAddress}
              className="w-full mt-4 bg-[#D84C3C] text-white py-3 rounded-xl"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      )}
    </>
  );
}