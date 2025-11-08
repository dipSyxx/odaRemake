'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Building2,
  ChevronDown,
  CircleUserRound,
  Layers,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  Tag,
  X,
} from 'lucide-react'
import { useTheme } from '../../lib/theme-provider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { fadeIn, fadeInDown, fadeInUp, scaleIn, staggerChildren } from '../../lib/motion-presets'
import Link from 'next/link'
import { useUserStore } from '@/hooks/use-user-store'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cloneElement, useMemo, useState } from 'react'
import Image from 'next/image'
import { CategoriesPopover } from './categories-popover'
import { useCategoryMenu } from '@/hooks/use-category-menu'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import {
  Loader2,
  RefreshCw,
  Sparkles,
  Percent,
  Package,
  Gift,
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
} from 'lucide-react'

const SHORTCUTS = [
  { label: 'Nyheter', icon: Sparkles, href: '/nyheter' },
  { label: 'Tilbud', icon: Percent, href: '/tilbud' },
  { label: 'Alle produkter', icon: Package, href: '/produkter' },
  { label: 'Kjøp gavekort', icon: Gift, href: '/gaver' },
]

const DefaultIcon = Package

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

function getCategoryIcon(categoryName: string): LucideIcon {
  return CATEGORY_ICONS[categoryName] ?? DefaultIcon
}

const NAV_ITEMS: { icon: LucideIcon; label: string; hasCaret?: boolean }[] = [
  { icon: Layers, label: 'Kategorier', hasCaret: true },
  { icon: Tag, label: 'Tilbud' },
  { icon: BookOpen, label: 'Kokeboka' },
  { icon: Building2, label: 'For bedrifter' },
]

function MobileMenuSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { categories, loading, error, hasFetched, refetch } = useCategoryMenu(open)
  const categoriesWithProducts = useMemo(() => categories.filter((cat) => (cat.productCount ?? 0) > 0), [categories])
  const featured = useMemo(() => categoriesWithProducts.slice(0, 9), [categoriesWithProducts])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:w-[400px] p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-4 border-b border-border/60 shrink-0">
          <SheetTitle className="text-lg font-semibold">Snarveier</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <section>
              <div className="grid grid-cols-2 gap-2">
                {SHORTCUTS.map((shortcut) => (
                  <Button
                    key={shortcut.label}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start gap-2 rounded-lg"
                    asChild
                    onClick={() => onOpenChange(false)}
                  >
                    <Link href={shortcut.href}>
                      <shortcut.icon className="h-4 w-4 text-foreground/80" />
                      {shortcut.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
            <Separator />
            <section>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Utvalgte kategorier
              </p>
              {loading && featured.length === 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {featured.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategorier/${category.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="group relative h-16 w-full overflow-hidden rounded-lg border border-border/60 transition hover:border-border hover:shadow-md"
                    >
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-linear-to-br from-secondary to-secondary/50" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] font-semibold text-white line-clamp-2 drop-shadow-sm">
                          {category.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <Separator />
            <section>
              <header className="flex items-center justify-between gap-3 mb-3">
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
                <div className="grid grid-cols-1 gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {categoriesWithProducts.map((category) => {
                    const Icon = getCategoryIcon(category.name)
                    return (
                      <Link
                        key={category.id}
                        href={`/kategorier/${category.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="group flex items-center gap-2 rounded-lg p-2 transition hover:bg-secondary/40"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary/50 text-foreground/70 group-hover:bg-secondary group-hover:text-foreground">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{category.productCount ?? 0}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const { cart, user } = useUserStore()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const greetingName = user?.name?.trim()?.split(/\s+/)[0] ?? user?.email?.split('@')[0] ?? null

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 border-b border-border"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="w-full">
          {/* Mobile Header */}
          <motion.div
            className="bg-background/95 backdrop-blur-sm md:hidden"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <div className="flex items-center justify-between p-3 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMenuOpen(true)}
                  className="h-9 w-9 shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Link href="/" className="shrink-0">
                  <h1 className="text-xl font-bold text-[#ff9500]">oda</h1>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="h-9 w-9 shrink-0 relative"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ff9500] text-[10px] font-bold text-black flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Button>
            </div>
            <div className="px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Søk"
                  className="w-full pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-full"
                />
              </div>
            </div>
            {!user && (
              <div className="px-3 pb-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/login">Logg inn</Link>
                </Button>
                <Button size="sm" className="flex-1 bg-[#ff9500] hover:bg-[#e68600] text-black" asChild>
                  <Link href="/register">Opprett konto</Link>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Desktop Header */}
          <motion.div
            className="bg-background/95 backdrop-blur-sm hidden md:flex items-center justify-center py-3 px-5 gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <motion.div
              className="container flex justify-between"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="flex items-center gap-4 lg:gap-8 flex-1 lg:flex-initial"
                variants={staggerChildren}
              >
                <motion.h1 className="text-2xl lg:text-3xl font-bold text-[#ff9500] shrink-0" variants={fadeInUp}>
                  <Link href="/">oda</Link>
                </motion.h1>

                <motion.div className="relative hidden md:block md:w-[300px] lg:w-[450px]" variants={fadeInUp}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={'S\u00f8k'}
                    className="w-full pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-full"
                  />
                </motion.div>
              </motion.div>

              <motion.div className="flex items-center gap-2 lg:gap-3" variants={staggerChildren}>
                <motion.button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Toggle theme"
                  variants={scaleIn}
                  whileHover={{ rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-foreground" />
                  ) : (
                    <Moon className="h-5 w-5 text-foreground" />
                  )}
                </motion.button>

                <motion.div variants={fadeInUp}>
                  <Button
                    onClick={() => setCartOpen(true)}
                    variant="outline"
                    className="bg-transparent flex items-center gap-2 px-3 lg:px-5 py-2 border border-border rounded-full text-foreground"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm hidden sm:inline">
                      {cart?.totalAmount ? `kr ${cart.totalAmount.toFixed(2)}` : 'kr 0,00'}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="bg-secondarybg/95 backdrop-blur-sm border-b border-border hidden md:flex items-center justify-center py-2 px-5 gap-4"
            variants={fadeInDown}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="container flex justify-between">
              <motion.div
                className="flex items-center gap-3 lg:gap-6 overflow-hidden"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {NAV_ITEMS.map((item) => {
                  const button = (
                    <motion.button
                      className="flex items-center gap-2 text-foreground text-sm hover:text-muted-foreground whitespace-nowrap"
                      variants={fadeInUp}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{item.label}</span>
                      {item.hasCaret ? <ChevronDown className="h-4 w-4 hidden sm:inline" /> : null}
                    </motion.button>
                  )

                  if (item.label === 'Kategorier') {
                    return <CategoriesPopover key={item.label} trigger={button} />
                  }

                  return cloneElement(button, { key: item.label })
                })}
              </motion.div>

              <motion.div
                className="flex items-center gap-2 lg:gap-3"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {user ? (
                  <>
                    <motion.span
                      className="text-foreground text-sm font-medium"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      Hei{greetingName ? ` ${greetingName}!` : '!'}
                    </motion.span>
                    <motion.div variants={fadeInUp}>
                      <Link href="/profile" aria-label="Gå til profilen">
                        <Button variant="outline" className="flex items-center gap-2 text-sm">
                          <CircleUserRound className="h-4 w-4" />
                          <span className="hidden sm:inline">Profil</span>
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.button
                      className="text-foreground text-sm hover:text-muted-foreground hidden md:inline"
                      variants={fadeInUp}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href="/login">Logg inn</Link>
                    </motion.button>
                    <motion.div variants={fadeInUp}>
                      <Link href="/register">
                        <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black font-medium rounded-md text-sm px-3 py-0 h-7">
                          <span className="hidden sm:inline">Opprett konto</span>
                          <span className="sm:hidden">Opprett</span>
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile Menu Sheet */}
      <MobileMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />

      {/* Cart Drawer */}
      <Drawer open={cartOpen} onOpenChange={setCartOpen} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Handlekurv</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4 overflow-y-auto">
            {cart && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{item.product?.name ?? `Produkt #${item.productId}`}</div>
                    <div className="text-muted-foreground">
                      {item.quantity} x {item.unitPrice ?? 0} {item.currency}
                    </div>
                  </div>
                  <div className="text-sm">{(((item.unitPrice ?? 0) * item.quantity) as number).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Ingen varer i handlekurven.</p>
            )}
          </div>
          <DrawerFooter>
            <div className="flex items-center justify-between text-sm">
              <span>Sum</span>
              <span className="font-medium">{cart?.totalAmount ? `kr ${cart.totalAmount.toFixed(2)}` : 'kr 0,00'}</span>
            </div>
            <Button className="bg-[#ff9500] hover:bg-[#e68600] text-black">Gå til kassen</Button>
            <DrawerClose asChild>
              <Button variant="outline">Lukk</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
