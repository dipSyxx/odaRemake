import { Prisma, DiscountSource, PromotionDisplayStyle } from "@prisma/client";
import { z } from "zod";

const availabilitySchema = z
  .object({
    isAvailable: z.boolean().optional(),
    code: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    descriptionShort: z.string().nullable().optional(),
  })
  .optional();

const imageSchema = z
  .object({
    variant: z.string().optional().nullable(),
    large: z.object({
      url: z.string().url(),
      width: z.number().int().positive().optional().nullable(),
      height: z.number().int().positive().optional().nullable(),
    }),
    thumbnail: z
      .object({
        url: z.string().url(),
        width: z.number().int().positive().optional().nullable(),
        height: z.number().int().positive().optional().nullable(),
      })
      .partial()
      .optional()
      .nullable(),
  })
  .optional();

const classifierSchema = z
  .object({
    name: z.string(),
    imageUrl: z.string().url().nullable().optional(),
    isImportant: z.boolean().optional(),
    description: z.string().nullable().optional(),
  })
  .optional();

const discountSchema = z
  .object({
    id: z.number().int(),
    isDiscounted: z.boolean(),
    source: z.string().nullable().optional(),
    undiscountedGrossPrice: z.coerce.number().nullable().optional(),
    undiscountedGrossUnitPrice: z.coerce.number().nullable().optional(),
    descriptionShort: z.string().nullable().optional(),
    maximumQuantity: z.number().int().nullable().optional(),
    remainingQuantity: z.number().int().nullable().optional(),
    activeUntil: z.coerce.date().nullable().optional(),
    hasRelatedDiscountProducts: z.boolean().nullable().optional(),
    isSilent: z.boolean().nullable().optional(),
  })
  .optional();

const promotionSchema = z
  .object({
    title: z.string(),
    descriptionShort: z.string().nullable().optional(),
    accessibilityText: z.string().nullable().optional(),
    displayStyle: z.string().nullable().optional(),
    isPrimary: z.boolean().optional(),
  })
  .optional();

const baseProductSchema = z.object({
  fullName: z.string(),
  brand: z.string().nullable().optional(),
  brandId: z.number().int().nullable().optional(),
  name: z.string(),
  nameExtra: z.string().nullable().optional(),
  frontUrl: z.string().url(),
  absoluteUrl: z.string().url(),
  grossPrice: z.coerce.number(),
  grossUnitPrice: z.coerce.number(),
  unitPriceQuantityAbbreviation: z.string().nullable().optional(),
  unitPriceQuantityName: z.string().nullable().optional(),
  currency: z.string().optional(),
  availability: availabilitySchema,
  metadata: z.unknown().optional(),
  isExemptFromThirdPartyMarketing: z.boolean().optional(),
  bonusInfo: z.unknown().optional(),
  images: z.array(imageSchema).optional(),
  classifiers: z.array(classifierSchema).optional(),
  discount: discountSchema,
  promotions: z.array(promotionSchema).optional(),
});

export const productCreateSchema = baseProductSchema.extend({
  id: z.number().int(),
});

export const productUpdateSchema = baseProductSchema
  .partial()
  .extend({
    discount: z.union([discountSchema, z.null()]).optional(),
    images: z.array(imageSchema).optional(),
    classifiers: z.array(classifierSchema).optional(),
    promotions: z.array(promotionSchema).optional(),
  })
  .strict();

const promotionStyleMap: Record<string, PromotionDisplayStyle> = {
  REGULAR_DISCOUNT: PromotionDisplayStyle.REGULAR_DISCOUNT,
};

function mapPromotionStyle(
  style?: string | null,
): PromotionDisplayStyle | undefined {
  if (!style) return undefined;
  const normalized = style.replace(/[-\s]/g, "_").toUpperCase();
  return promotionStyleMap[normalized] ?? PromotionDisplayStyle.UNKNOWN;
}

const discountSourceMap: Record<string, DiscountSource> = {
  CAMPAIGN: DiscountSource.CAMPAIGN,
};

function mapDiscountSource(
  source?: string | null,
): DiscountSource | undefined {
  if (!source) return undefined;
  const normalized = source.toUpperCase();
  return discountSourceMap[normalized] ?? DiscountSource.UNKNOWN;
}

type ProductCreateInput = z.infer<typeof productCreateSchema>;
type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

const arrayOrEmpty = <T>(value: (T | undefined | null)[] | undefined) =>
  value?.filter(Boolean).map((item) => item as T) ?? [];

