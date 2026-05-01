import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, X, Check } from "lucide-react";
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

  // Modal and Selection State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Variant Logic
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const hasSizes = sizes.length > 0;

  const getWeightsBySize = (size) => {
    if (!hasSizes) return variants.map((v) => v.weight);
    return variants.filter((v) => v.size === size).map((v) => v.weight);
  };

  const getVariant = (size, weight) =>
    variants.find((v) => (hasSizes ? v.size === size : true) && v.weight === weight) || null;

  const [selectedSize, setSelectedSize] = useState(hasSizes ? sizes[0] : "");
  const [selectedWeight, setSelectedWeight] = useState(getWeightsBySize(hasSizes ? sizes[0] : "")[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Sync variants when product or selections change
  useEffect(() => {
    if (hasVariants) {
      const initialWeight = getWeightsBySize(selectedSize)[0];
      setSelectedWeight(initialWeight);
      setSelectedVariant(getVariant(selectedSize, initialWeight));
    }
  }, [product]);

  useEffect(() => {
    if (hasVariants && selectedWeight) {
      setSelectedVariant(getVariant(selectedSize, selectedWeight));
    }
  }, [selectedSize, selectedWeight]);

  // Pricing & Stock
  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice = selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;
  const finalPrice = salesPrice > 0 ? salesPrice : price;
  const discount = price > salesPrice ? Math.round(((price - salesPrice) / price) * 100) : 0;

  const mainImage = product?.image;
  const images = Array.isArray(product?.images) && product.images.length > 0 
    ? product.images 
    : [product?.image].filter(Boolean);

  const handleAddOnly = () => {
    handleAddToCart(product._id, stock, hasSizes ? selectedSize : "", selectedWeight);
    setOpenCartSheet?.(true);
  };

  const handleBuyNowWithAddress = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const orderData = {
        userId: user?._id,
        cartItems: [{
          productId: product._id,
          title: product.title,
          image: product.image,
          price: finalPrice,
          quantity: 1,
          size: hasSizes ? selectedSize : "",
          weight: selectedWeight,
        }],
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
        if (!window.Razorpay) {
          alert("Payment gateway not loaded");
          return;
        }

        const rzp = new window.Razorpay({
          key: response.key,
          amount: response.amount,
          currency: response.currency,
          order_id: response.razorpayOrderId,
          name: "Range of Himalayas",
          description: product.title,
          image: product.image,
          handler: async function (rzpResponse) {
            await dispatch(capturePayment({
              orderId: response.orderId,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            }));
            window.location.href = "/order-success";
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: selectedAddress.phone,
          },
          theme: { color: "#D84C3C" },
        });

        rzp.on("payment.failed", () => alert("Payment failed"));
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-square overflow-hidden bg-[#f9f9f9]">
          {discount > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {discount}% Off
            </div>
          )}
          
          <img 
            src={mainImage} 
            alt={product?.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          
          {images[1] && (
            <img
              src={images[1]}
              alt="Secondary view"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          <button
            onClick={() => handleAddToWishList(product._id, stock, hasSizes ? selectedSize : "", selectedWeight)}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={18} className="text-gray-900" />
          </button>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{product?.category || "Premium Collection"}</span>
            <h2 className="text-lg font-medium text-gray-900 truncate">{product?.title}</h2>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
            {salesPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">₹{price}</span>
            )}
          </div>

          {/* VARIANT SELECTORS */}
          <div className="space-y-3 mb-6">
            {hasSizes && (
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSelectedWeight(getWeightsBySize(size)[0]);
                    }}
                    className={`px-3 py-1 text-xs border rounded-lg transition-all ${
                      selectedSize === size 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
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
                  className={`px-3 py-1 text-xs border rounded-lg transition-all ${
                    selectedWeight === w 
                      ? "bg-slate-800 text-white border-slate-800" 
                      : "bg-slate-50 text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto space-y-2">
            {stock === 0 ? (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl font-medium cursor-not-allowed">
                Out of Stock
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full bg-[#D84C3C] hover:bg-[#c03f31] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all transform active:scale-[0.98]"
                >
                  <Zap size={16} fill="currentColor" /> Buy Now
                </button>
                <button
                  onClick={handleAddOnly}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* REFINED ADDRESS MODAL (Fixed Layout from image_5ac01b.png) */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
            onClick={() => setShowAddressModal(false)} 
          />
          
          <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">
            
            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Address</h2>
              <button 
                onClick={() => setShowAddressModal(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="px-6 overflow-y-auto flex-grow scrollbar-hide">
              <div className="w-full max-w-full overflow-x-hidden py-2">
                <Address
                  selectedId={selectedAddress}
                  setCurrentSelectedAddress={setSelectedAddress}
                />
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-4 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Go Back
              </button>
              
              <button
                disabled={!selectedAddress}
                onClick={handleBuyNowWithAddress}
                className={`flex-[1.5] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  !selectedAddress 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-[#D84C3C] text-white hover:bg-[#c03f31] shadow-red-200 active:scale-[0.98]"
                }`}
              >
                Proceed to Pay
                <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}