import { z } from "zod";
import { DiscountSource, PromotionDisplayStyle } from "@prisma/client";

const numberId = z.string().trim().min(1);
const positiveInt = z.coerce.number().int().min(0);
const decimalInput = z.coerce.number().nonnegative();

const productImageSchema = z.object({
  variant: z.string().trim().optional(),
  largeUrl: z.string().trim().url(),
  largeWidth: positiveInt.nullable().optional(),
  largeHeight: positiveInt.nullable().optional(),
  thumbnailUrl: z.string().trim().url().optional(),
  thumbnailWidth: positiveInt.nullable().optional(),
  thumbnailHeight: positiveInt.nullable().optional(),
});

const productClassifierSchema = z.object({
  name: z.string().trim().min(1),
  imageUrl: z.string().trim().url().optional(),
  isImportant: z.boolean().optional(),
  description: z.string().trim().optional(),
});

const productPromotionSchema = z.object({
  title: z.string().trim().min(1),
  descriptionShort: z.string().trim().nullable().optional(),
  accessibilityText: z.string().trim().nullable().optional(),
  displayStyle: z.nativeEnum(PromotionDisplayStyle).optional(),
  isPrimary: z.boolean().optional(),
});

const productDiscountSchema = z
  .object({
    isDiscounted: z.boolean().optional(),
    source: z.nativeEnum(DiscountSource).optional(),
    undiscountedGrossPrice: decimalInput.nullable().optional(),
    undiscountedGrossUnitPrice: decimalInput.nullable().optional(),
    descriptionShort: z.string().trim().nullable().optional(),
    maximumQuantity: positiveInt.nullable().optional(),
    remainingQuantity: positiveInt.nullable().optional(),
    activeUntil: z.coerce.date().optional().nullable(),
    hasRelatedDiscountProducts: z.boolean().optional(),
    isSilent: z.boolean().optional(),
  })
  .strict();

const baseProductSchema = z.object({
  fullName: z.string().trim().min(2),
  brand: z.string().trim().min(1).optional(),
  brandId: positiveInt.nullable().optional(),
  name: z.string().trim().min(1),
  nameExtra: z.string().trim().optional(),
  frontUrl: z.string().trim().url(),
  absoluteUrl: z.string().trim().min(1),
  grossPrice: decimalInput,
  grossUnitPrice: decimalInput,
  unitPriceQuantityAbbreviation: z.string().trim().optional(),
  unitPriceQuantityName: z.string().trim().optional(),
  currency: z.string().trim().length(3).optional(),
  isAvailable: z.boolean().optional(),
  availabilityCode: z.string().trim().min(1).optional(),
  availabilityDescription: z.string().trim().optional(),
  availabilityDescriptionShort: z.string().trim().optional(),
  metadata: z.any().optional(),
  isExemptFromThirdPartyMarketing: z.boolean().optional(),
  bonusInfo: z.any().optional(),
  primaryCategoryId: numberId.nullable().optional(),
  categoryIds: z.array(numberId).optional(),
  images: z.array(productImageSchema).optional(),
  classifiers: z.array(productClassifierSchema).optional(),
  promotions: z.array(productPromotionSchema).optional(),
  discount: productDiscountSchema.nullable().optional(),
});

export const productCreateSchema = baseProductSchema;
export const productUpdateSchema = baseProductSchema.partial();

export const productListQuerySchema = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().min(1).optional(),
  categoryId: numberId.optional(),
  isAvailable: z.coerce.boolean().optional(),
  sort: z.enum(["latest", "priceAsc", "priceDesc", "name"]).optional(),
  minPrice: decimalInput.optional(),
  maxPrice: decimalInput.optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
