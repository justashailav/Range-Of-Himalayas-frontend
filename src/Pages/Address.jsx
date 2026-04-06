import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/slices/addressSlice";
import AddressCard from "./Address-Card";
import { toast } from "react-toastify";
import { MapPin, Navigation, Plus, Save, Trash2, X, Phone, Home, Hash } from "lucide-react";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
  latitude: "",
  longitude: "",
};

export default function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);

  function handleGetLocation() {
    if (!navigator.geolocation) {
      toast.error("GPS not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({ ...prev, latitude, longitude }));
        toast.success("Coordinates pinpointed");
      },
      () => toast.error("Unable to access location")
    );
  }

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      toast.error("Address limit reached (3 max)");
      return;
    }

    if (!isFormValid()) {
      toast.error("Please complete the required fields.");
      return;
    }

    const action = currentEditedId 
      ? editAddress({ userId: user?._id, addressId: currentEditedId, formData }) 
      : addAddress({ ...formData, userId: user?._id });

    dispatch(action).then((data) => {
      if (data?.success) {
        dispatch(fetchAllAddress(user?._id));
        resetForm();
        toast.success(currentEditedId ? "Destination Updated" : "Destination Saved");
      }
    });
  }

  const resetForm = () => {
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
  };

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
      latitude: getCurrentAddress?.location?.coordinates?.[1] || "",
      longitude: getCurrentAddress?.location?.coordinates?.[0] || "",
    });
    // Scroll to form smoothly
    window.scrollTo({ top: document.getElementById('address-form').offsetTop - 100, behavior: 'smooth' });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(deleteAddress({ userId: user?._id, addressId: getCurrentAddress._id }))
      .then((data) => data?.success && dispatch(fetchAllAddress(user?._id)));
  }

  function isFormValid() {
    return ["address", "city", "phone", "pincode"].every(field => formData[field].trim() !== "");
  }

  useEffect(() => {
    if (user?._id) dispatch(fetchAllAddress(user._id));
  }, [dispatch, user?._id]);

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      
      {/* --- SAVED DESTINATIONS --- */}
      <div>
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Saved Locations</h2>
            <p className="text-2xl font-bold text-slate-900">Your Destinations</p>
          </div>
          <div className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">
            {addressList?.length}/3 Slots
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addressList && addressList.length > 0 ? (
            addressList.map((item) => (
              <AddressCard
                key={item._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={item}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">No destinations found in your archive.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- ADDRESS FORM --- */}
      <div id="address-form" className="relative bg-white rounded-[3rem] border border-slate-100 p-10 shadow-[0_30px_100px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Navigation size={200} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
              {currentEditedId ? <Save size={20} /> : <Plus size={20} />}
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {currentEditedId ? "Modify Destination" : "Add New Destination"}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">Specify the coordinates for your Himalayan delivery.</p>
          </div>

          <form onSubmit={handleManageAddress} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <CustomInput 
                icon={<Home size={16}/>} 
                label="Street Address" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                placeholder="House no, Building, Street"
              />

              <CustomInput 
                icon={<MapPin size={16}/>} 
                label="City / Region" 
                value={formData.city} 
                onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                placeholder="Shimla, Manali..."
              />

              <CustomInput 
                icon={<Hash size={16}/>} 
                label="Pincode" 
                value={formData.pincode} 
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} 
                placeholder="171001"
              />

              <CustomInput 
                icon={<Phone size={16}/>} 
                label="Contact Number" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+91 00000 00000"
              />

              <div className="md:col-span-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Delivery Notes</label>
                <textarea
                  placeholder="Gate code, Landmark, or special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent group-hover:border-slate-200 focus:border-slate-900 focus:bg-white rounded-[1.5rem] p-5 text-sm min-h-[120px] outline-none transition-all resize-none"
                />
              </div>

              {/* LOCATION CAPTURE */}
              <div className="md:col-span-2 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Navigation size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Pinpoint Accuracy</p>
                    <p className="text-[11px] text-slate-500">Enable GPS for faster delivery in remote areas.</p>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={handleGetLocation}
                  className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    formData.latitude 
                    ? "bg-green-500 text-white shadow-lg shadow-green-100" 
                    : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100"
                  }`}
                >
                  {formData.latitude ? "Location Captured ✓" : "Get Current Location"}
                </button>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4">
                {currentEditedId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
                  >
                    <X size={18} /> Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200"
                >
                  {currentEditedId ? "Update Records" : "Confirm Destination"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const CustomInput = ({ icon, label, ...props }) => (
  <div className="group">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block group-focus-within:text-slate-900 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-slate-50 border border-transparent group-hover:border-slate-200 focus:border-slate-900 focus:bg-white rounded-2xl py-4 pl-12 pr-5 text-sm outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  </div>
);