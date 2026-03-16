import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { requestReturnItems } from "@/store/slices/orderSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Camera, Video, ArrowLeft, Info } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-stone-400 font-serif italic">
          Manifest data not found...
        </p>
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
          reasonInputs[item.productId] || "No reason provided",
        );
      });
      photos.forEach((file) => formData.append("photos", file));
      videos.forEach((file) => formData.append("videos", file));

      await dispatch(requestReturnItems(orderId, formData));
      toast.success("Return request submitted successfully");
      navigate(`/order-details/${orderId}`, {
  state: { orderDetails, returnRequested: true },
});
    } catch (error) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 sm:p-10 text-stone-900">
      <div className="max-w-4xl mx-auto">
        {/* BACK NAVIGATION */}
        <button
          onClick={() => navigate(`/order-details/${orderId}`)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Order
        </button>

        {/* HEADER SECTION */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-stone-900" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">
              Service Request
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">
            Return{" "}
            <span className="font-serif italic font-light text-stone-300">
              Inquiry
            </span>
          </h1>
          <p className="max-w-md text-sm text-stone-500 font-medium leading-relaxed">
            We aim for perfection, but sometimes things fall short. Provide
            details below to initiate your return process.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* LEFT COLUMN: ITEMS */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">
                  01. Parcel Contents
                </h2>
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  Select & Specify
                </span>
              </div>

              <div className="space-y-6">
                {orderDetails.cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="group relative bg-white border border-stone-100 rounded-[2rem] p-6 hover:border-stone-300 transition-all duration-500"
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black uppercase tracking-tight text-sm mb-1">
                          {item.name}
                        </h3>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                          Qty: {item.quantity} ·{" "}
                          <span className="text-stone-900 italic font-serif lowercase text-xs">
                            ₹{item.price}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-2">
                        Reason for Return
                      </label>
                      <textarea
                        placeholder="Describe the issue (e.g., Damage, quality, wrong item)..."
                        value={reasonInputs[item.productId] || ""}
                        onChange={(e) =>
                          handleReasonChange(item.productId, e.target.value)
                        }
                        className="w-full bg-stone-50 rounded-2xl border-none p-4 text-sm focus:ring-1 focus:ring-stone-200 placeholder:text-stone-300 resize-none transition-all"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: UPLOADS & CTA */}
          <div className="lg:col-span-5 space-y-10">
            <section className="sticky top-10">
              <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">
                  02. Evidence
                </h2>
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  Optional
                </span>
              </div>

              <div className="space-y-4 mb-10">
                {/* PHOTO UPLOAD */}
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "photo")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border border-dashed border-stone-200 rounded-[2rem] p-8 text-center group-hover:bg-stone-50 group-hover:border-stone-400 transition-all">
                    <Camera
                      className="mx-auto mb-3 text-stone-300 group-hover:text-stone-900 transition-colors"
                      size={24}
                    />
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      Add Photographs
                    </p>
                  </div>
                </div>

                {/* PHOTO PREVIEW */}
                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {photos.map((file, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-stone-100 shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* VIDEO UPLOAD */}
                <div className="relative group">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "video")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border border-dashed border-stone-200 rounded-[2rem] p-8 text-center group-hover:bg-stone-50 group-hover:border-stone-400 transition-all">
                    <Video
                      className="mx-auto mb-3 text-stone-300 group-hover:text-stone-900 transition-colors"
                      size={24}
                    />
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      Add Video Proof
                    </p>
                  </div>
                </div>
              </div>

              {/* FINAL ACTIONS */}
              <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-stone-200">
                <div className="flex items-center gap-3 mb-6">
                  <Info size={14} className="text-stone-500" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
                    Manifest Review Policy
                  </p>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mb-8 italic">
                  Return requests are processed by our Himalayan Logistics team
                  within 48 business hours.
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-white text-stone-900 hover:bg-stone-200 py-7 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl"
                >
                  {isSubmitting ? "Syncing Data..." : "Submit Request"}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
