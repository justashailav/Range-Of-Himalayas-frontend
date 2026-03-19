import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { addToWishList, fetchWishListItems } from "@/store/slices/wishlistSlice";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Sparkles, MapPin, ArrowRight } from "lucide-react";

const himalayanBg = "https://images.unsplash.com/photo-1549880181-56a44cf4a9a1?q=80&w=2000&auto=format&fit=crop";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { wishListItems } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(productList?.map((p) => p.category).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let result = [...(productList || [])];
    if (searchTerm) {
      result = result.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [productList, searchTerm, activeCategory]);

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
    <div className="bg-[#FAF9F6] min-h-screen pb-32 selection:bg-orange-200">
      <Helmet><title>Explore the Peaks | Range Of Himalayas</title></Helmet>

      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative h-[85vh] w-full flex items-end pb-20 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={himalayanBg} alt="Himalayas" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center gap-2 text-white/80 mb-4 font-bold tracking-[0.3em] uppercase text-[10px]">
              <MapPin size={14} className="text-orange-400" />
              Directly from the Source
            </div>
            <h1 className="text-7xl md:text-[10rem] font-serif font-black text-white leading-[0.85] tracking-tighter mb-6">
              Purely <br /> <span className="text-orange-300 italic">Pahadi.</span>
            </h1>
            <p className="max-w-md text-white/90 text-lg font-medium leading-relaxed border-l-2 border-orange-400 pl-6">
              Every product is a piece of the mountain. Hand-picked at high altitudes, delivered with soul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- FLOATING NAVIGATION BAR --- */}
      <nav className="sticky top-6 z-50 px-6 mt-[-3rem]">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-3xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] p-2 flex flex-col md:flex-row items-center gap-4">
          
          {/* Enhanced Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="w-full pl-14 pr-6 py-4 bg-transparent border-none rounded-full focus:ring-0 text-sm font-bold placeholder:text-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat 
                    ? "bg-stone-900 text-white shadow-xl scale-105" 
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* --- MASONRY-STYLE GRID --- */}
      <main className="max-w-[110rem] mx-auto px-6 md:px-12 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]">Collection 2024</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 mt-2">Discover the Harvest</h2>
          </div>
          <div className="text-stone-400 text-xs font-bold tracking-widest uppercase">
            Showing {filteredProducts.length} Treasures
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            >
              {filteredProducts.map((item, index) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative bg-white rounded-[2.5rem] p-3 border border-stone-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-3">
                    
                    {/* Badge */}
                    {item.salePrice < item.price && (
                      <div className="absolute top-8 left-8 z-20 bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                        <Sparkles size={10} className="text-orange-400" /> Fresh Choice
                      </div>
                    )}

                    <Link to={`/product/${item._id}`} className="block overflow-hidden rounded-[2rem]">
                      <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
                         <TopSelections
                            product={item}
                            handleAddToCart={handleAddToCart}
                            handleAddToWishList={handleAddToWishList}
                          />
                      </div>
                    </Link>

                    {/* Quick Info Overlay on Hover (Visual Decoration) */}
                    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                       <div className="bg-orange-500 text-white p-3 rounded-full shadow-xl">
                          <ArrowRight size={20} />
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 bg-stone-50 rounded-[4rem] border border-dashed border-stone-200">
              <Leaf size={40} className="mx-auto text-stone-200 mb-6" />
              <p className="text-stone-400 font-serif italic text-2xl">The mountain is quiet. No products found.</p>
              <button onClick={() => {setSearchTerm(""); setActiveCategory("All");}} className="mt-8 px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                Reset Exploration
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- FOOTER TEASER --- */}
      <section className="mt-32 px-6">
        <div className="max-w-5xl mx-auto py-20 bg-stone-900 rounded-[4rem] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
          <h3 className="text-white text-3xl font-serif italic mb-4">Want a taste of the peaks?</h3>
          <p className="text-stone-400 text-sm tracking-widest uppercase mb-8">Sign up for our mountain harvest updates</p>
          <div className="flex max-w-md mx-auto gap-2 px-6">
            <input type="email" placeholder="Your Email" className="flex-1 bg-white/10 border-none rounded-full px-6 text-white text-sm focus:ring-1 focus:ring-orange-400" />
            <button className="bg-white text-stone-900 px-6 py-3 rounded-full text-[10px] font-black uppercase">Join</button>
          </div>
        </div>
      </section>
    </div>
  );
}