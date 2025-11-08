import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { orderUpdateSchema } from '@/lib/validators/order'
import { orderInclude } from '../../../orders/helpers'
import { serializeOrder } from '@/lib/serializers'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    const order = await prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    })

    if (!order) {
      return NextResponse.json({ error: 'Fant ikke ordre.' }, { status: 404 })
    }

    return NextResponse.json({ data: serializeOrder(order as any) })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    const raw = await request.json()
    const data = orderUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
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

export async function DELETE(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 204 })
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
  console.error('Admin Orders API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

