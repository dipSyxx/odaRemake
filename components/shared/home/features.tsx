import { Button } from "@/components/ui/button";

export function HomeFeatures() {
  return (
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
              alt="Stort utvalg"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                Stort utvalg
              </h3>
              <p className="text-card-foreground/70 text-sm leading-relaxed">
                Fra lokale produsenter til økologiske favoritter. Våre eksperter
                velger ut varer du blir glad i.
              </p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://cdn.sanity.io/images/1teetjp9/production/12e97e6b10ee39bb9ef311923b68aabf0f9ed272-4492x3685.jpg?rect=0%2C0%2C4492%2C3369&w=260&h=195&auto=format"
              alt="Kundeservice"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                Kundeservice
              </h3>
              <p className="text-card-foreground/70 text-sm leading-relaxed">
                Vi er alltid her for å hjelpe deg. Chat, e-post eller telefon –
                du velger.
              </p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-secondarybg rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://cdn.sanity.io/images/1teetjp9/production/0915d9406b2ddb835a65d1458dce5889112c8406-1920x1280.jpg?rect=129%2C0%2C1663%2C1247&fp-x=0.5&fp-y=0.48703596199831073&w=260&h=195&auto=format"
              alt="Miljø"
              className="w-full h-48 object-cover"
            />
            <div className="p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold text-card-foreground mb-2 lg:mb-3">
                Tenk miljø
              </h3>
              <p className="text-card-foreground/70 text-sm leading-relaxed">
                Samme bil leverer til flere nabolag. Det betyr mindre utslipp og
                færre turer til butikken.
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
  );
}
