import { motion } from "framer-motion";

export default function HimalayanLoader({
  text = "Harvesting from the Himalayas…",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      {/* Sun */}
      <motion.div
        className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 mb-2"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mountains */}
      <div className="relative w-32 h-16">
        <motion.div
          className="absolute bottom-0 left-0 w-16 h-16 bg-green-700"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-20 h-20 bg-green-800"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />
      </div>

      {/* Mist */}
      <motion.div
        className="mt-2 w-24 h-2 bg-green-100 rounded-full"
        animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [1, 1.2, 1] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />

      {/* Text */}
      <motion.p
        className="mt-6 text-green-800 font-medium tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
