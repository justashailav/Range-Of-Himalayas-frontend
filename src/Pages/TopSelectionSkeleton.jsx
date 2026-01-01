export default function TopSelectionSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-56 bg-green-100" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-green-200 rounded w-3/4" />
        <div className="h-4 bg-green-200 rounded w-1/2" />

        <div className="flex gap-3 pt-2">
          <div className="h-10 bg-green-300 rounded-lg w-full" />
          <div className="h-10 bg-green-100 rounded-lg w-12" />
        </div>
      </div>
    </div>
  );
}
