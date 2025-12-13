import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import {
  addToWishList,
  fetchWishListItems,
} from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  function handleAddToCart(getCurrentProductId, getTotalStock, size) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) =>
          item.productId.toString() === getCurrentProductId.toString() &&
          item.size === size
      );

      if (indexOfCurrentItem > -1) {
        const currentQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (currentQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getTotalStock} quantity available for this size`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?._id,
        productId: getCurrentProductId,
        quantity: 1,
        size,
      })
    ).then((data) => {
      if (data?.success) {
        dispatch(fetchCartItems(user?._id));
        toast.success("Product added to cart");
      } else {
        toast.error(data?.payload?.message || "Failed to add item");
      }
    });
  }

  function handleAddToWishList(getCurrentProductId, getTotalStock, size) {
    const getWishListItems = wishListItems?.items || [];

    if (getWishListItems.length) {
      const indexOfCurrentItem = getWishListItems.findIndex(
        (item) =>
          item.productId.toString() === getCurrentProductId.toString() &&
          item.size === size
      );

      if (indexOfCurrentItem > -1) {
        const currentQuantity = getWishListItems[indexOfCurrentItem].quantity;
        if (currentQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getTotalStock} quantity available for this size`);
          return;
        }
      }
    }

    dispatch(
      addToWishList({
        userId: user?._id,
        productId: getCurrentProductId,
        quantity: 1,
        size,
      })
    ).then((data) => {
      if (data?.success) {
        dispatch(fetchWishListItems(user?._id));
        toast.success("Product added to wishlist");
      } else {
        toast.error(data?.message || "Failed to add item");
      }
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10 bg-[#FFF8E1]">
      <Helmet>
        <title>All Products - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>

      {productList && productList.length > 0 ? (
        productList.map((item) => (
          <a
            key={item._id}
            href={`/product/${item._id}`}
            className="block hover:scale-[1.02] transition-transform duration-300"
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
            }
          >
            <TopSelections
              product={item}
              handleAddToCart={handleAddToCart}
              handleAddToWishList={handleAddToWishList}
            />
          </a>
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

