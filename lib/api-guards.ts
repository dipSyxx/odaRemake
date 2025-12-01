import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export type SessionUser = {
  id: string
  isAdmin: boolean
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return {
    id: session.user.id,
    isAdmin: Boolean((session.user as any).isAdmin),
  }
}

export async function requireSessionUser() {
  const user = await getSessionUser()
  if (!user) {
    return {
      user: null as SessionUser | null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { user }
}

export function requireAdminUser(user: SessionUser | null) {
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export function ensureOwnerOrAdmin(user: SessionUser, ownerId: string | null | undefined) {
  if (user.isAdmin) return null
  if (!ownerId || ownerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
