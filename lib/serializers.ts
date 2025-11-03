import type {
  Cart,
  CartItem,
  Discount,
  Product,
  ProductClassifier,
  ProductImage,
  Promotion,
  User,
} from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

export function decimalToNumber(
  value: Decimal | number | string | null | undefined,
): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  try {
    return value.toNumber();
  } catch {
    const str = value.toString();
    const parsed = Number(str);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

export type ProductWithRelations = Product & {
  images: ProductImage[];
  classifiers: ProductClassifier[];
  discount: Discount | null;
  promotions: Promotion[];
};

export function serializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    fullName: product.fullName,
    brand: product.brand,
    brandExternalId: product.brandExternalId,
    name: product.name,
    nameExtra: product.nameExtra,
    frontUrl: product.frontUrl,
    absoluteUrl: product.absoluteUrl,
    grossPrice: decimalToNumber(product.grossPrice),
    grossUnitPrice: decimalToNumber(product.grossUnitPrice),
    unitPriceQuantityAbbreviation: product.unitPriceQuantityAbbreviation,
    unitPriceQuantityName: product.unitPriceQuantityName,
    currency: product.currency,
    availability: {
      isAvailable: product.isAvailable,
      code: product.availabilityCode,
      description: product.availabilityDescription,
      descriptionShort: product.availabilityDescriptionShort,
    },
    metadata: product.metadata,
    isExemptFromThirdPartyMarketing: product.isExemptFromThirdPartyMarketing,
    bonusInfo: product.bonusInfo,
    images: product.images.map((img) => ({
      id: img.id,
      variant: img.variant,
      large: {
        url: img.largeUrl,
        width: img.largeWidth,
        height: img.largeHeight,
      },
      thumbnail: img.thumbnailUrl
        ? {
            url: img.thumbnailUrl,
            width: img.thumbnailWidth,
            height: img.thumbnailHeight,
          }
        : null,
      createdAt: img.createdAt.toISOString(),
      updatedAt: img.updatedAt.toISOString(),
    })),
    classifiers: product.classifiers.map((classifier) => ({
      id: classifier.id,
      name: classifier.name,
      imageUrl: classifier.imageUrl,
      isImportant: classifier.isImportant,
      description: classifier.description,
    })),
    discount: product.discount
      ? {
          id: product.discount.id,
          isDiscounted: product.discount.isDiscounted,
          source: product.discount.source,
          undiscountedGrossPrice: decimalToNumber(
            product.discount.undiscountedGrossPrice,
          ),
          undiscountedGrossUnitPrice: decimalToNumber(
            product.discount.undiscountedGrossUnitPrice,
          ),
          descriptionShort: product.discount.descriptionShort,
          maximumQuantity: product.discount.maximumQuantity,
          remainingQuantity: product.discount.remainingQuantity,
          activeUntil: product.discount.activeUntil
            ? product.discount.activeUntil.toISOString()
            : null,
          hasRelatedDiscountProducts:
            product.discount.hasRelatedDiscountProducts,
          isSilent: product.discount.isSilent,
        }
      : null,
    promotions: product.promotions.map((promotion) => ({
      id: promotion.id,
      title: promotion.title,
      descriptionShort: promotion.descriptionShort,
      accessibilityText: promotion.accessibilityText,
      displayStyle: promotion.displayStyle,
      isPrimary: promotion.isPrimary,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export type CartItemWithProduct = CartItem & {
  product?: ProductWithRelations | null;
};

export type CartWithRelations = Cart & {
  items: CartItemWithProduct[];
  user: User | null;
};

export function serializeCart(cart: CartWithRelations) {
  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: decimalToNumber(item.unitPrice),
    currency: item.currency,
    metadata: item.metadata,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    product: item.product ? serializeProduct(item.product) : null,
  }));

  const computedTotal = items.reduce((sum, item) => {
    const unitPrice = item.unitPrice ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    status: cart.status,
    currency: cart.currency,
    totalAmount:
      decimalToNumber(cart.totalAmount) ?? Number(computedTotal.toFixed(2)),
    computedTotal,
    submittedAt: cart.submittedAt ? cart.submittedAt.toISOString() : null,
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    user: cart.user ? serializeUser(cart.user) : null,
    items,
  };
}

export function serializeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
