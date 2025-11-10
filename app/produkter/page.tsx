'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SerializedCategory } from '@/lib/serializers'

export default function ProductsPage() {
  const [categories, setCategories] = useState<SerializedCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/categories?includeProducts=true&productsLimit=5&rootOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          // Filter only categories with products
          const categoriesWithProducts = data.data.filter((cat: SerializedCategory) => (cat.productCount ?? 0) > 0)
          setCategories(categoriesWithProducts)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err)
        setError('Kunne ikke laste kategorier')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Handle etter kategori</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Handle etter kategori</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

function CategoryCard({ category }: { category: SerializedCategory }) {
  // Get product images for preview (up to 5)
  const productImages =
    category.products
      ?.filter((link) => link.product?.images && link.product.images.length > 0)
      .slice(0, 5)
      .map((link) => {
        const firstImage = link.product?.images?.[0]
        return firstImage?.thumbnail?.url || firstImage?.large?.url
      })
      .filter((url): url is string => !!url) || []

  return (
    <Link href={`/kategorier/${category.slug}`}>
      <Card className="group relative h-full p-4 bg-secondary/50 hover:bg-secondary/70 transition-all cursor-pointer border-border/60 hover:border-border hover:shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          {/* Category Title */}
          <div className="flex items-start justify-between mb-2 min-w-0">
            <h3 className="font-semibold text-sm md:text-base leading-tight pr-2 flex-1 truncate">{category.name}</h3>
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
          </div>

          {/* Product Count */}
          <p className="text-xs md:text-sm text-muted-foreground mb-3 shrink-0">
            {category.productCount ?? 0} {category.productCount === 1 ? 'vare' : 'varer'}
          </p>

          {/* Product Images Preview */}
          <div className="mt-auto overflow-hidden">
            {productImages.length > 0 ? (
              <div className="flex gap-1.5 md:gap-2 w-full">
                {productImages.map((imageUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden bg-background/50 border border-border/30 shrink-0"
                  >
                    <Image
                      src={imageUrl}
                      alt={`${category.name} product ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
                {/* Fill remaining slots if less than 5 images */}
                {productImages.length < 5 &&
                  Array.from({ length: 5 - productImages.length }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="w-10 h-10 md:w-12 md:h-12 rounded bg-background/30 border border-border/20 shrink-0"
                    />
                  ))}
              </div>
            ) : (
              <div className="flex gap-1.5 md:gap-2 w-full">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 md:w-12 md:h-12 rounded bg-background/30 border border-border/20 shrink-0"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
