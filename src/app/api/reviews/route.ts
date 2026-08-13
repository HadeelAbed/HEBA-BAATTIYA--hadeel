import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { productId } = body;

  // Verify the user purchased this product before marking as a verified purchase
  const purchased = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: session.user.id, paymentStatus: "PAID" } },
  });

  const review = await prisma.review.create({
    data: {
      ...parsed.data,
      productId,
      userId: session.user.id,
      isVerifiedPurchase: !!purchased,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
