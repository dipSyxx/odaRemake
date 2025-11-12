import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { categoryCreateSchema, categoryListQuerySchema } from '@/lib/validators/category'
import { productWithRelations, serializeCategory } from '@/lib/serializers'

export async function GET(request: NextRequest) {
  try {
    const query = categoryListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))

    const {
      skip = 0,
      take = 50,
      search,
      parentId,
      rootOnly,
      includeChildren,
      includeParent,
      includeProducts,
      includeBanners,
      productsLimit,
    } = query

    const where: Prisma.CategoryWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(parentId ? { parentId } : rootOnly ? { parentId: null } : {}),
    }

    const categories = await prisma.category.findMany({
      skip,
      take,
      where,
      orderBy: { name: 'asc' },
      include: {
        parent: includeParent ? true : undefined,
        children: includeChildren
          ? {
              orderBy: { name: 'asc' },
            }
          : undefined,
        products: includeProducts
          ? {
              orderBy: { sortOrder: 'asc' },
              take: productsLimit ?? 12,
              include: {
                product: {
                  include: productWithRelations,
                },
              },
            }
          : undefined,
        banners: includeBanners
          ? {
              orderBy: { sortOrder: 'asc' },
            }
          : undefined,
        _count: {
          select: { products: true, children: true },
        },
      },
    })

    return NextResponse.json({
      data: categories.map(serializeCategory),
      meta: { count: categories.length, skip, take },
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()
    const data = categoryCreateSchema.parse(raw)

    const category = await prisma.category.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId === undefined ? undefined : data.parentId ?? null,
      },
      include: {
        parent: true,
        _count: { select: { products: true, children: true } },
      },
    })

    return NextResponse.json({ data: serializeCategory(category) }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json({ error: 'Kategori med samme slug finnes allerede.' }, { status: 409 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Kategori API-feil:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}
