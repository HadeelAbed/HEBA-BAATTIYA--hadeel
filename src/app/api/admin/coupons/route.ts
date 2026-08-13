import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    coupons: coupons.map((c) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: c.minOrderAmount === null ? undefined : Number(c.minOrderAmount),
      maxUses: c.maxUses ?? undefined,
      usedCount: c.usedCount,
      isActive: c.isActive,
      expiresAt: c.expiresAt?.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const code = typeof b.code === "string" ? b.code.trim().toUpperCase() : "";
  const discountType = typeof b.discountType === "string" ? b.discountType : "PERCENTAGE";
  const discountValue = Number(b.discountValue);
  if (!code || !Number.isFinite(discountValue) || discountValue <= 0) {
    return NextResponse.json({ error: "Invalid coupon details" }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      description: typeof b.description === "string" ? b.description : undefined,
      discountType,
      discountValue,
      minOrderAmount: b.minOrderAmount !== undefined && b.minOrderAmount !== "" ? Number(b.minOrderAmount) : undefined,
      maxUses: b.maxUses !== undefined && b.maxUses !== "" ? Number(b.maxUses) : undefined,
      expiresAt: b.expiresAt ? new Date(b.expiresAt) : undefined,
      isActive: true,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const id = typeof b.id === "string" ? b.id : "";
  if (!id) return NextResponse.json({ error: "Coupon id is required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (typeof b.isActive === "boolean") data.isActive = b.isActive;
  if (typeof b.description === "string") data.description = b.description;
  if (b.discountValue !== undefined && b.discountValue !== "") data.discountValue = Number(b.discountValue);
  if (b.minOrderAmount !== undefined && b.minOrderAmount !== "") data.minOrderAmount = Number(b.minOrderAmount);
  if (b.maxUses !== undefined && b.maxUses !== "") data.maxUses = Number(b.maxUses);
  if (b.expiresAt !== undefined) data.expiresAt = b.expiresAt ? new Date(b.expiresAt) : null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const coupon = await prisma.coupon.update({ where: { id }, data });

  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const id = typeof b.id === "string" ? b.id : "";
  if (!id) return NextResponse.json({ error: "Coupon id is required" }, { status: 400 });

  await prisma.coupon.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
