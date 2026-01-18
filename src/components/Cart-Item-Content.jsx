import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCart,
} from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function UserCartItemsContent({ cartItem, boxItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const { cartItems = [], boxes = [] } = useSelector((state) => state.cart);
  const { productList = [] } = useSelector((state) => state.products);
  console.log(cartItems);
  console.log(productList);
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCartItems(user._id));
    }
  }, [user, dispatch]);

  const handleUpdateQuantity = (item, action) => {
    if (!item) return;

    const normalizedSize = item.size || "";

    const index = cartItems.findIndex((i) => {
      const cartProductId =
        i.productId?._id?.toString() || i.productId?.toString();

      return (
        cartProductId === item.productId.toString() &&
        (i.size || "") === normalizedSize &&
        i.weight === item.weight
      );
    });

    if (index === -1) return;

    const productFromList = productList.find(
      (p) => p._id.toString() === item.productId.toString()
    );
    if (!productFromList) return;

    const variant = productFromList.variants?.find(
      (v) => (v.size || "") === normalizedSize && v.weight === item.weight
    );

    const totalStock = variant?.stock ?? 0;
    const currentQuantity = cartItems[index].quantity;
    const newQuantity =
      action === "plus" ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity <= 0) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    if (action === "plus" && newQuantity > totalStock) {
      toast.error(`Only ${totalStock} items in stock.`);
      return;
    }

    dispatch(
      updateCart({
        userId: user._id,
        productId: item.productId,
        quantity: newQuantity,
        size: normalizedSize,
        weight: item.weight,
      })
    );
  };

  const handleCartItemDelete = (item) => {
    if (!item) return;

    const normalizedSize = item.size || "";

    dispatch(
      deleteCartItem({
        userId: user._id,
        productId: item.productId,
        size: normalizedSize,
        weight: item.weight,
      })
    ).then((res) => {
      if (res?.success) {
        toast.success("Item removed from cart");
        dispatch(fetchCartItems(user._id)); // 🔥 VERY IMPORTANT
      } else {
        toast.error("Failed to remove item");
      }
    });
  };

  if (cartItem) {
    const product = productList.find((p) => p._id === cartItem.productId) || {};
    const variant =
      product.variants?.find(
        (v) => v.size === cartItem.size && v.weight === cartItem.weight
      ) || {};
    const image = product?.image || cartItem?.image || "/placeholder.png";
    const title = product?.title || cartItem?.title || "Unnamed Product";
    const price = variant?.price ?? 0;
    const salePrice = variant?.salesPrice ?? 0;
    const displayPrice = salePrice > 0 ? salePrice : price;

    return (
      /* ---------------- NORMAL CART ITEM ---------------- */
<div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200">

  {/* Product Image */}
  <img
    src={image}
    alt={title}
    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-200"
  />

  {/* Product Info */}
  <div className="flex-1">
    <h3 className="text-base font-semibold text-gray-900">
      {title}
    </h3>

    <p className="text-sm text-gray-600 mt-1">
      {cartItem.size && (
        <>
          Size: <span className="font-medium">{cartItem.size}</span> ·{" "}
        </>
      )}
      Weight: <span className="font-medium">{cartItem.weight}</span>
    </p>

    {/* Quantity Controls */}
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={() => handleUpdateQuantity(cartItem, "minus")}
        disabled={cartItem.quantity === 1}
        className="h-8 w-8 rounded-full border border-gray-300
                   text-gray-700 hover:border-gray-400
                   disabled:opacity-40"
      >
        −
      </button>

      <span className="font-semibold text-gray-900">
        {cartItem.quantity}
      </span>

      <button
        onClick={() => handleUpdateQuantity(cartItem, "plus")}
        className="h-8 w-8 rounded-full border border-gray-300
                   text-gray-700 hover:border-gray-400"
      >
        +
      </button>
    </div>
  </div>

  {/* Price + Remove */}
  <div className="flex sm:flex-col items-end justify-between gap-2">
    <p className="text-lg font-bold text-gray-900">
      ₹{(displayPrice * cartItem.quantity).toFixed(2)}
    </p>

    <button
      onClick={() => handleCartItemDelete(cartItem)}
      className="text-xs text-gray-400 hover:text-red-500 transition"
    >
      Remove
    </button>
  </div>
</div>

    );
  }

  if (boxItem) {
    const { boxName, items = [], message } = boxItem;

    const totalPrice = items.reduce((sum, item) => {
      const product = productList.find((p) => p._id === item.productId) || {};
      const sizePriceObj = (product.customBoxPrices || []).find(
        (p) => p.size === item.size
      );
      const price = sizePriceObj ? Number(sizePriceObj.pricePerPiece) : 0;
      return sum + price * (Number(item.quantity) || 1);
    }, 0);

    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-5 mb-6">

  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-bold text-gray-900">
      {boxName}
    </h3>
    <p className="text-lg font-bold text-gray-900">
      ₹{totalPrice.toFixed(2)}
    </p>
  </div>

  {/* Message */}
  {message && (
    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
      {message}
    </div>
  )}

  {/* Items */}
  <div className="space-y-3">
    {items.length > 0 ? (
      items.map((item, idx) => {
        const product =
          productList.find((p) => p._id === item.productId) || {};
        const sizePriceObj = (product.customBoxPrices || []).find(
          (p) => p.size === item.size
        );
        const itemPrice = sizePriceObj
          ? Number(sizePriceObj.pricePerPiece)
          : 0;

        return (
          <div
            key={item._id || `${item.productId}-${idx}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.title ?? "Unknown Product"}
                className="w-14 h-14 rounded-md object-cover border"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {product.title ?? "Unknown Product"}
                </p>
                <p className="text-xs text-gray-600">
                  Size: {item.size} · Qty: {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-semibold text-gray-900">
              ₹{(itemPrice * item.quantity).toFixed(2)}
            </p>
          </div>
        );
      })
    ) : (
      <p className="text-sm text-gray-500 text-center">
        No items in this box.
      </p>
    )}
  </div>
</div>

    );
  }

  return null;
}
