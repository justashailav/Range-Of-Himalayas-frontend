import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function StarRatingComponent({ rating, onChange }) {
  return (
    /* Mobile: Stacked and centered for thumb-reach
       Desktop: Row-aligned with consistent spacing
    */
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-4 w-full sm:w-auto">
      
      {/* STAR GROUP */}
      <div className="flex items-center justify-center -ml-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={onChange ? { scale: 1.1 } : {}}
            whileTap={onChange ? { scale: 0.9 } : {}}
            onClick={onChange ? () => onChange(star) : undefined}
            type="button"
            /* TOUCH TARGETS: 
               p-3 on mobile creates a 44px+ hit area (UX standard)
               p-1.5 on desktop keeps it boutique and tight
            */
            className={`relative p-3 sm:p-1.5 transition-all duration-300 outline-none ${
              onChange ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {/* Background Glow - LayoutId makes it slide between stars */}
            {star <= rating && (
              <motion.div
                layoutId="star-glow"
                className="absolute inset-0 bg-[#B23A2E]/5 blur-xl rounded-full"
              />
            )}

            <StarIcon
              strokeWidth={1.2}
              /* ICON SIZING: Slightly larger on mobile for better visibility */
              className={`w-6 h-6 sm:w-5 sm:h-5 transition-all duration-500 ${
                star <= rating 
                  ? "text-[#B23A2E] fill-[#B23A2E] drop-shadow-[0_2px_4px_rgba(178,58,46,0.15)]" 
                  : "text-stone-200 fill-transparent hover:text-stone-400"
              }`}
            />
            
            {/* The active selection dot */}
            {onChange && star === rating && (
              <motion.div 
                layoutId="active-star-indicator"
                className="absolute bottom-1 sm:bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* RATING TEXT */}
      {rating > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-row items-center gap-2 sm:border-l sm:border-stone-100 sm:pl-4 mt-1 sm:mt-0"
        >
          <span className="text-[11px] sm:text-[10px] font-serif italic text-stone-400 tracking-tighter">
            {rating}.0
          </span>
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-stone-300 whitespace-nowrap">
            Archive Rating
          </span>
        </motion.div>
      )}
    </div>
  );
}