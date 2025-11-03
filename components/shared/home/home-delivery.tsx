"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  scaleIn,
  staggerChildren,
  viewportOnce,
} from "../../../lib/motion-presets";

const STEPS = [
  {
    number: "1",
    text: "Du velger selv n\u00e5r du vil ha varene levert. Tips: Velg leveringstiden f\u00f8rst, s\u00e5 er du sikker p\u00e5 at ingen andre stjeler tiden din.",
  },
  {
    number: "2",
    text: "Du f\u00e5r god informasjon p\u00e5 leveringsdagen og kan f\u00f8lge leveringen i sanntid i appen.",
  },
  {
    number: "3",
    text: "Varene blir b\u00e5ret helt frem til d\u00f8ra. Og har du pant, eller vil returnere tomme esker fra forrige gang, tar vi det med oss.",
  },
] as const;

export function HomeDelivery() {
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
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 lg:mb-12 text-balance leading-tight">
              Enkel og oversiktlig hjemlevering
            </h2>
            <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
              {STEPS.map((step) => (
                <motion.div
                  key={step.number}
                  className="flex gap-3 lg:gap-4"
                  variants={fadeInUp}
                >
                  <span className="text-xl lg:text-2xl font-bold text-foreground flex-shrink-0">
                    {step.number}
                  </span>
                  <p className="text-foreground/80 text-base lg:text-lg leading-relaxed">
                    {step.text}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={scaleIn}>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                {"F\u00e5 3 mnd gratis hjemlevering n\u00e5!"}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={scaleIn} whileHover={{ scale: 1.02 }}>
            <img
              src="/mother-and-child-unpacking-oda-delivery-box-with-f.jpg"
              alt="Mor og barn pakker ut Oda-levering"
              className="w-full h-auto rounded-xl"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
