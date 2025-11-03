import { Button } from "@/components/ui/button";

export function HomeDelivery() {
  return (
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
                  leveringstiden først, så er du sikker på at ingen andre stjeler
                  tiden din.
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
                  Varene blir båret helt frem til døra. Og har du pant, eller vil
                  returnere tomme esker fra forrige gang, tar vi det med oss.
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
  );
}
