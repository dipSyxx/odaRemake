import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { ZodError } from "zod";
import {
  categoryDetailQuerySchema,
} from "@/lib/validators/category";
import {
  serializeCategory,
  productWithRelations,
} from "@/lib/serializers";

type RouteCtx = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, ctx: RouteCtx) {
  try {
    const { slug } = await ctx.params;
    const query = categoryDetailQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const {
      includeChildren,
      includeParent,
      includeProducts,
      includeBanners,
      productsLimit,
    } = query;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: includeParent ? true : undefined,
        children: includeChildren ? { orderBy: { name: "asc" } } : undefined,
        products: includeProducts
          ? {
              orderBy: { sortOrder: "asc" },
              take: productsLimit ?? undefined,
              include: {
                product: {
                  include: productWithRelations,
                },
              },
            }
          : undefined,
        banners: includeBanners
          ? {
              orderBy: { sortOrder: "asc" },
            }
          : undefined,
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Fant ikke kategori." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: serializeCategory(category) });
  } catch (error) {
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
  console.error("Kategori slug API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
