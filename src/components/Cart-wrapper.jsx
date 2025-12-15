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
import rajmaImg from "./../assets/Rajma.png";

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
          (p) => p._id.toString() === item.productId?.toString()
        );
        if (!product) return bSum;

        const sizePriceObj = (product.customBoxPrices || []).find(
          (p) => p.size === item.size
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

  const getFreeGift = (total) => {
    if (total >= 5000) return { name: "Pahadi Rajma", quantity: 3 };
    if (total >= 3500) return { name: "Pahadi Rajma", quantity: 2 };
    if (total >= 2000) return { name: "Pahadi Rajma", quantity: 1 };
    return null;
  };

  const freeGift = getFreeGift(finalAmount);
  const handleAddToCart = (productId, totalStock, size, weight) => {
    if (!user?._id) {
      toast.error("Oops! You need to login first to add items to your cart.");
      return;
    }
    const existingItemIndex = (cartItems || []).findIndex(
      (item) =>
        item.productId?.toString() === productId?.toString() &&
        item.size === size &&
        item.weight === weight
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
      })
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
        })
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
    <SheetContent className="h-screen w-full sm:max-w-md shadow-lg rounded-l-lg flex flex-col">
      <SheetHeader className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-20">
        <SheetTitle className="text-2xl font-semibold text-gray-900">
          Your Cart ({(cartItems || []).length} item
          {(cartItems || []).length !== 1 ? "s" : ""})
        </SheetTitle>
      </SheetHeader>
      <div className="flex-grow space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-6 pt-4">
        {(cartItems || []).length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={`${item.productId}-${item.size}`}
              cartItem={item}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 italic mt-12">
            Your cart is empty.
          </p>
        )}
        {(boxes || []).length > 0 && (
          <>
            <h4 className="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
              Boxes Details
            </h4>
            {boxes.map((boxItem) => (
              <UserCartItemsContent
                key={`box-${boxItem.boxId}`}
                boxItem={boxItem}
                productList={productList}
              />
            ))}
          </>
        )}
        {freeGift && (
          <div className="flex items-center justify-between gap-4 bg-green-50 rounded-lg p-3 shadow-sm border border-green-200 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={rajmaImg}
                alt={freeGift.name}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
              <div>
                <p className="font-semibold text-green-700">
                  🎁 {freeGift.quantity}kg {freeGift.name}
                </p>
                <p className="text-sm text-green-600">Free Gift</p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            You might also like
          </h3>
          <div className="flex gap-4 overflow-x-auto px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {(productList || []).length > 0 ? (
              productList.map((item) => (
                <div key={item._id} className="flex-shrink-0 ">
                  <CartProducts
                    product={item}
                    handleAddToCart={handleAddToCart}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apply Coupon
          </label>
          <div className="flex gap-3 mt-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={isCouponApplied}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter coupon code"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={isCouponApplied || couponCode.trim() === ""}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md transition"
            >
              {isCouponApplied ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>

        {isCouponApplied && (
          <div className="flex justify-between items-center mb-4 text-green-700 font-semibold">
            <span>Discount</span>
            <span>- ₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-lg font-semibold text-gray-900">
            ₹{finalAmount.toFixed(2)}
          </span>
        </div>

        <Link
          to="/checkout"
          onClick={() => setOpenCartSheet(false)}
          className={`w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition-colors duration-200 ${
            cartItems?.length === 0 && boxes?.length === 0
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          Proceed to Checkout
        </Link>
      </div>
    </SheetContent>
  );
}
