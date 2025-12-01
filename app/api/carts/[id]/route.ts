import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartUpdateSchema } from '@/lib/validators/cart'
import { cartInclude } from '../helpers'
import { serializeCart } from '@/lib/serializers'
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
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: cartInclude,
    })

    if (!cart) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    const ownershipError = ensureOwnerOrAdmin(auth.user, cart.userId)
    if (ownershipError) return ownershipError

    return NextResponse.json({ data: serializeCart(cart as any) })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const rateLimited = await applyRateLimit(request, { key: 'carts-write' })
  if (rateLimited) return rateLimited

  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  const csrfError = verifyCsrf(request)
  if (csrfError) return csrfError

  try {
    const { id } = await ctx.params
    const raw = await request.json()
    const data = cartUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    const existingCart = await prisma.cart.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingCart) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    const ownershipError = ensureOwnerOrAdmin(auth.user, existingCart.userId)
    if (ownershipError) return ownershipError

    if (!auth.user.isAdmin && (data.status !== undefined || data.totalAmount !== undefined)) {
      return NextResponse.json(
        { error: 'Du har ikke tilgang til Ǿ endre status eller totalsum for handlekurven.' },
        { status: 403 },
      )
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
  const rateLimited = await applyRateLimit(_, { key: 'carts-write' })
  if (rateLimited) return rateLimited

  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  const csrfError = verifyCsrf(_)
  if (csrfError) return csrfError

  try {
    const { id } = await ctx.params

    const existing = await prisma.cart.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    const ownershipError = ensureOwnerOrAdmin(auth.user, existing.userId)
    if (ownershipError) return ownershipError

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
  console.error('Handlekurv API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
