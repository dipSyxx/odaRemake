'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DiscountSource, PromotionDisplayStyle } from '@prisma/client'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    brand: '',
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
    metadata: '',
    isExemptFromThirdPartyMarketing: false,
    bonusInfo: '',
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

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.data)
          const p = data.data
          setFormData({
            fullName: p.fullName || '',
            brand: p.brand || '',
            name: p.name || '',
            nameExtra: p.nameExtra || '',
            frontUrl: p.frontUrl || '',
            absoluteUrl: p.absoluteUrl || '',
            grossPrice: p.grossPrice?.toString() || '',
            grossUnitPrice: p.grossUnitPrice?.toString() || '',
            unitPriceQuantityAbbreviation: p.unitPriceQuantityAbbreviation || '',
            unitPriceQuantityName: p.unitPriceQuantityName || '',
            currency: p.currency || 'NOK',
            isAvailable: p.availability?.isAvailable ?? true,
            availabilityCode: p.availability?.code || 'available',
            availabilityDescription: p.availability?.description || '',
            availabilityDescriptionShort: p.availability?.descriptionShort || '',
            metadata: p.metadata ? JSON.stringify(p.metadata, null, 2) : '',
            isExemptFromThirdPartyMarketing: p.isExemptFromThirdPartyMarketing || false,
            bonusInfo: p.bonusInfo ? JSON.stringify(p.bonusInfo, null, 2) : '',
            primaryCategoryId: p.primaryCategoryId || '',
            categoryIds: p.categories?.map((c: any) => c.categoryId) || [],
            images:
              p.images?.map((img: any) => ({
                variant: img.variant || '',
                largeUrl: img.large?.url || '',
                largeWidth: img.large?.width?.toString() || '',
                largeHeight: img.large?.height?.toString() || '',
                thumbnailUrl: img.thumbnail?.url || '',
                thumbnailWidth: img.thumbnail?.width?.toString() || '',
                thumbnailHeight: img.thumbnail?.height?.toString() || '',
              })) || [],
            classifiers:
              p.classifiers?.map((c: any) => ({
                name: c.name || '',
                imageUrl: c.imageUrl || '',
                isImportant: c.isImportant || false,
                description: c.description || '',
              })) || [],
            promotions:
              p.promotions?.map((p: any) => ({
                title: p.title || '',
                descriptionShort: p.descriptionShort || '',
                accessibilityText: p.accessibilityText || '',
                displayStyle: p.displayStyle || PromotionDisplayStyle.UNKNOWN,
                isPrimary: p.isPrimary || false,
              })) || [],
            discount: p.discount
              ? {
                  isDiscounted: p.discount.isDiscounted || false,
                  source: p.discount.source || DiscountSource.UNKNOWN,
                  undiscountedGrossPrice: p.discount.undiscountedGrossPrice?.toString() || '',
                  undiscountedGrossUnitPrice: p.discount.undiscountedGrossUnitPrice?.toString() || '',
                  descriptionShort: p.discount.descriptionShort || '',
                  maximumQuantity: p.discount.maximumQuantity?.toString() || '',
                  remainingQuantity: p.discount.remainingQuantity?.toString() || '',
                  activeUntil: p.discount.activeUntil
                    ? new Date(p.discount.activeUntil).toISOString().slice(0, 16)
                    : '',
                  hasRelatedDiscountProducts: p.discount.hasRelatedDiscountProducts || false,
                  isSilent: p.discount.isSilent || false,
                }
              : null,
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err)
          setLoading(false)
        })
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        fullName: formData.fullName,
        brand: formData.brand || undefined,
        name: formData.name,
        nameExtra: formData.nameExtra || undefined,
        frontUrl: formData.frontUrl,
        absoluteUrl: formData.absoluteUrl,
        grossPrice: parseFloat(formData.grossPrice),
        grossUnitPrice: parseFloat(formData.grossUnitPrice),
        unitPriceQuantityAbbreviation: formData.unitPriceQuantityAbbreviation || undefined,
        unitPriceQuantityName: formData.unitPriceQuantityName || undefined,
        currency: formData.currency,
        isAvailable: formData.isAvailable,
        availabilityCode: formData.availabilityCode || undefined,
        availabilityDescription: formData.availabilityDescription || undefined,
        availabilityDescriptionShort: formData.availabilityDescriptionShort || undefined,
        metadata: formData.metadata
          ? (() => {
              try {
                return JSON.parse(formData.metadata)
              } catch {
                return formData.metadata
              }
            })()
          : undefined,
        isExemptFromThirdPartyMarketing: formData.isExemptFromThirdPartyMarketing || undefined,
        bonusInfo: formData.bonusInfo
          ? (() => {
              try {
                return JSON.parse(formData.bonusInfo)
              } catch {
                return formData.bonusInfo
              }
            })()
          : undefined,
        primaryCategoryId: formData.primaryCategoryId || undefined,
        categoryIds: formData.categoryIds.length ? formData.categoryIds : undefined,
        images: formData.images.length
          ? formData.images.map((img) => ({
              variant: img.variant || undefined,
              largeUrl: img.largeUrl,
              largeWidth: img.largeWidth ? parseInt(img.largeWidth) : null,
              largeHeight: img.largeHeight ? parseInt(img.largeHeight) : null,
              thumbnailUrl: img.thumbnailUrl?.trim() || undefined,
              thumbnailWidth: img.thumbnailWidth ? parseInt(img.thumbnailWidth) : null,
              thumbnailHeight: img.thumbnailHeight ? parseInt(img.thumbnailHeight) : null,
            }))
          : undefined,
        classifiers: formData.classifiers.length
          ? formData.classifiers.map((c) => ({
              name: c.name,
              imageUrl: c.imageUrl?.trim() || undefined,
              isImportant: c.isImportant || false,
              description: c.description?.trim() || undefined,
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
              activeUntil: formData.discount.activeUntil ? new Date(formData.discount.activeUntil).toISOString() : null,
              hasRelatedDiscountProducts: formData.discount.hasRelatedDiscountProducts || false,
              isSilent: formData.discount.isSilent || false,
            }
          : null,
      }

      console.log('Updating product with ID:', id)
      console.log('Payload:', payload)

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        const errorData = await res.json()
        console.error('Update error:', errorData)
        alert(errorData.error || 'Failed to update product')
      }
    } catch (err) {
      console.error('Failed to update product:', err)
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div className="text-center text-destructive">Product not found</div>
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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">{product.name}</p>
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
              <label className="text-sm font-medium">Unit Price Quantity Abbreviation</label>
              <Input
                value={formData.unitPriceQuantityAbbreviation}
                onChange={(e) => setFormData({ ...formData, unitPriceQuantityAbbreviation: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit Price Quantity Name</label>
              <Input
                value={formData.unitPriceQuantityName}
                onChange={(e) => setFormData({ ...formData, unitPriceQuantityName: e.target.value })}
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
            <div>
              <label className="text-sm font-medium">Availability Description</label>
              <Textarea
                value={formData.availabilityDescription}
                onChange={(e) => setFormData({ ...formData, availabilityDescription: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Availability Description Short</label>
              <Input
                value={formData.availabilityDescriptionShort}
                onChange={(e) => setFormData({ ...formData, availabilityDescriptionShort: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isExemptFromThirdPartyMarketing"
                checked={formData.isExemptFromThirdPartyMarketing}
                onChange={(e) => setFormData({ ...formData, isExemptFromThirdPartyMarketing: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isExemptFromThirdPartyMarketing" className="text-sm font-medium">
                Exempt From Third Party Marketing
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">Metadata (JSON)</label>
              <Textarea
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder='{"key": "value"}'
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Bonus Info (JSON)</label>
              <Textarea
                value={formData.bonusInfo}
                onChange={(e) => setFormData({ ...formData, bonusInfo: e.target.value })}
                placeholder='{"key": "value"}'
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Images</CardTitle>
              <CardDescription>Product images</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  images: [
                    ...formData.images,
                    {
                      variant: '',
                      largeUrl: '',
                      largeWidth: '',
                      largeHeight: '',
                      thumbnailUrl: '',
                      thumbnailWidth: '',
                      thumbnailHeight: '',
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="rounded border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Image {idx + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Variant</label>
                    <Input
                      value={img.variant}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].variant = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Large URL *</label>
                    <Input
                      type="url"
                      value={img.largeUrl}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].largeUrl = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                      required
                    />
                    {img.largeUrl && (
                      <div className="mt-2">
                        <img
                          src={img.largeUrl}
                          alt={`Large preview ${idx + 1}`}
                          className="max-w-full h-32 object-contain border rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Large Width</label>
                    <Input
                      type="number"
                      value={img.largeWidth}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].largeWidth = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Large Height</label>
                    <Input
                      type="number"
                      value={img.largeHeight}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].largeHeight = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Thumbnail URL</label>
                    <Input
                      type="url"
                      value={img.thumbnailUrl}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].thumbnailUrl = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                    {img.thumbnailUrl && (
                      <div className="mt-2">
                        <img
                          src={img.thumbnailUrl}
                          alt={`Thumbnail preview ${idx + 1}`}
                          className="max-w-full h-24 object-contain border rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Thumbnail Width</label>
                    <Input
                      type="number"
                      value={img.thumbnailWidth}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].thumbnailWidth = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Thumbnail Height</label>
                    <Input
                      type="number"
                      value={img.thumbnailHeight}
                      onChange={(e) => {
                        const newImages = [...formData.images]
                        newImages[idx].thumbnailHeight = e.target.value
                        setFormData({ ...formData, images: newImages })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.images.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No images added</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Classifiers</CardTitle>
              <CardDescription>Product classifiers</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  classifiers: [
                    ...formData.classifiers,
                    {
                      name: '',
                      imageUrl: '',
                      isImportant: false,
                      description: '',
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Classifier
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.classifiers.map((classifier, idx) => (
              <div key={idx} className="rounded border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Classifier {idx + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        classifiers: formData.classifiers.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={classifier.name}
                      onChange={(e) => {
                        const newClassifiers = [...formData.classifiers]
                        newClassifiers[idx].name = e.target.value
                        setFormData({ ...formData, classifiers: newClassifiers })
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      type="url"
                      value={classifier.imageUrl}
                      onChange={(e) => {
                        const newClassifiers = [...formData.classifiers]
                        newClassifiers[idx].imageUrl = e.target.value
                        setFormData({ ...formData, classifiers: newClassifiers })
                      }}
                    />
                    {classifier.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={classifier.imageUrl}
                          alt={`Classifier preview ${idx + 1}`}
                          className="max-w-full h-24 object-contain border rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={classifier.isImportant}
                      onChange={(e) => {
                        const newClassifiers = [...formData.classifiers]
                        newClassifiers[idx].isImportant = e.target.checked
                        setFormData({ ...formData, classifiers: newClassifiers })
                      }}
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Is Important</label>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={classifier.description}
                      onChange={(e) => {
                        const newClassifiers = [...formData.classifiers]
                        newClassifiers[idx].description = e.target.value
                        setFormData({ ...formData, classifiers: newClassifiers })
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.classifiers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No classifiers added</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>Product promotions</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFormData({
                  ...formData,
                  promotions: [
                    ...formData.promotions,
                    {
                      title: '',
                      descriptionShort: '',
                      accessibilityText: '',
                      displayStyle: PromotionDisplayStyle.UNKNOWN,
                      isPrimary: false,
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.promotions.map((promotion, idx) => (
              <div key={idx} className="rounded border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Promotion {idx + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        promotions: formData.promotions.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={promotion.title}
                      onChange={(e) => {
                        const newPromotions = [...formData.promotions]
                        newPromotions[idx].title = e.target.value
                        setFormData({ ...formData, promotions: newPromotions })
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Style</label>
                    <Select
                      value={promotion.displayStyle}
                      onValueChange={(value) => {
                        const newPromotions = [...formData.promotions]
                        newPromotions[idx].displayStyle = value as PromotionDisplayStyle
                        setFormData({ ...formData, promotions: newPromotions })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PromotionDisplayStyle).map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description Short</label>
                    <Input
                      value={promotion.descriptionShort}
                      onChange={(e) => {
                        const newPromotions = [...formData.promotions]
                        newPromotions[idx].descriptionShort = e.target.value
                        setFormData({ ...formData, promotions: newPromotions })
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Accessibility Text</label>
                    <Input
                      value={promotion.accessibilityText}
                      onChange={(e) => {
                        const newPromotions = [...formData.promotions]
                        newPromotions[idx].accessibilityText = e.target.value
                        setFormData({ ...formData, promotions: newPromotions })
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={promotion.isPrimary}
                      onChange={(e) => {
                        const newPromotions = [...formData.promotions]
                        newPromotions[idx].isPrimary = e.target.checked
                        setFormData({ ...formData, promotions: newPromotions })
                      }}
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Is Primary</label>
                  </div>
                </div>
              </div>
            ))}
            {formData.promotions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No promotions added</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Discount</CardTitle>
              <CardDescription>Product discount information</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (formData.discount) {
                  setFormData({ ...formData, discount: null })
                } else {
                  setFormData({
                    ...formData,
                    discount: {
                      isDiscounted: false,
                      source: DiscountSource.UNKNOWN,
                      undiscountedGrossPrice: '',
                      undiscountedGrossUnitPrice: '',
                      descriptionShort: '',
                      maximumQuantity: '',
                      remainingQuantity: '',
                      activeUntil: '',
                      hasRelatedDiscountProducts: false,
                      isSilent: false,
                    },
                  })
                }
              }}
            >
              {formData.discount ? 'Remove Discount' : 'Add Discount'}
            </Button>
          </CardHeader>
          <CardContent>
            {formData.discount ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.discount.isDiscounted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: formData.discount ? { ...formData.discount, isDiscounted: e.target.checked } : null,
                      })
                    }
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Is Discounted</label>
                </div>
                <div>
                  <label className="text-sm font-medium">Source</label>
                  <Select
                    value={formData.discount.source}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        discount: formData.discount ? { ...formData.discount, source: value as DiscountSource } : null,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DiscountSource).map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Undiscounted Gross Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.discount.undiscountedGrossPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, undiscountedGrossPrice: e.target.value }
                            : null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Undiscounted Gross Unit Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.discount.undiscountedGrossUnitPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, undiscountedGrossUnitPrice: e.target.value }
                            : null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Maximum Quantity</label>
                    <Input
                      type="number"
                      value={formData.discount.maximumQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, maximumQuantity: e.target.value }
                            : null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Remaining Quantity</label>
                    <Input
                      type="number"
                      value={formData.discount.remainingQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, remainingQuantity: e.target.value }
                            : null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Active Until</label>
                    <Input
                      type="datetime-local"
                      value={formData.discount.activeUntil}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount ? { ...formData.discount, activeUntil: e.target.value } : null,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description Short</label>
                    <Input
                      value={formData.discount.descriptionShort}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, descriptionShort: e.target.value }
                            : null,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.discount.hasRelatedDiscountProducts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount
                            ? { ...formData.discount, hasRelatedDiscountProducts: e.target.checked }
                            : null,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Has Related Discount Products</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.discount.isSilent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: formData.discount ? { ...formData.discount, isSilent: e.target.checked } : null,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">Is Silent</label>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No discount configured</p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
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
