import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import { updateProfile } from "@/store/slices/authSlice";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.profile?.phone || "");
  const [gender, setGender] = useState(user?.profile?.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.profile?.dateOfBirth
      ? new Date(user.profile.dateOfBirth).toISOString().slice(0, 10)
      : ""
  );
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profile?.profilePhoto || "");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("phone", phone);
    data.append("gender", gender);
    data.append("dateOfBirth", dateOfBirth);
    if (profilePhoto) data.append("profilePhoto", profilePhoto);

    dispatch(updateProfile(data));
    setOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500 text-lg">
        No user data available.
      </div>
    );
  }

  // Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut", delay },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <>
      <Helmet>
        <title>Profile - Range Of Himalayas</title>
      </Helmet>

      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative bg-white rounded-3xl shadow-lg max-w-xl w-full p-8"
        >
          {/* EDIT BUTTON */}
          <motion.button
            onClick={() => setOpen(true)}
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition text-xl"
            title="Edit Profile"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✏️
          </motion.button>

          <motion.h2
            variants={fadeUp}
            custom={0.06}
            className="text-3xl font-semibold text-gray-900 mb-8 border-b pb-4"
          >
            My Profile
          </motion.h2>

          {/* Profile Header */}
          <motion.div
            variants={fadeUp}
            custom={0.1}
            className="flex items-center space-x-6 mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-inner"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </motion.div>

            <div>
              <p className="text-xl font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            variants={fadeUp}
            custom={0.15}
            className="space-y-6 text-gray-800"
          >
            <ProfileItem label="Phone" value={user.profile?.phone || "Not provided"} />
            <ProfileItem label="Gender" value={user.profile?.gender || "Not specified"} />
            <ProfileItem
              label="Date of Birth"
              value={
                user.profile?.dateOfBirth
                  ? new Date(user.profile.dateOfBirth).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not specified"
              }
            />
          </motion.div>
        </motion.div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal forceMount>
          <AnimatePresence>
            {open && (
              <>
                {/* Background Overlay */}
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                  />
                </Dialog.Overlay>

                {/* MODAL */}
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-hidden"
                  >
                    <Dialog.Title className="text-xl font-semibold mb-6">
                      Edit Profile
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">
                          Profile Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-700
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700"
                        />
                      </div>

                      <label className="block text-gray-700 font-medium">
                        Name
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </label>

                      <label className="block text-gray-700 font-medium">
                        Phone
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="tel"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </label>

                      <label className="block text-gray-700 font-medium">
                        Gender
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      <label className="block text-gray-700 font-medium">
                        Date of Birth
                        <input
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          type="date"
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </label>

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Dialog.Close asChild>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                          >
                            Cancel
                          </motion.button>
                        </Dialog.Close>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Save
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-200 pb-3">
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
}
