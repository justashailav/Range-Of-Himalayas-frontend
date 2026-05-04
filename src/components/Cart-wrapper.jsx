import { Link, useNavigate } from "react-router-dom";
import { SheetClose, SheetContent } from "./ui/sheet";
import UserCartItemsContent from "./Cart-Item-Content";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { applyCoupon, resetCoupon } from "@/store/slices/couponSlice";
import {
  X,
  ShoppingBag,
  Truck,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import CartSuggestions from "@/Pages/CartProducts";

export default function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [guestCartTrigger, setGuestCartTrigger] = useState(0);
  const { productList = [] } = useSelector((state) => state.products) || {};
  const { user } = useSelector((state) => state.auth) || {};
  const { cartItems: reduxCartItems = [], boxes = [] } =
    useSelector((state) => state.cart) || {};

  const guestCartItems = (() => {
    try {
      return JSON.parse(localStorage.getItem("guestCart")) || [];
    } catch {
      return [];
    }
  })();

  const cartItems = user?._id
  ? reduxCartItems
  : JSON.parse(localStorage.getItem("guestCart")) || [];
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
      let price = 0;

      // ✅ Logged-in user (price already exists)
      if (item.price || item.salesPrice) {
        price =
          item.salesPrice && Number(item.salesPrice) > 0
            ? Number(item.salesPrice)
            : Number(item.price) || 0;
      }
      // ✅ Guest user (get price from productList)
      else {
        const product = productList.find(
          (p) => p._id.toString() === item.productId?.toString(),
        );

        if (product) {
          const variant = (product.variants || []).find(
            (v) =>
              v.weight === item.weight && (v.size === item.size || !v.size),
          );

          if (variant) {
            price =
              variant.salesPrice && Number(variant.salesPrice) > 0
                ? Number(variant.salesPrice)
                : Number(variant.price) || 0;
          }
        }
      }

      const quantity = Number(item.quantity) || 1;

      return sum + price * quantity;
    }, 0);

    const boxesTotal = (boxes || []).reduce((sum, box) => {
      const boxItemsTotal = (box.items || []).reduce((bSum, item) => {
        const product = productList.find(
          (p) => p._id.toString() === item.productId?.toString(),
        );
        if (!product) return bSum;
        const sizePriceObj = (product.customBoxPrices || []).find(
          (p) => p.size === item.size,
        );
        return (
          bSum +
          (sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0) *
            (Number(item.quantity) || 1)
        );
      }, 0);
      return sum + boxItemsTotal;
    }, 0);

    const currentGrandTotal = cartTotal + boxesTotal;
    setFinalAmount(
      discountAmount > 0
        ? Math.max(0, currentGrandTotal - discountAmount)
        : currentGrandTotal,
    );
  }, [cartItems, boxes, productList, discountAmount]);

  useEffect(() => {
    dispatch(resetCoupon());
  }, []);

  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode.trim().toUpperCase();
    if (!trimmedCode) return toast.error("Enter coupon code");

    const data = await dispatch(
      applyCoupon({
        code: trimmedCode,
        orderAmount: finalAmount,
        userId: user?._id,
      }),
    );
    if (data?.success) toast.success("Elite discount applied");
  };

  const FREE_SHIPPING = 1000;
  const remaining = Math.max(0, FREE_SHIPPING - finalAmount);
  const progressPercent = Math.min((finalAmount / FREE_SHIPPING) * 100, 100);

  const suggestedProducts = productList
    .filter((p) => !(cartItems || []).some((item) => item.productId === p._id))
    .slice(0, 8);
  useEffect(() => {
  const handleGuestUpdate = () => {
    setGuestCartTrigger((prev) => prev + 1);
  };

  window.addEventListener("guestCartUpdated", handleGuestUpdate);

  return () =>
    window.removeEventListener("guestCartUpdated", handleGuestUpdate);
}, []);
  return (
    <SheetContent
      side="right"
      className="h-screen w-full sm:max-w-[440px] flex flex-col bg-[#F9F8F6] p-0 border-l border-stone-200 outline-none shadow-2xl"
    >
      {/* --- FIXED HEADER --- */}
      <div className="flex-shrink-0 px-8 py-6 bg-white/90 backdrop-blur-md border-b border-stone-100 flex items-center justify-between z-50">
        <div>
          <h2 className="text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase mb-1">
            Shopping Bag
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif italic text-stone-900 leading-none">
              Your Selection
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
              {(cartItems?.length || 0) + (boxes?.length || 0)}
            </span>
          </div>
        </div>
        <SheetClose className="h-10 w-10 flex items-center justify-center rounded-full border border-stone-100 hover:bg-stone-900 hover:text-white transition-all duration-500">
          <X className="h-4 w-4" />
        </SheetClose>
      </div>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto premium-scrollbar scroll-smooth pr-2">
        {/* Free Shipping Tracker - Sticks to top of scroll area */}
        <div className="sticky top-0 z-10 px-8 py-5 bg-white border-b border-stone-50">
          <div className="flex justify-between items-end mb-3">
            <div className="flex items-center gap-2 text-[#B23A2E]">
              <Truck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest uppercase">
                {remaining > 0 ? "Standard Delivery" : "Complimentary Shipping"}
              </span>
            </div>
            {remaining > 0 && (
              <span className="text-[10px] font-medium text-stone-400 italic">
                ₹{remaining} to unlock free shipping
              </span>
            )}
          </div>
          <div className="h-[2px] w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B23A2E] transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="px-8 py-8">
          {(cartItems?.length || 0) > 0 || (boxes?.length || 0) > 0 ? (
            <div className="space-y-12">
              <div className="space-y-8">
                {cartItems.map((item) => (
                  <UserCartItemsContent
                    key={`${item.productId}-${item.size}`}
                    cartItem={item}
                    mobile
                  />
                ))}
              </div>

              {boxes?.length > 0 && (
                <div className="pt-10 border-t border-stone-200/40">
                  <h4 className="text-[9px] font-black text-stone-300 tracking-[0.4em] uppercase mb-10">
                    Bespoke Gift Boxes
                  </h4>
                  <div className="space-y-8">
                    {boxes.map((boxItem) => (
                      <UserCartItemsContent
                        key={`box-${boxItem.boxId}`}
                        boxItem={boxItem}
                        productList={productList}
                        mobile
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-10 h-10 text-stone-200 mb-6 stroke-[1px]" />
              <p className="text-stone-400 font-serif italic text-lg">
                Your bag is empty
              </p>
              <SheetClose asChild>
                <Link
                  to="/viewproducts"
                  className="mt-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[#B23A2E] border-b border-[#B23A2E]/30 pb-1 hover:border-[#B23A2E] transition-all"
                >
                  Browse Collection
                </Link>
              </SheetClose>
            </div>
          )}
        </div>

        {/* Upsell / Recommendations Section */}
        <div className="mt-4 border-t border-stone-100">
          <CartSuggestions
            products={suggestedProducts}
            handleAddToCart={(id, stock, size, weight) => {
              dispatch(addToCart({ productId: id, quantity: 1, size, weight }));
            }}
            setOpenCartSheet={setOpenCartSheet}
          />
        </div>
      </div>

      {/* --- FIXED FOOTER --- */}
      <div className="flex-shrink-0 bg-white px-8 pt-6 pb-10 border-t border-stone-100 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
        {/* Promo Input */}
        <div className="relative mb-6 group">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 group-focus-within:text-[#B23A2E] transition-colors" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isCouponApplied}
            placeholder="PROMO CODE"
            className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-11 pr-24 py-3.5 text-[10px] font-bold tracking-[0.2em] focus:bg-white focus:ring-1 focus:ring-stone-200 outline-none transition-all placeholder:text-stone-300"
          />
          {couponCode && !isCouponApplied && (
            <button
              onClick={handleApplyCoupon}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B23A2E] text-[10px] font-black hover:bg-[#B23A2E] hover:text-white px-4 py-2 rounded-lg transition-all"
            >
              APPLY
            </button>
          )}
        </div>

        {/* Pricing Table */}
        <div className="space-y-3 mb-8 px-1">
          <div className="flex justify-between text-[11px] text-stone-400 font-medium tracking-tight uppercase">
            <span>Subtotal</span>
            <span className="text-stone-600">
              ₹{(finalAmount + discount).toFixed(2)}
            </span>
          </div>
          {isCouponApplied && (
            <div className="flex justify-between text-[11px] text-green-600 font-bold tracking-tight uppercase">
              <span>Offer Applied</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-4">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-widest">
              Total Amount
            </span>
            <span className="text-2xl font-light text-stone-900 tracking-tighter leading-none">
              ₹{finalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout CTA */}
        <Link
          to="/checkout"
          onClick={() => setOpenCartSheet(false)}
          className={`group flex items-center justify-between w-full px-8 py-5 rounded-full font-bold text-[11px] tracking-[0.25em] uppercase transition-all duration-700
            ${
              cartItems?.length === 0 && boxes?.length === 0
                ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                : "bg-stone-900 text-white hover:bg-[#B23A2E] hover:shadow-[0_20px_40px_rgba(178,58,46,0.25)] active:scale-[0.98]"
            }`}
        >
          <span>Complete Purchase</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
        </Link>

        <div className="flex items-center justify-center gap-2 mt-5 text-stone-300">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase">
            Safe & Secure Himalayan Logistics
          </span>
        </div>
      </div>
    </SheetContent>
  );
}
