'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, FolderTree, ShoppingCart, FileText, DollarSign } from 'lucide-react'

interface Stats {
  overview: {
    totalUsers: number
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalCarts: number
  }
  orders: {
    byStatus: Record<string, number>
    byPaymentStatus: Record<string, number>
    recent: Array<{
      id: string
      status: string
      paymentStatus: string
      total: number
      user: { id: string; email: string; name: string | null } | null
      createdAt: string
    }>
  }
  revenue: {
    total: number
    averageOrderValue: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch stats:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-destructive">Failed to load statistics</div>
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Products',
      value: stats.overview.totalProducts,
      icon: Package,
      description: 'Products in catalog',
    },
    {
      title: 'Total Categories',
      value: stats.overview.totalCategories,
      icon: FolderTree,
      description: 'Product categories',
    },
    {
      title: 'Total Orders',
      value: stats.overview.totalOrders,
      icon: FileText,
      description: 'All orders',
    },
    {
      title: 'Total Carts',
      value: stats.overview.totalCarts,
      icon: ShoppingCart,
      description: 'Shopping carts',
    },
    {
      title: 'Total Revenue',
      value: `NOK ${stats.revenue.total.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: `Avg: NOK ${stats.revenue.averageOrderValue.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store statistics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{status.toLowerCase()}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Payment Status</CardTitle>
            <CardDescription>Distribution of orders by payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.orders.byPaymentStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{status.toLowerCase()}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.orders.recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            ) : (
              stats.orders.recent.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{order.user?.email || order.user?.name || 'Guest'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('no-NO')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      NOK {order.total.toLocaleString('no-NO', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.status.toLowerCase()} • {order.paymentStatus.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
