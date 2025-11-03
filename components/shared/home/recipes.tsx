"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  scaleIn,
  staggerChildren,
  viewportOnce,
} from "../../../lib/motion-presets";

const RECIPE_IMAGES = [
  {
    src: "https://images.oda.com/oppskrifter/9033af54-d5a9-4aca-b555-4f6e27e27872.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x3c09f928795b65165bc1f26358b02489b820207c",
    alt: "Grillet kylling med ris",
    className: "row-span-2",
  },
  {
    src: "https://images.oda.com/recipes/8d84beb2-c247-4911-85a3-ac248e30e85b.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x1efb51c189dcf8c75679009185d5063074a2bd40",
    alt: "Shakshuka i støpejernsgryte",
    className: "row-span-2",
  },
  {
    src: "https://images.oda.com/oppskrifter/e5649c39-4bf1-4893-85ec-d9623ddc299f.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xcd418c30212f0ec5dd902d3f3140bdef8fcc4e2e",
    alt: "Frittata i panne",
    className: "",
  },
  {
    src: "https://images.oda.com/recipes/67f32aa2-d4c2-459d-855c-e8e4cc1ab954.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xc414b8ae1f4541e2b2c2f01b7fb989897270bfb0",
    alt: "Kremet currysuppe",
    className: "",
  },
] as const;

export function HomeRecipes() {
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="lg:pt-12" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 lg:mb-8 text-balance leading-tight">
              Handle over 1500 oppskrifter med ett klikk.
            </h2>
            <motion.div variants={scaleIn}>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                Klikk ingrediensene hjem!
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 lg:gap-4"
            variants={staggerChildren}
          >
            {RECIPE_IMAGES.map((image) => (
              <motion.div
                key={image.src}
                className={image.className}
                variants={scaleIn}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
