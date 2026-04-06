import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Edit2, Trash2, Power, MapPin, Phone, Mail, 
  Truck, Package, Settings, Globe, Shield, Info, ChevronRight
} from "lucide-react";
import { createStore, deleteStore, fetchAllStores, toggleStore, updateStore } from "@/store/slices/storeSlice";

export default function AdminStore() {
  const dispatch = useDispatch();
  const { storeList } = useSelector((state) => state.store);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const initialForm = {
    name: "", slug: "", code: "",
    phone: "", whatsapp: "", email: "",
    address: { line1: "", line2: "", city: "", state: "", country: "India", pincode: "" },
    location: { type: "Point", coordinates: [77.1025, 28.7041] }, 
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
    tags: "",
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <div className="bg-black p-2 rounded-xl text-white">
                <Settings size={28} />
              </div>
              Store Engine
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage logistics, geofencing, and retail operations.</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-white shadow-sm border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-slate-600">{storeList.length} Active Outlets</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: SMART FORM --- */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-8">
              
              {/* Tab Bar */}
              <div className="flex p-2 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                {[
                  { id: "basic", icon: <Info size={14}/> },
                  { id: "address", icon: <MapPin size={14}/> },
                  { id: "services", icon: <Truck size={14}/> },
                  { id: "config", icon: <Shield size={14}/> }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeTab === t.id 
                        ? "bg-white shadow-sm text-black ring-1 ring-slate-200" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t.icon}
                    <span className="hidden sm:inline">{t.id}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                <div className="min-h-[380px]">
                  {activeTab === "basic" && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Public Name" name="name" value={form.name} onChange={handleChange} placeholder="The Grand Outlet" />
                        <Input label="Internal Code" name="code" value={form.code} onChange={handleChange} placeholder="TR-001" />
                      </div>
                      <Input label="Slug / URL Path" name="slug" value={form.slug} onChange={handleChange} placeholder="grand-outlet-nyc" />
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                        <Input label="Primary Phone" name="phone" value={form.phone} onChange={handleChange} />
                        <Input label="Support Email" name="email" value={form.email} onChange={handleChange} />
                      </div>
                    </div>
                  )}

                  {activeTab === "address" && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                      <Input label="Street Details" name="address.line1" value={form.address.line1} onChange={handleChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
                        <Input label="Pincode" name="address.pincode" value={form.address.pincode} onChange={handleChange} />
                      </div>
                      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-inner">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                          <Globe size={12}/> Precision Geofencing
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Lng</label>
                            <input type="number" name="location.coordinates.0" value={form.location.coordinates[0]} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold px-1">Lat</label>
                            <input type="number" name="location.coordinates.1" value={form.location.coordinates[1]} onChange={handleChange} className="w-full bg-slate-800 border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "services" && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100/50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-black uppercase text-blue-600 tracking-tighter">Logistics: Delivery</h4>
                          <Toggle name="services.delivery.enabled" checked={form.services.delivery.enabled} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Radius (KM)" type="number" name="services.delivery.radiusKm" value={form.services.delivery.radiusKm} onChange={handleChange} />
                          <Input label="Base Fee ($)" type="number" name="services.delivery.charge" value={form.services.delivery.charge} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100/50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-black uppercase text-emerald-600 tracking-tighter">In-Store: Pickup</h4>
                          <Toggle name="services.pickup.enabled" checked={form.services.pickup.enabled} onChange={handleChange} color="emerald" />
                        </div>
                        <Input label="Preparation Window (Mins)" type="number" name="services.pickup.preparationTimeMinutes" value={form.services.pickup.preparationTimeMinutes} onChange={handleChange} />
                      </div>
                    </div>
                  )}

                  {activeTab === "config" && (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="grid grid-cols-2 gap-4">
                        <Select label="Inventory Type" name="inventoryType" value={form.inventoryType} onChange={handleChange}>
                          <option value="store-based">Store-Based</option>
                          <option value="central">Centralized</option>
                        </Select>
                        <Input label="Priority Weight" type="number" name="priority" value={form.priority} onChange={handleChange} />
                      </div>
                      <Input label="Meta Tags (Comma Separated)" name="tags" value={form.tags} onChange={handleChange} placeholder="express, flagship, 24-hours" />
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Internal Notes</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border border-slate-200 rounded-2xl p-4 text-sm h-28 focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Enter private staff instructions..." />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                    {editId ? <Edit2 size={16}/> : <Plus size={18}/>}
                    {editId ? "Update Store" : "Register Store"}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => {setEditId(null); setForm(initialForm);}} className="flex-1 border border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* --- RIGHT: DATA TABLE --- */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identifer</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Health</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {storeList.map((store) => (
                      <tr key={store._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-lg group-hover:bg-black group-hover:text-white transition-all">
                              {store.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-base">{store.name}</div>
                              <div className="text-xs font-medium text-slate-400 mt-0.5">{store.code} • {store.address?.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${store.inventoryType === 'central' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                            {store.inventoryType}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                             <StatusPill label="Systems" active={store.isActive} />
                             <StatusPill label="Orders" active={store.isAcceptingOrders} color="blue" />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <ActionBtn icon={<Edit2 size={16}/>} onClick={() => { setEditId(store._id); setForm(store); window.scrollTo(0,0); }} />
                            <ActionBtn icon={<Power size={16}/>} color="orange" onClick={() => dispatch(toggleStore(store._id))} />
                            <ActionBtn icon={<Trash2 size={16}/>} color="red" onClick={() => dispatch(deleteStore(store._id))} />
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

/* --- REUSABLE ATOMS --- */

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-tighter group-focus-within:text-black transition-colors">{label}</label>
    <input {...props} className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-slate-200 focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-300" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-tighter">{label}</label>
    <div className="relative">
      <select {...props} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-200 transition-all appearance-none">
        {children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronRight size={14} className="rotate-90"/>
      </div>
    </div>
  </div>
);

const Toggle = ({ name, checked, onChange, color = "blue" }) => {
  const styles = {
    blue: checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400",
    emerald: checked ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-400"
  };
  return (
    <select 
      name={name} value={checked} onChange={onChange}
      className={`text-[9px] font-black py-1 px-3 rounded-full border uppercase transition-all outline-none cursor-pointer ${styles[color]}`}
    >
      <option value={1}>On</option>
      <option value={0}>Off</option>
    </select>
  );
};

const StatusPill = ({ label, active, color = "emerald" }) => {
  const colors = {
    emerald: active ? "text-emerald-600" : "text-slate-300",
    blue: active ? "text-blue-600" : "text-slate-300"
  };
  return (
    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${colors[color]}`}>
      <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-current animate-pulse' : 'bg-slate-200'}`} />
      {label}
    </div>
  );
};

const ActionBtn = ({ icon, onClick, color = "slate" }) => {
  const variants = {
    slate: "hover:bg-slate-100 text-slate-400 hover:text-slate-900",
    red: "hover:bg-red-50 text-slate-400 hover:text-red-600",
    orange: "hover:bg-orange-50 text-slate-400 hover:text-orange-600"
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all duration-200 ${variants[color]}`}>
      {icon}
    </button>
  );
};