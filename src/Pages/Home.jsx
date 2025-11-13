// import React, { useEffect, useState } from "react";
// import bgImage from "../assets/bgImage.png";
// import foundersImage from "../assets/foundersLetter.png";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaInstagram,
//   FaFacebook,
//   FaArrowLeft,
//   FaArrowRight,
// } from "react-icons/fa";
// import ShoppingProductTile from "./Product-tile";
// import { useDispatch, useSelector } from "react-redux";
// import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
// import { toast } from "react-toastify";
// import TopSelections from "./TopSelections";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   addToWishList,
//   fetchWishListItems,
// } from "@/store/slices/wishlistSlice";
// import { getGalleryItems } from "@/store/slices/gallerySlice";
// import Footer from "./Footer";
// import CustomerReviews from "./CustomerReview";
// import { Helmet } from "react-helmet";
// import RecentOrdersPopup from "./RecentOrderPopup";
// import Blog from "./Blog";
// import HomeBlog from "./HomeBlogs";

// const categories = ["All", "Orchard", "Harvesting", "Products", "Farm"];

// export default function Home() {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const dispatch = useDispatch();
//   const { images: galleryItems, loading } = useSelector(
//     (state) => state.gallery
//   );

//   useEffect(() => {
//     dispatch(getGalleryItems());
//   }, [dispatch]);

//   const filteredItems =
//     activeCategory === "All"
//       ? galleryItems
//       : galleryItems.filter((item) => item.category === activeCategory);
//   const prevSlide = () => {
//     if (currentImageIndex > 0) {
//       setCurrentImageIndex((prev) => prev - 1);
//     } else {
//       const prevItemIndex =
//         currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
//       setCurrentIndex(prevItemIndex);
//       setCurrentImageIndex(filteredItems[prevItemIndex].images.length - 1);
//     }
//   };

//   const nextSlide = () => {
//     if (currentImageIndex < filteredItems[currentIndex].images.length - 1) {
//       setCurrentImageIndex((prev) => prev + 1);
//     } else {
//       const nextItemIndex =
//         currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
//       setCurrentIndex(nextItemIndex);
//       setCurrentImageIndex(0);
//     }
//   };
//   const features = [
//     {
//       title: "🍎 Naturally Wax-Free",
//       desc: "Fresh, natural apples — no artificial coatings, no chemicals.",
//     },
//     {
//       title: "🌍 Eco-Friendly Cultivation",
//       desc: "Harvested responsibly with care for the environment",
//     },
//     {
//       title: "🍏 Age-Old Wisdom",
//       desc: "Generational farming knowledge, perfected with time",
//     },
//     {
//       title: "🏔 From Our Himalayas",
//       desc: "Direct from orchard to table for ultimate freshness.",
//     },
//   ];

//   const { productList } = useSelector((state) => state.products);
//   const { productDetails } = useSelector((state) => state.product);
//   const { cartItems } = useSelector((state) => state.cart);
//   const { wishListItems } = useSelector((state) => state.wishList);
//   const { user } = useSelector((state) => state.auth);

//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const [openCartSheet, setOpenCartSheet] = useState(false);
//   const navigate = useNavigate();

//   // function handleGetProductDetails(product) {
//   //   navigate(`/product/${product._id}`);
//   //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   // }

//   function handleAddToCart(getCurrentProductId, getTotalStock, size, weight) {
//     if (!user?._id) {
//       toast.error("Oops! You need to login first to add items to your cart.");
//       return;
//     }
//     const getCartItems = cartItems?.items || [];
//     const existingItemIndex = getCartItems.findIndex(
//       (item) =>
//         item.productId.toString() === getCurrentProductId.toString() &&
//         item.size === size &&
//         item.weight === weight
//     );

//     if (existingItemIndex > -1) {
//       const currentQuantity = getCartItems[existingItemIndex].quantity;
//       if (currentQuantity + 1 > getTotalStock) {
//         toast.error(`Only ${getTotalStock} items available for this variant`);
//         return;
//       }
//     }

