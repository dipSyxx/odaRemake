import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const now = new Date()
    const DAY = 24 * 60 * 60 * 1000
    const daysAgo = (days: number) => new Date(now.getTime() - days * DAY)

    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalCarts,
      ordersByStatus,
      ordersByPaymentStatus,
      recentOrders,
      totalRevenue,
      averageOrderValue,
      timelineOrders,
      newCustomersCurrent,
      newCustomersPrevious,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.cart.count(),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.order.groupBy({
        by: ['paymentStatus'],
        _count: { paymentStatus: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.aggregate({
        _avg: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: daysAgo(120),
          },
        },
        select: {
          createdAt: true,
          total: true,
          paymentStatus: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: daysAgo(30),
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: daysAgo(60),
            lt: daysAgo(30),
          },
        },
      }),
    ])

    const revenue = totalRevenue._sum.total
    const avgOrder = averageOrderValue._avg.total

    const dailyBuckets = new Map<
      string,
      {
        revenue: number
        orders: number
      }
    >()

    timelineOrders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10)
      if (!dailyBuckets.has(key)) {
        dailyBuckets.set(key, { revenue: 0, orders: 0 })
      }
      const bucket = dailyBuckets.get(key)!
      bucket.orders += 1
      if (order.paymentStatus === 'PAID') {
        bucket.revenue += Number(order.total)
      }
    })

    const buildTimeline = (days: number) => {
      const data: { label: string; revenue: number; orders: number }[] = []
      for (let i = days - 1; i >= 0; i--) {
        const date = daysAgo(i)
        const key = date.toISOString().slice(0, 10)
        const bucket = dailyBuckets.get(key) ?? { revenue: 0, orders: 0 }
        data.push({
          label:
            days <= 7
              ? date.toLocaleDateString('no-NO', { weekday: 'short' })
              : date.toLocaleDateString('no-NO', {
                  day: 'numeric',
                  month: 'short',
                }),
          revenue: Number(bucket.revenue.toFixed(2)),
          orders: bucket.orders,
        })
      }
      return data
    }

    const sumRange = (startOffset: number, length: number) => {
      let revenueSum = 0
      let orderCount = 0
      for (let i = startOffset; i < startOffset + length; i++) {
        const date = daysAgo(i)
        const key = date.toISOString().slice(0, 10)
        const bucket = dailyBuckets.get(key)
        if (bucket) {
          revenueSum += bucket.revenue
          orderCount += bucket.orders
        }
      }
      return { revenueSum, orderCount }
    }

    const currentWindow = sumRange(0, 30)
    const previousWindow = sumRange(30, 30)

    const revenueDelta =
      previousWindow.revenueSum > 0
        ? ((currentWindow.revenueSum - previousWindow.revenueSum) /
            previousWindow.revenueSum) *
          100
        : null

    const averageCurrent =
      currentWindow.orderCount > 0
        ? currentWindow.revenueSum / currentWindow.orderCount
        : 0
    const averagePrevious =
      previousWindow.orderCount > 0
        ? previousWindow.revenueSum / previousWindow.orderCount
        : 0

    const averageDelta =
      averagePrevious > 0
        ? ((averageCurrent - averagePrevious) / averagePrevious) * 100
        : null

    const newCustomersDelta =
      newCustomersPrevious > 0
        ? ((newCustomersCurrent - newCustomersPrevious) /
            newCustomersPrevious) *
          100
        : null

    return NextResponse.json({
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalOrders,
          totalCarts,
        },
        orders: {
          byStatus: ordersByStatus.reduce(
            (acc, item) => {
              acc[item.status] = item._count.status
              return acc
            },
            {} as Record<string, number>
          ),
          byPaymentStatus: ordersByPaymentStatus.reduce(
            (acc, item) => {
              acc[item.paymentStatus] = item._count.paymentStatus
              return acc
            },
            {} as Record<string, number>
          ),
          recent: recentOrders.map((order) => ({
            id: order.id,
            status: order.status,
            paymentStatus: order.paymentStatus,
            total: Number(order.total),
            user: order.user
              ? {
                  id: order.user.id,
                  email: order.user.email,
                  name: order.user.name,
                }
              : null,
            createdAt: order.createdAt.toISOString(),
          })),
        },
        revenue: {
          total: revenue ? Number(revenue) : 0,
          averageOrderValue: avgOrder ? Number(avgOrder) : 0,
        },
        timeline: {
          '90d': buildTimeline(90),
          '30d': buildTimeline(30),
          '7d': buildTimeline(7),
        },
        trends: {
          revenue30d: Number(currentWindow.revenueSum.toFixed(2)),
          revenueDelta: revenueDelta ?? 0,
          averageOrder30d: Number(averageCurrent.toFixed(2)),
          averageOrderDelta: averageDelta ?? 0,
          newCustomers30d: newCustomersCurrent,
          newCustomersDelta: newCustomersDelta ?? 0,
        },
      },
    })
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

