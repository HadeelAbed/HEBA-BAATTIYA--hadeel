import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCart, serializeCart } from "@/lib/cart";

export async function GET() {
  const { cart } = await resolveCart();
  const items = await serializeCart(cart.id);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const productId = typeof body.productId === "string" ? body.productId : "";
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const quantity = Math.max(1, Math.min(Math.round(Number(body.quantity) || 1), 10));
  const colorName = typeof body.colorName === "string" ? body.colorName.slice(0, 60) : "";
  const sizeLabel = typeof body.sizeLabel === "string" ? body.sizeLabel.slice(0, 20) : "";

  const product = await prisma.product.findFirst({
    where: { id: productId, status: "ACTIVE" },
  });
  if (!product) {
    return NextResponse.json({ error: "This product is not available." }, { status: 404 });
  }

  const { cart } = await resolveCart();

  await prisma.cartItem.upsert({
    where: {
      cartId_productId_colorName_sizeLabel: { cartId: cart.id, productId, colorName, sizeLabel },
    },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, colorName, sizeLabel, quantity },
  });

  const items = await serializeCart(cart.id);
  return NextResponse.json({ items }, { status: 201 });
}

export async function DELETE() {
  const { cart } = await resolveCart();
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return NextResponse.json({ items: [] });
}
