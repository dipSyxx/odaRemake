import { z } from 'zod'
import { CartStatus } from '@prisma/client'

const numberId = z.string().trim().min(1)
const positiveInt = z.coerce.number().int().min(1)
const decimalInput = z.coerce.number().nonnegative()

export const cartListQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  userId: numberId.optional(),
  status: z.nativeEnum(CartStatus).optional(),
})

export const cartCreateSchema = z.object({
  userId: numberId.nullable().optional(),
  status: z.nativeEnum(CartStatus).optional(),
  currency: z.string().trim().length(3).optional(),
})

export const cartUpdateSchema = z
  .object({
    status: z.nativeEnum(CartStatus).optional(),
    currency: z.string().trim().length(3).optional(),
    totalAmount: decimalInput.optional(),
  })
  .strict()

export const cartItemCreateSchema = z.object({
  productId: numberId,
  quantity: positiveInt,
  unitPrice: decimalInput,
  currency: z.string().trim().length(3).optional(),
  metadata: z.any().optional(),
})

export const cartItemUpdateSchema = z
  .object({
    quantity: positiveInt.optional(),
    unitPrice: decimalInput.optional(),
    currency: z.string().trim().length(3).optional(),
    metadata: z.any().optional(),
  })
  .strict()

export type CartListQueryInput = z.infer<typeof cartListQuerySchema>
export type CartCreateInput = z.infer<typeof cartCreateSchema>
export type CartUpdateInput = z.infer<typeof cartUpdateSchema>
export type CartItemCreateInput = z.infer<typeof cartItemCreateSchema>
export type CartItemUpdateInput = z.infer<typeof cartItemUpdateSchema>
