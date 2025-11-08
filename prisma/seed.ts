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

  const frokostblandinger = await prisma.category.create({
    data: {
      slug: '1044-frokostblandinger-og-musli',
      name: 'Frokostblandinger og müsli',
      description: 'Kornblandinger til frokost',
    },
  })

  const plantebasert = await prisma.category.create({
    data: {
      slug: 'plantebasert',
      name: 'Plantebasert',
      description: 'Plantebaserte produkter',
    },
  })

  const fiskOgSjomat = await prisma.category.create({
    data: {
      slug: 'fisk-og-sjomat',
      name: 'Fisk og sjømat',
      description: 'Fersk fisk og sjømat',
    },
  })

  const palegg = await prisma.category.create({
    data: {
      slug: 'palegg',
      name: 'Pålegg',
      description: 'Pålegg og smørbrød',
    },
  })

  const drikke = await prisma.category.create({
    data: {
      slug: 'drikke',
      name: 'Drikke',
      description: 'Drikkevarer',
    },
  })

  const iskremDessert = await prisma.category.create({
    data: {
      slug: 'iskrem-dessert-og-kjeks',
      name: 'Iskrem, dessert og kjeks',
      description: 'Iskrem, desserter og kjeks',
    },
  })

  const babyOgBarn = await prisma.category.create({
    data: {
      slug: 'baby-og-barn',
      name: 'Baby og barn',
      description: 'Produkter for baby og barn',
    },
  })

  const legemidler = await prisma.category.create({
    data: {
      slug: 'legemidler-og-helsekost',
      name: 'Legemidler og helsekost',
      description: 'Legemidler og helsekost',
    },
  })

  const husOgHjem = await prisma.category.create({
    data: {
      slug: 'hus-og-hjem',
      name: 'Hus og hjem',
      description: 'Produkter for hus og hjem',
    },
  })

  const dyr = await prisma.category.create({
    data: {
      slug: 'dyr',
      name: 'Dyr',
      description: 'Produkter for dyr',
    },
  })

  const bakeriOgKonditori = await prisma.category.create({
    data: {
      slug: '1135-bakeri-og-konditori',
      name: 'Bakeri og konditori',
      description: 'Brød, rundstykker og søtbakst',
    },
  })

  const meieriOstEgg = await prisma.category.create({
    data: {
      slug: '1283-meieri-ost-og-egg',
      name: 'Meieri, ost og egg',
      description: 'Melk, ost, egg og pålegg',
    },
  })

  const kyllingOgKjott = await prisma.category.create({
    data: {
      slug: '26-kylling-og-kjott',
      name: 'Kylling og kjøtt',
      description: 'Ferskt kjøtt og fjærfe',
    },
  })

  const restauranter = await prisma.category.create({
    data: {
      slug: 'restauranter',
      name: 'Restauranter',
      description: 'Restaurant og takeaway',
    },
  })

  const middager = await prisma.category.create({
    data: {
      slug: 'middager-og-tilbehor',
      name: 'Middager og tilbehør',
      description: 'Middager og tilbehør',
    },
  })

  const bakeingredienser = await prisma.category.create({
    data: {
      slug: 'bakeingredienser',
      name: 'Bakeingredienser',
      description: 'Ingredienser til baking',
    },
  })

  const sjokolade = await prisma.category.create({
    data: {
      slug: 'sjokolade-snacks-og-godteri',
      name: 'Sjokolade, snacks og godteri',
      description: 'Sjokolade, snacks og godteri',
    },
  })

  const trening = await prisma.category.create({
    data: {
      slug: 'trening',
      name: 'Trening',
      description: 'Trening og kosttilskudd',
    },
  })

  const hygiene = await prisma.category.create({
    data: {
      slug: 'hygiene-og-skjonnhet',
      name: 'Hygiene og skjønnhet',
      description: 'Hygiene og skjønnhetsprodukter',
    },
  })

  const blomster = await prisma.category.create({
    data: {
      slug: 'blomster-og-planter',
      name: 'Blomster og planter',
      description: 'Blomster og planter',
    },
  })

  const snus = await prisma.category.create({
    data: {
      slug: 'snus-og-tobakk',
      name: 'Snus og tobakk',
      description: 'Snus og tobakk',
    },
  })

  // банер для fruktOgGront
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: fruktOgGront.id } },
      title: 'Jippi! Vi vant NM!',
      imageUrl:
        'https://images.oda.com/campaigns/8acd7349-3c19-43cb-a63e-93ed8a6880a6.jpg?crop=16%3A4&fit=crop&height=400&optimize=medium&width=1600&s=0xf14b3eaf68215e9b4eca27d2ccf681552de0ab3e',
      targetUri: '/no/inspiration/frukt-og-gront/',
      promotionTitle: 'Sesong',
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  })

  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: frokostblandinger.id } },
      title: 'Alt til farsdag levert på døra',
      imageUrl:
        'https://images.oda.com/campaigns/bda5200b-647e-4810-9871-b5fb78156816.jpg?crop=16%3A4&fit=crop&height=400&optimize=medium&width=1600&s=0x9bd1e4f3b57a8b38ec845077ceebe653862ba13e',
      targetUri: 'https://oda.com/no/about/alt-til-farsdag/',
      promotionTitle: null,
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  })

  // банер для kyllingOgKjott
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: kyllingOgKjott.id } },
      title: 'Utforsk vår digre, køfrie ferskvaredisk!',
      imageUrl:
        'https://images.oda.com/campaigns/46437561-92b0-43f4-9dea-23ecad62984a.jpg?crop=16%3A4&fit=crop&height=400&optimize=medium&width=1600&s=0x488c8c06619846c6bbe040af6ad904d0f66b0f28',
      targetUri: 'https://oda.com/no/categories/3249-var-digre-ferskvaredisk/',
      promotionTitle: null,
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  })

  // банер для meieriOstEgg
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: meieriOstEgg.id } },
      title: 'Prøv Q Yoghurt – Smakfull hverdagsyoghurt!',
      imageUrl:
        'https://images.oda.com/campaigns/45431f25-d6c0-4559-805a-57dbd36c8ea8.JPG?crop=16%3A4&fit=crop&height=400&optimize=medium&width=1600&s=0x42a9a82055352e14c8b6c77da8577d34b23a196f',
      targetUri: 'https://oda.com/no/products/brand/4305-q/',
      promotionTitle: null,
      promotionStyle: PromotionDisplayStyle.UNKNOWN,
      sortOrder: 1,
    },
  })

  // банер для bakeriOgKonditori
  await prisma.categoryBanner.create({
    data: {
      category: { connect: { id: bakeriOgKonditori.id } },
      title: 'Brød fra Ida Gran-Jansen',
      imageUrl:
        'https://images.oda.com/campaigns/9cc2bdb1-b860-47cf-b50d-0ddfc3e1d624.jpg?crop=16%3A4&fit=crop&height=400&optimize=medium&width=1600&s=0xa9f2f99c4759788338df1d68f383ffac38874e4f',
      targetUri: 'https://oda.com/no/inspiration/ida-gran-jansen-brod/',
      promotionTitle: null,
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
            largeUrl:
              'https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x3e21cfd7523b4ea8055c70d6efba0568f6d594a3',
            largeWidth: 1000,
            largeHeight: 1000,
            thumbnailUrl:
              'https://images.oda.com/local_products/cd9f3d33-6855-4df3-902e-73805bc2956b.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x3e21cfd7523b4ea8055c70d6efba0568f6d594a3',
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
            largeUrl:
              'https://images.oda.com/local_products/feeab51c-0cb7-4141-8330-f45f118fb84e.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x1f0a8eb76bca234a3419f3e742b87a55dabb0a76',
            largeWidth: 1000,
            largeHeight: 1000,
            thumbnailUrl:
              'https://images.oda.com/local_products/feeab51c-0cb7-4141-8330-f45f118fb84e.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xbfcb229c96a7868fc8afa76ae28255186a3a5451',
            thumbnailWidth: 300,
            thumbnailHeight: 300,
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
            largeUrl:
              'https://images.oda.com/local_products/21fff0dc-e3e5-4914-8757-a6eaaa84ee91.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x51290231be69fbee2db8308c45fe125d58190c46',
            largeWidth: 4487,
            largeHeight: 2611,
            thumbnailUrl:
              'https://images.oda.com/local_products/21fff0dc-e3e5-4914-8757-a6eaaa84ee91.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x13924e02680157e5097712ae1b02f8ed024e9beb',
            thumbnailWidth: 4487,
            thumbnailHeight: 2611,
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
      fullName: 'Persimon/Kaki Spania',
      brand: null,
      name: 'Persimon/Kaki',
      nameExtra: 'Spania, 3 stk',
      frontUrl: 'https://oda.com/no/products/27015-persimon-kaki-spania/',
      absoluteUrl: '/no/products/27015-persimon-kaki-spania/',
      grossPrice: '40.70',
      grossUnitPrice: '50.88',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/896daa24-4264-4352-9425-ecea68f0c59c.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x19fe786c25fc65c92e20da5c3b8f8af0710918f3',
            largeWidth: 1875,
            largeHeight: 1259,
            thumbnailUrl:
              'https://images.oda.com/local_products/896daa24-4264-4352-9425-ecea68f0c59c.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xaeb47b64911a351cf0ae95a403dc345dc002ae22',
            thumbnailWidth: 1875,
            thumbnailHeight: 1259,
          },
        ],
      },
    },
  })

  const frukt5 = await prisma.product.create({
    data: {
      fullName: 'Stor Isbergsalat Nederland',
      brand: null,
      name: 'Stor Isbergsalat',
      nameExtra: 'Nederland, 1 stk',
      frontUrl: 'https://oda.com/no/products/9356-stor-isbergsalat-nederland/',
      absoluteUrl: '/no/products/9356-stor-isbergsalat-nederland/',
      grossPrice: '34.90',
      grossUnitPrice: '34.90',
      unitPriceQuantityAbbreviation: 'stk',
      unitPriceQuantityName: 'stykk',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: fruktOgGront.id } },
      categories: {
        create: [{ category: { connect: { id: fruktOgGront.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/35aada5d-fc22-460f-90c8-38832e8d0048.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x27e9fe56225c1a698a78714fc3782684af89f8f9',
            largeWidth: 4180,
            largeHeight: 3670,
            thumbnailUrl:
              'https://images.oda.com/local_products/35aada5d-fc22-460f-90c8-38832e8d0048.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x1e487843df3ed22ded0715dee40b776b9240a59e',
            thumbnailWidth: 4180,
            thumbnailHeight: 3670,
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
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/bb6b7240-c123-4b58-b41f-fb6b1f0ed02e.jpg?fit=bounds&format=auto&optimize=medium&width=572&s=0xf66a587204e0fa55a7b2c571412d273808bef1c6',
            largeWidth: 1604,
            largeHeight: 2805,
            thumbnailUrl:
              'https://images.oda.com/local_products/bb6b7240-c123-4b58-b41f-fb6b1f0ed02e.jpg?fit=bounds&format=auto&optimize=medium&width=172&s=0xfd03a7fec4448bc743ddecea595dcfb92246aacf',
            thumbnailWidth: 1604,
            thumbnailHeight: 2805,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 3 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-3.b2649eefb5d1.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 3 dager',
          },
          {
            name: 'Økologisk',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/organic.8cd2f16bb368.png',
            isImportant: false,
            description: 'Produktet er økologisk',
          },
          {
            name: 'Dyrevernmerket',
            imageUrl:
              'https://images.oda.com/certifications/2fd9b918-671e-4a7a-bcd4-ac8f128db347.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x1c8e72270ebeba8ee16f79ea6fd07730afefe37f',
            isImportant: false,
            description:
              'Når du velger mat merket med Dyrevernmerket kan du føle deg trygg på at dyrene har hatt: Bedre plass, sunnere kropp og mer aktivitet.',
          },
          {
            name: 'Spesialitet',
            imageUrl:
              'https://images.oda.com/certifications/72c78d3a-d085-4fef-a986-a16a8df452d5.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xb1c5ee3497ce4a10c8928d3ac2457a21ff9dc98d',
            isImportant: false,
            description:
              'Spesialitet er et offisielt informasjonsmerke som tildeles den beste lokalmat- og drikke. Merket skal løfte fram lokalmat- og drikke med særlige kvaliteter og gjøre den enkel å finne i butikken.',
          },
          {
            name: 'Debio Ø-merket',
            imageUrl:
              'https://images.oda.com/certifications/7d512a62-5004-4ee3-8342-da9eeceb7460.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x652f4b150f5e9eeb1d4c829ce1766f1a27e0e570',
            isImportant: false,
            description:
              'Debio er en ikke-statlig medlemsorganisasjon som kontrollerer og godkjenner økologisk produksjon i Norge, og at produkter som markedsføres med henvisning til den økologiske produksjonsmetoden, tilfredsstiller kravene i regelverket.',
          },
        ],
      },
    },
  })

  const kjott2 = await prisma.product.create({
    data: {
      fullName: 'Strøm-Larsen Svin indrefilet Renskjært',
      brand: 'Strøm-Larsen',
      name: 'Svin indrefilet',
      nameExtra: 'Renskjært, ca. 600 g',
      frontUrl: 'https://oda.com/no/products/32448-strom-larsen-svin-indrefilet-renskjaert/',
      absoluteUrl: '/no/products/32448-strom-larsen-svin-indrefilet-renskjaert/',
      grossPrice: '139.00',
      grossUnitPrice: '231.67',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/e34e570f-b72a-4d3b-988c-8ffdeb448420.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xfa895529526b29678d68c39cc6347bd0197a5b70',
            largeWidth: 6815,
            largeHeight: 4757,
            thumbnailUrl:
              'https://images.oda.com/local_products/e34e570f-b72a-4d3b-988c-8ffdeb448420.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x518c374aecad2a216d1122a153e5c81cae07377d',
            thumbnailWidth: 6815,
            thumbnailHeight: 4757,
          },
        ],
      },
    },
  })

  const kjott3 = await prisma.product.create({
    data: {
      fullName: 'Strøm-Larsen Entrecote av angus',
      brand: 'Strøm-Larsen',
      name: 'Entrecote av angus',
      nameExtra: 'ca. 400 g',
      frontUrl: 'https://oda.com/no/products/26070-strom-larsen-entrecote-av-angus/',
      absoluteUrl: '/no/products/26070-strom-larsen-entrecote-av-angus/',
      grossPrice: '232.00',
      grossUnitPrice: '580.00',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/94a6d768-d652-49b9-a4fc-4319f6c04f2e.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x5fe784c2b9dba8b9c9d7b59635b77dd6aaad04d9',
            largeWidth: 5770,
            largeHeight: 2886,
            thumbnailUrl:
              'https://images.oda.com/local_products/94a6d768-d652-49b9-a4fc-4319f6c04f2e.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x206b288e1837ca7a4c770f11f6629780d0eaaf36',
            thumbnailWidth: 5770,
            thumbnailHeight: 2886,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Veldig mør',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/very-tender.05d226cdc37b.png',
            isImportant: true,
            description: 'Vi garanterer at kjøttet er mørnet i minst 4 uker.',
          },
          {
            name: 'Holdbarhetsgaranti i 4 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-4.4f3528f72d28.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 4 dager',
          },
        ],
      },
    },
  })

  const kjott4 = await prisma.product.create({
    data: {
      fullName: 'Spekeloftet Pinnekjøtt Ekstra Kjøttfullt Av Lammesadel',
      brand: 'Spekeloftet',
      name: 'Spekeloftet Pinnekjøtt Ekstra Kjøttfullt',
      nameExtra: 'Av Lammesadel, ca. 1,7 kg',
      frontUrl: 'https://oda.com/no/products/23678-spekeloftet-spekeloftet-pinnekjott-ekstra-kjottful/',
      absoluteUrl: '/no/products/23678-spekeloftet-spekeloftet-pinnekjott-ekstra-kjottful/',
      grossPrice: '695.00',
      grossUnitPrice: '408.82',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/72128c10-d23e-4323-bc4d-9b3c0a09981e.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x28e6a5726eeaa914e4ae6161fcca83af9ba8f407',
            largeWidth: 3584,
            largeHeight: 3443,
            thumbnailUrl:
              'https://images.oda.com/local_products/72128c10-d23e-4323-bc4d-9b3c0a09981e.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xbc8e3c0052ccec2c16f8d01113bcca225b6eec80',
            thumbnailWidth: 3584,
            thumbnailHeight: 3443,
          },
        ],
      },
    },
  })

  const kjott5 = await prisma.product.create({
    data: {
      fullName: 'Gilde Stjernebacon tørrsaltet',
      brand: 'Gilde',
      name: 'Stjernebacon',
      nameExtra: 'tørrsaltet, 105 g',
      frontUrl: 'https://oda.com/no/products/24236-gilde-stjernebacon-torrsaltet/',
      absoluteUrl: '/no/products/24236-gilde-stjernebacon-torrsaltet/',
      grossPrice: '40.20',
      grossUnitPrice: '382.86',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: kyllingOgKjott.id } },
      categories: {
        create: [{ category: { connect: { id: kyllingOgKjott.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/08f7e6f2-3b61-4431-acc3-d449a8eeee37.jpg?fit=bounds&format=auto&optimize=medium&width=446&s=0x5dfbb275b4d14fcb3eaa7da01ef067d2b1c3b25a',
            largeWidth: 1565,
            largeHeight: 3510,
            thumbnailUrl:
              'https://images.oda.com/local_products/08f7e6f2-3b61-4431-acc3-d449a8eeee37.jpg?fit=bounds&format=auto&optimize=medium&width=134&s=0x7a44368924e6d3c40868d528f507933f5c0de2a7',
            thumbnailWidth: 1565,
            thumbnailHeight: 3510,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 5 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-5.503f47d76f75.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 5 dager',
          },
          {
            name: 'Nyt Norge',
            imageUrl:
              'https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773',
            isImportant: false,
            description: 'Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.',
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
      fullName: 'Tine Lettmelk 0,5% fett',
      brand: 'TINE',
      name: 'Tine Lettmelk',
      nameExtra: '0,5% fett, 1,75 l',
      frontUrl: 'https://oda.com/no/products/12079-tine-tine-lettmelk-05-fett/',
      absoluteUrl: '/no/products/12079-tine-tine-lettmelk-05-fett/',
      grossPrice: '37.90',
      grossUnitPrice: '21.66',
      unitPriceQuantityAbbreviation: 'l',
      unitPriceQuantityName: 'liter',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/87720555-0b68-40bb-b949-14f5a704b117.jpg?fit=bounds&format=auto&optimize=medium&width=394&s=0x7213d311ca7844752e760c08540248baad416086',
            largeWidth: 2734,
            largeHeight: 6935,
            thumbnailUrl:
              'https://images.oda.com/local_products/87720555-0b68-40bb-b949-14f5a704b117.jpg?fit=bounds&format=auto&optimize=medium&width=118&s=0x98dba3681a8caf4333b78381cdf63e913a61b298',
            thumbnailWidth: 2734,
            thumbnailHeight: 6935,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 5 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-5.503f47d76f75.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 5 dager',
          },
          {
            name: 'FSC',
            imageUrl:
              'https://images.oda.com/certifications/a88cd816-dfe9-42f7-aea7-d995c3950e42.png?fit=bounds&format=auto&optimize=medium&width=50&s=0x341d438a1f7a0796f1abcb79847de744e9fb9a66',
            isImportant: false,
            description: 'FSC er et globalt skogssertifiseringssystem, etablet for skogsbruk og skogsbruksprodukter',
          },
          {
            name: 'Nyt Norge',
            imageUrl:
              'https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773',
            isImportant: false,
            description: 'Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.',
          },
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const meieri2 = await prisma.product.create({
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
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/a417dc35-bf59-4c01-b045-9125d7cda656.jpg?fit=bounds&format=auto&optimize=medium&width=320&s=0x1e14026639eaf50460a9e0f0dc9a647c55158cba',
            largeWidth: 2204,
            largeHeight: 6893,
            thumbnailUrl:
              'https://images.oda.com/local_products/a417dc35-bf59-4c01-b045-9125d7cda656.jpg?fit=bounds&format=auto&optimize=medium&width=96&s=0x70d001e3e4232eb30324b5f09bf8792609530372',
            thumbnailWidth: 2204,
            thumbnailHeight: 6893,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 5 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-5.503f47d76f75.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 5 dager',
          },
          {
            name: 'FSC',
            imageUrl:
              'https://images.oda.com/certifications/a88cd816-dfe9-42f7-aea7-d995c3950e42.png?fit=bounds&format=auto&optimize=medium&width=50&s=0x341d438a1f7a0796f1abcb79847de744e9fb9a66',
            isImportant: false,
            description: 'FSC er et globalt skogssertifiseringssystem, etablet for skogsbruk og skogsbruksprodukter',
          },
          {
            name: 'Nyt Norge',
            imageUrl:
              'https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773',
            isImportant: false,
            description: 'Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.',
          },
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const meieri3 = await prisma.product.create({
    data: {
      fullName: 'TINE Gryr fyldig havredrikk',
      brand: 'TINE',
      name: 'Gryr fyldig havredrikk',
      nameExtra: '1 l',
      frontUrl: 'https://oda.com/no/products/39220-tine-gryr-fyldig-havredrikk/',
      absoluteUrl: '/no/products/39220-tine-gryr-fyldig-havredrikk/',
      grossPrice: '39.70',
      grossUnitPrice: '39.70',
      unitPriceQuantityAbbreviation: 'l',
      unitPriceQuantityName: 'liter',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/ebaa52e1-d410-4638-b0ef-4158ee1d0092.jpg?fit=bounds&format=auto&optimize=medium&width=323&s=0x520af60baf66170b65e6988e04252febef934b53',
            largeWidth: 2211,
            largeHeight: 6848,
            thumbnailUrl:
              'https://images.oda.com/local_products/ebaa52e1-d410-4638-b0ef-4158ee1d0092.jpg?fit=bounds&format=auto&optimize=medium&width=97&s=0x4a4bf48cc88b03ecc0f0190dc49519c80d45a008',
            thumbnailWidth: 2211,
            thumbnailHeight: 6848,
          },
        ],
      },
    },
  })

  const meieri4 = await prisma.product.create({
    data: {
      fullName: 'TINE Gryr naturell havredrikk',
      brand: 'TINE',
      name: 'Gryr naturell havredrikk',
      nameExtra: '1 l',
      frontUrl: 'https://oda.com/no/products/39222-tine-gryr-naturell-havredrikk/',
      absoluteUrl: '/no/products/39222-tine-gryr-naturell-havredrikk/',
      grossPrice: '39.90',
      grossUnitPrice: '39.90',
      unitPriceQuantityAbbreviation: 'l',
      unitPriceQuantityName: 'liter',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/aebe3a3d-fe75-4d15-b0dc-143cc88822e1.jpg?fit=bounds&format=auto&optimize=medium&width=323&s=0x28bfd4c37590477ef66cd6b78b7c9dcbc4b26eb6',
            largeWidth: 2211,
            largeHeight: 6848,
            thumbnailUrl:
              'https://images.oda.com/local_products/aebe3a3d-fe75-4d15-b0dc-143cc88822e1.jpg?fit=bounds&format=auto&optimize=medium&width=97&s=0x62349a97be1443cc9ef442007f716da9a82fa75c',
            thumbnailWidth: 2211,
            thumbnailHeight: 6848,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const meieri5 = await prisma.product.create({
    data: {
      fullName: 'TINE Ekte meierismør',
      brand: 'TINE',
      name: 'Ekte meierismør',
      nameExtra: '500 g',
      frontUrl: 'https://oda.com/no/products/130-tine-ekte-meierismor/',
      absoluteUrl: '/no/products/130-tine-ekte-meierismor/',
      grossPrice: '62.90',
      grossUnitPrice: '125.80',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: meieriOstEgg.id } },
      categories: {
        create: [{ category: { connect: { id: meieriOstEgg.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/a7f6c74c-7ddd-47ca-9a2d-8bf25e238fe1.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xdef80227b67c86aee3c7a9623056b5c53056997d',
            largeWidth: 6787,
            largeHeight: 4157,
            thumbnailUrl:
              'https://images.oda.com/local_products/a7f6c74c-7ddd-47ca-9a2d-8bf25e238fe1.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xd875d660c9959b582ebf435ad12415a1eb87e0e8',
            thumbnailWidth: 6787,
            thumbnailHeight: 4157,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Nyt Norge',
            imageUrl:
              'https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773',
            isImportant: false,
            description: 'Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.',
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
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/ec72380a-aaae-4fbd-be10-a982acdc54ba.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x6448e55dd531f864bb556ea5e1e6be4c21626b6e',
            largeWidth: 5132,
            largeHeight: 4776,
            thumbnailUrl:
              'https://images.oda.com/local_products/ec72380a-aaae-4fbd-be10-a982acdc54ba.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x43f057ba68599daef1c51ffcd0336c690a602898',
            thumbnailWidth: 5132,
            thumbnailHeight: 4776,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Brødskalaen - Fint brød',
            imageUrl:
              'https://images.oda.com/certifications/06be49fa-a9f9-4c23-8366-f5eea397eb65.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x876e7efb7b58844ee9450c631f23f3364e7b4391',
            isImportant: false,
            description: '0-25,9 % sammalt mel eller hele korn',
          },
        ],
      },
    },
  })

  const bakeri2 = await prisma.product.create({
    data: {
      fullName: 'Fersk focaccia Med soltørkede tomater og grønn oliven',
      brand: null,
      name: 'Fersk focaccia',
      nameExtra: 'Med soltørkede tomater og grønn oliven, 550 g',
      frontUrl: 'https://oda.com/no/products/29400-fersk-focaccia-med-soltorkede-tomater-og-gronn-oli/',
      absoluteUrl: '/no/products/29400-fersk-focaccia-med-soltorkede-tomater-og-gronn-oli/',
      grossPrice: '54.90',
      grossUnitPrice: '99.82',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/66b9ddfa-c09f-42bf-a9df-51b41411dc73.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xb7122e889fa56424f252c625cdcf081ca735fdd1',
            largeWidth: 1654,
            largeHeight: 1102,
            thumbnailUrl:
              'https://images.oda.com/local_products/66b9ddfa-c09f-42bf-a9df-51b41411dc73.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xf3bd9172374aba6666f1f866f052d949460496e4',
            thumbnailWidth: 1654,
            thumbnailHeight: 1102,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Brødskalaen - Fint brød',
            imageUrl:
              'https://images.oda.com/certifications/06be49fa-a9f9-4c23-8366-f5eea397eb65.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x876e7efb7b58844ee9450c631f23f3364e7b4391',
            isImportant: false,
            description: '0-25,9 % sammalt mel eller hele korn',
          },
        ],
      },
    },
  })

  const bakeri3 = await prisma.product.create({
    data: {
      fullName: 'Norgescatering Baguette med reker og egg',
      brand: 'Norgescatering',
      name: 'Baguette med reker og egg',
      nameExtra: '322 g',
      frontUrl: 'https://oda.com/no/products/66067-norgescatering-baguette-med-reker-og-egg/',
      absoluteUrl: '/no/products/66067-norgescatering-baguette-med-reker-og-egg/',
      grossPrice: '69.00',
      grossUnitPrice: '214.29',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available_weekdays',
      availabilityDescription: 'Tilgj. mandag—fredag',
      availabilityDescriptionShort: 'man—fre',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/504727ae-d275-4647-8f01-77daf2aa88ae.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x14ad412b271173bdfca410fc65d34b605f6296d9',
            largeWidth: 1080,
            largeHeight: 1080,
            thumbnailUrl:
              'https://images.oda.com/local_products/504727ae-d275-4647-8f01-77daf2aa88ae.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x131f56ba314b08f059730287a0ad5640467f0a53',
            thumbnailWidth: 1080,
            thumbnailHeight: 1080,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 2 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-2.50468588d601.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 2 dager',
          },
        ],
      },
    },
  })

  const bakeri4 = await prisma.product.create({
    data: {
      fullName: 'Norgescatering Horn med ost & skinke',
      brand: 'Norgescatering',
      name: 'Horn med ost & skinke',
      nameExtra: '1 stk',
      frontUrl: 'https://oda.com/no/products/66069-norgescatering-horn-med-ost-skinke/',
      absoluteUrl: '/no/products/66069-norgescatering-horn-med-ost-skinke/',
      grossPrice: '50.70',
      grossUnitPrice: '266.84',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available_weekdays',
      availabilityDescription: 'Tilgj. mandag—fredag',
      availabilityDescriptionShort: 'man—fre',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/f0243785-4e9e-424d-b5f7-f38e1f9ffe5e.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x11396c9e9fa79ee3b7ee0389fa66b6655c9b3533',
            largeWidth: 1080,
            largeHeight: 1080,
            thumbnailUrl:
              'https://images.oda.com/local_products/f0243785-4e9e-424d-b5f7-f38e1f9ffe5e.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x9a007e1bda8e3ccb977f620e6a5ad3c945207f73',
            thumbnailWidth: 1080,
            thumbnailHeight: 1080,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Holdbarhetsgaranti i 2 dager',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/expiry-2.50468588d601.png',
            isImportant: true,
            description: 'Holdbarhetsgaranti i 2 dager',
          },
        ],
      },
    },
  })

  const bakeri5 = await prisma.product.create({
    data: {
      fullName: 'Cakes by Hancock Hancock ostekake med bringebærfyll Bursdagskake Rosa, 15 cm, 4-6 porsjoner',
      brand: 'Cakes by Hancock',
      name: 'Hancock ostekake med bringebærfyll',
      nameExtra: 'Bursdagskake Rosa, 15 cm, 4-6 porsjoner, 1 stk',
      frontUrl: 'https://oda.com/no/products/57215-cakes-by-hancock-hancock-ostekake-med-bringebaerfy/',
      absoluteUrl: '/no/products/57215-cakes-by-hancock-hancock-ostekake-med-bringebaerfy/',
      grossPrice: '679.00',
      grossUnitPrice: '411.52',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: bakeriOgKonditori.id } },
      categories: {
        create: [{ category: { connect: { id: bakeriOgKonditori.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/37167cbe-6144-4fdb-bba5-df10878fa77b.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xf1ab4e1b21411e6d0db58d4e67d3e91be8d0e4b6',
            largeWidth: 1411,
            largeHeight: 1411,
            thumbnailUrl:
              'https://images.oda.com/local_products/37167cbe-6144-4fdb-bba5-df10878fa77b.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0xf49f6f0d47b9e3264538799249e8cd0b763ad44d',
            thumbnailWidth: 1411,
            thumbnailHeight: 1411,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Frysevare',
            imageUrl: 'https://oda.com/static/products/img/classifier_icons/frozen.c0e10914d59a.png',
            isImportant: true,
            description: 'Produktet er en frysevare',
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
      fullName: 'Quaker Cruesli 4 Nuts Granola',
      brand: 'Quaker',
      name: 'Cruesli 4 Nuts',
      nameExtra: 'Granola, 450 g',
      frontUrl: 'https://oda.com/no/products/120-quaker-cruesli-4-nuts-granola/',
      absoluteUrl: '/no/products/120-quaker-cruesli-4-nuts-granola/',
      grossPrice: '58.40',
      grossUnitPrice: '129.78',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 1 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/3e4339af-7be8-4f03-983c-bded47cead2a.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x561ca1be83f7d8b53df8c9d9cb3f4f66ccc5b7c2',
            largeWidth: 3000,
            largeHeight: 3000,
            thumbnailUrl:
              'https://images.oda.com/local_products/3e4339af-7be8-4f03-983c-bded47cead2a.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x2581ed2cb7b7bbcb45b85cc67721ba0ab51d8119',
            thumbnailWidth: 3000,
            thumbnailHeight: 3000,
          },
        ],
      },
    },
  })

  const frokost2 = await prisma.product.create({
    data: {
      fullName: 'Quaker Cruesli Solfrokost Granola',
      brand: 'Quaker',
      name: 'Cruesli Solfrokost',
      nameExtra: 'Granola, 450 g',
      frontUrl: 'https://oda.com/no/products/1657-quaker-cruesli-solfrokost-granola/',
      absoluteUrl: '/no/products/1657-quaker-cruesli-solfrokost-granola/',
      grossPrice: '45.80',
      grossUnitPrice: '101.78',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 2 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/3cee84d8-98c4-4333-9a91-ef4c2502bada.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x6c56e37f447dd02cc91ae6a5212888bb1fe0e44e',
            largeWidth: 2400,
            largeHeight: 2400,
            thumbnailUrl:
              'https://images.oda.com/local_products/3cee84d8-98c4-4333-9a91-ef4c2502bada.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x9fd5ccc48bb9909053ec1f1d578dd6746dbf4c19',
            thumbnailWidth: 2400,
            thumbnailHeight: 2400,
          },
        ],
      },
    },
  })

  const frokost3 = await prisma.product.create({
    data: {
      fullName: 'Axa Bjørn Lettkokte Havregryn',
      brand: 'Axa',
      name: 'Bjørn Lettkokte Havregryn',
      nameExtra: '1,1 kg',
      frontUrl: 'https://oda.com/no/products/1035-axa-bjorn-lettkokte-havregryn/',
      absoluteUrl: '/no/products/1035-axa-bjorn-lettkokte-havregryn/',
      grossPrice: '24.90',
      grossUnitPrice: '22.64',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 3 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/91631af3-3fdf-441a-8907-7219230b2785.jpg?fit=bounds&format=auto&optimize=medium&width=601&s=0x9f139849d320f866e7b426f18f499fb04b12dcb5',
            largeWidth: 2145,
            largeHeight: 3568,
            thumbnailUrl:
              'https://images.oda.com/local_products/91631af3-3fdf-441a-8907-7219230b2785.jpg?fit=bounds&format=auto&optimize=medium&width=180&s=0x3c59a89058d7c091e017f6e7ecada51bdecaf4b5',
            thumbnailWidth: 2145,
            thumbnailHeight: 3568,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const frokost4 = await prisma.product.create({
    data: {
      fullName: 'Urkraft Lettkokte Havregryn',
      brand: 'Urkraft',
      name: 'Urkraft Lettkokte Havregryn',
      nameExtra: '1,2 kg',
      frontUrl: 'https://oda.com/no/products/31457-urkraft-urkraft-lettkokte-havregryn/',
      absoluteUrl: '/no/products/31457-urkraft-urkraft-lettkokte-havregryn/',
      grossPrice: '17.50',
      grossUnitPrice: '14.58',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 4 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/a570e3dc-f12c-42e2-a5e1-87504b666dd6.jpg?fit=bounds&format=auto&optimize=medium&width=629&s=0x5ff8517e88cf0b770febd2d8d4460cf657179cfd',
            largeWidth: 3952,
            largeHeight: 6285,
            thumbnailUrl:
              'https://images.oda.com/local_products/a570e3dc-f12c-42e2-a5e1-87504b666dd6.jpg?fit=bounds&format=auto&optimize=medium&width=189&s=0x0fdb398805d5b9d63593af9c88f8274355e9b139',
            thumbnailWidth: 3952,
            thumbnailHeight: 6285,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Nyt Norge',
            imageUrl:
              'https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773',
            isImportant: false,
            description: 'Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.',
          },
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const frokost5 = await prisma.product.create({
    data: {
      fullName: 'Bare Bra Granola Kakao og Bringebær',
      brand: 'Bare Bra',
      name: 'Bare Bra Granola Kakao og Bringebær',
      nameExtra: '430 g',
      frontUrl: 'https://oda.com/no/products/28671-bare-bra-bare-bra-granola-kakao-og-bringebaer/',
      absoluteUrl: '/no/products/28671-bare-bra-bare-bra-granola-kakao-og-bringebaer/',
      grossPrice: '47.40',
      grossUnitPrice: '110.23',
      unitPriceQuantityAbbreviation: 'kg',
      unitPriceQuantityName: 'kilogram',
      currency: 'NOK',
      isAvailable: true,
      availabilityCode: 'available',
      availabilityDescription: '',
      availabilityDescriptionShort: '',
      metadata: {
        isSponsorLabeled: false,
        sourceUuid: null,
        isPromoted: null,
        placementId: null,
      },
      isExemptFromThirdPartyMarketing: false,
      bonusInfo: Prisma.JsonNull,
      primaryCategory: { connect: { id: frokostblandinger.id } },
      categories: {
        create: [{ category: { connect: { id: frokostblandinger.id } }, sortOrder: 5 }],
      },
      images: {
        create: [
          {
            variant: 'main',
            largeUrl:
              'https://images.oda.com/local_products/110befce-e668-4914-8d70-4fa781cb495f.jpg?fit=bounds&format=auto&optimize=medium&width=693&s=0x0815da6ee6f2e544dd2e4e37a0b46bd2713e7928',
            largeWidth: 3018,
            largeHeight: 4352,
            thumbnailUrl:
              'https://images.oda.com/local_products/110befce-e668-4914-8d70-4fa781cb495f.jpg?fit=bounds&format=auto&optimize=medium&width=208&s=0x049c3144f2ce5bab79fb0bbe985e40babbc3480f',
            thumbnailWidth: 3018,
            thumbnailHeight: 4352,
          },
        ],
      },
      classifiers: {
        create: [
          {
            name: 'Klodemerket',
            imageUrl:
              'https://images.oda.com/certifications/88c4253a-03cd-4d55-9c85-712ab399c185.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xf76e634ed30a41347d58e31fd8d36ec2713cc921',
            isImportant: false,
            description:
              'Klodemerket er et klimamerke for mat som viser deg hvilke produkter og retter som har et lavt klimaavtrykk. Lavt klimaavtrykk tilsvarer et bærekraftig nivå av klimapåvirkning ifølge FNs klimamål og tilsvarer ca halvparten av dagens gjennomsnittlige utslipp fra matproduksjon. I beregningen av klimaavtrykket inngår råvarer, emballasje og transport.',
          },
          {
            name: 'Nøkkelhullet',
            imageUrl:
              'https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011',
            isImportant: false,
            description:
              'Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.',
          },
        ],
      },
    },
  })

  const allCategories = await prisma.category.findMany()
  console.log('Seed complete', {
    totalCategories: allCategories.length,
    categories: allCategories.map((c) => ({ name: c.name, slug: c.slug })),
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
