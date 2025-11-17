import { otpVerification, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png"
export default function OTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const handleotpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };
  useEffect(() => {
    if (message) {
      toast.success(message)
    }
    if (error) {
      dispatch(resetAuthSlice());
      toast.error(error)
    }
  }, [dispatch, isAuthencated, error, loading]);
  if (isAuthencated) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Verify OTP - Range of Himalayas</title>
        <meta
          name="description"
          content="Enter the OTP sent to your email to verify your account on Range of Himalayas."
        />
        <meta property="og:title" content="Verify OTP - Range of Himalayas" />
        <meta
          property="og:description"
          content="Secure your account by verifying your email using OTP."
        />
      </Helmet>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-[#FFECE8]">
        <div className="w-full md:w-1/2  flex items-center justify-center p-8 relative">
          <Link
            to="/register"
            className="border-2 border-[#F08C7D] text-[#F08C7D] rounded-3xl font-bold w-52 py-2 px-4 fixed top-10 -left-28  transition duration-300 text-end"
          >
            Back
          </Link>
          <div className="max-w-sm w-full ">
            <div className="flex justify-center mb-12">
              {/* <div className="rounded-full flex items-center justify-center">
                <img src={black_logo} alt="logo" className="h-24 w-auto" />
              </div> */}
            </div>
            <h1 className=" text-[#F08C7D] text-4xl font-medium text-center mb-12 overflow-hidden">
              Check your Mailbox
            </h1>
            <p className="text-gray-800 text-center mb-12">
              Please enter the otp to proceed
            </p>
            <form onSubmit={handleotpVerification}>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                />
              </div>
              <button
                type="submit"
                className="border-2 border-[#F08C7D] mt-5 bg-[#F08C7D] px-8 w-full font-semibold  text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] transition"
              >
                VERIFY
              </button>
            </form>
          </div>
        </div>
        <div className="hidden w-full md:w-1/2 bg-[#F7B6A7] text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center h-[400px]">
            <div className="flex justify-center">
                    <img src={logo} alt="logo" className=" h-44 w-auto"/>
                </div>
            <p className="text-white text-lg mb-12">
              New to our platform ? Sign up now.
            </p>
            <Link
              to="/register"
              className="border-2 border-[#F08C7D] mt-5 bg-[#F08C7D] px-8 w-full font-semibold  text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
