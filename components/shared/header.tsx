"use client";

import { Search, Sun, Moon, ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "react-day-picker";
import { useTheme } from "../theme-provider";
import { Input } from "../ui/input";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border">
      <div className="w-full">
        <div className="bg-background/95 backdrop-blur-sm flex items-center justify-center py-3 px-5 gap-4">
          <div className="container flex justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4 lg:gap-8 flex-1 lg:flex-initial">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#ff9500] flex-shrink-0">
                oda
              </h1>

              {/* Search Bar - hidden on mobile, shown on md+ */}
              <div className="relative hidden md:block md:w-[300px] lg:w-[450px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Søk"
                  className="w-full pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-full"
                />
              </div>
            </div>

            {/* Right side - Theme toggle and Cart */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
              </button>

              {/* Cart */}
              <div className="flex items-center gap-2 px-3 lg:px-5 py-2 border border-border rounded-full text-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">kr 0,00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - improved mobile responsiveness */}
        <nav className="bg-secondarybg/95 backdrop-blur-sm border-b border-border border-white/50 flex items-center justify-center py-2 px-5 gap-4">
          <div className="container flex justify-between">
            <div className="flex items-center gap-3 lg:gap-6 overflow-x-auto">
              <button className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap">
                <span className="text-lg">🏷️</span>
                <span className="hidden sm:inline">Kategorier</span>
                <ChevronDown className="h-4 w-4 hidden sm:inline" />
              </button>
              <button className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap">
                <span className="text-lg">⏰</span>
                <span className="hidden sm:inline">Tilbud</span>
              </button>
              <button className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap">
                <span className="text-lg">🍳</span>
                <span className="hidden sm:inline">Kokeboka</span>
              </button>
              <button className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap">
                <span className="text-lg">🏢</span>
                <span className="hidden sm:inline">For bedrifter</span>
              </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <button className="text-foreground text-sm hover:text-muted-foreground hidden md:inline">
                Logg inn
              </button>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-medium rounded-md text-sm px-3 py-0 h-7">
                <span className="hidden sm:inline">Opprett konto</span>
                <span className="sm:hidden">Opprett</span>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
