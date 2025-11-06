import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";
import { serializeUser } from "@/lib/serializers";

type Params = { params: { id: string } };

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
        "Telefonnummer kan bare inneholde tall, mellomrom og tegnene +()-",
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
  })
  .strict();

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Fant ikke bruker." }, { status: 404 });
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
        { error: "Ingen felter ble sendt inn for oppdatering." },
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
        return NextResponse.json(
          { error: "Fant ikke bruker." },
          { status: 404 },
        );
      }
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

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fant ikke bruker." },
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
      { error: "Valideringsfeil", issues: error.errors },
      { status: 422 }
    );
  }

  console.error("Uventet API-feil:", error);
  return NextResponse.json({ error: "Intern tjenerfeil" }, { status: 500 });
}
