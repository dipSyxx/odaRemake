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
      include: {
        ...productWithRelations,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
    }

    const serialized = serializeProduct(product as any)
    // Add categories to response
    const productWithCategories = product as any
    return NextResponse.json({
      data: {
        ...serialized,
        categories:
          productWithCategories.categories?.map((pc: any) => ({
            categoryId: pc.categoryId,
            productId: pc.productId,
            sortOrder: pc.sortOrder,
          })) || [],
      },
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    console.log('PUT /api/admin/products/[id] - Product ID:', id)

    // Check if product exists first
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        discount: {
          select: { id: true },
        },
      },
    })

    if (!existingProduct) {
      console.log('Product not found with ID:', id)
      return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
    }

    console.log('Product found, proceeding with update')

    const raw = await request.json()
    console.log('Raw request data received')

    const data = productUpdateSchema.parse(raw)
    console.log('Data validated successfully')

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    const updateData = buildProductUpdateData(data)
    if (data.discount === null && !existingProduct.discount) {
      updateData.discount = undefined
    }
    console.log('Update data built, attempting update...')

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        ...productWithRelations,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    console.log('Product updated successfully')

    const serialized = serializeProduct(product as any)
    const productWithCategories = product as any
    return NextResponse.json({
      data: {
        ...serialized,
        categories:
          productWithCategories.categories?.map((pc: any) => ({
            categoryId: pc.categoryId,
            productId: pc.productId,
            sortOrder: pc.sortOrder,
          })) || [],
      },
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error code:', error.code)
      if (error.code === 'P2025') {
        console.error('P2025: Record not found')
        return NextResponse.json({ error: 'Fant ikke produkt.' }, { status: 404 })
      }
      if (error.code === 'P2003') {
        console.error('P2003: Foreign key constraint failed')
        return NextResponse.json(
          {
            error: 'En av relasjonene peker til en ugyldig ressurs. Kontroller kategori- og relasjons-IDer.',
          },
          { status: 400 },
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
