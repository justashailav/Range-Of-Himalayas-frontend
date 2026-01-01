import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestReturnItems } from "@/store/slices/orderSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function ReturnRequestPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderDetails = state?.orderDetails;

  const [reasonInputs, setReasonInputs] = useState({});
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!orderDetails) {
    return (
      <div className="p-6 text-center text-gray-500">
        Order details not available.
      </div>
    );
  }

  const handleReasonChange = (productId, value) => {
    setReasonInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "photo") setPhotos(files);
    else setVideos(files);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      orderDetails.cartItems.forEach((item, idx) => {
        formData.append(`items[${idx}][productId]`, item.productId);
        formData.append(`items[${idx}][quantity]`, item.quantity);
        formData.append(
          `items[${idx}][reason]`,
          reasonInputs[item.productId] || "No reason provided"
        );
      });
      photos.forEach((file) => formData.append("photos", file));
      videos.forEach((file) => formData.append("videos", file));

      await dispatch(requestReturnItems(orderId, formData));
      toast.success("Return request submitted!");
      navigate(-1);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to request return"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-lg">

  {/* HEADER */}
  <div className="mb-8">
    <h1 className="text-3xl font-extrabold text-gray-900">
      Return Request
    </h1>
    <p className="text-gray-500 mt-1">
      Tell us what went wrong and help us improve
    </p>
  </div>

  {/* STEP 1: ITEMS */}
  <div className="space-y-5">
    <h2 className="text-xl font-bold text-gray-800">
      1️⃣ Select items & reason
    </h2>

    {orderDetails.cartItems.map((item) => (
      <Card
        key={item.productId}
        className="border border-gray-200 rounded-2xl hover:shadow-md transition"
      >
        <CardContent className="p-5 flex flex-col md:flex-row gap-5">

          {/* IMAGE */}
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rounded-xl object-cover border"
          />

          {/* DETAILS */}
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-lg">
              {item.name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Quantity: {item.quantity} · ₹{item.price}
            </p>

            <label className="block mt-4 text-sm font-medium text-gray-700">
              Reason for return (optional)
            </label>
            <textarea
              placeholder="e.g. Item damaged, quality issue, wrong item received"
              value={reasonInputs[item.productId] || ""}
              onChange={(e) =>
                handleReasonChange(item.productId, e.target.value)
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-300 p-3
              focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>

  {/* STEP 2: UPLOADS */}
  <div className="mt-10 space-y-6">
    <h2 className="text-xl font-bold text-gray-800">
      2️⃣ Upload proof (optional)
    </h2>

    {/* PHOTOS */}
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-500 transition">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload photos
      </label>
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(e, "photo")}
        className="cursor-pointer"
      />

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {photos.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt={`photo-${idx}`}
              className="w-24 h-24 rounded-xl object-cover border shadow-sm"
            />
          ))}
        </div>
      )}
    </div>

    {/* VIDEOS */}
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-500 transition">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload videos
      </label>
      <Input
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => handleFileChange(e, "video")}
        className="cursor-pointer"
      />

      {videos.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {videos.map((file, idx) => (
            <video
              key={idx}
              src={URL.createObjectURL(file)}
              controls
              className="w-36 h-24 rounded-xl border shadow-sm"
            />
          ))}
        </div>
      )}
    </div>
  </div>

  {/* CTA */}
  <div className="mt-10">
    <Button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="w-full py-4 text-lg rounded-2xl text-white
      bg-gradient-to-r from-blue-600 to-indigo-600
      hover:from-blue-700 hover:to-indigo-700
      shadow-lg hover:shadow-xl transition disabled:opacity-60"
    >
      {isSubmitting ? "Submitting request..." : "Submit Return Request"}
    </Button>

    <p className="text-xs text-gray-500 text-center mt-3">
      Our team will review your request within 24–48 hours
    </p>
  </div>
</div>

  );
}
