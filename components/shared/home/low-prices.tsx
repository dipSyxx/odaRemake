import { Button } from "@/components/ui/button";

export function HomeLowPrices() {
  return (
    <div className="bg-background py-12 lg:py-16">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance">
              Lave priser, levert på døra.
            </h2>
            <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8">
              Vi er en matbutikk som ikke betaler for butikklokaler på annethvert
              gatehjørne. Det gjør at vi kan konkurrere med de store gigantene
              på pris, og tilby deg lave priser, levert helt hjem på døra.
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
  );
}