//     dispatch(
//       addToCart({
//         userId: user?._id,
//         productId: getCurrentProductId,
//         quantity: 1,
//         size,
//         weight,
//       })
//     )
//       .then((data) => {
//         if (data?.success) {
//           dispatch(fetchCartItems(user?._id));
//           toast.success("Product added to cart");
//           setOpenCartSheet(true);
//         } else {
//           toast.error(data?.message || "Failed to add item");
//         }
//       })
//       .catch((err) => {
//         toast.error(err || "Failed to add item");
//       });
//   }

//   function handleAddToWishList(
//     getCurrentProductId,
//     getTotalStock,
//     size,
//     weight
//   ) {
//     if (!user?._id) {
//       toast.error(
//         "Oops! You need to login first to add items to your wishlist."
//       );
//       return;
//     }

//     const getWishListItems = wishListItems?.items || [];

//     if (getWishListItems.length) {
//       const indexOfCurrentItem = getWishListItems.findIndex((item) => {
//         const sameProduct =
//           item.productId.toString() === getCurrentProductId.toString();
//         const sameSize = item.size === size;
//         const sameWeight =
//           (item.weight &&
//             weight &&
//             item.weight.toString() === weight.toString()) ||
//           (!item.weight && !weight);
//         return sameProduct && sameSize && sameWeight;
//       });

//       if (indexOfCurrentItem > -1) {
//         const currentQuantity = getWishListItems[indexOfCurrentItem].quantity;
//         if (currentQuantity + 1 > getTotalStock) {
//           toast.error(
//             `Only ${getTotalStock} quantity available for this size${
//               weight ? " and weight" : ""
//             }`
//           );
//           return;
//         }
//       }
//     }

