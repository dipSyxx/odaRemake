import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { cartListQuerySchema, cartCreateSchema } from '@/lib/validators/cart'
import { cartInclude } from './helpers'
import { serializeCart } from '@/lib/serializers'
import { requireSessionUser } from '@/lib/api-guards'
import { applyRateLimit, verifyCsrf } from '@/lib/security'

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  try {
    const query = cartListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))

    const { skip = 0, take = 50, userId, status } = query

    const where: Prisma.CartWhereInput = {
      ...(auth.user.isAdmin
        ? userId
          ? { userId }
          : {}
        : { userId: auth.user.id }),
      ...(status ? { status } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.cart.findMany({
        skip,
        take,
        where,
        orderBy: { updatedAt: 'desc' },
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
  const rateLimited = await applyRateLimit(request, { key: 'carts-write' })
  if (rateLimited) return rateLimited

  const auth = await requireSessionUser()
  if (!auth.user) return auth.response

  const csrfError = verifyCsrf(request)
  if (csrfError) return csrfError

  try {
    const raw = await request.json()
    const data = cartCreateSchema.parse(raw)

    const cart = await prisma.cart.create({
      data: {
        userId: auth.user.isAdmin ? data.userId ?? null : auth.user.id,
        status: auth.user.isAdmin ? data.status ?? 'DRAFT' : 'DRAFT',
        currency: data.currency ?? 'NOK',
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
  console.error('Handlekurv API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
