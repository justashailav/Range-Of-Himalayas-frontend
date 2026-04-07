import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  Power,
  MapPin,
  Phone,
  Mail,
  Truck,
  Package,
  Settings,
  Globe,
  Shield,
  Info,
  ChevronRight,
  Search,
  Activity,
  Store,
  X,
  Clock,
  CreditCard,
  Tag,
  Calendar,
  BarChart3,
  HardDrive,
  Layers,
} from "lucide-react";
import {
  createStore,
  deleteStore,
  fetchAllStores,
  toggleStore,
  updateStore,
} from "@/store/slices/storeSlice";
import { useNavigate } from "react-router-dom";

export default function AdminStore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeList } = useSelector((state) => state.store);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [searchTerm, setSearchTerm] = useState("");

  const initialForm = {
    name: "",
    slug: "",
    code: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
    location: { type: "Point", coordinates: [77.1025, 28.7041] },
    phone: "",
    whatsapp: "",
    email: "",
    staffIds: [],
    openingHours: [
      { day: "Monday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Tuesday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Wednesday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Thursday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Friday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Saturday", open: "09:00", close: "21:00", isClosed: 0 },
      { day: "Sunday", open: "09:00", close: "21:00", isClosed: 1 },
    ],
    orderModes: ["pickup", "delivery"],
    services: {
      pickup: { enabled: 1, preparationTimeMinutes: 30, maxOrdersPerSlot: 20 },
      delivery: {
        enabled: 1,
        radiusKm: 5,
        charge: 0,
        freeDeliveryAbove: 0,
        estimatedTimeMinutes: 60,
      },
      expressDelivery: { enabled: 0, charge: 50, timeMinutes: 30 },
    },
    pickupSlots: [],
    isActive: 1,
    isOpenNow: 1,
    isAcceptingOrders: 1,
    autoOpenClose: 0,
    holidayDates: [],
    inventoryType: "store-based",
    priceMultiplier: 1,
    permissions: {
      canManageOrders: 1,
      canManageInventory: 1,
      canViewReports: 1,
      canEditStore: 0,
    },
    priority: 0,
    tags: "",
    zone: "",
    posSystemId: "",
    warehouseId: "",
    banner: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchAllStores());
  }, [dispatch]);

  const openModal = (store = null) => {
    if (store) {
      setEditId(store._id);
      setForm({
        ...store,
        tags: Array.isArray(store.tags) ? store.tags.join(", ") : store.tags,
      });
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
    let val = type === "number" ? parseFloat(value) : value;

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
      tags:
        typeof form.tags === "string"
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : form.tags,
    };

    if (editId) {
      dispatch(updateStore({ id: editId, formData: submissionData }));
    } else {
      dispatch(createStore(submissionData));
    }
    closeModal();
  };

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

          <button
            onClick={() => openModal()}
            className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 px-6 font-bold text-sm"
          >
            <Plus size={18} /> Add Node
          </button>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Node Entity
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Capabilities
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Operational Status
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storeList.map((store) => (
                  <tr
                    key={store._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                          {store.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {store.name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {store.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {store.services?.delivery?.enabled ? (
                          <Badge
                            icon={<Truck size={12} />}
                            label="DLV"
                            color="blue"
                          />
                        ) : null}
                        {store.services?.pickup?.enabled ? (
                          <Badge
                            icon={<Package size={12} />}
                            label="PKP"
                            color="emerald"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusToggle
                        active={store.isActive}
                        onClick={() => dispatch(toggleStore(store._id))}
                      />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CircleBtn
                          icon={<Store size={16} />}
                          onClick={() => navigate(`/admin/store/${store._id}`)}
                        />
                        <CircleBtn
                          icon={<Edit2 size={16} />}
                          onClick={() => openModal(store)}
                        />
                        <CircleBtn
                          icon={<Trash2 size={16} />}
                          color="red"
                          onClick={() => dispatch(deleteStore(store._id))}
                        />
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
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900">
                {editId ? "Configure Node" : "Deploy New Node"}
              </h2>
              <button
                onClick={closeModal}
                className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex bg-slate-50 p-2 gap-1 mx-8 mt-6 rounded-2xl overflow-x-auto no-scrollbar">
              {["basic", "address", "services", "timing", "ops"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {/* 🏷️ BASIC TAB */}
                {activeTab === "basic" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Store Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Main Outlet"
                      />
                      <Input
                        label="Store Code (UID)"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="SH-001"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="Phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                      />
                      <Input
                        label="WhatsApp"
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                      />
                      <Input
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Slug"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                      />
                      <Input
                        label="Zone"
                        name="zone"
                        value={form.zone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* 📍 ADDRESS TAB */}
                {activeTab === "address" && (
                  <div className="space-y-4 animate-in fade-in">
                    <Input
                      label="Address Line 1"
                      name="address.line1"
                      value={form.address.line1}
                      onChange={handleChange}
                    />
                    <Input
                      label="Address Line 2"
                      name="address.line2"
                      value={form.address.line2}
                      onChange={handleChange}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="City"
                        name="address.city"
                        value={form.address.city}
                        onChange={handleChange}
                      />
                      <Input
                        label="State"
                        name="address.state"
                        value={form.address.state}
                        onChange={handleChange}
                      />
                      <Input
                        label="Pincode"
                        name="address.pincode"
                        value={form.address.pincode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-2 gap-4">
                      <Input
                        label="Longitude"
                        type="number"
                        name="location.coordinates.0"
                        value={form.location.coordinates[0]}
                        onChange={handleChange}
                      />
                      <Input
                        label="Latitude"
                        type="number"
                        name="location.coordinates.1"
                        value={form.location.coordinates[1]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* 🚚 SERVICES TAB */}
                {activeTab === "services" && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Delivery Section */}
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <ServiceToggle
                        icon={<Truck />}
                        title="Delivery Service"
                        name="services.delivery.enabled"
                        checked={form.services.delivery.enabled}
                        onChange={handleChange}
                      />
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <Input
                          label="Radius (KM)"
                          type="number"
                          name="services.delivery.radiusKm"
                          value={form.services.delivery.radiusKm}
                          onChange={handleChange}
                        />
                        <Input
                          label="Charge (₹)"
                          type="number"
                          name="services.delivery.charge"
                          value={form.services.delivery.charge}
                          onChange={handleChange}
                        />
                        <Input
                          label="Min Order for Free (₹)"
                          type="number"
                          name="services.delivery.freeDeliveryAbove"
                          value={form.services.delivery.freeDeliveryAbove}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {/* Pickup Section */}
                    <div className="p-6 bg-emerald-50/30 rounded-[2rem] border border-emerald-100/50">
                      <ServiceToggle
                        icon={<Package />}
                        title="Pickup Service"
                        name="services.pickup.enabled"
                        checked={form.services.pickup.enabled}
                        onChange={handleChange}
                        color="emerald"
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input
                          label="Prep Time (Mins)"
                          type="number"
                          name="services.pickup.preparationTimeMinutes"
                          value={form.services.pickup.preparationTimeMinutes}
                          onChange={handleChange}
                        />
                        <Input
                          label="Max Orders / Slot"
                          type="number"
                          name="services.pickup.maxOrdersPerSlot"
                          value={form.services.pickup.maxOrdersPerSlot}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {/* Express Section */}
                    <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
                      <ServiceToggle
                        icon={<Activity />}
                        title="Express Delivery"
                        name="services.expressDelivery.enabled"
                        checked={form.services.expressDelivery.enabled}
                        onChange={handleChange}
                      />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input
                          label="Express Charge"
                          type="number"
                          name="services.expressDelivery.charge"
                          value={form.services.expressDelivery.charge}
                          onChange={handleChange}
                        />
                        <Input
                          label="Time (Mins)"
                          type="number"
                          name="services.expressDelivery.timeMinutes"
                          value={form.services.expressDelivery.timeMinutes}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ⏰ TIMING TAB */}
                {activeTab === "timing" && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center px-4 py-2 bg-slate-100 rounded-xl mb-4">
                      <span className="text-xs font-black uppercase text-slate-500">
                        Day
                      </span>
                      <span className="text-xs font-black uppercase text-slate-500">
                        Status & Hours
                      </span>
                    </div>
                    {form.openingHours.map((slot, index) => (
                      <div
                        key={slot.day}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
                      >
                        <span className="w-20 text-sm font-bold text-slate-700">
                          {slot.day}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...form.openingHours];
                            updated[index].isClosed = updated[index].isClosed
                              ? 0
                              : 1;
                            setForm({ ...form, openingHours: updated });
                          }}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${slot.isClosed ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                        >
                          {slot.isClosed ? "Closed" : "Open"}
                        </button>
                        {!slot.isClosed && (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={slot.open}
                              onChange={(e) => {
                                const updated = [...form.openingHours];
                                updated[index].open = e.target.value;
                                setForm({ ...form, openingHours: updated });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs outline-none"
                            />
                            <span className="text-slate-300">-</span>
                            <input
                              type="time"
                              value={slot.close}
                              onChange={(e) => {
                                const updated = [...form.openingHours];
                                updated[index].close = e.target.value;
                                setForm({ ...form, openingHours: updated });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs outline-none"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ⚙️ OPERATIONS TAB */}
                {activeTab === "ops" && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Select
                          label="Inventory System"
                          name="inventoryType"
                          value={form.inventoryType}
                          onChange={handleChange}
                        >
                          <option value="store-based">
                            Store-Based (Local)
                          </option>
                          <option value="central">Central (Cloud)</option>
                        </Select>
                        <Input
                          label="Price Multiplier"
                          type="number"
                          step="0.1"
                          name="priceMultiplier"
                          value={form.priceMultiplier}
                          onChange={handleChange}
                        />
                        <Input
                          label="Priority Rank"
                          type="number"
                          name="priority"
                          value={form.priority}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                          <Shield size={14} /> Node Permissions
                        </p>
                        <div className="space-y-4">
                          {Object.keys(form.permissions).map((perm) => (
                            <div
                              key={perm}
                              className="flex justify-between items-center group"
                            >
                              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                {perm.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <input
                                type="checkbox"
                                checked={form.permissions[perm] === 1}
                                onChange={(e) =>
                                  handleChange({
                                    target: {
                                      name: `permissions.${perm}`,
                                      value: e.target.checked ? 1 : 0,
                                    },
                                  })
                                }
                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="POS System ID"
                        name="posSystemId"
                        value={form.posSystemId}
                        onChange={handleChange}
                      />
                      <Input
                        label="Warehouse ID"
                        name="warehouseId"
                        value={form.warehouseId}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center p-4 bg-white border border-slate-100 rounded-2xl">
                      <span className="text-sm font-bold text-slate-700">
                        Auto Open/Close Automation
                      </span>
                      <div className="flex justify-end">
                        <StatusToggle
                          active={form.autoOpenClose}
                          onClick={() =>
                            setForm({
                              ...form,
                              autoOpenClose: form.autoOpenClose ? 0 : 1,
                            })
                          }
                        />
                      </div>
                    </div>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs h-24 outline-none"
                      placeholder="Internal logistics notes..."
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
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
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block ml-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
    >
      {children}
    </select>
  </div>
);

const Badge = ({ icon, label, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-bold text-[10px] ${colors[color]}`}
    >
      {icon} {label}
    </div>
  );
};

const ServiceToggle = ({
  icon,
  title,
  name,
  checked,
  onChange,
  color = "blue",
}) => {
  const activeClass = color === "blue" ? "bg-blue-600" : "bg-emerald-600";
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${activeClass} text-white rounded-xl shadow-sm`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-700">{title}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange({ target: { name, value: checked ? 0 : 1 } })}
        className={`w-12 h-6 rounded-full transition-all relative ${checked ? activeClass : "bg-slate-200"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-7" : "left-1"}`}
        />
      </button>
    </div>
  );
};

const StatusToggle = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 group"
  >
    <div
      className={`w-2.5 h-2.5 rounded-full ${active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-slate-300"}`}
    />
    <span className="text-[11px] font-bold text-slate-600 uppercase group-hover:text-blue-600 transition-colors">
      {active ? "Active" : "Inactive"}
    </span>
  </button>
);

const CircleBtn = ({ icon, onClick, color = "blue" }) => {
  const styles = {
    blue: "text-slate-400 hover:bg-blue-50 hover:text-blue-600",
    red: "text-slate-400 hover:bg-red-50 hover:text-red-600",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 rounded-xl transition-all ${styles[color]}`}
    >
      {icon}
    </button>
  );
};
