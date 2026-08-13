import { Product, ProductColor, ProductSize, ProductImage } from "@/types";
import { categories } from "./categories";
import { IMG, ImageKey } from "@/lib/images";

const STANDARD_SIZES: ProductSize[] = [
  { id: "sz_xs", label: "XS", sortOrder: 0 },
  { id: "sz_s", label: "S", sortOrder: 1 },
  { id: "sz_m", label: "M", sortOrder: 2 },
  { id: "sz_l", label: "L", sortOrder: 3 },
  { id: "sz_xl", label: "XL", sortOrder: 4 },
];

function colors(list: { name: string; hex: string }[]): ProductColor[] {
  return list.map((c, i) => ({
    id: `col_${i}_${c.name.toLowerCase()}`,
    name: c.name,
    hexCode: c.hex,
  }));
}

function images(keys: ImageKey[], productId: string): ProductImage[] {
  return keys.map((k, i) => ({
    id: `${productId}_img_${i}`,
    url: IMG[k],
    altText: `${productId} view ${i + 1}`,
    sortOrder: i,
    isPrimary: i === 0,
  }));
}

interface SeedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  description: string;
  fabricDetails: string;
  careInstructions: string;
  price: number;
  compareAtPrice?: number;
  imageKeys: ImageKey[];
  colorList: { name: string; hex: string }[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  avgRating: number;
  reviewCount: number;
  stockTotal: number;
}

