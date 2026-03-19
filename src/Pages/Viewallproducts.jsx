import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { addToWishList, fetchWishListItems } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, Leaf } from "lucide-react";

const himalayanBg = "https://images.unsplash.com/photo-1549880181-56a44cf4a9a1?q=80&w=2000&auto=format&fit=crop";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  // --- LOCAL STATES FOR FILTERING/SORTING ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(productList?.map((p) => p.category).filter(Boolean))];

  // --- REFINED FILTER & SORT LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...(productList || [])];

    // 1. Filter by Search
    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter by Category
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 3. Sort
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "title-az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }

    return result;
  }, [productList, searchTerm, sortBy, activeCategory]);

  // --- HANDLERS (Same logic as before, ensuring toasts work) ---
  function handleAddToCart(productId, stock, size) {
    if (!user?._id) return toast.error("Please login first");
    dispatch(addToCart({ userId: user._id, productId, quantity: 1, size }))
      .then((res) => (res.payload?.success || res.success) && dispatch(fetchCartItems(user._id)) && toast.success("Added to cart"));
  }

  function handleAddToWishList(productId, stock, size) {
    if (!user?._id) return toast.error("Please login first");
    const exists = wishListItems?.items?.some(item => (item.productId?._id || item.productId).toString() === productId.toString());
    if (exists) return toast.info("Already in your wishlist");
    
    dispatch(addToWishList({ userId: user._id, productId, quantity: 1, size }))
      .then((res) => (res.payload?.success || res.success) && dispatch(fetchWishListItems(user._id)) && toast.success("Saved to wishlist"));
  }

  return (
    <div className="bg-[#fdfcf6] min-h-screen pb-20 bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url(${himalayanBg})` }}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[3px]" />
      <Helmet><title>Fresh Himalayan Produce | Range Of Himalayas</title></Helmet>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-24 pb-12 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center mb-4">
          <Leaf className="text-[#d97706]" size={32} />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-serif font-black text-slate-950 tracking-tighter">
          The <span className="text-[#d97706] italic">Pahadi</span> Pantry
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-600 mt-4 text-lg font-medium">
          Pure. Organic. From the heart of the peaks.
        </motion.p>
      </div>

      {/* --- UTILITY BAR (Search & Sort) --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-[2rem] shadow-xl shadow-black/5 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search apples, salts, pulses..." 
              className="w-full pl-12 pr-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-slate-400 text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat ? "bg-slate-950 text-white shadow-lg" : "bg-white/50 text-slate-500 hover:bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative group w-full lg:w-auto">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-48 appearance-none pl-4 pr-10 py-3 bg-white/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-orange-200"
            >
              <option value="default">Sort By: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-az">Alphabetical: A-Z</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="relative z-10 max-w-[95rem] mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {filteredAndSortedProducts.map((item) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="group relative h-full bg-white/40 backdrop-blur-md border border-white/50 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-orange-900/10">
                    <Link to={`/product/${item._id}`} className="block h-full">
                      <TopSelections
                        product={item}
                        handleAddToCart={handleAddToCart}
                        handleAddToWishList={handleAddToWishList}
                      />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-white/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/50">
              <p className="text-slate-400 font-serif italic text-2xl">No items found matching your search.</p>
              <button onClick={() => {setSearchTerm(""); setActiveCategory("All");}} className="mt-4 text-[#d97706] text-xs font-black uppercase tracking-widest underline underline-offset-4">Clear All Filters</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}