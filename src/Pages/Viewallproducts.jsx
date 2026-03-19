import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { addToWishList, fetchWishListItems } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Leaf, Sparkles, ArrowUpDown } from "lucide-react";

const himalayanBg = "https://images.unsplash.com/photo-1549880181-56a44cf4a9a1?q=80&w=2000&auto=format&fit=crop";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(productList?.map((p) => p.category).filter(Boolean))];

  // --- FIXED SORTING & FILTERING LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...(productList || [])];

    if (searchTerm) {
      result = result.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // FIXED: Ensure we are comparing numbers, not strings
    result.sort((a, b) => {
      const priceA = Number(a.salePrice || a.price || 0);
      const priceB = Number(b.salePrice || b.price || 0);

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "title-az") return a.title.localeCompare(b.title);
      return 0; // Default: Featured/No sort
    });

    return result;
  }, [productList, searchTerm, sortBy, activeCategory]);

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
    <div className="bg-[#FAF9F6] min-h-screen pb-24 relative overflow-x-hidden">
      <Helmet><title>Shop Our Collection | Range Of Himalayas</title></Helmet>

      {/* --- LUXURY PARALLAX HERO --- */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0" 
          style={{ backgroundImage: `url(${himalayanBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF9F6] z-1" />
        
        <div className="relative z-10 text-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-3 mb-6">
            <span className="h-[1px] w-12 bg-white/60 self-center" />
            <Leaf className="text-orange-300" size={20} />
            <span className="h-[1px] w-12 bg-white/60 self-center" />
          </motion.div>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-9xl font-serif font-black text-white tracking-tighter drop-shadow-2xl"
          >
            The <span className="italic font-light text-orange-200">Harvest</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             transition={{ delay: 0.5 }}
             className="text-white/90 mt-4 text-xs md:text-sm font-black uppercase tracking-[0.5em]"
          >
            Sourced at 8,000ft • Organic • Direct to Home
          </motion.p>
        </div>
      </div>

      {/* --- DASHBOARD FILTER BAR --- */}
      <div className="sticky top-0 z-40 -mt-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-[2.5rem] p-3 md:p-5 flex flex-col lg:flex-row gap-5 items-center">
          
          {/* Search Section */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search our pantry..." 
              className="w-full pl-14 pr-6 py-4 bg-stone-100/50 border-none rounded-3xl focus:ring-2 focus:ring-orange-200/50 transition-all text-sm font-bold placeholder:text-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Scroller */}
          <div className="flex flex-1 gap-3 overflow-x-auto no-scrollbar w-full py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat ? "bg-stone-900 text-white shadow-lg" : "bg-white text-stone-500 hover:bg-orange-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Menu */}
          <div className="relative w-full lg:w-auto min-w-[200px]">
            <ArrowUpDown className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={14} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-12 pr-10 py-4 bg-stone-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-stone-800 transition-colors"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="title-az">A - Z</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" size={16} />
          </div>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 mt-20">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {filteredAndSortedProducts.map((item) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <Link to={`/product/${item._id}`} className="block">
                    <div className="relative rounded-[3rem] overflow-hidden bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(217,119,6,0.15)] group-hover:-translate-y-4">
                      {/* Sale Badge */}
                      {item.salePrice < item.price && (
                        <div className="absolute top-6 left-6 z-10 bg-orange-500 text-white text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Limited Offer
                        </div>
                      )}
                      
                      <div className="p-2">
                        <TopSelections
                          product={item}
                          handleAddToCart={handleAddToCart}
                          handleAddToWishList={handleAddToWishList}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 border-2 border-dashed border-stone-200 rounded-[4rem]">
              <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                <Search size={32} />
              </div>
              <p className="text-stone-400 font-serif italic text-2xl px-6">We couldn't find any treasures matching that search.</p>
              <button onClick={() => {setSearchTerm(""); setActiveCategory("All");}} className="mt-6 px-10 py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors">
                Show All Products
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}