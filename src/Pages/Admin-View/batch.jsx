import { createBatch, getAllBatches } from "@/store/slices/batchSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

      origin: {
        location: formData.location,
        state: formData.state,
      },

      harvestDate: formData.harvestDate,
      harvestSeason: formData.harvestSeason,
      harvestedBy: formData.harvestedBy,

      processedDate: formData.processedDate,
      processingMethod: formData.processingMethod,

      packagingDate: formData.packagingDate,
      packagingType: formData.packagingType,

      farmer: {
        name: formData.farmerName,
        village: formData.farmerVillage,
      },

      totalUnits: Number(formData.totalUnits),
      remainingUnits: Number(formData.remainingUnits),

      story: formData.story,
      videoUrl: formData.videoUrl,
    };

    dispatch(createBatch(payload)).then(() => {
      dispatch(getAllBatches());
    });

    setOpenModal(false);

    setFormData({
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
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Batch Panel 🌿</h1>

      <button
        onClick={() => setOpenModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        + Create Batch
      </button>

      {/* MODAL */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl p-6 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Create Batch</h2>

            <form onSubmit={handleSubmit} className="space-y-3 max-h-[80vh] overflow-y-auto">

              <input name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} className="w-full border p-2" />

              <select name="productType" value={formData.productType} onChange={handleChange} className="w-full border p-2">
                <option value="pulp">Pulp</option>
                <option value="juice">Juice</option>
                <option value="oil">Oil</option>
              </select>

              <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full border p-2" />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full border p-2" />

              <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="w-full border p-2" />
              <input name="harvestSeason" placeholder="Harvest Season" value={formData.harvestSeason} onChange={handleChange} className="w-full border p-2" />
              <input name="harvestedBy" placeholder="Harvested By" value={formData.harvestedBy} onChange={handleChange} className="w-full border p-2" />

              <input type="date" name="processedDate" value={formData.processedDate} onChange={handleChange} className="w-full border p-2" />

              <select name="processingMethod" value={formData.processingMethod} onChange={handleChange} className="w-full border p-2">
                <option value="natural">Natural</option>
                <option value="cold-pressed">Cold Pressed</option>
                <option value="manual">Manual</option>
              </select>

              <input type="date" name="packagingDate" value={formData.packagingDate} onChange={handleChange} className="w-full border p-2" />

              <select name="packagingType" value={formData.packagingType} onChange={handleChange} className="w-full border p-2">
                <option value="glass">Glass</option>
                <option value="eco-pack">Eco Pack</option>
                <option value="plastic">Plastic</option>
              </select>

              <input name="farmerName" placeholder="Farmer Name" value={formData.farmerName} onChange={handleChange} className="w-full border p-2" />
              <input name="farmerVillage" placeholder="Farmer Village" value={formData.farmerVillage} onChange={handleChange} className="w-full border p-2" />

              <input type="number" name="totalUnits" placeholder="Total Units" value={formData.totalUnits} onChange={handleChange} className="w-full border p-2" />
              <input type="number" name="remainingUnits" placeholder="Remaining Units" value={formData.remainingUnits} onChange={handleChange} className="w-full border p-2" />

              <input name="videoUrl" placeholder="Video URL" value={formData.videoUrl} onChange={handleChange} className="w-full border p-2" />

              <textarea name="story" placeholder="Story" value={formData.story} onChange={handleChange} className="w-full border p-2" />

              <button className="bg-green-600 text-white w-full py-2 rounded">
                {loading ? "Creating..." : "Create Batch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BATCH LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {batchList?.map((batch) => (
          <div key={batch._id} className="border p-4 rounded bg-white">
            <h3 className="font-bold">{batch.productName}</h3>
            <p>Batch: {batch.batchId}</p>
            <p>📍 {batch.origin?.location}</p>
            <p>👨‍🌾 {batch.farmer?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}