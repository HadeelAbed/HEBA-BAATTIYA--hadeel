import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { getProducts } from "@/lib/queries";

const COLOR_HEX: Record<string, string> = {
  noir: "#1A1A1A",
  black: "#1A1A1A",
  blackberry: "#2D1B2E",
  etoile: "#C0B7AD",
  blush: "#E8B4B8",
  ivory: "#F5F0E8",
  cream: "#F5F0E8",
  white: "#FFFFFF",
  gold: "#C9A227",
  champagne: "#D9C9A3",
  emerald: "#0F5132",
  red: "#9E1B32",
  coral: "#E8704A",
  rose: "#C96A72",
  crimson: "#7B1E33",
  midnight: "#131A2E",
  navy: "#1B2A4A",
  blue: "#26418F",
  powder: "#D8D3E8",
  lilac: "#B9A7D0",
  sand: "#D8C3A0",
  taupe: "#A79B8B",
  camel: "#B48A5A",
  graphite: "#4A4A48",
};

function hexForColor(name: string) {
  const key = name.trim().toLowerCase();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  return "#161616";
}

type ProductInput = {
  name: string;
  sku: string;
  description: string;
  fabricDetails?: string;
  careInstructions?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  status: string;
  colors?: { name: string; hexCode?: string }[];
  sizes?: string[];
  images?: string[];
  stockTotal?: number;
};

function parseBody(body: unknown): ProductInput | null {
  const b = body as Record<string, unknown>;
  if (!b || typeof b.name !== "string" || typeof b.sku !== "string" || typeof b.description !== "string") return null;
  const price = Number(b.price);
  const categoryId = String(b.categoryId ?? "");
  if (!Number.isFinite(price) || !categoryId) return null;
  return {
    name: b.name,
    sku: b.sku,
    description: b.description,
    fabricDetails: typeof b.fabricDetails === "string" ? b.fabricDetails : undefined,
    careInstructions: typeof b.careInstructions === "string" ? b.careInstructions : undefined,
    price,
    compareAtPrice: b.compareAtPrice !== undefined && b.compareAtPrice !== null ? Number(b.compareAtPrice) : undefined,
    categoryId,
    status: typeof b.status === "string" ? b.status : "DRAFT",
    colors: Array.isArray(b.colors)
      ? b.colors
          .map((c) => {
            if (typeof c === "string") return c.trim() ? { name: c.trim() } : null;
            if (c && typeof c === "object") {
              const obj = c as Record<string, unknown>;
              const name = typeof obj.name === "string" ? obj.name.trim() : "";
              const hexCode = typeof obj.hexCode === "string" ? obj.hexCode.trim() : undefined;
              return name ? { name, hexCode } : null;
            }
            return null;
          })
          .filter((c): c is { name: string; hexCode?: string } => Boolean(c))
      : [],
    sizes: Array.isArray(b.sizes) ? b.sizes.map(String).filter(Boolean) : [],
    images: Array.isArray(b.images) ? b.images.map(String).filter(Boolean) : [],
    stockTotal: Number(b.stockTotal ?? 0),
  };
}

async function createOrUpdateChildren(productId: string, input: ProductInput) {
  // Reset existing children (variants first because they reference colors/sizes)
  await prisma.productVariant.deleteMany({ where: { productId } });
  await prisma.productColor.deleteMany({ where: { productId } });
  await prisma.productSize.deleteMany({ where: { productId } });
  await prisma.productImage.deleteMany({ where: { productId } });

  const colorObjs = [...new Map((input.colors ?? []).map((c) => [c.name, c])).values()];
  const sizeLabels = [...new Set(input.sizes ?? [])];

  const images = [];
  for (let i = 0; i < (input.images ?? []).length; i++) {
    images.push(
      prisma.productImage.create({
        data: { productId, url: (input.images ?? [])[i], sortOrder: i, isPrimary: i === 0 },
      })
    );
  }
  await Promise.all(images);

  const colors = [];
  for (const c of colorObjs) {
    colors.push(
      prisma.productColor.create({
        data: { productId, name: c.name, hexCode: c.hexCode ?? hexForColor(c.name) },
      })
    );
  }
  const createdColors = await Promise.all(colors);

  const sizes = [];
  for (let i = 0; i < sizeLabels.length; i++) {
    sizes.push(prisma.productSize.create({ data: { productId, label: sizeLabels[i], sortOrder: i } }));
  }
  const createdSizes = await Promise.all(sizes);

  const stockTotal = Math.max(0, Number(input.stockTotal ?? 0));
  const colorKeys = createdColors.length ? createdColors : [null];
  const sizeKeys = createdSizes.length ? createdSizes : [null];

  const variantCreates: ReturnType<typeof prisma.productVariant.create>[] = [];
  let allocated = false;
  for (const color of colorKeys) {
    for (const size of sizeKeys) {
      const sku = `${input.sku}${color ? `-${color.name}` : ""}${size ? `-${size.label}` : ""}`.replace(/\s+/g, "");
      const stock = allocated ? 0 : stockTotal;
      allocated = true;
      variantCreates.push(
        prisma.productVariant.create({
          data: {
            productId,
            colorId: color?.id ?? null,
            sizeId: size?.id ?? null,
            sku,
            stock,
          },
        })
      );
    }
  }
  await Promise.all(variantCreates);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = parseBody(await req.json());
  if (!input) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const baseSlug = slugify(input.name);
  const existing = await prisma.product.findUnique({ where: { slug: baseSlug } });
  const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-6)}` : baseSlug;

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug,
      sku: input.sku,
      description: input.description,
      fabricDetails: input.fabricDetails,
      careInstructions: input.careInstructions,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      categoryId: input.categoryId,
      status: input.status,
    },
  });

  await createOrUpdateChildren(product.id, input);

  const products = await getProducts();
  return NextResponse.json({ product: products.find((p) => p.id === product.id) }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

  const input = parseBody(body);
  if (!input) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      sku: input.sku,
      description: input.description,
      fabricDetails: input.fabricDetails,
      careInstructions: input.careInstructions,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      categoryId: input.categoryId,
      status: input.status,
    },
  });

  await createOrUpdateChildren(id, input);

  const products = await getProducts();
  return NextResponse.json({ product: products.find((p) => p.id === product.id) });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return NextResponse.json(
      { error: "This product has order history and cannot be deleted. Archive it instead." },
      { status: 400 }
    );
  }

  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
