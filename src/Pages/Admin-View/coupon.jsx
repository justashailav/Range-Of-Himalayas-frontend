import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, deleteCoupon, editCoupon } from "@/store/slices/couponSlice";
import CouponTile from "@/components/Admin-View/coupon-tile";

export default function Admincoupon() {
  const [openCouponDialog, setOpenCouponDialog] = useState(false);
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.coupon);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const [coupon, setCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "",
    minOrderAmount: "",
    expiresAt: "",
    maxUniqueUsers: "", // ✅ New field
    isActive: true,
  });

  useEffect(() => {
    if (!openCouponDialog) {
      setIsEditMode(false);
      setEditingCouponId(null);
    } else if (!isEditMode) {
      setCoupon({
        code: "",
        discountType: "percentage",
        discountValue: "",
        usageLimit: "",
        minOrderAmount: "",
        expiresAt: "",
        maxUniqueUsers: "", // ✅ reset new field
        isActive: true,
      });
    }
  }, [openCouponDialog, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteCoupon = (id) => {
    dispatch(deleteCoupon(id));
  };

  const handleEditCoupon = (couponToEdit) => {
    setCoupon({
      code: couponToEdit.code,
      discountType: couponToEdit.discountType,
      discountValue: couponToEdit.discountValue,
      usageLimit: couponToEdit.usageLimit,
      minOrderAmount: couponToEdit.minOrderAmount,
      expiresAt: couponToEdit.expiresAt?.slice(0, 10) || "",
      maxUniqueUsers: couponToEdit.maxUniqueUsers || "", // ✅ populate
      isActive: Boolean(couponToEdit.isActive),
    });
    setEditingCouponId(couponToEdit._id);
    setIsEditMode(true);
    setOpenCouponDialog(true);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("code", coupon.code.trim().toUpperCase());
    formData.append("discountType", coupon.discountType);
    formData.append("discountValue", coupon.discountValue);
    formData.append("usageLimit", coupon.usageLimit);
    formData.append("minOrderAmount", coupon.minOrderAmount);
    formData.append("expiresAt", coupon.expiresAt);
    formData.append("maxUniqueUsers", coupon.maxUniqueUsers || 0); // ✅ append
    formData.append("isActive", coupon.isActive ? "true" : "false");

    if (isEditMode) {
      dispatch(editCoupon({ id: editingCouponId, formData }));
    } else {
      dispatch(createCoupon(formData));
    }
    setOpenCouponDialog(false);
  };

  return (
    <div>
      {/* Add Button */}
      <div className="mb-6 w-full flex justify-start">
        <Button
          onClick={() => setOpenCouponDialog(true)}
          className="bg-[#F08C7D] hover:bg-[#d9746a] text-white py-2 px-5 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Coupon
        </Button>
      </div>

      {/* Coupon Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {coupons.map((c) => (
          <CouponTile
            key={c._id}
            coupon={c}
            handleDelete={handleDeleteCoupon}
            handleEdit={handleEditCoupon}
          />
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={openCouponDialog} onOpenChange={setOpenCouponDialog}>
        <DialogContent className="bg-[#FFECE8] max-w-3xl mx-auto rounded-lg p-6 shadow-lg max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800 mb-4">
              {isEditMode ? "Edit Coupon" : "Create New Coupon"}
            </DialogTitle>
            <DialogDescription>
              <form
                onSubmit={handleCouponSubmit}
                className="space-y-6 overflow-y-auto max-h-[65vh] pr-3"
                autoComplete="off"
              >
                {/* Coupon Code */}
                <div>
                  <label htmlFor="code" className="block font-medium mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={coupon.code}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label htmlFor="discountType" className="block font-medium mb-1">
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={coupon.discountType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label htmlFor="discountValue" className="block font-medium mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={coupon.discountValue}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <label htmlFor="usageLimit" className="block font-medium mb-1">
                    Usage Limit (Per User)
                  </label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={coupon.usageLimit}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* ✅ Max Unique Users */}
                <div>
                  <label htmlFor="maxUniqueUsers" className="block font-medium mb-1">
                    Maximum Unique Users (0 = Unlimited)
                  </label>
                  <input
                    type="number"
                    id="maxUniqueUsers"
                    name="maxUniqueUsers"
                    value={coupon.maxUniqueUsers}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 100 for first 100 users"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* Minimum Order Amount */}
                <div>
                  <label htmlFor="minOrderAmount" className="block font-medium mb-1">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    value={coupon.minOrderAmount}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* Expiration */}
                <div>
                  <label htmlFor="expiresAt" className="block font-medium mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expiresAt"
                    name="expiresAt"
                    value={coupon.expiresAt}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#F08C7D]"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={coupon.isActive}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#F08C7D] focus:ring-[#F08C7D]"
                  />
                  <label htmlFor="isActive" className="font-medium">
                    Active
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4 gap-4">
                  <Button
                    type="button"
                    onClick={() => setOpenCouponDialog(false)}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#F08C7D] hover:bg-[#d9746a] text-white px-5 py-2 rounded-md"
                  >
                    {isEditMode ? "Update Coupon" : "Save Coupon"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
