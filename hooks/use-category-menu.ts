'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { SerializedCategory, SerializedProduct } from '@/lib/serializers'

export type HighlightedProduct = SerializedProduct & {
  categoryName: string
}

type CategoryMenuState = {
  categories: SerializedCategory[]
  highlightedProducts: HighlightedProduct[]
  loading: boolean
  error: string | null
  hasFetched: boolean
  refetch: () => void
}

const CATEGORY_QUERY = new URLSearchParams({
  take: '50',
  includeChildren: 'false',
  includeProducts: 'true',
  productsLimit: '1',
  rootOnly: 'true',
})

export function useCategoryMenu(enabled: boolean): CategoryMenuState {
  const [categories, setCategories] = useState<SerializedCategory[]>([])
  const [highlightedProducts, setHighlightedProducts] = useState<HighlightedProduct[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState<boolean>(false)
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const fetchData = useCallback(() => {
    // Скасовуємо попередній запит, якщо він є
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setLoading(true)
    setError(null)
    const controller = new AbortController()
    abortControllerRef.current = controller

    fetch(`/api/categories?${CATEGORY_QUERY.toString()}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (res) => {
        if (controller.signal.aborted) return null
        if (!res.ok) {
          throw new Error('Kunne ikke laste kategorier.')
        }
        return res.json()
      })
      .then((json) => {
        if (controller.signal.aborted || !json) return
        const incoming = (json?.data ?? []) as SerializedCategory[]
        console.log('Fetched categories:', incoming.length)
        setCategories(incoming)
        const products = collectHighlightedProducts(incoming)
        setHighlightedProducts(products)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Feil ved henting av kategorier:', err)
        setError('Kunne ikke laste kategorier akkurat nå.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
          setHasFetched(true)
        }
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      })
  }, [])

  useEffect(() => {
    // Завантажуємо дані, коли popover відкривається і дані ще не завантажені
    if (enabled && !hasFetched && !loading) {
      fetchData()
    }
  }, [enabled, hasFetched, loading, fetchData])

  // Cleanup при розмонтуванні компонента
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const refetch = useCallback(() => {
    setError(null)
    setHasFetched(false)
  }, [])

  return useMemo(
    () => ({
      categories,
      highlightedProducts,
      loading,
      error,
      hasFetched,
      refetch,
    }),
    [categories, error, hasFetched, highlightedProducts, loading, refetch],
  )
}

function collectHighlightedProducts(categories: SerializedCategory[]): HighlightedProduct[] {
  const seen = new Set<string>()
  const products: HighlightedProduct[] = []

  for (const category of categories) {
    for (const link of category.products ?? []) {
      if (!link.product) continue
      if (seen.has(link.product.id)) continue
      seen.add(link.product.id)
      products.push({
        ...link.product,
        categoryName: category.name,
      })
      if (products.length >= 12) {
        return products
      }
    }
  }

  return products
}
