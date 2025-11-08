'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DiscountSource, PromotionDisplayStyle } from '@prisma/client'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    brand: '',
    brandId: '',
    name: '',
    nameExtra: '',
    frontUrl: '',
    absoluteUrl: '',
    grossPrice: '',
    grossUnitPrice: '',
    unitPriceQuantityAbbreviation: '',
    unitPriceQuantityName: '',
    currency: 'NOK',
    isAvailable: true,
    availabilityCode: 'available',
    availabilityDescription: '',
    availabilityDescriptionShort: '',
    primaryCategoryId: '',
    categoryIds: [] as string[],
    images: [] as Array<{
      variant: string
      largeUrl: string
      largeWidth: string
      largeHeight: string
      thumbnailUrl: string
      thumbnailWidth: string
      thumbnailHeight: string
    }>,
    classifiers: [] as Array<{
      name: string
      imageUrl: string
      isImportant: boolean
      description: string
    }>,
    promotions: [] as Array<{
      title: string
      descriptionShort: string
      accessibilityText: string
      displayStyle: PromotionDisplayStyle
      isPrimary: boolean
    }>,
    discount: null as {
      isDiscounted: boolean
      source: DiscountSource
      undiscountedGrossPrice: string
      undiscountedGrossUnitPrice: string
      descriptionShort: string
      maximumQuantity: string
      remainingQuantity: string
      activeUntil: string
      hasRelatedDiscountProducts: boolean
      isSilent: boolean
    } | null,
  })

  useEffect(() => {
    fetch('/api/admin/categories?take=100')
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        brand: formData.brand || undefined,
        brandId: formData.brandId ? parseInt(formData.brandId) : undefined,
        nameExtra: formData.nameExtra || undefined,
        grossPrice: parseFloat(formData.grossPrice),
        grossUnitPrice: parseFloat(formData.grossUnitPrice),
        unitPriceQuantityAbbreviation: formData.unitPriceQuantityAbbreviation || undefined,
        unitPriceQuantityName: formData.unitPriceQuantityName || undefined,
        availabilityDescription: formData.availabilityDescription || undefined,
        availabilityDescriptionShort: formData.availabilityDescriptionShort || undefined,
        primaryCategoryId: formData.primaryCategoryId || undefined,
        categoryIds: formData.categoryIds.length ? formData.categoryIds : undefined,
        images: formData.images.length
          ? formData.images.map((img) => ({
              variant: img.variant || undefined,
              largeUrl: img.largeUrl,
              largeWidth: img.largeWidth ? parseInt(img.largeWidth) : null,
              largeHeight: img.largeHeight ? parseInt(img.largeHeight) : null,
              thumbnailUrl: img.thumbnailUrl || undefined,
              thumbnailWidth: img.thumbnailWidth ? parseInt(img.thumbnailWidth) : null,
              thumbnailHeight: img.thumbnailHeight ? parseInt(img.thumbnailHeight) : null,
            }))
          : undefined,
        classifiers: formData.classifiers.length
          ? formData.classifiers.map((c) => ({
              name: c.name,
              imageUrl: c.imageUrl || undefined,
              isImportant: c.isImportant || false,
              description: c.description || undefined,
            }))
          : undefined,
        promotions: formData.promotions.length
          ? formData.promotions.map((p) => ({
              title: p.title,
              descriptionShort: p.descriptionShort || null,
              accessibilityText: p.accessibilityText || null,
              displayStyle: p.displayStyle,
              isPrimary: p.isPrimary || false,
            }))
          : undefined,
        discount: formData.discount
          ? {
              isDiscounted: formData.discount.isDiscounted,
              source: formData.discount.source,
              undiscountedGrossPrice: formData.discount.undiscountedGrossPrice
                ? parseFloat(formData.discount.undiscountedGrossPrice)
                : null,
              undiscountedGrossUnitPrice: formData.discount.undiscountedGrossUnitPrice
                ? parseFloat(formData.discount.undiscountedGrossUnitPrice)
                : null,
              descriptionShort: formData.discount.descriptionShort || null,
              maximumQuantity: formData.discount.maximumQuantity ? parseInt(formData.discount.maximumQuantity) : null,
              remainingQuantity: formData.discount.remainingQuantity
                ? parseInt(formData.discount.remainingQuantity)
                : null,
              activeUntil: formData.discount.activeUntil || null,
              hasRelatedDiscountProducts: formData.discount.hasRelatedDiscountProducts || false,
              isSilent: formData.discount.isSilent || false,
            }
          : undefined,
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/admin/products/${data.data.id}`)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create product')
      }
    } catch (err) {
      console.error('Failed to create product:', err)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Product</h1>
          <p className="text-muted-foreground">Create a new product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product name and identification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Name Extra</label>
              <Input
                value={formData.nameExtra}
                onChange={(e) => setFormData({ ...formData, nameExtra: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Brand ID</label>
              <Input
                type="number"
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Gross Price *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.grossPrice}
                onChange={(e) => setFormData({ ...formData, grossPrice: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gross Unit Price *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.grossUnitPrice}
                onChange={(e) => setFormData({ ...formData, grossUnitPrice: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                maxLength={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Front URL *</label>
              <Input
                type="url"
                value={formData.frontUrl}
                onChange={(e) => setFormData({ ...formData, frontUrl: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Absolute URL *</label>
              <Input
                value={formData.absoluteUrl}
                onChange={(e) => setFormData({ ...formData, absoluteUrl: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Category</label>
              <Select
                value={formData.primaryCategoryId || undefined}
                onValueChange={(value) =>
                  setFormData({ ...formData, primaryCategoryId: value === 'none' ? '' : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Categories</label>
              <Select
                onValueChange={(value) => {
                  if (!formData.categoryIds.includes(value)) {
                    setFormData({
                      ...formData,
                      categoryIds: [...formData.categoryIds, value],
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => !formData.categoryIds.includes(cat.id))
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.categoryIds.map((catId) => {
                  const cat = categories.find((c) => c.id === catId)
                  return (
                    <div key={catId} className="flex items-center gap-2 rounded bg-secondary px-2 py-1 text-sm">
                      {cat?.name}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            categoryIds: formData.categoryIds.filter((id) => id !== catId),
                          })
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium">
                Available
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">Availability Code</label>
              <Input
                value={formData.availabilityCode}
                onChange={(e) => setFormData({ ...formData, availabilityCode: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
