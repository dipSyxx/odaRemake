"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  scaleIn,
  staggerChildren,
  viewportOnce,
} from "../../../lib/motion-presets";

const FEATURE_CARDS = [
  {
    title: "Lave priser",
    description:
      "Oda er nesten som en stor lavprisbutikk. Bare at du kan bes\u00f8ke oss hjemmefra.",
    image:
      "https://cdn.sanity.io/images/1teetjp9/production/420e3110b1d84d2d4139b2f9b787c58f898c0567-8158x9123.jpg?rect=0%2C0%2C8158%2C6119&w=260&h=195&auto=format",
    alt: "Lave priser",
  },
  {
    title: "Stort utvalg",
    description:
      "Fra lokale produsenter til \u00f8kologiske favoritter. V\u00e5re eksperter velger ut varer du blir glad i.",
    image:
      "https://cdn.sanity.io/images/1teetjp9/production/d95f526d2b68ba4d6dc669798d87906aea4127a6-2968x2190.jpg?rect=235%2C117%2C2497%2C1873&fp-x=0.5&fp-y=0.4810538419008915&w=260&h=195&auto=format",
    alt: "Stort utvalg",
  },
  {
    title: "Kundeservice",
    description:
      "Vi er alltid her for \u00e5 hjelpe deg. Chat, e-post eller telefon \u2013 du velger.",
    image:
      "https://cdn.sanity.io/images/1teetjp9/production/12e97e6b10ee39bb9ef311923b68aabf0f9ed272-4492x3685.jpg?rect=0%2C0%2C4492%2C3369&w=260&h=195&auto=format",
    alt: "Kundeservice",
  },
  {
    title: "Tenk milj\u00f8",
    description:
      "Samme bil leverer til flere nabolag. Det betyr mindre utslipp og f\u00e6rre turer til butikken.",
    image:
      "https://cdn.sanity.io/images/1teetjp9/production/0915d9406b2ddb835a65d1458dce5889112c8406-1920x1280.jpg?rect=129%2C0%2C1663%2C1247&fp-x=0.5&fp-y=0.48703596199831073&w=260&h=195&auto=format",
    alt: "Tenk milj\u00f8",
  },
] as const;

export function HomeFeatures() {
  return (
    <motion.section
      className="bg-background py-12 lg:py-16"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        className="container mx-auto px-5"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
          variants={staggerChildren}
        >
          {FEATURE_CARDS.map((card) => (
            <motion.div
              key={card.title}
              className="bg-secondarybg rounded-xl overflow-hidden shadow-sm"
              variants={scaleIn}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                  {card.title}
                </h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center"
          variants={fadeInUp}
          transition={{ delay: 0.05 }}
        >
          <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg rounded-lg">
            {"Pr\u00f8v \u00e5 handle fra godstolen!"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
