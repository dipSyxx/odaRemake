"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, scaleIn, viewportOnce } from "../../../lib/motion-presets";

export function HomeLowPrices() {
  return (
    <motion.section
      className="bg-background py-12 lg:py-16"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} transition={{ delay: 0.05 }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance">
              {"Lave priser, levert p\u00e5 d\u00f8ra."}
            </h2>
            <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
              {
                "Vi er en matbutikk som ikke betaler for butikklokaler p\u00e5 annethvert gatehj\u00f8rne. Det gj\u00f8r at vi kan konkurrere med de store gigantene p\u00e5 pris, og tilby deg lave priser, levert helt hjem p\u00e5 d\u00f8ra."
              }
            </p>
            <motion.div variants={scaleIn}>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                {"Ta din f\u00f8rste handletur!"}
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
            <img
              src="/images/design-mode/589db22aa86f8d65a8f5a9f534e001f95b5d2d5e-3776x2475.jpg"
              alt="Price tags showing Supertilbud, Knallpris, Kjempebillig"
              className="w-full h-auto rounded-xl"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
