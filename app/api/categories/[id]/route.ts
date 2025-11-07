import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import {
  categoryDetailQuerySchema,
  categoryUpdateSchema,
} from "@/lib/validators/category";
import {
  serializeCategory,
  productWithRelations,
} from "@/lib/serializers";

type RouteCtx = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    const query = categoryDetailQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const { includeChildren, includeParent, includeProducts, productsLimit } =
      query;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: includeParent ? true : undefined,
        children: includeChildren ? { orderBy: { name: "asc" } } : undefined,
        products: includeProducts
          ? {
              orderBy: { sortOrder: "asc" },
              take: productsLimit ?? 12,
              include: {
                product: {
                  include: productWithRelations,
                },
              },
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

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    const raw = await request.json();
    const data = categoryUpdateSchema.parse(raw);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Ingen felter ble sendt inn for oppdatering." },
        { status: 400 },
      );
    }

    if (data.parentId && data.parentId === id) {
      return NextResponse.json(
        { error: "En kategori kan ikke være sin egen forelder." },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId:
          data.parentId === undefined ? undefined : data.parentId ?? null,
      },
      include: {
        parent: true,
        _count: { select: { products: true, children: true } },
      },
    });

    return NextResponse.json({ data: serializeCategory(category) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fant ikke kategori." },
          { status: 404 },
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Slug må være unik." },
          { status: 409 },
        );
      }
    }
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fant ikke kategori." },
          { status: 404 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "Kan ikke slette kategori som fortsatt er i bruk av andre ressurser.",
          },
          { status: 409 },
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
  console.error("Kategori API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
