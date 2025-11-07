import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import {
  productCreateSchema,
  productListQuerySchema,
} from "@/lib/validators/product";
import {
  productWithRelations,
  serializeProduct,
} from "@/lib/serializers";
import {
  PRODUCT_SORT_MAP,
  buildProductCreateData,
} from "./utils";

export async function GET(request: NextRequest) {
  try {
    const query = productListQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const {
      skip = 0,
      take = 24,
      search,
      categoryId,
      isAvailable,
      sort = "latest",
      minPrice,
      maxPrice,
    } = query;

    const where: Prisma.ProductWhereInput = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { fullName: { contains: search, mode: "insensitive" } },
              { nameExtra: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoryId
        ? {
            categories: {
              some: {
                categoryId,
              },
            },
          }
        : {}),
      ...(isAvailable !== undefined ? { isAvailable } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            grossPrice: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        where,
        orderBy: PRODUCT_SORT_MAP[sort] ?? { createdAt: "desc" },
        include: productWithRelations,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      data: items.map(serializeProduct),
      meta: { count: total, skip, take },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const data = productCreateSchema.parse(raw);

    const product = await prisma.product.create({
      data: buildProductCreateData(data),
      include: productWithRelations,
    });

    return NextResponse.json(
      { data: serializeProduct(product) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "En av relasjonene peker til en ugyldig ressurs. Kontroller kategori- og relasjons-IDer.",
          },
          { status: 400 },
        );
      }
    }
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Valideringsfeil", issues: error.errors },
      { status: 422 },
    );
  }
  console.error("Produkt API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
