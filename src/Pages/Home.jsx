import React, { useEffect, useState } from "react";
import bgImage from "../assets/bgImage.png";
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
import { motion, AnimatePresence } from "framer-motion";
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

const categories = ["All", "Orchard", "Harvesting", "Products", "Farm"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();
  const { images: galleryItems, loading } = useSelector(
    (state) => state.gallery
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

    const normalizedSize = size || ""; // ✅ size optional

    const getCartItems = cartItems?.items || [];

    const existingItemIndex = getCartItems.findIndex(
      (item) =>
        item.productId.toString() === getCurrentProductId.toString() &&
        (item.size || "") === normalizedSize &&
        item.weight === weight
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
      })
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

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

      <Link to="/viewproducts">
        <motion.img
          src={bgImage}
          alt="Banner"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-64 sm:h-96 md:h-[600px] lg:h-[750px] object-cover shadow-lg"
        />
      </Link>

      <div className="border-[#FAD4B3] border-b-1 mt-10 h-[2px] w-full"></div>
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 font-bold text-3xl text-[#D84C3C]"
        >
          Himalayan Selections
        </motion.h1>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {productList && productList.length > 0 ? (
            productList.slice(0, 3).map((item) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                className="will-change-transform"
              >
                <Link
                  to={`/product/${item._id}`}
                  onClick={() => handleGetProductDetails(item)}
                  className="block h-full"
                >
                  <TopSelections product={item} />
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found
            </p>
          )}
        </motion.div>
      </div>
      <div className="overflow-hidden relative bg-red-600 py-2 mt-4">
        <div className="animate-marquee whitespace-nowrap text-white font-semibold text-lg flex gap-8">
          <span>🍎 Fresh Himalayan Apples – Direct from Orchard to You 🍏</span>
          <span>🍎 Organic, Wax-Free, Handpicked with Love 🌿</span>
          <span>🍎 Premium Quality Apples – Taste the Himalayas 🏔</span>
        </div>
      </div>

      <div className="px-5 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full"
        >
          <div>
            <h1 className="mt-8 font-bold text-3xl text-[#D84C3C]">
              Trending Now
            </h1>
          </div>

          <div className="w-full sm:w-auto">
            <Link to="/viewproducts">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto mt-4 sm:mt-8 bg-[#D84C3C] text-white cursor-pointer px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-[#b53e30] transition duration-300 ease-in-out"
              >
                View All Products
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative p-10"
      >
        {/* LEFT ARROW */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="swiper-button-prev-custom absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* RIGHT ARROW */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="swiper-button-next-custom absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>

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
          {productList.map((item, index) => (
            <SwiperSlide key={item._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: index * 0.1, // ✨ stagger effect
                }}
              >
                <ShoppingProductTile
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleAddToWishList={handleAddToWishList}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 py-4"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
          >
            🍎 From Orchard to You
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold mt-4 mb-3"
          >
            Why Range Of Himalayas?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-xl max-w-2xl mx-auto"
          >
            Every apple is a reflection of our passion for purity, timeless
            tradition, and uncompromising quality.
          </motion.p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: index * 0.12, // ✨ stagger
              }}
              whileHover={{
                y: -6,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.08)",
              }}
              className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 transition"
            >
              <h3 className="font-semibold text-lg text-green-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-12 sm:mt-16 md:mt-18 overflow-hidden rounded-xl"
      >
        <motion.img
          src={foundersImage}
          alt="Founder"
          className="w-full h-64 sm:h-96 md:h-[500px] lg:h-[680px] object-cover shadow-lg rounded-xl"
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 py-12"
      >
        <div className="text-center mb-10">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
          >
            🍎 From Our Orchards
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mt-4 mb-3"
          >
            Himalayan Harvest
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-gray-600 text-xl max-w-2xl mx-auto"
          >
            Discover how we nurture premium apples with a blend of time-honored
            traditions and thoughtful modern practices in the pristine Himalayan
            foothills.
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="px-6 py-12 bg-white"
      >
        {/* Heading */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-2"
          >
            Follow Us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-gray-600 text-xl"
          >
            🌱 Get the freshest updates on our harvests and apple collections
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {/* Instagram */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="p-6 border border-green-200 rounded-xl text-center bg-white shadow-sm hover:shadow-md"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4"
            >
              <FaInstagram className="text-3xl text-pink-600" />
            </motion.div>

            <h3 className="font-semibold text-lg">Instagram</h3>
            <p className="text-gray-600">@range.of.himalayas</p>

            <motion.a
              href="https://www.instagram.com/range.of.himalayas"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="text-green-700 font-medium mt-2 inline-block"
            >
              Follow →
            </motion.a>
          </motion.div>

          {/* Facebook */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="p-6 border border-green-200 rounded-xl text-center bg-white shadow-sm hover:shadow-md"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -3 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4"
            >
              <FaFacebook className="text-3xl text-blue-600" />
            </motion.div>

            <h3 className="font-semibold text-lg">Facebook</h3>
            <p className="text-gray-600">@rangeofhimalayas</p>

            <motion.a
              href="https://www.facebook.com/rangeofhimalayas"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="text-green-700 font-medium mt-2 inline-block"
            >
              Follow →
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
      <HomeBlog />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="px-6 py-12 text-center"
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
        >
          🌿 Orchard Moments
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mt-4 mb-3"
        >
          🍏 From Orchard to Table
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-gray-600 text-xl max-w-2xl mx-auto"
        >
          Witness the journey of our orchards through the seasons — a
          celebration of purity, tradition, and mindful farming at Range Of
          Himalayas.
        </motion.p>

        {/* Category Buttons */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-wrap justify-center gap-3 mt-6 mb-8"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
                setCurrentImageIndex(0);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
          ${
            activeCategory === cat
              ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:scale-105"
          }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery */}
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : filteredItems.length > 0 ? (
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.img
                key={filteredItems[currentIndex]?.images[currentImageIndex]}
                src={filteredItems[currentIndex]?.images[currentImageIndex]}
                alt={filteredItems[currentIndex]?.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </AnimatePresence>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full shadow-md hover:bg-black/80 transition"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full shadow-md hover:bg-black/80 transition"
            >
              <FaArrowRight />
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-6 left-4 bg-black/80 text-white p-4 rounded-lg text-left max-w-lg"
            >
              <span className="text-xs bg-red-600 px-2 py-0.5 rounded-md">
                {filteredItems[currentIndex]?.category}
              </span>
              <h3 className="font-semibold text-xl mt-2">
                {filteredItems[currentIndex]?.title}
              </h3>
              <p className="text-sm text-gray-200 mt-1">
                {filteredItems[currentIndex]?.desc}
              </p>
            </motion.div>
          </div>
        ) : (
          <p className="text-gray-500">No images found</p>
        )}
        {filteredItems.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            {filteredItems[currentIndex].images.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt="thumb"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 transition
            ${
              index === currentImageIndex
                ? "border-red-600"
                : "border-transparent"
            }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
        <CustomerReviews />
      </section>
      <Footer />
    </div>
  );
}
