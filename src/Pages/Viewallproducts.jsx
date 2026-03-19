import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { addToWishList, fetchWishListItems } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react"; // Assuming you use lucide-react for icons

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  // --- LOCAL STATE FOR SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");

  // --- SEARCH FILTER LOGIC ---
  const filteredProducts = useMemo(() => {
    if (!productList) return [];
    return productList.filter((product) =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productList, searchTerm]);

  // --- CART LOGIC ---
  function handleAddToCart(getCurrentProductId, getTotalStock, size) {
    if (!user?._id) {
      toast.error("Please login to add items to cart");
      return;
    }
    const getCartItems = cartItems?.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => (item.productId?._id || item.productId).toString() === getCurrentProductId.toString() && item.size === size
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

  // --- WISHLIST LOGIC ---
  function handleAddToWishList(getCurrentProductId, getTotalStock, size) {
    if (!user?._id) {
      toast.error("Login to save to wishlist");
      return;
    }
    const getWishListItems = wishListItems?.items || [];
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
    <div className="bg-[#fdfcf6] min-h-screen pb-20 selection:bg-orange-100">
      <Helmet>
        <title>Shop All - Range Of Himalayas</title>
      </Helmet>

      {/* --- MINIMALIST HEADER --- */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-black text-stone-900 tracking-tight"
          >
            Himalayan <span className="text-orange-600 italic font-medium">Harvest</span>
          </motion.h1>
          <p className="text-stone-500 mt-3 text-base md:text-lg">
            Sourced at 8,000ft. Delivered fresh to your doorstep.
          </p>
        </div>
      </div>

      {/* --- SEARCH BAR SECTION --- */}
      <div className="sticky top-0 z-30 bg-[#fdfcf6]/80 backdrop-blur-md py-6 px-6 border-b border-stone-200/60 mb-10">
        <div className="max-w-3xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search for apples, salts, or spices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white border border-stone-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-stone-800 placeholder:text-stone-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X size={16} className="text-stone-500" />
            </button>
          )}
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">
            {searchTerm ? `Search Results (${filteredProducts.length})` : `All Collections (${productList?.length || 0})`}
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {filteredProducts.map((item) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
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
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-stone-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-200/40 group-hover:-translate-y-1">
                      <TopSelections
                        product={item}
                        handleAddToCart={handleAddToCart}
                        handleAddToWishList={handleAddToWishList}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-stone-200">
            <p className="text-stone-400 font-serif italic text-xl">
              {searchTerm ? `No results for "${searchTerm}"` : "Preparing the next harvest..."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-orange-600 font-bold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}