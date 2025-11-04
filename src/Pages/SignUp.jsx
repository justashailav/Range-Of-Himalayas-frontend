import { register, resetAuthSlice } from "@/store/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo-himalayas.png"
import { Helmet } from "react-helmet";
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    dispatch(register(data));
  };
  useEffect(() => {
    if (message) {
      navigateTo(`/otp-verification/${email}`);
      toast.success()
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
      <div className="flex flex-col justify-center md:flex-row bg-[#FFECE8] h-screen">
      <Helmet>
        <title>Signup - Range Of Himalayas </title>
        <meta
          name="description"
          content="Range Of Himalayas – Fresh apples, juicy kiwis directly sourced from the Himalayan farms."
        />
      </Helmet>
        <div className="hidden w-full md:w-1/2 bg-[#F7B6A7] text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center h-[376px]">
            <div className="flex justify-center">
              <img src={logo} alt="logo" className=" h-44 w-auto" />
            </div>
            <p className="text-white text-lg mb-12">
              Already have an account? Sign in now.
            </p>
            <Link
              to="/login"
              className="border-2 border-[#F08C7D] mt-5 bg-[#F08C7D] px-8 w-full font-semibold  text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#FFECE8] p-8">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-12">
              <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
                <h3 className="font-medium text-4xl text-[#F08C7D]">
                Unlock Your Cart
                </h3>
                {/* <img
                  src={logo}
                  alt="logo"
                  className="h-auto w-24 object-cover"
                /> */}
              </div>
            </div>
            <p className=" text-center mb-12 text-[#F08C7D]">
              Please provide your information to sign up.
            </p>
            <form onSubmit={handleRegister}>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                />
              </div>
              <div className="mb-2">
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                />
              </div>
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
                />
              </div>
              <div className="block md:hidden font-semibold mt-5">
                <p>
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Sign In
                  </Link>{" "}
                </p>
              </div>
              <button
                type="submit"
                className="mt-5 w-full font-semibold bg-[#F08C7D] text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
