import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
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
    ])

    const revenue = totalRevenue._sum.total
    const avgOrder = averageOrderValue._avg.total

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
      },
    })
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

