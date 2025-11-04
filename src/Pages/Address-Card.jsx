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
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all rounded-xl border-2 p-1 ${
        isSelected
          ? "border-red-600 bg-red-50 shadow-lg"
          : "border-gray-200 hover:shadow-md hover:border-gray-400"
      }`}
    >
      <CardContent className="grid gap-3 p-5">
        <div>
          <Label className="text-xs uppercase text-gray-500">Address</Label>
          <p className="text-sm text-gray-900">{addressInfo?.address}</p>
        </div>
        <div>
          <Label className="text-xs uppercase text-gray-500">City</Label>
          <p className="text-sm text-gray-900">{addressInfo?.city}</p>
        </div>
        <div>
          <Label className="text-xs uppercase text-gray-500">Pincode</Label>
          <p className="text-sm text-gray-900">{addressInfo?.pincode}</p>
        </div>
        <div>
          <Label className="text-xs uppercase text-gray-500">Phone</Label>
          <p className="text-sm text-gray-900">{addressInfo?.phone}</p>
        </div>
        <div>
          <Label className="text-xs uppercase text-gray-500">Notes</Label>
          <p className="text-sm text-gray-900">{addressInfo?.notes}</p>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-2 flex justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="hover:border-gray-600"
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
