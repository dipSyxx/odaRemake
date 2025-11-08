import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartItemCreateSchema, cartItemUpdateSchema } from '@/lib/validators/cart'
import { serializeCart, productWithRelations } from '@/lib/serializers'
import { cartInclude } from '../../helpers'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  try {
    const { id: cartId } = await ctx.params
    const raw = await request.json()
    const data = cartItemCreateSchema.parse(raw)

    // Verify cart exists
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Fant ikke handlekurv.' }, { status: 404 })
    }

    // Get product to get current price if not provided
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: productWithRelations,
    })

    if (!product) {
      return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
    }

    const unitPrice = data.unitPrice ?? Number(product.grossPrice)

    // Use upsert to handle existing items
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

    // Update cart total
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
          { status: 400 },
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
  console.error('Handlekurv element API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
