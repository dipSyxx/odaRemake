'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { CartStatus } from '@prisma/client'

export default function CartDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [cart, setCart] = useState<any>(null)
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    status: 'DRAFT' as CartStatus,
  })
  const [itemFormData, setItemFormData] = useState({
    productId: '',
    quantity: '1',
    unitPrice: '',
  })

  useEffect(() => {
    if (id) {
      fetchCart()
      fetch('/api/admin/products?take=100')
        .then((res) => res.json())
        .then((data) => setProducts(data.data || []))
        .catch(console.error)
    }
  }, [id])

  const fetchCart = async () => {
    try {
      const res = await fetch(`/api/admin/carts/${id}`)
      const data = await res.json()
      setCart(data.data)
      setFormData({
        status: data.data.status,
      })
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch cart:', err)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/admin/carts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        setCart(data.data)
        alert('Cart updated successfully')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update cart')
      }
    } catch (err) {
      console.error('Failed to update cart:', err)
      alert('Failed to update cart')
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/carts/${id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: itemFormData.productId,
          quantity: parseInt(itemFormData.quantity),
          unitPrice: itemFormData.unitPrice ? parseFloat(itemFormData.unitPrice) : undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCart(data.data)
        setIsAddItemDialogOpen(false)
        setItemFormData({ productId: '', quantity: '1', unitPrice: '' })
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add item')
      }
    } catch (err) {
      console.error('Failed to add item:', err)
      alert('Failed to add item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return
    try {
      const res = await fetch(`/api/admin/carts/${id}/items/${itemId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCart()
      } else {
        alert('Failed to remove item')
      }
    } catch (err) {
      console.error('Failed to remove item:', err)
      alert('Failed to remove item')
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!cart) {
    return <div className="text-center text-destructive">Cart not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/carts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Cart Details</h1>
          <p className="text-muted-foreground">Cart ID: {cart.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cart Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">User</label>
              <p className="text-sm">
                {cart.user?.email || cart.user?.name || 'Guest'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total</label>
              <p className="text-lg font-semibold">NOK {cart.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm">
                {new Date(cart.createdAt).toLocaleString('no-NO')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as CartStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CartStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update Cart'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cart Items</CardTitle>
            <CardDescription>{cart.items?.length || 0} items</CardDescription>
          </div>
          <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item to Cart</DialogTitle>
                <DialogDescription>Add a product to this cart</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product *</label>
                  <Select
                    value={itemFormData.productId}
                    onValueChange={(value) =>
                      setItemFormData({ ...itemFormData, productId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity *</label>
                  <Input
                    type="number"
                    min="1"
                    value={itemFormData.quantity}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Unit Price (optional)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemFormData.unitPrice}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, unitPrice: e.target.value })
                    }
                    placeholder="Leave empty to use product price"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No items
                  </TableCell>
                </TableRow>
              ) : (
                cart.items?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product?.name || item.productId}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>NOK {item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      NOK {(item.unitPrice * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

