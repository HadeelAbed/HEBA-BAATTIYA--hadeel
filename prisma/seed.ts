import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { IMG, ImageKey } from "../src/lib/images";

const prisma = new PrismaClient();

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL"];

interface SeedColor {
  name: string;
  hex: string;
}

interface SeedProduct {
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  description: string;
  fabricDetails: string;
  careInstructions: string;
  price: number;
  compareAtPrice?: number;
  imageKeys: ImageKey[];
  colors: SeedColor[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  avgRating: number;
  reviewCount: number;
  stockTotal: number;
  createdAt: string;
}

const products: SeedProduct[] = [
  {
    name: "Black Dress",
    slug: "noir-cascade-gown",
    sku: "HB-EV-001",
    categorySlug: "evening-dresses",
    description:
      "A floor-sweeping silhouette in double silk crepe, cut on the bias to fall in a single uninterrupted line from shoulder to hem. The bodice is structured with internal boning for a corseted fit that requires no further shaping. Designed for the moments that call for absolute composure.",
    fabricDetails:
      "100% silk crepe outer, fully lined in silk charmeuse. Hand-finished seams. Made in limited runs of 30 pieces per size.",
    careInstructions:
      "Dry clean only. Store on a padded hanger away from direct light.",
    price: 8900,
    compareAtPrice: 10500,
    imageKeys: ["blackDressA", "blackDressB", "blackDressC"],
    colors: [{ name: "Noir", hex: "#161616" }],
    isFeatured: true,
    isBestSeller: true,
    avgRating: 4.9,
    reviewCount: 42,
    stockTotal: 18,
    createdAt: "2026-01-02T10:00:00.000Z",
  },
  {
    name: "Blue Dress",
    slug: "etoile-sculptural-gown",
    sku: "HB-EV-002",
    categorySlug: "evening-dresses",
    description:
      "An architectural evening gown built around a single draped panel that wraps the torso and falls into a sculpted train. The construction is entirely internal — no visible closures — so the line reads uninterrupted from every angle.",
    fabricDetails:
      "Silk mikado with horsehair-reinforced hem for structure. Fully boned bodice.",
    careInstructions:
      "Dry clean only. Professional pressing recommended before wear.",
    price: 12400,
    imageKeys: ["blueDressA", "blueDressB", "blueDressC"],
    colors: [{ name: "Blue", hex: "#8BB7F8" }],
    isFeatured: true,
    avgRating: 5.0,
    reviewCount: 19,
    stockTotal: 9,
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    name: "Peach Dress",
    slug: "lumiere-slip-gown",
    sku: "HB-EV-003",
    categorySlug: "evening-dresses",
    description:
      "A bias-cut slip gown in liquid silk satin, designed to move with the body rather than against it. Adjustable straps and a low cowl back. The kind of dress that photographs as well walking away as it does arriving.",
    fabricDetails:
      "100% silk satin. Fully lined. Adjustable strap hardware in matte black metal.",
    careInstructions: "Dry clean only.",
    price: 6200,
    imageKeys: ["peachDressA", "peachDressB", "peachDressC"],
    colors: [{ name: "Peach", hex: "#F3D4BE" }],
    isNewArrival: true,
    avgRating: 4.7,
    reviewCount: 11,
    stockTotal: 24,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    name: "Pink Dress",
    slug: "vesper-cape-gown",
    sku: "HB-EV-004",
    categorySlug: "evening-dresses",
    description:
      "A column gown with a detachable cape that fastens at the shoulders, designed to be worn for the entrance and removed for the room. The cape is lined in matching silk so it holds its shape rather than collapsing.",
    fabricDetails:
      "Silk crepe gown, silk georgette cape with weighted hem. Detachable cape clasps in brushed brass.",
    careInstructions:
      "Dry clean only. Cape and gown should be cleaned together.",
    price: 9800,
    imageKeys: ["pinkDressA", "pinkDressB", "pinkDressC"],
    colors: [{ name: "Pink", hex: "#F8DFDF" }],
    avgRating: 4.8,
    reviewCount: 27,
    stockTotal: 14,
    createdAt: "2026-02-11T10:00:00.000Z",
  },
  {
    name: "Red Dress",
    slug: "red-dress",
    sku: "HB-EV-005",
    categorySlug: "evening-dresses",
    description:
      "A dramatic red evening dress cut in a flattering silhouette, designed for bold entrances and refined evenings. The structured bodice and flowing skirt work together for an unforgettable red carpet effect.",
    fabricDetails:
      "Silk satin with a lightly boned bodice and lined skirt. Finished with hand-stitched seams and subtle stretch for comfort.",
    careInstructions:
      "Dry clean only. Store on a padded hanger away from direct light.",
    price: 9800,
    imageKeys: ["redDressA", "redDressB", "redDressC"],
    colors: [{ name: "Rouge", hex: "#9B1B30" }],
    avgRating: 4.9,
    reviewCount: 12,
    stockTotal: 15,
    createdAt: "2026-02-21T10:00:00.000Z",
  },
  {
    name: "Evening Jumpsuit with Cape",
    slug: "noir-elegance-jumpsuit",
    sku: "HB-RT-001",
    categorySlug: "read-to-wear",
    description:
      "A refined black dress with clean lines and a modern silhouette, crafted for effortless day-to-evening transitions. The structured bodice and flowing skirt create a quietly powerful presence.",
    fabricDetails: "Silk-blend crepe with structured underlining. Fully lined.",
    careInstructions: "Dry clean only.",
    price: 3400,
    compareAtPrice: 3900,
    imageKeys: ["readWear1A", "readWear1B", "readWear1C"],
    colors: [{ name: "Noir", hex: "#161616" }],
    isBestSeller: true,
    avgRating: 4.6,
    reviewCount: 58,
    stockTotal: 36,
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    name: "Off-Shoulder Draped Dress",
    slug: "off-shoulder-draped-dress",
    sku: "HB-RT-002",
    categorySlug: "read-to-wear",
    description:
      "A vibrant red dress that commands attention without effort. Designed with a flattering wrap-style bodice and a fluid skirt that moves with confidence and ease.",
    fabricDetails:
      "Viscose-blend matte jersey. Partially lined through the bodice.",
    careInstructions: "Hand wash cold or dry clean. Lay flat to dry.",
    price: 2650,
    imageKeys: ["readWear2A", "readWear2B", "readWear2C"],
    colors: [{ name: "Rouge", hex: "#9B1B30" }],
    isNewArrival: true,
    avgRating: 4.5,
    reviewCount: 14,
    stockTotal: 41,
    createdAt: "2026-03-06T10:00:00.000Z",
  },
  {
    name: "Crimson Modesty Dress",
    slug: "crimson-modesty-dress",
    sku: "HB-RT-003",
    categorySlug: "read-to-wear",
    description:
      "An elegant modest dress in rich crimson, designed with a sculpted neckline and full-length sleeves. Built for women who seek sophistication without compromise.",
    fabricDetails: "Silk-wool blend with built-in structure at the bodice.",
    careInstructions: "Dry clean only.",
    price: 4100,
    imageKeys: ["readWear3A", "readWear3B", "readWear3C"],
    colors: [{ name: "Crimson", hex: "#722F37" }],
    avgRating: 4.8,
    reviewCount: 22,
    stockTotal: 20,
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    name: "Midnight Silhouette Dress",
    slug: "midnight-silhouette-dress",
    sku: "HB-RT-004",
    categorySlug: "read-to-wear",
    description:
      "A second interpretation of black, with a more dramatic cut and bold architectural lines. The weighted hem holds its shape through movement, making every step deliberate.",
    fabricDetails:
      "Silk-blend crepe with a softly draped collar and concealed buttons.",
    careInstructions: "Dry clean only.",
    price: 3200,
    compareAtPrice: 3600,
    imageKeys: ["readWear4A", "readWear4B", "readWear4C"],
    colors: [{ name: "Noir", hex: "#161616" }],
    isNewArrival: true,
    avgRating: 4.7,
    reviewCount: 14,
    stockTotal: 30,
    createdAt: "2026-03-16T10:00:00.000Z",
  },
  {
    name: "Atelier Jumpsuit",
    slug: "atelier-jumpsuit",
    sku: "HB-RT-005",
    categorySlug: "read-to-wear",
    description:
      "A tailored jumpsuit with a fluid silhouette, designed for the woman who moves between occasions with ease. Wide-leg trousers and a cinched waist create an effortlessly polished look.",
    fabricDetails: "Lightweight silk jersey with a matte finish.",
    careInstructions: "Hand wash cold or dry clean. Lay flat to dry.",
    price: 3800,
    imageKeys: ["readWear5A", "readWear5B", "readWear5C"],
    colors: [{ name: "Peach", hex: "#FFD3B6" }],
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 18,
    stockTotal: 22,
    createdAt: "2026-03-21T10:00:00.000Z",
  },
  {
    name: "Coral Bloom Dress",
    slug: "coral-bloom-dress",
    sku: "HB-RT-006",
    categorySlug: "read-to-wear",
    description:
      "A striking watermelon-toned dress with soft ruching at the waist for a feminine, day-to-evening silhouette. The color is both bold and wearable, designed to flatter every skin tone.",
    fabricDetails: "Silk satin with a self-fabric belt and lined bodice.",
    careInstructions: "Dry clean only.",
    price: 3600,
    imageKeys: ["readWear6A", "readWear6B", "readWear6C"],
    colors: [{ name: "Coral", hex: "#FFCBA4" }],
    avgRating: 4.6,
    reviewCount: 12,
    stockTotal: 30,
    createdAt: "2026-03-26T10:00:00.000Z",
  },
  {
    name: "Rose Petal Dress",
    slug: "rose-petal-dress",
    sku: "HB-RT-007",
    categorySlug: "read-to-wear",
    description:
      "A soft rose-pink dress with delicate draping and a flowing skirt, finished for understated luxury. The kind of dress that makes an impression through restraint rather than volume.",
    fabricDetails: "Silk georgette with subtle pleat detail.",
    careInstructions: "Dry clean only.",
    price: 3300,
    imageKeys: ["readWear7A", "readWear7B", "readWear7C"],
    colors: [{ name: "Rose", hex: "#F4C2B2" }],
    isBestSeller: true,
    avgRating: 4.9,
    reviewCount: 24,
    stockTotal: 18,
    createdAt: "2026-03-31T10:00:00.000Z",
  },
  {
    name: "Belaire Bridal Gown",
    slug: "belaire-bridal-gown",
    sku: "HB-BR-001",
    categorySlug: "bridal-couture",
    description:
      "A made-to-measure bridal gown in duchesse silk with a structured bodice and a full skirt finished with a hand-rolled hem. Available with or without sleeves; consultations required for fitting.",
    fabricDetails:
      "Silk duchesse satin. Boned bodice, full silk tulle underskirt. Made to measure — 8-week lead time.",
    careInstructions:
      "Professional preservation cleaning recommended after wear.",
    price: 24500,
    imageKeys: ["bridalGown", "blackDressPortrait"],
    colors: [{ name: "Ivory", hex: "#F1EFEA" }],
    isFeatured: true,
    avgRating: 5.0,
    reviewCount: 31,
    stockTotal: 6,
    createdAt: "2026-04-05T10:00:00.000Z",
  },
  {
    name: "Calla Bridal Slip Gown",
    slug: "calla-bridal-slip-gown",
    sku: "HB-BR-002",
    categorySlug: "bridal-couture",
    description:
      "A pared-back bridal slip gown for the bride who wants quiet over spectacle. Bias-cut silk, minimal seaming, a low back that needs no further ornament.",
    fabricDetails: "100% silk crepe back satin. Fully lined.",
    careInstructions: "Professional preservation cleaning recommended.",
    price: 14200,
    imageKeys: ["bridalGown", "blueWhiteDressHat"],
    colors: [{ name: "Ivory", hex: "#F1EFEA" }],
    isNewArrival: true,
    avgRating: 4.9,
    reviewCount: 8,
    stockTotal: 10,
    createdAt: "2026-04-10T10:00:00.000Z",
  },
  {
    name: "Verana Day Dress",
    slug: "verana-day-dress",
    sku: "HB-DW-001",
    categorySlug: "daywear",
    description:
      "A tailored shirt dress in heavyweight cotton poplin with a defined waist and a midi hem. Mother-of-pearl buttons throughout, fully functional placket.",
    fabricDetails: "100% cotton poplin. Unlined.",
    careInstructions: "Machine wash cold, line dry. Iron on reverse.",
    price: 1850,
    imageKeys: ["blueWhiteDressHat"],
    colors: [
      { name: "Ivory", hex: "#F1EFEA" },
      { name: "Slate", hex: "#3A3A38" },
    ],
    isBestSeller: true,
    avgRating: 4.4,
    reviewCount: 67,
    stockTotal: 52,
    createdAt: "2026-04-15T10:00:00.000Z",
  },
  {
    name: "Senna Tailored Coat",
    slug: "senna-tailored-coat",
    sku: "HB-OW-001",
    categorySlug: "outerwear",
    description:
      "A single-breasted wool coat with a structured shoulder and a fluid below-knee length. Fully lined in silk twill, horn buttons.",
    fabricDetails: "100% virgin wool shell, silk twill lining.",
    careInstructions: "Dry clean only.",
    price: 5400,
    imageKeys: ["blackBlazerDress"],
    colors: [
      { name: "Noir", hex: "#161616" },
      { name: "Stone", hex: "#8C8A84" },
    ],
    avgRating: 4.7,
    reviewCount: 16,
    stockTotal: 23,
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    name: "Odessa Evening Clutch",
    slug: "odessa-evening-clutch",
    sku: "HB-AC-001",
    categorySlug: "accessories",
    description:
      "A structured evening clutch in calf leather with a sculpted brass clasp, sized to hold the essentials and nothing more.",
    fabricDetails: "Genuine calf leather exterior, suede lining.",
    careInstructions:
      "Wipe clean with a soft, dry cloth. Avoid direct moisture.",
    price: 1450,
    imageKeys: ["blackDressPortrait"],
    colors: [
      { name: "Noir", hex: "#161616" },
      { name: "Ivory", hex: "#F1EFEA" },
    ],
    isNewArrival: true,
    avgRating: 4.6,
    reviewCount: 9,
    stockTotal: 30,
    createdAt: "2026-04-25T10:00:00.000Z",
  },
];

async function main() {
  console.log("Seeding database...");

  // --- Categories ---
  const categoryData = [
    {
      name: "Limited Pieces",
      slug: "evening-dresses",
      description:
        "Floor-length silhouettes cut for galas, receptions, and the rooms that call for ceremony.",
      image: "limitedPiece5",
      isFeatured: true,
      sortOrder: 0,
    },
    {
      name: "Read to Wear",
      slug: "read-to-wear",
      description:
        "Wardrobe-ready dresses built for effortless elegance from day to evening.",
      image: "readToWear",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "Bridal Couture",
      slug: "bridal-couture",
      description:
        "Made-to-measure gowns for the one day designed entirely around you.",
      image: "bridalGown",
      isFeatured: false,
      sortOrder: 2,
    },
    {
      name: "Daywear",
      slug: "daywear",
      description: "Tailored separates and dresses for daylight hours.",
      image: "blueWhiteDressHat",
      isFeatured: false,
      sortOrder: 3,
    },
    {
      name: "Outerwear",
      slug: "outerwear",
      description: "Capes, coats, and tailored layers.",
      image: "blackBlazerDress",
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "The finishing pieces.",
      image: "blackDressPortrait",
      isFeatured: false,
      sortOrder: 5,
    },
  ];

  const categoryIds: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, isFeatured: cat.isFeatured, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryIds[cat.slug] = created.id;
  }
  console.log(`Categories: ${Object.keys(categoryIds).length}`);

