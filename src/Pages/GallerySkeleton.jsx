export default function GallerySkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      
      {/* Main image placeholder */}
      <div className="h-[380px] bg-[#F6F1E7] rounded-xl shadow-md mb-6" />

      {/* Thumbnails */}
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-24 h-16 bg-[#E8E1D3] rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