const seed: SeedProduct[] = [
  {
    id: "prod_001",
    name: "Black Dress",
    slug: "noir-cascade-gown",
    sku: "HB-EV-001",
    categoryId: "cat_evening",
    description:
      "A floor-sweeping silhouette in double silk crepe, cut on the bias to fall in a single uninterrupted line from shoulder to hem. The bodice is structured with internal boning for a corseted fit that requires no further shaping. Designed for the moments that call for absolute composure.",
    fabricDetails:
      "100% silk crepe outer, fully lined in silk charmeuse. Hand-finished seams. Made in limited runs of 30 pieces per size.",
    careInstructions:
      "Dry clean only. Store on a padded hanger away from direct light.",
    price: 8900,
    compareAtPrice: 10500,
    imageKeys: ["blackDressA", "blackDressB", "blackDressC"],
    colorList: [
      { name: "Noir", hex: "#161616" },
      // { name: "Ivory", hex: "#F1EFEA" },
    ],
    isFeatured: true,
    isBestSeller: true,
    avgRating: 4.9,
    reviewCount: 42,
    stockTotal: 18,
  },
  {
    id: "prod_002",
    name: "Blue Dress",
    slug: "etoile-sculptural-gown",
    sku: "HB-EV-002",
    categoryId: "cat_evening",
    description:
      "An architectural evening gown built around a single draped panel that wraps the torso and falls into a sculpted train. The construction is entirely internal — no visible closures — so the line reads uninterrupted from every angle.",
    fabricDetails:
      "Silk mikado with horsehair-reinforced hem for structure. Fully boned bodice.",
    careInstructions:
      "Dry clean only. Professional pressing recommended before wear.",
    price: 12400,
    imageKeys: ["blueDressA", "blueDressB", "blueDressC"],
    colorList: [{ name: "Noir", hex: "#8bb7f8" }],
    isFeatured: true,
    avgRating: 5.0,
    reviewCount: 19,
    stockTotal: 9,
  },
  {
    id: "prod_003",
    name: "Peach Dress",
    slug: "lumiere-slip-gown",
    sku: "HB-EV-003",
    categoryId: "cat_evening",
    description:
      "A bias-cut slip gown in liquid silk satin, designed to move with the body rather than against it. Adjustable straps and a low cowl back. The kind of dress that photographs as well walking away as it does arriving.",
    fabricDetails:
      "100% silk satin. Fully lined. Adjustable strap hardware in matte black metal.",
    careInstructions: "Dry clean only.",
    price: 6200,
    imageKeys: ["peachDressA", "peachDressB", "peachDressC"],
    colorList: [
      { name: "Ivory", hex: "#f3d4e3be" },
      // { name: "Noir", hex: "#161616" },
      // { name: "Slate", hex: "#3A3A38" },
    ],
    isNewArrival: true,
    avgRating: 4.7,
    reviewCount: 11,
    stockTotal: 24,
  },
  {
    id: "prod_004",
    name: "Pink Dress",
    slug: "vesper-cape-gown",
    sku: "HB-EV-004",
    categoryId: "cat_evening",
    description:
      "A column gown with a detachable cape that fastens at the shoulders, designed to be worn for the entrance and removed for the room. The cape is lined in matching silk so it holds its shape rather than collapsing.",
    fabricDetails:
      "Silk crepe gown, silk georgette cape with weighted hem. Detachable cape clasps in brushed brass.",
    careInstructions:
      "Dry clean only. Cape and gown should be cleaned together.",
    price: 9800,
    imageKeys: ["pinkDressA", "pinkDressB", "pinkDressC"],
    colorList: [{ name: "Noir", hex: "#f8dfdf" }],
    avgRating: 4.8,
    reviewCount: 27,
    stockTotal: 14,
  },
  {
    id: "prod_005",
    name: "Red Dress",
    slug: "red-dress",
    sku: "HB-EV-005",
    categoryId: "cat_evening",
    description:
      "A dramatic red evening dress cut in a flattering silhouette, designed for bold entrances and refined evenings. The structured bodice and flowing skirt work together for an unforgettable red carpet effect.",
    fabricDetails:
      "Silk satin with a lightly boned bodice and lined skirt. Finished with hand-stitched seams and subtle stretch for comfort.",
    careInstructions:
      "Dry clean only. Store on a padded hanger away from direct light.",
    price: 9800,
    imageKeys: ["redDressA", "redDressB", "redDressC"],
    colorList: [{ name: "Rouge", hex: "#9B1B30" }],
    avgRating: 4.9,
    reviewCount: 12,
    stockTotal: 15,
  },
  // ── Ready to Wear — 7 models ──────────────────────────────
  // 1. أسود (Black)
  {
    id: "prod_006",
    name: "Evening Jumpsuit with Cape",
    slug: "noir-elegance-jumpsuit",
    sku: "HB-RT-001",
    categoryId: "cat_cocktail",
    description:
      "A refined black dress with clean lines and a modern silhouette, crafted for effortless day-to-evening transitions. The structured bodice and flowing skirt create a quietly powerful presence.",
    fabricDetails: "Silk-blend crepe with structured underlining. Fully lined.",
    careInstructions: "Dry clean only.",
    price: 3400,
    compareAtPrice: 3900,
    imageKeys: ["readWear1A", "readWear1B", "readWear1C"],
    colorList: [{ name: "Noir", hex: "#161616" }],
    isBestSeller: true,
    avgRating: 4.6,
    reviewCount: 58,
    stockTotal: 36,
  },
  // 2. احمر (Red)
  {
    id: "prod_007",
    name: "Off-Shoulder Draped Dress",
    slug: "off-shoulder-draped-dress",
    sku: "HB-RT-002",
    categoryId: "cat_cocktail",
    description:
      "A vibrant red dress that commands attention without effort. Designed with a flattering wrap-style bodice and a fluid skirt that moves with confidence and ease.",
    fabricDetails:
      "Viscose-blend matte jersey. Partially lined through the bodice.",
    careInstructions: "Hand wash cold or dry clean. Lay flat to dry.",
    price: 2650,
    imageKeys: ["readWear2A", "readWear2B", "readWear2C"],
    colorList: [{ name: "Rouge", hex: "#9B1B30" }],
    isNewArrival: true,
    avgRating: 4.5,
    reviewCount: 14,
    stockTotal: 41,
  },
  // 3. احمر محجب (Red Hijab)
  {
    id: "prod_008",
    name: "Crimson Modesty Dress",
    slug: "crimson-modesty-dress",
    sku: "HB-RT-003",
    categoryId: "cat_cocktail",
    description:
      "An elegant modest dress in rich crimson, designed with a sculpted neckline and full-length sleeves. Built for women who seek sophistication without compromise.",
    fabricDetails: "Silk-wool blend with built-in structure at the bodice.",
    careInstructions: "Dry clean only.",
    price: 4100,
    imageKeys: ["readWear3A", "readWear3B", "readWear3C"],
    colorList: [{ name: "Crimson", hex: "#722F37" }],
    avgRating: 4.8,
    reviewCount: 22,
    stockTotal: 20,
  },
  // 4. اسود2 (Black 2)
  {
    id: "prod_014",
    name: "Midnight Silhouette Dress",
    slug: "midnight-silhouette-dress",
    sku: "HB-RT-004",
    categoryId: "cat_cocktail",
    description:
      "A second interpretation of black, with a more dramatic cut and bold architectural lines. The weighted hem holds its shape through movement, making every step deliberate.",
    fabricDetails:
      "Silk-blend crepe with a softly draped collar and concealed buttons.",
    careInstructions: "Dry clean only.",
    price: 3200,
    compareAtPrice: 3600,
    imageKeys: ["readWear4A", "readWear4B", "readWear4C"],
    colorList: [{ name: "Noir", hex: "#161616" }],
    isNewArrival: true,
    avgRating: 4.7,
    reviewCount: 14,
    stockTotal: 30,
  },
  // 5. افرهول (Jumpsuit)
  {
    id: "prod_015",
    name: "Atelier Jumpsuit",
    slug: "atelier-jumpsuit",
    sku: "HB-RT-005",
    categoryId: "cat_cocktail",
    description:
      "A tailored jumpsuit with a fluid silhouette, designed for the woman who moves between occasions with ease. Wide-leg trousers and a cinched waist create an effortlessly polished look.",
    fabricDetails: "Lightweight silk jersey with a matte finish.",
    careInstructions: "Hand wash cold or dry clean. Lay flat to dry.",
    price: 3800,
    imageKeys: ["readWear5A", "readWear5B", "readWear5C"],
    colorList: [{ name: "Noir", hex: "#FFD3B6" }],
    isFeatured: true,
    avgRating: 4.8,
    reviewCount: 18,
    stockTotal: 22,
  },
  // 6. بطيخي (Watermelon)
  {
    id: "prod_016",
    name: "Coral Bloom Dress",
    slug: "coral-bloom-dress",
    sku: "HB-RT-006",
    categoryId: "cat_cocktail",
    description:
      "A striking watermelon-toned dress with soft ruching at the waist for a feminine, day-to-evening silhouette. The color is both bold and wearable, designed to flatter every skin tone.",
    fabricDetails: "Silk satin with a self-fabric belt and lined bodice.",
    careInstructions: "Dry clean only.",
    price: 3600,
    imageKeys: ["readWear6A", "readWear6B", "readWear6C"],
    colorList: [{ name: "Coral", hex: "#FFCBA4" }],
    avgRating: 4.6,
    reviewCount: 12,
    stockTotal: 30,
  },
  // 7. زهري (Rose Pink)
  {
    id: "prod_017",
    name: "Rose Petal Dress",
    slug: "rose-petal-dress",
    sku: "HB-RT-007",
    categoryId: "cat_cocktail",
    description:
      "A soft rose-pink dress with delicate draping and a flowing skirt, finished for understated luxury. The kind of dress that makes an impression through restraint rather than volume.",
    fabricDetails: "Silk georgette with subtle pleat detail.",
    careInstructions: "Dry clean only.",
    price: 3300,
    imageKeys: ["readWear7A", "readWear7B", "readWear7C"],
    colorList: [{ name: "Rose", hex: "#F4C2B2" }],
    isBestSeller: true,
    avgRating: 4.9,
    reviewCount: 24,
    stockTotal: 18,
  },
  {
    id: "prod_009",
    name: "Belaire Bridal Gown",
    slug: "belaire-bridal-gown",
    sku: "HB-BR-001",
    categoryId: "cat_bridal",
    description:
      "A made-to-measure bridal gown in duchesse silk with a structured bodice and a full skirt finished with a hand-rolled hem. Available with or without sleeves; consultations required for fitting.",
    fabricDetails:
      "Silk duchesse satin. Boned bodice, full silk tulle underskirt. Made to measure — 8-week lead time.",
    careInstructions:
      "Professional preservation cleaning recommended after wear.",
    price: 24500,
    imageKeys: ["bridalGown", "blackDressPortrait"],
    colorList: [{ name: "Ivory", hex: "#F1EFEA" }],
    isFeatured: true,
    avgRating: 5.0,
    reviewCount: 31,
    stockTotal: 6,
  },
  {
    id: "prod_010",
    name: "Calla Bridal Slip Gown",
    slug: "calla-bridal-slip-gown",
    sku: "HB-BR-002",
    categoryId: "cat_bridal",
    description:
      "A pared-back bridal slip gown for the bride who wants quiet over spectacle. Bias-cut silk, minimal seaming, a low back that needs no further ornament.",
    fabricDetails: "100% silk crepe back satin. Fully lined.",
    careInstructions: "Professional preservation cleaning recommended.",
    price: 14200,
    imageKeys: ["bridalGown", "blueWhiteDressHat"],
    colorList: [{ name: "Ivory", hex: "#F1EFEA" }],
    isNewArrival: true,
    avgRating: 4.9,
    reviewCount: 8,
    stockTotal: 10,
  },
  {
    id: "prod_011",
    name: "Verana Day Dress",
    slug: "verana-day-dress",
    sku: "HB-DW-001",
    categoryId: "cat_daywear",
    description:
      "A tailored shirt dress in heavyweight cotton poplin with a defined waist and a midi hem. Mother-of-pearl buttons throughout, fully functional placket.",
    fabricDetails: "100% cotton poplin. Unlined.",
    careInstructions: "Machine wash cold, line dry. Iron on reverse.",
    price: 1850,
    imageKeys: ["blueWhiteDressHat"],
    colorList: [
      { name: "Ivory", hex: "#F1EFEA" },
      { name: "Slate", hex: "#3A3A38" },
    ],
    isBestSeller: true,
    avgRating: 4.4,
    reviewCount: 67,
    stockTotal: 52,
  },
  {
    id: "prod_012",
    name: "Senna Tailored Coat",
    slug: "senna-tailored-coat",
    sku: "HB-OW-001",
    categoryId: "cat_outerwear",
    description:
      "A single-breasted wool coat with a structured shoulder and a fluid below-knee length. Fully lined in silk twill, horn buttons.",
    fabricDetails: "100% virgin wool shell, silk twill lining.",
    careInstructions: "Dry clean only.",
    price: 5400,
    imageKeys: ["blackBlazerDress"],
    colorList: [
      { name: "Noir", hex: "#161616" },
      { name: "Stone", hex: "#8C8A84" },
    ],
    avgRating: 4.7,
    reviewCount: 16,
    stockTotal: 23,
  },
  {
    id: "prod_013",
    name: "Odessa Evening Clutch",
    slug: "odessa-evening-clutch",
    sku: "HB-AC-001",
    categoryId: "cat_accessories",
    description:
      "A structured evening clutch in calf leather with a sculpted brass clasp, sized to hold the essentials and nothing more.",
    fabricDetails: "Genuine calf leather exterior, suede lining.",
    careInstructions:
      "Wipe clean with a soft, dry cloth. Avoid direct moisture.",
    price: 1450,
    imageKeys: ["blackDressPortrait"],
    colorList: [
      { name: "Noir", hex: "#161616" },
      { name: "Ivory", hex: "#F1EFEA" },
    ],
    isNewArrival: true,
    avgRating: 4.6,
    reviewCount: 9,
    stockTotal: 30,
  },
];

