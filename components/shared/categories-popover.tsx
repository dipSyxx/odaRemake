'use client'

import { useMemo, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Gift,
  Loader2,
  Package,
  Percent,
  RefreshCw,
  Sparkles,
  Apple,
  Milk,
  Beef,
  Coffee,
  Fish,
  ShoppingBag,
  Cookie,
  Baby,
  Pill,
  Home,
  Cat,
  UtensilsCrossed,
  Candy,
  Dumbbell,
  Flower2,
  Cigarette,
  type LucideIcon,
} from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategoryMenu } from '@/hooks/use-category-menu'
import type { SerializedCategory } from '@/lib/serializers'

const SHORTCUTS = [
  { label: 'Nyheter', icon: Sparkles, href: '/nyheter' },
  { label: 'Tilbud', icon: Percent, href: '/tilbud' },
  { label: 'Alle produkter', icon: Package, href: '/produkter' },
  { label: 'Kjøp gavekort', icon: Gift, href: '/gaver' },
]

// Fallback icon for categories without specific icon mapping
const DefaultIcon = Package

// Map all category names from seed.ts to icons
// Note: Only categories with products (productCount > 0) will be displayed in the UI
// Categories are filtered by productCount > 0 before rendering
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Frukt og grønt': Apple,
  'Frokostblandinger og müsli': Coffee,
  Plantebasert: Milk,
  'Fisk og sjømat': Fish,
  Pålegg: ShoppingBag,
  Drikke: Coffee,
  'Iskrem, dessert og kjeks': Cookie,
  'Baby og barn': Baby,
  'Legemidler og helsekost': Pill,
  'Hus og hjem': Home,
  Dyr: Cat,
  'Bakeri og konditori': Package,
  'Meieri, ost og egg': Milk,
  'Kylling og kjøtt': Beef,
  Restauranter: UtensilsCrossed,
  'Middager og tilbehør': UtensilsCrossed,
  Bakeingredienser: Cookie,
  'Sjokolade, snacks og godteri': Candy,
  Trening: Dumbbell,
  'Hygiene og skjønnhet': ShoppingBag,
  'Blomster og planter': Flower2,
  'Snus og tobakk': Cigarette,
} as const

/**
 * Get icon for a category.
 * Categories without products are filtered out before this function is called,
 * but all categories from seed.ts have icon mappings defined here.
 */
function getCategoryIcon(categoryName: string): LucideIcon {
  // Since we filter categories by productCount > 0, only categories with products
  // will reach this function. But we still use DefaultIcon as fallback for safety.
  return CATEGORY_ICONS[categoryName] ?? DefaultIcon
}

type CategoriesPopoverProps = {
  trigger: ReactNode
}

export function CategoriesPopover({ trigger }: CategoriesPopoverProps) {
  const [open, setOpen] = useState(false)
  const { categories, loading, error, hasFetched, refetch } = useCategoryMenu(open)

  // Filter only categories with products (productCount > 0)
  const categoriesWithProducts = useMemo(() => categories.filter((cat) => (cat.productCount ?? 0) > 0), [categories])

  const featured = useMemo(() => categoriesWithProducts.slice(0, 9), [categoriesWithProducts])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={16}
        className="w-[min(95vw,1100px)] h-[calc(100vh-150px)] max-h-[calc(100vh-150px)] p-0 border-border/80 bg-background/95 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex-1 grid md:grid-cols-[280px,1fr] overflow-y-auto min-h-0">
          <aside className="p-5 border-r border-border/60 space-y-5">
            <section>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Snarveier</p>
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
              {loading && featured.length === 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {featured.map((category) => (
                    <FeaturedCategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </section>
          </aside>

          <div className="p-5 space-y-5">
            <header className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Utforsk kategorier</p>
                <p className="text-xs text-muted-foreground">
                  {loading ? 'Laster innhold...' : `${categoriesWithProducts.length} kategorier tilgjengelige`}
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
                <Button variant="outline" size="sm" className="gap-2" onClick={refetch}>
                  <RefreshCw className="h-4 w-4" />
                  Prøv igjen
                </Button>
              </div>
            ) : null}

            {loading && !categoriesWithProducts.length ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <CategoryList categories={categoriesWithProducts} />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type ShortcutProps = {
  label: string
  icon: ComponentType<{ className?: string }>
  href: string
}

function ShortcutButton({ label, icon: Icon, href }: ShortcutProps) {
  return (
    <Button variant="secondary" size="sm" className="w-full justify-start gap-2 rounded-lg" asChild>
      <Link href={href}>
        <Icon className="h-4 w-4 text-foreground/80" />
        {label}
      </Link>
    </Button>
  )
}

function FeaturedCategoryCard({ category }: { category: SerializedCategory }) {
  const fallbackImage =
    category.imageUrl ??
    category.products?.find((link) => link.product?.images?.length)?.product?.images?.[0]?.large?.url

  return (
    <Link
      href={`/kategorier/${category.slug}`}
      className="group relative h-20 w-full overflow-hidden rounded-lg border border-border/60 transition hover:border-border hover:shadow-md"
    >
      {fallbackImage ? (
        <Image
          src={fallbackImage}
          alt={category.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 80px"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-secondary to-secondary/50" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-xs font-semibold text-white line-clamp-2 drop-shadow-sm">{category.name}</p>
      </div>
    </Link>
  )
}

function CategoryList({ categories }: { categories: SerializedCategory[] }) {
  if (!categories.length) {
    return <p className="text-sm text-muted-foreground">Ingen kategorier er tilgjengelige for øyeblikket.</p>
  }

  // Split categories into two columns
  const midPoint = Math.ceil(categories.length / 2)
  const leftColumn = categories.slice(0, midPoint)
  const rightColumn = categories.slice(midPoint)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="space-y-2">
        {leftColumn.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
      <div className="space-y-2">
        {rightColumn.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

function CategoryItem({ category }: { category: SerializedCategory }) {
  const Icon = getCategoryIcon(category.name)

  return (
    <Link
      href={`/kategorier/${category.slug}`}
      className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-secondary/40"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-foreground/70 group-hover:bg-secondary group-hover:text-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
      </div>
      <span className="text-xs text-muted-foreground">{category.productCount ?? 0}</span>
    </Link>
  )
}
