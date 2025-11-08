import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartItemCreateSchema } from '@/lib/validators/cart'
import { serializeCart, productWithRelations } from '@/lib/serializers'
import { cartInclude } from '../../../../carts/helpers'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id: cartId } = await ctx.params
    const raw = await request.json()
    const data = cartItemCreateSchema.parse(raw)

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: productWithRelations,
    })

    if (!product) {
      return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
    }

    const unitPrice = data.unitPrice ?? Number(product.grossPrice)

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId: data.productId,
        },
      },
      create: {
        cartId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice,
        currency: data.currency ?? cart.currency,
        metadata: data.metadata ?? null,
      },
      update: {
        quantity: {
          increment: data.quantity,
        },
      },
      include: {
        product: {
          include: productWithRelations,
        },
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

    return NextResponse.json({ data: serializeCart(finalCart as any) }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'En av relasjonene peker til en ugyldig ressurs. Kontroller produkt-ID.',
          },
          { status: 400 }
        )
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

