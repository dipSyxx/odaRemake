// prisma/seed.ts
import {
  PrismaClient,
  DiscountSource,
  PromotionDisplayStyle,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // порядок видалення щоб не зловити FK
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  await prisma.promotion.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.productClassifier.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.categoryBanner.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  //
  // 1. Категорії
  //
  const fruktOgGront = await prisma.category.create({
    data: {
      slug: "20-frukt-og-gront",
      name: "Frukt og grønt",
      description: "Friske frukter og grønnsaker",
    },
  });

  const kyllingOgKjott = await prisma.category.create({
    data: {
      slug: "26-kylling-og-kjott",
      name: "Kylling og kjøtt",
      description: "Ferskt kjøtt og fjærfe",
    },
  });

  const meieriOstEgg = await prisma.category.create({
    data: {
      slug: "1283-meieri-ost-og-egg",
      name: "Meieri, ost og egg",
      description: "Melk, ost, egg og pålegg",
    },
  });

  const bakeriOgKonditori = await prisma.category.create({
    data: {
      slug: "1135-bakeri-og-konditori",
      name: "Bakeri og konditori",
      description: "Brød, rundstykker og søtbakst",
    },
  });

  const frokostblandinger = await prisma.category.create({
    data: {
      slug: "1044-frokostblandinger-og-musli",
      name: "Frokostblandinger og müsli",
      description: "Kornblandinger til frokost",
    },
  });

  // банер для fruktOgGront
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: fruktOgGront.id } },
      title: "Jippi! Vi vant NM!",
      imageUrl:
        "https://images.oda.com/campaigns/8acd7349-3c19-43cb-a63e-93ed8a6880a6.jpg",
      targetUri: "/no/inspiration/frukt-og-gront/",
      promotionTitle: "Sesong",
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  });

  //
  // 2. Продукти (5 шт)
  //

  // 1) Tomater
  const produktTomater = await prisma.product.create({
    data: {
      fullName: "Wiig Gartneri Små hverdagstomater Norge",
      brand: "Wiig Gartneri",
      name: "Små hverdagstomater",
      nameExtra: "Norge, 400 g",
      frontUrl:
        "https://oda.com/no/products/64351-wiig-gartneri-sma-hverdagstomater-norge/",
      absoluteUrl:
        "/no/products/64351-wiig-gartneri-sma-hverdagstomater-norge/",
      grossPrice: "49.00",
      grossUnitPrice: "122.50",
      unitPriceQuantityAbbreviation: "kg",
      unitPriceQuantityName: "kilogram",
      currency: "NOK",
      isAvailable: true,
      availabilityCode: "available",
      availabilityDescription: "",
      availabilityDescriptionShort: "",
      metadata: {},
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      // відношення продукт–категорія
      categories: {
        create: [
          {
            category: { connect: { id: fruktOgGront.id } },
            sortOrder: 1,
          },
        ],
      },
      images: {
        create: [
          {
            variant: "main",
            largeUrl:
              "https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg",
            largeWidth: 1000,
            largeHeight: 1000,
            thumbnailUrl:
              "https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg",
            thumbnailWidth: 300,
            thumbnailHeight: 300,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: "Norsk vare",
            imageUrl:
              "https://images.oda.com/certifications/a1af5b6c-9e98-4bb0-a667-58917f36cb38.png",
            description: "Norsk vare",
            isImportant: false,
          },
          {
            name: "Nyt Norge",
            imageUrl:
              "https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png",
            description: "Norsk kvalitetsmerke",
            isImportant: false,
          },
        ],
      },
      discount: {
        create: {
          isDiscounted: true,
          source: DiscountSource.CAMPAIGN,
          undiscountedGrossPrice: "49.00",
          undiscountedGrossUnitPrice: "122.50",
          descriptionShort: "Salg!",
          hasRelatedDiscountProducts: false,
          isSilent: false,
        },
      },
      promotions: {
        create: [
          {
            title: "2 for 89 kr",
            descriptionShort: "2 for 89 kr",
            accessibilityText: "2 for 89 kr",
            displayStyle: PromotionDisplayStyle.MIX_AND_MATCH,
            isPrimary: true,
          },
        ],
      },
    },
  });

  // 2) Plommer
  const produktPlommer = await prisma.product.create({
    data: {
      fullName: "Blå / Rød plommer i kurv",
      name: "Blå / Rød plommer",
      nameExtra: "Italia / Spania, 500 g",
      brand: null,
      frontUrl:
        "https://oda.com/no/products/23092-bla-rod-plommer-i-kurv-italia-spania/",
      absoluteUrl: "/no/products/23092-bla-rod-plommer-i-kurv-italia-spania/",
      grossPrice: "49.10",
      grossUnitPrice: "98.20",
      unitPriceQuantityAbbreviation: "kg",
      unitPriceQuantityName: "kilogram",
      currency: "NOK",
      isAvailable: true,
      availabilityCode: "available",
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [
          {
            category: { connect: { id: fruktOgGront.id } },
            sortOrder: 2,
          },
        ],
      },
      images: {
        create: [
          {
            variant: "main",
            largeUrl:
              "https://images.oda.com/local_products/feeab51c-0cb7-4141-8330-f45f118fb84e.jpg",
            largeWidth: 1000,
            largeHeight: 750,
            thumbnailUrl:
              "https://images.oda.com/local_products/feeab51c-0cb7-4141-8330-f45f118fb84e.jpg",
            thumbnailWidth: 300,
            thumbnailHeight: 225,
          },
        ],
      },
    },
  });

  // 3) Økologiske klementiner
  const produktKlementiner = await prisma.product.create({
    data: {
      fullName: "Økologiske klementiner Spania",
      name: "Klementiner",
      nameExtra: "Økologisk, ca. 750 g",
      brand: null,
      frontUrl: "https://oda.com/no/products/26721-okologiske-klementiner/",
      absoluteUrl: "/no/products/26721-okologiske-klementiner/",
      grossPrice: "39.90",
      grossUnitPrice: "53.20",
      unitPriceQuantityAbbreviation: "kg",
      unitPriceQuantityName: "kilogram",
      currency: "NOK",
      isAvailable: true,
      availabilityCode: "available",
      metadata: { organic: true },
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [
          {
            category: { connect: { id: fruktOgGront.id } },
            sortOrder: 3,
          },
        ],
      },
      images: {
        create: [
          {
            variant: "main",
            largeUrl:
              "https://images.oda.com/local_products/4b4f4d63-0a23-4b05-aca2-bfeca3f50be1.jpg",
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: "Økologisk",
            imageUrl:
              "https://oda.com/static/products/img/classifier_icons/organic.png",
            description: "Økologisk produkt",
            isImportant: true,
          },
        ],
      },
    },
  });

  // 4) Hovelsrud kyllingvinger (категорія м'ясо)
  const produktKyllingvinger = await prisma.product.create({
    data: {
      fullName: "Hovelsrud Økologiske kyllingvinger",
      brand: "Hovelsrud",
      name: "Økologiske kyllingvinger",
      nameExtra: "ca. 300 g",
      frontUrl:
        "https://oda.com/no/products/38329-hovelsrud-okologiske-kyllingvinger/",
      absoluteUrl: "/no/products/38329-hovelsrud-okologiske-kyllingvinger/",
      grossPrice: "79.90",
      grossUnitPrice: "266.33",
      unitPriceQuantityAbbreviation: "kg",
      unitPriceQuantityName: "kilogram",
      currency: "NOK",
      isAvailable: true,
      availabilityCode: "available",
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [
          {
            category: { connect: { id: kyllingOgKjott.id } },
            sortOrder: 1,
          },
        ],
      },
      images: {
        create: [
          {
            variant: "main",
            largeUrl:
              "https://images.oda.com/local_products/bb6b7240-c123-4b58-b41f-fb6b1f0ed02e.jpg",
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: "Økologisk",
            imageUrl:
              "https://oda.com/static/products/img/classifier_icons/organic.png",
            description: "Økologisk produkt",
            isImportant: false,
          },
          {
            name: "Dyrevernmerket",
            imageUrl:
              "https://images.oda.com/certifications/2fd9b918-671e-4a7a-bcd4-ac8f128db347.png",
            description: "Bedre dyrevelferd",
            isImportant: false,
          },
        ],
      },
    },
  });

  // 5) Frokostblanding (штучна, але в стилі твоїх JSON)
  const produktFrokost = await prisma.product.create({
    data: {
      fullName: "AXA Granola Jordbær",
      brand: "AXA",
      name: "Granola Jordbær",
      nameExtra: "450 g",
      frontUrl: "https://oda.com/no/products/axa-granola-jordbaer/",
      absoluteUrl: "/no/products/axa-granola-jordbaer/",
      grossPrice: "49.90",
      grossUnitPrice: "110.89",
      unitPriceQuantityAbbreviation: "kg",
      unitPriceQuantityName: "kilogram",
      currency: "NOK",
      isAvailable: true,
      availabilityCode: "available",
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [
          {
            category: { connect: { id: frokostblandinger.id } },
            sortOrder: 1,
          },
        ],
      },
      images: {
        create: [
          {
            variant: "main",
            largeUrl:
              "https://images.oda.com/products/axa-granola-jordbaer.jpg",
          },
        ],
      },
      promotions: {
        create: [
          {
            title: "Nyhet",
            descriptionShort: "Ny smak",
            accessibilityText: "Nyhet",
            displayStyle: PromotionDisplayStyle.IS_NEW,
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("Seed complete:", {
    fruktOgGront: fruktOgGront.id,
    products: [
      produktTomater.id,
      produktPlommer.id,
      produktKlementiner.id,
      produktKyllingvinger.id,
      produktFrokost.id,
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
