import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, message: "This coupon code is not valid." }, { status: 404 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, message: "This coupon has expired." }, { status: 410 });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, message: "This coupon has reached its usage limit." }, { status: 410 });
  }

  if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
    return NextResponse.json(
      { valid: false, message: `Minimum order of SAR ${coupon.minOrderAmount} required.` },
      { status: 400 }
    );
  }

  return NextResponse.json({ valid: true, coupon });
}
