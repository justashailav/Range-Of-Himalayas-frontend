export default function TrendingProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      
      {/* Image */}
      <div className="h-48 bg-[#F1EBDD] rounded-lg mb-4" />

      {/* Title */}
      <div className="h-4 bg-[#E6DFCF] rounded w-4/5 mb-2" />
      <div className="h-4 bg-[#E6DFCF] rounded w-1/3 mb-4" />

      {/* Button */}
      <div className="h-10 bg-[#D9D2C2] rounded-lg w-full" />
    </div>
  );
}
