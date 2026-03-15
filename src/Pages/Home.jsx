import React, { useEffect, useState } from "react";
import bgImage from "../assets/BannerImage.png";
import foundersImage from "../assets/foundersLetter.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import ShoppingProductTile from "./Product-tile";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import TopSelections from "./TopSelections";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addToWishList,
  fetchWishListItems,
} from "@/store/slices/wishlistSlice";
import { getGalleryItems } from "@/store/slices/gallerySlice";
import Footer from "./Footer";
import CustomerReviews from "./CustomerReview";
import { Helmet } from "react-helmet";
import HomeBlog from "./HomeBlogs";
import { motion, AnimatePresence } from "framer-motion";
import HimalayanLoader from "./HimalayanLoader";
import TrendingProductSkeleton from "./TrendingProductSkeleton";
import GallerySkeleton from "./GallerySkeleton";
const categories = ["All", "Orchard", "Harvesting", "Products", "Farm"];
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  const { images: galleryItems, loading } = useSelector(
    (state) => state.gallery,
  );

  useEffect(() => {
    dispatch(getGalleryItems());
  }, [dispatch]);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);
  const prevSlide = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    } else {
      const prevItemIndex =
        currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
      setCurrentIndex(prevItemIndex);
      setCurrentImageIndex(filteredItems[prevItemIndex].images.length - 1);
    }
  };

  const nextSlide = () => {
    if (currentImageIndex < filteredItems[currentIndex].images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    } else {
      const nextItemIndex =
        currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(nextItemIndex);
      setCurrentImageIndex(0);
    }
  };
  const features = [
    {
      title: "🍎 Naturally Wax-Free",
      desc: "Fresh, natural apples — no artificial coatings, no chemicals.",
    },
    {
      title: "🌍 Eco-Friendly Cultivation",
      desc: "Harvested responsibly with care for the environment",
    },
    {
      title: "🍏 Age-Old Wisdom",
      desc: "Generational farming knowledge, perfected with time",
    },
    {
      title: "🏔 From Our Himalayas",
      desc: "Direct from orchard to table for ultimate freshness.",
    },
  ];

  const { productList } = useSelector((state) => state.products);
  const { productDetails } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);
  const { user } = useSelector((state) => state.auth);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();

  function handleGetProductDetails(product) {
    navigate(`/product/${product._id}`);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function handleAddToCart(getCurrentProductId, getTotalStock, size, weight) {
    if (!user?._id) {
      toast.error("Oops! You need to login first to add items to your cart.");
      return;
    }

    const normalizedSize = size || "";

    const getCartItems = cartItems?.items || [];

    const existingItemIndex = getCartItems.findIndex(
      (item) =>
        item.productId.toString() === getCurrentProductId.toString() &&
        (item.size || "") === normalizedSize &&
        item.weight === weight,
    );

    if (existingItemIndex > -1) {
      const currentQuantity = getCartItems[existingItemIndex].quantity;
      if (currentQuantity + 1 > getTotalStock) {
        toast.error(`Only ${getTotalStock} items available for this variant`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user._id,
        productId: getCurrentProductId,
        quantity: 1,
        size: normalizedSize,
        weight,
      }),
    )
      .then((data) => {
        if (data?.success) {
          dispatch(fetchCartItems(user._id));
          toast.success("Product added to cart");
          setOpenCartSheet(true);
        } else {
          toast.error(data?.message || "Failed to add item");
        }
      })
      .catch(() => {
        toast.error("Failed to add item");
      });
  }

  function handleAddToWishList(
    getCurrentProductId,
    getTotalStock,
    size,
    weight,
  ) {
    if (!user?._id) {
      toast.error(
        "Oops! You need to login first to add items to your wishlist.",
      );
      return;
    }
    const normalizedSize = size || "";
    const getWishListItems = wishListItems?.items || [];

    if (getWishListItems.length) {
      const indexOfCurrentItem = getWishListItems.findIndex((item) => {
        const sameProduct =
          item.productId.toString() === getCurrentProductId.toString();
        const sameSize = item.normalizedSize === normalizedSize;
        const sameWeight =
          (item.weight &&
            weight &&
            item.weight.toString() === weight.toString()) ||
          (!item.weight && !weight);
        return sameProduct && sameSize && sameWeight;
      });

      if (indexOfCurrentItem > -1) {
        const currentQuantity = getWishListItems[indexOfCurrentItem].quantity;
        if (currentQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getTotalStock} quantity available for this size${
              weight ? " and weight" : ""
            }`,
          );
          return;
        }
      }
    }

    dispatch(
      addToWishList({
        userId: user?._id,
        productId: getCurrentProductId,
        quantity: 1,
        normalizedSize,
        weight,
      }),
    ).then((data) => {
      if (data?.success) {
        dispatch(fetchWishListItems(user?._id));
        toast.success("Product added to wishlist");
        setOpenCartSheet(true);
      } else {
        toast.error(data?.message || "Failed to add item");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);
  if (loading && !galleryItems?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#fdfcf7] flex flex-col items-center justify-center"
      >
        {/* Using the updated text prop to keep that 
          editorial/storytelling voice consistent 
      */}
        <HimalayanLoader text="Sourcing the finest harvest…" />

        {/* Optional: Minimalist footer mark to ground 
          the screen during long load times 
      */}
        <div className="absolute bottom-12 overflow-hidden">
          <span className="text-[8px] font-black uppercase tracking-[0.8em] text-stone-300">
            EST. 2026
          </span>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="bg-[#FFF8E1] overflow-x-hidden">
      <Helmet>
        <title>Range Of Himalayas | Fresh Apples, Kiwis</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
      <div className="overflow-hidden relative bg-red-600 py-2">
        <div className="animate-marquee whitespace-nowrap text-white font-semibold text-lg flex gap-8">
          <span>
            🎁 Use code{" "}
            <span className="text-yellow-400 font-bold">HIMALAYA10</span> to get
            10% off! 🍎
          </span>
          <span>🌿 Free gift on orders above ₹2000 – Limited Time!</span>
          <span>🚚 Fast delivery from our orchards directly to you!</span>
        </div>
      </div>
      <section className="relative w-full h-[100dvh] overflow-hidden bg-stone-950">
      
      {/* 1. THE IMAGE */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          src={bgImage} 
          /* On mobile, we center the image object so the product bowl stays visible */
          className="w-full h-full object-cover object-center md:object-right"
          alt="Himalayan Harvest"
        />
        
        {/* Responsive Gradient: Top-to-bottom on mobile, Left-to-right on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950 md:bg-gradient-to-r md:from-stone-950 md:via-stone-950/20 md:to-transparent" />
      </div>

      {/* 2. THE CONTENT LAYER */}
      <div className="relative z-10 flex flex-col justify-between h-full px-8 py-16 md:px-20 md:py-20 lg:px-32">
        
        {/* TOP: Status Label (Centered on mobile for balance) */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center md:justify-start gap-3"
        >
          <span className="w-1.5 h-1.5 bg-[#B23A2E] rounded-full animate-pulse" />
          <p className="text-white/80 text-[9px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold">
            Volume 01 • Harvest 2026
          </p>
        </motion.div>

        {/* BOTTOM: Product Navigation */}
        <div className="flex flex-col gap-8 md:gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            /* Mobile: Centered grid for touch targets | Desktop: Left-aligned row */
            className="grid grid-cols-1 gap-y-5 md:flex md:flex-row md:items-center md:gap-x-12 border-t border-white/10 pt-8 md:pt-10"
          >
            {["Red Rice", "Pahadi Rajma", "Apricots"].map((item, i) => (
              <div key={i} className="flex items-center justify-center md:justify-start gap-3 group cursor-pointer">
                <span className="text-[#B23A2E] text-[8px] md:text-[11px] font-mono font-bold">
                  0{i + 1}
                </span>
                <span className="text-white/60 group-hover:text-white text-[12px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-colors duration-300">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Boutique Scroll Indicator (Centered on mobile, hidden if preferred) */}
          <div className="flex justify-center md:justify-start">
            <div className="w-[1px] h-10 md:h-16 bg-gradient-to-b from-[#B23A2E] to-transparent" />
          </div>
        </div>
      </div>
    </section>

      <div>
        <div className="flex flex-col items-center mt-12 mb-8">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-2"
          >
            Pure & Organic
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center font-extrabold text-4xl md:text-5xl text-[#D84C3C] tracking-tight"
          >
            Himalayan <span className="text-gray-800">Selections</span>
          </motion.h1>

          <div className="w-16 h-1 bg-[#D84C3C] mt-4 rounded-full" />
        </div>

        <section className="bg-[#F7F3F0] py-24 relative overflow-hidden">
          {/* Soft atmospheric glows - using clay and amber tones instead of dark red */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8DCD3] rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F0E6DF] rounded-full blur-[100px] opacity-70 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="grid gap-12 px-6 max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-3"
          >
            {productList?.slice(0, 3).map((item, index) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                className="group relative"
              >
                <Link
                  to={`/product/${item._id}`}
                  onClick={() => handleGetProductDetails(item)}
                  className="relative block h-full overflow-hidden rounded-[3rem] bg-[#EBE5E0] border border-white transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(142,125,110,0.2)]"
                >
                  {/* IMAGE SECTION */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className="absolute inset-0 scale-100 group-hover:scale-105 transition-transform duration-[2s] ease-out">
                      <TopSelections product={item} />
                    </div>

                    {/* Subtle light vignette instead of dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#EBE5E0] via-transparent to-transparent opacity-80" />
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="relative p-8 -mt-24">
                    {/* Bright Floating Card: Contrast against the clay-colored base */}
                    <div className="bg-white/90 backdrop-blur-2xl border border-white p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:-translate-y-3">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-[1px] w-6 bg-[#D84C3C] origin-left group-hover:w-10 transition-all duration-500" />
                          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D84C3C] font-black">
                            Pure Origin
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-2xl font-serif text-[#2D2926] leading-tight group-hover:text-[#D84C3C] transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#6B645E] font-light leading-relaxed line-clamp-2">
                            {item.description ||
                              "Thoughtfully curated from the heart of the Himalayas."}
                          </p>
                        </div>

                        {/* Bottom Row */}
                        <div className="mt-2 flex items-center justify-between border-t border-[#F0EBE6] pt-5">
                          <span className="text-[10px] text-[#A39C94] uppercase tracking-[0.2em] font-bold group-hover:text-[#2D2926] transition-colors duration-300">
                            Discover More
                          </span>

                          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#F7F3F0] group-hover:bg-[#D84C3C] transition-all duration-500 overflow-hidden">
                            <span className="relative z-10 text-[#6B645E] group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
      <div className="overflow-hidden relative bg-red-600 py-2 mt-4">
        <div className="animate-marquee whitespace-nowrap text-white font-semibold text-lg flex gap-8">
          <span>🍎 Fresh Himalayan Apples – Direct from Orchard to You 🍏</span>
          <span>🍎 Organic, Wax-Free, Handpicked with Love 🌿</span>
          <span>🍎 Premium Quality Apples – Taste the Himalayas 🏔</span>
        </div>
      </div>

      <div className="px-6 sm:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Title Section */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-3 text-center md:text-left">
  
  {/* Label with responsive lines */}
  <div className="flex items-center gap-3">
    {/* Left line (always visible) */}
    <span className="h-[1px] w-6 md:w-8 bg-[#D84C3C]" />
    
    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#D84C3C] font-bold">
      Curated Selection
    </span>

    {/* Right line (mobile only - creates symmetry when centered) */}
    <span className="h-[1px] w-6 bg-[#D84C3C] md:hidden" />
  </div>

  {/* Responsive Headline */}
  <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-gray-900 leading-[1.2] md:leading-tight">
    Trending{" "}
    <span className="text-gray-400 italic font-light block sm:inline mt-1 sm:mt-0">
      Now
    </span>
  </h1>

  {/* Responsive Paragraph */}
  <p className="text-sm md:text-base text-gray-500 max-w-[280px] sm:max-w-md font-light leading-relaxed">
    Discover this week's most-loved essentials from the Himalayan
    foothills, handpicked for their purity and craftsmanship.
  </p>
</div>
          {/* Action Section */}
          <div className="flex items-center">
            <Link to="/viewproducts" className="group relative">
              <div className="flex items-center gap-4 py-3 px-1">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-900 group-hover:text-[#D84C3C] transition-colors duration-300">
                  View All Collections
                </span>

                <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-[#D84C3C] transition-all duration-500 overflow-hidden">
                  {/* Background fill effect on hover */}
                  <div className="absolute inset-0 bg-[#D84C3C] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                  {/* Arrow icon */}
                  <svg
                    className="w-5 h-5 relative z-10 text-gray-900 group-hover:text-white transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
              {/* Subtle underline that expands */}
              <div className="absolute bottom-0 left-0 h-[1px] bg-gray-200 w-full group-hover:bg-[#D84C3C]/30 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Optional: A very faint divider to anchor the grid below */}
        <div className="mt-12 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      </div>
      <div className="relative p-6">
        {/* LEFT ARROW */}
        <button className="swiper-button-prev-custom absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200">
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* RIGHT ARROW */}
        <button className="swiper-button-next-custom absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200">
          <ChevronRight className="w-5 h-5" />
        </button>

        {productList && productList.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {productList.map((item) => (
              <SwiperSlide key={item._id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <ShoppingProductTile
                    product={item}
                    handleAddToCart={handleAddToCart}
                    handleAddToWishList={handleAddToWishList}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          /* 🔥 Skeleton grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <TrendingProductSkeleton key={i} />
            ))}
          </div>
        )}
      </div>

      <div>
        {/* HEADER */}
        <div className="relative text-center mb-16 px-6">
          {/* Decorative Element - Very subtle background "01" or leaf icon could go here */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[120px] font-serif text-gray-100 opacity-50 pointer-events-none select-none">
            Our Story
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4">
            {/* Refined Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-6 bg-[#D84C3C]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D84C3C] font-black">
                From Orchard to You
              </span>
              <span className="h-[1px] w-6 bg-[#D84C3C]" />
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight">
              Why{" "}
              <span className="italic font-light text-gray-500">Range Of</span>{" "}
              Himalayas?
            </h2>

            {/* Elegant Divider Dot */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D84C3C]" />
              <div className="w-1 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Descriptive Text */}
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Every harvest is a reflection of our passion for{" "}
              <span className="text-gray-800 font-medium">purity</span>,
              timeless tradition, and uncompromising quality.
            </p>
          </div>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="group relative flex flex-col items-center p-8 rounded-[2.5rem] bg-[#F9F7F4] border border-white transition-all duration-500 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(180,160,140,0.15)]"
            >
              {/* 1. Iconic Number or Accent Icon */}
              <div className="mb-6 relative">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {/* Replace this with your actual icon or a stylized number */}
                  <span className="text-[#D84C3C] font-serif italic text-xl">
                    0{index + 1}
                  </span>
                </div>
                {/* Subtle ring decoration */}
                <div className="absolute inset-0 rounded-full border border-[#D84C3C]/10 scale-125 group-hover:scale-150 transition-transform duration-700" />
              </div>

              {/* 2. Text Content */}
              <div className="text-center space-y-3">
                <h3 className="font-serif text-xl text-gray-900 group-hover:text-[#D84C3C] transition-colors">
                  {feature.title}
                </h3>

                {/* Subtle decorative line */}
                <div className="w-8 h-[1px] bg-gray-200 mx-auto group-hover:w-12 group-hover:bg-[#D84C3C]/30 transition-all" />

                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              {/* 3. Corner Accent (Optional) */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D84C3C]/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-16 sm:mt-24 px-6 max-w-7xl mx-auto">
        <div className="relative group">
          {/* 1. The Decorative Frame (Back layer) */}
          <div className="absolute -inset-4 border border-[#E8DCD3] rounded-[3rem] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

          {/* 2. Main Image Container */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#F3F0EB] shadow-[0_30px_60px_-15px_rgba(142,125,110,0.15)]">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.2, 1, 0.3, 1] }}
              className="relative"
            >
              <img
                src={foundersImage}
                alt="Founders of Range of Himalayas"
                className="w-full h-[400px] sm:h-[550px] lg:h-[750px] object-cover object-center transition-transform duration-[3s] group-hover:scale-105"
              />

              {/* 3. Sophisticated Overlays */}
              {/* Subtle vignette to pop the subject */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-60" />

              {/* Soft light leak from the top left */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* 4. Floating Caption Badge (Optional) */}
            <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
              <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/50 shadow-xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D84C3C] font-black mb-1">
                  Our Visionaries
                </p>
                <h4 className="text-xl font-serif text-gray-900">
                  Nurturing the Roots
                </h4>
              </div>
            </div>
          </div>

          {/* 5. Artistic Corner Stamp */}
          <div className="absolute -bottom-6 -right-6 hidden md:block">
            <div className="w-24 h-24 rounded-full bg-[#D84C3C] flex items-center justify-center p-4 text-center shadow-2xl rotate-12">
              <span className="text-[8px] font-bold text-white uppercase tracking-tighter leading-none">
                Authentic <br /> Himalayan <br /> Harvest
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-20 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* 1. Subtle Background Element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <h1 className="text-[180px] font-serif select-none">Harvest</h1>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* 2. Refined Branding Accent */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-10 bg-[#D84C3C]/30" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#D84C3C] font-black">
                From Our Orchards
              </span>
              <div className="h-[1px] w-10 bg-[#D84C3C]/30" />
            </div>

            {/* 3. The Headline: Bold yet Elegant */}
            <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-[1.1] mb-8">
              Himalayan{" "}
              <span className="italic font-light text-gray-500">Harvest</span>
            </h2>

            {/* 4. Elegant Vertical Divider */}
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#D84C3C] to-transparent mb-8" />

            {/* 5. The Narrative Paragraph */}
            <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto">
              Discover how we nurture{" "}
              <span className="text-gray-900 font-medium italic">
                premium apples
              </span>{" "}
              with a blend of time-honored traditions and{" "}
              <span className="text-gray-900 font-medium">
                thoughtful modern practices
              </span>
              in the pristine foothills of the Himalayas.
            </p>

            {/* 6. Subtle Signature (Optional) */}
            <div className="mt-10 flex items-center gap-3 opacity-60">
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                Est. 2024
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                Himachal Pradesh
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="px-6 py-20 bg-[#fdfdfb]">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-green-600 font-bold uppercase tracking-[0.2em] text-xs mb-3 block"
          >
            Our Community
          </motion.span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Follow the Harvest
          </h2>

          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-6" />

          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Step into our Himalayan orchards. Get the freshest updates on our
            <span className="text-green-800 font-medium">
              {" "}
              organic harvests
            </span>{" "}
            and apple collections.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-4 py-10">
          {/* Instagram Card */}
          <motion.a
            href="https://www.instagram.com/range.of.himalayas"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            className="group relative block"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-orange-400/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative overflow-hidden rounded-[3rem] bg-white/80 backdrop-blur-xl p-12 flex flex-col items-center text-center border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_48px_80px_-16px_rgba(236,72,153,0.2)] transition-all duration-500">
              {/* Ghost Icon Overlay */}
              <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                <FaInstagram className="text-[12rem] -rotate-12" />
              </div>

              {/* Main Icon Wrapper */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <FaInstagram className="text-5xl text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600" />
                </div>
              </div>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Instagram
              </h3>
              <p className="text-green-600 font-bold text-lg mb-8 tracking-wide italic">
                @range.of.himalayas
              </p>

              {/* Adaptive Button */}
              <div className="mt-auto flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl group-hover:bg-green-700 transition-all duration-300 shadow-xl shadow-slate-900/10 group-hover:shadow-green-900/20">
                <span className="font-bold uppercase tracking-widest text-xs">
                  Explore Gallery
                </span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </motion.a>

          {/* Facebook Card */}
          <motion.a
            href="https://www.facebook.com/rangeofhimalayas"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            transition={{ delay: 0.1 }}
            className="group relative block"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative overflow-hidden rounded-[3rem] bg-white/80 backdrop-blur-xl p-12 flex flex-col items-center text-center border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] group-hover:shadow-[0_48px_80px_-16px_rgba(37,99,235,0.2)] transition-all duration-500">
              {/* Ghost Icon Overlay */}
              <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                <FaFacebook className="text-[12rem] -rotate-12" />
              </div>

              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex items-center justify-center transform group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <FaFacebook className="text-5xl text-blue-600" />
                </div>
              </div>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Facebook
              </h3>
              <p className="text-green-600 font-bold text-lg mb-8 tracking-wide italic">
                @rangeofhimalayas
              </p>

              <div className="mt-auto flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl group-hover:bg-green-700 transition-all duration-300 shadow-xl shadow-slate-900/10 group-hover:shadow-green-900/20">
                <span className="font-bold uppercase tracking-widest text-xs">
                  Join Community
                </span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      <HomeBlog />
      <section className="px-6 py-20 bg-[#fafaf9]">
        <div className="max-w-6xl mx-auto text-center">
          {/* Refined Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Orchard Moments
          </motion.div>

          {/* Hero Heading */}
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mt-6 mb-4 tracking-tight">
            From Orchard{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              to Table
            </span>
          </h2>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-12">
            Witness the journey of our orchards through the seasons—a
            celebration of purity, tradition, and mindful farming.
          </p>

          {/* Elegant Category Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentIndex(0);
                  setCurrentImageIndex(0);
                }}
                className={`relative px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-500 overflow-hidden
            ${
              activeCategory === cat
                ? "text-white shadow-[0_10px_25px_-5px_rgba(220,38,38,0.4)]"
                : "bg-white text-slate-600 border border-slate-200 hover:border-red-200 hover:text-red-600"
            }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          {/* Main Gallery Display */}
          {loading ? (
            <GallerySkeleton />
          ) : filteredItems.length > 0 ? (
            <div className="relative group max-w-5xl mx-auto">
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={filteredItems[currentIndex]?.images[currentImageIndex]}
                    src={filteredItems[currentIndex]?.images[currentImageIndex]}
                    alt={filteredItems[currentIndex]?.title}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Glass Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl text-left"
                  >
                    <span className="px-3 py-1 bg-red-600/20 backdrop-blur-md border border-red-500/30 text-red-100 rounded-lg text-xs font-bold uppercase tracking-tighter">
                      {filteredItems[currentIndex]?.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-white mt-4 mb-2 tracking-tight">
                      {filteredItems[currentIndex]?.title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed line-clamp-2 font-light">
                      {filteredItems[currentIndex]?.desc}
                    </p>
                  </motion.div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={prevSlide}
                    className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white hover:text-black transition-all transform hover:scale-110"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white hover:text-black transition-all transform hover:scale-110"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Cinematic Thumbnails */}
              <div className="flex justify-center gap-4 mt-10">
                {filteredItems[currentIndex].images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="relative group"
                  >
                    <div
                      className={`w-28 h-20 rounded-2xl overflow-hidden border-4 transition-all duration-500 ${
                        index === currentImageIndex
                          ? "border-red-600 scale-110 shadow-lg"
                          : "border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {index === currentImageIndex && (
                      <motion.div
                        layoutId="thumbGlow"
                        className="absolute inset-0 bg-red-600/20 blur-xl -z-10"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
              No moments found in this category.
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
        <CustomerReviews />
      </section>
      <Footer />
    </div>
  );
}
