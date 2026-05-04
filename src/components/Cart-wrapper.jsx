import { Link, useNavigate } from "react-router-dom";
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import UserCartItemsContent from "./Cart-Item-Content";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { applyCoupon, resetCoupon } from "@/store/slices/couponSlice";
import { X } from "lucide-react";
import CartSuggestions from "@/Pages/CartProducts";

export default function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productList = [] } = useSelector((state) => state.products) || {};
  // ✅ FIRST get user
  const { user } = useSelector((state) => state.auth) || {};

  // ✅ THEN cart
  const { cartItems: reduxCartItems = [], boxes = [] } =
    useSelector((state) => state.cart) || {};

  // ✅ guest cart
  const guestCartItems = (() => {
    try {
      return JSON.parse(localStorage.getItem("guestCart")) || [];
    } catch {
      return [];
    }
  })();

  // ✅ FINAL CART
  const cartItems = user?._id ? reduxCartItems : guestCartItems;
  const {
    message,
    discountAmount,
    finalAmount: couponFinal,
    success,
    code,
  } = useSelector((state) => state.coupon);
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
    // 1. Calculate the actual current total of everything in the cart
    const cartTotal = (cartItems || []).reduce((sum, item) => {
      const price =
        item.salesPrice && Number(item.salesPrice) > 0
          ? Number(item.salesPrice)
          : Number(item.price) || 0;

      const quantity = Number(item.quantity) || 1; // ✅ FIX

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

    // 2. APPLY THE DISCOUNT TO THE CURRENT TOTAL
    // This ensures that if the cart changes, the price stays correct
    if (discountAmount > 0) {
      setFinalAmount(Math.max(0, currentGrandTotal - discountAmount));
    } else {
      setFinalAmount(currentGrandTotal);
    }
  }, [cartItems, boxes, productList, discountAmount]);
  useEffect(() => {
    dispatch(resetCoupon()); // 🔥 clear old coupon
    setIsCouponApplied(false);
    setDiscount(0);
    setCouponCode("");
  }, []);
  // removed couponFinal from deps because we calculate it live now
  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode.trim().toUpperCase();

    if (!trimmedCode) {
      toast.error("Enter coupon code");
      return;
    }

    if (isCouponApplied) {
      toast.info("Coupon already applied");
      return;
    }

    try {
      const data = await dispatch(
        applyCoupon({
          code: trimmedCode,
          orderAmount: finalAmount,
          userId: user?._id,
        }),
      );

      if (data?.success) {
        setDiscount(Number(data.discountAmount) || 0);
        setIsCouponApplied(true);
        toast.success("Coupon applied");
      } else {
        toast.error(data?.message || "Invalid coupon");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const FREE_SHIPPING = 1000;

  const remaining = Math.max(0, FREE_SHIPPING - finalAmount);

  const progressPercent = Math.min((finalAmount / FREE_SHIPPING) * 100, 100);
  const suggestedProducts = productList.filter(
    (p) => !(cartItems || []).some((item) => item.productId === p._id),
  );
  return (
    <SheetContent
      side="right"
      className="h-full w-full sm:max-w-md flex flex-col bg-[#FCFAF7] p-0 border-none outline-none"
    >
      {/* ================= HEADER (Mobile Optimized) ================= */}
      <div className="px-5 py-5 bg-white border-b border-stone-100 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h2 className="text-lg font-black text-stone-900 tracking-tight uppercase">
            Your Basket
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-[#B23A2E]" />
            <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase">
              {(cartItems?.length || 0) + (boxes?.length || 0)}{" "}
              {(cartItems?.length || 0) + (boxes?.length || 0) === 1
                ? "Item"
                : "Items"}
            </p>
          </div>
        </div>
        <SheetClose className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-stone-50 transition-all duration-300 hover:bg-stone-900 hover:rotate-90 active:scale-90 border border-stone-100">
          <X className="h-4 w-4 text-stone-500 transition-colors group-hover:text-white" />
          <span className="sr-only">Close Basket</span>
        </SheetClose>
      </div>

      {/* ================= FREE SHIPPING BAR ================= */}
      <div className="bg-[#f7f5ef] px-5 py-4 border-b border-stone-200">
        {/* TITLE */}
        <p className="text-[11px] font-black uppercase tracking-widest text-stone-700 mb-2">
          Express Shipping
        </p>

        {/* MESSAGE */}
        <p className="text-[12px] text-stone-600 mb-3">
          {remaining > 0 ? (
            <>
              You are{" "}
              <span className="font-bold text-[#B23A2E]">₹{remaining}</span>{" "}
              away from free shipping 🚚
            </>
          ) : (
            <span className="font-bold text-green-600">
              🎉 Free Shipping Unlocked
            </span>
          )}
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#B23A2E] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />

          {/* OPTIONAL TRUCK */}
          <div
            className="absolute -top-2 text-xs transition-all duration-500"
            style={{
              left: `${progressPercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            🚚
          </div>
        </div>

        {/* LABELS */}
        <div className="flex justify-between text-[10px] text-stone-400 mt-2">
          <span>₹0</span>
          <span>₹{FREE_SHIPPING}</span>
        </div>
      </div>

      {/* ================= SCROLLABLE BODY ================= */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-32">
        <div className="px-5 py-6 space-y-10">
          {/* ITEMS LIST */}
          {(cartItems || []).length > 0 || (boxes || []).length > 0 ? (
            <div className="space-y-8">
              {/* Regular Products */}
              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="animate-in fade-in slide-in-from-right-4 duration-300"
                >
                  <UserCartItemsContent cartItem={item} mobile />
                </div>
              ))}

              {/* Custom Boxes */}
              {(boxes || []).length > 0 && (
                <div className="pt-8 border-t border-stone-200/60">
                  <h4 className="text-[10px] font-black text-[#B23A2E] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                    Gift Boxes <span className="h-px flex-1 bg-stone-100" />
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                🧺
              </div>
              <p className="text-stone-400 font-serif italic">
                Your basket is waiting to be filled.
              </p>
              <SheetClose asChild>
                <Link to="/viewproducts">
                  <button className="mt-4 text-[#B23A2E] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#B23A2E] pb-0.5">
                    Explore Collection
                  </button>
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </div>
      <CartSuggestions
        products={suggestedProducts}
        handleAddToCart={(id, stock, size, weight) => {
          dispatch(addToCart({ productId: id, quantity: 1, size, weight }));
        }}
        setOpenCartSheet={setOpenCartSheet}
      />
      {/* ================= FIXED BOTTOM ACTION BAR (Native App Feel) ================= */}
      <div className="mt-auto bg-white border-t border-stone-100 px-5 pt-5 pb-[env(safe-area-inset-bottom,20px)] shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        {/* PROMO SECTION */}
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={isCouponApplied}
              placeholder="PROMO CODE"
              className="w-full bg-stone-50 border-stone-100 rounded-xl px-4 py-3 text-[10px] font-bold tracking-widest focus:bg-white focus:ring-1 focus:ring-stone-200 transition-all uppercase"
            />
            {couponCode && !isCouponApplied && (
              <button
                onClick={handleApplyCoupon}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B23A2E] text-[10px] font-black px-3 py-1.5"
              >
                APPLY
              </button>
            )}
          </div>
        </div>

        {/* PRICING TABLE */}
        <div className="space-y-2 mb-10 px-1">
          {isCouponApplied && (
            <div className="flex justify-between text-[10px] font-bold text-green-600 uppercase tracking-tight">
              <span>Seasonal Discount Applied</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">
                Total Amount
              </span>
              <p className="text-2xl font-black text-stone-900 leading-none mt-1">
                ₹{finalAmount.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-stone-300 font-medium italic">
                Incl. all mountain taxes
              </p>
            </div>
          </div>
        </div>

        {/* CTA BUTTON */}
        <Link
          to="/checkout"
          onClick={() => setOpenCartSheet(false)}
          className={`flex items-center justify-center w-full py-4 mb-4 rounded-xl font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300
        ${
          cartItems?.length === 0 && boxes?.length === 0
            ? "bg-stone-100 text-stone-300"
            : "bg-stone-900 text-white active:scale-95 shadow-lg shadow-stone-200"
        }`}
        >
          Proceed to Checkout
        </Link>
      </div>
    </SheetContent>
  );
}
