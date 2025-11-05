import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/prisma-client";
import { cartInclude } from "../carts/helpers";
import { serializeCart, serializeUser } from "@/lib/serializers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ data: { user: null, cart: null } });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return NextResponse.json({ data: { user: null, cart: null } });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id, status: { in: ["DRAFT", "ACTIVE"] } },
    orderBy: { updatedAt: "desc" },
    include: cartInclude,
  });

  return NextResponse.json({
    data: {
      user: serializeUser(user),
      cart: cart ? serializeCart(cart as any) : null,
    },
  });
}
