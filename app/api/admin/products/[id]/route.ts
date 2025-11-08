import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { productUpdateSchema } from '@/lib/validators/product'
import { productWithRelations, serializeProduct } from '@/lib/serializers'
import { buildProductUpdateData } from '../../../products/utils'

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    const product = await prisma.product.findUnique({
      where: { id },
      include: productWithRelations,
    })

    if (!product) {
      return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
    }

    return NextResponse.json({ data: serializeProduct(product) })
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
    const data = productUpdateSchema.parse(raw)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: buildProductUpdateData(data),
      include: productWithRelations,
    })

    return NextResponse.json({ data: serializeProduct(product) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'En av relasjonene peker til en ugyldig ressurs. Kontroller kategori- og relasjons-IDer.',
          },
          { status: 400 }
        )
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
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Admin Products API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

