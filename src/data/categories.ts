import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat_evening",
    name: "Limited Pieces",
    slug: "evening-dresses",
    description:
      "Floor-length silhouettes cut for galas, receptions, and the rooms that call for ceremony.",
    image: "limitedPiece5",
    parentId: null,
    isFeatured: true,
  },

  {
    id: "cat_cocktail",
    name: "Read to Wear",
    slug: "read-to-wear",
    description:
      "Wardrobe-ready dresses built for effortless elegance from day to evening.",
    image: "readToWear",
    parentId: null,
    isFeatured: true,
  },
  {
    id: "cat_bridal",
    name: "Bridal Couture",
    slug: "bridal-couture",
    description:
      "Made-to-measure gowns for the one day designed entirely around you.",
    image: "bridalGown",
    parentId: null,
    isFeatured: false,
  },
  {
    id: "cat_daywear",
    name: "Daywear",
    slug: "daywear",
    description: "Tailored separates and dresses for daylight hours.",
    image: "blueWhiteDressHat",
    parentId: null,
    isFeatured: false,
  },
  {
    id: "cat_outerwear",
    name: "Outerwear",
    slug: "outerwear",
    description: "Capes, coats, and tailored layers.",
    image: "blackBlazerDress",
    parentId: null,
    isFeatured: false,
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    description: "The finishing pieces.",
    image: "blackDressPortrait",
    parentId: null,
    isFeatured: false,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
