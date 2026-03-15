import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Heart,
  Leaf,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import StarRatingComponent from "./Star-Review";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ShoppingProductTile from "./Product-tile";
import { useParams } from "react-router-dom";
import {
  addProductReview,
  getProductReviews,
} from "@/store/slices/reviewSlice";
import { fetchProductDetails } from "@/store/slices/productsSlice";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import {
  addToWishList,
  fetchWishListItems,
} from "@/store/slices/wishlistSlice";
import { FaStar } from "react-icons/fa";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import { socket } from "@/utils/socket";
import { motion, AnimatePresence } from "framer-motion";
export default function ProductsDetailsDialog() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const productDetails = useSelector((state) => state.product.productDetails);
  const { user } = useSelector((state) => state.auth);
  const { reviews, message, success } = useSelector((state) => state.reviews);
  const { productList } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishListItems } = useSelector((state) => state.wishList);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [infoOpen, setInfoOpen] = useState(true);
  const [variantHighlight, setVariantHighlight] = useState(false);

  const variants = productDetails?.variants || [];

  const hasSize = variants.some((v) => v.size && v.size !== "");

  const sizes = hasSize
    ? [...new Set(variants.map((v) => v.size).filter(Boolean))]
    : [];
  const getWeightsBySize = (size) =>
    hasSize
      ? variants.filter((v) => v.size === size).map((v) => v.weight)
      : variants.map((v) => v.weight);

  const getVariant = (size, weight) =>
    variants.find(
      (v) => (hasSize ? v.size === size : true) && v.weight === weight,
    ) || null;
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
      dispatch(getProductReviews(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (selectedVariant) {
      setVariantHighlight(true);
      const t = setTimeout(() => setVariantHighlight(false), 600);
      return () => clearTimeout(t);
    }
  }, [selectedVariant]);

  /* ---------------- INIT VARIANT ---------------- */
  useEffect(() => {
    if (!variants.length) return;

    const firstVariant = variants[0];

    setSelectedSize(firstVariant.size || "");
    setSelectedWeight(firstVariant.weight);

    setSelectedVariant(firstVariant);
    setMainImage(firstVariant.images?.[0] || productDetails?.image);
  }, [productDetails]);

  /* ---------------- UPDATE VARIANT ---------------- */
  useEffect(() => {
    if (!selectedWeight) return;

    const variant = getVariant(selectedSize, selectedWeight);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.images?.[0] || productDetails?.image);
    }
  }, [selectedSize, selectedWeight]);

  // Show toast for review messages
  useEffect(() => {
    if (message) {
      toast[success ? "success" : "error"](message);
    }
  }, [message, success]);
  useEffect(() => {
    if (!id) return;

    socket.emit("joinProduct", id);
    socket.on("productViewers", (count) => setViewers(count));

    return () => {
      socket.emit("leaveProduct", id);
      socket.off("productViewers");
    };
  }, [id]);

  const handleRatingChange = (getRating) => setRating(getRating);
  const handleImageChange = (e) => setReviewImages(Array.from(e.target.files));

  const handleAddReview = () => {
    if (!user?._id) {
      toast.error("You need to login first to submit a review.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productDetails?._id);
    formData.append("userId", user?._id);
    formData.append("userName", user?.name);
    formData.append("reviewMessage", reviewMsg);
    formData.append("reviewValue", rating);
    reviewImages.forEach((file) => formData.append("reviewImages", file));

    dispatch(addProductReview(formData)).then((data) => {
      if (data?.success) {
        setRating(0);
        setReviewMsg("");
        setReviewImages([]);
        dispatch(getProductReviews(productDetails?._id));
      }
      // toast handled by slice message
    });
  };

  const handleAddToCart = (productId, stock, size, weight) => {
    if (!user?._id) {
      toast.error("Oops! You need to login first to add items to your cart.");
      return;
    }

    const existingItem = cartItems?.items?.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.size === size &&
        item.weight === weight,
    );

    if (existingItem && existingItem.quantity + 1 > stock) {
      toast.error(`Only ${stock} items available for this variant`);
      return;
    }

    dispatch(
      addToCart({
        userId: user._id,
        productId,
        quantity: 1,
        size,
        weight,
      }),
    ).then((data) => {
      if (data?.success) {
        dispatch(fetchCartItems(user._id));
        toast.success("Product added to cart");
      } else {
        toast.error(data?.message || "Failed to add item");
      }
    });
  };

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
  if (!productDetails) return null;

  const allImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : [productDetails?.image, ...(productDetails?.images || [])];

  return (
    <div className="bg-[#FFF8E1] min-h-screen pt-4">
      <Helmet>
        <title>
          {productDetails?.title
            ? `${productDetails.title} | Range Of Himalayas`
            : "Range Of Himalayas | Fresh Apples, Kiwis "}
        </title>
        <meta
          name="description"
          content={
            productDetails?.description
              ? `${productDetails.description} | Buy fresh apples, kiwis  directly from the mountains.`
              : "Range Of Himalayas offers premium apples, kiwis, — naturally grown and harvested from the heart of the Himalayas."
          }
        />
      </Helmet>
      <div className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-stone-50 border border-stone-100 group shadow-2xl shadow-stone-200/50 mt-4"
            >
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={mainImage}
              >
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={productDetails?.title}
                  onClick={() => setIsImageOpen(true)}
                  // --- ADVANCED DRAG LOGIC ---
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6} // More "rubbery" feel for premium UX
                  onDragEnd={(e, info) => {
                    const i = allImages.indexOf(mainImage);
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      setMainImage(allImages[(i + 1) % allImages.length]);
                    } else if (info.offset.x > swipeThreshold) {
                      setMainImage(
                        allImages[
                          (i - 1 + allImages.length) % allImages.length
                        ],
                      );
                    }
                  }}
                  // --- DIRECTIONAL ANIMATION ---
                  // We use a slight slide + scale to mimic a physical gallery card
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  // Spring physics make it feel significantly more expensive than "ease"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 },
                  }}
                  className="w-full h-full object-cover cursor-zoom-in group-active:cursor-grabbing select-none"
                />
              </AnimatePresence>

              {/* Image Counter Badge */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-stone-900/10 backdrop-blur-lg rounded-full z-20">
                <p className="text-[10px] font-black tracking-[0.3em] text-stone-900 uppercase">
                  {allImages.indexOf(mainImage) + 1}{" "}
                  <span className="text-stone-400">/</span> {allImages.length}
                </p>
              </div>
            </motion.div>
            <AnimatePresence>
              {isImageOpen && (
                <motion.div
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 backdrop-blur-xl cursor-zoom-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsImageOpen(false)}
                >
                  {/* --- MINIMALIST CLOSE UI --- */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-10 right-10 flex items-center gap-4 z-[110]"
                  >
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.4em] hidden md:block">
                      Close Archive
                    </span>
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/10 hover:bg-white/20 transition-colors">
                      <X className="text-white" size={20} />
                    </div>
                  </motion.div>

                  {/* --- PRODUCT IMAGE --- */}
                  <motion.img
                    src={mainImage}
                    alt="Product Zoom"
                    initial={{ scale: 0.8, opacity: 0, rotateY: 10 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotateY: -10 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      opacity: { duration: 0.4 },
                    }}
                    className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* --- BOTANICAL FOOTER --- */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
                  >
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">
                      {productDetails?.title}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {allImages.length > 1 && (
              <div className="mt-8 relative">
                {/* Subtle gradient edges to show there is more to scroll */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FFFDF7] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFFDF7] to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 overflow-x-auto scrollbar-hide px-1 py-2">
                  {allImages.map((img, idx) => {
                    const isActive = mainImage === img;

                    return (
                      <div key={idx} className="relative flex-shrink-0 group">
                        <motion.img
                          src={img}
                          alt={`Archive view ${idx}`}
                          onMouseEnter={() => setMainImage(img)}
                          onClick={() => setMainImage(img)}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                w-20 aspect-[4/5] object-cover rounded-2xl cursor-pointer
                transition-all duration-500 ease-out
                ${
                  isActive
                    ? "shadow-2xl shadow-stone-200 border-2 border-stone-900 scale-105"
                    : "grayscale-[0.4] opacity-60 hover:grayscale-0 hover:opacity-100 border border-stone-100"
                }
              `}
                        />

                        {/* Active Indicator Dot */}
                        {isActive && (
                          <motion.div
                            layoutId="activeThumb"
                            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {productDetails?.details && (
              <div className="mt-12 overflow-hidden rounded-[2rem] bg-stone-50/50 border border-stone-100 shadow-sm">
                {/* HEADER */}
                <div className="px-8 py-6 border-b border-stone-100 bg-white/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
                      <ClipboardList size={14} className="text-white" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">
                      Harvest Specifications
                    </h3>
                  </div>
                  <span className="text-[10px] font-serif italic text-stone-400">
                    Ver. 2026.04
                  </span>
                </div>

                {/* DATA GRID */}
                <div className="px-8 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    {Object.entries(productDetails.details)
                      .filter(
                        ([key, value]) =>
                          !["_id", "__v"].includes(key) &&
                          value !== null &&
                          value !== undefined &&
                          value !== "",
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-baseline py-4 border-b border-stone-100 last:border-0 md:[&:nth-last-child(2)]:border-0"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-serif italic text-stone-900 text-right">
                            {value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* FOOTER DECORATION */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#B23A2E]/20 to-transparent" />
              </div>
            )}

            {productDetails?.nutrition && (
              <div className="mt-8 overflow-hidden rounded-[2.5rem] bg-stone-900 text-stone-100 border border-stone-800 shadow-2xl">
                {/* HEADER */}
                <div className="px-8 py-8 border-b border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#B23A2E] flex items-center justify-center shadow-lg shadow-[#B23A2E]/20">
                      <Leaf size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                        Nutritional Values
                      </h3>
                      <p className="text-lg font-serif italic text-white leading-none mt-1">
                        Per 100g serving
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block px-4 py-1 border border-stone-700 rounded-full text-[8px] font-black uppercase tracking-widest text-stone-500">
                    Lab Verified
                  </div>
                </div>

                {/* NUTRITION GRID */}
                <div className="px-8 py-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {Object.entries(productDetails.nutrition)
                      .filter(
                        ([key, value]) =>
                          !["_id", "__v"].includes(key) &&
                          value !== null &&
                          value !== undefined &&
                          value !== "",
                      )
                      .map(([key, value]) => (
                        <div key={key} className="space-y-1 group">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 group-hover:text-[#B23A2E] transition-colors">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-2xl font-light tracking-tighter text-white">
                            {value}
                          </p>
                          {/* Subtle underline decoration */}
                          <div className="h-[1px] w-full bg-stone-800 group-hover:bg-stone-700 transition-colors" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* FOOTER NOTE */}
                <div className="px-8 py-4 bg-stone-800/50 flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#B23A2E] rounded-full animate-pulse" />
                  <p className="text-[9px] font-medium text-stone-500 italic tracking-wider">
                    Pure Himalayan produce. Values may vary with seasonal
                    harvest.
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 bg-stone-50 w-fit px-4 py-2 rounded-full border border-stone-100/60 shadow-sm"
            >
              {/* Live indicator - Earthy Tone */}
              <div className="relative flex items-center justify-center">
                <motion.span
                  animate={{
                    scale: [1, 2.2, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inline-flex h-3 w-3 rounded-full bg-[#B23A2E]"
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#B23A2E]" />
              </div>

              {/* Text & Counter */}
              <div className="flex items-center gap-1.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={viewers}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="text-[11px] font-black text-stone-900 tabular-nums"
                  >
                    {viewers}
                  </motion.span>
                </AnimatePresence>

                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-500">
                  Collectors Browsing the Archive
                </span>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
              }}
              className="space-y-4"
            >
              {/* Brand Name - Minimalist & Spaced */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-3"
              >
                <span className="h-[1px] w-8 bg-[#B23A2E]" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B23A2E]">
                  Range of Himalayas
                </span>
              </motion.div>

              {/* Product Title - Massive & Bold */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl font-black text-stone-900 leading-[0.9] tracking-tighter uppercase"
              >
                {productDetails?.title}
              </motion.h1>

              {/* Description - Elegant & Atmospheric */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="relative pl-6 border-l border-stone-100"
              >
                <p className="text-stone-600 text-lg font-serif italic leading-relaxed max-w-xl">
                  {productDetails?.description}
                </p>

                {/* Decorative Origin Note */}
                <span className="absolute -left-1 top-0 text-[8px] font-black text-stone-300 uppercase [writing-mode:vertical-lr] rotate-180">
                  Authentic Origin
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* SIZE SELECTION */}
              {hasSize && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">
                    Dimensional Scale
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedSize}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        setSelectedSize(newSize);
                        setSelectedWeight(getWeightsBySize(newSize)[0]);
                      }}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-stone-200 outline-none appearance-none cursor-pointer transition-all hover:bg-stone-100/50"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover:text-stone-600 transition-colors"
                      size={16}
                    />
                  </div>
                </motion.div>
              )}

              {/* WEIGHT SELECTION */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">
                  Harvest Weight
                </label>
                <div className="relative group">
                  <select
                    value={selectedWeight}
                    onChange={(e) => setSelectedWeight(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-stone-200 outline-none appearance-none cursor-pointer transition-all hover:bg-stone-100/50"
                  >
                    {getWeightsBySize(selectedSize).map((weight) => {
                      const variant = getVariant(selectedSize, weight);
                      return (
                        <option
                          key={weight}
                          value={weight}
                          disabled={variant.stock === 0}
                          className="py-2"
                        >
                          {weight}{" "}
                          {variant.salesPrice > 0 ? "— Special Offer" : ""}{" "}
                          {variant.stock === 0 ? "(Vaulted)" : ""}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none group-hover:text-stone-600 transition-colors"
                    size={16}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Price & Stock */}
            <div className="flex flex-col gap-1 py-4">
              <div className="flex items-baseline gap-4">
                {selectedVariant?.salesPrice > 0 ? (
                  <>
                    {/* Main Sale Price */}
                    <p className="text-4xl font-black text-stone-900 tracking-tighter">
                      ₹
                      {selectedVariant.salesPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    {/* Original Price */}
                    <p className="text-lg font-medium text-stone-300 line-through decoration-stone-300">
                      ₹
                      {selectedVariant.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>

                    {/* Minimalist Savings Tag */}
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B23A2E] bg-[#B23A2E]/5 px-3 py-1 rounded-full border border-[#B23A2E]/20">
                      {Math.round(
                        100 -
                          (selectedVariant.salesPrice / selectedVariant.price) *
                            100,
                      )}
                      % Rare Discovery
                    </span>
                  </>
                ) : (
                  <p className="text-4xl font-black text-stone-900 tracking-tighter">
                    ₹
                    {selectedVariant?.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>

              {/* Subtext for Tax/Logistics */}
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">
                Inclusive of all botanical duties & taxes
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
              {/* STOCK STATUS */}
              <div className="flex items-center gap-2.5">
                {selectedVariant?.stock > 0 ? (
                  <>
                    {/* Dynamic Status Dot */}
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        selectedVariant.stock < 5
                          ? "bg-[#B23A2E] animate-pulse"
                          : "bg-stone-400"
                      }`}
                    />

                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                        selectedVariant.stock < 5
                          ? "text-[#B23A2E]"
                          : "text-stone-500"
                      }`}
                    >
                      {selectedVariant.stock < 5
                        ? "Critical Reserve — Low Stock"
                        : `Available Yield: ${selectedVariant.stock}`}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      Currently Vaulted
                    </p>
                  </>
                )}
              </div>

              {/* SHIPPING PROMISE */}
              <div className="flex items-center gap-3">
                <div className="h-4 w-[1px] bg-stone-200 hidden sm:block" />{" "}
                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-stone-100">
                    <Truck size={12} className="text-stone-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
                    Complimentary Transit
                  </span>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="flex flex-col items-start gap-4 py-6 border-t border-stone-100 mt-8">
              {/* LABEL */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 block">
                  Product Evaluation
                </label>
                <p className="text-xl font-serif italic text-stone-900 leading-none">
                  How would you rate this harvest?
                </p>
              </div>

              {/* RATING INTERFACE */}
              <div className="flex items-center gap-6 bg-stone-50 px-6 py-4 rounded-2xl border border-stone-100 w-full sm:w-auto transition-all hover:bg-stone-100/50">
                <div className="scale-110 origin-left">
                  <StarRatingComponent
                    rating={rating}
                    onChange={handleRatingChange}
                  />
                </div>

                {/* VERTICAL DIVIDER */}
                <div className="h-6 w-[1px] bg-stone-200" />

                <span className="text-[11px] font-black uppercase tracking-widest text-stone-900 min-w-[100px]">
                  {rating > 0 ? (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {rating} / 5 Score
                    </motion.span>
                  ) : (
                    <span className="text-stone-400">Select Grade</span>
                  )}
                </span>
              </div>
            </div>
            <div className="space-y-6 mt-6">
              {/* REVIEW TEXTAREA */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 block ml-1">
                  Written Testimony
                </label>
                <textarea
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Describe the texture, aroma, and essence of this harvest..."
                  className="w-full bg-stone-50 border border-stone-100 rounded-[2rem] p-6 text-sm text-stone-900 focus:ring-2 focus:ring-stone-200 outline-none placeholder:text-stone-300 shadow-inner min-h-[160px] transition-all"
                  rows="5"
                />
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-900 block">
                      Visual Evidence
                    </label>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                      Optional Imagery (JPG, PNG)
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="archive-upload"
                    />
                    <label
                      htmlFor="archive-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 cursor-pointer hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 shadow-sm"
                    >
                      <Camera size={14} />
                      Attach Photos
                    </label>
                  </div>
                </div>

                {/* IMAGE PREVIEW GRID */}
                {reviewImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 pt-6 border-t border-stone-100"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4 ml-1">
                      Selected Imagery ({reviewImages.length})
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <AnimatePresence>
                        {reviewImages.map((img, idx) => (
                          <motion.div
                            key={idx} // If names aren't unique, consider using the file object itself or a unique ID
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{
                              opacity: 0,
                              scale: 0.5,
                              transition: { duration: 0.2 },
                            }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group"
                          >
                            {/* The Image Chip */}
                            <div className="relative w-24 h-24 overflow-hidden rounded-2xl border-2 border-white shadow-sm transition-transform duration-500 group-hover:scale-105">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
                              />

                              {/* Refined Overlay */}
                              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-[8px] text-white font-black uppercase tracking-[0.2em] translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                  View
                                </span>
                              </div>
                            </div>

                            {/* Remove Action */}
                            <button
                              onClick={() => {
                                const newImages = [...reviewImages];
                                newImages.splice(idx, 1);
                                setReviewImages(newImages);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-400 hover:text-[#B23A2E] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 border border-stone-50"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* SUBMIT ACTION */}
              <Button
                onClick={handleAddReview}
                className="w-full bg-stone-900 text-white py-6 font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.5rem] hover:bg-[#B23A2E] transition-all duration-500 shadow-xl hover:-translate-y-1 active:scale-[0.98]"
              >
                Submit to the Archive
              </Button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-5 items-center">
              {/* PRIMARY CTA: ACQUIRE TO BASKET */}
              <button
                onClick={() => {
                  setIsAddingToCart(true);
                  handleAddToCart(
                    productDetails._id,
                    selectedVariant.stock,
                    selectedVariant.size,
                    selectedVariant.weight,
                  );
                  setTimeout(() => setIsAddingToCart(false), 250);
                }}
                className="
      relative overflow-hidden
      w-full sm:flex-1
      bg-stone-900 text-white
      px-12 py-5
      text-[11px] font-black uppercase tracking-[0.3em]
      rounded-2xl
      shadow-xl hover:shadow-2xl
      hover:bg-[#B23A2E]
      active:scale-[0.97]
      transition-all duration-500
      flex items-center justify-center
    "
              >
                <span
                  className={
                    isAddingToCart
                      ? "opacity-0"
                      : "opacity-100 transition-opacity"
                  }
                >
                  Acquire to Basket
                </span>

                {/* Minimalist Loading Overlay */}
                {isAddingToCart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/2 animate-shimmer" />
                    </div>
                  </div>
                )}
              </button>

              {/* SECONDARY CTA: WISHLIST ICON */}
              <button
                disabled={!selectedVariant}
                onClick={() => {
                  if (!selectedVariant) return;
                  handleAddToWishList(
                    productDetails._id,
                    selectedVariant.stock,
                    selectedVariant.size || "",
                    selectedVariant.weight,
                  );
                }}
                className="
      h-16 w-16
      rounded-2xl
      border border-stone-200
      flex items-center justify-center
      text-stone-400
      hover:border-stone-900
      hover:text-stone-900
      hover:bg-stone-50
      transition-all duration-300
      disabled:opacity-30
      group
    "
              >
                <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-20 max-w-4xl mx-auto px-4">
          {/* SECTION HEADER */}
          <div className="text-center mb-16 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
              The Archive
            </h4>
            <h2 className="text-4xl font-black text-stone-900 uppercase tracking-tighter">
              Collector Testimonials
            </h2>
            <div className="h-[1px] w-12 bg-stone-200 mx-auto mt-4" />
          </div>

          {reviews.length === 0 ? (
            <div className="py-20 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
              <p className="text-stone-400 font-serif italic text-lg">
                The archive is currently empty. Be the first to document your
                experience.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group pb-12 border-b border-stone-100 last:border-0"
                >
                  {/* HEADER: USER & RATING */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      {/* Profile Initial - Elegant Stone Circle */}
                      <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 font-black text-sm">
                        {r.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-900">
                          {r.userName}
                        </h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-tight">
                          {dayjs(r.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={12}
                            fill={starIdx < r.reviewValue ? "#B23A2E" : "none"}
                            className={
                              starIdx < r.reviewValue
                                ? "text-[#B23A2E]"
                                : "text-stone-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#B23A2E] bg-[#B23A2E]/5 px-2 py-1 rounded-md border border-[#B23A2E]/10">
                        Verified Acquisition
                      </span>
                    </div>
                  </div>

                  {/* CONTENT: TEXT & IMAGES */}
                  <div className="space-y-6 pl-0 md:pl-16">
                    <p className="text-xl font-serif italic text-stone-800 leading-relaxed italic">
                      "{r.reviewMessage}"
                    </p>

                    {r.reviewImages?.length > 0 && (
                      <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-xl max-w-2xl">
                        <img
                          src={`http://localhost:3000/${r.reviewImages[0].replace("\\", "/")}`}
                          alt="review imagery"
                          className="w-full h-80 object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="py-24 bg-stone-50/50">
          <div className="max-w-[1400px] mx-auto px-6 relative">
            {/* SECTION HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E]">
                  Extend the Journey
                </h4>
                <h2 className="text-4xl font-black text-stone-900 uppercase tracking-tighter">
                  Further Discoveries
                </h2>
              </div>

              {/* CUSTOM NAVIGATION BUTTONS */}
              <div className="flex gap-3">
                <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all duration-300 bg-white shadow-sm">
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all duration-300 bg-white shadow-sm">
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* SWIPER CAROUSEL */}
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".swiper-button-prev-custom",
                nextEl: ".swiper-button-next-custom",
              }}
              spaceBetween={32}
              slidesPerView={1}
              grabCursor={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
              className="pb-12"
            >
              {productList.map((item) => (
                <SwiperSlide key={item._id} className="h-full">
                  <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-stone-100/50 hover:shadow-xl transition-shadow duration-500">
                    <ShoppingProductTile
                      product={item}
                      handleAddToCart={handleAddToCart}
                      handleAddToWishList={handleAddToWishList}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* BOTTOM DECORATION */}
            <div className="mt-12 flex justify-center">
              <div className="h-[1px] w-24 bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
