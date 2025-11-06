"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  ChevronDown,
  Layers,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  Tag,
} from "lucide-react";
import { useTheme } from "../../lib/theme-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  fadeIn,
  fadeInDown,
  fadeInUp,
  scaleIn,
  staggerChildren,
} from "../../lib/motion-presets";
import Link from "next/link";
import { useUserStore } from "@/hooks/use-user-store";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useState } from "react";

const NAV_ITEMS: { icon: LucideIcon; label: string; hasCaret?: boolean }[] = [
  { icon: Layers, label: "Kategorier", hasCaret: true },
  { icon: Tag, label: "Tilbud" },
  { icon: BookOpen, label: "Kokeboka" },
  { icon: Building2, label: "For bedrifter" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { cart } = useUserStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 border-b border-border"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="w-full">
          <motion.div
            className="bg-background/95 backdrop-blur-sm flex items-center justify-center py-3 px-5 gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <motion.div
              className="container flex justify-between"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="flex items-center gap-4 lg:gap-8 flex-1 lg:flex-initial"
                variants={staggerChildren}
              >
                <motion.h1
                  className="text-2xl lg:text-3xl font-bold text-[#ff9500] flex-shrink-0"
                  variants={fadeInUp}
                >
                  <Link href="/">oda</Link>
                </motion.h1>

                <motion.div
                  className="relative hidden md:block md:w-[300px] lg:w-[450px]"
                  variants={fadeInUp}
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={"S\u00f8k"}
                    className="w-full pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-full"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 lg:gap-3"
                variants={staggerChildren}
              >
                <motion.button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                  variants={scaleIn}
                  whileHover={{ rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-foreground" />
                  ) : (
                    <Moon className="h-5 w-5 text-foreground" />
                  )}
                </motion.button>

                <motion.div variants={fadeInUp}>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="bg-transparent flex items-center gap-2 px-3 lg:px-5 py-2 border border-border rounded-full text-foreground"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm hidden sm:inline">
                      {cart?.totalAmount
                        ? `kr ${cart.totalAmount.toFixed(2)}`
                        : "kr 0,00"}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.nav
            className="bg-secondarybg/95 backdrop-blur-sm border-b border-border border-white/50 flex items-center justify-center py-2 px-5 gap-4"
            variants={fadeInDown}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          >
            <div className="container flex justify-between">
              <motion.div
                className="flex items-center gap-3 lg:gap-6 overflow-hidden"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {NAV_ITEMS.map((item) => (
                  <motion.button
                    key={item.label}
                    className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap"
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.hasCaret ? (
                      <ChevronDown className="h-4 w-4 hidden sm:inline" />
                    ) : null}
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                className="flex items-center gap-2 lg:gap-3"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  className="text-foreground text-sm hover:text-muted-foreground hidden md:inline"
                  variants={fadeInUp}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/login">Logg inn</Link>
                </motion.button>
                <motion.div variants={fadeInUp}>
                  <Link href="/register">
                    <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-medium rounded-md text-sm px-3 py-0 h-7">
                      <span className="hidden sm:inline">Opprett konto</span>
                      <span className="sm:hidden">Opprett</span>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.nav>
        </div>
      </motion.header>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Handlekurv</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4 overflow-y-auto">
            {cart && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      {item.product?.name ?? `Produkt #${item.productId}`}
                    </div>
                    <div className="text-muted-foreground">
                      {item.quantity} x {item.unitPrice ?? 0} {item.currency}
                    </div>
                  </div>
                  <div className="text-sm">
                    {(
                      ((item.unitPrice ?? 0) * item.quantity) as number
                    ).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Ingen varer i handlekurven.
              </p>
            )}
          </div>
          <DrawerFooter>
            <div className="flex items-center justify-between text-sm">
              <span>Sum</span>
              <span className="font-medium">
                {cart?.totalAmount
                  ? `kr ${cart.totalAmount.toFixed(2)}`
                  : "kr 0,00"}
              </span>
            </div>
            <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black">
              Gå til kassen
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Lukk</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
