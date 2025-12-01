import { NextRequest, NextResponse } from 'next/server'

type RateLimitOptions = {
  key?: string
  limit?: number
  windowMs?: number
}

const defaultRateLimitWindow = 60_000
const defaultRateLimit = 30
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  // NextRequest.ip is not always populated, fall back to host header
  return (request as any).ip ?? request.headers.get('host') ?? 'unknown'
}

export async function applyRateLimit(
  request: NextRequest,
  options: RateLimitOptions = {},
): Promise<NextResponse | null> {
  const limit = options.limit ?? defaultRateLimit
  const windowMs = options.windowMs ?? defaultRateLimitWindow
  const key = `${options.key ?? 'default'}:${getClientIp(request)}`

  const now = Date.now()
  const existing = rateLimitBuckets.get(key)

  if (existing && existing.resetAt > now) {
    if (existing.count >= limit) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000)
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': `${retryAfter}`,
          },
        },
      )
    }
    existing.count += 1
    rateLimitBuckets.set(key, existing)
    return null
  }

  rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs })
  return null
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export function verifyCsrf(request: NextRequest) {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return null

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const allowedOrigins = buildAllowedOrigins(request)

  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    return null
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (allowedOrigins.some((allowed) => refererOrigin.startsWith(allowed))) {
        return null
      }
    } catch {
      // ignore invalid referer
    }
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

function buildAllowedOrigins(request: NextRequest) {
  const origins = new Set<string>()
  const envOrigin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL
  if (envOrigin) {
    try {
      origins.add(new URL(envOrigin).origin)
    } catch {
      // ignore malformed env urls
    }
  }

  const host = request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'https'
  if (host) {
    origins.add(`${proto}://${host}`)
  }

  return Array.from(origins).filter(Boolean)
}
