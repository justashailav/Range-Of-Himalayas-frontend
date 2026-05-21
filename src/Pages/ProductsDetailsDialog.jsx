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
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import StarRatingComponent from "./Star-Review";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ShoppingProductTile from "./Product-tile";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
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
  const [openSection, setOpenSection] = useState(null);

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

  const handleBuyNow = () => {
    if (!selectedVariant) return;

    const finalPrice =
      selectedVariant.salesPrice > 0
        ? selectedVariant.salesPrice
        : selectedVariant.price;

    // ✅ Create Buy Now product object
    const buyNowItem = {
      productId: productDetails._id,
      title: productDetails.title,
      image: productDetails.image,
      price: finalPrice,
      quantity: 1,
      size: selectedVariant.size || "",
      weight: selectedVariant.weight,
    };

    // ✅ Redirect to checkout with data
    navigate("/checkout", { state: buyNowItem });
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
                  {/* --- MINIMALIST CLOSE UI --- */}\
                  <motion.button
                    onClick={() => setOpen(false)} // Or your close function
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-6 right-6 md:top-12 md:right-12 flex items-center gap-6 z-[110] group"
                  >
                    {/* The Text Label */}
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] md:text-[10px] font-black text-stone-400 group-hover:text-[#B23A2E] uppercase tracking-[0.5em] transition-colors duration-500">
                        Exit
                      </span>
                      <span className="text-[8px] font-serif italic text-stone-300 group-hover:text-stone-400 transition-colors duration-500 hidden md:block">
                        Archive
                      </span>
                    </div>

                    {/* Vertical Divider Line */}
                    <div className="h-10 w-[1px] bg-stone-200 group-hover:bg-[#B23A2E] transition-colors duration-500 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-[#B23A2E]"
                        initial={{ y: "100%" }}
                        whileHover={{ y: "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    {/* The Icon */}
                    <div className="relative">
                      <X
                        className="text-stone-300 group-hover:text-stone-900 group-hover:rotate-90 transition-all duration-700 ease-in-out"
                        size={18}
                        strokeWidth={1}
                      />
                    </div>
                  </motion.button>
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
              <div className="mt-16 overflow-hidden rounded-[2.5rem] bg-white border border-stone-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                {/* HEADER */}
                <div className="px-10 py-8 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center shadow-lg rotate-3">
                      <ClipboardList size={18} className="text-stone-100" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-900">
                        Harvest Specifications
                      </h3>
                      <p className="text-[9px] font-medium text-stone-400 uppercase tracking-widest mt-0.5">
                        Authenticity & Quality Ledger
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-full border border-stone-100">
                    <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      Batch v.2026.04
                    </span>
                  </div>
                </div>

                {/* DATA GRID */}
                <div className="px-10 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
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
                          className="group flex flex-col py-6 border-b border-stone-100 last:border-0 md:[&:nth-last-child(2)]:border-b transition-colors hover:bg-stone-50/50 -mx-4 px-4 rounded-xl"
                        >
                          {/* Changed items-start to flex-col on small screens to prevent clipping */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 sm:gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-stone-600 transition-colors shrink-0">
                              {key.replace(/_/g, " ")}
                            </span>

                            {/* 1. Removed max-w-[60%] to give text room to wrap
                   2. Added break-words for long certification numbers 
                   3. Changed text alignment for mobile 
                */}
                            <span className="text-[13px] md:text-sm font-serif italic text-stone-900 text-left sm:text-right leading-relaxed break-words overflow-hidden">
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="bg-stone-50/80 px-10 py-4 flex justify-between items-center border-t border-stone-100">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-[1px] bg-stone-200" />
                    ))}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-300">
                    Range of Himalayas • Certified Source
                  </span>
                </div>
              </div>
            )}
            {/* ---------------- NORMAL PRODUCT ---------------- */}
            {/* ---------------- NUTRITION SECTION ---------------- */}
            <div className="mt-12">
              {/* SECTION TITLE */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-stone-800"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500">
                  Nutritional Information
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-stone-800"></div>
              </div>

              {/* SINGLE PRODUCT NUTRITION */}
              {!productDetails?.isCombo && productDetails?.nutrition && (
                <div className="relative group">
                  {/* Subtle Background Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-stone-800 to-stone-700 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                  <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-900/80 backdrop-blur-sm border border-stone-800 shadow-2xl">
                    <div className="px-10 py-8">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                        {Object.entries(productDetails.nutrition)
                          .filter(
                            ([key, value]) =>
                              !["_id", "__v"].includes(key) && value,
                          )
                          .map(([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-xl font-medium text-stone-100 leading-none">
                                {value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMBO PRODUCT NUTRITION */}
              {productDetails?.isCombo &&
                productDetails?.comboNutrition?.length > 0 && (
                  <div className="space-y-4">
                    {productDetails.comboNutrition.map((item, index) => (
                      <div
                        key={index}
                        className="group overflow-hidden rounded-[1.5rem] bg-stone-900 border border-stone-800/60 hover:border-stone-700 transition-colors shadow-xl"
                      >
                        {/* HEADER */}
                        <div className="px-6 py-3 bg-stone-950/50 border-b border-stone-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-[#B23A2E]/10">
                              <Leaf size={14} className="text-[#B23A2E]" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-tighter text-stone-200">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-[9px] font-medium px-2 py-0.5 rounded border border-stone-800 text-stone-500 uppercase">
                            Part {index + 1}
                          </div>
                        </div>

                        {/* NUTRITION GRID */}
                        <div className="px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                          {Object.entries(item.nutrition || {})
                            .filter(
                              ([key, value]) =>
                                !["_id", "__v"].includes(key) && value,
                            )
                            .map(([key, value]) => (
                              <div key={key} className="space-y-0.5">
                                <p className="text-[9px] font-semibold uppercase tracking-widest text-stone-500">
                                  {key}
                                </p>
                                <p className="text-base font-medium text-stone-200">
                                  {value}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
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

              {/* BENEFITS */}
{productDetails?.benefits?.length > 0 && (
  <div className="mt-16">
    <button
      onClick={() =>
        setOpenSection(
          openSection === "benefits" ? null : "benefits",
        )
      }
      className="w-full flex items-center justify-between group"
    >
      <div className="flex items-center gap-4 w-full">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 shrink-0">
          Product Benefits
        </span>

        <div className="h-[1px] w-full bg-stone-200/80"></div>
      </div>

      <ChevronDown
        size={18}
        className={`ml-4 text-stone-400 transition-transform duration-500 ${
          openSection === "benefits" ? "rotate-180" : ""
        }`}
      />
    </button>

    <div
      className={`grid transition-all duration-700 ease-in-out overflow-hidden ${
        openSection === "benefits"
          ? "grid-rows-[1fr] opacity-100 mt-10"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="grid gap-y-6 pl-1">
          {productDetails.benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-5 group relative"
            >
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="w-5 h-5 rounded-full bg-[#942820]/5 flex items-center justify-center transition-colors group-hover:bg-[#942820]/10">
                  <Leaf size={11} className="text-[#942820]" />
                </div>

                {index !== productDetails.benefits.length - 1 && (
                  <div className="w-[1px] h-12 bg-stone-100 mt-2 absolute top-6 left-2.5"></div>
                )}
              </div>

              <p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

{/* HOW TO USE */}
{productDetails?.howToUse?.length > 0 && (
  <div className="mt-16">
    <button
      onClick={() =>
        setOpenSection(
          openSection === "usage" ? null : "usage",
        )
      }
      className="w-full flex items-center justify-between group"
    >
      <div className="flex items-center gap-4 w-full">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-400 shrink-0">
          Application & Ritual
        </span>

        <div className="h-[1px] w-full bg-stone-200/80"></div>
      </div>

      <ChevronDown
        size={18}
        className={`ml-4 text-stone-400 transition-transform duration-500 ${
          openSection === "usage" ? "rotate-180" : ""
        }`}
      />
    </button>

    <div
      className={`grid transition-all duration-700 ease-in-out overflow-hidden ${
        openSection === "usage"
          ? "grid-rows-[1fr] opacity-100 mt-10"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="grid gap-y-10 sm:gap-y-12">
          {productDetails.howToUse.map((step, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr] gap-2 md:gap-6 items-start group"
            >
              <div className="text-xs font-mono font-medium tracking-widest text-stone-400/80 group-hover:text-stone-800 transition-colors duration-300 md:pt-0.5">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="border-l border-stone-100 md:border-l-0 pl-4 md:pl-0">
                <p className="text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
              
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

              {/* Tax Text */}
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">
                Inclusive of all botanical duties & taxes
              </p>

              {/* NEW: Dispatch Info */}
              <p className="text-[10px] font-semibold tracking-wide text-[#B23A2E] ml-1 mt-1">
                🚚 Dispatch starts from{" "}
                <span className="font-bold">18 April</span>
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
              <div className="relative group overflow-hidden">
                {/* MAIN CONTAINER */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-stone-100 px-8 py-5 rounded-[2rem] w-full sm:w-fit transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-orange-100">
                  {/* LABEL (Optional but adds premium feel) */}
                  <div className="hidden lg:block border-r border-stone-100 pr-6 mr-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      Evaluation
                    </span>
                  </div>

                  {/* RATING COMPONENT */}
                  <div className="scale-110 sm:scale-100 origin-center sm:origin-left transition-transform duration-500 group-hover:scale-[1.05]">
                    <StarRatingComponent
                      rating={rating}
                      onChange={handleRatingChange}
                    />
                  </div>

                  {/* DECORATIVE ELEMENT */}
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-orange-500"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
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
              {/* SUBMIT ACTION */}
              <Button
                onClick={handleAddReview}
                className="w-full bg-stone-900 text-white py-6 font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.5rem] hover:bg-[#B23A2E] transition-all duration-500 shadow-xl hover:-translate-y-1 active:scale-[0.98]"
              >
                Submit to the Archive
              </Button>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch">
              {/* ⚡ BUY NOW - High Impact Primary */}
              <button
                disabled={!selectedVariant}
                onClick={handleBuyNow}
                className="
      group
      relative overflow-hidden
      w-full sm:flex-[1.5]
      bg-[#B23A2E] text-white
      px-8 py-4
      text-[12px] font-bold uppercase tracking-[0.2em]
      rounded-xl
      shadow-[0_10px_20px_-10px_rgba(178,58,46,0.4)]
      hover:shadow-[0_20px_30px_-10px_rgba(178,58,46,0.5)]
      hover:-translate-y-0.5
      active:scale-[0.98]
      transition-all duration-300
      flex items-center justify-center gap-2
      disabled:opacity-40 disabled:pointer-events-none
    "
              >
                <Zap
                  size={15}
                  className="fill-current group-hover:animate-pulse"
                />
                <span>Buy Now</span>
              </button>

              {/* 🛒 ADD TO CART - Sophisticated Secondary */}
              <button
                onClick={() => {
                  setIsAddingToCart(true);
                  handleAddToCart(
                    productDetails._id,
                    selectedVariant.stock,
                    selectedVariant.size,
                    selectedVariant.weight,
                  );
                  setTimeout(() => setIsAddingToCart(false), 800);
                }}
                className="
      relative overflow-hidden
      w-full sm:flex-1
      bg-stone-900 text-white
      px-8 py-4
      text-[12px] font-bold uppercase tracking-[0.2em]
      rounded-xl
      hover:bg-stone-800
      hover:-translate-y-0.5
      active:scale-[0.98]
      transition-all duration-300
      flex items-center justify-center
    "
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-[10px]">Adding...</span>
                  </div>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>

              {/* ❤️ WISHLIST - Clean Utility */}
              <button
                disabled={!selectedVariant}
                onClick={() => {
                  handleAddToWishList(
                    productDetails._id,
                    selectedVariant.stock,
                    selectedVariant.size || "",
                    selectedVariant.weight,
                  );
                }}
                className="
      aspect-square h-[56px] w-[56px]
      rounded-xl
      border-2 border-stone-100
      flex items-center justify-center
      text-stone-400
      hover:border-stone-900 hover:text-stone-900
      hover:bg-white
      transition-all duration-300
      disabled:opacity-30
      group
    "
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-125 ${productDetails.isWishlisted ? "fill-red-500 stroke-red-500" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-32 max-w-6xl mx-auto px-6 pb-32">
          {/* SECTION HEADER: Editorial Style */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="space-y-4">
              <motion.h4
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-[#B23A2E]"
              >
                Public Ledger
              </motion.h4>
              <h2 className="text-5xl md:text-7xl font-black text-stone-900 uppercase tracking-tighter leading-[0.85]">
                Collector <br />
                <span className="font-serif italic capitalize tracking-normal text-[#B23A2E] ml-0 md:ml-12">
                  Testimonials
                </span>
              </h2>
            </div>
            <div className="hidden md:block text-right max-w-xs">
              <p className="text-[11px] font-serif italic text-stone-400 leading-relaxed">
                A chronological record of acquisitions and experiences
                documented by our global community of enthusiasts.
              </p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="py-32 text-center border border-stone-100 bg-[#fdfcf7]">
              <p className="text-stone-400 font-serif italic text-xl">
                The archive is currently awaiting its first entry.
              </p>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {/* We use vertical gaps here because each review is now a 'physical' box */}
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  /* THE BOX DESIGN: 
         - bg-[#fdfcf7]: A warm, premium paper white
         - border-stone-200: Sharp, clean definition
         - shadow-sm: Lifted off the page
      */
                  className="group relative grid grid-cols-1 md:grid-cols-12 bg-[#fdfcf7] border border-stone-200 p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-[#B23A2E]/30 transition-all duration-700"
                >
                  {/* TOP DECOR: Corner Stamp (Mobile Only) */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10px] right-[-10px] w-8 h-8 bg-stone-50 rotate-45 border-b border-stone-200" />
                  </div>

                  {/* INDEX: Side Margin Numbering */}
                  <div className="hidden md:flex col-span-1 flex-col justify-start">
                    <span className="text-[10px] font-black text-[#B23A2E] opacity-40">
                      REF_{String(i + 1).padStart(3, "0")}
                    </span>
                  </div>

                  {/* LEFT COL: IDENTITY & STATUS */}
                  <div className="md:col-span-3 mb-10 md:mb-0 space-y-8">
                    <div className="relative inline-block">
                      {/* Boxed Initial */}
                      <div className="w-20 h-20 bg-stone-900 flex items-center justify-center text-white font-serif italic text-4xl shadow-lg group-hover:bg-[#B23A2E] transition-colors duration-500">
                        {r.userName.charAt(0)}
                      </div>
                      {/* Red Detail Tag */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#B23A2E] border-4 border-[#fdfcf7] rounded-full" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-stone-900 leading-none">
                          {r.userName}
                        </h3>
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-2">
                          {dayjs(r.createdAt).format("MMM YYYY")}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                          Identity Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COL: THE CONTENT */}
                  <div className="md:col-span-8 md:pl-12 flex flex-col justify-between">
                    <div className="space-y-10">
                      {/* Header Info */}
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex gap-1.5 p-2 bg-stone-50 border border-stone-100">
                          {[...Array(5)].map((_, starIdx) => (
                            <div
                              key={starIdx}
                              className={`w-2 h-2 ${
                                starIdx < r.reviewValue
                                  ? "bg-[#B23A2E]"
                                  : "bg-stone-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">
                          Grade: {r.reviewValue}.0
                        </span>
                      </div>

                      <blockquote className="relative">
                        {/* Hanging Quotation Mark */}
                        <span className="absolute -top-6 -left-4 text-6xl text-stone-100 font-serif pointer-events-none">
                          “
                        </span>
                        <p className="text-xl md:text-3xl font-serif italic text-stone-800 leading-relaxed relative z-10">
                          {r.reviewMessage ||
                            "An exceptional addition to the private collection."}
                        </p>
                      </blockquote>
                    </div>

                    {/* Action/Footer Area */}
                    <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 italic">
                          Record No.{" "}
                          {Math.random()
                            .toString(36)
                            .substr(2, 9)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="h-[1px] flex-1 mx-8 bg-stone-50 hidden md:block" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B23A2E]">
                        Verified Acquisition
                      </span>
                    </div>
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
