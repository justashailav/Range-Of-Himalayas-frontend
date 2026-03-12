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
      <div className="group relative flex items-start gap-4 p-4 bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-500">
  
  {/* Product Image - Fixed Aspect Ratio */}
  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-stone-50 border border-stone-100">
    <img
      src={image}
      alt={title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>

  {/* Product Info */}
  <div className="flex flex-1 flex-col h-full min-h-[96px]">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-black text-stone-900 leading-tight uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mt-1">
          {cartItem.size && <span>{cartItem.size}  •  </span>}
          <span>{cartItem.weight}</span>
        </p>
      </div>
      
      {/* Price - Top Right for better scanability */}
      <p className="text-sm font-black text-stone-900 tracking-tighter">
        ₹{(displayPrice * cartItem.quantity).toFixed(0)}
      </p>
    </div>

    {/* Bottom Row: Controls & Delete */}
    <div className="flex items-center justify-between mt-auto pt-4">
      
      {/* Refined Quantity Controls */}
      <div className="flex items-center bg-stone-50 rounded-full p-1 border border-stone-100">
        <button
          onClick={() => handleUpdateQuantity(cartItem, "minus")}
          disabled={cartItem?.quantity === 1}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-white shadow-sm disabled:opacity-30 active:scale-90 transition-all"
        >
          <Minus className="w-3 h-3 text-stone-600" />
        </button>
        
        <span className="w-8 text-center text-xs font-black text-stone-900">
          {cartItem?.quantity}
        </span>
        
        <button
          onClick={() => handleUpdateQuantity(cartItem, "plus")}
          className="h-7 w-7 flex items-center justify-center rounded-full bg-white shadow-sm active:scale-90 transition-all"
        >
          <Plus className="w-3 h-3 text-stone-600" />
        </button>
      </div>

      {/* Delete - Minimalist Trash */}
      <button 
        onClick={() => handleCartItemDelete(cartItem)}
        className="p-2 text-stone-300 hover:text-[#B23A2E] hover:bg-red-50 rounded-full transition-all duration-300"
      >
        <Trash size={16} />
      </button>
    </div>
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
