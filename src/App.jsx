import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "./store/slices/productSlice";
import { getAllCoupons } from "./store/slices/couponSlice";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import OurStroy from "./Pages/OurStroy";
import OTP from "./Pages/OTP";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ContectUs from "./Pages/ContectUs";
import Viewallproducts from "./Pages/Viewallproducts";
import Profile from "./Pages/Profile";
import OrderSuccess from "./Pages/OrderSuccess";

import Adminlayout from "./components/Admin-View/layout";
import Admindashboard from "./Pages/Admin-View/dashboard";
import Adminproducts from "./Pages/Admin-View/products";
import Adminorderes from "./Pages/Admin-View/orderes";
import Adminfeatures from "./Pages/Admin-View/features";
import Admincoupon from "./Pages/Admin-View/coupon";
import Navbar from "./Shared/Navbar";
import ShoppingAccount from "./components/Account";
import ShoppingCheckout from "./components/Checkout";
import WishListItemContent from "./components/WishListItemContent";
import CustomBox from "./components/CustomBox";
import ShoppingOrders from "./components/Orders";
import CheckAuth from "./Pages/Check-auth";
import { ToastContainer } from "react-toastify";
import SearchProducts from "./Pages/Search";
import ProductsDetailsDialog from "./Pages/ProductsDetailsDialog";
import ShippingPolicy from "./Pages/ShippingPolicy";
import RefundPolicy from "./Pages/RefundPolicy";
import Gallery from "./Pages/Admin-View/features";
import CartPage from "./Pages/CartPage";
import ShoppingOrderDetailsView from "./Pages/order-details";
import ReturnRequestPage from "./Pages/ReturnRequestPage";
import AdminOrderDetailsView from "./Pages/Admin-View/order-details";
import AdminOrders from "./Pages/Admin-View/orderes";
import OrderTracking from "./Pages/OrderTracking";
import RecentOrderToast from "./Pages/RecentOrderPopup";
import Blogs from "./Pages/Admin-View/blogs";
import Blog from "./Pages/Blog";
import BlogDetail from "./Pages/BlogDetail";
import FAQSection from "./Pages/FAQ";
import PrivacyPolicy from "./Pages/privacyPolicy";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthencated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getAllCoupons());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/about-us" element={<><Navbar /><OurStroy /></>} />
        <Route path="/contact-us" element={<><Navbar /><ContectUs /></>} />
        <Route path="/search" element={<SearchProducts />} />
        <Route path="/cart" element={<><Navbar /><CartPage /></>} />
        <Route path="/product/:id" element={<><Navbar /><ProductsDetailsDialog /></>} />
        <Route path="/viewproducts" element={<><Navbar /><Viewallproducts /></>} />
        <Route path="/blog" element={<><Navbar /><Blog/></>} />
        <Route path="/blog/:slug" element={<><Navbar /><BlogDetail/></>} />
        <Route path="/faqs" element={<><Navbar /><FAQSection/></>} />
        <Route path="/shipping-policy" element={<><Navbar /><ShippingPolicy /></>} />
          <Route path="/return-policy" element={<><Navbar /><RefundPolicy /></>} />
          <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /></>} />
        <Route element={<CheckAuth user={user} isAuthencated={isAuthencated}><Outlet /></CheckAuth>}>
          <Route path="/account" element={<><Navbar /><ShoppingAccount /></>} />
          <Route path="/checkout" element={<><Navbar /><ShoppingCheckout /></>} />
          <Route path="/profile" element={<><Navbar /><Profile /></>} />
          <Route path="/wishlist" element={<><Navbar /><WishListItemContent /></>} />
          <Route path="/custombox" element={<><Navbar /><CustomBox /></>} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/shopping-orders" element={<><Navbar /><ShoppingOrders /></>} />
          <Route path="/order-details/:orderId" element={<><Navbar /><ShoppingOrderDetailsView /></>} />
          <Route path="/return-request/:orderId" element={<><Navbar /><ReturnRequestPage/></>} />
          <Route path="/order-tracking" element={<><Navbar /><OrderTracking/></>} />
        </Route>
        <Route element={<CheckAuth user={user} isAuthencated={isAuthencated} requiredRole="Admin"><Outlet /></CheckAuth>}>
          <Route path="/admin" element={<Adminlayout />}>
            <Route path="dashboard" element={<Admindashboard />} />
            <Route path="products" element={<Adminproducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="order-details/:orderId" element={<AdminOrderDetailsView />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blogs />} />
            <Route path="coupons" element={<Admincoupon />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        {/* <RecentOrderToast /> */}
      <ToastContainer />
    </div>
  );
}

export default App;
