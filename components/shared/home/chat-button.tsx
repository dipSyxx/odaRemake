"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { scaleIn } from "../../../lib/motion-presets";

export function HomeChatButton() {
  return (
    <motion.button
      className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-[#ff9500] hover:bg-[#e68600] text-white rounded-full p-3 lg:p-4 shadow-lg transition-transform z-40"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Åpne chat"
    >
      <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
    </motion.button>
  );
}
