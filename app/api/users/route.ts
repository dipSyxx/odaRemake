import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeUser } from "@/lib/serializers";

const listQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
});

const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Must include letters and numbers"),
});

export async function GET(request: NextRequest) {
  try {
    const query = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );
    const { skip = 0, take = 50, search } = query;

    const users = await prisma.user.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: users.map(serializeUser),
      meta: { count: users.length, skip, take },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const data = userCreateSchema.parse(raw);

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash,
      },
    });

    return NextResponse.json({ data: serializeUser(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 409 }
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
      { status: 422 }
    );
  }

  console.error("Unexpected API error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
