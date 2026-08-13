import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveCart, serializeCart } from "@/lib/cart";

async function getOwnedItem(cartId: string, id: string) {
  return prisma.cartItem.findFirst({ where: { id, cartId } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { cart } = await resolveCart();
  const item = await getOwnedItem(cart.id, id);
  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const quantity = Math.max(0, Math.min(Math.round(Number(body.quantity) || 0), 10));

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id } });
  } else {
    await prisma.cartItem.update({ where: { id }, data: { quantity } });
  }

  const items = await serializeCart(cart.id);
  return NextResponse.json({ items });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { cart } = await resolveCart();
  await prisma.cartItem.deleteMany({ where: { id, cartId: cart.id } });

  const items = await serializeCart(cart.id);
  return NextResponse.json({ items });
}
