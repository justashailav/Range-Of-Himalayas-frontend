import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Tag } from "lucide-react";

import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { deleteWishListItem } from "@/store/slices/wishlistSlice";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
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
        item.weight === weight,
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
      }),
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
          }),
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
        size: item.size || "",
        weight: item.weight,
      }),
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
      <div className="relative mb-12 border-b border-stone-100 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="w-8 h-[1px] bg-[#B23A2E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
                Personal Archive
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter">
              My{" "}
              <span className="italic font-serif font-light text-stone-400">
                Wishlist
              </span>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-stone-900 text-white shadow-xl shadow-stone-200"
          >
            <Heart size={14} className="fill-[#B23A2E] text-[#B23A2E]" />
            <span className="text-xs font-black uppercase tracking-widest">
              {wishListItems.length}{" "}
              {wishListItems.length === 1 ? "Selection" : "Selections"}
            </span>
          </motion.div>
        </div>

        {/* Subtitle - Optional but adds "Boutique" feel */}
        <p className="mt-4 text-stone-400 text-sm font-medium max-w-md">
          A curated collection of your favorite Himalayan treasures, reserved
          for your next harvest.
        </p>
      </div>

      {wishListItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden text-center py-32 px-6 bg-stone-50/50 rounded-[3rem] border border-stone-100"
        >
          {/* Subtle background texture or glow */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

          <div className="relative z-10 max-w-sm mx-auto">
            {/* Icon with Soft Pulse */}
            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-[#B23A2E]/5 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-stone-200">
                <Heart size={32} className="text-stone-200 stroke-[1.5px]" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-6 right-6 w-3 h-3 bg-[#B23A2E] rounded-full border-2 border-white"
                />
              </div>
            </div>

            {/* Typography */}
            <h3 className="text-3xl font-black text-stone-900 tracking-tighter mb-4">
              The Orchard is <br />
              <span className="italic font-serif font-light text-stone-400">
                Waiting.
              </span>
            </h3>

            <p className="text-stone-500 font-light leading-relaxed mb-10">
              Your collection of Himalayan treasures is currently empty. Explore
              our seasonal harvest to begin your archive.
            </p>

            {/* CTA Button */}
            <Link to="/viewproducts">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 mx-auto bg-stone-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#B23A2E] transition-all duration-300 shadow-xl shadow-stone-200"
              >
                Discover the Harvest
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            </Link>
          </div>

          {/* Decorative minimalist line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishListItems.map((cartItem) => {
            const product = productList.find(
              (p) => p._id === cartItem.productId,
            );

            const variant = product?.variants?.find(
              (v) =>
                v.size === cartItem.size &&
                (cartItem.weight ? v.weight === cartItem.weight : true),
            );

            const image = product?.image;
            const title = product?.title;
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
                className="relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
                  {/* PRODUCT IMAGE */}
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
                  />

                  {/* TOP ACTION BAR */}
                  <div className="absolute top-5 inset-x-5 flex justify-between items-start z-20">
                    {/* DISCOUNT BADGE */}
                    {discount > 0 ? (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#B23A2E] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
                      >
                        {discount}% SAVINGS
                      </motion.span>
                    ) : (
                      <div />
                    )}

                    {/* DELETE BUTTON - Updated for Mobile Visibility */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents accidental clicks on the card
                        handleCartItemDelete(cartItem);
                      }}
                      whileTap={{ scale: 0.9 }}
                      /* Change: opacity-100 on mobile (default), 
         opacity-0 on desktop (md:opacity-0),
         group-hover reveals it on desktop.
      */
                      className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-stone-400 active:text-[#B23A2E] md:opacity-0 group-hover:opacity-100 transition-all duration-300 md:translate-y-2 group-hover:translate-y-0 shadow-md"
                      title="Remove from archive"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>

                  {/* GRADIENT OVERLAY - Made slightly more visible on mobile to help the white button pop */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-6 space-y-6">
                  {/* TITLE & PRICE SECTION */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-stone-900 tracking-tighter leading-[1.1] line-clamp-2 uppercase">
                        {title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      {price !== salePrice ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-stone-300 line-through font-bold decoration-stone-300">
                            ₹{price}
                          </span>
                          <span className="text-2xl font-serif italic text-stone-900">
                            ₹{salePrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-serif italic text-stone-900">
                          ₹{price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* MINIMALIST ATTRIBUTE TAGS */}
                  <div className="flex flex-wrap gap-2">
                    {variant?.size && (
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-stone-500 bg-stone-50 border border-stone-100 rounded-md">
                        <span className="text-stone-300">Size:</span>{" "}
                        {variant.size}
                      </div>
                    )}
                    {weight && (
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-stone-500 bg-stone-50 border border-stone-100 rounded-md">
                        <span className="text-stone-300">Net:</span> {weight}
                      </div>
                    )}
                  </div>

                  {/* PREMIUM ADD TO CART BUTTON */}
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product?._id || cartItem.productId,
                        totalStock,
                        variant?.size,
                        weight,
                      )
                    }
                    className="w-full group/btn relative flex items-center justify-center gap-3 bg-stone-900 text-white py-4 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#B23A2E] hover:shadow-xl hover:shadow-stone-200 active:scale-[0.98]"
                  >
                    {/* Subtle Shine Effect */}
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />

                    <ShoppingCart
                      size={16}
                      className="transition-transform group-hover/btn:-rotate-12"
                    />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      Move to Basket
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
