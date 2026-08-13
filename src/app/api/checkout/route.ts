import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";

const TAX_RATE = 0.15;
const FREE_SHIPPING_THRESHOLD = 2000;
const STANDARD_SHIPPING = 75;

interface LineInput {
  productId: string;
  quantity: number;
  colorName?: string;
  sizeLabel?: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to place an order." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const lines: LineInput[] = Array.isArray(body.lines) ? body.lines : [];

  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const productIds = lines.map((l) => l.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  let subtotal = 0;
  const items = lines.map((l) => {
    const product = products.find((p) => p.id === l.productId);
    if (!product) return null;
    const unitPrice = Number(product.price);
    const lineTotal = unitPrice * l.quantity;
    subtotal += lineTotal;
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0]?.url,
      colorName: l.colorName,
      sizeLabel: l.sizeLabel,
      unitPrice,
      quantity: l.quantity,
      lineTotal,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) {
    return NextResponse.json({ error: "One or more items are unavailable." }, { status: 400 });
  }

  // --- Coupon ---
  let discountAmount = 0;
  let couponId: string | undefined;
  const couponCode = typeof body.couponCode === "string" ? body.couponCode.trim().toUpperCase() : "";

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (coupon && coupon.isActive) {
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
      }
      if (coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
      }
      if (coupon.minOrderAmount !== null && coupon.minOrderAmount !== undefined && subtotal < Number(coupon.minOrderAmount)) {
        return NextResponse.json(
          { error: `Minimum order of ${Number(coupon.minOrderAmount).toLocaleString()} SAR required for this coupon.` },
          { status: 400 }
        );
      }
      couponId = coupon.id;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
      } else if (coupon.discountType === "FIXED_AMOUNT") {
        discountAmount = Math.min(Number(coupon.discountValue), subtotal);
      }
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    } else {
      return NextResponse.json({ error: "This coupon code is not valid or has expired." }, { status: 400 });
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const taxAmount = taxableAmount * TAX_RATE;
  const total = Math.max(0, taxableAmount + taxAmount + shippingCost);

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      subtotal,
      shippingCost,
      taxAmount,
      discountAmount,
      total,
      currency: "SAR",
      paymentMethod: parsed.data.paymentMethod,
      couponId,
      shipFullName: parsed.data.fullName,
      shipPhone: parsed.data.phone,
      shipEmail: parsed.data.email,
      shipCountry: parsed.data.country,
      shipCity: parsed.data.city,
      shipLine1: parsed.data.line1,
      shipLine2: parsed.data.line2,
      shipPostal: parsed.data.postalCode,
      items: { create: items },
    },
  });

  // Payment capture would happen here based on parsed.data.paymentMethod:
  // - MADA / VISA / MASTERCARD: redirect to PSP-hosted payment page or use a tokenized charge
  // - APPLE_PAY: validate Apple Pay merchant session + process payment token
  // - STC_PAY: redirect to STC Pay's hosted checkout and confirm via webhook
  // On success, update order.paymentStatus to "PAID" via a webhook handler.
  // For Cash on Delivery the order is confirmed immediately.

  // Deduct stock for each item purchased
  for (const l of lines) {
    const variants = await prisma.productVariant.findMany({
      where: { productId: l.productId },
      orderBy: { stock: "desc" },
    });
    if (variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: variants[0].id },
        data: { stock: { decrement: l.quantity } },
      });
    }
  }

  if (parsed.data.paymentMethod === "CASH_ON_DELIVERY") {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PENDING", status: "CONFIRMED" },
    });
  }

  return NextResponse.json({ order: { ...order, items } }, { status: 201 });
}
