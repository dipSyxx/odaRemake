import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeUser } from "@/lib/serializers";

const userUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1, "Navn kan ikke være tomt").nullable().optional(),
    phone: z
      .string()
      .trim()
      .min(8, "Telefonnummeret må være minst 8 tegn")
      .regex(
        /^[0-9+\s()-]+$/,
        "Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-"
      )
      .nullable()
      .optional(),
    address: z
      .string()
      .trim()
      .min(5, "Adressen må være minst 5 tegn")
      .nullable()
      .optional(),
    password: z.string().min(8, "Passordet må være minst 8 tegn").optional(),
    currentPassword: z.string().min(8, "Oppgi nåværende passord").optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password && !data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "Oppgi nåværende passord for å endre det.",
      });
    }
  });

type RouteCtx = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "Fant ikke bruker." }, { status: 404 });
    }

    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;

    const raw = await request.json();
    const data = userUpdateSchema.parse(raw);

    const { email, name, phone, address, password, currentPassword } = data;

    const hasUpdates =
      email !== undefined ||
      name !== undefined ||
      phone !== undefined ||
      address !== undefined ||
      password !== undefined;

    if (!hasUpdates) {
      return NextResponse.json(
        { error: "Ingen felter ble sendt inn for oppdatering." },
        { status: 400 }
      );
    }

    let passwordHash: string | undefined;
    if (password) {
      const existing = await prisma.user.findUnique({
        where: { id },
        select: { passwordHash: true },
      });

      if (!existing || !existing.passwordHash) {
        return NextResponse.json(
          { error: "Kan ikke endre passord på denne kontoen." },
          { status: 400 }
        );
      }

      const bcrypt = await import("bcryptjs");
      const ok = await bcrypt.compare(
        currentPassword as string,
        existing.passwordHash
      );
      if (!ok) {
        return NextResponse.json(
          { error: "Nåværende passord er feil." },
          { status: 401 }
        );
      }

      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        email: email?.toLowerCase(),
        name: name === undefined ? undefined : name,
        phone: phone === undefined ? undefined : phone ?? null,
        address: address === undefined ? undefined : address ?? null,
        ...(passwordHash ? { passwordHash } : {}),
      },
    });

    return NextResponse.json({ data: serializeUser(user) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fant ikke bruker." },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        const target = (error.meta?.target ?? []) as string[];
        if (Array.isArray(target) && target.includes("phone")) {
          return NextResponse.json(
            { error: "Telefonnummeret er allerede i bruk." },
            { status: 409 }
          );
        }
        return NextResponse.json(
          { error: "E-postadressen er allerede i bruk." },
          { status: 409 }
        );
      }
    }
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, ctx: RouteCtx) {
  try {
    const { id } = await ctx.params;

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fant ikke bruker." },
          { status: 404 }
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
      { status: 422 }
    );
  }
  console.error("Uventet API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
