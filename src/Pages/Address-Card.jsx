// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";

// export default function AddressCard({
//   addressInfo,
//   handleDeleteAddress,
//   handleEditAddress,
//   setCurrentSelectedAddress,
//   selectedId,
// }) {
//   return (
//     <Card
//       onClick={
//         setCurrentSelectedAddress
//           ? () => setCurrentSelectedAddress(addressInfo)
//           : null
//       }
//       className={`cursor-pointer border-red-700 ${
//         selectedId?._id === addressInfo?._id
//           ? "border-red-900 border-[4px]"
//           : "border-black"
//       }`}
//     >
//       <CardContent className="grid p-4 gap-4">
//         <Label>Address: {addressInfo?.address}</Label>
//         <Label>City: {addressInfo?.city}</Label>
//         <Label>pincode: {addressInfo?.pincode}</Label>
//         <Label>Phone: {addressInfo?.phone}</Label>
//         <Label>Notes: {addressInfo?.notes}</Label>
//       </CardContent>
//       <CardFooter className="p-3 flex justify-between">
//         <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
//         <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
//       </CardFooter>
//     </Card>
//   );
// }

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}
  className={`group relative cursor-pointer transition-all duration-500 rounded-[2rem] border-2 p-6 overflow-hidden
    ${isSelected
      ? "border-stone-900 bg-stone-900 text-white shadow-2xl shadow-stone-200 scale-[1.02]"
      : "border-stone-100 bg-white hover:border-stone-200 hover:shadow-xl hover:shadow-stone-100"
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

  <div className="space-y-4">
    {/* PRIMARY ADDRESS */}
    <div className="space-y-1">
      <span className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-50 
        ${isSelected ? "text-white" : "text-stone-400"}`}>
        Destination
      </span>
      <p className="text-sm font-black leading-tight uppercase tracking-tight">
        {addressInfo?.address}
      </p>
    </div>

    {/* CITY & PIN */}
    <div className="flex gap-6">
      <div className="space-y-1">
        <span className={`text-[8px] font-black uppercase tracking-[0.2em] opacity-50 
          ${isSelected ? "text-white" : "text-stone-400"}`}>
          Locality
        </span>
        <p className="text-xs font-bold uppercase">{addressInfo?.city}, {addressInfo?.pincode}</p>
      </div>
    </div>

    {/* PHONE & NOTES */}
    <div className="pt-2 flex flex-col gap-2 border-t border-stone-100/10">
      <div className="flex items-center gap-2">
        <Phone size={10} className={isSelected ? "text-white/50" : "text-stone-300"} />
        <p className="text-[11px] font-bold tracking-tighter">{addressInfo?.phone}</p>
      </div>
      {addressInfo?.notes && (
        <p className={`text-[10px] italic line-clamp-1 opacity-70
          ${isSelected ? "text-white" : "text-stone-500"}`}>
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
