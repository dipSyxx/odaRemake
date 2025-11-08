import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartUpdateSchema } from '@/lib/validators/cart'
import { cartInclude } from '../../../carts/helpers'
import { serializeCart } from '@/lib/serializers'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: cartInclude,
    })

    if (!cart) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    return NextResponse.json({ data: serializeCart(cart as any) })
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
    const data = cartUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    const updateData: Prisma.CartUpdateInput = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount

    const cart = await prisma.cart.update({
      where: { id },
      data: updateData,
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(cart as any) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
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
    await prisma.cart.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Admin Carts API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