function buildSizes(categoryId: string): ProductSize[] {
  if (categoryId === "cat_accessories") return [];
  return STANDARD_SIZES;
}

export const products: Product[] = seed.map((p) => {
  const category = categories.find((c) => c.id === p.categoryId)!;
  const sizeList = buildSizes(p.categoryId);
  const colorList = colors(p.colorList);
  const variants = sizeList.length
    ? colorList.flatMap((c) =>
        sizeList.map((s, idx) => ({
          id: `${p.id}_var_${c.id}_${s.id}`,
          colorId: c.id,
          sizeId: s.id,
          stock: Math.max(
            0,
            Math.floor(p.stockTotal / (colorList.length * sizeList.length)) +
              (idx % 2),
          ),
          sku: `${p.sku}-${c.name.slice(0, 2).toUpperCase()}-${s.label}`,
        })),
      )
    : colorList.map((c) => ({
        id: `${p.id}_var_${c.id}`,
        colorId: c.id,
        sizeId: undefined,
        stock: Math.floor(p.stockTotal / colorList.length),
        sku: `${p.sku}-${c.name.slice(0, 2).toUpperCase()}`,
      }));

  return {
    id: p.id,
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
    categoryId: p.categoryId,
    category,
    isFeatured: !!p.isFeatured,
    isNewArrival: !!p.isNewArrival,
    isBestSeller: !!p.isBestSeller,
    colors: colorList,
    sizes: sizeList,
    images: images(p.imageKeys, p.id),
    variants,
    avgRating: p.avgRating,
    reviewCount: p.reviewCount,
    createdAt: new Date(
      2026,
      0,
      1 + Math.floor(Math.random() * 150),
    ).toISOString(),
    stockTotal: p.stockTotal,
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.category.slug === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit)
    .concat(
      products
        .filter(
          (p) => p.id !== product.id && p.categoryId !== product.categoryId,
        )
        .slice(0, limit),
    )
    .slice(0, limit);
}

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newArrivals = products.filter((p) => p.isNewArrival);
export const bestSellers = products.filter((p) => p.isBestSeller);
