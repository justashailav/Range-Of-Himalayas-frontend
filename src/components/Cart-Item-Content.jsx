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
  console.log(user)
  const { cartItems = [], boxes = [] } = useSelector((state) => state.cart);
  const { productList = [] } = useSelector((state) => state.products);
  console.log(cartItems)
  console.log(productList)
 useEffect(() => {
  if (user && user._id) {
    dispatch(fetchCartItems(user._id));
  }
}, [user, dispatch]);  

  const handleUpdateQuantity = (item, action) => {
    if (!item) return;

    const index = cartItems.findIndex((i) => {
      const cartProductId = i.productId?._id
        ? i.productId._id.toString()
        : i.productId?.toString();

      return (
        cartProductId === item.productId &&
        i.size === item.size &&
        i.weight === item.weight
      );
    });

    if (index === -1) return;

    const productFromList = productList.find(
      (p) => p._id.toString() === item.productId.toString()
    );
    if (!productFromList) return;

    const variant = productFromList.variants?.find(
      (v) => v.size === item.size && v.weight === item.weight
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
        userId: user?._id,
        productId: productFromList._id.toString(),
        quantity: newQuantity,
        size: item.size,
        weight: item.weight,
      })
    ).then((data) => {
      if (data?.success) toast.success("Cart updated successfully");
      else toast.error(data?.message || "Failed to update cart");
    });
  };

  const handleCartItemDelete = (item) => {
    if (!item) return;
    dispatch(
      deleteCartItem({
        userId: user?._id,
        productId: item.productId,
        size: item.size,
        weight: item.weight,
      })
    ).then((data) => {
      if (data?.success) toast.success("Item removed from cart");
      else toast.error("Failed to remove item");
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
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-gray-300 p-3 sm:p-4 bg-white rounded-md shadow-sm hover:shadow-md transition duration-200">
        {/* Product Image */}
        <img
          src={image}
          alt={title}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-md object-cover border border-gray-200"
        />

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Size:{" "}
              <span className="font-medium text-gray-800">{cartItem.size}</span>{" "}
              | Weight:{" "}
              <span className="font-medium text-gray-800">
                {cartItem.weight}
              </span>
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mt-3">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
              disabled={cartItem?.quantity === 1}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            </Button>
            <span className="font-semibold text-sm sm:text-base text-gray-800">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Price + Delete */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 w-full sm:w-auto mt-3 sm:mt-0">
          <p className="text-base sm:text-lg font-bold text-gray-900">
            ₹{(displayPrice * cartItem.quantity).toFixed(2)}
          </p>
          <Trash
            onClick={() => handleCartItemDelete(cartItem)}
            className="cursor-pointer text-red-500 hover:text-red-600 transition duration-200"
            size={20}
            title="Remove item"
          />
        </div>
      </div>
    );
  }

  /** ===============================
   *  RENDER: BOX ITEM
   *  =============================== */
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
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 transition hover:scale-[1.01] duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-3 sm:p-4 mb-4 text-white flex flex-col sm:flex-row justify-between items-center gap-2 shadow-md">
          <h3 className="text-lg sm:text-xl font-bold">{boxName}</h3>
          <p className="text-base sm:text-lg font-semibold">
            ₹{totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Message */}
        {message && (
          <p className="mb-4 px-3 py-2 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100 text-xs sm:text-sm">
            {message}
          </p>
        )}

        {/* Items */}
        <div className="space-y-3 sm:space-y-4">
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
              const image = product.image || "/placeholder.png";

              return (
                <div
                  key={item._id || `${item.productId}-${idx}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img
                      src={image}
                      alt={product.title ?? "Unknown Product"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {product.title ?? "Unknown Product"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Size: <span className="font-medium">{item.size}</span> |
                        Qty:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-green-700 font-bold text-sm sm:text-lg">
                    ₹{(itemPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 italic text-center text-sm">
              No items in this box.
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
