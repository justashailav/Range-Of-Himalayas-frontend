import { forgotPassword, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png";
export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const navigateTo = useNavigate();
  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthencated, error, loading, message]);
  if (isAuthencated) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Forgot Password - Range of Himalayas</title>
        <meta
          name="description"
          content="Forgot your password? Enter your email to receive a secure OTP and reset your Range of Himalayas account."
        />
        <meta
          property="og:title"
          content="Forgot Password - Range of Himalayas"
        />
        <meta
          property="og:description"
          content="Reset your account password easily by entering your registered email."
        />
      </Helmet>

      <div className="flex flex-col justify-center bg-[#FFECE8] md:flex-row h-screen">
        <div className="hidden w-full md:w-1/2 bg-[#F7B6A7] md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="logo"
                className="
              h-44 w-auto"
              />
            </div>
            <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl front-medium leading-10"></h3>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-[#FFECE8] flex items-center justify-center p-8">
          <Link
            to="/login"
            className="border-2 border-[#D86A5D] text-[#F08C7D] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28  transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              {/* <div className="rounded-full flex items-center justify-center">
                <img
                  src={black_logo}
                  alt="logo"
                  className="h-auto w-24 object-cover"
                />
              </div> */}
            </div>
            <h1 className=" text-center text-[#F08C7D] text-4xl font-medium mb-5 ">
              Forgot Password
            </h1>
            <p className="text-[#F08C7D] text-center mb-12">
              Please enter your email
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                />
              </div>
              <button
                type="submit"
                className="mt-5 w-full font-semibold bg-[#F08C7D] text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition"
                disabled={loading ? true : false}
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
