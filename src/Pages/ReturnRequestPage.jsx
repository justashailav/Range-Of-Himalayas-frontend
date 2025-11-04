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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Return Request</h1>

      <div className="grid gap-4">
        {orderDetails.cartItems.map((item) => (
          <Card
            key={item.productId}
            className="transition-shadow hover:shadow-lg border border-gray-100"
          >
            <CardContent className="flex flex-col md:flex-row gap-4 p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md border"
              />
              <div className="flex-1 flex flex-col">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} | ₹{item.price}
                </p>
                <label className="mt-3 text-sm font-medium text-gray-700">
                  Reason for return
                </label>
                <textarea
                  placeholder="Enter reason (optional)"
                  value={reasonInputs[item.productId] || ""}
                  onChange={(e) =>
                    handleReasonChange(item.productId, e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded p-2 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File Uploads */}
      <div className="mt-8 space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Photos</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, "photo")}
            className="cursor-pointer"
          />
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photos.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${idx}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Videos</label>
          <Input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleFileChange(e, "video")}
            className="cursor-pointer"
          />
          {videos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {videos.map((file, idx) => (
                <video
                  key={idx}
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-32 h-24 rounded-md border"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit Return Request"}
      </Button>
    </div>
  );
}
