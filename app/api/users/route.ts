import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeUser } from "@/lib/serializers";
import { requireSessionUser, requireAdminUser, getSessionUser } from "@/lib/api-guards";
import { applyRateLimit, verifyCsrf } from "@/lib/security";

const listQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
});

const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).optional(),
  phone: z
    .string()
    .trim()
    .min(8, "Telefonnummeret må være minst 8 tegn")
    .regex(
      /^[0-9+\s()-]+$/,
      "Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-",
    ),
  address: z
    .string()
    .trim()
    .min(5, "Adressen må være minst 5 tegn"),
  password: z
    .string()
    .min(8, "Passordet må være minst 8 tegn")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Må inneholde både bokstaver og tall",
    ),
});

export async function GET(request: NextRequest) {
  const auth = await requireSessionUser();
  if (!auth.user) return auth.response;
  const adminError = requireAdminUser(auth.user);
  if (adminError) return adminError;

  try {
    const query = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
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
              { phone: { contains: search, mode: "insensitive" } },
              { address: { contains: search, mode: "insensitive" } },
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
  const rateLimited = await applyRateLimit(request, { key: "users-write" });
  if (rateLimited) return rateLimited;

  // Allow open signup; if a session exists, enforce admin role for creating additional users
  const sessionUser = await getSessionUser();
  if (sessionUser) {
    const adminError = requireAdminUser(sessionUser);
    if (adminError) return adminError;
  }

  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const raw = await request.json();
    const data = userCreateSchema.parse(raw);

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        phone: data.phone,
        address: data.address,
        passwordHash,
      },
    });

    return NextResponse.json({ data: serializeUser(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target ?? []) as string[];
        if (Array.isArray(target) && target.includes("phone")) {
          return NextResponse.json(
            { error: "Telefonnummeret er allerede i bruk." },
            { status: 409 },
          );
        }
        return NextResponse.json(
          { error: "E-postadressen er allerede i bruk." },
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

  console.error("Uventet API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
