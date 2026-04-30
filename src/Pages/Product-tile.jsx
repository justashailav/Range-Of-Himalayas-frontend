import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap } from "lucide-react";
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
    // Add to cart always (optional)
    handleAddToCart(
      product._id,
      stock,
      hasSizes ? selectedSize : "",
      selectedWeight
    );

    if (type === "buy-now") {
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
        };

        const response = await dispatch(createNewOrder(orderData));

        if (response?.razorpayOrderId) {
          if (!window.Razorpay) {
            alert("Payment gateway not loaded");
            return;
          }

          const options = {
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
              contact: "9015118744",
            },

            theme: { color: "#D84C3C" },
          };

          const rzp = new window.Razorpay(options);

          rzp.on("payment.failed", function () {
            alert("Payment failed. Try again.");
          });

          rzp.open();
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    } else {
      setOpenCartSheet?.(true);
    }
  };

  return (
    <div className="group relative bg-[#FCFBFA] rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all max-w-sm mx-auto overflow-hidden">

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
            alt="hover"
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
  );
}