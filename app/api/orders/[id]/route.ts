import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { orderUpdateSchema } from '@/lib/validators/order'
import { orderInclude } from '../helpers'
import { serializeOrder } from '@/lib/serializers'
import { requireSessionUser, ensureOwnerOrAdmin } from '@/lib/api-guards'
import { applyRateLimit, verifyCsrf } from '@/lib/security'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: RouteCtx) {
  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  try {
    const { id } = await ctx.params
    const order = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    })

    if (!order) {
      return NextResponse.json({ error: 'Fant ikke ordre.' }, { status: 404 })
    }

    const ownershipError = ensureOwnerOrAdmin(auth.user, order.userId)
    if (ownershipError) return ownershipError

    return NextResponse.json({ data: serializeOrder(order as any) })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const rateLimited = await applyRateLimit(request, { key: 'orders-write' })
  if (rateLimited) return rateLimited

  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  const csrfError = verifyCsrf(request)
  if (csrfError) return csrfError

  try {
    const { id } = await ctx.params
    const raw = await request.json()
    const data = orderUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Fant ikke ordre.' }, { status: 404 })
    }

    const ownershipError = ensureOwnerOrAdmin(auth.user, existingOrder.userId)
    if (ownershipError) return ownershipError

    if (!auth.user.isAdmin && (data.status !== undefined || data.paymentStatus !== undefined)) {
      return NextResponse.json(
        { error: 'Du har ikke tilgang til Ǿ oppdatere status for ordren.' },
        { status: 403 },
      )
    }

    const updateData: Prisma.OrderUpdateInput = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus
    if (data.shippingAddress !== undefined) updateData.shippingAddress = data.shippingAddress
    if (data.billingAddress !== undefined) updateData.billingAddress = data.billingAddress

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: orderInclude,
    })

    return NextResponse.json({ data: serializeOrder(order as any) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke ordre.' }, { status: 404 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Ordre API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
