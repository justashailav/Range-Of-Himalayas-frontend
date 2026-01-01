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

    const normalizedSize = size || "";

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

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Link to="/viewproducts">
          <motion.img
            src={bgImage}
            alt="Banner"
            className="w-full h-64 sm:h-96 md:h-[600px] lg:h-[750px] object-cover shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          />
        </Link>
      </motion.div>
      <div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="text-center mt-8 font-bold text-3xl text-[#D84C3C]"
        >
          Himalayan Selections
        </motion.h1>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
        >
          {productList && productList.length > 0 ? (
            productList.slice(0, 3).map((item) => (
              <motion.div
                key={item._id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
          <div>
            <h1 className="mt-8 font-bold text-3xl text-[#D84C3C]">
              Trending Now
            </h1>
          </div>

          <div className="w-full sm:w-auto">
            <Link to="/viewproducts">
              <button className="w-full sm:w-auto mt-4 sm:mt-8 bg-[#D84C3C] text-white cursor-pointer px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-[#b53e30] transition duration-300 ease-in-out">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="relative p-10">
        {/* LEFT ARROW */}
        <button className="swiper-button-prev-custom absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200">
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* RIGHT ARROW */}
        <button className="swiper-button-next-custom absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200">
          <ChevronRight className="w-5 h-5" />
        </button>

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
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
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
      </div>

      <div>
        {/* HEADER */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🍎 From Orchard to You
          </span>

          <h1 className="text-4xl font-bold mt-4 mb-3">
            Why Range Of Himalayas?
          </h1>

          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Every apple is a reflection of our passion for purity, timeless
            tradition, and uncompromising quality.
          </p>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 transition"
            >
              <h3 className="font-semibold text-lg text-green-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-18 overflow-hidden rounded-xl">
        <img
          src={foundersImage}
          alt="Founder"
          className="w-full h-64 sm:h-96 md:h-[500px] lg:h-[680px] object-cover shadow-lg rounded-xl"
        />
      </div>
      <div className="px-6 py-12">
        <div className="text-center mb-10">
          {/* Badge */}
          <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🍎 From Our Orchards
          </span>

          {/* Heading */}
          <h1 className="text-4xl font-bold mt-4 mb-3">Himalayan Harvest</h1>

          {/* Paragraph */}
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Discover how we nurture premium apples with a blend of time-honored
            traditions and thoughtful modern practices in the pristine Himalayan
            foothills.
          </p>
        </div>
      </div>
      <div className="px-6 py-12 bg-white">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">Follow Us</h2>

          <p className="text-gray-600 text-xl">
            🌱 Get the freshest updates on our harvests and apple collections
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Instagram */}
          <div className="p-6 border border-green-200 rounded-xl text-center bg-white shadow-sm hover:shadow-md">
            <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
              <FaInstagram className="text-3xl text-pink-600" />
            </div>

            <h3 className="font-semibold text-lg">Instagram</h3>
            <p className="text-gray-600">@range.of.himalayas</p>

            <a
              href="https://www.instagram.com/range.of.himalayas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-medium mt-2 inline-block"
            >
              Follow →
            </a>
          </div>

          {/* Facebook */}
          <div className="p-6 border border-green-200 rounded-xl text-center bg-white shadow-sm hover:shadow-md">
            <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
              <FaFacebook className="text-3xl text-blue-600" />
            </div>

            <h3 className="font-semibold text-lg">Facebook</h3>
            <p className="text-gray-600">@rangeofhimalayas</p>

            <a
              href="https://www.facebook.com/rangeofhimalayas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 font-medium mt-2 inline-block"
            >
              Follow →
            </a>
          </div>
        </div>
      </div>

      <HomeBlog />
      <div className="px-6 py-12 text-center">
        {/* Badge */}
        <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          🌿 Orchard Moments
        </span>

        {/* Heading */}
        <h1 className="text-4xl font-bold mt-4 mb-3">
          🍏 From Orchard to Table
        </h1>

        {/* Paragraph */}
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Witness the journey of our orchards through the seasons — a
          celebration of purity, tradition, and mindful farming at Range Of
          Himalayas.
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
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
            </button>
          ))}
        </div>

        {/* Gallery */}
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : filteredItems.length > 0 ? (
          <div className="relative max-w-3xl mx-auto">
            <>
              <img
                key={filteredItems[currentIndex]?.images[currentImageIndex]}
                src={filteredItems[currentIndex]?.images[currentImageIndex]}
                alt={filteredItems[currentIndex]?.title}
                className="w-full h-full object-cover rounded-xl shadow-md"
              />
            </>
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
            <div className="absolute bottom-6 left-4 bg-black/80 text-white p-4 rounded-lg text-left max-w-lg">
              <span className="text-xs bg-red-600 px-2 py-0.5 rounded-md">
                {filteredItems[currentIndex]?.category}
              </span>
              <h3 className="font-semibold text-xl mt-2">
                {filteredItems[currentIndex]?.title}
              </h3>
              <p className="text-sm text-gray-200 mt-1">
                {filteredItems[currentIndex]?.desc}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No images found</p>
        )}
        {filteredItems.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            {filteredItems[currentIndex].images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
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
      </div>

      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
        <CustomerReviews />
      </section>
      <Footer />
    </div>
  );
}
