import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Edit2, Trash2, Power, MapPin, Phone, Mail, 
  Clock, Truck, Package, Settings, BarChart3, Tag 
} from "lucide-react";
import {
  fetchAllStores,
  createStore,
  updateStore,
  deleteStore,
  toggleStore
} from "@/store/storeSlice";

export default function AdminStore() {
  const dispatch = useDispatch();
  const { storeList } = useSelector((state) => state.store);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const initialForm = {
    name: "", slug: "", code: "",
    phone: "", whatsapp: "", email: "",
    address: { line1: "", line2: "", city: "", state: "", country: "India", pincode: "" },
    location: { type: "Point", coordinates: [77.1025, 28.7041] }, // Default [lng, lat]
    managerId: "",
    orderModes: ["pickup", "delivery"],
    services: {
      pickup: { enabled: 1, preparationTimeMinutes: 30, maxOrdersPerSlot: 20 },
      delivery: { enabled: 1, radiusKm: 5, charge: 0, freeDeliveryAbove: 0, estimatedTimeMinutes: 60 },
      expressDelivery: { enabled: 0, charge: 50, timeMinutes: 30 }
    },
    isActive: 1, isOpenNow: 1, isAcceptingOrders: 1,
    inventoryType: "store-based",
    priceMultiplier: 1,
    priority: 0,
    zone: "",
    tags: "", // Handled as string then split to array
    notes: ""
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => { dispatch(fetchAllStores()); }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setForm((prev) => {
        const updated = JSON.parse(JSON.stringify(prev));
        let obj = updated;
        for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
        obj[keys[keys.length - 1]] = val;
        return updated;
      });
    } else {
      setForm({ ...form, [name]: val });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = { 
      ...form, 
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()) : form.tags 
    };
    
    if (editId) {
      dispatch(updateStore({ id: editId, formData: submissionData }));
      setEditId(null);
    } else {
      dispatch(createStore(submissionData));
    }
    setForm(initialForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Store Manager</h1>
          <p className="text-gray-500">Global configurations for pickup, delivery, and inventory.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* --- COMPLEX FORM --- */}
          <div className="xl:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b overflow-x-auto bg-gray-50">
                {["basic", "address", "services", "config"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab ? "bg-white border-b-2 border-black text-black" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {activeTab === "basic" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Store Name" name="name" value={form.name} onChange={handleChange} placeholder="Main Hub" />
                      <Input label="Store Code" name="code" value={form.code} onChange={handleChange} placeholder="DXB-01" />
                    </div>
                    <Input label="Slug (URL)" name="slug" value={form.slug} onChange={handleChange} placeholder="main-hub-dubai" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                      <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                    </div>
                    <Input label="Manager ID (User Reference)" name="managerId" value={form.managerId} onChange={handleChange} />
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="space-y-4">
                    <Input label="Street Address" name="address.line1" value={form.address.line1} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
                      <Input label="Pincode" name="address.pincode" value={form.address.pincode} onChange={handleChange} />
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Geo-Coordinates (2dsphere)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Longitude" type="number" name="location.coordinates.0" value={form.location.coordinates[0]} onChange={handleChange} />
                        <Input label="Latitude" type="number" name="location.coordinates.1" value={form.location.coordinates[1]} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "services" && (
                  <div className="space-y-6">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-blue-700 flex items-center gap-2"><Truck size={16}/> Delivery</h4>
                        <Toggle name="services.delivery.enabled" checked={form.services.delivery.enabled} onChange={handleChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Radius (Km)" type="number" name="services.delivery.radiusKm" value={form.services.delivery.radiusKm} onChange={handleChange} />
                        <Input label="Fee ($)" type="number" name="services.delivery.charge" value={form.services.delivery.charge} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-green-700 flex items-center gap-2"><Package size={16}/> Pickup</h4>
                        <Toggle name="services.pickup.enabled" checked={form.services.pickup.enabled} onChange={handleChange} />
                      </div>
                      <Input label="Prep Time (Mins)" type="number" name="services.pickup.preparationTimeMinutes" value={form.services.pickup.preparationTimeMinutes} onChange={handleChange} />
                    </div>
                  </div>
                )}

                {activeTab === "config" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <Select label="Inventory Type" name="inventoryType" value={form.inventoryType} onChange={handleChange}>
                        <option value="store-based">Store-Based</option>
                        <option value="central">Centralized</option>
                      </Select>
                      <Input label="Priority" type="number" name="priority" value={form.priority} onChange={handleChange} />
                    </div>
                    <Input label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} placeholder="flagship, warehouse, organic" />
                    <textarea 
                      name="notes" value={form.notes} onChange={handleChange} 
                      className="w-full border rounded-lg p-2 text-sm h-24" placeholder="Internal notes..."
                    />
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                    {editId ? "Update Store" : "Create Store"}
                  </button>
                  {editId && (
                    <button 
                      type="button" onClick={() => {setEditId(null); setForm(initialForm);}}
                      className="px-4 border rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* --- DATA TABLE --- */}
          <div className="xl:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Store / Code</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400">Live Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {storeList.map((store) => (
                      <tr key={store._id} className="hover:bg-blue-50/30 transition group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{store.name}</div>
                          <div className="text-xs text-blue-600 font-medium">{store.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded font-medium text-gray-600">
                            {store.inventoryType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <StatusBadge label="Active" active={store.isActive} />
                             <StatusBadge label="Taking Orders" active={store.isAcceptingOrders} color="blue" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                            <ActionButton icon={<Edit2 size={14}/>} onClick={() => { setEditId(store._id); setForm(store); window.scrollTo(0,0); }} />
                            <ActionButton icon={<Power size={14}/>} color="orange" onClick={() => dispatch(toggleStore(store._id))} />
                            <ActionButton icon={<Trash2 size={14}/>} color="red" onClick={() => dispatch(deleteStore(store._id))} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE UI COMPONENTS --- */

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{label}</label>
    <input {...props} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{label}</label>
    <select {...props} className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
      {children}
    </select>
  </div>
);

const Toggle = ({ name, checked, onChange }) => (
  <select 
    name={name} value={checked} onChange={onChange}
    className={`text-[10px] font-bold py-1 px-2 rounded border uppercase ${checked ? 'bg-green-100 border-green-200 text-green-700' : 'bg-gray-100 text-gray-500'}`}
  >
    <option value={1}>Enabled</option>
    <option value={0}>Disabled</option>
  </select>
);

const StatusBadge = ({ label, active, color = "green" }) => {
  const colors = {
    green: active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400",
    blue: active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
  };
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block w-fit ${colors[color]}`}>
      {label}: {active ? "Yes" : "No"}
    </span>
  );
};

const ActionButton = ({ icon, onClick, color = "blue" }) => {
  const colors = {
    blue: "hover:bg-blue-100 hover:text-blue-600",
    red: "hover:bg-red-100 hover:text-red-600",
    orange: "hover:bg-orange-100 hover:text-orange-600"
  };
  return (
    <button onClick={onClick} className={`p-2 rounded-lg text-gray-400 transition-colors ${colors[color]}`}>
      {icon}
    </button>
  );
};