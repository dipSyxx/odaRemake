import { Gift } from "lucide-react";

export function HomeBanner() {
  return (
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
  );
}
