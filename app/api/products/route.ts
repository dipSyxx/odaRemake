import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeProduct } from "@/lib/serializers";
import {
  buildProductCreateData,
  productCreateSchema,
  productInclude,
} from "./helpers";

const listQuerySchema = z.object({
  search: z.string().optional(),
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const parsedQuery = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const { search, skip = 0, take = 50 } = parsedQuery;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { fullName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: "desc" },
      include: productInclude,
    });

    return NextResponse.json({
      data: products.map(serializeProduct),
      meta: { count: products.length, skip, take },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = productCreateSchema.parse(raw);

    const product = await prisma.product.create({
      data: buildProductCreateData(parsed),
      include: productInclude,
    });

    return NextResponse.json(
      {
        data: serializeProduct(product),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "ValidationError",
        issues: error.errors,
      },
      { status: 422 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Product already exists for the provided identifier." },
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