export function buildProductCreateData(
  input: ProductCreateInput,
): Prisma.ProductCreateInput {
  return {
    id: input.id,
    fullName: input.fullName,
    brand: input.brand ?? null,
    brandExternalId: input.brandId ?? null,
    name: input.name,
    nameExtra: input.nameExtra ?? null,
    frontUrl: input.frontUrl,
    absoluteUrl: input.absoluteUrl,
    grossPrice: new Prisma.Decimal(input.grossPrice),
    grossUnitPrice: new Prisma.Decimal(input.grossUnitPrice),
    unitPriceQuantityAbbreviation: input.unitPriceQuantityAbbreviation ?? null,
    unitPriceQuantityName: input.unitPriceQuantityName ?? null,
    currency: input.currency ?? "NOK",
    isAvailable: input.availability?.isAvailable ?? true,
    availabilityCode: input.availability?.code ?? "available",
    availabilityDescription: input.availability?.description ?? null,
    availabilityDescriptionShort: input.availability?.descriptionShort ?? null,
    metadata:
      input.metadata === undefined ? Prisma.JsonNull : (input.metadata as any),
    isExemptFromThirdPartyMarketing:
      input.isExemptFromThirdPartyMarketing ?? false,
    bonusInfo:
      input.bonusInfo === undefined ? Prisma.JsonNull : (input.bonusInfo as any),
    images:
      input.images !== undefined
        ? {
            create: arrayOrEmpty(input.images).map((image) => ({
              variant: image.variant ?? null,
              largeUrl: image.large.url,
              largeWidth: image.large.width ?? null,
              largeHeight: image.large.height ?? null,
              thumbnailUrl: image.thumbnail?.url ?? null,
              thumbnailWidth: image.thumbnail?.width ?? null,
              thumbnailHeight: image.thumbnail?.height ?? null,
            })),
          }
        : undefined,
    classifiers:
      input.classifiers !== undefined
        ? {
            create: arrayOrEmpty(input.classifiers).map((classifier) => ({
              name: classifier.name,
              imageUrl: classifier.imageUrl ?? null,
              isImportant: classifier.isImportant ?? false,
              description: classifier.description ?? null,
            })),
          }
        : undefined,
    discount: input.discount
      ? {
          create: {
            id: input.discount.id,
            isDiscounted: input.discount.isDiscounted,
            source: mapDiscountSource(input.discount.source) ?? DiscountSource.UNKNOWN,
            undiscountedGrossPrice:
              input.discount.undiscountedGrossPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossPrice)
                : null,
            undiscountedGrossUnitPrice:
              input.discount.undiscountedGrossUnitPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossUnitPrice)
                : null,
            descriptionShort: input.discount.descriptionShort ?? null,
            maximumQuantity: input.discount.maximumQuantity ?? null,
            remainingQuantity: input.discount.remainingQuantity ?? null,
            activeUntil: input.discount.activeUntil ?? null,
            hasRelatedDiscountProducts:
              input.discount.hasRelatedDiscountProducts ?? null,
            isSilent: input.discount.isSilent ?? null,
          },
        }
      : undefined,
    promotions:
      input.promotions !== undefined
        ? {
            create: arrayOrEmpty(input.promotions).map((promotion, index) => ({
              title: promotion.title,
              descriptionShort: promotion.descriptionShort ?? null,
              accessibilityText: promotion.accessibilityText ?? null,
              displayStyle:
                mapPromotionStyle(promotion.displayStyle) ??
                PromotionDisplayStyle.UNKNOWN,
              isPrimary: promotion.isPrimary ?? index === 0,
            })),
          }
        : undefined,
  };
}

