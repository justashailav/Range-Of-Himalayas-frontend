import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
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
      (v) => (hasSize ? v.size === size : true) && v.weight === weight
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
        item.weight === weight
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
      })
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
    weight
  ) {
    if (!user?._id) {
      toast.error(
        "Oops! You need to login first to add items to your wishlist."
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
            }`
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
      })
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
              className="relative overflow-hidden rounded-xl bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.img
                key={mainImage} // 🔑 IMPORTANT for cross-fade
                src={mainImage}
                alt={productDetails?.title}
                onClick={() => setIsImageOpen(true)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) {
                    const i = allImages.indexOf(mainImage);
                    setMainImage(allImages[(i + 1) % allImages.length]);
                  }
                  if (info.offset.x > 80) {
                    const i = allImages.indexOf(mainImage);
                    setMainImage(
                      allImages[(i - 1 + allImages.length) % allImages.length]
                    );
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full object-contain mx-auto rounded-lg cursor-zoom-in"
              />
            </motion.div>
            <AnimatePresence>
              {isImageOpen && (
                <motion.div
                  className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsImageOpen(false)}
                >
                  <motion.img
                    src={mainImage}
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.92, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="max-w-[90vw] max-h-[90vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {allImages.length > 1 && (
              <div className="mt-3 overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 snap-x snap-mandatory">
                  {allImages.map((img, idx) => {
                    const isActive = mainImage === img;

                    return (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`Variant ${idx}`}
                        onMouseEnter={() => setMainImage(img)}
                        onClick={() => setMainImage(img)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 w-24 h-24 object-cover rounded-lg cursor-pointer
    ${
      mainImage === img
        ? "border-2 border-[#F08C7D] ring-2 ring-[#F08C7D]/40"
        : "border border-gray-300 hover:border-[#F08C7D]"
    }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {productDetails?.details && (
              <motion.div
                className={`rounded-xl mt-4 border shadow-sm bg-white
      transition-all duration-500
       md:top-28
      ${variantHighlight ? "ring-2 ring-[#F08C7D]/40" : ""}
    `}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* HEADER */}
                <button
                  onClick={() => setInfoOpen((p) => !p)}
                  className="w-full flex items-center justify-between px-6 py-4 font-bold text-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    Product Information
                  </div>
                  <motion.span
                    animate={{ rotate: infoOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xl"
                  >
                    ⌃
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {infoOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden px-6 pb-6"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: {
                            transition: { staggerChildren: 0.08 },
                          },
                        }}
                        className="space-y-3"
                      >
                        {Object.entries(productDetails.details)
                          .filter(([key]) => !["_id", "__v"].includes(key))
                          .map(([key, value]) => (
                            <motion.div
                              key={key}
                              variants={{
                                hidden: { opacity: 0, y: 12 },
                                visible: { opacity: 1, y: 0 },
                              }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              whileHover={{ backgroundColor: "#FFEAC2" }}
                              className="flex justify-between items-center p-2 rounded-lg"
                            >
                              <span className="font-medium text-gray-800 capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {value}
                              </span>
                            </motion.div>
                          ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {productDetails?.nutrition && (
              <motion.div
                className={`rounded-xl mt-4 border shadow-sm bg-white
      transition-all duration-500
       md:top-28
      ${variantHighlight ? "ring-2 ring-[#F08C7D]/40" : ""}
    `}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* HEADER */}
                <button
                  onClick={() => setInfoOpen((p) => !p)}
                  className="w-full flex items-center justify-between px-6 py-4 font-bold text-xl"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍎</span>
                    Nutrition
                  </div>
                  <motion.span
                    animate={{ rotate: infoOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xl"
                  >
                    ⌃
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {infoOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden px-6 pb-6"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: {
                            transition: { staggerChildren: 0.08 },
                          },
                        }}
                        className="space-y-3"
                      >
                        {Object.entries(productDetails.nutrition)
                          .filter(([key]) => !["_id", "__v"].includes(key))
                          .map(([key, value]) => (
                            <motion.div
                              key={key}
                              variants={{
                                hidden: { opacity: 0, y: 12 },
                                visible: { opacity: 1, y: 0 },
                              }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              whileHover={{ backgroundColor: "#FFEAC2" }}
                              className="flex justify-between items-center p-2 rounded-lg"
                            >
                              <span className="font-medium text-gray-800 capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {value}
                              </span>
                            </motion.div>
                          ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mt-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-green-600 font-semibold text-sm">
                {viewers}
              </span>
              <span className="text-gray-800 text-sm font-medium">
                People are watching
              </span>
            </div>
            <div className="font-semibold text-gray-700">
              RANGE OF HIMALAYAS
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {productDetails?.title}
            </h1>
            <p className="text-gray-700 text-base leading-relaxed">
              {productDetails?.description}
            </p>

            {/* Size & Weight */}
            <div className="flex gap-4 flex-wrap">
              {/* SIZE — ONLY IF EXISTS */}
              {hasSize && (
                <div className="flex-1">
                  <label className="block text-gray-800 font-medium mb-1">
                    Select Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      const newSize = e.target.value;
                      setSelectedSize(newSize);
                      setSelectedWeight(getWeightsBySize(newSize)[0]);
                    }}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F08C7D]"
                  >
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* WEIGHT — ALWAYS REQUIRED */}
              <div className="flex-1">
                <label className="block text-gray-800 font-medium mb-1">
                  Select Weight
                </label>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F08C7D]"
                >
                  {getWeightsBySize(selectedSize).map((weight) => {
                    const variant = getVariant(selectedSize, weight);
                    return (
                      <option
                        key={weight}
                        value={weight}
                        disabled={variant.stock === 0}
                      >
                        {weight}
                        {variant.salesPrice > 0 && " (Sale)"}
                        {variant.stock === 0 && " (Out of Stock)"}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-4">
              {selectedVariant?.salesPrice > 0 ? (
                <>
                  <p className="text-gray-500 text-xl line-through">
                    ₹{selectedVariant.price.toFixed(2)}
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{selectedVariant.salesPrice.toFixed(2)}
                  </p>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    SAVE{" "}
                    {Math.round(
                      100 -
                        (selectedVariant.salesPrice / selectedVariant.price) *
                          100
                    )}
                    %
                  </span>
                </>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  ₹{selectedVariant?.price.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-10">
              {selectedVariant?.stock > 0 ? (
                <p
                  className={`text-sm font-medium ${
                    selectedVariant.stock < 5
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {selectedVariant.stock < 5
                    ? "Low stock!"
                    : `In stock: ${selectedVariant.stock}`}
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of stock</p>
              )}
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                    Free Shipping
                  </span>
                </p>
              </div>
            </div>

            {/* Review Section */}
            <div className="flex flex-col items-start gap-2 mb-4">
              <label className="font-semibold text-gray-700">Your Rating</label>
              <div className="flex items-center gap-2">
                <StarRatingComponent
                  rating={rating}
                  onChange={handleRatingChange}
                />
                <span className="text-sm text-gray-600">
                  {rating > 0 ? `${rating} / 5` : "Select Rating"}
                </span>
              </div>
            </div>
            <textarea
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Write your review here..."
              className="w-full border border-gray-300 rounded-md p-3 text-gray-800 focus:ring-2 focus:ring-[#F08C7D] focus:outline-none mb-4"
              rows="5"
            />
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Upload Images (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-600"
              />
              {reviewImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {reviewImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleAddReview}
              className="w-full bg-[#F08C7D] text-white py-3 font-semibold rounded-md hover:bg-[#e77b6c] transition"
            >
              Submit Review
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.div
                animate={isAddingToCart ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => {
                    setIsAddingToCart(true);
                    handleAddToCart(
                      productDetails._id,
                      selectedVariant.stock,
                      selectedVariant.size,
                      selectedVariant.weight
                    );
                    setTimeout(() => setIsAddingToCart(false), 300);
                  }}
                  className="w-full bg-[#F08C7D] text-white py-4 font-semibold rounded-md"
                >
                  Add to Cart
                </Button>
              </motion.div>

              <Button
                disabled={!selectedVariant}
                onClick={() => {
                  if (!selectedVariant) return;
                  handleAddToWishList(
                    productDetails._id,
                    selectedVariant.stock,
                    selectedVariant.size || "",
                    selectedVariant.weight
                  );
                }}
                className="flex-1 bg-white border-2 border-[#F08C7D] text-[#F08C7D] py-4 font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-[#F08C7D] hover:text-white transition disabled:opacity-50"
              >
                <Heart /> Wishlist
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10  mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {productDetails?.title}
                    </h3>
                    <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center mb-2">
                    {[...Array(r.reviewValue)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                    {[...Array(5 - r.reviewValue)].map((_, i) => (
                      <span key={i} className="text-gray-300 text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review message */}
                  <p className="text-gray-700 text-sm italic mb-4">
                    "{r.reviewMessage}"
                  </p>

                  {/* Review image */}
                  {r.reviewImages?.length > 0 && (
                    <img
                      src={`http://localhost:3000/${r.reviewImages[0].replace(
                        "\\",
                        "/"
                      )}`}
                      alt="review"
                      className="w-full h-56 object-cover rounded-xl shadow mb-4"
                    />
                  )}

                  {/* User info */}
                  <div className="flex items-center gap-4 border-t pt-3">
                    <div className="bg-blue-500 text-white font-semibold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                      {r.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{r.userName}</p>
                      <p className="text-xs text-gray-500">
                        {dayjs(r.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-10">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Explore More from Range of Himalayas
          </h2>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
          >
            {productList.map((item) => (
              <SwiperSlide key={item._id}>
                <ShoppingProductTile
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleAddToWishList={handleAddToWishList}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
