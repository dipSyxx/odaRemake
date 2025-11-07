"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  SerializedCategory,
  SerializedProduct,
} from "@/lib/serializers";

export type HighlightedProduct = SerializedProduct & {
  categoryName: string;
};

type CategoryMenuState = {
  categories: SerializedCategory[];
  highlightedProducts: HighlightedProduct[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  refetch: () => void;
};

const CATEGORY_QUERY = new URLSearchParams({
  take: "40",
  includeChildren: "true",
  includeProducts: "true",
  productsLimit: "6",
  rootOnly: "true",
});

export function useCategoryMenu(enabled: boolean): CategoryMenuState {
  const [categories, setCategories] = useState<SerializedCategory[]>([]);
  const [highlightedProducts, setHighlightedProducts] = useState<
    HighlightedProduct[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    fetch(`/api/categories?${CATEGORY_QUERY.toString()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Kunne ikke laste kategorier.");
        }
        return res.json();
      })
      .then((json) => {
        const incoming = (json?.data ?? []) as SerializedCategory[];
        setCategories(incoming);
        const products = collectHighlightedProducts(incoming);
        setHighlightedProducts(products);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Feil ved henting av kategorier:", err);
        setError("Kunne ikke laste kategorier akkurat nå.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setHasFetched(true);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!enabled || hasFetched || loading) return;
    const abort = fetchData();
    return () => abort?.();
  }, [enabled, hasFetched, loading, fetchData]);

  const refetch = useCallback(() => {
    setError(null);
    setHasFetched(false);
  }, []);

  return useMemo(
    () => ({
      categories,
      highlightedProducts,
      loading,
      error,
      hasFetched,
      refetch,
    }),
    [
      categories,
      error,
      hasFetched,
      highlightedProducts,
      loading,
      refetch,
    ],
  );
}

function collectHighlightedProducts(
  categories: SerializedCategory[],
): HighlightedProduct[] {
  const seen = new Set<string>();
  const products: HighlightedProduct[] = [];

  for (const category of categories) {
    for (const link of category.products ?? []) {
      if (!link.product) continue;
      if (seen.has(link.product.id)) continue;
      seen.add(link.product.id);
      products.push({
        ...link.product,
        categoryName: category.name,
      });
      if (products.length >= 12) {
        return products;
      }
    }
  }

  return products;
}