//     dispatch(
//       addToWishList({
//         userId: user?._id,
//         productId: getCurrentProductId,
//         quantity: 1,
//         size,
//         weight,
//       })
//     ).then((data) => {
//       if (data?.success) {
//         dispatch(fetchWishListItems(user?._id));
//         toast.success("Product added to wishlist");
//         setOpenCartSheet(true);
//       } else {
//         toast.error(data?.message || "Failed to add item");
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   return (
//     <div className="bg-[#FFF8E1] overflow-x-hidden">
//       <Helmet>
//         <title>Range Of Himalayas | Fresh Apples, Kiwis</title>
//         <meta
//           name="description"
//           content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
//         />
//       </Helmet>
//       <div className="overflow-hidden relative bg-red-600 py-2">
//         <div className="animate-marquee whitespace-nowrap text-white font-semibold text-lg flex gap-8">
//           <span>
//             🎁 Use code{" "}
//             <span className="text-yellow-400 font-bold">HIMALAYA10</span> to get
//             10% off! 🍎
//           </span>
//           <span>🌿 Free gift on orders above ₹2000 – Limited Time!</span>
//           <span>🚚 Fast delivery from our orchards directly to you!</span>
//         </div>
//       </div>

//       <a href="/viewproducts">
//         <img
//           src={bgImage}
//           alt="Banner"
//           className="w-full h-64 sm:h-96 md:h-[600px] lg:h-[750px] object-cover shadow-lg"
//         />
//       </a>

//       <div className="border-[#FAD4B3] border-b-1 mt-10 h-[2px] w-full"></div>
//       <div>
//         <h1 className="text-center mt-8 font-bold text-3xl text-[#D84C3C]">
//           Himalayan Selections
//         </h1>
//         <div>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10">
//             {productList && productList.length > 0 ? (
//               productList.slice(0, 3).map((item) => (
//                 <a
//                   key={item._id}
//                   href={`/product/${item._id}`}
//                   onClick={() => handleGetProductDetails(item)}
//                   className="block hover:-translate-y-1 transition-transform duration-300"
//                 >
//                   <TopSelections product={item} />
//                 </a>
//               ))
//             ) : (
//               <p>No products found</p>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="overflow-hidden relative bg-red-600 py-2 mt-4">
//         <div className="animate-marquee whitespace-nowrap text-white font-semibold text-lg flex gap-8">
//           <span>🍎 Fresh Himalayan Apples – Direct from Orchard to You 🍏</span>
//           <span>🍎 Organic, Wax-Free, Handpicked with Love 🌿</span>
//           <span>🍎 Premium Quality Apples – Taste the Himalayas 🏔</span>
//         </div>
//       </div>

//       <div className="px-5 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between">
//         <div>
//           <h1 className="mt-8 font-bold text-3xl text-[#D84C3C]">
//             Trending Now
//           </h1>
//         </div>
//         <div className="w-full sm:w-auto">
//           <a href="/viewproducts">
//             <button className="w-full sm:w-auto mt-4 sm:mt-8 bg-[#D84C3C] text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-[#b53e30] transition duration-300 ease-in-out">
//               View All Products
//             </button>
//           </a>
//         </div>
//       </div>
//       <div className="relative p-10">
//         <button
//           className="swiper-button-prev-custom absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <button
//           className="swiper-button-next-custom absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition duration-200"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>

//         <Swiper
//           modules={[Navigation]}
//           navigation={{
//             prevEl: ".swiper-button-prev-custom",
//             nextEl: ".swiper-button-next-custom",
//           }}
//           spaceBetween={30}
//           slidesPerView={1}
//           breakpoints={{
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//         >
//           {productList.map((item) => (
//             <SwiperSlide key={item._id}>

//                 <ShoppingProductTile
//                   product={item}
//                   handleAddToCart={handleAddToCart}
//                   handleAddToWishList={handleAddToWishList}
//                 />

//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <div className="px-6 py-4">
//         <div className="text-center mb-10">
//           <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//             🍎 From Orchard to You
//           </span>
//           <h1 className="text-4xl font-bold mt-4 mb-3">
//             Why Range Of Himalayas?
//           </h1>
//           <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//             Every apple is a reflection of our passion for purity, timeless
//             tradition, and uncompromising quality.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition"
//             >
//               <h3 className="font-semibold text-lg text-green-700">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="mt-12 sm:mt-16 md:mt-18">
//         <img
//           src={foundersImage}
//           alt="Founder"
//           className="w-full h-64 sm:h-96 md:h-[500px] lg:h-[680px] object-cover shadow-lg rounded-xl"
//         />
//       </div>

//       <div className="px-6 py-12">
//         <div className="text-center mb-10">
//           <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//             🍎 From Our Orchards
//           </span>
//           <h1 className="text-4xl font-bold mt-4 mb-3">Himalayan Harvest</h1>
//           <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//             Discover how we nurture premium apples with a blend of time-honored
//             traditions and thoughtful modern practices in the pristine Himalayan
//             foothills.
//           </p>
//         </div>
//       </div>
//       <div className="px-6 py-12 bg-white ">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-bold mb-2">Follow Us</h2>
//           <p className="text-gray-600 text-xl">
//             🌱 Get the freshest updates on our harvests and apple collections
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
//           <div className="p-6 border border-green-200 rounded-xl text-center hover:shadow-md transition">
//             <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
//               <FaInstagram className="text-3xl text-pink-600" />
//             </div>
//             <h3 className="font-semibold text-lg">Instagram</h3>
//             <p className="text-gray-600">@range.of.himalayas</p>
//             <a
//               href="https://www.instagram.com/range.of.himalayas"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-green-700 font-medium mt-2 inline-block"
//             >
//               Follow →
//             </a>
//           </div>
//           <div className="p-6 border border-green-200 rounded-xl text-center hover:shadow-md transition">
//             <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
//               <FaFacebook className="text-3xl text-blue-600" />
//             </div>
//             <h3 className="font-semibold text-lg">Facebook</h3>
//             <p className="text-gray-600">@rangeofhimalayas</p>
//             <a
//               href="https://www.facebook.com/rangeofhimalayas"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-green-700 font-medium mt-2 inline-block"
//             >
//               Follow →
//             </a>
//           </div>
//         </div>
//       </div>
//       <HomeBlog />
//       <div className="px-6 py-12 text-center">
//         <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//           🌿 Orchard Moments
//         </span>
//         <h1 className="text-4xl font-bold mt-4 mb-3">
//           🍏 From Orchard to Table
//         </h1>
//         <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//           Witness the journey of our orchards through the seasons — a
//           celebration of purity, tradition, and mindful farming at Range Of
//           Himalayas.
//         </p>
//         <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setCurrentIndex(0);
//                 setCurrentImageIndex(0);
//               }}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform
//         ${
//           activeCategory === cat
//             ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105"
//             : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:scale-105"
//         }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <p className="text-gray-500">Loading images...</p>
//         ) : filteredItems.length > 0 ? (
//           <div className="relative max-w-3xl mx-auto">
//             <img
//               src={filteredItems[currentIndex]?.images[currentImageIndex]}
//               alt={filteredItems[currentIndex]?.title}
//               className="w-full h-full object-cover rounded-xl shadow-md"
//             />
//             <button
//               onClick={prevSlide}
//               className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60  text-white p-3 rounded-full shadow-md hover:bg-black/80"
//             >
//               <FaArrowLeft />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full shadow-md hover:bg-black/80"
//             >
//               <FaArrowRight />
//             </button>
//             <div className="absolute bottom-6 left-4 bg-black/80 text-white p-4 rounded-lg text-left max-w-lg">
//               <span className="text-xs bg-red-600 px-2 py-0.5 rounded-md">
//                 {filteredItems[currentIndex]?.category}
//               </span>
//               <h3 className="font-semibold text-xl mt-2">
//                 {filteredItems[currentIndex]?.title}
//               </h3>
//               <p className="text-sm text-gray-200 mt-1">
//                 {filteredItems[currentIndex]?.desc}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500">No images found</p>
//         )}
//         {filteredItems.length > 0 && (
//           <div className="flex justify-center gap-4 mt-6">
//             {filteredItems[currentIndex].images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt="thumb"
//                 onClick={() => setCurrentImageIndex(index)}
//                 className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 ${
//                   index === currentImageIndex
//                     ? "border-red-600"
//                     : "border-transparent"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//       <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
//         <CustomerReviews />
//       </section>
//       <Footer />
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import bgImage from "../assets/bgImage.png";
// import foundersImage from "../assets/foundersLetter.png";
// import { FaInstagram, FaFacebook, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import ShoppingProductTile from "./Product-tile";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import TopSelections from "./TopSelections";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { getGalleryItems } from "@/store/slices/gallerySlice";
// import Footer from "./Footer";
// import CustomerReviews from "./CustomerReview";
// import { Helmet } from "react-helmet";
// import HomeBlog from "./HomeBlogs";

// const categories = ["All", "Orchard", "Harvesting", "Products", "Farm"];

// export default function Home() {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const dispatch = useDispatch();
//   const { images: galleryItems, loading } = useSelector((state) => state.gallery);

//   useEffect(() => {
//     dispatch(getGalleryItems());
//   }, [dispatch]);

//   const filteredItems =
//     activeCategory === "All"
//       ? galleryItems
//       : galleryItems.filter((item) => item.category === activeCategory);

//   const prevSlide = () => {
//     if (currentImageIndex > 0) {
//       setCurrentImageIndex((prev) => prev - 1);
//     } else {
//       const prevItemIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
//       setCurrentIndex(prevItemIndex);
//       setCurrentImageIndex(filteredItems[prevItemIndex].images.length - 1);
//     }
//   };

//   const nextSlide = () => {
//     if (currentImageIndex < filteredItems[currentIndex].images.length - 1) {
//       setCurrentImageIndex((prev) => prev + 1);
//     } else {
//       const nextItemIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
//       setCurrentIndex(nextItemIndex);
//       setCurrentImageIndex(0);
//     }
//   };

//   const features = [
//     {
//       title: "🍎 Naturally Grown",
//       desc: "Apples nurtured in the fresh Himalayan air with care and love.",
//     },
//     {
//       title: "🌍 Eco-Friendly Practices",
//       desc: "Sustainably grown using age-old farming wisdom.",
//     },
//     {
//       title: "🍏 Family Orchards",
//       desc: "From our home farms in Himachal — straight to you.",
//     },
//     {
//       title: "🏔 Purely Himalayan",
//       desc: "Untouched freshness and authentic mountain taste.",
//     },
//   ];

//   const { productList } = useSelector((state) => state.products);

//   return (
//     <div className="bg-[#FFF8E1] overflow-x-hidden">
//       <Helmet>
//         <title>Range Of Himalayas | Fresh Apples from Himachal</title>
//         <meta
//           name="description"
//           content="Range Of Himalayas – Fresh apples directly from our Himachal orchards. Preorders open soon!"
//         />
//       </Helmet>

//       {/* 🆕 Prelaunch banner */}
//       <section className="bg-green-700 text-white text-center py-3 px-4">
//         <p className="text-lg font-semibold">
//           🍎 Range Of Himalayas — Launching This August!
//         </p>
//         <a
//           href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-block mt-3 bg-white text-green-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition-all"
//         >
//           Join the Waitlist 🍏
//         </a>
//       </section>

//       {/* 🆕 Remove old coupon marquee */}
//       {/* <div className="overflow-hidden relative bg-red-600 py-2">
//         ...
//       </div> */}

//       <img
//         src={bgImage}
//         alt="Banner"
//         className="w-full h-64 sm:h-96 md:h-[600px] lg:h-[750px] object-cover shadow-lg"
//       />

//       <div className="border-[#FAD4B3] border-b-1 mt-10 h-[2px] w-full"></div>

//       {/* 🏔 Products section - show as “Coming Soon” */}
//       <div>
//         <h1 className="text-center mt-8 font-bold text-3xl text-[#D84C3C]">
//           Himalayan Selections 🍎
//         </h1>
//         <p className="text-center text-gray-700 mt-2">
//           Our fresh harvest will be available soon. Get notified first!
//         </p>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10">
//           {productList && productList.length > 0 ? (
//             productList.slice(0, 3).map((item) => (
//               <div
//                 key={item._id}
//                 className="block hover:-translate-y-1 transition-transform duration-300"
//               >
//                 <TopSelections product={item} />
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-600">Products coming soon...</p>
//           )}
//         </div>

//         <div className="text-center mb-10">
//           <a
//             href="https://forms.gle/YOUR_GOOGLE_FORM_LINK"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <button className="mt-4 bg-[#D84C3C] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#b53e30] transition">
//               Join Waitlist 🍏
//             </button>
//           </a>
//         </div>
//       </div>

//       {/* Keep rest same: features, founder image, blogs, reviews */}
//       <div className="px-6 py-4">
//         <div className="text-center mb-10">
//           <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//             🍎 From Our Orchards
//           </span>
//           <h1 className="text-4xl font-bold mt-4 mb-3">
//             Why Range Of Himalayas?
//           </h1>
//           <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//             Every apple tells a story — of Himalayan air, pure soil, and family legacy.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition"
//             >
//               <h3 className="font-semibold text-lg text-green-700">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 text-sm mt-2">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-12 sm:mt-16">
//         <img
//           src={foundersImage}
//           alt="Founder"
//           className="w-full h-64 sm:h-96 md:h-[500px] lg:h-[680px] object-cover shadow-lg rounded-xl"
//         />
//       </div>
//       <div className="px-6 py-12">
//         <div className="text-center mb-10">
//           <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//             🍎 From Our Orchards
//           </span>
//           <h1 className="text-4xl font-bold mt-4 mb-3">Himalayan Harvest</h1>
//           <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//             Discover how we nurture premium apples with a blend of time-honored
//             traditions and thoughtful modern practices in the pristine Himalayan
//             foothills.
//           </p>
//         </div>
//       </div>
//       <div className="px-6 py-12 bg-white ">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-bold mb-2">Follow Us</h2>
//           <p className="text-gray-600 text-xl">
//             🌱 Get the freshest updates on our harvests and apple collections
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
//           <div className="p-6 border border-green-200 rounded-xl text-center hover:shadow-md transition">
//             <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
//               <FaInstagram className="text-3xl text-pink-600" />
//             </div>
//             <h3 className="font-semibold text-lg">Instagram</h3>
//             <p className="text-gray-600">@range.of.himalayas</p>
//             <a
//               href="https://www.instagram.com/range.of.himalayas"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-green-700 font-medium mt-2 inline-block"
//             >
//               Follow →
//             </a>
//           </div>
//           <div className="p-6 border border-green-200 rounded-xl text-center hover:shadow-md transition">
//             <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
//               <FaFacebook className="text-3xl text-blue-600" />
//             </div>
//             <h3 className="font-semibold text-lg">Facebook</h3>
//             <p className="text-gray-600">@rangeofhimalayas</p>
//             <a
//               href="https://www.facebook.com/rangeofhimalayas"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-green-700 font-medium mt-2 inline-block"
//             >
//               Follow →
//             </a>
//           </div>
//         </div>
//       </div>
//       <HomeBlog />
//        <div className="px-6 py-12 text-center">
//         <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//           🌿 Orchard Moments
//         </span>
//         <h1 className="text-4xl font-bold mt-4 mb-3">
//           🍏 From Orchard to Table
//         </h1>
//         <p className="text-gray-600 text-xl max-w-2xl mx-auto">
//           Witness the journey of our orchards through the seasons — a
//           celebration of purity, tradition, and mindful farming at Range Of
//           Himalayas.
//         </p>
//         <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => {
//                 setActiveCategory(cat);
//                 setCurrentIndex(0);
//                 setCurrentImageIndex(0);
//               }}
//               className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform
//         ${
//           activeCategory === cat
//             ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105"
//             : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:scale-105"
//         }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {loading ? (
//           <p className="text-gray-500">Loading images...</p>
//         ) : filteredItems.length > 0 ? (
//           <div className="relative max-w-3xl mx-auto">
//             <img
//               src={filteredItems[currentIndex]?.images[currentImageIndex]}
//               alt={filteredItems[currentIndex]?.title}
//               className="w-full h-full object-cover rounded-xl shadow-md"
//             />
//             <button
//               onClick={prevSlide}
//               className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60  text-white p-3 rounded-full shadow-md hover:bg-black/80"
//             >
//               <FaArrowLeft />
//             </button>
//             <button
//               onClick={nextSlide}
//               className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full shadow-md hover:bg-black/80"
//             >
//               <FaArrowRight />
//             </button>
//             <div className="absolute bottom-6 left-4 bg-black/80 text-white p-4 rounded-lg text-left max-w-lg">
//               <span className="text-xs bg-red-600 px-2 py-0.5 rounded-md">
//                 {filteredItems[currentIndex]?.category}
//               </span>
//               <h3 className="font-semibold text-xl mt-2">
//                 {filteredItems[currentIndex]?.title}
//               </h3>
//               <p className="text-sm text-gray-200 mt-1">
//                 {filteredItems[currentIndex]?.desc}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500">No images found</p>
//         )}
//         {filteredItems.length > 0 && (
//           <div className="flex justify-center gap-4 mt-6">
//             {filteredItems[currentIndex].images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt="thumb"
//                 onClick={() => setCurrentImageIndex(index)}
//                 className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 ${
//                   index === currentImageIndex
//                     ? "border-red-600"
//                     : "border-transparent"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//       <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
//         <CustomerReviews />
//       </section>

//       <Footer />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import bgImage from "../assets/bgImage.png";
import foundersImage from "../assets/foundersLetter.png";
import {
  FaInstagram,
  FaFacebook,
  FaArrowLeft,
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa";
import TopSelections from "./TopSelections";
import { useDispatch, useSelector } from "react-redux";
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
      title: "🍎 Naturally Grown",
      desc: "Apples nurtured in the crisp Himalayan air.",
    },
    {
      title: "🌿 Sustainable Practices",
      desc: "Farming rooted in care, not chemicals.",
    },
    {
      title: "🍏 Family Orchards",
      desc: "From our home in Himachal, straight to you.",
    },
    {
      title: "🏔 Pure & Authentic",
      desc: "Unmatched mountain freshness in every bite.",
    },
  ];

  const { productList } = useSelector((state) => state.products);

  return (
    <div className="bg-[#FFF8E1] overflow-x-hidden">
      <Helmet>
        <title>Range Of Himalayas | Fresh Apples from Himachal</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples directly from our Himachal orchards. Preorders open soon!"
        />
      </Helmet>

      <section className="bg-gradient-to-r from-green-700 to-green-600 text-white text-center py-5 px-6 shadow-md">
        <h1 className="text-2xl font-bold">
          🍎 Range Of Himalayas — Prelaunch Is Live!
        </h1>
        <p className="mt-2 text-lg">
          Be among the first to taste this season’s Himalayan apples 🍏
        </p>
        <a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-100 transition-all"
        >
          Join the Waitlist
        </a>
      </section>
      <img
        src={bgImage}
        alt="Banner"
        className="w-full h-64 sm:h-96 md:h-[600px] lg:h-[750px] object-cover shadow-lg"
      />

      <section className="text-center py-12 px-6">
        <h2 className="font-bold text-3xl text-[#D84C3C]">
          Himalayan Selections 🍎
        </h2>
        <p className="text-gray-700 mt-2">
          Our fresh harvest is almost here — sign up to get early access when we
          launch.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10">
          {productList?.length > 0 ? (
            productList.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="hover:-translate-y-1 transition-transform"
              >
                <TopSelections product={item} />
              </div>
            ))
          ) : (
            <p className="text-gray-600">🍏 Products coming soon...</p>
          )}
        </div>

        <a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-[#D84C3C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b53e30] transition">
            Notify Me on Launch 🚀
          </button>
        </a>
      </section>
      <section className="px-6 py-10 bg-white">
        <h1 className="text-center text-4xl font-bold mb-8 text-green-700">
          Why Choose Range Of Himalayas?
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-green-50 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-green-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Behind the Scenes */}
      <section className="px-6 py-12 text-center bg-gradient-to-b from-green-50 to-white">
        <h2 className="text-4xl font-bold mb-4">🍏 From Orchard to You</h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Born in the misty valleys of Himachal, nurtured by family hands, and
          delivered with love. Experience freshness that travels from the
          orchard straight to your table.
        </p>
      </section>

      <img
        src={foundersImage}
        alt="Founder"
        className="w-full h-64 sm:h-96 md:h-[500px] lg:h-[680px] object-cover shadow-lg rounded-xl mt-8"
      />

      {/* Socials */}
      <section className="px-6 py-12 bg-white text-center">
        <h2 className="text-3xl font-bold mb-3">Follow Our Journey 🍃</h2>
        <p className="text-gray-600 text-lg mb-8">
          Watch behind-the-scenes updates as we prepare for our grand harvest
          launch!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href="https://www.instagram.com/range.of.himalayas"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 border border-green-300 rounded-xl hover:shadow-md transition"
          >
            <FaInstagram className="text-3xl text-pink-600 mx-auto mb-2" />
            <h3 className="font-semibold">@range.of.himalayas</h3>
          </a>
          <a
            href="https://www.facebook.com/rangeofhimalayas"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 border border-green-300 rounded-xl hover:shadow-md transition"
          >
            <FaFacebook className="text-3xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">@rangeofhimalayas</h3>
          </a>
          <a
            href="https://whatsapp.com/channel/0029Vb7Bkv84SpkMGym1LW2V"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 border border-green-300 rounded-xl hover:shadow-md transition"
          >
            <FaWhatsapp className="text-3xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">WhatsApp Us</h3>
          </a>
        </div>
      </section>

      <HomeBlog />

      <div className="px-6 py-12 text-center">
        <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          🌿 Orchard Moments
        </span>
        <h1 className="text-4xl font-bold mt-4 mb-3">
          🍏 From Orchard to Table
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Witness the journey of our orchards through the seasons — a
          celebration of purity, tradition, and mindful farming at Range Of
          Himalayas.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
                setCurrentImageIndex(0);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform
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

        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : filteredItems.length > 0 ? (
          <div className="relative max-w-3xl mx-auto">
            <img
              src={filteredItems[currentIndex]?.images[currentImageIndex]}
              alt={filteredItems[currentIndex]?.title}
              className="w-full h-full object-cover rounded-xl shadow-md"
            />
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/60  text-white p-3 rounded-full shadow-md hover:bg-black/80"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/60 text-white p-3 rounded-full shadow-md hover:bg-black/80"
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
                className={`w-24 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                  index === currentImageIndex
                    ? "border-red-600"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {/* <section className="bg-gradient-to-b from-green-50 to-white py-16 px-6 sm:px-10">
        <CustomerReviews />
      </section> */}

      <Footer />
    </div>
  );
}
