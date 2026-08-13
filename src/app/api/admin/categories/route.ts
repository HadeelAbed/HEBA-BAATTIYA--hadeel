import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      parentId: c.parentId,
      isFeatured: c.isFeatured,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Category name is required" }, { status: 400 });

  const baseSlug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug: baseSlug } });
  const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-6)}` : baseSlug;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: typeof b.description === "string" ? b.description : undefined,
      image: typeof b.image === "string" ? b.image : undefined,
      isFeatured: b.isFeatured === true,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const id = typeof b.id === "string" ? b.id : "";
  if (!id) return NextResponse.json({ error: "Category id is required" }, { status: 400 });

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: "This category has products and cannot be deleted." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const id = typeof b.id === "string" ? b.id : "";
  if (!id) return NextResponse.json({ error: "Category id is required" }, { status: 400 });

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Category name is required" }, { status: 400 });

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      description: typeof b.description === "string" ? b.description : undefined,
      image: typeof b.image === "string" ? b.image : undefined,
      isFeatured: b.isFeatured === true,
    },
  });

  return NextResponse.json({ category });
}