export function buildProductUpdateData(
  input: ProductUpdateInput,
): Prisma.ProductUpdateInput {
  const data: Prisma.ProductUpdateInput = {};

  if (input.fullName !== undefined) data.fullName = input.fullName;
  if (input.brand !== undefined) data.brand = input.brand ?? null;
  if (input.brandId !== undefined)
    data.brandExternalId = input.brandId ?? null;
  if (input.name !== undefined) data.name = input.name;
  if (input.nameExtra !== undefined) data.nameExtra = input.nameExtra ?? null;
  if (input.frontUrl !== undefined) data.frontUrl = input.frontUrl;
  if (input.absoluteUrl !== undefined) data.absoluteUrl = input.absoluteUrl;
  if (input.grossPrice !== undefined)
    data.grossPrice = new Prisma.Decimal(input.grossPrice);
  if (input.grossUnitPrice !== undefined)
    data.grossUnitPrice = new Prisma.Decimal(input.grossUnitPrice);
  if (input.unitPriceQuantityAbbreviation !== undefined)
    data.unitPriceQuantityAbbreviation =
      input.unitPriceQuantityAbbreviation ?? null;
  if (input.unitPriceQuantityName !== undefined)
    data.unitPriceQuantityName = input.unitPriceQuantityName ?? null;
  if (input.currency !== undefined) data.currency = input.currency;

  if (input.availability !== undefined) {
    data.isAvailable = input.availability?.isAvailable ?? true;
    data.availabilityCode = input.availability?.code ?? "available";
    data.availabilityDescription =
      input.availability?.description ?? null;
    data.availabilityDescriptionShort =
      input.availability?.descriptionShort ?? null;
  }

  if (input.metadata !== undefined) {
    data.metadata =
      input.metadata === null
        ? Prisma.JsonNull
        : ((input.metadata as unknown) ?? Prisma.JsonNull);
  }

  if (input.isExemptFromThirdPartyMarketing !== undefined) {
    data.isExemptFromThirdPartyMarketing =
      input.isExemptFromThirdPartyMarketing;
  }

  if (input.bonusInfo !== undefined) {
    data.bonusInfo =
      input.bonusInfo === null
        ? Prisma.JsonNull
        : ((input.bonusInfo as unknown) ?? Prisma.JsonNull);
  }

  if (input.images !== undefined) {
    data.images = {
      deleteMany: {},
      create: arrayOrEmpty(input.images).map((image) => ({
        variant: image.variant ?? null,
        largeUrl: image.large.url,
        largeWidth: image.large.width ?? null,
        largeHeight: image.large.height ?? null,
        thumbnailUrl: image.thumbnail?.url ?? null,
        thumbnailWidth: image.thumbnail?.width ?? null,
        thumbnailHeight: image.thumbnail?.height ?? null,
      })),
    };
  }

  if (input.classifiers !== undefined) {
    data.classifiers = {
      deleteMany: {},
      create: arrayOrEmpty(input.classifiers).map((classifier) => ({
        name: classifier.name,
        imageUrl: classifier.imageUrl ?? null,
        isImportant: classifier.isImportant ?? false,
        description: classifier.description ?? null,
      })),
    };
  }

  if (input.discount !== undefined) {
    if (input.discount === null) {
      data.discount = { delete: true };
    } else {
      data.discount = {
        upsert: {
          update: {
            isDiscounted: input.discount.isDiscounted,
            source:
              mapDiscountSource(input.discount.source) ??
              DiscountSource.UNKNOWN,
            undiscountedGrossPrice:
              input.discount.undiscountedGrossPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossPrice)
                : null,
            undiscountedGrossUnitPrice:
              input.discount.undiscountedGrossUnitPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossUnitPrice)
                : null,
            descriptionShort: input.discount.descriptionShort ?? null,
            maximumQuantity: input.discount.maximumQuantity ?? null,
            remainingQuantity: input.discount.remainingQuantity ?? null,
            activeUntil: input.discount.activeUntil ?? null,
            hasRelatedDiscountProducts:
              input.discount.hasRelatedDiscountProducts ?? null,
            isSilent: input.discount.isSilent ?? null,
          },
          create: {
            id: input.discount.id,
            isDiscounted: input.discount.isDiscounted,
            source:
              mapDiscountSource(input.discount.source) ??
              DiscountSource.UNKNOWN,
            undiscountedGrossPrice:
              input.discount.undiscountedGrossPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossPrice)
                : null,
            undiscountedGrossUnitPrice:
              input.discount.undiscountedGrossUnitPrice !== undefined
                ? new Prisma.Decimal(input.discount.undiscountedGrossUnitPrice)
                : null,
            descriptionShort: input.discount.descriptionShort ?? null,
            maximumQuantity: input.discount.maximumQuantity ?? null,
            remainingQuantity: input.discount.remainingQuantity ?? null,
            activeUntil: input.discount.activeUntil ?? null,
            hasRelatedDiscountProducts:
              input.discount.hasRelatedDiscountProducts ?? null,
            isSilent: input.discount.isSilent ?? null,
          },
        },
      };
    }
  }

  if (input.promotions !== undefined) {
    data.promotions = {
      deleteMany: {},
      create: arrayOrEmpty(input.promotions).map((promotion, index) => ({
        title: promotion.title,
        descriptionShort: promotion.descriptionShort ?? null,
        accessibilityText: promotion.accessibilityText ?? null,
        displayStyle:
          mapPromotionStyle(promotion.displayStyle) ??
          PromotionDisplayStyle.UNKNOWN,
        isPrimary: promotion.isPrimary ?? index === 0,
      })),
    };
  }

  return data;
}

export const productInclude = {
  images: true,
  classifiers: true,
  discount: true,
  promotions: true,
} satisfies Prisma.ProductInclude;
