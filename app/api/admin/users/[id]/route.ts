import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'
import prisma from '@/prisma/prisma-client'
import { Prisma } from '@prisma/client'
import { ZodError, z } from 'zod'
import { serializeUser } from '@/lib/serializers'

const userUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1, 'Navn kan ikke være tomt').nullable().optional(),
    phone: z
      .string()
      .trim()
      .min(8, 'Telefonnummeret må være minst 8 tegn')
      .regex(/^[0-9+\s()-]+$/, 'Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-')
      .nullable()
      .optional(),
    address: z.string().trim().min(5, 'Adressen må være minst 5 tegn').nullable().optional(),
    password: z.string().min(8, 'Passordet må være minst 8 tegn').optional(),
    isAdmin: z.boolean().optional(),
  })
  .strict()

type RouteCtx = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'Fant ikke bruker.' }, { status: 404 })
    }

    return NextResponse.json({ data: serializeUser(user) })
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
    const data = userUpdateSchema.parse(raw)

    const { email, name, phone, address, password, isAdmin } = data

    const hasUpdates =
      email !== undefined ||
      name !== undefined ||
      phone !== undefined ||
      address !== undefined ||
      password !== undefined ||
      isAdmin !== undefined

    if (!hasUpdates) {
      return NextResponse.json({ error: 'Ingen felter ble sendt inn for oppdatering.' }, { status: 400 })
    }

    let passwordHash: string | undefined
    if (password) {
      const bcrypt = await import('bcryptjs')
      passwordHash = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        email: email?.toLowerCase(),
        name: name === undefined ? undefined : name,
        phone: phone === undefined ? undefined : phone ?? null,
        address: address === undefined ? undefined : address ?? null,
        ...(passwordHash ? { passwordHash } : {}),
        ...(isAdmin !== undefined ? { isAdmin } : {}),
      },
    })

    return NextResponse.json({ data: serializeUser(user) })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke bruker.' }, { status: 404 })
      }
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

export async function DELETE(_: NextRequest, ctx: RouteCtx) {
  const authError = await requireAdmin(_)
  if (authError) return authError

  try {
    const { id } = await ctx.params
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true }, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Fant ikke bruker.' }, { status: 404 })
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

