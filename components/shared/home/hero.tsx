"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  scaleIn,
  viewportOnce,
  staggerChildren,
} from "../../../lib/motion-presets";

export function HomeHero() {
  return (
    <motion.section
      className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src="/images/design-mode/6011551e61f4903e41de9e5421a285122b3e3a07-2638x1519.jpg"
          alt="Oda delivery person"
          width={1270}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center px-5">
        <motion.div
          className="bg-secondarybg/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12 max-w-md text-center shadow-lg"
          variants={scaleIn}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 lg:mb-6 text-balance"
            variants={fadeInUp}
          >
            Velkommen til en enklere hverdag
          </motion.h1>
          <motion.p
            className="text-card-foreground/90 text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed"
            variants={fadeInUp}
          >
            {
              "F\u00e5 3 m\u00e5neder gratis levering. Og alt du trenger, b\u00e5ret opp alle trapper, helt frem til d\u00f8ra di."
            }
          </motion.p>
          <motion.div
            className="space-y-3"
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <Button className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold py-4 lg:py-6 text-base lg:text-lg rounded-lg">
                Bli kunde!
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button className="w-full border border-white text-purple-400 hover:bg-purple-500/10 hover:text-purple-400 py-4 lg:py-6 text-base lg:text-lg rounded-lg bg-transparent">
                Sjekk om vi leverer til deg
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
