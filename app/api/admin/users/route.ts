import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError, z } from 'zod'
import { serializeUser } from '@/lib/serializers'

const listQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
})

const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).optional(),
  phone: z
    .string()
    .trim()
    .min(8, 'Telefonnummeret må være minst 8 tegn')
    .regex(/^[0-9+\s()-]+$/, 'Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-')
    .optional(),
  address: z.string().trim().min(5, 'Adressen må være minst 5 tegn').optional(),
  password: z
    .string()
    .min(8, 'Passordet må være minst 8 tegn')
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Må inneholde både bokstaver og tall'),
  isAdmin: z.boolean().optional().default(false),
})

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const query = listQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()))
    const { skip = 0, take = 50, search } = query

    const users = await prisma.user.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.user.count({
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    })

    return NextResponse.json({
      data: users.map(serializeUser),
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
    const data = userCreateSchema.parse(raw)

    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        phone: data.phone,
        address: data.address,
        passwordHash,
        isAdmin: data.isAdmin,
      },
    })

    return NextResponse.json({ data: serializeUser(user) }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target ?? []) as string[]
        if (Array.isArray(target) && target.includes('phone')) {
          return NextResponse.json({ error: 'Telefonnummeret er allerede i bruk.' }, { status: 409 })
        }
        return NextResponse.json({ error: 'E-postadressen er allerede i bruk.' }, { status: 409 })
      }
    }
    return handleError(error)
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Valideringsfeil', issues: error.errors }, { status: 422 })
  }
  console.error('Admin Users API error:', error)
  return NextResponse.json({ error: 'Intern tjenerfeil' }, { status: 500 })
}

