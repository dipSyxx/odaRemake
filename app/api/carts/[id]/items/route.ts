import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { serializeCart } from "@/lib/serializers";
import {
  cartInclude,
  cartItemSchema,
  recomputeCartTotal,
} from "../../helpers";

type Params = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: params.id },
      select: { id: true, currency: true },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found." },
        { status: 404 },
      );
    }

    const parsed = cartItemSchema.parse(await request.json());

    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parsed.productId,
        },
      },
      update: {
        quantity: parsed.quantity ?? 1,
        unitPrice: new Prisma.Decimal(parsed.unitPrice),
        currency: parsed.currency ?? cart.currency,
        metadata:
          parsed.metadata === undefined
            ? undefined
            : (parsed.metadata as Prisma.InputJsonValue),
      },
      create: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: parsed.productId } },
        quantity: parsed.quantity ?? 1,
        unitPrice: new Prisma.Decimal(parsed.unitPrice),
        currency: parsed.currency ?? cart.currency,
        metadata:
          parsed.metadata === undefined
            ? Prisma.JsonNull
            : (parsed.metadata as Prisma.InputJsonValue),
      },
    });

    await recomputeCartTotal(cart.id);

    const updatedCart = await prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: cartInclude,
    });

    return NextResponse.json(
      { data: serializeCart(updatedCart) },
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
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Related product or cart not found." },
        { status: 409 },
      );
    }
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
