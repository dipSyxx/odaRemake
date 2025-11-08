// prisma/seed.ts
import { PrismaClient, DiscountSource, PromotionDisplayStyle, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 0. чистимо в правильному порядку
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()

  await prisma.promotion.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.productClassifier.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.categoryBanner.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  //
  // 1. Категорії
  //
  const fruktOgGront = await prisma.category.create({
    data: {
      slug: '20-frukt-og-gront',
      name: 'Frukt og grønt',
      description: 'Friske frukter og grønnsaker',
    },
  })

  const kyllingOgKjott = await prisma.category.create({
    data: {
      slug: '26-kylling-og-kjott',
      name: 'Kylling og kjøtt',
      description: 'Ferskt kjøtt og fjærfe',
    },
  })

  const meieriOstEgg = await prisma.category.create({
    data: {
      slug: '1283-meieri-ost-og-egg',
      name: 'Meieri, ost og egg',
      description: 'Melk, ost, egg og pålegg',
    },
  })

  const bakeriOgKonditori = await prisma.category.create({
    data: {
      slug: '1135-bakeri-og-konditori',
      name: 'Bakeri og konditori',
      description: 'Brød, rundstykker og søtbakst',
    },
  })

  const frokostblandinger = await prisma.category.create({
    data: {
      slug: '1044-frokostblandinger-og-musli',
      name: 'Frokostblandinger og müsli',
      description: 'Kornblandinger til frokost',
    },
  })

  // банер для fruktOgGront
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: fruktOgGront.id } },
      title: 'Jippi! Vi vant NM!',
      imageUrl: 'https://images.oda.com/campaigns/8acd7349-3c19-43cb-a63e-93ed8a6880a6.jpg',
      targetUri: '/no/inspiration/frukt-og-gront/',
      promotionTitle: 'Sesong',
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  })

  //
  // 2. ПРОДУКТИ
  //
  // ------------------------------
  // A. FRUKT OG GRØNT (5 шт)
  // ------------------------------
  const frukt1 = await prisma.product.create({
    data: {
      fullName: 'Wiig Gartneri Små hverdagstomater Norge',
      brand: 'Wiig Gartneri',
      name: 'Små hverdagstomater',
      nameExtra: 'Norge, 400 g',
      frontUrl: 'https://oda.com/no/products/64351-wiig-gartneri-sma-hverdagstomater-norge/',
      absoluteUrl: '/no/products/64351-wiig-gartneri-sma-hverdagstomater-norge/',
      grossPrice: '49.00',
      grossUnitPrice: '122.50',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {},
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg',
            largeWidth: 1000,
            largeHeight: 1000,
            thumbnailUrl: 'https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg',
            thumbnailWidth: 300,
            thumbnailHeight: 300,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Norsk vare',
            imageUrl: 'https://images.oda.com/certifications/a1af5b6c-9e98-4bb0-a667-58917f36cb38.png',
            description: 'Norsk vare',
            isImportant: false,
          },
        ],
      },
      discount: {
        create: {
          isDiscounted: true,
          source: DiscountSource.CAMPAIGN,
          undiscountedGrossPrice: '49.00',
          undiscountedGrossUnitPrice: '122.50',
          descriptionShort: 'Salg!',
          hasRelatedDiscountProducts: false,
          isSilent: false,
        },
      },
      promotions: {
        create: [
          {
            title: '2 for 89 kr',
            descriptionShort: '2 for 89 kr',
            accessibilityText: '2 for 89 kr',
            displayStyle: PromotionDisplayStyle.MIX_AND_MATCH,
            isPrimary: true,
          },
        ],
      },
    },
  })

  const frukt2 = await prisma.product.create({
    data: {
      fullName: 'Blå / Rød plommer i kurv',
      name: 'Blå / Rød plommer',
      nameExtra: 'Italia / Spania, 500 g',
      brand: null,
      frontUrl: 'https://oda.com/no/products/23092-bla-rod-plommer-i-kurv-italia-spania/',
      absoluteUrl: '/no/products/23092-bla-rod-plommer-i-kurv-italia-spania/',
      grossPrice: '49.10',
      grossUnitPrice: '98.20',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/feeab51c-0cb7-4141-8330-f45f118fb84e.jpg',
          },
        ],
      },
    },
  })

  const frukt3 = await prisma.product.create({
    data: {
      fullName: 'Økologiske klementiner Spania',
      name: 'Klementiner',
      nameExtra: 'Økologisk, ca. 750 g',
      brand: null,
      frontUrl: 'https://oda.com/no/products/26721-okologiske-klementiner/',
      absoluteUrl: '/no/products/26721-okologiske-klementiner/',
      grossPrice: '39.90',
      grossUnitPrice: '53.20',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: { organic: true },
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/4b4f4d63-0a23-4b05-aca2-bfeca3f50be1.jpg',
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Økologisk',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/organic.png',
            description: 'Økologisk produkt',
            isImportant: true,
          },
        ],
      },
    },
  })

  const frukt4 = await prisma.product.create({
    data: {
      fullName: 'Gala epler',
      name: 'Epler Gala',
      nameExtra: 'Sør-Europa, 1 kg',
      brand: null,
      frontUrl: 'https://oda.com/no/products/gala-epler/',
      absoluteUrl: '/no/products/gala-epler/',
      grossPrice: '34.90',
      grossUnitPrice: '34.90',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/gala-epler.jpg',
          },
        ],
      },
    },
  })

  const frukt5 = await prisma.product.create({
    data: {
      fullName: 'Isbergsalat',
      name: 'Isbergsalat',
      nameExtra: 'Norge, 1 stk',
      brand: null,
      frontUrl: 'https://oda.com/no/products/isbergsalat/',
      absoluteUrl: '/no/products/isbergsalat/',
      grossPrice: '24.90',
      grossUnitPrice: '24.90',
      unitPriceQuantityAbbreviation: 'stk',
      unitPriceQuantityName: 'stykke',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/isbergsalat.jpg',
          },
        ],
      },
    },
  })

  // ------------------------------
  // B. KYLLING OG KJØTT (5 шт)
  // ------------------------------
  const kjott1 = await prisma.product.create({
    data: {
      fullName: 'Hovelsrud Økologiske kyllingvinger',
      brand: 'Hovelsrud',
      name: 'Økologiske kyllingvinger',
      nameExtra: 'ca. 300 g',
      frontUrl: 'https://oda.com/no/products/38329-hovelsrud-okologiske-kyllingvinger/',
      absoluteUrl: '/no/products/38329-hovelsrud-okologiske-kyllingvinger/',
      grossPrice: '79.90',
      grossUnitPrice: '266.33',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/bb6b7240-c123-4b58-b41f-fb6b1f0ed02e.jpg',
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Økologisk',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/organic.png',
            description: 'Økologisk produkt',
            isImportant: false,
          },
        ],
      },
    },
  })

  const kjott2 = await prisma.product.create({
    data: {
      fullName: 'Prior Kyllingfilet naturell',
      brand: 'Prior',
      name: 'Kyllingfilet',
      nameExtra: '2 stk, 400 g',
      frontUrl: 'https://oda.com/no/products/prior-kyllingfilet/',
      absoluteUrl: '/no/products/prior-kyllingfilet/',
      grossPrice: '89.90',
      grossUnitPrice: '224.75',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/prior-kyllingfilet.jpg',
          },
        ],
      },
    },
  })

  const kjott3 = await prisma.product.create({
    data: {
      fullName: 'Fersk kjøttdeig av storfe 14% fett',
      brand: null,
      name: 'Kjøttdeig storfe',
      nameExtra: '14% fett, 400 g',
      frontUrl: 'https://oda.com/no/products/kjottdeig-storfe/',
      absoluteUrl: '/no/products/kjottdeig-storfe/',
      grossPrice: '64.90',
      grossUnitPrice: '162.25',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/kjottdeig-storfe.jpg',
          },
        ],
      },
      discount: {
        create: {
          isDiscounted: true,
          source: DiscountSource.CAMPAIGN,
          undiscountedGrossPrice: '69.90',
          undiscountedGrossUnitPrice: '174.75',
          descriptionShort: 'Ukens tilbud',
          hasRelatedDiscountProducts: false,
          isSilent: false,
        },
      },
    },
  })

  const kjott4 = await prisma.product.create({
    data: {
      fullName: 'Gilde Skivet kokt skinke',
      brand: 'Gilde',
      name: 'Skivet kokt skinke',
      nameExtra: '110 g',
      frontUrl: 'https://oda.com/no/products/gilde-skivet-kokt-skinke/',
      absoluteUrl: '/no/products/gilde-skivet-kokt-skinke/',
      grossPrice: '39.90',
      grossUnitPrice: '362.73',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/gilde-skivet-kokt-skinke.jpg',
          },
        ],
      },
    },
  })

  const kjott5 = await prisma.product.create({
    data: {
      fullName: 'Wienerpølser',
      brand: null,
      name: 'Wienerpølser',
      nameExtra: '450 g',
      frontUrl: 'https://oda.com/no/products/wienerpolser/',
      absoluteUrl: '/no/products/wienerpolser/',
      grossPrice: '39.90',
      grossUnitPrice: '88.67',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/wienerpolser.jpg',
          },
        ],
      },
    },
  })

  // ------------------------------
  // C. MEIERI, OST OG EGG (5 шт)
  // ------------------------------
  const meieri1 = await prisma.product.create({
    data: {
      fullName: 'Tine Lettmelk 0,5%',
      brand: 'TINE',
      name: 'Tine Lettmelk',
      nameExtra: '0,5%, 1 l',
      frontUrl: 'https://oda.com/no/products/446-tine-tine-lettmelk-05/',
      absoluteUrl: '/no/products/446-tine-tine-lettmelk-05/',
      grossPrice: '20.50',
      grossUnitPrice: '20.50',
      unitPriceQuantityAbbreviation: 'l',
      unitPriceQuantityName: 'liter',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/87720555-0b68-40bb-b949-14f5a704b117.jpg',
          },
        ],
      },
    },
  })

  const meieri2 = await prisma.product.create({
    data: {
      fullName: 'Q Yoghurt Jordbær',
      brand: 'Q',
      name: 'Yoghurt jordbær',
      nameExtra: '4 x 125 g',
      frontUrl: 'https://oda.com/no/products/q-yoghurt-jordbaer/',
      absoluteUrl: '/no/products/q-yoghurt-jordbaer/',
      grossPrice: '29.90',
      grossUnitPrice: '59.80',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/q-yoghurt-jordbaer.jpg',
          },
        ],
      },
    },
  })

  const meieri3 = await prisma.product.create({
    data: {
      fullName: 'Tine Norvegia Skivet',
      brand: 'TINE',
      name: 'Norvegia skivet',
      nameExtra: '500 g',
      frontUrl: 'https://oda.com/no/products/tine-norvegia-skivet/',
      absoluteUrl: '/no/products/tine-norvegia-skivet/',
      grossPrice: '89.00',
      grossUnitPrice: '178.00',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/tine-norvegia-skivet.jpg',
          },
        ],
      },
    },
  })

  const meieri4 = await prisma.product.create({
    data: {
      fullName: 'Synnøve Gresk yoghurt naturell',
      brand: 'Synnøve',
      name: 'Gresk yoghurt naturell',
      nameExtra: '350 g',
      frontUrl: 'https://oda.com/no/products/synnove-gresk-yoghurt-naturell/',
      absoluteUrl: '/no/products/synnove-gresk-yoghurt-naturell/',
      grossPrice: '24.90',
      grossUnitPrice: '71.14',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/synnove-gresk-yoghurt-naturell.jpg',
          },
        ],
      },
    },
  })

  const meieri5 = await prisma.product.create({
    data: {
      fullName: 'Prior Frokostegg 12 stk',
      brand: 'Prior',
      name: 'Egg',
      nameExtra: '12 stk',
      frontUrl: 'https://oda.com/no/products/prior-frokostegg-12-stk/',
      absoluteUrl: '/no/products/prior-frokostegg-12-stk/',
      grossPrice: '42.90',
      grossUnitPrice: '3.58',
      unitPriceQuantityAbbreviation: 'stk',
      unitPriceQuantityName: 'stykke',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/prior-frokostegg-12-stk.jpg',
          },
        ],
      },
    },
  })

  // ------------------------------
  // D. BAKERI OG KONDITORI (5 шт)
  // ------------------------------
  const bakeri1 = await prisma.product.create({
    data: {
      fullName: 'Korn Bakeri Kanelsnurrer',
      brand: 'Korn Bakeri',
      name: 'Kanelsnurrer',
      nameExtra: '580 g',
      frontUrl: 'https://oda.com/no/products/29521-korn-bakeri-kanelsnurrer/',
      absoluteUrl: '/no/products/29521-korn-bakeri-kanelsnurrer/',
      grossPrice: '79.90',
      grossUnitPrice: '137.76',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/ec72380a-aaae-4fbd-be10-a982acdc54ba.jpg',
          },
        ],
      },
    },
  })

  const bakeri2 = await prisma.product.create({
    data: {
      fullName: 'Fersk focaccia med soltørkede tomater og oliven',
      brand: null,
      name: 'Fersk focaccia',
      nameExtra: '550 g',
      frontUrl: 'https://oda.com/no/products/29400-fersk-focaccia-med-soltorkede-tomater-og-gronn-oli/',
      absoluteUrl: '/no/products/29400-fersk-focaccia-med-soltorkede-tomater-og-gronn-oli/',
      grossPrice: '54.90',
      grossUnitPrice: '99.82',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/local_products/921d9aa8-d04d-4660-a09a-e116c608539c.jpg',
          },
        ],
      },
    },
  })

  const bakeri3 = await prisma.product.create({
    data: {
      fullName: 'Ferskt loff',
      brand: null,
      name: 'Loff',
      nameExtra: '750 g',
      frontUrl: 'https://oda.com/no/products/ferskt-loff/',
      absoluteUrl: '/no/products/ferskt-loff/',
      grossPrice: '29.90',
      grossUnitPrice: '39.87',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/ferskt-loff.jpg',
          },
        ],
      },
    },
  })

  const bakeri4 = await prisma.product.create({
    data: {
      fullName: 'Grove rundstykker 6 stk',
      brand: null,
      name: 'Grove rundstykker',
      nameExtra: '6 stk',
      frontUrl: 'https://oda.com/no/products/grove-rundstykker-6-stk/',
      absoluteUrl: '/no/products/grove-rundstykker-6-stk/',
      grossPrice: '24.90',
      grossUnitPrice: '83.00',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/grove-rundstykker-6-stk.jpg',
          },
        ],
      },
    },
  })

  const bakeri5 = await prisma.product.create({
    data: {
      fullName: 'Tortillalefser 8 stk',
      brand: null,
      name: 'Tortillalefser',
      nameExtra: '8 stk',
      frontUrl: 'https://oda.com/no/products/tortillalefser-8-stk/',
      absoluteUrl: '/no/products/tortillalefser-8-stk/',
      grossPrice: '29.90',
      grossUnitPrice: '74.75',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/tortillalefser-8-stk.jpg',
          },
        ],
      },
    },
  })

  // ------------------------------
  // E. FROKOSTBLANDINGER OG MÜSLI (5 шт)
  // ------------------------------
  const frokost1 = await prisma.product.create({
    data: {
      fullName: 'AXA Granola Jordbær',
      brand: 'AXA',
      name: 'Granola Jordbær',
      nameExtra: '450 g',
      frontUrl: 'https://oda.com/no/products/axa-granola-jordbaer/',
      absoluteUrl: '/no/products/axa-granola-jordbaer/',
      grossPrice: '49.90',
      grossUnitPrice: '110.89',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/axa-granola-jordbaer.jpg',
          },
        ],
      },
      promotions: {
        create: [
          {
            title: 'Nyhet',
            descriptionShort: 'Ny smak',
            accessibilityText: 'Nyhet',
            displayStyle: PromotionDisplayStyle.IS_NEW,
            isPrimary: true,
          },
        ],
      },
    },
  })

  const frokost2 = await prisma.product.create({
    data: {
      fullName: 'Cornflakes',
      brand: "Kellogg's",
      name: 'Cornflakes',
      nameExtra: '500 g',
      frontUrl: 'https://oda.com/no/products/kelloggs-cornflakes/',
      absoluteUrl: '/no/products/kelloggs-cornflakes/',
      grossPrice: '39.90',
      grossUnitPrice: '79.80',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/kelloggs-cornflakes.jpg',
          },
        ],
      },
    },
  })

  const frokost3 = await prisma.product.create({
    data: {
      fullName: 'Weetabix original',
      brand: 'Weetabix',
      name: 'Weetabix',
      nameExtra: '24 stk',
      frontUrl: 'https://oda.com/no/products/weetabix-original/',
      absoluteUrl: '/no/products/weetabix-original/',
      grossPrice: '42.90',
      grossUnitPrice: '95.33',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/weetabix-original.jpg',
          },
        ],
      },
    },
  })

  const frokost4 = await prisma.product.create({
    data: {
      fullName: 'Müsli med frukt',
      brand: null,
      name: 'Müsli frukt',
      nameExtra: '750 g',
      frontUrl: 'https://oda.com/no/products/musli-frukt/',
      absoluteUrl: '/no/products/musli-frukt/',
      grossPrice: '36.90',
      grossUnitPrice: '49.20',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/musli-frukt.jpg',
          },
        ],
      },
    },
  })

  const frokost5 = await prisma.product.create({
    data: {
      fullName: 'Havregryn store',
      brand: 'AXA',
      name: 'Havregryn store',
      nameExtra: '1 kg',
      frontUrl: 'https://oda.com/no/products/axa-havregryn-store/',
      absoluteUrl: '/no/products/axa-havregryn-store/',
      grossPrice: '22.90',
      grossUnitPrice: '22.90',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      metadata: {},
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl: 'https://images.oda.com/products/axa-havregryn-store.jpg',
          },
        ],
      },
    },
  })

  console.log('Seed complete', {
    categories: {
      fruktOgGront: fruktOgGront.id,
      kyllingOgKjott: kyllingOgKjott.id,
      meieriOstEgg: meieriOstEgg.id,
      bakeriOgKonditori: bakeriOgKonditori.id,
      frokostblandinger: frokostblandinger.id,
    },
    counts: {
      frukt: 5,
      kjott: 5,
      meieri: 5,
      bakeri: 5,
      frokost: 5,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
