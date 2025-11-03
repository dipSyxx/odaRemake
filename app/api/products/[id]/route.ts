import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { serializeProduct } from "@/lib/serializers";
import {
  buildProductUpdateData,
  productInclude,
  productUpdateSchema,
} from "../helpers";

type Params = {
  params: { id: string };
};

function parseProductId(id: string) {
  const value = Number(id);
  if (!Number.isInteger(value)) {
    throw new ZodError([
      {
        code: "invalid_type",
        expected: "number",
        received: "nan",
        path: ["id"],
        message: "Product id must be an integer.",
      },
    ]);
  }
  return value;
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const id = parseProductId(params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      return NextResponse.json(
        { error: `Product ${id} not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: serializeProduct(product) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseProductId(params.id);
    const raw = await request.json();
    const parsed = productUpdateSchema.parse(raw);

    const updateData = buildProductUpdateData(parsed);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update." },
        { status: 400 },
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: productInclude,
    });

    return NextResponse.json({ data: serializeProduct(product) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Product not found." },
          { status: 404 },
        );
      }
    }
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const id = parseProductId(params.id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Product not found." },
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
