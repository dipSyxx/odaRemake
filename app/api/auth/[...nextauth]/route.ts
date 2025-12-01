import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { applyRateLimit } from "@/lib/security";

const handler = NextAuth(authOptions);

async function handleAuth(request: NextRequest, ctx: any) {
  const limited = await applyRateLimit(request, {
    key: "auth",
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;
  return handler(request, ctx);
}

export const GET = handleAuth;
export const POST = handleAuth;
