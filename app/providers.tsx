"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/lib/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    </SessionProvider>
  );
}
