import type { Prisma } from "@prisma/client";
import {
  DiscountSource,
  PromotionDisplayStyle,
} from "@prisma/client";
import type {
  ProductCreateInput,
  ProductListQueryInput,
  ProductUpdateInput,
} from "@/lib/validators/product";

type DiscountInput = NonNullable<ProductCreateInput["discount"]>;
type ImageInput = NonNullable<ProductCreateInput["images"]>[number];
type ClassifierInput = NonNullable<ProductCreateInput["classifiers"]>[number];
type PromotionInput = NonNullable<ProductCreateInput["promotions"]>[number];

export const PRODUCT_SORT_MAP: Record<
  NonNullable<ProductListQueryInput["sort"]>,
  Prisma.ProductOrderByWithRelationInput
> = {
  latest: { createdAt: "desc" },
  priceAsc: { grossPrice: "asc" },
  priceDesc: { grossPrice: "desc" },
  name: { name: "asc" },
};

export function buildProductCreateData(
  input: ProductCreateInput,
): Prisma.ProductCreateInput {
  const categories = buildCategoriesForCreate(input.categoryIds);
  return {
    fullName: input.fullName,
    brand: input.brand,
    brandId: input.brandId ?? undefined,
    name: input.name,
    nameExtra: input.nameExtra ?? null,
    frontUrl: input.frontUrl,
    absoluteUrl: input.absoluteUrl,
    grossPrice: input.grossPrice,
    grossUnitPrice: input.grossUnitPrice,
    unitPriceQuantityAbbreviation:
      input.unitPriceQuantityAbbreviation ?? null,
    unitPriceQuantityName: input.unitPriceQuantityName ?? null,
    currency: input.currency ?? "NOK",
    isAvailable: input.isAvailable ?? undefined,
    availabilityCode: input.availabilityCode ?? undefined,
    availabilityDescription: input.availabilityDescription ?? null,
    availabilityDescriptionShort:
      input.availabilityDescriptionShort ?? null,
    metadata: input.metadata ?? undefined,
    isExemptFromThirdPartyMarketing:
      input.isExemptFromThirdPartyMarketing ?? undefined,
    bonusInfo: input.bonusInfo ?? undefined,
    primaryCategory: input.primaryCategoryId
      ? { connect: { id: input.primaryCategoryId } }
      : undefined,
    categories: categories ?? undefined,
    images: buildImagesForCreate(input.images),
    classifiers: buildClassifiersForCreate(input.classifiers),
    promotions: buildPromotionsForCreate(input.promotions),
    discount: input.discount
      ? { create: mapDiscount(input.discount) }
      : undefined,
  };
}

export function buildProductUpdateData(
  input: ProductUpdateInput,
): Prisma.ProductUpdateInput {
  const data: Prisma.ProductUpdateInput = {};

  if (input.fullName !== undefined) data.fullName = input.fullName;
  if (input.brand !== undefined) data.brand = input.brand;
  if (input.brandId !== undefined) data.brandId = input.brandId;
  if (input.name !== undefined) data.name = input.name;
  if (input.nameExtra !== undefined) data.nameExtra = input.nameExtra ?? null;
  if (input.frontUrl !== undefined) data.frontUrl = input.frontUrl;
  if (input.absoluteUrl !== undefined) data.absoluteUrl = input.absoluteUrl;
  if (input.grossPrice !== undefined) data.grossPrice = input.grossPrice;
  if (input.grossUnitPrice !== undefined)
    data.grossUnitPrice = input.grossUnitPrice;
  if (input.unitPriceQuantityAbbreviation !== undefined) {
    data.unitPriceQuantityAbbreviation =
      input.unitPriceQuantityAbbreviation ?? null;
  }
  if (input.unitPriceQuantityName !== undefined) {
    data.unitPriceQuantityName = input.unitPriceQuantityName ?? null;
  }
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.isAvailable !== undefined) data.isAvailable = input.isAvailable;
  if (input.availabilityCode !== undefined)
    data.availabilityCode = input.availabilityCode;
  if (input.availabilityDescription !== undefined) {
    data.availabilityDescription = input.availabilityDescription ?? null;
  }
  if (input.availabilityDescriptionShort !== undefined) {
    data.availabilityDescriptionShort =
      input.availabilityDescriptionShort ?? null;
  }
  if (input.metadata !== undefined) data.metadata = input.metadata ?? null;
  if (input.isExemptFromThirdPartyMarketing !== undefined) {
    data.isExemptFromThirdPartyMarketing =
      input.isExemptFromThirdPartyMarketing;
  }
  if (input.bonusInfo !== undefined) data.bonusInfo = input.bonusInfo ?? null;

  if (input.primaryCategoryId !== undefined) {
    data.primaryCategory = input.primaryCategoryId
      ? { connect: { id: input.primaryCategoryId } }
      : { disconnect: true };
  }

  if (input.categoryIds !== undefined) {
    const categories = normalizeIds(input.categoryIds);
    data.categories = {
      deleteMany: {},
      ...(categories.length
        ? {
            create: categories.map((categoryId, index) => ({
              category: { connect: { id: categoryId } },
              sortOrder: index,
            })),
          }
        : {}),
    };
  }

  const imagesUpdate = buildImagesForUpdate(input.images);
  if (imagesUpdate) data.images = imagesUpdate;

  const classifiersUpdate = buildClassifiersForUpdate(input.classifiers);
  if (classifiersUpdate) data.classifiers = classifiersUpdate;

  const promotionsUpdate = buildPromotionsForUpdate(input.promotions);
  if (promotionsUpdate) data.promotions = promotionsUpdate;

  const discountUpdate = buildDiscountForUpdate(input.discount);
  if (discountUpdate) data.discount = discountUpdate;

  return data;
}

