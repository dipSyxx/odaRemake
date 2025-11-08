import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { orderListQuerySchema, orderCreateSchema } from '@/lib/validators/order'
import { orderInclude } from '../../orders/helpers'
import { serializeOrder } from '@/lib/serializers'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const query = orderListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))

    const { skip = 0, take = 50, userId, status, paymentStatus } = query

    const where: Prisma.OrderWhereInput = {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      data: items.map((order) => serializeOrder(order as any)),
      meta: { count: total, skip, take },
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const raw = await request.json()
    const data = orderCreateSchema.parse(raw)

    let orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = []
    if (data.cartId) {
      const cart = await prisma.cart.findUnique({
        where: { id: data.cartId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!cart) {
        return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
      }

      orderItems = cart.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        currency: item.currency,
        product: item.productId
          ? {
              connect: { id: item.productId },
            }
          : undefined,
      }))
    }

    const order = await prisma.order.create({
      data: {
        userId: data.userId ?? null,
        cartId: data.cartId ?? null,
        status: data.status ?? 'PENDING',
        paymentStatus: data.paymentStatus ?? 'PENDING',
        currency: data.currency ?? 'NOK',
        subtotal: data.subtotal,
        discountTotal: data.discountTotal ?? 0,
        shippingTotal: data.shippingTotal ?? 0,
        total: data.total,
        shippingAddress: data.shippingAddress ?? null,
        billingAddress: data.billingAddress ?? null,
        items: {
          create: orderItems,
        },
      },
      include: orderInclude,
    })

    if (data.cartId) {
      await prisma.cart.update({
        where: { id: data.cartId },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ data: serializeOrder(order as any) }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'En av relasjonene peker til en ugyldig ressurs. Kontroller bruker- eller handlekurv-ID.',
          },
          { status: 400 }
        )
      }
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Handlekurv er allerede brukt i en annen ordre.' }, { status: 409 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Admin Orders API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

