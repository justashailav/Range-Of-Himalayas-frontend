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
  const handleAddToCart = useCallback(
    (productId, totalStock, size) => {
      const existingItem = cartItems?.items?.find(
        (item) =>
          item.productId.toString() === productId.toString() &&
          item.size === size
      );

      if (existingItem && existingItem.quantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} available for this size`);
        return;
      }

      dispatch(
        addToCart({ userId: user?._id, productId, quantity: 1, size })
      ).then((res) => {
        if (res?.success) {
          dispatch(fetchCartItems(user?._id));
          toast.success("Product added to cart");
        } else {
          toast.error(res?.payload?.message || "Failed to add item");
        }
      });
    },
    [cartItems, dispatch, user?._id]
  );

  // Add to Wishlist
  const handleAddToWishList = useCallback(
    (productId, totalStock, size) => {
      const existingItem = wishListItems?.items?.find(
        (item) =>
          item.productId.toString() === productId.toString() &&
          item.size === size
      );

      if (existingItem && existingItem.quantity + 1 > totalStock) {
        toast.error(`Only ${totalStock} available for this size`);
        return;
      }

      dispatch(
        addToWishList({ userId: user?._id, productId, quantity: 1, size })
      ).then((res) => {
        if (res?.success) {
          dispatch(fetchWishListItems(user?._id));
          toast.success("Product added to wishlist");
        } else {
          toast.error(res?.message || "Failed to add item");
        }
      });
    },
    [wishListItems, dispatch, user?._id]
  );

  const handleGetProductDetails = useCallback(
    (product) => navigate(`/product/${product._id}`),
    [navigate]
  );

  return (
    <div className="bg-[#FFF8E1] container mx-auto md:px-6 px-4 py-8 min-h-screen">
      <Helmet>
        <title>
          {keyword
            ? `Search results for "${keyword}" | Range Of Himalayas`
            : "Search Products | Range Of Himalayas"}
        </title>
        <meta
          name="description"
          content={
            keyword
              ? `Find premium apples, kiwis "${keyword}" from Range Of Himalayas.`
              : "Discover fresh Himalayan apples, kiwis, — naturally grown and handpicked from the mountains."
          }
        />
      </Helmet>
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-xl relative">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="🔍 Search for products..."
            className="py-4 pl-5 pr-14 rounded-full shadow-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Search Results */}
      {keyword.trim().length > 3 && (
        <>
          {isLoading ? (
            <div className="text-center text-indigo-600 font-semibold py-6">
              Searching products...
            </div>
          ) : !searchResults.length ? (
            <div className="text-center mt-10">
              <h1 className="text-3xl font-semibold text-gray-700">
                No results found
              </h1>
              <p className="text-gray-500 mt-2">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
              Showing results for{" "}
              <span className="text-indigo-600">&quot;{keyword}&quot;</span>
            </h2>
          )}
        </>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
