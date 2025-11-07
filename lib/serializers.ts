import type {
  Category,
  Cart,
  CartItem,
  Discount,
  Product,
  ProductClassifier,
  ProductImage,
  ProductCategory,
  Promotion,
  User,
} from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";
import type { Prisma } from "@prisma/client";

export const productWithRelations = {
  images: true,
  classifiers: true,
  discount: true,
  promotions: true,
} satisfies Prisma.ProductInclude;

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
export type CategoryWithRelations = Category & {
  parent?: Category | null;
  children?: Category[];
  products?: (ProductCategory & {
    product?: ProductWithRelations | null;
  })[];
  _count?: {
    products?: number;
    children?: number;
  };
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

export function serializeCategory(category: CategoryWithRelations) {
  const productCountFromRelation =
    category.products?.length ?? category._count?.products ?? null;
  const childCountFromRelation =
    category.children?.length ?? category._count?.children ?? null;

  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    parent: category.parent
      ? {
          id: category.parent.id,
          name: category.parent.name,
          slug: category.parent.slug,
        }
      : null,
    productCount: productCountFromRelation,
    childCount: childCountFromRelation,
    children: category.children
      ? category.children.map((child) => ({
          id: child.id,
          slug: child.slug,
          name: child.name,
          description: child.description,
          imageUrl: child.imageUrl,
          parentId: child.parentId,
          createdAt: child.createdAt.toISOString(),
          updatedAt: child.updatedAt.toISOString(),
        }))
      : undefined,
    products: category.products
      ? category.products.map((link) => ({
          categoryId: link.categoryId,
          productId: link.productId,
          sortOrder: link.sortOrder,
          product: link.product ? serializeProduct(link.product) : null,
        }))
      : undefined,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export type SerializedProduct = ReturnType<typeof serializeProduct>;
export type SerializedCategory = ReturnType<typeof serializeCategory>;

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
    phone: user.phone ?? null,
    address: user.address ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
