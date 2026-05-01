import { Check, Phone } from "lucide-react";

export default function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <div
      onClick={
    setCurrentSelectedAddress
      ? () => setCurrentSelectedAddress(addressInfo)
      : null
  }
  className={`group relative cursor-pointer transition-all duration-300 
  rounded-[1.5rem] border p-5 overflow-hidden

  h-auto min-h-[140px]   // ✅ FIX HEIGHT ISSUE
  flex flex-col justify-between  // ✅ PREVENT STRETCH

  ${
    isSelected
      ? "border-stone-900 bg-stone-900 text-white shadow-xl scale-[1.02]"
      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
  }`}
    >
      {/* SELECTED BADGE */}
      {isSelected && (
        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* PRIMARY ADDRESS */}
        <div className="space-y-1">
          <span
            className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-50 
        ${isSelected ? "text-white" : "text-stone-400"}`}
          >
            Destination
          </span>
          <p className="text-sm font-black leading-tight uppercase tracking-tight">
            {addressInfo?.address}
          </p>
        </div>

        {/* CITY & PIN */}
        <div className="flex gap-6">
          <div className="space-y-1">
            <span
              className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-50 
          ${isSelected ? "text-white" : "text-stone-400"}`}
            >
              Locality
            </span>
            <p className="text-xs font-bold uppercase">
              {addressInfo?.city}, {addressInfo?.pincode}
            </p>
          </div>
        </div>

        {/* PHONE & NOTES */}
        <div className="pt-2 flex flex-col gap-2 border-t border-stone-100/10">
          <div className="flex items-center gap-2">
            <Phone
              size={10}
              className={isSelected ? "text-white/50" : "text-stone-300"}
            />
            <p className="text-[11px] font-bold tracking-tighter">
              {addressInfo?.phone}
            </p>
          </div>
          {addressInfo?.notes && (
            <p
              className={`text-[10px] italic line-clamp-1 opacity-70
          ${isSelected ? "text-white" : "text-stone-500"}`}
            >
              "{addressInfo?.notes}"
            </p>
          )}
        </div>
      </div>

      {/* ACTIONS - Revealed on hover or always visible if selected */}
      <div className="mt-6 flex justify-start gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className={`text-[9px] font-black uppercase tracking-widest transition-colors
        ${isSelected ? "text-white/60 hover:text-white" : "text-stone-400 hover:text-stone-900"}`}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className={`text-[9px] font-black uppercase tracking-widest transition-colors
        ${isSelected ? "text-red-400 hover:text-red-300" : "text-stone-300 hover:text-red-600"}`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
