"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "../../../lib/motion-presets";

export function HomeWelcome() {
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
        className="container mx-auto px-5 text-center"
        variants={fadeInUp}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
          Velkommen til en litt annerledes matbutikk
        </h2>
        <p className="text-foreground/80 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
          {
            "Vi har ikke handlevogner. Vi har hverken skyved\u00f8rer, hylleroter eller et k\u00f8system inn mot kassa. Vi har jo ikke k\u00f8. Vi har ikke en gang butikker. I stedet kan du handle der det passer deg best. Mange foretrekker kj\u00f8kkenbordet, andre tar det kanskje i sofaen etter at barna har lagt seg. Og ja... I stedet for at du trenger \u00e5 komme til oss, s\u00e5 b\u00e6rer vi alt hjem til deg i stedet."
          }
        </p>
      </motion.div>
    </motion.section>
  );
}
