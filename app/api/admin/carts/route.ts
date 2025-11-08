import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartListQuerySchema, cartCreateSchema } from '@/lib/validators/cart'
import { cartInclude } from '../../carts/helpers'
import { serializeCart } from '@/lib/serializers'

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const query = cartListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))

    const { skip = 0, take = 50, userId, status } = query

    const where: Prisma.CartWhereInput = {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.cart.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        include: cartInclude,
      }),
      prisma.cart.count({ where }),
    ])

    return NextResponse.json({
      data: items.map((cart) => serializeCart(cart as any)),
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
    const data = cartCreateSchema.parse(raw)

    const cart = await prisma.cart.create({
      data: {
        userId: data.userId ?? null,
        status: data.status ?? 'DRAFT',
        currency: data.currency ?? 'NOK',
        totalAmount: data.totalAmount ?? 0,
      },
      include: cartInclude,
    })

    return NextResponse.json({ data: serializeCart(cart as any) }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'En av relasjonene peker til en ugyldig ressurs. Kontroller bruker-ID.',
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
  console.error('Admin Carts API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

