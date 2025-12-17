import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, totalAmount = 0, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!orderId || !paymentMethod) {
      navigate("/", { replace: true });
    }
  }, [orderId, paymentMethod, navigate]);

  if (!orderId || !paymentMethod) return null;

  const isCOD = paymentMethod === "cod";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-6">
        {/* ✅ Success Icon */}
        <div className="flex items-center justify-center bg-green-100 w-20 h-20 rounded-full mx-auto">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Order Placed Successfully!
        </h1>

        {/* ✅ Order Details */}
        <div className="text-gray-700 space-y-2 text-sm">
          <p>
            Order ID:{" "}
            <span className="font-semibold text-gray-900">#{orderId}</span>
          </p>

          <p>
            <span className="font-medium">Order Total:</span> ₹{totalAmount}
          </p>

          {isCOD ? (
            <>
              <p className="text-green-700 font-medium">
                ₹200 advance paid successfully
              </p>
              <p className="text-gray-600">
                Remaining amount will be collected on delivery
              </p>
              <p className="font-medium">
                Payment Method: Cash on Delivery
              </p>
            </>
          ) : (
            <p className="font-medium text-green-700">
              Payment completed online via Razorpay
            </p>
          )}
        </div>

        {/* ✅ Actions */}
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
