import { z } from "zod";

export const categoryListQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
  includeChildren: z.coerce.boolean().optional(),
  includeParent: z.coerce.boolean().optional(),
  includeProducts: z.coerce.boolean().optional(),
  parentId: z.string().trim().min(1).optional(),
  rootOnly: z.coerce.boolean().optional(),
  productsLimit: z.coerce.number().int().min(1).max(50).optional(),
});

export const categoryCreateSchema = z.object({
  slug: z.string().trim().min(2),
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().trim().min(1).nullable().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();
export const categoryDetailQuerySchema = categoryListQuerySchema.pick({
  includeChildren: true,
  includeParent: true,
  includeProducts: true,
  productsLimit: true,
});

export type CategoryListQueryInput = z.infer<typeof categoryListQuerySchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
