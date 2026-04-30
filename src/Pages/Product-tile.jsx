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
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto overflow-hidden">
  
  {/* IMAGE SECTION */}
  <div className="relative aspect-[4/5] m-3 rounded-[1.5rem] overflow-hidden bg-[#F3F0EB]">
    {/* Sale Badge */}
    {product?.salesPrice > 0 && (
      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tight">
        Sale
      </div>
    )}

    <img
      src={mainImage}
      alt={product?.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />

    {images[1] && (
      <img
        src={images[1]}
        alt="hover"
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
    )}

    {/* Floating Price Tag */}
    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
      <div className="flex items-center gap-1.5">
        <span className="text-slate-900 font-bold text-sm">₹{finalPrice}</span>
        {product?.salesPrice > 0 && (
          <span className="text-slate-400 line-through text-[10px]">₹{product.price}</span>
        )}
      </div>
    </div>

    {/* Wishlist Button */}
    <button
      onClick={() => handleAddToWishList(product._id, stock, hasSizes ? selectedSize : "", selectedWeight)}
      className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-slate-900 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
    >
      <Heart size={18} />
    </button>
  </div>

  {/* CONTENT SECTION */}
  <div className="p-5 pt-2 space-y-5">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">{product?.category || "Natural"}</p>
      <h2 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1">{product?.title}</h2>
    </div>

    {/* VARIANTS (PILL STYLE) */}
    {hasVariants && (
      <div className="space-y-3">
        {hasSizes && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setSelectedWeight(getWeightsBySize(size)[0]);
                }}
                className={`px-3 py-1 text-[11px] font-medium rounded-lg border transition-all ${
                  selectedSize === size 
                    ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {getWeightsBySize(selectedSize).map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={`px-3 py-1 text-[10px] rounded-full border transition-all ${
                selectedWeight === w 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                  : "border-slate-100 bg-slate-50 text-slate-500"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* BUTTONS */}
    <div className="flex flex-col gap-2 pt-2">
      {stock === 0 ? (
        <button disabled className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider">
          Out of Stock
        </button>
      ) : (
        <>
          <button
            onClick={() => handleAction("buy-now")}
            className="w-full bg-[#D84C3C] hover:bg-[#c04234] text-white py-3.5 rounded-2xl flex justify-center items-center gap-2 font-bold shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
          >
            <Zap size={16} fill="white" /> Buy Now
          </button>

          <button
            onClick={() => handleAction("add-to-cart")}
            className="w-full bg-white border border-slate-200 hover:border-slate-900 text-slate-900 py-3.5 rounded-2xl flex justify-center items-center gap-2 font-bold transition-all"
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </>
      )}
      
      {stock > 0 && stock < 10 && (
        <p className="text-center text-[10px] text-orange-600 font-medium animate-pulse">
          Only {stock} items left in stock!
        </p>
      )}
    </div>
  </div>
</div>
  );
}