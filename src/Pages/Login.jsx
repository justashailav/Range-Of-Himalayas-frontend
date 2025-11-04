import { login, resetAuthSlice } from "@/store/slices/authSlice";
import { fetchCartItems } from "@/store/slices/cartSlice"; // Import fetchCartItems
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png";
import { Helmet } from "react-helmet";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, isAuthencated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }

    if (isAuthencated && user) {
      console.log("User logged in:", user);

      // Fetch cart items for logged-in user
      if (user._id) {
        console.log("Fetching cart for user:", user._id);
        dispatch(fetchCartItems(user._id))
          .then(() => console.log("Cart fetched successfully"))
          .catch((err) => console.log("Error fetching cart:", err));
      }

      // Redirect based on role
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, error, isAuthencated, user, navigate]);

  if (isAuthencated) {
    // Prevent login page rendering after successful login (redirect handled in useEffect)
    return null;
  }

  return (
    <div>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-[#FFECE8]">
      <Helmet>
        <title>Login - Range Of Himalayas </title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#FFECE8] p-8 relative">
          <div className="max-w-sm w-full">
            <h1 className="text-[#F08C7D] text-4xl font-medium text-center mb-12">
              Your cart misses you—log in now!
            </h1>
            <p className="text-[#F08C7D] text-center mb-12">
              Please enter credentials to login
            </p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                  required
                />
              </div>
              <Link
                to="/password/forgot"
                className="font-bold text-[#F08C7D] flex justify-end mb-4"
              >
                Forgot Password?
              </Link>
              <div className="block md:hidden font-semibold mt-5">
                <p className="text-gray-700">
                  New to our platform?
                  <Link
                    to="/register"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {" "}
                    Sign up
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className="mt-5 w-full font-semibold bg-[#F08C7D] text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition"
                disabled={loading}
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Info / Signup */}
        <div className="hidden w-full md:w-1/2 bg-[#F7B6A7] text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <img src={logo} alt="logo" className="h-44 w-auto mb-6" />
            <p className="text-white text-lg mb-12">
              New to our platform? Sign up now.
            </p>
            <Link
              to="/register"
              className="border-2 border-[#F08C7D] mt-5 bg-[#F08C7D] px-8 w-full font-semibold text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
