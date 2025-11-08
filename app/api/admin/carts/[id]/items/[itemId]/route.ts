import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartItemUpdateSchema } from '@/lib/validators/cart'
import { serializeCart } from '@/lib/serializers'
import { cartInclude } from '../../../../../../carts/helpers'

type RouteCtx = {
  params: Promise<{ id: string; itemId: string }>
}

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id: cartId, itemId } = await ctx.params
    const raw = await request.json()
    const data = cartItemUpdateSchema.parse(raw)

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!cartItem || cartItem.cartId !== cartId) {
      return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: {
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        currency: data.currency,
        metadata: data.metadata ?? null,
      },
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    if (updatedCart) {
      const total = updatedCart.items.reduce((sum, item) => {
        return sum + Number(item.unitPrice) * item.quantity
      }, 0)

      await prisma.cart.update({
        where: { id: cartId },
        data: { totalAmount: total },
      })
    }

    const finalCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(finalCart as any) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
      }
    }
    return handleError(error)
  }
}

export async function DELETE(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id: cartId, itemId } = await ctx.params

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!cartItem || cartItem.cartId !== cartId) {
      return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    if (updatedCart) {
      const total = updatedCart.items.reduce((sum, item) => {
        return sum + Number(item.unitPrice) * item.quantity
      }, 0)

      await prisma.cart.update({
        where: { id: cartId },
        data: { totalAmount: total },
      })
    }

    const finalCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(finalCart as any) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Admin Cart Items API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

