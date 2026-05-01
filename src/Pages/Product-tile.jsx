import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Zap, X, Check, MapPin, ChevronRight, CreditCard } from "lucide-react";
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

  // --- Logic Section (Keep your existing variant logic) ---
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

  useEffect(() => {
    if (hasVariants) {
      const w = getWeightsBySize(selectedSize)[0];
      setSelectedWeight(w);
      setSelectedVariant(getVariant(selectedSize, w));
    }
  }, [product, selectedSize]);

  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const price = selectedVariant?.price ?? product?.price ?? 0;
  const salesPrice = selectedVariant?.salesPrice ?? product?.salesPrice ?? 0;
  const finalPrice = salesPrice > 0 ? salesPrice : price;
  const discount = price > salesPrice ? Math.round(((price - salesPrice) / price) * 100) : 0;

  const handleAddOnly = () => {
    handleAddToCart(product._id, stock, hasSizes ? selectedSize : "", selectedWeight);
    setOpenCartSheet?.(true);
  };

  const handleBuyNowWithAddress = async () => {
     // ... (Your existing Razorpay dispatch logic)
  };

  return (
    <>
      {/* PRODUCT CARD (UI remains consistent with your shop) */}
      <div className="group relative flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
         <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img src={product?.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
            <button onClick={() => setShowAddressModal(true)} className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-[#D84C3C] hover:scale-110 transition-transform">
                <Zap size={20} fill="currentColor" />
            </button>
         </div>
         <div className="p-4">
            <h3 className="font-bold text-gray-800">{product.title}</h3>
            <p className="text-xl font-black mt-1">₹{finalPrice}</p>
            <button onClick={() => setShowAddressModal(true)} className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                Quick Buy
            </button>
         </div>
      </div>

      {/* RAZORPAY-STYLE CHECKOUT MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Darker backdrop for focus */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
          
          <div className="relative bg-white w-full max-w-[800px] h-full sm:h-auto sm:min-h-[500px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row animate-in zoom-in-95 duration-300">
            
            {/* LEFT SIDE: Order Summary (Razorpay Blue/Theme Side) */}
            <div className="w-full sm:w-[350px] bg-[#1a1f2b] p-8 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={20} className="text-[#D84C3C]" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Order Summary</p>
                        <p className="text-sm font-bold truncate w-40">{product.title}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Price</span>
                        <span>₹{finalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Variant</span>
                        <span>{selectedSize} {selectedWeight}</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="font-bold">Total Amount</span>
                        <span className="text-2xl font-black">₹{finalPrice}</span>
                    </div>
                </div>
              </div>

              <div className="hidden sm:block mt-8">
                 <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Secure Checkout Powered by</p>
                 <p className="text-lg font-black italic opacity-20 text-white">RANGE OF HIMALAYAS</p>
              </div>
            </div>

            {/* RIGHT SIDE: Address Selection (Main Action) */}
            <div className="flex-1 bg-gray-50 flex flex-col h-full overflow-hidden">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <h2 className="font-bold text-slate-800">Select Delivery Address</h2>
                </div>
                <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <Address
                        selectedId={selectedAddress}
                        setCurrentSelectedAddress={setSelectedAddress}
                    />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-6 bg-white border-t mt-auto">
                <button
                  disabled={!selectedAddress}
                  onClick={handleBuyNowWithAddress}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-95 ${
                    !selectedAddress 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-[#D84C3C] text-white hover:bg-[#c03f31] shadow-red-200"
                  }`}
                >
                  {selectedAddress ? "Proceed to Payment" : "Select an Address"}
                  <ChevronRight size={20} />
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                   <CreditCard size={12} /> Cards, UPI, NetBanking supported in next step
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}