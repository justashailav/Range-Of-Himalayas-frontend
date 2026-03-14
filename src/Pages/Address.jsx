import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/slices/addressSlice";
import AddressCard from "./Address-Card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

export default function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.address);

  // Add or Edit Address
  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast.error("You can add a maximum of 3 addresses.");
      return;
    }

    if (!isFormValid()) {
      toast.error("Please fill all required fields.");
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editAddress({
            userId: user?._id,
            addressId: currentEditedId,
            formData,
          }),
        ).then((data) => {
          if (data?.success) {
            dispatch(fetchAllAddress(user?._id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addAddress({
            ...formData,
            userId: user?._id,
          }),
        ).then((data) => {
          if (data?.success) {
            dispatch(fetchAllAddress(user?._id));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully");
          }
        });
  }

  // Delete Address
  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?._id, addressId: getCurrentAddress._id }),
    ).then((data) => {
      if (data?.success) {
        dispatch(fetchAllAddress(user?._id));
        toast.success("Address deleted successfully");
      }
    });
  }

  // Edit Address
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  // Form validation
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  // Fetch addresses on mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAllAddress(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-stone-50 rounded-[2rem] border border-dashed border-stone-200">
            <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">
              No saved destinations yet.
            </p>
          </div>
        )}
      </div>

      {/* ADD/EDIT FORM SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-stone-100" />
          <h2 className="text-xs font-black text-stone-900 uppercase tracking-[0.4em] whitespace-nowrap">
            {currentEditedId !== null
              ? "Modify Destination"
              : "New Destination"}
          </h2>
          <div className="h-px flex-1 bg-stone-100" />
        </div>

        <form
          onSubmit={handleManageAddress}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          {/* Address - Full Width */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Street Address
            </label>
            <Input
              className="h-12 rounded-xl border-stone-100 bg-stone-50/50 focus:bg-white transition-all placeholder:text-stone-300"
              placeholder="e.g. 123 Mountain View"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              City
            </label>
            <Input
              className="h-12 rounded-xl border-stone-100 bg-stone-50/50 focus:bg-white transition-all placeholder:text-stone-300"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          {/* Pincode */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Pincode
            </label>
            <Input
              className="h-12 rounded-xl border-stone-100 bg-stone-50/50 focus:bg-white transition-all placeholder:text-stone-300"
              placeholder="000 000"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Contact Number
            </label>
            <Input
              className="h-12 rounded-xl border-stone-100 bg-stone-50/50 focus:bg-white transition-all placeholder:text-stone-300"
              placeholder="+91"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Delivery Notes
            </label>
            <textarea
              className="w-full h-32 rounded-2xl border border-stone-100 bg-stone-50/50 p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-100 transition-all resize-none placeholder:text-stone-300"
              placeholder="Any special instructions for the courier..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#B23A2E] transition-all duration-500 shadow-xl shadow-stone-100 active:scale-95"
            >
              {currentEditedId !== null ? "Save Changes" : "Confirm Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
