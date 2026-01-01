import { motion } from "framer-motion";

export default function HimalayanLoader({
  text = "Fresh harvest loading…",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24">

      {/* Fog lines */}
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-40 h-2 rounded-full bg-green-200"
            initial={{ opacity: 0.3, x: -20 }}
            animate={{ opacity: [0.3, 0.8, 0.3], x: [-20, 20, -20] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Text */}
      <motion.p
        className="mt-8 text-green-800 font-medium tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
