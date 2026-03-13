import { motion } from "framer-motion";

export default function HimalayanLoader({
  text = "Collecting the Harvest",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-[#fdfcf7]">
      <div className="relative flex items-center justify-center">
        {/* The Core Dot - Matches your "Harvest Red" */}
        <motion.div
          className="w-3 h-3 bg-[#B23A2E] rounded-full z-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ambient Pulsing Rings - "The Ripple Effect" */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-[#B23A2E]/30 rounded-full"
            initial={{ width: 20, height: 20, opacity: 0.8 }}
            animate={{
              width: [20, 80],
              height: [20, 80],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Editorial Text */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <motion.p
          className="text-[11px] font-black uppercase tracking-[0.5em] text-[#2d3a2d]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
        
        {/* Sub-label for that Journal feel */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="text-[9px] font-serif italic text-stone-500 tracking-widest"
        >
          Purely Himalayan Archive
        </motion.span>
      </div>
    </div>
  );
}