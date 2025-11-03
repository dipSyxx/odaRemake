import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { serializeCart } from "@/lib/serializers";
import {
  cartInclude,
  cartItemUpdateSchema,
  recomputeCartTotal,
} from "../../../helpers";

type Params = { params: { id: string; itemId: string } };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const parsed = cartItemUpdateSchema.parse(body);

    if (Object.keys(parsed).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update." },
        { status: 400 },
      );
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: params.itemId, cartId: params.id },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 },
      );
    }

    const data: Prisma.CartItemUpdateInput = {};

    if (parsed.quantity !== undefined) data.quantity = parsed.quantity;
    if (parsed.unitPrice !== undefined)
      data.unitPrice = new Prisma.Decimal(parsed.unitPrice);
    if (parsed.currency !== undefined) data.currency = parsed.currency;
    if (parsed.metadata !== undefined)
      data.metadata =
        parsed.metadata === null
          ? Prisma.JsonNull
          : (parsed.metadata as Prisma.InputJsonValue);

    await prisma.cartItem.update({
      where: { id: params.itemId },
      data,
    });

    await recomputeCartTotal(params.id);

    const cart = await prisma.cart.findUniqueOrThrow({
      where: { id: params.id },
      include: cartInclude,
    });

    return NextResponse.json({ data: serializeCart(cart) });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const item = await prisma.cartItem.findFirst({
      where: { id: params.itemId, cartId: params.id },
      select: { id: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({ where: { id: params.itemId } });
    await recomputeCartTotal(params.id);

    const cart = await prisma.cart.findUniqueOrThrow({
      where: { id: params.id },
      include: cartInclude,
    });

    return NextResponse.json(
      { data: serializeCart(cart) },
      { status: 200 },
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
