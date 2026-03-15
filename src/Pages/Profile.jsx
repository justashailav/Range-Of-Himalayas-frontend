import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import { updateProfile } from "@/store/slices/authSlice";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";

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
      : "",
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

      <div className="min-h-screen bg-[#fdfcf7] flex items-center justify-center p-4 md:p-8 lg:p-12">
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    className="relative bg-white border border-stone-200 shadow-sm max-w-2xl w-full p-6 sm:p-12 rounded-none"
  >
    {/* --- ARCHIVE LABEL --- */}
    {/* Position adjusted: hidden on tiny screens or centered to avoid layout breaks */}
    <div className="absolute top-0 left-6 md:left-12 -translate-y-1/2 bg-[#fdfcf7] px-4">
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#B23A2E] whitespace-nowrap">
        Member Record
      </span>
    </div>

    {/* --- EDIT BUTTON --- */}
    {/* Switched to top-right with better padding for mobile touch targets */}
    <motion.button
      onClick={() => setOpen(true)}
      className="absolute top-6 right-6 md:top-8 md:right-8 group flex items-center gap-2 z-20"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-[#B23A2E] transition-colors">
        Edit Profile
      </span>
      <div className="p-2 bg-stone-50 md:bg-transparent rounded-full">
        <Settings
          className="w-4 h-4 text-stone-400 group-hover:text-[#B23A2E] transition-colors"
          strokeWidth={1.5}
        />
      </div>
    </motion.button>

    {/* --- HEADER TITLE --- */}
    <motion.h2
      variants={fadeUp}
      custom={0.06}
      className="text-xl md:text-2xl font-serif italic text-stone-900 mb-8 md:mb-12 mt-4 md:mt-0"
    >
      My Archive
    </motion.h2>

    {/* --- PROFILE HEADER --- */}
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 md:gap-8 mb-10 md:mb-16 pb-10 md:pb-12 border-b border-stone-100 text-center sm:text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div className="absolute -inset-2 border border-stone-100 rounded-full" />
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-stone-50 overflow-hidden ring-1 ring-stone-200">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-stone-300 bg-[#2d3a2d] font-serif italic text-2xl md:text-3xl">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div className="absolute bottom-1 right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#B23A2E] border-2 md:border-4 border-white rounded-full" />
      </motion.div>

      <div className="space-y-1">
        <p className="text-lg md:text-xl font-black uppercase tracking-widest text-stone-800 break-words max-w-[250px] md:max-w-none">
          {user.name}
        </p>
        <p className="text-xs font-serif italic text-stone-400 truncate max-w-[250px] md:max-w-none">
          {user.email}
        </p>
      </div>
    </div>

    {/* --- PROFILE INFO GRID --- */}
    <motion.div
      variants={fadeUp}
      custom={0.15}
      className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 md:gap-y-10 gap-x-12"
    >
      <ProfileItem
        label="Primary Contact"
        value={user.profile?.phone || "Not provided"}
      />
      <ProfileItem
        label="Identity"
        value={user.profile?.gender || "Not specified"}
      />
      <div className="sm:col-span-2">
        <ProfileItem
          label="Date of Enrollment"
          value={
            user.profile?.dateOfBirth
              ? new Date(user.profile.dateOfBirth).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "Not specified"
          }
        />
      </div>
    </motion.div>

    {/* --- FOOTER DECORATION --- */}
    <div className="mt-16 md:mt-20 pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <span className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-300">
        Purely Himalayan Archive
      </span>
      <span className="text-[8px] font-serif italic text-stone-300">
        Verified Member
      </span>
    </div>
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
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2d3a2d]/60 backdrop-blur-[4px] z-50"
            />
          </Dialog.Overlay>

          {/* MODAL CONTENT */}
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, y: "100%", scale: 1 }} // Slide up from bottom on mobile
              animate={{ opacity: 1, y: "-50%", scale: 1 }} // Center on desktop
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              /* RESPONSIVE LOGIC: 
                 - Mobile: bottom-0, translate-y-0, rounded-t-3xl, w-full
                 - Desktop: top-1/2, -translate-y-1/2, w-[95%] max-w-lg
              */
              className="fixed bottom-0 md:top-1/2 left-1/2 w-full md:max-w-lg md:w-[95%] -translate-x-1/2 md:-translate-y-1/2 rounded-t-[2.5rem] md:rounded-none bg-[#fdfcf7] p-6 sm:p-12 shadow-2xl z-[60] max-h-[92vh] overflow-y-auto border-t md:border border-stone-200"
            >
              {/* Mobile Drag Indicator */}
              <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6 md:hidden" />

              <Dialog.Title className="text-xl md:text-2xl font-serif italic text-stone-900 mb-6 md:mb-8 pb-4 border-b border-stone-100 flex justify-between items-center">
                Update Record
                <Dialog.Close className="md:hidden text-stone-400">
                  <X size={20} />
                </Dialog.Close>
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Custom File Upload */}
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                    Archive Imagery
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="py-6 px-4 border border-dashed border-stone-300 bg-white text-center transition-colors group-hover:border-[#B23A2E]">
                      <span className="text-[11px] font-medium text-stone-500 italic">
                        Tap to select new photograph...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 gap-5 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      Legal Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="w-full bg-white border border-stone-200 p-4 md:p-3 text-sm outline-none focus:border-[#B23A2E] transition-colors rounded-xl md:rounded-none appearance-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                        Phone
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        className="w-full bg-white border border-stone-200 p-4 md:p-3 text-sm outline-none focus:border-[#B23A2E] transition-colors rounded-xl md:rounded-none"
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                        Identity
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-white border border-stone-200 p-4 md:p-3 text-sm outline-none focus:border-[#B23A2E] transition-colors rounded-xl md:rounded-none appearance-none"
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                      Date of Birth
                    </label>
                    <input
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      type="date"
                      className="w-full bg-white border border-stone-200 p-4 md:p-3 text-sm outline-none focus:border-[#B23A2E] transition-colors rounded-xl md:rounded-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 md:pt-8 border-t border-stone-100">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-8 py-4 md:py-3 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      Dismiss
                    </button>
                  </Dialog.Close>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-4 md:py-3 bg-[#2d3a2d] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#B23A2E] transition-colors duration-500 shadow-md"
                  >
                    Commit Changes
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
    <div className="group flex flex-col space-y-1.5 transition-all duration-300">
      {/* The Label: Small, bold, and spaced out like a field note */}
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 group-hover:text-[#B23A2E] transition-colors duration-500">
        {label}
      </span>

      {/* The Value: Clean and easy to read */}
      <span className="text-sm font-medium text-stone-800 tracking-tight">
        {value}
      </span>

      {/* Decorative hairline underline that expands on hover */}
      <div className="relative h-[1px] w-full bg-stone-100 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-stone-200"
          initial={{ x: "-100%" }}
          whileInHover={{ x: 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}
