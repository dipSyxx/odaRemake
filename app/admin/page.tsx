'use client'

import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  FileText,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react'

type SparkDatum = {
  label: string
  revenue: number
  orders: number
}

type SparkRange = '90d' | '30d' | '7d'

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
  timeline: {
    '90d': SparkDatum[]
    '30d': SparkDatum[]
    '7d': SparkDatum[]
  }
  trends: {
    revenue30d: number
    revenueDelta: number
    averageOrder30d: number
    averageOrderDelta: number
    newCustomers30d: number
    newCustomersDelta: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sparkRange, setSparkRange] = useState<SparkRange>('30d')

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
          <div className="mb-4 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Laster statistikk …</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-destructive">Kunne ikke hente statistikk</div>
  }

  const statCards = [
    {
      title: 'Totale brukere',
      value: stats.overview.totalUsers.toLocaleString('no-NO'),
      icon: Users,
      description: 'Registrerte brukere',
    },
    {
      title: 'Produkter',
      value: stats.overview.totalProducts.toLocaleString('no-NO'),
      icon: Package,
      description: 'Tilgjengelig i katalogen',
    },
    {
      title: 'Kategorier',
      value: stats.overview.totalCategories.toLocaleString('no-NO'),
      icon: FolderTree,
      description: 'Produktgrupper',
    },
    {
      title: 'Ordre totalt',
      value: stats.overview.totalOrders.toLocaleString('no-NO'),
      icon: FileText,
      description: 'Registrerte ordre',
    },
    {
      title: 'Handlekurver',
      value: stats.overview.totalCarts.toLocaleString('no-NO'),
      icon: ShoppingCart,
      description: 'Aktive + kladder',
    },
    {
      title: 'Inntekt',
      value: `NOK ${stats.revenue.total.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: `Snittordre NOK ${stats.revenue.averageOrderValue.toLocaleString('no-NO', {
        minimumFractionDigits: 2,
      })}`,
    },
  ]

  const formatDelta = (delta: number) => {
    const rounded = Number(delta.toFixed(1))
    const sign = rounded > 0 ? '+' : ''
    return `${sign}${rounded}%`
  }

  const trendCards = [
    {
      title: 'Omsetning (30 dager)',
      value: `NOK ${stats.trends.revenue30d.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`,
      delta: formatDelta(stats.trends.revenueDelta),
      trend: stats.trends.revenueDelta >= 0 ? 'up' : 'down',
      desc:
        stats.trends.revenueDelta >= 0
          ? 'Opp fra forrige periode'
          : 'Ned fra forrige periode',
      helper: 'Sammenlignet med foregående 30 dager',
    },
    {
      title: 'Snittordre',
      value: `NOK ${stats.trends.averageOrder30d.toLocaleString('no-NO', { minimumFractionDigits: 2 })}`,
      delta: formatDelta(stats.trends.averageOrderDelta),
      trend: stats.trends.averageOrderDelta >= 0 ? 'up' : 'down',
      desc:
        stats.trends.averageOrderDelta >= 0
          ? 'Stiger mot forrige periode'
          : 'Synker mot forrige periode',
      helper: 'Basert på betalte ordre',
    },
    {
      title: 'Nye kunder (30 dager)',
      value: stats.trends.newCustomers30d.toLocaleString('no-NO'),
      delta: formatDelta(stats.trends.newCustomersDelta),
      trend: stats.trends.newCustomersDelta >= 0 ? 'up' : 'down',
      desc:
        stats.trends.newCustomersDelta >= 0
          ? 'Bedre kundetilgang'
          : 'Lavere kundetilgang',
      helper: 'Foregående 30 dager som referanse',
    },
  ]

  const sparkData = stats.timeline[sparkRange] ?? []
  const recentOrders = stats.orders.recent ?? []

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit gap-2">
          <TrendingUp className="h-3.5 w-3.5" />
          Oversikt
        </Badge>
        <div>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-muted-foreground">
            Sanntidsinnsikt for produkter, brukere, kategorier og ordre.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card/80 backdrop-blur border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <Card className="bg-background/60 border-border/60">
              <CardHeader className="sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Omsetningskurve</CardTitle>
                  <CardDescription>Total salgsverdi for valgt periode.</CardDescription>
                </div>
                <Tabs value={sparkRange} onValueChange={(v) => setSparkRange(v as SparkRange)}>
                  <TabsList>
                    <TabsTrigger value="90d">3 måneder</TabsTrigger>
                    <TabsTrigger value="30d">30 dager</TabsTrigger>
                    <TabsTrigger value="7d">7 dager</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                    <XAxis dataKey="label" stroke="var(--muted-foreground)" tickLine={false} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="var(--muted-foreground)"
                      tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--muted-foreground)"
                      tickFormatter={(val) => `${val} ord`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        borderColor: 'var(--border)',
                        color: 'var(--card-foreground)',
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      fill="url(#revenueGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--secondary-foreground)"
                      fill="var(--secondary)"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {trendCards.map((trend) => (
                <Card key={trend.title} className="bg-card/80 border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm font-medium">
                      {trend.title}
                      <Badge
                        variant={trend.trend === 'down' ? 'destructive' : 'secondary'}
                        className="gap-1"
                      >
                        <Percent className="h-3 w-3" />
                        {trend.delta}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-2xl font-semibold text-card-foreground">
                      {trend.value}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{trend.desc}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">{trend.helper}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Ordre per status</CardTitle>
            <CardDescription>Fordeling på ordrestatus i systemet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-muted-foreground">
                    {status.toLowerCase()}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Betalingsstatus</CardTitle>
            <CardDescription>Registrerte ordre per betalingstilstand.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {Object.entries(stats.orders.byPaymentStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-muted-foreground">
                    {status.toLowerCase()}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Siste bestillinger</CardTitle>
          <CardDescription>Seneste 5 ordre i systemet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">Ingen nylige ordre</p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap justify-between gap-4 border-b border-border/40 pb-3 last:border-none last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {order.user?.email || order.user?.name || 'Guest'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('no-NO', {
                        dateStyle: 'medium',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      NOK {order.total.toLocaleString('no-NO', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.status.toLowerCase()} · {order.paymentStatus.toLowerCase()}
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
