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
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
          item.size === size,
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
      }),
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
          item.size === size,
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
      }),
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10 bg-[#FFF8E1] min-h-screen">
      <Helmet>
        <title>All Products - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {productList && productList.length > 0 ? (
          productList.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* --- PRODUCT LINK --- */}
              <Link
                to={`/product/${item._id}`}
                className="block"
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
              >
                {/* Decorative Entry Number (Archive Style) */}
                <div className="absolute -top-4 -left-2 z-10">
                  <span className="text-[10px] font-mono text-stone-300 tracking-tighter">
                    LOG_NO: {String(index + 1).padStart(3, "0")}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] bg-stone-50 border border-stone-100 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-stone-200/50">
                  {/* 1. IMAGE CONTAINER */}
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={item.images?.[0] || "/placeholder-image.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0"
                    />

                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Status Tag: Archive Red */}
                    {item.stock <= 0 && (
                      <div className="absolute top-6 right-6">
                        <span className="bg-[#B23A2E] text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                          Harvest Depleted
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 2. PRODUCT INFO ZONE */}
                  <div className="p-8 space-y-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-[#B23A2E] uppercase tracking-[0.3em]">
                          {item.category || "Mountain Harvest"}
                        </p>
                        <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter leading-tight">
                          {item.title}
                        </h3>
                      </div>
                      {/* Price Display */}
                      <span className="text-lg font-serif italic text-stone-800">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] w-full bg-stone-100 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <div className="flex items-center justify-between pt-2">
                      {/* Visual Weight/Size Info */}
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        Net Wt: {item.weight || "500g"}
                      </span>

                      {/* CTA Link */}
                      <div className="flex items-center gap-2 group/cta">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover/cta:text-stone-900 transition-colors">
                          View Details
                        </span>
                        <div className="w-1 h-1 rounded-full bg-stone-200 group-hover/cta:bg-[#B23A2E] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* --- 3. FLOATING INTERACTION LAYER (Add to Cart/Wishlist) --- */}
              {/* These only appear clearly on hover to keep the journal aesthetic clean initially */}
              <div className="absolute bottom-24 right-6 flex flex-col gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToWishList(item);
                  }}
                  className="w-10 h-10 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-[#B23A2E] hover:shadow-xl transition-all"
                >
                  <Heart size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(item);
                  }}
                  className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-[#B23A2E] hover:shadow-xl transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="font-serif italic text-stone-400 text-lg">
              "The archive is currently empty. The next harvest is approaching."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
