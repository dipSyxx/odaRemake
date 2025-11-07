"use client";

import { useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gift,
  Loader2,
  Package,
  Percent,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HighlightedProduct, useCategoryMenu } from "@/hooks/use-category-menu";
import type { SerializedCategory } from "@/lib/serializers";

const SHORTCUTS = [
  { label: "Nyheter", icon: Sparkles, href: "/nyheter" },
  { label: "Tilbud", icon: Percent, href: "/tilbud" },
  { label: "Alle produkter", icon: Package, href: "/produkter" },
  { label: "Kjøp gavekort", icon: Gift, href: "/gaver" },
];

type CategoriesPopoverProps = {
  trigger: ReactNode;
};

export function CategoriesPopover({ trigger }: CategoriesPopoverProps) {
  const [open, setOpen] = useState(false);
  const { categories, highlightedProducts, loading, error, hasFetched, refetch } =
    useCategoryMenu(open);

  const featured = useMemo(
    () => categories.slice(0, 4),
    [categories],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={16}
        className="w-[min(95vw,1100px)] p-0 border-border/80 bg-background/95 backdrop-blur-lg shadow-2xl"
      >
        <div className="grid md:grid-cols-[280px,1fr]">
          <aside className="p-5 border-r border-border/60 space-y-5">
            <section>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Snarveier
              </p>
              <div className="grid gap-2">
                {SHORTCUTS.map((shortcut) => (
                  <ShortcutButton key={shortcut.label} {...shortcut} />
                ))}
              </div>
            </section>
            <Separator />
            <section>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Utvalgte kategorier
              </p>
              <div className="grid gap-3">
                {featured.map((category) => (
                  <FeaturedCategoryCard key={category.id} category={category} />
                ))}
                {featured.length === 0 && !loading ? (
                  <p className="text-sm text-muted-foreground">
                    Ingen kategorier er tilgjengelige ennå.
                  </p>
                ) : null}
              </div>
            </section>
          </aside>

          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            <header className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Utforsk kategorier</p>
                <p className="text-xs text-muted-foreground">
                  {loading
                    ? "Laster innhold..."
                    : `${categories.length} kategorier tilgjengelige`}
                </p>
              </div>
              {!hasFetched || loading ? (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Laster
                </Badge>
              ) : null}
            </header>

            {error ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive space-y-2">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={refetch}
                >
                  <RefreshCw className="h-4 w-4" />
                  Prøv igjen
                </Button>
              </div>
            ) : null}

            {loading && !categories.length ? (
              <div className="grid gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <CategoryList categories={categories} />
                {highlightedProducts.length > 0 ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Populære produkter</p>
                      <Badge variant="outline">
                        {highlightedProducts.length} produkter
                      </Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {highlightedProducts.slice(0, 6).map((product) => (
                        <ProductPreviewCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type ShortcutProps = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

function ShortcutButton({ label, icon: Icon, href }: ShortcutProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="w-full justify-start gap-2 rounded-lg"
      asChild
    >
      <Link href={href}>
        <Icon className="h-4 w-4 text-foreground/80" />
        {label}
      </Link>
    </Button>
  );
}

function FeaturedCategoryCard({ category }: { category: SerializedCategory }) {
  const fallbackImage =
    category.imageUrl ??
    category.products?.find((link) => link.product?.images?.length)
      ?.product?.images?.[0]?.large?.url;

  return (
    <Link
      href={`/kategorier/${category.slug}`}
      className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3 transition hover:border-border hover:bg-secondary/60"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {fallbackImage ? (
          <Image
            src={fallbackImage}
            alt={category.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            {category.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold">{category.name}</p>
        <p className="text-xs text-muted-foreground">
          {category.productCount ?? 0} produkter
        </p>
      </div>
    </Link>
  );
}

function CategoryList({ categories }: { categories: SerializedCategory[] }) {
  if (!categories.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Ingen kategorier er tilgjengelige for øyeblikket.
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/kategorier/${category.slug}`}
          className="group flex items-center justify-between gap-3 rounded-lg border border-transparent p-3 transition hover:border-border hover:bg-secondary/40"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <CategoryAvatar category={category} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{category.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {category.description ?? "Utforsk produkter"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-foreground/80">
              {category.productCount ?? 0}
            </span>
            <motion.span
              className="text-foreground/60"
              whileHover={{ x: 2 }}
            >
              →
            </motion.span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function CategoryAvatar({ category }: { category: SerializedCategory }) {
  const productImage =
    category.products?.find((link) => link.product?.images?.length)
      ?.product?.images?.[0];

  const url =
    category.imageUrl ??
    productImage?.thumbnail?.url ??
    productImage?.large?.url;

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
        {category.name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={category.name}
      fill
      className="object-cover"
      sizes="40px"
    />
  );
}

function ProductPreviewCard({ product }: { product: HighlightedProduct }) {
  const image =
    product.images?.[0]?.thumbnail?.url ?? product.images?.[0]?.large?.url;

  return (
    <Link
      href={product.absoluteUrl || `/produkt/${product.id}`}
      className="group flex gap-3 rounded-xl border border-border/60 p-3 transition hover:border-border hover:bg-secondary/40"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            {product.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {product.categoryName}
        </p>
        <p className="text-sm font-medium text-foreground">
          {formatCurrency(product.grossPrice, product.currency)}
        </p>
      </div>
    </Link>
  );
}

function formatCurrency(value: number | null | undefined, currency = "NOK") {
  if (value === null || value === undefined) return "Ukjent pris";
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
