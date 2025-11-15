// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import TopSelections from "./TopSelections";
// import { addToCart, fetchCartItems } from "@/store/slices/cartSlice";
// import {
//   addToWishList,
//   fetchWishListItems,
// } from "@/store/slices/wishlistSlice";
// import { toast } from "react-toastify";
// import { Helmet } from "react-helmet";

// export default function Viewallproducts() {
//   const { productList } = useSelector((state) => state.products);
//   const { cartItems } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.auth);
//   const { wishListItems } = useSelector((state) => state.wishList);
//   const dispatch = useDispatch();

//   function handleAddToCart(getCurrentProductId, getTotalStock, size) {
//     const getCartItems = cartItems?.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) =>
//           item.productId.toString() === getCurrentProductId.toString() &&
//           item.size === size
//       );

//       if (indexOfCurrentItem > -1) {
//         const currentQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (currentQuantity + 1 > getTotalStock) {
//           toast.error(`Only ${getTotalStock} quantity available for this size`);
//           return;
//         }
//       }
//     }

//     dispatch(
//       addToCart({
//         userId: user?._id,
//         productId: getCurrentProductId,
//         quantity: 1,
//         size,
//       })
//     ).then((data) => {
//       if (data?.success) {
//         dispatch(fetchCartItems(user?._id));
//         toast.success("Product added to cart");
//       } else {
//         toast.error(data?.payload?.message || "Failed to add item");
//       }
//     });
//   }

//   function handleAddToWishList(getCurrentProductId, getTotalStock, size) {
//     const getWishListItems = wishListItems?.items || [];

//     if (getWishListItems.length) {
//       const indexOfCurrentItem = getWishListItems.findIndex(
//         (item) =>
//           item.productId.toString() === getCurrentProductId.toString() &&
//           item.size === size
//       );

//       if (indexOfCurrentItem > -1) {
//         const currentQuantity = getWishListItems[indexOfCurrentItem].quantity;
//         if (currentQuantity + 1 > getTotalStock) {
//           toast.error(`Only ${getTotalStock} quantity available for this size`);
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
//       })
//     ).then((data) => {
//       if (data?.success) {
//         dispatch(fetchWishListItems(user?._id));
//         toast.success("Product added to wishlist");
//       } else {
//         toast.error(data?.message || "Failed to add item");
//       }
//     });
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-10 bg-[#FFF8E1]">
//       <Helmet>
//         <title>All Products - Range Of Himalayas</title>
//         <meta
//           name="description"
//           content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
//         />
//       </Helmet>

//       {productList && productList.length > 0 ? (
//         productList.map((item) => (
//           <a
//             key={item._id}
//             href={`/product/${item._id}`}
//             className="block hover:scale-[1.02] transition-transform duration-300"
//             onClick={() =>
//               window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
//             }
//           >
//             <TopSelections
//               product={item}
//               handleAddToCart={handleAddToCart}
//               handleAddToWishList={handleAddToWishList}
//             />
//           </a>
//         ))
//       ) : (
//         <p>No products found</p>
//       )}
//     </div>
//   );
// }

import React from "react";
import { useSelector } from "react-redux";
import TopSelections from "./TopSelections";
import { Helmet } from "react-helmet";
import Footer from "./Footer";

export default function Viewallproducts() {
  const { productList } = useSelector((state) => state.products);

  return (
    <div>
       <div className="min-h-screen p-10 bg-[#FFF8E1]">
      <Helmet>
        <title>All Products - Range Of Himalayas</title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
        Explore Our Himalayan Fruits
      </h1>
      <p className="text-center text-gray-700 mb-12">
        Prelaunch Collection – Coming Soon!
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productList && productList.length > 0 ? (
          productList.map((item) => (
            <div
              key={item._id}
              className="relative group bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              <TopSelections
                product={item}
                handleAddToCart={null}
                handleAddToWishList={null}
                prelaunch={true}
              />

              <div className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-black/10 backdrop-blur-sm rounded-2xl transition-opacity duration-300 group-hover:opacity-60"></div>
                <span className="relative text-white text-2xl md:text-3xl font-bold drop-shadow-md">
                  Coming Soon
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found
          </p>
        )}
      </div>
      {/* Prelaunch CTA */}
      <section className="mt-16 px-6 py-14 bg-gradient-to-br from-[#FFF3EA] to-[#FFE5D0] rounded-3xl shadow-lg text-center max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#D84C3C] mb-4">
          🍎 Be First to Order When We Launch
        </h2>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          Our full collection of Himalayan fruits will be available soon. Join
          the prelaunch waitlist to get early access, member-only pricing, and
          fresh harvest updates directly from our orchards.
        </p>

        <a
          href="https://forms.gle/5M73wYV9Je6SJtow9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-[#D84C3C] text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-[#b53e30] transition shadow-md">
            Join Prelaunch Waitlist 🚀
          </button>
        </a>
      </section>
    </div>
    <Footer/>
    </div>
  );
}
