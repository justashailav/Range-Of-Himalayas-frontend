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
import Chatbot from "./Pages/Chatbot";
import WhatsAppSupport from "./Pages/WhatsAppSupport";


function App() {
  const dispatch = useDispatch();
  const { user, isAuthencated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getAllCoupons());
  }, [dispatch]);
  function WithNavbar() {
    return (
      <>
        <Navbar />
        <div className="pt-16 md:pt-20">
          <Outlet />
        </div>
      </>
    );
  }

  return (
    <div>
      <Routes>
        {/* Auth pages (NO navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/whatsapp-support" element={<WhatsAppSupport />} />
        {/* Pages WITH navbar */}
        <Route element={<WithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<OurStroy />} />
          <Route path="/contact-us" element={<ContectUs />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductsDetailsDialog />} />
          <Route path="/viewproducts" element={<Viewallproducts />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/faqs" element={<FAQSection />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/custombox" element={<CustomBox />} />
          
          {/* User protected */}
          <Route
            element={
              <CheckAuth user={user} isAuthencated={isAuthencated}>
                <Outlet />
              </CheckAuth>
            }
          >
            <Route path="/account" element={<ShoppingAccount />} />
            <Route path="/checkout" element={<ShoppingCheckout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<WishListItemContent />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/shopping-orders" element={<ShoppingOrders />} />
            <Route
              path="/order-details/:orderId"
              element={<ShoppingOrderDetailsView />}
            />
            <Route
              path="/return-request/:orderId"
              element={<ReturnRequestPage />}
            />
            <Route path="/order-tracking" element={<OrderTracking />} />
          </Route>
        </Route>

        {/* Admin (NO navbar) */}
        <Route
          element={
            <CheckAuth
              user={user}
              isAuthencated={isAuthencated}
              requiredRole="Admin"
            >
              <Outlet />
            </CheckAuth>
          }
        >
          <Route path="/admin" element={<Adminlayout />}>
            <Route path="dashboard" element={<Admindashboard />} />
            <Route path="products" element={<Adminproducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route
              path="order-details/:orderId"
              element={<AdminOrderDetailsView />}
            />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blogs />} />
            <Route path="coupons" element={<Admincoupon />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <RecentOrderToast />
      <Chatbot/>
      <ToastContainer />
    </div>
  );
}

export default App;
