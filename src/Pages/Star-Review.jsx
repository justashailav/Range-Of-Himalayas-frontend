import { StarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StarRatingComponent({ rating, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 w-full sm:w-auto">
      
      {/* STAR GROUP */}
      <div className="flex items-center justify-center bg-stone-50/50 sm:bg-transparent px-4 py-1 sm:p-0 rounded-full">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={onChange ? { scale: 1.15 } : {}}
            whileTap={onChange ? { scale: 0.9 } : {}}
            onClick={onChange ? () => onChange(star) : undefined}
            type="button"
            className="relative p-2.5 sm:p-1.5 outline-none"
          >
            <StarIcon
              strokeWidth={star <= rating ? 1 : 1.5}
              className={`w-6 h-6 sm:w-5 sm:h-5 transition-all duration-300 ${
                star <= rating 
                  ? "text-[#B23A2E] fill-[#B23A2E]" 
                  : "text-stone-300 fill-transparent hover:text-stone-400"
              }`}
            />
            
            {onChange && star === rating && (
              <motion.div 
                layoutId="active-dot"
                className="absolute bottom-1 sm:bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* RATING TEXT - Optimized for Mobile */}
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          {rating > 0 ? (
            <motion.div 
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 sm:border-l sm:border-stone-200 sm:pl-5"
            >
              <span className="text-xs sm:text-[10px] font-serif italic text-stone-600">
                {rating}.0
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">
                Archive Score
              </span>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              /* MOBILE: Small pill shape / DESKTOP: Minimal side text */
              className="px-3 py-1 sm:p-0 sm:pl-5 sm:border-l sm:border-stone-200 bg-stone-100 sm:bg-transparent rounded-full"
            >
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-stone-400 whitespace-nowrap">
                Select Grade
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}