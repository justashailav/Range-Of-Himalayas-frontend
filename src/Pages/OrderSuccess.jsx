import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, totalAmount, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!orderId || !paymentMethod) {
      navigate("/", { replace: true });
    }
  }, [orderId, paymentMethod, navigate]);

  if (!orderId || !paymentMethod) return null;

  const paymentText =
    paymentMethod === "cod" ? "Cash on Delivery" : "Paid via Razorpay";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center bg-green-100 w-20 h-20 rounded-full mx-auto">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Order Placed Successfully!
        </h1>

        <div className="text-gray-700 space-y-1">
          <p>
            Your order <span className="font-medium">#{orderId}</span> has been placed.
          </p>
          <p>
            <span className="font-medium">Total Amount:</span> ₹{totalAmount}
          </p>
          <p>
            <span className="font-medium">Payment Method:</span> {paymentText}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/account")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            View Orders
          </button>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
