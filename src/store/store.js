import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import addressReducer from "./slices/addressSlice";
import wishListReducer from "./slices/wishlistSlice";
import couponReducer from "./slices/couponSlice";
import customBoxReducer from "./slices/customBoxSlice";
import orderReducer from "./slices/orderSlice";
import reviewsReducer from "./slices/reviewSlice";
import dashboardReducer from "./slices/dashboardSlice";
import searchReducer from "./slices/searchSlice";
import contactReducer from "./slices/contactSlice";
import galleryReducer from "./slices/gallerySlice";
import blogReducer from "./slices/blogSlice";


const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  product: productsReducer,
  address: addressReducer,
  wishList: wishListReducer,
  coupon: couponReducer,
  customBox: customBoxReducer,
  orders: orderReducer,
  reviews: reviewsReducer,
  dashboard: dashboardReducer,
  search: searchReducer,
  contact: contactReducer,
  gallery: galleryReducer,
  blogs: blogReducer,

});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishList"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});
export const persistor = persistStore(store);
