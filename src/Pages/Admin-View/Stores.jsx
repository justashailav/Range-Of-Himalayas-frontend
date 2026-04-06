import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Edit2, Trash2, Power, MapPin, Phone, Mail, 
  Truck, Package, Settings, Globe, Shield, Info, 
  ChevronRight, Search, LayoutGrid, List, Activity, Store
} from "lucide-react";
import { createStore, deleteStore, fetchAllStores, toggleStore, updateStore } from "@/store/slices/storeSlice";

export default function AdminStore() {
  const dispatch = useDispatch();
  const { storeList } = useSelector((state) => state.store);
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

  const filteredStores = storeList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-6 lg:p-10 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- TOP NAV / STATS --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
              Omnichannel <span className="text-blue-600">Hub</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
              <Activity size={14} className="text-green-500"/>
              {storeList.length} Network Nodes Online
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                className="w-full pl-10 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- ACTION PANEL (FORM) --- */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white p-2">
              <div className="bg-slate-900 rounded-[1.8rem] p-6 mb-2">
                <h2 className="text-white font-bold flex items-center gap-2">
                   <div className="p-1.5 bg-blue-500 rounded-lg"><Plus size={16}/></div>
                   {editId ? "Update Node" : "Deploy New Node"}
                </h2>
              </div>

              {/* Dynamic Tabs */}
              <div className="flex p-2 gap-1">
                {['basic', 'address', 'services', 'config'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="min-h-[350px]">
                  {activeTab === "basic" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <FieldGroup label="Store Identity">
                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Node Name" />
                        <Input name="code" value={form.code} onChange={handleChange} placeholder="UID Code" />
                      </FieldGroup>
                      <Input label="Slug URL" name="slug" value={form.slug} onChange={handleChange} placeholder="domain.com/store-slug" />
                      <FieldGroup label="Communications">
                        <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
                        <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                      </FieldGroup>
                    </div>
                  )}

                  {activeTab === "address" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <Input label="Primary Address" name="address.line1" value={form.address.line1} onChange={handleChange} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="City" name="address.city" value={form.address.city} onChange={handleChange} />
                        <Input label="Zip" name="address.pincode" value={form.address.pincode} onChange={handleChange} />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">GPS Calibration</span>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                           <input type="number" step="any" name="location.coordinates.0" value={form.location.coordinates[0]} onChange={handleChange} className="bg-white border-none rounded-xl p-2 text-xs shadow-sm" placeholder="Long" />
                           <input type="number" step="any" name="location.coordinates.1" value={form.location.coordinates[1]} onChange={handleChange} className="bg-white border-none rounded-xl p-2 text-xs shadow-sm" placeholder="Lat" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "services" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg text-white"><Truck size={16}/></div>
                          <span className="text-sm font-bold text-blue-900">Delivery</span>
                        </div>
                        <Toggle name="services.delivery.enabled" checked={form.services.delivery.enabled} onChange={handleChange} />
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500 rounded-lg text-white"><Package size={16}/></div>
                          <span className="text-sm font-bold text-emerald-900">Pickup</span>
                        </div>
                        <Toggle name="services.pickup.enabled" checked={form.services.pickup.enabled} onChange={handleChange} />
                      </div>
                      <Input label="Delivery Radius (KM)" type="number" name="services.delivery.radiusKm" value={form.services.delivery.radiusKm} onChange={handleChange} />
                    </div>
                  )}

                  {activeTab === "config" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <Select label="Inventory Control" name="inventoryType" value={form.inventoryType} onChange={handleChange}>
                        <option value="store-based">Store-Based (Local)</option>
                        <option value="central">Central (Cloud)</option>
                      </Select>
                      <Input label="Priority Rank" type="number" name="priority" value={form.priority} onChange={handleChange} />
                      <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl p-4 text-xs h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Internal logistics notes..." />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    {editId ? "Update Node" : "Deploy Node"}
                  </button>
                  {editId && (
                    <button type="button" onClick={() => {setEditId(null); setForm(initialForm);}} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-xs uppercase hover:bg-slate-200 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* --- DATA VIEW (TABLE) --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Info</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics</th>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</th>
                    <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStores.map((store) => (
                    <tr key={store._id} className="group hover:bg-blue-50/20 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-slate-200">
                            {store.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900">{store.name}</div>
                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-0.5">{store.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-1.5">
                           {store.services?.delivery?.enabled ? <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg" title="Delivery Active"><Truck size={12}/></div> : null}
                           {store.services?.pickup?.enabled ? <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg" title="Pickup Active"><Package size={12}/></div> : null}
                           <div className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded-lg text-slate-500">{store.inventoryType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <QuickActionToggle 
                            label="Active" 
                            active={store.isActive} 
                            onClick={() => dispatch(toggleStore(store._id))} 
                          />
                          <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${store.isAcceptingOrders ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {store.isAcceptingOrders ? 'Accepting Orders' : 'Paused'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <CircleBtn icon={<Edit2 size={14}/>} onClick={() => { setEditId(store._id); setForm(store); window.scrollTo(0,0); }} />
                          <CircleBtn icon={<Trash2 size={14}/>} color="red" onClick={() => dispatch(deleteStore(store._id))} />
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
  );
}

/* --- UI COMPONENTS --- */

const Input = ({ label, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">{label}</label>}
    <input {...props} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 shadow-sm" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="w-full">
    {label && <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block">{label}</label>}
    <select {...props} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 transition-all shadow-sm">
      {children}
    </select>
  </div>
);

const FieldGroup = ({ label, children }) => (
  <div className="space-y-2">
    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
      <div className="h-px flex-1 bg-slate-100"></div>
      {label}
      <div className="h-px flex-1 bg-slate-100"></div>
    </span>
    <div className="grid grid-cols-2 gap-3">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange, name }) => (
  <button 
    type="button"
    onClick={() => onChange({ target: { name, value: checked ? 0 : 1 } })}
    className={`w-10 h-5 rounded-full transition-all relative ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

const QuickActionToggle = ({ label, active, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 group text-left">
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
    <span className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-blue-600 transition-colors">{label}</span>
  </button>
);

const CircleBtn = ({ icon, onClick, color = "blue" }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
    red: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
  };
  return (
    <button onClick={onClick} className={`p-2.5 rounded-xl transition-all shadow-sm ${styles[color]}`}>
      {icon}
    </button>
  );
};