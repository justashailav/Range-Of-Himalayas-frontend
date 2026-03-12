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
  className="h-screen w-full sm:max-w-md ml-auto flex flex-col bg-[#FAF9F6] p-0 border-l border-stone-200 outline-none"
>
  {/* ================= HEADER ================= */}
  <div className="px-6 py-6 bg-white border-b border-stone-100 flex items-center justify-between">
    <div>
      <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase">Your Basket</h2>
      <p className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase mt-1">
        {cartItems?.length + (boxes?.length || 0)} Items Selected
      </p>
    </div>
    {/* Close button is handled by Sheet primitive, but you can style the header here */}
  </div>

  {/* ================= CART BODY ================= */}
  <div className="flex-1 overflow-y-auto no-scrollbar">
    <div className="px-6 py-8 space-y-8">
      
      {/* STANDARD ITEMS */}
      {(cartItems || []).length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <UserCartItemsContent
              key={`${item.productId}-${item.size}`}
              cartItem={item}
              mobile
            />
          ))}
        </div>
      ) : boxes?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-stone-400 font-serif italic text-lg">Your basket is empty...</p>
          <button 
            onClick={() => setOpenCartSheet(false)}
            className="mt-4 text-[#B23A2E] text-xs font-bold tracking-widest uppercase underline underline-offset-4"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* CUSTOM BOXES */}
      {(boxes || []).length > 0 && (
        <div className="pt-6 border-t border-stone-100">
          <h4 className="text-[10px] font-black text-[#B23A2E] tracking-[0.3em] uppercase mb-6">Custom Gift Boxes</h4>
          <div className="space-y-6">
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

      {/* RECOMMENDATIONS - Refined Horizontal Scroll */}
      <div className="mt-12 pt-12 border-t border-stone-100">
        <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest mb-6 px-2">
          Himalayan Essentials
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar">
          {(productList || []).slice(0, 5).map((item) => (
            <div key={item._id} className="snap-start min-w-[160px] bg-white p-3 rounded-2xl border border-stone-50 shadow-sm">
              <CartProducts
                product={item}
                handleAddToCart={handleAddToCart}
                compact
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* ================= BOTTOM CHECKOUT BAR ================= */}
  <div className="bg-white border-t border-stone-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
    
    {/* COUPON SECTION - Clean & Minimal */}
    <div className="relative flex items-center mb-6 group">
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        disabled={isCouponApplied}
        placeholder="ENTER PROMO CODE"
        className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-[11px] font-bold tracking-widest placeholder:text-stone-300 focus:ring-1 focus:ring-stone-200 transition-all uppercase"
      />
      <button
        onClick={handleApplyCoupon}
        disabled={isCouponApplied || couponCode.trim() === ""}
        className={`absolute right-2 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all
          ${isCouponApplied ? "text-green-600 bg-green-50" : "text-stone-900 bg-white shadow-sm hover:bg-stone-900 hover:text-white"}`}
      >
        {isCouponApplied ? "Applied" : "Apply"}
      </button>
    </div>

    {/* PRICING LOGIC */}
    <div className="space-y-3 mb-8">
      <div className="flex justify-between text-xs font-medium text-stone-400 uppercase tracking-widest">
        <span>Subtotal</span>
        <span>₹{(finalAmount + discount).toFixed(2)}</span>
      </div>
      
      {isCouponApplied && (
        <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
          <span>Seasonal Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between items-end pt-2 border-t border-stone-50">
        <div>
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">Estimated Total</p>
          <p className="text-2xl font-black text-stone-900 tracking-tighter">
            ₹{finalAmount.toFixed(2)}
          </p>
        </div>
        <p className="text-[9px] text-stone-300 font-medium italic mb-1">Taxes calculated at checkout</p>
      </div>
    </div>

    {/* ACTION BUTTON */}
    <Link
      to="/checkout"
      onClick={() => setOpenCartSheet(false)}
      className={`group relative flex items-center justify-center w-full py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase overflow-hidden transition-all duration-500
        ${cartItems?.length === 0 && boxes?.length === 0
          ? "bg-stone-100 text-stone-300 pointer-events-none"
          : "bg-stone-900 text-white hover:bg-[#B23A2E] hover:shadow-[0_20px_40px_rgba(178,58,46,0.3)] active:scale-95"
        }`}
    >
      <span className="relative z-10">Proceed to Checkout</span>
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </Link>
  </div>
</SheetContent>
  );
}
