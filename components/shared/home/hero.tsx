import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
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
            Få 3 måneder gratis levering. Og alt du trenger, båret opp alle
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
  );
}
