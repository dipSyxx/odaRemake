"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/lib/theme-provider";
import { useEffect } from "react";
import { useUserStore } from "@/hooks/use-user-store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchMe = useUserStore((s) => s.fetchMe);
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
    </SessionProvider>
  );
}
