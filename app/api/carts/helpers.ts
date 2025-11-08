import type { Prisma } from '@prisma/client'
import { productWithRelations } from '@/lib/serializers'

export const cartInclude = {
  items: {
    include: {
      product: {
        include: productWithRelations,
      },
    },
  },
  user: true,
} satisfies Prisma.CartInclude
