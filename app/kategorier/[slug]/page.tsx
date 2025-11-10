"use client";

import { use as usePromise, useCallback, useEffect, useMemo, useState } from "react";
import type { SerializedCategory, SerializedProduct } from "@/lib/serializers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Loader2, ShoppingCart } from "lucide-react";
import { useCartActions } from "@/hooks/use-cart-actions";

const PAGE_SIZE = 24;

type ProductResponse = {
  data: SerializedProduct[];
  meta: {
    count: number;
    skip: number;
    take: number;
  };
};

type CategoryResponse = {
  data: SerializedCategory;
};

const sortOptions = [
  { value: "latest", label: "Nyeste" },
  { value: "priceAsc", label: "Pris: lav-høy" },
  { value: "priceDesc", label: "Pris: høy-lav" },
  { value: "name", label: "Alfabetisk" },
];

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = usePromise(params);
  const [category, setCategory] = useState<SerializedCategory | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ count: number; skip: number; take: number }>(
    { count: 0, skip: 0, take: PAGE_SIZE },
  );

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { addItem, action } = useCartActions();

  useEffect(() => {
    setPage(1);
  }, [slug]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    let active = true;
    setCategoryLoading(true);
    setCategoryError(null);
    setCategory(null);

    const controller = new AbortController();
    fetch(
      `/api/categories/slug/${slug}?includeChildren=true&includeParent=true`,
      { cache: "no-store", signal: controller.signal },
    )
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.error ?? "Kunne ikke laste kategori.");
        }
        return res.json() as Promise<CategoryResponse>;
      })
      .then((json) => {
        if (!active) return;
        setCategory(json.data);
      })
      .catch((error) => {
        if (!active) return;
        setCategoryError(error.message ?? "Kunne ikke laste kategori.");
      })
      .finally(() => {
        if (!active) return;
        setCategoryLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [slug]);

  const fetchProducts = useCallback(
    (categoryId: string) => {
      const query = new URLSearchParams({
        categoryId,
        take: PAGE_SIZE.toString(),
        skip: ((page - 1) * PAGE_SIZE).toString(),
        sort,
      });
      if (debouncedSearch) {
        query.set("search", debouncedSearch);
      }

      const controller = new AbortController();
      setProductsLoading(true);
      setProductsError(null);

      fetch(`/api/products?${query.toString()}`, {
        cache: "no-store",
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const payload = await res.json().catch(() => null);
            throw new Error(payload?.error ?? "Kunne ikke laste produkter.");
          }
          return res.json() as Promise<ProductResponse>;
        })
        .then((json) => {
          setProducts(json.data);
          setMeta(json.meta);
        })
        .catch((error) => {
          if (controller.signal.aborted) return;
          setProductsError(error.message ?? "Kunne ikke laste produkter.");
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setProductsLoading(false);
          }
        });

      return () => controller.abort();
    },
    [debouncedSearch, page, sort],
  );

  useEffect(() => {
    if (!category?.id) return;
    const abort = fetchProducts(category.id);
    return () => {
      abort?.();
    };
  }, [category?.id, fetchProducts]);

  const totalPages = useMemo(() => {
    if (!meta.count) return 1;
    return Math.max(1, Math.ceil(meta.count / meta.take));
  }, [meta.count, meta.take]);

  const showingRange = useMemo(() => {
    if (!meta.count) return "0 produkter";
    const start = meta.skip + 1;
    const end = Math.min(meta.skip + meta.take, meta.count);
    return `${start}-${end} av ${meta.count}`;
  }, [meta]);

  const handleAddToCart = useCallback(
    async (product: SerializedProduct) => {
      try {
        await addItem(product, 1);
      } catch (error) {
        console.error("add-to-cart error", error);
      }
    },
    [addItem],
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link href="/produkter" className="inline-flex items-center gap-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Tilbake til kategorier
        </Link>
      </div>

      {categoryLoading ? (
        <CategorySkeleton />
      ) : categoryError ? (
        <ErrorState message={categoryError} retryPath="/produkter" />
      ) : category ? (
        <CategoryHeader category={category} showingRange={showingRange} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-[1fr,280px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Søk etter produkter..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="md:max-w-sm"
            />
            <Select value={sort} onValueChange={(value) => setSort(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sorter" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {productsError ? (
            <ErrorState message={productsError} />
          ) : productsLoading ? (
            <ProductSkeletonGrid />
          ) : products.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <ProductGrid
                products={products}
                onAddToCart={handleAddToCart}
                currentAction={action}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(next) => setPage(next)}
                disabled={productsLoading}
              />
            </>
          )}
        </div>

        <aside className="space-y-6">
          {category?.children && category.children.length > 0 ? (
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold">Underkategorier</p>
                <p className="text-xs text-muted-foreground">
                  Utforsk flere produkter
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.children.map((child) => (
                  <Badge key={child.id} variant="secondary" className="px-3 py-1">
                    <Link href={`/kategorier/${child.slug}`}>{child.name}</Link>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-2">
            <p className="text-sm font-semibold">Tips</p>
            <p className="text-sm text-muted-foreground">
              Klikk på &quot;Legg i handlekurv&quot; for raske kjøp direkte fra kategorien.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CategoryHeader({
  category,
  showingRange,
}: {
  category: SerializedCategory;
  showingRange: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-secondary/40 p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Kategori
        </p>
        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
        {category.description ? (
          <p className="text-muted-foreground max-w-3xl">{category.description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        {category.parent ? (
          <span>
            Del av{" "}
            <Link href={`/kategorier/${category.parent.slug}`} className="font-medium underline">
              {category.parent.name}
            </Link>
          </span>
        ) : null}
        <span>{showingRange}</span>
      </div>
    </div>
  );
}

function ProductGrid({
  products,
  onAddToCart,
  currentAction,
}: {
  products: SerializedProduct[];
  onAddToCart: (product: SerializedProduct) => void;
  currentAction: string | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          currentAction={currentAction}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
  currentAction,
}: {
  product: SerializedProduct;
  onAddToCart: (product: SerializedProduct) => void;
  currentAction: string | null;
}) {
  const image =
    product.images?.[0]?.thumbnail?.url ?? product.images?.[0]?.large?.url ?? null;
  const isAdding = currentAction === `add-${product.id}`;
  const inStock = product.availability?.isAvailable ?? true;

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 flex flex-col gap-4">
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-secondary/30">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="320px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            Ingen bilde
          </div>
        )}
      </div>
      <div className="space-y-2 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.brand ?? "Oda"}
        </p>
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {product.fullName ?? product.name}
        </h3>
        <p className="text-lg font-bold">{formatCurrency(product.grossPrice)}</p>
        <p className="text-xs text-muted-foreground">
          {inStock ? "På lager" : "Midlertidig utsolgt"}
        </p>
      </div>
      <Button
        onClick={() => onAddToCart(product)}
        disabled={!inStock || isAdding}
        className="w-full"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Legger til...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Legg i handlekurv
          </>
        )}
      </Button>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-xl border border-border/40 p-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
  disabled,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
      <span>
        Side {page} av {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1 || disabled}
        >
          Forrige
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || disabled}
        >
          Neste
        </Button>
      </div>
    </div>
  );
}

function ErrorState({ message, retryPath }: { message: string; retryPath?: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
      <p className="text-sm font-semibold text-destructive">{message}</p>
      {retryPath ? (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={retryPath}>Tilbake</Link>
        </Button>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-border/60 p-10 text-center">
      <p className="text-base font-semibold">Ingen produkter å vise</p>
      <p className="text-sm text-muted-foreground">
        Prøv et annet søk eller filtrering.
      </p>
    </div>
  );
}

function formatCurrency(value: number | null | undefined, currency = "NOK") {
  if (value === null || value === undefined) return "Pris ukjent";
  return new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
