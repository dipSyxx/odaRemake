"use client";

import { motion } from "framer-motion";
import { Headphones, Home, Recycle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  scaleIn,
  staggerChildren,
  viewportOnce,
} from "../../../lib/motion-presets";

const BENEFITS = [
  {
    title: "Pant fra d\u00f8rterskelen",
    description:
      "Vi har egne panteposer du fyller og gir til sj\u00e5f\u00f8ren. Panten telles opp hos Infinitum og bel\u00f8pet trekkes fra neste gang du handler.",
    Icon: Recycle,
  },
  {
    title: "Levert n\u00e5r det passer deg",
    description:
      "Dersom du bor i en egnet bolig kan vi sette fra oss varene, uten \u00e5 ringe p\u00e5. Du f\u00e5r beskjed p\u00e5 SMS om at varene er levert.",
    Icon: Home,
  },
  {
    title: "Gode tilbud",
    description:
      "Hver uke finner du nye tilbud p\u00e5 ting vi tror du har glede av i forhold til sesong, matpakker, hverdag eller helg.",
    Icon: Tag,
  },
  {
    title: "Norges mest forn\u00f8yde dagligvarekunder",
    description:
      "Fem \u00e5r p\u00e5 rad. Kontakt oss p\u00e5 chat, e-post og telefon. Vi hjelper deg med alt du lurer p\u00e5!",
    Icon: Headphones,
  },
] as const;

export function HomeBenefits() {
  return (
    <motion.section
      className="bg-secondarybg py-12 lg:py-16"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-12 lg:mb-16"
          variants={fadeInUp}
        >
          Andre fordeler
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 lg:gap-y-12 max-w-5xl mx-auto mb-12 lg:mb-16"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {BENEFITS.map(({ title, description, Icon }) => (
            <motion.div
              key={title}
              className="flex gap-4 lg:gap-6"
              variants={fadeInUp}
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0">
                <motion.div
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary flex items-center justify-center"
                  variants={scaleIn}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
                </motion.div>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">
                  {title}
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="flex justify-center" variants={fadeInUp}>
          <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg rounded-lg">
            {"Kontakt oss her!"}
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
