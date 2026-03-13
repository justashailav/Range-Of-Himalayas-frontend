import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Tag } from "lucide-react";

import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
import { deleteWishListItem } from "@/store/slices/wishlistSlice";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
export default function WishListItemContent() {
  const dispatch = useDispatch();
  const { wishListItems } = useSelector((state) => state.wishList);
  const { productList } = useSelector((state) => state.products);
  console.log(productList);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (productId, totalStock, size, weight) => {
    const cartList = cartItems?.items || [];

    const existingIndex = cartList.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        (item.size || "") === (size || "") &&
        item.weight === weight,
    );

    if (existingIndex > -1) {
      const currentQty = cartList[existingIndex].quantity;
      if (currentQty + 1 > totalStock) {
        toast.error(`Only ${totalStock} items available for this variant`);
        return;
      }
    }

    dispatch(
      addToCart({
        userId: user?._id,
        productId,
        quantity: 1,
        size: size || "",
        weight,
      }),
    ).then((res) => {
      if (res?.success) {
        dispatch(fetchCartItems(user?._id));
        toast.success("Product added to cart");

        dispatch(
          deleteWishListItem({
            userId: user?._id,
            productId,
            size: size || "",
            weight,
          }),
        );
      }
    });
  };

  const handleCartItemDelete = (item) => {
    // const product = productList.find((p) => p._id === item.productId);
    // const variant = product?.variants?.find((v) => v.size === item.size);
    // const weight = variant?.weight || "";

    dispatch(
      deleteWishListItem({
        userId: user?._id,
        productId: item.productId,
        size: item.size || "",
        weight: item.weight,
      }),
    ).then((data) => {
      if (data?.success) toast.success("Item removed from wishlist");
      else toast.error(data?.message || "Failed to remove item");
    });
  };

  if (wishListItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 space-y-6">
        <Helmet>
          <title>Wishlist - Range Of Himalayas</title>
          <meta
            name="description"
            content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
          />
        </Helmet>
        <Heart className="w-16 h-16 mx-auto text-gray-300" />
        <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
        <p className="max-w-md mx-auto text-gray-600">
          Add products you love to your wishlist. Review them anytime and easily
          move them to your cart.
        </p>
        <a href="/viewproducts">
          <Button className="mt-4 px-6 py-3 bg-[#F08C7D] hover:bg-[#e27265] text-white rounded-lg font-medium">
            Continue Shopping
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className=" px-4 sm:px-6 lg:px-10 py-8 bg-[#FFF8E1] min-h-screen">
      <div className="relative mb-12 border-b border-stone-100 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishListItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                {/* PRODUCT IMAGE CONTAINER */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-100 border border-stone-200 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-stone-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* REMOVE BUTTON (Top Right) */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-[#B23A2E] hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  >
                    <X size={18} />
                  </button>

                  {/* QUICK VIEW / ADD TO CART OVERLAY */}
                  <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-stone-900/80 to-transparent">
                    <button className="w-full bg-white text-stone-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#B23A2E] hover:text-white transition-colors">
                      Move to Cart
                    </button>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="mt-6 space-y-2 px-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B23A2E] mb-1">
                        {item.category || "Himalayan Harvest"}
                      </p>
                      <h3 className="text-xl font-black text-stone-900 tracking-tight leading-none">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-lg font-serif italic text-stone-500">
                      ₹{item.price}
                    </p>
                  </div>

                  <p className="text-xs text-stone-400 font-medium leading-relaxed line-clamp-2">
                    {item.description ||
                      "Pure, mountain-grown goodness directly from our high-altitude orchards."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative overflow-hidden inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-stone-900 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] group"
          >
            {/* SUBTLE GLASS GLARE EFFECT */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <Heart
                  size={14}
                  className="fill-[#B23A2E] text-[#B23A2E] group-hover:scale-125 transition-transform duration-300"
                />
                {/* COUNTER PULSE SHADOW */}
                <span className="absolute inset-0 bg-[#B23A2E] blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="h-4 w-[1px] bg-stone-700 mx-1" />

              <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-1.5">
                <motion.span
                  key={wishListItems.length}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block"
                >
                  {wishListItems.length}
                </motion.span>
                <span className="text-stone-500 font-bold">
                  {wishListItems.length === 1 ? "Selection" : "Selections"}
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Subtitle - Optional but adds "Boutique" feel */}
        <p className="mt-4 text-stone-400 text-sm font-medium max-w-md">
          A curated collection of your favorite Himalayan treasures, reserved
          for your next harvest.
        </p>
      </div>

      {wishListItems.length === 0 ? (
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden text-center py-32 px-6 bg-stone-50/50 rounded-[3rem] border border-stone-100"
>
  {/* BACKGROUND DECORATIVE ELEMENT */}
  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
  
  <div className="relative z-10 max-w-sm mx-auto">
    {/* ICON WITH ANIMATED PULSE */}
    <div className="relative inline-block mb-10">
      <div className="absolute inset-0 bg-[#B23A2E]/10 blur-3xl rounded-full" />
      <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-stone-200">
        <Heart size={32} className="text-stone-200 stroke-[1.5px]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-6 right-6 w-3 h-3 bg-[#B23A2E] rounded-full border-2 border-white"
        />
      </div>
    </div>

    {/* TEXT CONTENT */}
    <h3 className="text-3xl font-black text-stone-900 tracking-tighter mb-4">
      The Orchard is <br />
      <span className="italic font-serif font-light text-stone-400">Waiting.</span>
    </h3>
    
    <p className="text-stone-500 font-light leading-relaxed mb-10">
      Your collection of Himalayan treasures is currently empty. Explore our seasonal harvest to begin your archive.
    </p>

    {/* CTA BUTTON */}
    <Link to="/viewproducts">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto bg-stone-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#B23A2E] transition-all duration-300 shadow-xl shadow-stone-200"
      >
        Discover the Harvest
      </motion.button>
    </Link>
  </div>

  {/* SUBTLE MOUNTAIN LINE AT BOTTOM */}
  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
</motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
  {wishListItems.map((cartItem) => {
    // Keep your existing logic for finding products/variants
    const product = productList.find((p) => p._id === cartItem.productId);
    const variant = product?.variants?.find(
      (v) => v.size === cartItem.size && (cartItem.weight ? v.weight === cartItem.weight : true)
    );

    const image = product?.image;
    const title = product?.title;
    const price = variant?.price ?? 0;
    const salePrice = variant?.salesPrice ?? price;
    const totalStock = variant?.stock ?? 0;
    const weight = variant?.weight || cartItem.weight || "";
    const discount = price > salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

    return (
      <motion.div
        key={`${cartItem.productId}-${cartItem.size}-${weight}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative flex flex-col"
      >
        {/* --- IMAGE CONTAINER --- */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 border border-stone-100 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0"
          />

          {/* FLOATERS: Remove & Discount */}
          <div className="absolute top-5 inset-x-5 flex justify-between items-start z-20">
            {discount > 0 ? (
              <span className="bg-[#B23A2E] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                -{discount}% OFF
              </span>
            ) : <div />}
            
            <button
              onClick={() => handleCartItemDelete(cartItem)}
              className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-stone-400 hover:text-[#B23A2E] shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              title="Remove Selection"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* ACTION OVERLAY */}
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent z-10">
            <button
              onClick={() => handleAddToCart(product?._id || cartItem.productId, totalStock, variant?.size, weight)}
              className="w-full bg-white text-stone-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#B23A2E] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} />
              Move to Basket
            </button>
          </div>
        </div>

        {/* --- PRODUCT INFO --- */}
        <div className="mt-8 space-y-4 px-2">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                {product?.category || "Orchard Selection"}
              </p>
              <h3 className="text-2xl font-black text-stone-900 tracking-tighter leading-[0.9]">
                {title}
              </h3>
            </div>
            
            <div className="text-right">
              {price !== salePrice ? (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-stone-300 line-through font-bold">₹{price}</span>
                  <span className="text-2xl font-serif italic text-stone-900">₹{salePrice}</span>
                </div>
              ) : (
                <span className="text-2xl font-serif italic text-stone-900">₹{price}</span>
              )}
            </div>
          </div>

          {/* ATTRIBUTE TAGS */}
          <div className="flex flex-wrap gap-2">
            {(variant?.size || weight) && (
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-stone-500 border border-stone-200 px-4 py-2 rounded-full bg-white transition-colors group-hover:border-stone-900 group-hover:text-stone-900">
                {variant?.size && <span>Size: {variant.size}</span>}
                {variant?.size && weight && <span className="w-1 h-1 bg-stone-200 rounded-full" />}
                {weight && <span>Net: {weight}</span>}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  })}
</div>
      )}
    </div>
  );
}
