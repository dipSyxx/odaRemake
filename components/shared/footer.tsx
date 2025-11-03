import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
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
            <h3 className="text-foreground font-semibold text-sm mb-4">Oda</h3>
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
                  Bærekraft
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                >
                  Presse
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/70 hover:text-foreground text-sm transition-colors"
                >
                  Ledige stillinger
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
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight">Last ned fra</div>
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
                  aria-hidden="true"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-tight">Last ned på</div>
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
                <span className="text-white font-bold text-[10px]">ØKO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
