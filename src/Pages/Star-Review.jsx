import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function StarRatingComponent({ rating, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={onChange ? { scale: 1.1, y: -2 } : {}}
          whileTap={onChange ? { scale: 0.9 } : {}}
          onClick={onChange ? () => onChange(star) : undefined}
          type="button" // Prevents accidental form submissions
          className={`relative p-2 transition-all duration-300 ${
            onChange ? "cursor-pointer" : "cursor-default"
          }`}
        >
          {/* Subtle Glow behind active stars */}
          {star <= rating && (
            <motion.div
              layoutId="star-glow"
              className="absolute inset-0 bg-[#B23A2E]/5 blur-xl rounded-full"
            />
          )}

          <StarIcon
            strokeWidth={1.5}
            className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ${
              star <= rating 
                ? "text-[#B23A2E] fill-[#B23A2E] drop-shadow-[0_2px_4px_rgba(178,58,46,0.2)]" 
                : "text-stone-300 fill-transparent hover:text-stone-400"
            }`}
          />
          
          {/* Animated underline for the 'Current' star selection */}
          {onChange && star === rating && (
            <motion.div 
              layoutId="active-star-indicator"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full"
            />
          )}
        </motion.button>
      ))}
      
      {/* Textual Feedback - subtle serif touch */}
      {rating > 0 && (
        <span className="ml-2 text-[10px] font-serif italic text-stone-400 animate-in fade-in slide-in-from-left-2">
          {rating}.0 Rating
        </span>
      )}
    </div>
  );
}