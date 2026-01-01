export default function TopSelectionSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-56 bg-[#F1EBDD]" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#E6DFCF] rounded w-3/4" />
        <div className="h-4 bg-[#E6DFCF] rounded w-1/2" />

        <div className="flex gap-3 pt-2">
          <div className="h-10 bg-[#D9D2C2] rounded-lg w-full" />
          <div className="h-10 bg-[#E6DFCF] rounded-lg w-12" />
        </div>
      </div>
    </div>
  );
}
