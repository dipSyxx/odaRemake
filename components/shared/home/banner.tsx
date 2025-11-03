"use client";

import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { fadeInUp, viewportOnce } from "../../../lib/motion-presets";

export function HomeBanner() {
  return (
    <motion.div
      className="bg-[var(--banner-bg)] py-4"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5">
        <div className="flex items-start gap-4">
          <motion.span
            className="inline-flex h-8 w-8 lg:h-12 lg:w-12 items-center justify-center text-[var(--banner-text)] flex-shrink-0 mt-1 text-2xl"
            variants={fadeInUp}
          >
            <Gift className="h-full w-full" />
          </motion.span>
          <motion.div
            className="text-[var(--banner-text)]"
            variants={fadeInUp}
            transition={{ delay: 0.05 }}
          >
            <h2 className="font-bold text-base lg:text-lg">
              {"Nye kunder f\u00e5r gratis levering i 3 m\u00e5neder!"}
            </h2>
            <p className="text-sm opacity-90">
              {
                "S\u00e5 lenge du handler annenhver uke eller oftere. Tilbudet gjelder ikke for levering samme dag."
              }
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
