'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Cart {
  id: string
  status: string
  totalAmount: number
  userId: string | null
  user: { email: string; name: string | null } | null
  createdAt: string
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCarts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/carts?take=50')
      const data = await res.json()
      setCarts(data.data || [])
    } catch (err) {
      console.error('Failed to fetch carts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cart?')) return
    try {
      const res = await fetch(`/api/admin/carts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCarts()
      } else {
        alert('Failed to delete cart')
      }
    } catch (err) {
      console.error('Failed to delete cart:', err)
      alert('Failed to delete cart')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Carts</h1>
        <p className="text-muted-foreground">View and manage shopping carts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Carts</CardTitle>
          <CardDescription>{carts.length} carts found</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No carts found
                    </TableCell>
                  </TableRow>
                ) : (
                  carts.map((cart) => (
                    <TableRow key={cart.id}>
                      <TableCell className="font-mono text-sm">{cart.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        {cart.user?.email || cart.user?.name || 'Guest'}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{cart.status.toLowerCase()}</span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        NOK {cart.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(cart.createdAt).toLocaleDateString('no-NO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/carts/${cart.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cart.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

