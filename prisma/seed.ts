import {
  PrismaClient,
  DiscountSource,
  PromotionDisplayStyle,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  // 1) Populært
  {
    id: 66895,
    fullName:
      "Ytterøy Kyllingfilet naturell Saktevoksende kylling - opptint råvare",
    brand: "Ytterøy",
    brandExternalId: 4260,
    name: "Kyllingfilet naturell",
    nameExtra: "Saktevoksende kylling - opptint råvare, 950 g",
    frontUrl:
      "https://oda.com/no/products/66895-ytteroy-kyllingfilet-naturell-saktevoksende-kyllin/",
    absoluteUrl:
      "/no/products/66895-ytteroy-kyllingfilet-naturell-saktevoksende-kyllin/",
    grossPrice: "127.28",
    grossUnitPrice: "133.98",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/2e7aaeb1-bd56-4107-910f-5275ec996032.jpg?fit=bounds&format=auto&optimize=medium&width=787&s=0x31ec9857fb4dceb46f1861e67e31dd77f2dcfa5d",
        isLarge: true,
        width: 3070,
        height: 3903,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/2e7aaeb1-bd56-4107-910f-5275ec996032.jpg?fit=bounds&format=auto&optimize=medium&width=236&s=0xdcca0cfcd854e21e8b00c9e54bd06e191025d932",
        isLarge: false,
        width: 3070,
        height: 3903,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Holdbarhetsgaranti i 5 dager",
        imageUrl:
          "https://oda.com/static/products/img/classifier_icons/expiry-5.503f47d76f75.png",
        isImportant: true,
        description: "Holdbarhetsgaranti i 5 dager",
      },
      {
        name: "Nyt Norge",
        imageUrl:
          "https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773",
        isImportant: false,
        description:
          "Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.",
      },
    ],
    discount: {
      isDiscounted: true,
      discountSource: DiscountSource.CAMPAIGN,
      discountExternalId: 37589600,
      undiscountedGrossPrice: "169.70",
      undiscountedGrossUnitPrice: "178.63",
      descriptionShort: "-25%",
      maximumQuantity: 10,
      remainingQuantity: null,
      activeUntil: null,
      hasRelatedDiscountProducts: false,
      isSilent: false,
    },
    promotions: [
      {
        title: "-25%",
        descriptionShort: "Salg! -25%",
        accessibilityText: "Salg! -25%",
        displayStyle: PromotionDisplayStyle.REGULAR_DISCOUNT,
        isPrimary: true,
      },
    ],
  },
  {
    id: 28159,
    fullName: "Mutti Pizzasaus Med oregano og basilikum",
    brand: "Mutti",
    brandExternalId: 854,
    name: "Pizzasaus",
    nameExtra: "Med oregano og basilikum, 400 g",
    frontUrl:
      "https://oda.com/no/products/28159-mutti-pizzasaus-med-oregano-og-basilikum/",
    absoluteUrl: "/no/products/28159-mutti-pizzasaus-med-oregano-og-basilikum/",
    grossPrice: "23.44",
    grossUnitPrice: "58.60",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/baf510c2-9ca9-458c-8e29-baad3e2c7705.jpg?fit=bounds&format=auto&optimize=medium&width=603&s=0x60d833f381fd4da3242cf502e0c545c624df8fa9",
        isLarge: true,
        width: 3017,
        height: 5000,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/baf510c2-9ca9-458c-8e29-baad3e2c7705.jpg?fit=bounds&format=auto&optimize=medium&width=181&s=0x619464cb60f9d7778b87ebe6177e37fd5986f63b",
        isLarge: false,
        width: 3017,
        height: 5000,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: {
      isDiscounted: true,
      discountSource: DiscountSource.CAMPAIGN,
      discountExternalId: 37564727,
      undiscountedGrossPrice: "29.30",
      undiscountedGrossUnitPrice: "73.25",
      descriptionShort: "-20%",
      maximumQuantity: null,
      remainingQuantity: null,
      activeUntil: null,
      hasRelatedDiscountProducts: false,
      isSilent: false,
    },
    promotions: [
      {
        title: "-20%",
        descriptionShort: "Salg! -20%",
        accessibilityText: "Salg! -20%",
        displayStyle: PromotionDisplayStyle.REGULAR_DISCOUNT,
        isPrimary: true,
      },
    ],
  },
  {
    id: 817,
    fullName: "TINE Go'morgen jordbæryoghurt Med müsli",
    brand: "TINE",
    brandExternalId: 4376,
    name: "Go'morgen jordbæryoghurt",
    nameExtra: "Med müsli, 190 g",
    frontUrl:
      "https://oda.com/no/products/817-tine-gomorgen-jordbaeryoghurt-med-musli/",
    absoluteUrl: "/no/products/817-tine-gomorgen-jordbaeryoghurt-med-musli/",
    grossPrice: "11.90",
    grossUnitPrice: "62.63",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/a25207bd-5ec5-4669-91b3-e71042c58798.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0xbad073a5027c1ff423d4120df2e4d6163ef10fc6",
        isLarge: true,
        width: 4880,
        height: 4045,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/a25207bd-5ec5-4669-91b3-e71042c58798.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x32931c9fa48e79aed0ceea0119c34940f777ee08",
        isLarge: false,
        width: 4880,
        height: 4045,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: null,
    promotions: [],
  },
  {
    id: 51400,
    fullName: "Knoll Småpoteter Norge",
    brand: "Knoll",
    brandExternalId: 2736,
    name: "Knoll Småpoteter",
    nameExtra: "Norge, 650 g",
    frontUrl: "https://oda.com/no/products/51400-knoll-knoll-smapoteter-norge/",
    absoluteUrl: "/no/products/51400-knoll-knoll-smapoteter-norge/",
    grossPrice: "21.60",
    grossUnitPrice: "33.23",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/a89b14fb-535c-4b61-9bd5-16626f5123d8.jpg?fit=bounds&format=auto&optimize=medium&width=750&s=0xd5689aed207d018056cdeb35f1fbf22c3343fb03",
        isLarge: true,
        width: 750,
        height: 788,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/a89b14fb-535c-4b61-9bd5-16626f5123d8.jpg?fit=bounds&format=auto&optimize=medium&width=286&s=0x96125c787d4046d3de18e93ed19bf12af343028f",
        isLarge: false,
        width: 750,
        height: 788,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Norsk vare",
        imageUrl:
          "https://images.oda.com/certifications/a1af5b6c-9e98-4bb0-a667-58917f36cb38.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x892179f2dd971370b4599e34e7311b4446f477de",
        isImportant: false,
        description: "Norsk vare",
      },
    ],
    discount: {
      isDiscounted: true,
      discountSource: DiscountSource.CAMPAIGN,
      discountExternalId: 37609483,
      undiscountedGrossPrice: "34.90",
      undiscountedGrossUnitPrice: "53.69",
      descriptionShort: "Salg!",
      maximumQuantity: 5,
      remainingQuantity: null,
      activeUntil: null,
      hasRelatedDiscountProducts: false,
      isSilent: true,
    },
    promotions: [
      {
        title: "Salg!",
        descriptionShort: "Salg! Salg!",
        accessibilityText: "Salg! Salg!",
        displayStyle: PromotionDisplayStyle.REGULAR_DISCOUNT,
        isPrimary: true,
      },
    ],
  },
  {
    id: 40162,
    fullName: "Liten Søtpotet Spania / Egypt",
    brand: null,
    brandExternalId: null,
    name: "Liten Søtpotet",
    nameExtra: "Maks 2 per kunde, Spania / Egypt, 1 stk",
    frontUrl: "https://oda.com/no/products/40162-liten-sotpotet-spania-egypt/",
    absoluteUrl: "/no/products/40162-liten-sotpotet-spania-egypt/",
    grossPrice: "3.90",
    grossUnitPrice: "17.73",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/55c045d7-8ef9-49f7-bda4-0168a044d0ea.jpg?fit=bounds&format=auto&optimize=medium&width=1000&s=0x5b51ab691768180f7683744b6aee55164cf21264",
        isLarge: true,
        width: 1000,
        height: 749,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/55c045d7-8ef9-49f7-bda4-0168a044d0ea.jpg?fit=bounds&format=auto&optimize=medium&width=300&s=0x976ff295dd4f8bcc036118bd444b6698ed3b0f57",
        isLarge: false,
        width: 1000,
        height: 749,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: {
      isDiscounted: true,
      discountSource: DiscountSource.CAMPAIGN,
      discountExternalId: 37603395,
      undiscountedGrossPrice: "7.20",
      undiscountedGrossUnitPrice: "32.73",
      descriptionShort: "Salg!",
      maximumQuantity: 2,
      remainingQuantity: null,
      activeUntil: null,
      hasRelatedDiscountProducts: false,
      isSilent: true,
    },
    promotions: [
      {
        title: "Salg!",
        descriptionShort: "Salg! Salg!",
        accessibilityText: "Salg! Salg!",
        displayStyle: PromotionDisplayStyle.REGULAR_DISCOUNT,
        isPrimary: true,
      },
    ],
  },
  {
    id: 17722,
    fullName: "Q Melk Lett",
    brand: "Q",
    brandExternalId: 4305,
    name: "Q Melk Lett",
    nameExtra: "1,75 l",
    frontUrl: "https://oda.com/no/products/17722-q-q-melk-lett/",
    absoluteUrl: "/no/products/17722-q-q-melk-lett/",
    grossPrice: "38.60",
    grossUnitPrice: "22.06",
    unitPriceQuantityAbbreviation: "l",
    unitPriceQuantityName: "liter",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/4676e59e-694c-49a3-9d13-55252ad93720.jpg?fit=bounds&format=auto&optimize=medium&width=407&s=0x1228d8410d11a17acf7382f6e1d8c0d727a6d7aa",
        isLarge: true,
        width: 2350,
        height: 5777,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/4676e59e-694c-49a3-9d13-55252ad93720.jpg?fit=bounds&format=auto&optimize=medium&width=122&s=0xbe048872f868693baac55d331fcc58a2d53a62f9",
        isLarge: false,
        width: 2350,
        height: 5777,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Holdbarhetsgaranti i 5 dager",
        imageUrl:
          "https://oda.com/static/products/img/classifier_icons/expiry-5.503f47d76f75.png",
        isImportant: true,
        description: "Holdbarhetsgaranti i 5 dager",
      },
    ],
    discount: null,
    promotions: [],
  },

  // 2) Nytt i butikken
  {
    id: 68077,
    fullName: "Bladcentralen Pondus julehefte Julen 2025",
    brand: "Bladcentralen",
    brandExternalId: 3949,
    name: "Pondus julehefte",
    nameExtra: "Julen 2025, 1 stk",
    frontUrl:
      "https://oda.com/no/products/68077-bladcentralen-pondus-julehefte-julen-2025/",
    absoluteUrl:
      "/no/products/68077-bladcentralen-pondus-julehefte-julen-2025/",
    grossPrice: "95.00",
    grossUnitPrice: "95.00",
    unitPriceQuantityAbbreviation: "stk",
    unitPriceQuantityName: "stykk",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/ea6f37a4-dd94-4990-8eed-5d025601be62.jpg?fit=bounds&format=auto&optimize=medium&width=734&s=0xde2c73d049975ba01f492a290a832c472ae9998d",
        isLarge: true,
        width: 906,
        height: 1235,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/ea6f37a4-dd94-4990-8eed-5d025601be62.jpg?fit=bounds&format=auto&optimize=medium&width=220&s=0xfd91cec4482fd61bd9b533e08902c87e539de2c1",
        isLarge: false,
        width: 906,
        height: 1235,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: null,
    promotions: [],
  },
  {
    id: 68083,
    fullName: "Bladcentralen Norges dummeste julehefte",
    brand: "Bladcentralen",
    brandExternalId: 3949,
    name: "Norges dummeste julehefte",
    nameExtra: "1 stk",
    frontUrl:
      "https://oda.com/no/products/68083-bladcentralen-norges-dummeste-julehefte/",
    absoluteUrl: "/no/products/68083-bladcentralen-norges-dummeste-julehefte/",
    grossPrice: "169.00",
    grossUnitPrice: "169.00",
    unitPriceQuantityAbbreviation: "stk",
    unitPriceQuantityName: "stykk",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/bded0f2a-8e1a-477a-9dac-adff95ea4165.jpg?fit=bounds&format=auto&optimize=medium&width=696&s=0xc1f9dd8098aaaa17de1a7ca678614b528abdc2bc",
        isLarge: true,
        width: 2303,
        height: 3307,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/bded0f2a-8e1a-477a-9dac-adff95ea4165.jpg?fit=bounds&format=auto&optimize=medium&width=209&s=0x26849a42764de990edd4e78b3eab746572a62b89",
        isLarge: false,
        width: 2303,
        height: 3307,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: null,
    promotions: [],
  },
  {
    id: 68116,
    fullName: "Bladcentralen Julequiz 2025",
    brand: "Bladcentralen",
    brandExternalId: 3949,
    name: "Julequiz 2025",
    nameExtra: "1 stk",
    frontUrl: "https://oda.com/no/products/68116-bladcentralen-julequiz-2025/",
    absoluteUrl: "/no/products/68116-bladcentralen-julequiz-2025/",
    grossPrice: "129.00",
    grossUnitPrice: "129.00",
    unitPriceQuantityAbbreviation: "stk",
    unitPriceQuantityName: "stykk",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/12bce861-4ccd-486b-8b6c-cb79d94df330.jpg?fit=bounds&format=auto&optimize=medium&width=639&s=0x51e034670d383b8bfb5aa7538eef06780cd8d324",
        isLarge: true,
        width: 1547,
        height: 2421,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/12bce861-4ccd-486b-8b6c-cb79d94df330.jpg?fit=bounds&format=auto&optimize=medium&width=192&s=0x9ab115f7844c86927916eb99f7bbc47c836f5bb4",
        isLarge: false,
        width: 1547,
        height: 2421,
        variant: "thumbnail",
      },
    ],
    classifiers: [],
    discount: null,
    promotions: [],
  },
  {
    id: 64096,
    fullName: "Kolonihagen Medisterkaker Økologisk",
    brand: "Kolonihagen",
    brandExternalId: 1242,
    name: "Medisterkaker",
    nameExtra: "Økologisk, 400 g",
    frontUrl:
      "https://oda.com/no/products/64096-kolonihagen-medisterkaker-okologisk/",
    absoluteUrl: "/no/products/64096-kolonihagen-medisterkaker-okologisk/",
    grossPrice: "149.00",
    grossUnitPrice: "372.50",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/24c954db-d8d4-4e85-87bc-2d90d0237b3b.jpg?fit=bounds&format=auto&optimize=medium&width=998&s=0xd357fdfbb4899dc7d0e62f88f4669eeeb2511a91",
        isLarge: true,
        width: 3828,
        height: 3837,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/24c954db-d8d4-4e85-87bc-2d90d0237b3b.jpg?fit=bounds&format=auto&optimize=medium&width=299&s=0x126ae22f460756d50454d1d24bce70a4abbd010e",
        isLarge: false,
        width: 3828,
        height: 3837,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Økologisk",
        imageUrl:
          "https://oda.com/static/products/img/classifier_icons/organic.8cd2f16bb368.png",
        isImportant: false,
        description: "Produktet er økologisk",
      },
      {
        name: "Dyrevernmerket",
        imageUrl:
          "https://images.oda.com/certifications/2fd9b918-671e-4a7a-bcd4-ac8f128db347.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x1c8e72270ebeba8ee16f79ea6fd07730afefe37f",
        isImportant: false,
        description:
          "Når du velger mat merket med Dyrevernmerket kan du føle deg trygg på at dyrene har hatt: Bedre plass, sunnere kropp og mer aktivitet.",
      },
      {
        name: "Debio Ø-merket",
        imageUrl:
          "https://images.oda.com/certifications/7d512a62-5004-4ee3-8342-da9eeceb7460.png?fit=bounds&format=auto&optimize=medium&width=60&s=0x652f4b150f5e9eeb1d4c829ce1766f1a27e0e570",
        isImportant: false,
        description:
          "Debio er en ikke-statlig medlemsorganisasjon som kontrollerer og godkjenner økologisk produksjon i Norge, og at produkter som markedsføres med henvisning til den økologiske produksjonsmetoden, tilfredsstiller kravene i regelverket.",
      },
    ],
    discount: null,
    promotions: [],
  },
  {
    id: 68271,
    fullName: "R Julens Klassiker tykkskåret julesylte",
    brand: "R",
    brandExternalId: 4242,
    name: "Julens Klassiker tykkskåret julesylte",
    nameExtra: "170 g",
    frontUrl:
      "https://oda.com/no/products/68271-r-julens-klassiker-tykkskaret-julesylte/",
    absoluteUrl: "/no/products/68271-r-julens-klassiker-tykkskaret-julesylte/",
    grossPrice: "59.90",
    grossUnitPrice: "352.35",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/d0d917d0-a998-4535-b49b-01010258a942.jpg?fit=bounds&format=auto&optimize=medium&width=634&s=0x909ddae80987b62f657a1338f6efb51e5f5ef81f",
        isLarge: true,
        width: 2283,
        height: 3600,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/d0d917d0-a998-4535-b49b-01010258a942.jpg?fit=bounds&format=auto&optimize=medium&width=190&s=0x60e4a0011df199346876d739f95724961767dae2",
        isLarge: false,
        width: 2283,
        height: 3600,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Nyt Norge",
        imageUrl:
          "https://images.oda.com/certifications/7114fc07-2f88-484f-9184-b407d365de52.png?fit=bounds&format=auto&optimize=medium&width=54&s=0x51a40e931f98a99c614046541fa2422102bb8773",
        isImportant: false,
        description:
          "Nyt Norge er en merkeordning som skal gjøre det enklere å velge norske matvarer.",
      },
      {
        name: "Nøkkelhullet",
        imageUrl:
          "https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011",
        isImportant: false,
        description:
          "Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.",
      },
    ],
    discount: null,
    promotions: [],
  },
  {
    id: 68270,
    fullName: "Stange Kalkunfilet Jul Med appelsin og pepper",
    brand: "Stange",
    brandExternalId: 4288,
    name: "Kalkunfilet Jul",
    nameExtra: "Med appelsin og pepper, 160 g",
    frontUrl:
      "https://oda.com/no/products/68270-stange-kalkunfilet-jul-med-appelsin-og-pepper/",
    absoluteUrl:
      "/no/products/68270-stange-kalkunfilet-jul-med-appelsin-og-pepper/",
    grossPrice: "88.10",
    grossUnitPrice: "550.63",
    unitPriceQuantityAbbreviation: "kg",
    unitPriceQuantityName: "kilogram",
    currency: "NOK",
    isAvailable: true,
    availabilityCode: "available",
    availabilityDescription: "",
    availabilityDescriptionShort: "",
    isExemptFromThirdPartyMarketing: false,
    metadata: {
      is_sponsor_labeled: null,
      source_uuid: null,
      is_promoted: null,
      placement_id: null,
    },
    bonusInfo: null,
    images: [
      {
        imageUrl:
          "https://images.oda.com/local_products/a292c761-3484-44b0-8711-5c05e0b377a2.jpg?fit=bounds&format=auto&optimize=medium&width=692&s=0xbfa8496ec3bc37aa0645f178c6d4f7d12a5eca24",
        isLarge: true,
        width: 2571,
        height: 3715,
        variant: "main",
      },
      {
        imageUrl:
          "https://images.oda.com/local_products/a292c761-3484-44b0-8711-5c05e0b377a2.jpg?fit=bounds&format=auto&optimize=medium&width=208&s=0xd24b3285cfe5ceca96263b4a0d9d90a53157dd3e",
        isLarge: false,
        width: 2571,
        height: 3715,
        variant: "thumbnail",
      },
    ],
    classifiers: [
      {
        name: "Nøkkelhullet",
        imageUrl:
          "https://images.oda.com/certifications/463c089e-9e61-4aec-bdfb-c69cf61b82bc.png?fit=bounds&format=auto&optimize=medium&width=60&s=0xe09ff633018d14bdd1517ad035d6172031141011",
        isImportant: false,
        description:
          "Nøkkelhullet er en offentlig merkeordning for sunnere matvarer. Velger du nøkkelhullmerkede matvarer spiser du mindre fett, sukker og salt, og mer fiber og fullkorn. Det er bra for helsen.",
      },
    ],
    discount: null,
    promotions: [],
  },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        fullName: p.fullName,
        brand: p.brand ?? null,
        brandExternalId: p.brandExternalId ?? null,
        name: p.name ?? null,
        nameExtra: p.nameExtra ?? null,
        frontUrl: p.frontUrl ?? null,
        absoluteUrl: p.absoluteUrl ?? null,
        grossPrice: p.grossPrice,
        grossUnitPrice: p.grossUnitPrice ?? null,
        unitPriceQuantityAbbreviation: p.unitPriceQuantityAbbreviation ?? null,
        unitPriceQuantityName: p.unitPriceQuantityName ?? null,
        currency: p.currency,
        isAvailable: p.isAvailable,
        availabilityCode: p.availabilityCode ?? null,
        availabilityDescription: p.availabilityDescription ?? null,
        availabilityDescriptionShort: p.availabilityDescriptionShort ?? null,
        isExemptFromThirdPartyMarketing:
          p.isExemptFromThirdPartyMarketing ?? false,
        metadata: p.metadata ?? null,
        bonusInfo: p.bonusInfo ?? Prisma.JsonNull,
        images: (() => {
          const large = p.images.find((i) => i.isLarge);
          const thumb = p.images.find((i) => !i.isLarge);
          if (!large && !thumb) return undefined;
          const createOne = {
            variant: (large?.variant ?? thumb?.variant ?? null) as any,
            largeUrl: (large?.imageUrl ?? thumb?.imageUrl)!,
            largeWidth: large?.width ?? thumb?.width ?? null,
            largeHeight: large?.height ?? thumb?.height ?? null,
            thumbnailUrl: thumb?.imageUrl ?? null,
            thumbnailWidth: thumb?.width ?? null,
            thumbnailHeight: thumb?.height ?? null,
          };
          return { create: [createOne] };
        })(),
        classifiers: {
          create: p.classifiers.map((c) => ({
            name: c.name,
            imageUrl: c.imageUrl ?? null,
            isImportant: c.isImportant ?? false,
            description: c.description ?? null,
          })),
        },
        ...(p.discount
          ? {
              discount: {
                create: {
                  id: p.id,
                  isDiscounted: p.discount.isDiscounted,
                  source: p.discount.discountSource,
                  undiscountedGrossPrice:
                    p.discount.undiscountedGrossPrice ?? null,
                  undiscountedGrossUnitPrice:
                    p.discount.undiscountedGrossUnitPrice ?? null,
                  descriptionShort: p.discount.descriptionShort ?? null,
                  maximumQuantity: p.discount.maximumQuantity ?? null,
                  remainingQuantity: p.discount.remainingQuantity ?? null,
                  activeUntil: p.discount.activeUntil ?? null,
                  hasRelatedDiscountProducts:
                    p.discount.hasRelatedDiscountProducts ?? false,
                  isSilent: p.discount.isSilent ?? false,
                },
              },
            }
          : {}),
        promotions: {
          create: p.promotions.map((promo) => ({
            title: promo.title,
            descriptionShort: promo.descriptionShort ?? null,
            accessibilityText: promo.accessibilityText ?? null,
            displayStyle: promo.displayStyle,
            isPrimary: promo.isPrimary ?? false,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
