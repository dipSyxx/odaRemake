import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeUser } from "@/lib/serializers";

type Params = { params: { id: string } };

const userUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1).nullable().optional(),
    phone: z
      .string()
      .trim()
      .min(8)
      .regex(/^[0-9+\s()-]+$/)
      .nullable()
      .optional(),
    address: z.string().trim().min(5).nullable().optional(),
    password: z.string().min(8).optional(),
  })
  .strict();

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const raw = await request.json();
    const data = userUpdateSchema.parse(raw);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update." },
        { status: 400 }
      );
    }

    let passwordHash: string | undefined;
    if (data.password) {
      const bcrypt = await import("bcryptjs");
      passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        email: data.email?.toLowerCase(),
        name: data.name === undefined ? undefined : data.name,
        phone: data.phone === undefined ? undefined : data.phone ?? null,
        address: data.address === undefined ? undefined : data.address ?? null,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
      if (error.code === "P2002") {
        const target = (error.meta?.target ?? []) as string[];
        if (Array.isArray(target) && target.includes("phone")) {
          return NextResponse.json(
            { error: "Phone number already exists." },
            { status: 409 },
          );
        }
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 409 }
        );
      }
    }

    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
    }
    return handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "ValidationError", issues: error.errors },
      { status: 422 }
    );
  }

  console.error("Unexpected API error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
