import { z } from 'zod'
import { OrderStatus, PaymentStatus } from '@prisma/client'

const numberId = z.string().trim().min(1)
const decimalInput = z.coerce.number().nonnegative()

export const orderListQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  userId: numberId.optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
})

export const orderCreateSchema = z.object({
  userId: numberId.nullable().optional(),
  cartId: numberId.nullable().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  currency: z.string().trim().length(3).optional(),
  subtotal: decimalInput,
  discountTotal: decimalInput.optional(),
  shippingTotal: decimalInput.optional(),
  total: decimalInput,
  shippingAddress: z.string().trim().optional(),
  billingAddress: z.string().trim().optional(),
})

export const orderUpdateSchema = z
  .object({
    status: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    shippingAddress: z.string().trim().nullable().optional(),
    billingAddress: z.string().trim().nullable().optional(),
  })
  .strict()

export type OrderListQueryInput = z.infer<typeof orderListQuerySchema>
export type OrderCreateInput = z.infer<typeof orderCreateSchema>
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>
