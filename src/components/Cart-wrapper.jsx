import { Link, useNavigate } from "react-router-dom";
import { SheetClose, SheetContent } from "./ui/sheet";
import UserCartItemsContent from "./Cart-Item-Content";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { applyCoupon, resetCoupon } from "@/store/slices/couponSlice";
import { X, ShoppingBag, Truck, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import CartSuggestions from "@/Pages/CartProducts";

export default function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productList = [] } = useSelector((state) => state.products) || {};
  const { user } = useSelector((state) => state.auth) || {};
  const { cartItems: reduxCartItems = [], boxes = [] } = useSelector((state) => state.cart) || {};

  const guestCartItems = (() => {
    try {
      return JSON.parse(localStorage.getItem("guestCart")) || [];
    } catch { return []; }
  })();

  const cartItems = user?._id ? reduxCartItems : guestCartItems;
  const { discountAmount, success } = useSelector((state) => state.coupon);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    if (success) {
      setDiscount(discountAmount);
      setIsCouponApplied(true);
    }
  }, [success, discountAmount]);

  useEffect(() => {
    const cartTotal = (cartItems || []).reduce((sum, item) => {
      const price = item.salesPrice && Number(item.salesPrice) > 0 ? Number(item.salesPrice) : Number(item.price) || 0;
      return sum + price * (Number(item.quantity) || 1);
    }, 0);

    const boxesTotal = (boxes || []).reduce((sum, box) => {
      const boxItemsTotal = (box.items || []).reduce((bSum, item) => {
        const product = productList.find((p) => p._id.toString() === item.productId?.toString());
        if (!product) return bSum;
        const sizePriceObj = (product.customBoxPrices || []).find((p) => p.size === item.size);
        return bSum + (sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0) * (Number(item.quantity) || 1);
      }, 0);
      return sum + boxItemsTotal;
    }, 0);

    const currentGrandTotal = cartTotal + boxesTotal;
    setFinalAmount(discountAmount > 0 ? Math.max(0, currentGrandTotal - discountAmount) : currentGrandTotal);
  }, [cartItems, boxes, productList, discountAmount]);

  useEffect(() => {
    dispatch(resetCoupon());
  }, []);

  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode.trim().toUpperCase();
    if (!trimmedCode) return toast.error("Enter coupon code");
    
    const data = await dispatch(applyCoupon({ code: trimmedCode, orderAmount: finalAmount, userId: user?._id }));
    if (data?.success) toast.success("Elite discount applied");
  };

  const FREE_SHIPPING = 1000;
  const remaining = Math.max(0, FREE_SHIPPING - finalAmount);
  const progressPercent = Math.min((finalAmount / FREE_SHIPPING) * 100, 100);

  return (
    <SheetContent
      side="right"
      className="h-full w-full sm:max-w-[440px] flex flex-col bg-[#F9F8F6] p-0 border-l border-stone-200 outline-none shadow-2xl"
    >
      {/* --- HEADER --- */}
      <div className="px-8 py-7 bg-white/80 backdrop-blur-md border-b border-stone-100 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h2 className="text-xs font-bold text-stone-400 tracking-[0.25em] uppercase mb-1">
            Shopping Bag
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif italic text-stone-900">Your Selection</span>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
              {(cartItems?.length || 0) + (boxes?.length || 0)}
            </span>
          </div>
        </div>
        <SheetClose className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500">
          <X className="h-4 w-4" />
        </SheetClose>
      </div>

      {/* --- FREE SHIPPING PROGRESS (Lux Version) --- */}
      <div className="px-8 py-6 bg-white">
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-center gap-2 text-[#B23A2E]">
            <Truck className="w-4 h-4" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              {remaining > 0 ? "Standard Delivery" : "Complimentary Shipping"}
            </span>
          </div>
          {remaining > 0 && (
            <span className="text-[11px] font-medium text-stone-500 italic">
              ₹{remaining} away from free shipping
            </span>
          )}
        </div>
        <div className="h-[3px] w-full bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#B23A2E] transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-8 py-6">
          {(cartItems?.length || 0) > 0 || (boxes?.length || 0) > 0 ? (
            <div className="space-y-10">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <UserCartItemsContent key={`${item.productId}-${item.size}`} cartItem={item} mobile />
                ))}
              </div>

              {boxes?.length > 0 && (
                <div className="pt-8 border-t border-stone-200/50">
                  <h4 className="text-[9px] font-black text-stone-400 tracking-[0.3em] uppercase mb-8">
                    Bespoke Gift Boxes
                  </h4>
                  {boxes.map((boxItem) => (
                    <UserCartItemsContent 
                      key={`box-${boxItem.boxId}`} 
                      boxItem={boxItem} 
                      productList={productList} 
                      mobile 
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-200 mb-6 stroke-[1px]" />
              <p className="text-stone-500 font-serif italic text-lg">Your bag is empty</p>
              <SheetClose asChild>
                <Link to="/viewproducts" className="mt-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[#B23A2E] border-b border-[#B23A2E]/30 pb-1 hover:border-[#B23A2E] transition-all">
                  Browse Collection
                </Link>
              </SheetClose>
            </div>
          )}
        </div>

        {/* --- RECOMMENDATIONS --- */}
        <div className="bg-stone-50/50 border-y border-stone-100 mt-4">
          <CartSuggestions
            products={suggestedProducts}
            handleAddToCart={(id, stock, size, weight) => {
              dispatch(addToCart({ productId: id, quantity: 1, size, weight }));
            }}
            setOpenCartSheet={setOpenCartSheet}
          />
        </div>
      </div>

      {/* --- FOOTER SECTION --- */}
      <div className="bg-white px-8 pt-8 pb-10 border-t border-stone-100 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        {/* Promo Code High-End Style */}
        <div className="relative mb-8 group">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 group-focus-within:text-[#B23A2E] transition-colors" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isCouponApplied}
            placeholder="ENTER PROMO CODE"
            className="w-full bg-stone-50 border border-stone-100 rounded-lg pl-11 pr-24 py-3.5 text-[10px] font-bold tracking-[0.15em] focus:bg-white focus:ring-1 focus:ring-stone-200 outline-none transition-all"
          />
          {couponCode && !isCouponApplied && (
            <button
              onClick={handleApplyCoupon}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B23A2E] text-[10px] font-black hover:bg-[#B23A2E] hover:text-white px-4 py-2 rounded-md transition-all"
            >
              APPLY
            </button>
          )}
        </div>

        {/* Pricing Table */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-[11px] text-stone-500 font-medium tracking-tight uppercase">
            <span>Subtotal</span>
            <span>₹{(finalAmount + discount).toFixed(2)}</span>
          </div>
          {isCouponApplied && (
            <div className="flex justify-between text-[11px] text-green-600 font-bold tracking-tight uppercase">
              <span>Offer Applied</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-4 border-t border-stone-100">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-widest">Estimated Total</span>
            <span className="text-2xl font-light text-stone-900 tracking-tighter">
              ₹{finalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          to="/checkout"
          onClick={() => setOpenCartSheet(false)}
          className={`group flex items-center justify-between w-full px-8 py-5 rounded-full font-bold text-[11px] tracking-[0.25em] uppercase transition-all duration-500
            ${cartItems?.length === 0 && boxes?.length === 0
              ? "bg-stone-100 text-stone-300 cursor-not-allowed"
              : "bg-stone-900 text-white hover:bg-[#B23A2E] hover:shadow-[0_15px_30px_rgba(178,58,46,0.2)] active:scale-[0.98]"
            }`}
        >
          <span>Checkout Securely</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-stone-400">
           <ShieldCheck className="w-3.5 h-3.5" />
           <span className="text-[9px] font-bold tracking-widest uppercase">Safe & Encrypted Checkout</span>
        </div>
      </div>
    </SheetContent>
  );
}