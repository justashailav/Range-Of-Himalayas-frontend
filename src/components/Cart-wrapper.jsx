import { Link, useNavigate } from "react-router-dom";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import UserCartItemsContent from "./Cart-Item-Content";
import { useDispatch, useSelector } from "react-redux";
import CartProducts from "@/Pages/CartProducts";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { applyCoupon } from "@/store/slices/couponSlice";

export default function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems = [], boxes = [] } =
    useSelector((state) => state.cart) || {};
  const { productList = [] } = useSelector((state) => state.products) || {};
  const { user } = useSelector((state) => state.auth) || {};
  const {
    message,
    discountAmount,
    finalAmount: couponFinal,
    success,
  } = useSelector((state) => state.coupon);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    const cartTotal = (cartItems || []).reduce((sum, item) => {
      const price =
        item.salesPrice && Number(item.salesPrice) > 0
          ? Number(item.salesPrice)
          : Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
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
        const price = sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0;
        const quantity = Number(item.quantity) || 1;

        return bSum + price * quantity;
      }, 0);
      return sum + boxItemsTotal;
    }, 0);

    setFinalAmount(cartTotal + boxesTotal);
    setCouponCode("");
    setDiscount(0);
    setIsCouponApplied(false);
  }, [cartItems, boxes, productList]);

  const handleAddToCart = (productId, totalStock, size, weight) => {
    if (!user?._id) {
      toast.error("Oops! You need to login first to add items to your cart.");
      return;
    }
    const existingItemIndex = (cartItems || []).findIndex(
      (item) =>
        item.productId?.toString() === productId?.toString() &&
        item.size === size &&
        item.weight === weight,
    );

    if (existingItemIndex > -1) {
      const currentQuantity = cartItems[existingItemIndex]?.quantity || 0;
      if (currentQuantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} items available for this variant`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?._id,
        productId,
        quantity: 1,
        size,
        weight,
      }),
    )
      .then((data) => {
        if (data?.success) {
          dispatch(fetchCartItems(user?._id));
          toast.success("Product added to cart");
          setOpenCartSheet(true);
        } else {
          toast.error(data?.message || "Failed to add item");
        }
      })
      .catch((err) => {
        console.error("AddToCart error:", err);
        toast.error(err?.message || "Failed to add item");
      });
  };
  const handleApplyCoupon = async () => {
    const trimmedCode = couponCode.trim().toUpperCase();
    if (!user?._id) {
      toast.error("Please log in to apply a coupon");
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
        setFinalAmount(Number(data.finalPrice) || finalAmount);
        setIsCouponApplied(true);
      } else {
        toast.error(data?.message || "Invalid coupon");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (message) toast.info(message);
  }, [message]);

  return (
    <SheetContent
  side="right"
  className="h-full w-full sm:max-w-md flex flex-col bg-[#FCFAF7] p-0 border-none outline-none"
>
  {/* ================= HEADER (Mobile Optimized) ================= */}
  <div className="px-5 py-5 bg-white border-b border-stone-100 flex items-center justify-between sticky top-0 z-30">
    <div>
      <h2 className="text-lg font-black text-stone-900 tracking-tight uppercase">Your Basket</h2>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="w-1 h-1 rounded-full bg-[#B23A2E]" />
        <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase">
          {cartItems?.length + (boxes?.length || 0)} Items
        </p>
      </div>
    </div>
    {/* Optional: Add a custom close button here if the default Sheet close is too small */}
  </div>

  {/* ================= SCROLLABLE BODY ================= */}
  <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-32">
    <div className="px-5 py-6 space-y-10">
      
      {/* ITEMS LIST */}
      {(cartItems || []).length > 0 || (boxes || []).length > 0 ? (
        <div className="space-y-8">
          {/* Regular Products */}
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="animate-in fade-in slide-in-from-right-4 duration-300">
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
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-2xl">🧺</div>
          <p className="text-stone-400 font-serif italic">Your basket is waiting to be filled.</p>
          <SheetClose asChild>
            <button className="mt-4 text-[#B23A2E] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#B23A2E] pb-0.5">
              Explore Collection
            </button>
          </SheetClose>
        </div>
      )}

      {/* MOBILE RECOMMENDATIONS (Compact & Swipable) */}
      <div className="mt-12 pt-8 border-t border-stone-200/60">
        <h3 className="text-[10px] font-black text-stone-900 uppercase tracking-widest mb-5">
          Pairs well with
        </h3>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5">
          {(productList || []).slice(0, 5).map((item) => (
            <div key={item._id} className="snap-start min-w-[140px] max-w-[140px]">
              <div className="bg-white p-2.5 rounded-2xl border border-stone-100 shadow-sm">
                 <CartProducts product={item} handleAddToCart={handleAddToCart} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

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
    <div className="space-y-2 mb-6 px-1">
      {isCouponApplied && (
        <div className="flex justify-between text-[10px] font-bold text-green-600 uppercase tracking-tight">
          <span>Seasonal Discount Applied</span>
          <span>-₹{discount}</span>
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Total Amount</span>
          <p className="text-2xl font-black text-stone-900 leading-none mt-1">
            ₹{finalAmount.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
           <p className="text-[9px] text-stone-300 font-medium italic">Incl. all mountain taxes</p>
        </div>
      </div>
    </div>

    {/* CTA BUTTON */}
    <Link
      to="/checkout"
      onClick={() => setOpenCartSheet(false)}
      className={`flex items-center justify-center w-full py-4 mb-4 rounded-xl font-black text-[11px] tracking-[0.2em] uppercase transition-all duration-300
        ${cartItems?.length === 0 && boxes?.length === 0
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
