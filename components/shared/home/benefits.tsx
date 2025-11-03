import { Recycle, Home, Tag, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeBenefits() {
  return (
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
                Hver uke finner du nye tilbud på ting vi tror du har glede av i
                forhold til sesong, matpakker, hverdag eller helg.
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
  );
}
