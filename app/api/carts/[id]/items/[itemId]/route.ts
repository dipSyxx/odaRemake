import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartItemUpdateSchema } from '@/lib/validators/cart'
import { cartInclude } from '../../../helpers'
import { serializeCart } from '@/lib/serializers'

type RouteCtx = {
  params: Promise<{ id: string; itemId: string }>
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  try {
    const { id: cartId, itemId } = await ctx.params
    const raw = await request.json()
    const data = cartItemUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    // Verify cart item exists and belongs to cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!existingItem || existingItem.cartId !== cartId) {
      return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
    }

    const updateData: Prisma.CartItemUpdateInput = {}
    if (data.quantity !== undefined) updateData.quantity = data.quantity
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.metadata !== undefined) updateData.metadata = data.metadata

    await prisma.cartItem.update({
      where: { id: itemId },
      data: updateData,
    })

    // Update cart total
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    })

    if (cart) {
      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.unitPrice) * item.quantity
      }, 0)

      await prisma.cart.update({
        where: { id: cartId },
        data: { totalAmount: total },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(updatedCart as any) })
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
  try {
    const { id: cartId, itemId } = await ctx.params

    // Verify cart item exists and belongs to cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    })

    if (!existingItem || existingItem.cartId !== cartId) {
      return NextResponse.json({ error: 'Fant ikke handlekurv element.' }, { status: 404 })
    }

    await prisma.cartItem.delete({ where: { id: itemId } })

    // Update cart total
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: true,
      },
    })

    if (cart) {
      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.unitPrice) * item.quantity
      }, 0)

      await prisma.cart.update({
        where: { id: cartId },
        data: { totalAmount: total },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(updatedCart as any) })
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
  console.error('Handlekurv element API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
