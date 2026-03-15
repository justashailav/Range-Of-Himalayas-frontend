import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function StarRatingComponent({ rating, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
      <div className="flex items-center -ml-2"> {/* Negative margin compensates for padding */}
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={onChange ? { scale: 1.1, y: -2 } : {}}
            whileTap={onChange ? { scale: 0.9 } : {}}
            onClick={onChange ? () => onChange(star) : undefined}
            type="button"
            /* RESPONSIVE TOUCH TARGET: 
               p-3 for mobile (easier to tap), md:p-2 for desktop (compact)
            */
            className={`relative p-3 md:p-2 transition-all duration-300 outline-none ${
              onChange ? "cursor-pointer" : "cursor-default"
            }`}
          >
            {/* Subtle Glow */}
            {star <= rating && (
              <motion.div
                layoutId="star-glow"
                className="absolute inset-0 bg-[#B23A2E]/5 blur-xl rounded-full"
              />
            )}

            <StarIcon
              strokeWidth={1.5}
              /* RESPONSIVE SIZE: 
                 w-6 for mobile visibility, w-5 for desktop sleekness
              */
              className={`w-6 h-6 md:w-5 md:h-5 transition-all duration-500 ${
                star <= rating 
                  ? "text-[#B23A2E] fill-[#B23A2E] drop-shadow-[0_2px_4px_rgba(178,58,46,0.2)]" 
                  : "text-stone-300 fill-transparent"
              }`}
            />
            
            {/* Animated underline indicator */}
            {onChange && star === rating && (
              <motion.div 
                layoutId="active-star-indicator"
                className="absolute bottom-1 md:bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#B23A2E] rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {/* RESPONSIVE TEXT: 
          Centered on mobile, left-aligned on desktop
      */}
      {rating > 0 && (
        <span className="text-[9px] md:text-[10px] font-serif italic text-stone-400 animate-in fade-in slide-in-from-top-1 md:slide-in-from-left-2 tracking-widest sm:ml-0 self-center sm:self-auto">
          {rating}.0 <span className="uppercase font-black text-[8px] tracking-[0.2em] not-italic ml-1">Archive Rating</span>
        </span>
      )}
    </div>
  );
}