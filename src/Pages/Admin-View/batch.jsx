import { createBatch, getAllBatches } from "@/store/slices/batchSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, MapPin, User, Package, Calendar, Activity, X, Video, BookOpen } from "lucide-react";

export default function AdminBatch() {
  const dispatch = useDispatch();
  const { batchList, loading } = useSelector((state) => state.batch);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productType: "pulp",
    location: "",
    state: "",
    harvestDate: "",
    harvestSeason: "",
    harvestedBy: "",
    processedDate: "",
    processingMethod: "natural",
    packagingDate: "",
    packagingType: "glass",
    farmerName: "",
    farmerVillage: "",
    totalUnits: "",
    remainingUnits: "",
    story: "",
    videoUrl: "",
  });

  useEffect(() => {
    dispatch(getAllBatches());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      productName: formData.productName,
      productType: formData.productType,
      origin: { location: formData.location, state: formData.state },
      harvestDate: formData.harvestDate,
      harvestSeason: formData.harvestSeason,
      harvestedBy: formData.harvestedBy,
      processedDate: formData.processedDate,
      processingMethod: formData.processingMethod,
      packagingDate: formData.packagingDate,
      packagingType: formData.packagingType,
      farmer: { name: formData.farmerName, village: formData.farmerVillage },
      totalUnits: Number(formData.totalUnits),
      remainingUnits: Number(formData.remainingUnits),
      story: formData.story,
      videoUrl: formData.videoUrl,
    };

    dispatch(createBatch(payload)).then(() => {
      dispatch(getAllBatches());
      setOpenModal(false);
      resetForm();
    });
  };

  const resetForm = () => {
    setFormData({
      productName: "", productType: "pulp", location: "", state: "",
      harvestDate: "", harvestSeason: "", harvestedBy: "", processedDate: "",
      processingMethod: "natural", packagingDate: "", packagingType: "glass",
      farmerName: "", farmerVillage: "", totalUnits: "", remainingUnits: "",
      story: "", videoUrl: "",
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Batch Management</h1>
            <p className="text-gray-500">Track and manage your Himalayan product batches</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-green-100"
          >
            <Plus size={20} /> Create New Batch
          </button>
        </div>

        {/* BATCH LIST */}
        {batchList?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No batches found. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batchList?.map((batch) => (
              <div key={batch._id} className="group bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-1 rounded">
                     {batch.productType}
                   </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-1">{batch.productName}</h3>
                <p className="text-xs font-mono text-green-600 mb-4">{batch.batchId || 'BATCH-000'}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" /> {batch.origin?.location}, {batch.origin?.state}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" /> {batch.farmer?.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-gray-400" /> {batch.remainingUnits} / {batch.totalUnits} Units left
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">New Product Batch</h2>
              <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Info */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">General Info</label>
                  <input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none" required />
                  <select name="productType" value={formData.productType} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none">
                    <option value="pulp">Pulp</option>
                    <option value="juice">Juice</option>
                    <option value="oil">Oil</option>
                  </select>
                </div>

                {/* Origin */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Origin & Farmer</label>
                  <div className="flex gap-2">
                    <input name="location" placeholder="Village/Locality" value={formData.location} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 outline-none" />
                    <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 outline-none" />
                  </div>
                  <input name="farmerName" placeholder="Farmer Name" value={formData.farmerName} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none" />
                </div>

                {/* Harvest Details */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Harvest</label>
                  <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none" />
                  <input name="harvestSeason" placeholder="Season (e.g. Winter 2024)" value={formData.harvestSeason} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none" />
                </div>

                {/* Logistics */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Stock & Units</label>
                  <div className="flex gap-2">
                    <input type="number" name="totalUnits" placeholder="Total" value={formData.totalUnits} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 outline-none" />
                    <input type="number" name="remainingUnits" placeholder="Remaining" value={formData.remainingUnits} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 outline-none" />
                  </div>
                  <select name="packagingType" value={formData.packagingType} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 outline-none">
                    <option value="glass">Glass Bottle</option>
                    <option value="eco-pack">Eco Friendly Pack</option>
                    <option value="plastic">Recycled Plastic</option>
                  </select>
                </div>

                {/* Story & Media */}
                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Storytelling</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white">
                    <Video size={18} className="text-gray-400" />
                    <input name="videoUrl" placeholder="Video URL (YouTube/Vimeo)" value={formData.videoUrl} onChange={handleChange} className="w-full p-2.5 outline-none" />
                  </div>
                  <textarea name="story" placeholder="Share the journey of this batch..." value={formData.story} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 min-h-[100px] outline-none" />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-100"
                >
                  {loading ? "Processing..." : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}