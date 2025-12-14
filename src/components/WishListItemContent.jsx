import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Tag } from "lucide-react";

import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { deleteWishListItem } from "@/store/slices/wishlistSlice";
import { Helmet } from "react-helmet";

export default function WishListItemContent() {
  const dispatch = useDispatch();
  const { wishListItems } = useSelector((state) => state.wishList);
  const { productList } = useSelector((state) => state.products);
  console.log(productList);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (productId, totalStock, size, weight) => {
    const cartList = cartItems?.items || [];

    const existingIndex = cartList.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        (item.size || "") === (size || "") &&
        item.weight === weight
    );

    if (existingIndex > -1) {
      const currentQty = cartList[existingIndex].quantity;
      if (currentQty + 1 > totalStock) {
        toast.error(`Only ${totalStock} items available for this variant`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?._id,
        productId,
        quantity: 1,
        size: size || "",
        weight,
      })
    ).then((res) => {
      if (res?.success) {
        dispatch(fetchCartItems(user?._id));
        toast.success("Product added to cart");

        dispatch(
          deleteWishListItem({
            userId: user?._id,
            productId,
            size: size || "",
            weight,
          })
        );
      }
    });
  };

  const handleCartItemDelete = (item) => {
    // const product = productList.find((p) => p._id === item.productId);
    // const variant = product?.variants?.find((v) => v.size === item.size);
    // const weight = variant?.weight || "";

    dispatch(
      deleteWishListItem({
        userId: user?._id,
        productId: item.productId,
        size: item.size,
        weight:item.weight,
      })
    ).then((data) => {
      if (data?.success) toast.success("Item removed from wishlist");
      else toast.error(data?.message || "Failed to remove item");
    });
  };

  if (wishListItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 space-y-6">
        <Helmet>
          <title>Wishlist - Range Of Himalayas</title>
          <meta
            name="description"
            content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
          />
        </Helmet>
        <Heart className="w-16 h-16 mx-auto text-gray-300" />
        <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
        <p className="max-w-md mx-auto text-gray-600">
          Add products you love to your wishlist. Review them anytime and easily
          move them to your cart.
        </p>
        <a href="/viewproducts">
          <Button className="mt-4 px-6 py-3 bg-[#F08C7D] hover:bg-[#e27265] text-white rounded-lg font-medium">
            Continue Shopping
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className=" px-4 sm:px-6 lg:px-10 py-8 bg-[#FFF8E1] min-h-screen">
      <h2 className="text-3xl font-bold mb-8 flex items-center justify-between">
        <span className="text-gray-900">My Wishlist</span>
        <span className="text-gray-500 text-lg font-medium">
          ({wishListItems.length} item{wishListItems.length !== 1 ? "s" : ""})
        </span>
      </h2>

      {wishListItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <img
            src="/empty-wishlist.svg"
            alt="Empty Wishlist"
            className="w-40 mx-auto mb-6 opacity-80"
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500">
            Explore products and add your favorites here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishListItems.map((cartItem) => {
            const product = productList.find(
              (p) => p._id === cartItem.productId
            );

            const variant = product?.variants?.find(
              (v) =>
                v.size === cartItem.size &&
                (cartItem.weight ? v.weight === cartItem.weight : true)
            );

            const image = product?.image || "/placeholder.png";
            const title = product?.title || "Unnamed Product";
            const price = variant?.price ?? 0;
            const salePrice = variant?.salesPrice ?? price;
            const totalStock = variant?.stock ?? 0;
            const weight = variant?.weight || cartItem.weight || "";
            const discount =
              price > salePrice
                ? Math.round(((price - salePrice) / price) * 100)
                : 0;

            return (
              <div
                key={`${cartItem.productId}-${cartItem.size}-${weight}`}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
              >
                <button
                  onClick={() => handleCartItemDelete(cartItem)}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-md">
                    {discount}% OFF
                  </span>
                )}
                <div className="overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900 leading-tight line-clamp-2">
                    {title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {variant?.size && (
                      <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-default">
                        <span className="font-semibold text-gray-700">
                          Size:
                        </span>{" "}
                        {variant.size}
                      </span>
                    )}
                    {weight && (
                      <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-default">
                        <span className="font-semibold text-gray-700">
                          Weight:
                        </span>{" "}
                        {weight}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    {price !== salePrice ? (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{price}
                        </span>
                        <span className="text-2xl font-semibold text-[#16A34A]">
                          ₹{salePrice}
                        </span>
                        <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full shadow-sm">
                          {Math.round(((price - salePrice) / price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-semibold text-gray-900">
                        ₹{price}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() =>
                      handleAddToCart(
                        product?._id || cartItem.productId,
                        totalStock,
                        variant?.size,
                        weight
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 bg-[#F08C7D] text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-[#f39b8d] active:scale-95 transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
