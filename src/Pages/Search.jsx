import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { searchProducts } from "@/store/slices/searchSlice";
import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import {
  addToWishList,
  fetchWishListItems,
} from "@/store/slices/wishlistSlice";

import ShoppingProductTile from "./Product-tile";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";
import HimalayanLoader from "./HimalayanLoader";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { searchResults, isLoading } = useSelector((state) => state.search);
  const { wishListItems } = useSelector((state) => state.wishList);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Debounced search
  useEffect(() => {
    if (!keyword || keyword.trim().length <= 3) return;

    const debounceTimer = setTimeout(() => {
      setSearchParams(new URLSearchParams({ keyword }));
      dispatch(searchProducts(keyword));
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [keyword, dispatch, setSearchParams]);

  // Add to Cart
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
          // 🔥 FIX: Check if productId is an object with an _id inside it
          const existingProductId = item.productId?._id || item.productId;
  
          const sameProduct =
            existingProductId?.toString() === getCurrentProductId?.toString();
  
          const sameSize = (item.size || "") === normalizedSize;
  
          const sameWeight =
            (item.weight &&
              weight &&
              item.weight.toString() === weight.toString()) ||
            (!item.weight && !weight);
  
          return sameProduct && sameSize && sameWeight;
        });
  
        if (indexOfCurrentItem > -1) {
          toast.error("This item is already in your wishlist!");
          return;
        }
      }
  
      dispatch(
        addToWishList({
          userId: user?._id,
          productId: getCurrentProductId,
          quantity: 1,
          size: normalizedSize,
          weight,
        }),
      ).then((data) => {
        // 🔥 NOTE: If you use Redux Toolkit, you MUST check data.payload.success
        const response = data?.payload || data;
  
        if (response?.success) {
          dispatch(fetchWishListItems(user?._id));
          toast.success("Product added to wishlist");
        } else {
          toast.error(response?.message || "Failed to add item");
        }
      });
    }
  
  const handleGetProductDetails = useCallback(
    (product) => navigate(`/product/${product._id}`),
    [navigate],
  );

  return (
    <div className="bg-[#fdfcf7] container mx-auto md:px-12 px-6 py-16 min-h-screen">
      <Helmet>
        <title>
          {keyword
            ? `Inquiry: "${keyword}" | Range Of Himalayas`
            : "The Archive | Range Of Himalayas"}
        </title>
      </Helmet>

      {/* SEARCH HEADER */}
      <div className="flex flex-col items-center justify-center mb-20">
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B23A2E] mb-4">
          Discovery
        </span>
        <div className="w-full max-w-2xl relative">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search the harvest (e.g. Kinnaur Apples)"
            className="w-full bg-transparent border-t-0 border-x-0 border-b border-stone-300 rounded-none py-6 px-0 text-xl font-serif italic text-stone-800 placeholder:text-stone-300 focus:border-[#B23A2E] focus:ring-0 outline-none transition-all duration-700"
            autoComplete="off"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-stone-300" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* SEARCH STATUS ARCHIVE */}
      {keyword.trim().length > 3 && (
        <div className="mb-12">
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <HimalayanLoader text="Sifting through the orchards..." />
            </div>
          ) : !searchResults.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-stone-200"
            >
              <h1 className="text-2xl font-serif italic text-stone-400">
                "No results found for {keyword}"
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-300 mt-4">
                Try searching for varieties, seasons, or locations
              </p>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4 mb-10 overflow-hidden">
              <div className="h-[1px] flex-grow bg-stone-200" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-400 whitespace-nowrap">
                Found in Archive:{" "}
                <span className="text-[#B23A2E]">{keyword}</span>
              </h2>
              <div className="h-[1px] flex-grow bg-stone-200" />
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        {searchResults.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * 0.05,
              ease: [0.21, 1, 0.36, 1],
            }}
          >
            <ShoppingProductTile
              product={item}
              handleAddToCart={handleAddToCart}
              handleAddToWishList={handleAddToWishList}
              handleGetProductDetails={handleGetProductDetails}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default SearchProducts;
