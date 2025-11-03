"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  fadeInUp,
  scaleIn,
  staggerChildren,
  viewportOnce,
} from "../../lib/motion-presets";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Nettbutikk",
    links: [
      { label: "Inspirasjon", href: "#" },
      { label: "Middagstips", href: "#" },
      { label: "Kvalitet og holdbarhet", href: "#" },
      { label: "Lave priser", href: "#" },
      { label: "Bedriftslevering", href: "#" },
    ],
  },
  {
    title: "Kundeservice",
    links: [
      { label: "Hjelp og kundeservice", href: "#" },
      { label: "S\u00e5nn bestiller du", href: "#" },
      { label: "Hjemlevering", href: "#" },
      { label: "Retur av pant", href: "#" },
      { label: "Retur av elektronisk avfall", href: "#" },
      {
        label: "R\u00e5d om legemidler p\u00e5 nett",
        href: "#",
        external: true,
      },
    ],
  },
  {
    title: "Oda",
    links: [
      { label: "Om oss", href: "#" },
      { label: "B\u00e6rekraft", href: "#" },
      { label: "Presse", href: "#" },
      { label: "Ledige stillinger", href: "#" },
      { label: "Oda Systems", href: "#", external: true },
    ],
  },
  {
    title: "Last ned appen",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/no/app/oda-online-grocery-store/id1079537578",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=no.kolonial.tienda",
      },
    ],
  },
];

const FOOTER_LINK_TEXT = {
  appStoreTop: "Last ned fra",
  googlePlayTop: "Last ned p\u00e5",
};

const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { label: "Salgs- og bruksvilk\u00e5r", href: "#" },
  { label: "Personvern", href: "#" },
  { label: "Administrer informasjonskapsler", href: "#" },
];

export function Footer() {
  return (
    <motion.footer
      className="bg-background border-t border-border border-white/50 pt-12 lg:pt-16 pb-8"
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={viewportOnce}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="container mx-auto px-5">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          {FOOTER_COLUMNS.map((column) => (
            <motion.div key={column.title} variants={fadeInUp}>
              <h3 className="text-foreground font-semibold text-sm mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => {
                  if (column.title === "Last ned appen") {
                    const isAppStore = link.label === "App Store";
                    return (
                      <motion.li key={link.label} variants={fadeInUp}>
                        <a
                          href={link.href}
                          className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-5 py-2.5 rounded-lg transition-colors border border-white/20"
                        >
                          {isAppStore ? (
                            <svg
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                          ) : (
                            <svg
                              className="h-6 w-6"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                          )}
                          <div className="text-left">
                            <div className="text-[10px] leading-tight">
                              {isAppStore
                                ? FOOTER_LINK_TEXT.appStoreTop
                                : FOOTER_LINK_TEXT.googlePlayTop}
                            </div>
                            <div className="text-sm font-semibold leading-tight">
                              {link.label}
                            </div>
                          </div>
                        </a>
                      </motion.li>
                    );
                  }

                  return (
                    <motion.li key={link.label} variants={fadeInUp}>
                      <a
                        href={link.href}
                        className="text-foreground/70 hover:text-foreground text-sm transition-colors inline-flex items-center gap-1"
                      >
                        {link.label}
                        {link.external ? (
                          <ExternalLink className="h-3 w-3" />
                        ) : null}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="border-t border-border border-white/30 pt-6 lg:pt-8"
          variants={fadeInUp}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm text-foreground/60"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={fadeInUp}>{"\u00a9 2025 Oda"}</motion.span>
              {FOOTER_LEGAL_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                  variants={fadeInUp}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="bg-[#ffb3c7] rounded px-3 py-1.5"
                variants={scaleIn}
              >
                <span className="text-black font-bold text-xs">Klarna</span>
              </motion.div>
              <motion.div
                className="bg-[#ff5b24] rounded px-3 py-1.5"
                variants={scaleIn}
              >
                <span className="text-white font-bold text-xs">Vipps</span>
              </motion.div>
              <motion.div
                className="bg-black rounded px-3 py-1.5 border border-white/20"
                variants={scaleIn}
              >
                <span className="text-white font-semibold text-xs">
                  Apple Pay
                </span>
              </motion.div>
              <motion.div
                className="bg-white rounded px-3 py-1.5"
                variants={scaleIn}
              >
                <div className="flex items-center gap-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#eb001b]" />
                  <div className="w-4 h-4 rounded-full bg-[#ff5f00] -ml-2" />
                </div>
              </motion.div>
              <motion.div
                className="bg-[#1434cb] rounded px-3 py-1.5"
                variants={scaleIn}
              >
                <span className="text-white font-bold text-xs">VISA</span>
              </motion.div>
              <motion.div
                className="bg-[#00a651] rounded px-3 py-1.5"
                variants={scaleIn}
              >
                <span className="text-white font-bold text-[10px]">
                  {"\u00d8KO"}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
