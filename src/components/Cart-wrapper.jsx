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
  className="
    h-screen
    w-full sm:max-w-md
    ml-auto
    flex flex-col
    bg-gray-100
    overflow-hidden
  "
>
  {/* ================= DRAG INDICATOR ================= */}
  <div className="sm:hidden flex justify-center py-2">
    <div className="w-10 h-1 bg-gray-300 rounded-full" />
  </div>

  {/* ================= HEADER ================= */}
  <SheetHeader className="px-4 py-3 bg-white border-b sticky top-0 z-20">
    <SheetTitle className="text-base font-semibold text-gray-900">
      Your Cart ({cartItems?.length || 0})
    </SheetTitle>
  </SheetHeader>

  {/* ================= CART BODY ================= */}
  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-36">
    {(cartItems || []).length > 0 ? (
      cartItems.map((item) => (
        <UserCartItemsContent
          key={`${item.productId}-${item.size}`}
          cartItem={item}
          mobile
        />
      ))
    ) : (
      <p className="text-center text-gray-500 mt-20">
        Your cart is empty
      </p>
    )}

    {(boxes || []).length > 0 && (
      <div>
        <h4 className="text-xs font-semibold text-gray-600 mb-2">
          Boxes
        </h4>
        <div className="space-y-3">
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

    {/* RECOMMENDATIONS */}
    <div>
      <h3 className="text-xs font-semibold text-gray-600 mb-3">
        You might also like
      </h3>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2">
        {(productList || []).map((item) => (
          <div key={item._id} className="min-w-[130px]">
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

  {/* ================= BOTTOM CHECKOUT BAR ================= */}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
    <div className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      {/* COUPON */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={isCouponApplied}
          placeholder="Coupon code"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />

        <Button
          onClick={handleApplyCoupon}
          disabled={isCouponApplied || couponCode.trim() === ""}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-500"
        >
          {isCouponApplied ? "Applied" : "Apply"}
        </Button>
      </div>

      {isCouponApplied && (
        <div className="flex justify-between text-green-600 text-xs font-semibold mb-2">
          <span>Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}

      {/* TOTAL + CHECKOUT */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{finalAmount.toFixed(2)}
          </p>
        </div>

        <Link
          to="/checkout"
          onClick={() => setOpenCartSheet(false)}
          className={`flex-1 text-center py-3 rounded-full font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-purple-500
            ${
              cartItems?.length === 0 && boxes?.length === 0
                ? "opacity-50 pointer-events-none"
                : "active:scale-[0.98]"
            }`}
        >
          Checkout
        </Link>
      </div>
    </div>
  </div>
</SheetContent>
  );
}
