import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/prisma/prisma-client'
import { applyRateLimit, verifyCsrf } from './security'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export async function requireAdmin(request: NextRequest) {
  if (!SAFE_METHODS.has(request.method.toUpperCase())) {
    const rateLimited = await applyRateLimit(request, { key: 'admin-write' })
    if (rateLimited) return rateLimited

    const csrfError = verifyCsrf(request)
    if (csrfError) return csrfError
  }

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin in database (more secure than just checking session)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
  }

  return null // User is admin, continue
}

