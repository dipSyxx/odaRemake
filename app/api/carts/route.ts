import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeCart } from "@/lib/serializers";
import {
  buildCartCreateData,
  cartCreateSchema,
  cartInclude,
} from "./helpers";

const listQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  userId: z.string().cuid().optional(),
  status: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const query = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const { skip = 0, take = 50, userId, status } = query;

    const carts = await prisma.cart.findMany({
      skip,
      take,
      where: {
        userId: userId ?? undefined,
        status: status as any,
      },
      orderBy: { updatedAt: "desc" },
      include: cartInclude,
    });

    return NextResponse.json({
      data: carts.map(serializeCart),
      meta: { count: carts.length, skip, take },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const data = cartCreateSchema.parse(raw);

    const cart = await prisma.cart.create({
      data: buildCartCreateData(data),
      include: cartInclude,
    });

    return NextResponse.json(
      { data: serializeCart(cart) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "ValidationError", issues: error.errors },
      { status: 422 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 },
    );
  }

  console.error("Unexpected API error:", error);
  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 },
  );
}
