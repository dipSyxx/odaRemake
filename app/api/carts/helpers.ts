import { Prisma, CartStatus } from "@prisma/client";
import { z } from "zod";
import prisma from "@/prisma/prisma-client";
import { productInclude } from "../products/helpers";

export const cartItemSchema = z.object({
  productId: z.number().int(),
  quantity: z.coerce.number().int().min(1).default(1),
  unitPrice: z.coerce.number(),
  currency: z.string().optional(),
  metadata: z.unknown().optional(),
});

export const cartCreateSchema = z.object({
  userId: z.string().cuid().nullable().optional(),
  status: z.nativeEnum(CartStatus).optional(),
  currency: z.string().optional(),
  items: z.array(cartItemSchema).optional(),
});

export const cartUpdateSchema = cartCreateSchema
  .extend({
    submittedAt: z.coerce.date().nullable().optional(),
    items: z.array(cartItemSchema).optional(),
  })
  .partial()
  .strict();

export const cartItemUpdateSchema = z
  .object({
    quantity: z.coerce.number().int().min(1).optional(),
    unitPrice: z.coerce.number().optional(),
    currency: z.string().optional(),
    metadata: z.unknown().optional(),
  })
  .strict();

export const cartInclude = {
  user: true,
  items: {
    include: {
      product: {
        include: productInclude,
      },
    },
  },
} satisfies Prisma.CartInclude;

type CartCreateInput = z.infer<typeof cartCreateSchema>;
type CartUpdateInput = z.infer<typeof cartUpdateSchema>;
type CartItemInput = z.infer<typeof cartItemSchema>;

const sumCartItems = (items: CartItemInput[] | undefined) =>
  (items ?? []).reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 1),
    0,
  );

const prepareCartItemCreate = (
  item: CartItemInput,
  currencyFallback: string,
) => ({
  product: { connect: { id: item.productId } },
  quantity: item.quantity ?? 1,
  unitPrice: new Prisma.Decimal(item.unitPrice),
  currency: item.currency ?? currencyFallback,
  metadata:
    item.metadata === undefined ? Prisma.JsonNull : (item.metadata as any),
});

export function buildCartCreateData(
  input: CartCreateInput,
): Prisma.CartCreateInput {
  const currency = input.currency ?? "NOK";
  const items = input.items ?? [];
  const total = sumCartItems(items);

  return {
    status: input.status ?? CartStatus.DRAFT,
    currency,
    totalAmount: new Prisma.Decimal(total),
    user:
      input.userId !== undefined
        ? input.userId
          ? { connect: { id: input.userId } }
          : undefined
        : undefined,
    items:
      items.length > 0
        ? {
            create: items.map((item) => prepareCartItemCreate(item, currency)),
          }
        : undefined,
  };
}

export function buildCartUpdateData(
  input: CartUpdateInput,
): Prisma.CartUpdateInput {
  const data: Prisma.CartUpdateInput = {};

  if (input.userId !== undefined) {
    data.user = input.userId
      ? { connect: { id: input.userId } }
      : { disconnect: true };
  }

  if (input.status !== undefined) data.status = input.status;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.submittedAt !== undefined) data.submittedAt = input.submittedAt;

  if (input.items !== undefined) {
    const currency = input.currency ?? "NOK";
    data.items = {
      deleteMany: {},
      create: (input.items ?? []).map((item) =>
        prepareCartItemCreate(item, currency),
      ),
    };
    const total = sumCartItems(input.items ?? []);
    data.totalAmount = new Prisma.Decimal(total);
  }

  return data;
}

export async function recomputeCartTotal(cartId: string) {
  const aggregates = await prisma.cartItem.findMany({
    where: { cartId },
    select: { quantity: true, unitPrice: true },
  });

  const total = aggregates.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  await prisma.cart.update({
    where: { id: cartId },
    data: { totalAmount: new Prisma.Decimal(total) },
  });

  return total;
}
