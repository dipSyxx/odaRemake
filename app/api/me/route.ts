import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/prisma/prisma-client'
import { cartInclude } from '../carts/helpers'
import { serializeCart, serializeUser } from '@/lib/serializers'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // If user is not authenticated, return null data
    if (!session?.user?.id) {
      return NextResponse.json({ data: { user: null, cart: null } }, { status: 200 })
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    // If user doesn't exist in database, return null data
    if (!user) {
      return NextResponse.json({ data: { user: null, cart: null } }, { status: 200 })
    }

    // Find active cart for authenticated user
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id, status: { in: ['DRAFT', 'ACTIVE'] } },
      orderBy: { updatedAt: 'desc' },
      include: cartInclude,
    })

    return NextResponse.json(
      {
        data: {
          user: serializeUser(user),
          cart: cart ? serializeCart(cart as any) : null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('API /me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
