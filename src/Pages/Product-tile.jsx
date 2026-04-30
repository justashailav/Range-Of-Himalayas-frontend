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

  // ✅ BUY NOW FLOW (NO CART ADD)
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
  }
};
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto overflow-hidden">
  
  {/* IMAGE SECTION - Fixed Aspect Ratio */}
  <div className="relative aspect-[4/5] m-3 mb-0 rounded-[2rem] overflow-hidden bg-[#F3F0EB] shrink-0">
    <img
      src={mainImage}
      alt={product?.title}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />

    {images[1] && (
      <img
        src={images[1]}
        alt="hover"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    )}

    {/* Price Tag - Glassmorphism */}
    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
      <span className="font-bold text-slate-900 text-sm">₹{finalPrice}</span>
    </div>

    {/* Wishlist Button */}
    <button
      onClick={() => handleAddToWishList(product._id, stock, hasSizes ? selectedSize : "", selectedWeight)}
      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full text-slate-900 hover:text-red-500 hover:scale-110 transition-all shadow-sm z-10"
    >
      <Heart size={18} />
    </button>
  </div>

  {/* CONTENT SECTION - Flex Grow ensures all boxes are same height */}
  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
    
    {/* Title & Category Area */}
    <div className="space-y-1">
      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
        {product?.category || "Himalayan"}
      </p>
      {/* line-clamp-2 and min-h ensures titles don't push the dropdowns down */}
      <h2 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 min-h-[3rem]">
        {product?.title}
      </h2>
    </div>

    {/* VARIANTS - Styled Dropdowns */}
    <div className="space-y-3">
      {hasVariants ? (
        <div className="grid grid-cols-2 gap-2">
          {hasSizes ? (
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => {
                  const size = e.target.value;
                  setSelectedSize(size);
                  setSelectedWeight(getWeightsBySize(size)[0]);
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-all"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ) : (
             <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-slate-400 italic">No Size</div>
          )}

          <div className="relative">
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-all"
            >
              {getWeightsBySize(selectedSize).map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg width="8" height="5" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[42px]" /> /* Placeholder to keep height consistent for products without variants */
      )}
    </div>

    {/* ACTION BUTTONS */}
    <div className="pt-2 space-y-2">
      {stock === 0 ? (
        <button disabled className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
          Sold Out
        </button>
      ) : (
        <>
          <button
            onClick={() => handleAction("buy-now")}
            className="w-full bg-[#D84C3C] hover:bg-[#bd3e31] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-md shadow-red-50 active:scale-[0.98]"
          >
            <Zap size={14} fill="white" /> <span className="text-sm">Buy Now</span>
          </button>

          <button
            onClick={() => handleAction("add-to-cart")}
            className="w-full bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={14} /> <span className="text-sm">Add to Cart</span>
          </button>
        </>
      )}
    </div>
  </div>
</div>
  );
}