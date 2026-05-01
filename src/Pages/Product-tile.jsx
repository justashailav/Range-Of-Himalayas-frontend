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
  const hasVariants = variants.length > 0;

  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0;

  const getWeightsBySize = (size) => {
    if (!hasSizes) return variants.map((v) => v.weight);
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find(
      (v) => (hasSizes ? v.size === size : true) && v.weight === weight
    ) || null;

  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0] : "");
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

  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice = selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;
  const finalPrice = salesPrice > 0 ? salesPrice : price;

  const mainImage = product?.image;
  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : [product?.image].filter(Boolean);

  // 🔥 MAIN ACTION HANDLER
  const handleAction = async (type) => {
    if (type === "add-to-cart") {
      handleAddToCart(
        product._id,
        stock,
        hasSizes ? selectedSize : "",
        selectedWeight
      );
      setOpenCartSheet?.(true);
      return;
    }

    if (type === "buy-now") {
      setShowAddressModal(true); // 👈 OPEN ADDRESS SCREEN
      return;
    }
  };

  // 🔥 AFTER ADDRESS SELECT → PAYMENT
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
          latitude: selectedAddress.location?.coordinates?.[1],
          longitude: selectedAddress.location?.coordinates?.[0],
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
          image: product.image,

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

          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "",
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

  return (
    <>
      {/* PRODUCT CARD */}
      <div className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all max-w-sm mx-auto overflow-hidden">

        {/* IMAGE */}
        <div className="relative aspect-[4/5] m-3 rounded-[2rem] overflow-hidden bg-[#F3F0EB]">
          <img
            src={mainImage}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition"
          />

          {images[1] && (
            <img
              src={images[1]}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition"
            />
          )}

          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full">
            ₹{finalPrice}
          </div>

          <button
            onClick={() =>
              handleAddToWishList(
                product._id,
                stock,
                hasSizes ? selectedSize : "",
                selectedWeight
              )
            }
            className="absolute top-4 right-4 bg-white p-2 rounded-full"
          >
            <Heart size={16} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4">
          <h2 className="font-semibold">{product?.title}</h2>

          {/* VARIANTS */}
          {hasVariants && (
            <div className="flex gap-2">
              {hasSizes && (
                <select
                  value={selectedSize}
                  onChange={(e) => {
                    const size = e.target.value;
                    setSelectedSize(size);
                    setSelectedWeight(getWeightsBySize(size)[0]);
                  }}
                >
                  {sizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              )}

              <select
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
              >
                {getWeightsBySize(selectedSize).map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
          )}

          {/* BUTTONS */}
          {stock === 0 ? (
            <button disabled className="w-full bg-gray-200 py-3 rounded-xl">
              Sold Out
            </button>
          ) : (
            <>
              <button
                onClick={() => handleAction("buy-now")}
                className="w-full bg-[#D84C3C] text-white py-3 rounded-xl flex justify-center gap-2"
              >
                <Zap size={14} /> Buy Now
              </button>

              <button
                onClick={() => handleAction("add-to-cart")}
                className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </>
          )}
        </div>
      </div>

      {/* FULL SCREEN ADDRESS */}
      {showAddressModal && (
  <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">

    {/* MAIN CONTAINER */}
    <div className="w-[95%] max-w-6xl h-[90vh] bg-white rounded-3xl overflow-hidden flex shadow-2xl">

      {/* LEFT SIDE (LIKE RAZORPAY RED PANEL) */}
      <div className="w-[35%] bg-[#D84C3C] text-white p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-6">Range of Himalayas</h2>

          <div className="bg-white/20 p-4 rounded-xl">
            <p className="text-sm opacity-80">Price Summary</p>
            <p className="text-2xl font-bold mt-1">₹{finalPrice}</p>
          </div>
        </div>

        <p className="text-xs opacity-70">Secured by Razorpay</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Select Delivery Address</h2>
          <button onClick={() => setShowAddressModal(false)}>
            <X size={20} />
          </button>
        </div>

        {/* ADDRESS SECTION */}
        <div className="flex-1 overflow-y-auto p-5">
          <Address
            selectedId={selectedAddress}
            setCurrentSelectedAddress={setSelectedAddress}
          />
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t">
          <button
            disabled={!selectedAddress}
            onClick={handleBuyNowWithAddress}
            className={`w-full py-4 rounded-xl font-bold text-white ${
              !selectedAddress
                ? "bg-gray-300"
                : "bg-[#D84C3C] hover:bg-[#c03f31]"
            }`}
          >
            Proceed to Pay ₹{finalPrice}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}