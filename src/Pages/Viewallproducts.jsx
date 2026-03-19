import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { addToWishList, fetchWishListItems } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  // --- CART LOGIC ---
  function handleAddToCart(getCurrentProductId, getTotalStock, size) {
    if (!user?._id) {
      toast.error("Please login to add items to cart");
      return;
    }

    const getCartItems = cartItems?.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) =>
        (item.productId?._id || item.productId).toString() === getCurrentProductId.toString() &&
        item.size === size
    );

    if (indexOfCurrentItem > -1) {
      const currentQuantity = getCartItems[indexOfCurrentItem].quantity;
      if (currentQuantity + 1 > getTotalStock) {
        toast.error(`Only ${getTotalStock} units available`);
        return;
      }
    }

    dispatch(addToCart({ userId: user._id, productId: getCurrentProductId, quantity: 1, size }))
      .then((res) => {
        const data = res.payload || res;
        if (data?.success) {
          dispatch(fetchCartItems(user._id));
          toast.success("Added to cart");
        }
      });
  }

  // --- WISHLIST LOGIC (Fixed for Duplicate Toast) ---
  function handleAddToWishList(getCurrentProductId, getTotalStock, size) {
    if (!user?._id) {
      toast.error("Login to save to wishlist");
      return;
    }

    const getWishListItems = wishListItems?.items || [];
    
    // Flexible matching for IDs and Sizes
    const isAlreadyInWishlist = getWishListItems.some((item) => {
      const existingId = (item.productId?._id || item.productId).toString();
      return existingId === getCurrentProductId.toString() && (item.size || "") === (size || "");
    });

    if (isAlreadyInWishlist) {
      toast.info("Item is already in your wishlist!");
      return;
    }

    dispatch(addToWishList({ userId: user._id, productId: getCurrentProductId, quantity: 1, size }))
      .then((res) => {
        const data = res.payload || res;
        if (data?.success) {
          dispatch(fetchWishListItems(user._id));
          toast.success("Saved to wishlist");
        }
      });
  }

  return (
    <div className="bg-[#fdfcf6] min-h-screen pb-20">
      <Helmet>
        <title>Shop All - Range Of Himalayas</title>
      </Helmet>

      {/* --- HERO HEADER --- */}
      <div className="relative bg-stone-900 py-20 mb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter"
          >
            Himalayan <span className="text-orange-400 italic font-medium">Harvest</span>
          </motion.h1>
          <motion.p 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
             className="text-stone-300 mt-4 text-lg max-w-xl mx-auto"
          >
            Sourced at 8,000ft. Delivered fresh to your doorstep.
          </motion.p>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-stone-900">
            All Collections ({productList?.length || 0})
          </h2>
        </div>

        {productList && productList.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {productList.map((item) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link
                  to={`/product/${item._id}`}
                  className="group block"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-orange-100/50">
                    <TopSelections
                      product={item}
                      handleAddToCart={handleAddToCart}
                      handleAddToWishList={handleAddToWishList}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-40">
            <p className="text-stone-400 font-serif italic text-xl">Preparing the next harvest...</p>
          </div>
        )}
      </div>
    </div>
  );
}