"use client";

import {
  Search,
  ShoppingCart,
  ChevronDown,
  Gift,
  MessageCircle,
  Recycle,
  Tag,
  Headphones,
  ExternalLink,
  Home,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50  border-b border-border">
        <div className=" w-full">
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

      {/* Banner - improved styling with theme support */}
      <div className="bg-[var(--banner-bg)] py-4">
        <div className="container mx-auto px-5">
          <div className="flex items-start gap-4">
            <Gift className="h-8 w-8 lg:h-12 lg:w-12 text-[var(--banner-text)] flex-shrink-0 mt-1" />
            <div className="text-[var(--banner-text)]">
              <h2 className="font-bold text-base lg:text-lg">
                Nye kunder får gratis levering i 3 måneder!
              </h2>
              <p className="text-sm opacity-90">
                Så lenge du handler annenhver uke eller oftere. Tilbudet gjelder
                ikke for levering samme dag.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - improved mobile responsiveness */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src="/images/design-mode/6011551e61f4903e41de9e5421a285122b3e3a07-2638x1519.jpg"
          alt="Oda delivery person"
          width={1270}
          height={600}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Card */}
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <div className="bg-secondarybg backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-12 max-w-md text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 lg:mb-6 text-balance">
              Velkommen til en enklere hverdag
            </h1>
            <p className="text-card-foreground/90 text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed">
              Få 3 måneder gratis levering. Og alt du trenger, bæret opp alle
              trapper, helt frem til døra di.
            </p>
            <div className="space-y-3">
              <Button className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold py-4 lg:py-6 text-base lg:text-lg rounded-lg">
                Bli kunde!
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-400 py-4 lg:py-6 text-base lg:text-lg rounded-lg bg-transparent"
              >
                Sjekk om vi leverer til deg
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
            Velkommen til en litt annerledes matbutikk
          </h2>
          <p className="text-foreground/80 text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
            Vi har ikke handlevogner. Vi har hverken skyvedører, hylleroter
            eller et køsystem inn mot kassa. Vi har jo ikke kø. Vi har ikke en
            gang butikker. I stedet kan du handle der det passer deg best. Mange
            foretrekker kjøkkenbordet, andre tar det kanskje i sofaen etter at
            barna har lagt seg. Og ja... I stedet for at du trenger å komme til
            oss, så bærer vi alt hjem til deg i stedet.
          </p>
        </div>
      </div>

      {/* Feature Cards Section - improved grid responsiveness */}
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            {/* Feature Card 1 */}
            <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://cdn.sanity.io/images/1teetjp9/production/420e3110b1d84d2d4139b2f9b787c58f898c0567-8158x9123.jpg?rect=0%2C0%2C8158%2C6119&w=260&h=195&auto=format"
                alt="Lave priser"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                  Lave priser
                </h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  Oda er nesten som en stor lavprisbutikk. Bare at du kan besøke
                  oss hjemmefra.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://cdn.sanity.io/images/1teetjp9/production/d95f526d2b68ba4d6dc669798d87906aea4127a6-2968x2190.jpg?rect=235%2C117%2C2497%2C1873&fp-x=0.5&fp-y=0.4810538419008915&w=260&h=195&auto=format"
                alt="En ferskvaeredisk i særklasse"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                  En ferskvaeredisk i særklasse
                </h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  I tillegg til favoris har vi kanskje Norges mest spennende
                  ferskvaeredisk med lokale aktører.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://cdn.sanity.io/images/1teetjp9/production/12e97e6b10ee39bb9ef311923b68aabf0f9ed272-4492x3685.jpg?rect=0%2C0%2C4492%2C3369&w=260&h=195&auto=format"
                alt="Ferskere frukt og grønt"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                  Ferskere frukt og grønt
                </h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  Uten tilsatt butikk-tid, kan grønnsaker bruke så lite som 12
                  timer fra bonde til bord.
                </p>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
              <img
                src="https://cdn.sanity.io/images/1teetjp9/production/0915d9406b2ddb835a65d1458dce5889112c8406-1920x1280.jpg?rect=129%2C0%2C1663%2C1247&fp-x=0.5&fp-y=0.48703596199831073&w=260&h=195&auto=format"
                alt="Et bondens marked"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                  Et bondens marked
                </h3>
                <p className="text-card-foreground/70 text-sm leading-relaxed">
                  Vi er uavhengige av Bama og samarbeider direkte med norske
                  gårder og bønder.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg rounded-lg">
              Prøv å handle fra godstolen!
            </Button>
          </div>
        </div>
      </div>

      {/* Low Prices Section - improved mobile layout */}
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance">
                Lave priser, levert på døra.
              </h2>
              <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
                Vi er en matbutikk som ikke betaler for butikklokaler på
                annethvert gatehjørne. Det gjør at vi kan konkurrere med de
                store gigantene på pris, og tilby deg lave priser, levert helt
                hjem på døra.
              </p>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                Ta din første handletur!
              </Button>
            </div>
            <div>
              <img
                src="/images/design-mode/589db22aa86f8d65a8f5a9f534e001f95b5d2d5e-3776x2475.jpg"
                alt="Price tags showing Supertilbud, Knallpris, Kjempebillig"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Benefits Section - improved mobile layout */}
      <div className="bg-secondarybg py-12 lg:py-16">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-12 lg:mb-16">
            Andre fordeler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-16 lg:gap-y-12 max-w-5xl mx-auto mb-12 lg:mb-16">
            {/* Benefit 1 */}
            <div className="flex gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Recycle className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">
                  Pant fra dørterskelen
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  Vi har egne panteposer du fyller og gir til sjåføren. Panten
                  telles opp hos Infinitum og beløpet trekkes fra neste gang du
                  handler.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Home className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">
                  Levert når det passer deg
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  Dersom du bor i en egnet bolig kan vi sette fra oss varene,
                  uten å ringe på. Du får beskjed på SMS om at varene er levert.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Tag className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">
                  Gode tilbud
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  Hver uke finner du nye tilbud på ting vi tror du har glede av
                  i forhold til sesong, matpakker, hverdag eller helg.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Headphones className="h-6 w-6 lg:h-8 lg:w-8 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 lg:mb-3">
                  Norges mest fornøyde dagligvarekunder
                </h3>
                <p className="text-foreground/70 text-sm lg:text-base leading-relaxed">
                  Fem år på rad. Kontakt oss på chat, e-post og telefon. Vi
                  hjelper deg med alt du lurer på!
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Button */}
          <div className="flex justify-center">
            <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-lg rounded-lg">
              Kontakt oss her!
            </Button>
          </div>
        </div>
      </div>

      {/* Recipes Section - improved mobile layout */}
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left side - Text and CTA */}
            <div className="lg:pt-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 lg:mb-8 text-balance leading-tight">
                Handle over 1500 oppskrifter med ett klikk.
              </h2>
              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                Klikk ingrediensene hjem!
              </Button>
            </div>

            {/* Right side - Masonry Grid of Food Images */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {/* Large image - top left */}
              <div className="row-span-2">
                <img
                  src="https://images.oda.com/oppskrifter/9033af54-d5a9-4aca-b555-4f6e27e27872.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x3c09f928795b65165bc1f26358b02489b820207c"
                  alt="Grilled chicken with rice"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Large image - top right */}
              <div className="row-span-2">
                <img
                  src="https://images.oda.com/recipes/8d84beb2-c247-4911-85a3-ac248e30e85b.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x1efb51c189dcf8c75679009185d5063074a2bd40"
                  alt="Shakshuka in cast iron pan"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Small image - bottom left */}
              <div>
                <img
                  src="https://images.oda.com/oppskrifter/e5649c39-4bf1-4893-85ec-d9623ddc299f.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xcd418c30212f0ec5dd902d3f3140bdef8fcc4e2e"
                  alt="Frittata in pan"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Medium image - bottom right */}
              <div>
                <img
                  src="https://images.oda.com/recipes/67f32aa2-d4c2-459d-855c-e8e4cc1ab954.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xc414b8ae1f4541e2b2c2f01b7fb989897270bfb0"
                  alt="Curry soup"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple and Clear Home Delivery Section - improved mobile layout */}
      <div className="bg-background py-12 lg:py-16">
        <div className="container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 lg:mb-12 text-balance leading-tight">
                Enkel og oversiktlig hjemlevering
              </h2>

              {/* Numbered list */}
              <div className="space-y-6 lg:space-y-8 mb-8 lg:mb-12">
                <div className="flex gap-3 lg:gap-4">
                  <span className="text-xl lg:text-2xl font-bold text-foreground flex-shrink-0">
                    1
                  </span>
                  <p className="text-foreground/80 text-base lg:text-lg leading-relaxed">
                    Du velger selv når du vil ha varene levert. Tips: Velg
                    leveringstiden først, så er du sikker på at ingen andre
                    stjeler tiden din.
                  </p>
                </div>

                <div className="flex gap-3 lg:gap-4">
                  <span className="text-xl lg:text-2xl font-bold text-foreground flex-shrink-0">
                    2
                  </span>
                  <p className="text-foreground/80 text-base lg:text-lg leading-relaxed">
                    Du får god informasjon på leveringsdagen og kan følge
                    leveringen i samtid i appen.
                  </p>
                </div>

                <div className="flex gap-3 lg:gap-4">
                  <span className="text-xl lg:text-2xl font-bold text-foreground flex-shrink-0">
                    3
                  </span>
                  <p className="text-foreground/80 text-base lg:text-lg leading-relaxed">
                    Varene blir bæret helt frem til døra. Og har du pant, eller
                    vil returnere tomme esker fra forrige gang, tar vi det med
                    oss.
                  </p>
                </div>
              </div>

              <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-semibold px-6 lg:px-8 py-4 lg:py-6 text-base rounded-lg">
                Få 3 mnd gratis hjemlevering nå!
              </Button>
            </div>

            {/* Right side - Image */}
            <div>
              <img
                src="/mother-and-child-unpacking-oda-delivery-box-with-f.jpg"
                alt="Mother and child unpacking Oda delivery"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - improved mobile layout */}
      <footer className="bg-background border-t border-border border-white/50 pt-12 lg:pt-16 pb-8">
        <div className="container mx-auto px-5">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
            {/* Column 1 - Nettbutikk */}
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-4">
                Nettbutikk
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Inspirasjon
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Middagstips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Kvalitet og holdbarhet
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Lave priser
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Bedriftslevering
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 - Kundeservice */}
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-4">
                Kundeservice
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Hjelp og kundeservice
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Sånn bestiller du
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Hjemlevering
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Retur av pant
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Retur av elektronisk avfall
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors inline-flex items-center gap-1"
                  >
                    Råd om legemidler på nett
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Oda */}
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-4">
                Oda
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Om oss
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Jobb og karriere
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Inviter venner
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                  >
                    Bærekraft
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-foreground/70 hover:text-foreground text-sm transition-colors inline-flex items-center gap-1"
                  >
                    Oda Systems
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Last ned appen */}
            <div>
              <h3 className="text-foreground font-semibold text-sm mb-4">
                Last ned appen
              </h3>
              <div className="space-y-3">
                <a
                  href="https://apps.apple.com/no/app/oda-online-grocery-store/id1079537578"
                  className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-5 py-2.5 rounded-lg transition-colors border border-white/20"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">
                      Last ned fra
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      App Store
                    </div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=no.kolonial.tienda"
                  className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-5 py-2.5 rounded-lg transition-colors border border-white/20"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight">LAST NED PÅ</div>
                    <div className="text-sm font-semibold leading-tight">
                      Google Play
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border border-white/30 pt-6 lg:pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left side - Copyright and links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm text-foreground/60">
                <span>© 2025 Oda</span>
                <a href="#" className="hover:text-foreground transition-colors">
                  Salgs- og bruksvilkår
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Personvern
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Administrer informasjonskapsler
                </a>
              </div>

              {/* Right side - Payment icons */}
              <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center">
                {/* Klarna */}
                <div className="bg-[#ffb3c7] rounded px-3 py-1.5">
                  <span className="text-black font-bold text-xs">Klarna</span>
                </div>
                {/* Vipps */}
                <div className="bg-[#ff5b24] rounded px-3 py-1.5">
                  <span className="text-white font-bold text-xs">Vipps</span>
                </div>
                {/* Apple Pay */}
                <div className="bg-black rounded px-3 py-1.5 border border-white/20">
                  <span className="text-white font-semibold text-xs">
                    Apple Pay
                  </span>
                </div>
                {/* Mastercard */}
                <div className="bg-white rounded px-3 py-1.5">
                  <div className="flex items-center gap-0.5">
                    <div className="w-4 h-4 rounded-full bg-[#eb001b]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#ff5f00] -ml-2"></div>
                  </div>
                </div>
                {/* Visa */}
                <div className="bg-[#1434cb] rounded px-3 py-1.5">
                  <span className="text-white font-bold text-xs">VISA</span>
                </div>
                {/* Certification badge */}
                <div className="bg-[#00a651] rounded px-3 py-1.5">
                  <span className="text-white font-bold text-[10px]">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-[#ff9500] hover:bg-[#e68600] text-white rounded-full p-3 lg:p-4 shadow-lg transition-transform hover:scale-110 z-40">
        <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>
    </div>
  );
}
