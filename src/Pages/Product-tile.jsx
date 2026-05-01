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
  const discount = price > salesPrice ? Math.round(((price - salesPrice) / price) * 100) : 0;

  const mainImage = product?.image;
  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [product?.image].filter(Boolean);

  const handleAddOnly = () => {
    handleAddToCart(product._id, stock, hasSizes ? selectedSize : "", selectedWeight);
    setOpenCartSheet?.(true);
  };

  const handleBuyNowWithAddress = async () => {
    if (!selectedAddress) { alert("Please select address"); return; }
    // ... (Keep your existing payment logic here)
  };

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        
        {/* IMAGE SECTION */}
        <div className="relative aspect-[1/1] overflow-hidden bg-[#f9f9f9]">
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
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{product?.category}</span>
            <h2 className="text-lg font-medium text-gray-900 truncate">{product?.title}</h2>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{finalPrice}</span>
            {salesPrice > 0 && (
              <span className="text-sm text-gray-400 line-through">₹{price}</span>
            )}
          </div>

          {/* CUSTOM VARIANT SELECTORS (Cleaner than default selects) */}
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
                      selectedSize === size ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
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
                    selectedWeight === w ? "bg-gray-800 text-white border-gray-800" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
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

      {/* ADDRESS MODAL (Glassmorphism effect) */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <Address
                selectedId={selectedAddress}
                setCurrentSelectedAddress={setSelectedAddress}
              />
            </div>

            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                Go Back
              </button>
              <button
                disabled={!selectedAddress}
                onClick={handleBuyNowWithAddress}
                className={`flex-1 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-200 ${
                  !selectedAddress ? "bg-gray-300 cursor-not-allowed" : "bg-[#D84C3C] text-white hover:bg-[#c03f31]"
                }`}
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}