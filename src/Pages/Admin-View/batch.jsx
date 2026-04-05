import { createBatch, getAllBatches } from "@/store/slices/batchSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  MapPin,
  User,
  Package,
  Calendar,
  Activity,
  X,
  Video,
  Globe,
  Mountain,
  Droplets,
  Trash2,
  CheckCircle2,
  Navigation,
  Database,
  ClipboardList,
  Layers,
  ExternalLink,
  Download,
} from "lucide-react";

export default function AdminBatch() {
  const dispatch = useDispatch();
  const { batchList, loading } = useSelector((state) => state.batch);
  const [openModal, setOpenModal] = useState(false);

  const initialFormState = {
    productName: "",
    productType: "pulp",
    location: "",
    state: "",
    country: "India",
    lat: "",
    lng: "",
    altitude: "",
    harvestDate: "",
    harvestSeason: "",
    harvestedBy: "",
    processedDate: "",
    processingMethod: "natural",
    farmerName: "",
    farmerVillage: "",
    farmerImage: "",
    packagingDate: "",
    packagingType: "glass",
    totalUnits: "",
    remainingUnits: "",
    story: "",
    images: [],
    videoUrl: "",
    timeline: [{ step: "", date: "", description: "" }],
    qrCode: "",
    isVerified: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(getAllBatches());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTimelineChange = (index, e) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][e.target.name] = e.target.value;
    setFormData({ ...formData, timeline: newTimeline });
  };

  const addTimelineStep = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { step: "", date: "", description: "" }],
    });
  };

  const removeTimelineStep = (index) => {
    setFormData({
      ...formData,
      timeline: formData.timeline.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      origin: {
        location: formData.location,
        state: formData.state,
        country: formData.country,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        altitude: Number(formData.altitude),
      },
      farmer: {
        name: formData.farmerName,
        village: formData.farmerVillage,
        image: formData.farmerImage,
      },
      totalUnits: Number(formData.totalUnits),
      remainingUnits: Number(formData.remainingUnits),
    };

    dispatch(createBatch(payload)).then(() => {
      dispatch(getAllBatches());
      setOpenModal(false);
      resetForm();
    });
  };

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Layers className="text-emerald-600" /> Batch Management
            </h1>
            <p className="text-slate-500 font-medium">
              Traceability & Inventory Control for Himalayan Organics
            </p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            Create New Batch
          </button>
        </header>

        {/* --- BATCH LIST GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {batchList?.map((batch) => (
    <div
      key={batch._id}
      className="group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
    >
      {/* 1. TOP VISUAL SECTION */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-white/10">
              {batch.productType}
            </span>
            {batch.isVerified && (
              <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
          
          <div>
            <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.2em] mb-1">
              Batch Serial
            </p>
            <h3 className="text-2xl font-black text-white leading-none">
              {batch.productName}
            </h3>
          </div>
        </div>
      </div>

      {/* 2. INFO SECTION */}
      <div className="p-6 space-y-4 flex-grow">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Origin</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <MapPin size={14} className="text-emerald-500" />
              <span className="truncate">{batch.origin?.location}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cultivator</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <User size={14} className="text-emerald-500" />
              <span className="truncate">{batch.farmer?.name}</span>
            </div>
          </div>
        </div>

        {/* Inventory Progress */}
        <div className="pt-4 border-t border-slate-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Availability</span>
            <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {batch.remainingUnits} / {batch.totalUnits} Units
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              style={{ width: `${(batch.remainingUnits / batch.totalUnits) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE FOOTER (QR & CTA) */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center gap-3">
          {/* Subtle QR Trigger */}
          {batch.qrCode && (
            <div className="relative group/qr">
              <img
                src={batch.qrCode}
                alt="QR"
                className="w-12 h-12 rounded-xl border border-slate-100 p-1 bg-slate-50 grayscale hover:grayscale-0 transition-all cursor-pointer"
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/qr:block bg-slate-900 text-white text-[9px] py-1 px-2 rounded whitespace-nowrap">
                Click to Download
              </div>
            </div>
          )}
          
          <button 
            onClick={() => navigate(`/batch/${batch.batchId}`)}
            className="flex-1 bg-slate-900 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            Trace Batch <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* --- MODAL --- */}
      {openModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Add New Batch
                </h2>
                <p className="text-sm text-slate-500">
                  Fill in all details to ensure 100% product traceability.
                </p>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 overflow-y-auto space-y-10"
            >
              {/* Row 1: Identity & Farmer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <SectionHeader
                    icon={<Activity size={18} />}
                    title="Identity"
                  />
                  <input
                    name="productName"
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value="pulp">Pulp</option>
                    <option value="juice">Juice</option>
                    <option value="oil">Oil</option>
                  </select>
                  <input
                    name="qrCode"
                    placeholder="QR Serial / Code"
                    value={formData.qrCode}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>

                <div className="space-y-4">
                  <SectionHeader
                    icon={<User size={18} />}
                    title="Farmer Details"
                  />
                  <input
                    name="farmerName"
                    placeholder="Farmer Name"
                    value={formData.farmerName}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <input
                    name="farmerVillage"
                    placeholder="Farmer Village"
                    value={formData.farmerVillage}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <input
                    name="farmerImage"
                    placeholder="Farmer Image URL"
                    value={formData.farmerImage}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>

                <div className="space-y-4">
                  <SectionHeader
                    icon={<Navigation size={18} />}
                    title="Origin Geodata"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="location"
                      placeholder="Village"
                      value={formData.location}
                      onChange={handleChange}
                      className="modern-input"
                    />
                    <input
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      name="lat"
                      placeholder="Lat"
                      value={formData.lat}
                      onChange={handleChange}
                      className="modern-input"
                    />
                    <input
                      name="lng"
                      placeholder="Lng"
                      value={formData.lng}
                      onChange={handleChange}
                      className="modern-input"
                    />
                    <input
                      name="altitude"
                      placeholder="Alt (m)"
                      value={formData.altitude}
                      onChange={handleChange}
                      className="modern-input"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleChange}
                      className="w-5 h-5 accent-emerald-600"
                    />
                    <span className="text-sm font-bold text-emerald-800">
                      Mark as Verified Batch
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Harvest & Processing */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                <div className="space-y-4">
                  <SectionHeader
                    icon={<Calendar size={18} />}
                    title="Harvesting"
                  />
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <input
                    name="harvestSeason"
                    placeholder="Season (e.g. Winter 2024)"
                    value={formData.harvestSeason}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <input
                    name="harvestedBy"
                    placeholder="Harvested By"
                    value={formData.harvestedBy}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>

                <div className="space-y-4">
                  <SectionHeader
                    icon={<Droplets size={18} />}
                    title="Processing"
                  />
                  <input
                    type="date"
                    name="processedDate"
                    value={formData.processedDate}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <select
                    name="processingMethod"
                    value={formData.processingMethod}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value="natural">Natural</option>
                    <option value="cold-pressed">Cold Pressed</option>
                    <option value="manual">Manual Hand-Sorted</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <SectionHeader
                    icon={<Package size={18} />}
                    title="Packaging & Stock"
                  />

                  <input
                    type="date"
                    name="packagingDate"
                    value={formData.packagingDate}
                    onChange={handleChange}
                    className="modern-input"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="totalUnits"
                      placeholder="Total"
                      value={formData.totalUnits}
                      onChange={handleChange}
                      className="modern-input w-1/2"
                    />
                    <input
                      type="number"
                      name="remainingUnits"
                      placeholder="Remaining"
                      value={formData.remainingUnits}
                      onChange={handleChange}
                      className="modern-input w-1/2"
                    />
                  </div>
                  <select
                    name="packagingType"
                    value={formData.packagingType}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value="glass">Premium Glass</option>
                    <option value="eco-pack">Eco-Friendly Pack</option>
                    <option value="plastic">Recycled Plastic</option>
                  </select>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex justify-between items-center">
                  <SectionHeader
                    icon={<ClipboardList size={18} />}
                    title="Product Journey Timeline"
                  />
                  <button
                    type="button"
                    onClick={addTimelineStep}
                    className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={16} /> Add Milestone
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.timeline.map((step, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl relative group items-center"
                    >
                      <input
                        name="step"
                        placeholder="Milestone Title"
                        value={step.step}
                        onChange={(e) => handleTimelineChange(index, e)}
                        className="modern-input bg-white"
                      />
                      <input
                        type="date"
                        name="date"
                        value={step.date}
                        onChange={(e) => handleTimelineChange(index, e)}
                        className="modern-input bg-white"
                      />
                      <input
                        name="description"
                        placeholder="Description"
                        value={step.description}
                        onChange={(e) => handleTimelineChange(index, e)}
                        className="modern-input bg-white md:col-span-2"
                      />
                      {formData.timeline.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimelineStep(index)}
                          className="absolute -right-2 -top-2 bg-white text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Story & Video */}
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <SectionHeader
                  icon={<Video size={18} />}
                  title="Media & Storytelling"
                />

                <input
                  name="videoUrl"
                  placeholder="Video URL (YouTube/Vimeo)"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="modern-input"
                />

                <input
                  placeholder="Image URLs (comma separated)"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value.split(","),
                    })
                  }
                  className="modern-input"
                />

                <textarea
                  name="story"
                  placeholder="Write the unique story behind this specific baSttch..."
                  value={formData.story}
                  onChange={handleChange}
                  className="modern-input min-h-[120px]"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Cancel Changes
                </button>
                <button
                  disabled={loading}
                  className="flex-[2] bg-slate-900 text-white py-4 font-bold text-lg rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {loading
                    ? "Registering Batch..."
                    : "Finalize & Publish Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX for the "modern-input" utility */}
      <style jsx>{`
        .modern-input {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
        }
        .modern-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          background: white;
        }
      `}</style>
    </div>
  );
}

// Sub-component for Section Labels
function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-slate-800 mb-2">
      <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
        {icon}
      </span>
      <span className="text-[11px] font-black uppercase tracking-widest">
        {title}
      </span>
    </div>
  );
}
