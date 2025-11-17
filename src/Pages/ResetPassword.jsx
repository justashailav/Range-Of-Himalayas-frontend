import { resetAuthSlice, resetPassword } from '@/store/slices/authSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../assets/logo-himalayas.png"
import { Helmet } from 'react-helmet';
export default function ResetPassword() {
  const dispatch=useDispatch();
  const[password,setPassword]=useState("");
  const[confirmPassword,setConfirmPassword]=useState("");

  const{token}=useParams();
  const { loading, error, message, isAuthencated } = useSelector(
    (state) => state.auth
  );
  const handleResetPassword=(e)=>{
    e.preventDefault();
    const data=new FormData();
    data.append("password",password);
    data.append("confirmPassword",confirmPassword);
    dispatch(resetPassword(data,token))
  }
  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(resetAuthSlice())
    }
    if (error) {
      toast.error(message)
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthencated, error, loading]);
  if (isAuthencated) {
    return <Navigate to="/" />;
  }
  return (
    <div>
    <Helmet>
        <title>Reset Password - Range of Himalayas</title>
        <meta
          name="description"
          content="Reset your account password securely at Range of Himalayas. Enter your new password to continue."
        />
        <meta property="og:title" content="Reset Password - Range of Himalayas" />
        <meta
          property="og:description"
          content="Reset your password and regain access to your Range of Himalayas account."
        />
      </Helmet>
    <div className="flex flex-col justify-center bg-[#FFECE8]  md:flex-row h-screen">
      <div className="hidden w-full md:w-1/2 bg-[#F7B6A7] text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[376px]">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="h-44 w-auto" />
          </div>
          <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl front-medium leading-10">
            
          </h3>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-[#FFECE8] flex items-center justify-center p-8">
        <Link
          to="/password/forgot"
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
          <h1 className=" text-center text-[#F08C7D]  text-4xl font-medium mb-5 ">
            Reset Password
          </h1>
          <p className="text-[#F08C7D] text-center mb-12">
            Please enter your new password
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#F08C7D] text-[#333] placeholder-[#B97A6C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F08C7D]"
              />
            </div>
            <button
              type="submit"
              className="mt-5 w-full font-semibold bg-[#F08C7D] text-white py-2 rounded-lg hover:bg-white hover:text-[#F08C7D] border-2 border-[#F08C7D] transition"
              disabled={loading?true:false}
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}
