import type { Prisma } from '@prisma/client'
import { productWithRelations } from '@/lib/serializers'
import { cartInclude } from '../carts/helpers'

export const orderInclude = {
  items: {
    include: {
      product: {
        include: productWithRelations,
      },
    },
  },
  user: true,
  cart: {
    include: cartInclude,
  },
} satisfies Prisma.OrderInclude