function buildCategoriesForCreate(ids?: string[] | null) {
  if (!ids) return null;
  const normalized = normalizeIds(ids);
  if (!normalized.length) return null;
  return {
    create: normalized.map((categoryId, index) => ({
      category: { connect: { id: categoryId } },
      sortOrder: index,
    })),
  };
}

function buildImagesForCreate(images?: ProductCreateInput["images"]) {
  if (!images || !images.length) return undefined;
  return {
    create: images.map(mapImage),
  };
}

function buildImagesForUpdate(images?: ProductUpdateInput["images"]) {
  if (images === undefined) return undefined;
  return {
    deleteMany: {},
    ...(images.length ? { create: images.map(mapImage) } : {}),
  };
}

function buildClassifiersForCreate(
  classifiers?: ProductCreateInput["classifiers"],
) {
  if (!classifiers || !classifiers.length) return undefined;
  return {
    create: classifiers.map(mapClassifier),
  };
}

function buildClassifiersForUpdate(
  classifiers?: ProductUpdateInput["classifiers"],
) {
  if (classifiers === undefined) return undefined;
  return {
    deleteMany: {},
    ...(classifiers.length ? { create: classifiers.map(mapClassifier) } : {}),
  };
}

function buildPromotionsForCreate(
  promotions?: ProductCreateInput["promotions"],
) {
  if (!promotions || !promotions.length) return undefined;
  return {
    create: promotions.map(mapPromotion),
  };
}

function buildPromotionsForUpdate(
  promotions?: ProductUpdateInput["promotions"],
) {
  if (promotions === undefined) return undefined;
  return {
    deleteMany: {},
    ...(promotions.length ? { create: promotions.map(mapPromotion) } : {}),
  };
}

function buildDiscountForUpdate(
  discount?: ProductUpdateInput["discount"],
) {
  if (discount === undefined) return undefined;
  if (discount === null) return { delete: true };
  const payload = mapDiscount(discount);
  return {
    upsert: {
      create: payload,
      update: payload,
    },
  };
}

function mapImage(image: ImageInput) {
  return {
    variant: image.variant,
    largeUrl: image.largeUrl,
    largeWidth: image.largeWidth ?? null,
    largeHeight: image.largeHeight ?? null,
    thumbnailUrl: image.thumbnailUrl,
    thumbnailWidth: image.thumbnailWidth ?? null,
    thumbnailHeight: image.thumbnailHeight ?? null,
  };
}

function mapClassifier(classifier: ClassifierInput) {
  return {
    name: classifier.name,
    imageUrl: classifier.imageUrl,
    isImportant: classifier.isImportant ?? false,
    description: classifier.description ?? null,
  };
}

function mapPromotion(promotion: PromotionInput) {
  return {
    title: promotion.title,
    descriptionShort: promotion.descriptionShort ?? null,
    accessibilityText: promotion.accessibilityText ?? null,
    displayStyle: promotion.displayStyle ?? PromotionDisplayStyle.UNKNOWN,
    isPrimary: promotion.isPrimary ?? false,
  };
}

function mapDiscount(discount: DiscountInput) {
  return {
    isDiscounted: discount.isDiscounted ?? false,
    source: discount.source ?? DiscountSource.UNKNOWN,
    undiscountedGrossPrice: discount.undiscountedGrossPrice ?? null,
    undiscountedGrossUnitPrice: discount.undiscountedGrossUnitPrice ?? null,
    descriptionShort: discount.descriptionShort ?? null,
    maximumQuantity: discount.maximumQuantity ?? null,
    remainingQuantity: discount.remainingQuantity ?? null,
    activeUntil: discount.activeUntil ?? null,
    hasRelatedDiscountProducts:
      discount.hasRelatedDiscountProducts ?? false,
    isSilent: discount.isSilent ?? false,
  };
}

function normalizeIds(ids: string[]) {
  const seen = new Set<string>();
  const trimmed: string[] = [];
  for (const id of ids) {
    const value = id.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    trimmed.push(value);
  }
  return trimmed;
}
