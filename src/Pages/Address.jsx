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
          })
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
          })
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
      deleteAddress({ userId: user?._id, addressId: getCurrentAddress._id })
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
    <Card className="shadow-lg border border-gray-200 rounded-lg">
      {/* Address List */}
      <div className="mb-6 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <p className="text-center text-gray-500 col-span-full mt-6 italic">
            No addresses added yet.
          </p>
        )}
      </div>

      {/* Add/Edit Form */}
      <CardHeader className="border-t border-gray-200 px-6 py-5 bg-gray-50">
        <CardTitle className="text-lg sm:text-2xl font-semibold tracking-wide text-gray-800">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleManageAddress} className="space-y-4">
          {/* Address */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Address
            </Label>
            <Input
              type="text"
              placeholder="Enter your Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {/* City */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              City
            </Label>
            <Input
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          {/* Pincode */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Pincode
            </Label>
            <Input
              type="text"
              placeholder="Enter your pincode"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              type="text"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Notes
            </Label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mt-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="mt-6 w-full rounded-md py-3 font-semibold shadow-lg"
          >
            {currentEditedId !== null ? "Update Address" : "Add Address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
