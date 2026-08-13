import { prisma } from "@/lib/prisma";
import type {
  Product,
  Category,
  ProductVariant,
  ProductImage,
  ProductColor,
  ProductSize,
  Order,
  CustomerUser,
} from "@/types";

type PrismaProduct = Awaited<ReturnType<typeof getRawProducts>>[number];

async function getRawProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
}

export function mapProduct(p: PrismaProduct): Product {
  const category: Category = {
    id: p.category.id,
    name: p.category.name,
    slug: p.category.slug,
    description: p.category.description ?? undefined,
    image: p.category.image ?? undefined,
    parentId: p.category.parentId,
    isFeatured: p.category.isFeatured,
  };

  const colors: ProductColor[] = p.colors.map((c) => ({
    id: c.id,
    name: c.name,
    hexCode: c.hexCode,
  }));

  const sizes: ProductSize[] = p.sizes.map((s) => ({
    id: s.id,
    label: s.label,
    sortOrder: s.sortOrder,
  }));

  const images: ProductImage[] = p.images.map((img) => ({
    id: img.id,
    url: img.url,
    altText: img.altText ?? undefined,
    sortOrder: img.sortOrder,
    isPrimary: img.isPrimary,
  }));

  const variants: ProductVariant[] = p.variants.map((v) => ({
    id: v.id,
    colorId: v.colorId ?? undefined,
    sizeId: v.sizeId ?? undefined,
    stock: v.stock,
    sku: v.sku,
  }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    fabricDetails: p.fabricDetails ?? undefined,
    careInstructions: p.careInstructions ?? undefined,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice === null ? undefined : Number(p.compareAtPrice),
    currency: p.currency,
    status: p.status as Product["status"],
    categoryId: p.categoryId,
    category,
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    colors,
    sizes,
    images,
    variants,
    avgRating: p.avgRating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt.toISOString(),
    stockTotal: variants.reduce((sum, v) => sum + v.stock, 0),
  };
}

export async function getCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    image: c.image ?? undefined,
    parentId: c.parentId,
    isFeatured: c.isFeatured,
  }));
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    where: { isFeatured: true },
    orderBy: { sortOrder: "asc" },
  });
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    image: c.image ?? undefined,
    parentId: c.parentId,
    isFeatured: c.isFeatured,
  }));
}

export async function getProducts(): Promise<Product[]> {
  const products = await getRawProducts();
  return products.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return p ? mapProduct(p) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return p ? mapProduct(p) : null;
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category: { slug: categorySlug }, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return products.map(mapProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getProducts();
  const sameCategory = all.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId,
  );
  const other = all.filter(
    (p) => p.id !== product.id && p.categoryId !== product.categoryId,
  );
  return [...sameCategory, ...other].slice(0, limit);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return products.map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isNewArrival: true, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return products.map(mapProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isBestSeller: true, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });
  return products.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

// ------------------------------------------------------------
// SITE CONTENT
// ------------------------------------------------------------

export async function getSiteContent<T = Record<string, unknown>>(key: string): Promise<T | null> {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  if (!row) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------
// USERS & ORDERS
// ------------------------------------------------------------

export async function getUserById(userId: string): Promise<CustomerUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name ?? "",
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    email: user.email,
    phone: user.phone ?? undefined,
    image: user.image ?? undefined,
    role: user.role as CustomerUser["role"],
    createdAt: user.createdAt.toISOString(),
  };
}

export function mapOrder(o: {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: import("@prisma/client").Prisma.Decimal;
  shippingCost: import("@prisma/client").Prisma.Decimal;
  taxAmount: import("@prisma/client").Prisma.Decimal;
  discountAmount: import("@prisma/client").Prisma.Decimal;
  total: import("@prisma/client").Prisma.Decimal;
  currency: string;
  shipFullName: string;
  shipPhone: string;
  shipEmail: string;
  shipCountry: string;
  shipCity: string;
  shipLine1: string;
  shipLine2: string | null;
  shipPostal: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    colorName: string | null;
    sizeLabel: string | null;
    unitPrice: import("@prisma/client").Prisma.Decimal;
    quantity: number;
    lineTotal: import("@prisma/client").Prisma.Decimal;
  }[];
}): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status as Order["status"],
    paymentStatus: o.paymentStatus as Order["paymentStatus"],
    paymentMethod: (o.paymentMethod ?? undefined) as Order["paymentMethod"],
    subtotal: Number(o.subtotal),
    shippingCost: Number(o.shippingCost),
    taxAmount: Number(o.taxAmount),
    discountAmount: Number(o.discountAmount),
    total: Number(o.total),
    currency: o.currency,
    shipFullName: o.shipFullName,
    shipPhone: o.shipPhone,
    shipEmail: o.shipEmail,
    shipCountry: o.shipCountry,
    shipCity: o.shipCity,
    shipLine1: o.shipLine1,
    shipLine2: o.shipLine2 ?? undefined,
    shipPostal: o.shipPostal,
    trackingNumber: o.trackingNumber ?? undefined,
    trackingCarrier: o.trackingCarrier ?? undefined,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      productImage: i.productImage ?? undefined,
      colorName: i.colorName ?? undefined,
      sizeLabel: i.sizeLabel ?? undefined,
      unitPrice: Number(i.unitPrice),
      quantity: i.quantity,
      lineTotal: Number(i.lineTotal),
    })),
  };
}

const orderInclude = {
  items: true,
} as const;

export async function getUserOrders(userId: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(mapOrder);
}

export async function getUserOrderByNumber(
  userId: string,
  orderNumber: string,
): Promise<Order | null> {
  const order = await prisma.order.findFirst({
    where: { userId, orderNumber },
    include: orderInclude,
  });
  return order ? mapOrder(order) : null;
}
