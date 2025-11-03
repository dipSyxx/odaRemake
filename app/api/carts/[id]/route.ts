import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { serializeCart } from "@/lib/serializers";
import {
  buildCartUpdateData,
  cartInclude,
  cartUpdateSchema,
  recomputeCartTotal,
} from "../helpers";

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: params.id },
      include: cartInclude,
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: serializeCart(cart) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const raw = await request.json();
    const parsed = cartUpdateSchema.parse(raw);

    const data = buildCartUpdateData(parsed);
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update." },
        { status: 400 },
      );
    }

    const cart = await prisma.cart.update({
      where: { id: params.id },
      data,
      include: cartInclude,
    });

    if (parsed.items === undefined) {
      // ensure total is in sync after potential item-level updates elsewhere
      await recomputeCartTotal(cart.id);
      const refreshed = await prisma.cart.findUniqueOrThrow({
        where: { id: cart.id },
        include: cartInclude,
      });
      return NextResponse.json({ data: serializeCart(refreshed) });
    }

    return NextResponse.json({ data: serializeCart(cart) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Cart not found." },
          { status: 404 },
        );
      }
    }
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.cart.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Cart not found." },
          { status: 404 },
        );
      }
    }
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