  // --- Products ---
  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log(`Skipping existing product: ${p.slug}`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        fabricDetails: p.fabricDetails,
        careInstructions: p.careInstructions,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        currency: "SAR",
        status: "ACTIVE",
        categoryId: categoryIds[p.categorySlug],
        isFeatured: !!p.isFeatured,
        isNewArrival: !!p.isNewArrival,
        isBestSeller: !!p.isBestSeller,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        createdAt: p.createdAt,
        colors: {
          create: p.colors.map((c) => ({ name: c.name, hexCode: c.hex })),
        },
        sizes:
          p.categorySlug === "accessories"
            ? undefined
            : {
                create: STANDARD_SIZES.map((label, i) => ({ label, sortOrder: i })),
              },
        images: {
          create: p.imageKeys.map((key, i) => ({
            url: IMG[key],
            altText: `${p.name} view ${i + 1}`,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        },
      },
    });
    console.log(`Created product: ${p.slug}`);
  }

  // --- Coupons ---
  const coupons = [
    {
      code: "HBWELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
    },
    {
      code: "HBVIP20",
      description: "20% off — VIP client code",
      discountType: "PERCENTAGE",
      discountValue: 20,
    },
    {
      code: "HB500",
      description: "SAR 500 off",
      discountType: "FIXED_AMOUNT",
      discountValue: 500,
    },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: { ...c, isActive: true },
    });
  }
  console.log(`Coupons: ${coupons.length}`);

  // --- Admin User ---
  const adminEmail = "admin@hebabaattiya.com";
  const adminPlain = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminPassword = await bcrypt.hash(adminPlain, 12);
  const adminUpdate = process.env.ADMIN_PASSWORD ? { password: adminPassword } : {};
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: adminUpdate,
    create: {
      name: "Admin",
      firstName: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Admin user: ${adminEmail} / ${adminPlain === "ChangeMe123!" ? "ChangeMe123! (DEV ONLY — set ADMIN_PASSWORD env var in production)" : "ADMIN_PASSWORD set"}`);

  // --- Demo Customer (for dashboard preview) ---
  const demoPassword = await bcrypt.hash("Demo1234!", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "layla.alrashid@example.com" },
    update: {},
    create: {
      name: "Layla Al-Rashid",
      firstName: "Layla",
      lastName: "Al-Rashid",
      email: "layla.alrashid@example.com",
      phone: "+966 50 123 4567",
      password: demoPassword,
      role: "CUSTOMER",
    },
  });

  const noirCascade = await prisma.product.findUnique({ where: { slug: "noir-cascade-gown" } });
  const noirElegance = await prisma.product.findUnique({ where: { slug: "noir-elegance-jumpsuit" } });
  const lumiere = await prisma.product.findUnique({ where: { slug: "lumiere-slip-gown" } });

  const sampleOrders = [
    {
      orderNumber: "HB-2604-58213",
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "MADA",
      subtotal: 8900,
      shippingCost: 0,
      taxAmount: 1335,
      discountAmount: 0,
      total: 10235,
      createdAt: "2026-04-12T10:00:00.000Z",
      productId: noirCascade?.id,
      color: "Noir",
      size: "M",
    },
    {
      orderNumber: "HB-2605-41927",
      status: "SHIPPED",
      paymentStatus: "PAID",
      paymentMethod: "VISA",
      subtotal: 3400,
      shippingCost: 75,
      taxAmount: 521.25,
      discountAmount: 0,
      total: 3996.25,
      createdAt: "2026-05-30T14:20:00.000Z",
      productId: noirElegance?.id,
      color: "Noir",
      size: "S",
    },
    {
      orderNumber: "HB-2606-30142",
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "STC_PAY",
      subtotal: 6200,
      shippingCost: 0,
      taxAmount: 930,
      discountAmount: 620,
      total: 6510,
      createdAt: "2026-06-20T09:15:00.000Z",
      productId: lumiere?.id,
      color: "Ivory",
      size: "M",
    },
  ];

  for (const o of sampleOrders) {
    const product = await prisma.product.findUnique({
      where: { id: o.productId },
      include: { images: true, colors: true, sizes: true },
    });
    if (!product) continue;
    const existingOrder = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (existingOrder) continue;

    const unitPrice = Number(product.price);
    const qty = 1;
    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        userId: demoUser.id,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        subtotal: o.subtotal,
        shippingCost: o.shippingCost,
        taxAmount: o.taxAmount,
        discountAmount: o.discountAmount,
        total: o.total,
        shipFullName: "Layla Al-Rashid",
        shipPhone: "+966 50 123 4567",
        shipEmail: "layla.alrashid@example.com",
        shipCountry: "Saudi Arabia",
        shipCity: "Jeddah",
        shipLine1: "Al Hamra District, Tahlia Street, Villa 14",
        shipPostal: "23434",
        trackingNumber: o.orderNumber === "HB-2604-58213" ? "SMSA-99238174" : o.orderNumber === "HB-2605-41927" ? "ARAMEX-77129384" : null,
        trackingCarrier: o.orderNumber === "HB-2604-58213" ? "SMSA Express" : o.orderNumber === "HB-2605-41927" ? "Aramex" : null,
        createdAt: o.createdAt,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              productImage: product.images[0]?.url,
              colorName: o.color,
              sizeLabel: o.size,
              unitPrice,
              quantity: qty,
              lineTotal: unitPrice * qty,
            },
          ],
        },
      },
    });
    console.log(`Created demo order: ${o.orderNumber}`);
  }
  console.log("Demo customer: layla.alrashid@example.com / Demo1234!");

  const siteContent = [
    {
      key: "homepage_hero",
      value: JSON.stringify({
        eyebrow: "The Spring Couture Collection",
        heading: "Dressed in\nSilence",
        subtext:
          "Each piece is cut to disappear into the way you move — nothing announced, everything felt.",
      }),
    },
    {
      key: "brand_story",
      value: JSON.stringify({
        heading: "A House Built on\nRestraint",
        body: "Heba Baattiya began in a small atelier with a single conviction: that elegance is something you remove, not something you add.",
      }),
    },
    {
      key: "announcement",
      value: JSON.stringify("Complimentary shipping on all orders over SAR 2,000"),
    },
  ];

  for (const c of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c,
    });
  }
  console.log("Site content seeded.");

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
