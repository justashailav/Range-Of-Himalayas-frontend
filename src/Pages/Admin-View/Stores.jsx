import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Edit2, Trash2, Power, MapPin, Phone, Mail, 
  Truck, Package, Settings, Globe, Shield, Info, 
  ChevronRight, Search, LayoutGrid, List, Activity, Store, X
} from "lucide-react";
import { createStore, deleteStore, fetchAllStores, toggleStore, updateStore } from "@/store/slices/storeSlice";

export default function AdminStore() {
  const dispatch = useDispatch();
  const { storeList } = useSelector((state) => state.store);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [searchTerm, setSearchTerm] = useState("");

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
    inventoryType: "store-based", priceMultiplier: 1, priority: 0, zone: "", tags: "", notes: ""
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => { dispatch(fetchAllStores()); }, [dispatch]);

  const openModal = (store = null) => {
    if (store) {
      setEditId(store._id);
      setForm(store);
    } else {
      setEditId(null);
      setForm(initialForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm(initialForm);
  };

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
    } else {
      dispatch(createStore(submissionData));
    }
    closeModal();
  };

  const filteredStores = storeList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Network <span className="text-blue-600">Infrastructure</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              {storeList.length} Active Nodes serving requests
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or UID..." 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
                onClick={() => openModal()}
                className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 px-6 font-bold text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Node</span>
            </button>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Node Entity</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Capabilities</th>
                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Operational Status</th>
                            <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStores.map((store) => (
                            <tr key={store._id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                                            {store.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{store.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{store.code}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        {store.services?.delivery?.enabled ? <Badge icon={<Truck size={12}/>} label="DLV" color="blue" /> : null}
                                        {store.services?.pickup?.enabled ? <Badge icon={<Package size={12}/>} label="PKP" color="emerald" /> : null}
                                        <span className="text-[10px] font-bold text-slate-400 border px-2 py-1 rounded-md">{store.inventoryType}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1.5">
                                        <StatusToggle active={store.isActive} onClick={() => dispatch(toggleStore(store._id))} />
                                        <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${store.isAcceptingOrders ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {store.isAcceptingOrders ? 'Online' : 'Paused'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CircleBtn icon={<Edit2 size={16}/>} onClick={() => openModal(store)} />
                                        <CircleBtn icon={<Trash2 size={16}/>} color="red" onClick={() => dispatch(deleteStore(store._id))} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={closeModal} />
            
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-8 border-b border-slate-100">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{editId ? "Configure Node" : "Deploy New Node"}</h2>
                        <p className="text-sm text-slate-500 font-medium">Define parameters for your store location.</p>
                    </div>
                    <button onClick={closeModal} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex bg-slate-50 p-2 gap-1 m-8 rounded-2xl">
                    {['basic', 'address', 'services', 'config'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8">
                    <div className="min-h-[300px]">
                        {activeTab === "basic" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Node Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Downtown Central" />
                                    <Input label="UID Code" name="code" value={form.code} onChange={handleChange} placeholder="ST-001" />
                                </div>
                                <Input label="Slug URL" name="slug" value={form.slug} onChange={handleChange} placeholder="downtown-central" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                                    <Input label="Email" name="email" value={form.email} onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {activeTab === "address" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <Input label="Street Address" name="address.line1" value={form.address.line1} onChange={handleChange} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
                                    <Input label="Zip Code" name="address.pincode" value={form.address.pincode} onChange={handleChange} />
                                </div>
                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase mb-3">Geofence Coordinates</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" step="any" name="location.coordinates.0" value={form.location.coordinates[0]} onChange={handleChange} className="bg-white border border-blue-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Longitude" />
                                        <input type="number" step="any" name="location.coordinates.1" value={form.location.coordinates[1]} onChange={handleChange} className="bg-white border border-blue-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" placeholder="Latitude" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "services" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <ServiceToggle icon={<Truck size={18}/>} title="Delivery Service" name="services.delivery.enabled" checked={form.services.delivery.enabled} onChange={handleChange} />
                                <ServiceToggle icon={<Package size={18}/>} title="In-Store Pickup" name="services.pickup.enabled" checked={form.services.pickup.enabled} onChange={handleChange} color="emerald" />
                                <Input label="Delivery Radius (KM)" type="number" name="services.delivery.radiusKm" value={form.services.delivery.radiusKm} onChange={handleChange} />
                            </div>
                        )}

                        {activeTab === "config" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <Select label="Inventory Control" name="inventoryType" value={form.inventoryType} onChange={handleChange}>
                                    <option value="store-based">Store-Based (Local)</option>
                                    <option value="central">Central (Cloud)</option>
                                </Select>
                                <Input label="Priority Rank" type="number" name="priority" value={form.priority} onChange={handleChange} />
                                <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs h-24 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Logistics notes..." />
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button type="button" onClick={closeModal} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                            Discard
                        </button>
                        <button className="flex-[2] bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            {editId ? "Save Changes" : "Confirm Deployment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}

/* --- REFINED SUB-COMPONENTS --- */

const Input = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">{label}</label>
    <input {...props} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">{label}</label>
    <select {...props} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
      {children}
    </select>
  </div>
);

const Badge = ({ icon, label, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600"
    };
    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-bold text-[10px] ${colors[color]}`}>
            {icon} {label}
        </div>
    );
};

const ServiceToggle = ({ icon, title, name, checked, onChange, color = "blue" }) => {
    const activeClass = color === "blue" ? "bg-blue-600" : "bg-emerald-600";
    const bgClass = color === "blue" ? "bg-blue-50 border-blue-100" : "bg-emerald-50 border-emerald-100";
    return (
        <div className={`p-4 ${bgClass} border rounded-2xl flex justify-between items-center`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 ${activeClass} text-white rounded-xl shadow-sm`}>{icon}</div>
                <span className="text-sm font-bold text-slate-700">{title}</span>
            </div>
            <button 
                type="button"
                onClick={() => onChange({ target: { name, value: checked ? 0 : 1 } })}
                className={`w-12 h-6 rounded-full transition-all relative ${checked ? activeClass : 'bg-slate-200'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );
};

const StatusToggle = ({ active, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 group">
    <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-300'}`} />
    <span className="text-[11px] font-bold text-slate-600 uppercase group-hover:text-blue-600 transition-colors">
        {active ? 'Active' : 'Inactive'}
    </span>
  </button>
);

const CircleBtn = ({ icon, onClick, color = "blue" }) => {
  const styles = {
    blue: "text-slate-400 hover:bg-blue-50 hover:text-blue-600",
    red: "text-slate-400 hover:bg-red-50 hover:text-red-600"
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all ${styles[color]}`}>
      {icon}
    </button>
  );
};