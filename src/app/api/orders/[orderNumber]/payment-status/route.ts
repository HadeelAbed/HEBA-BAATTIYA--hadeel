import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public read-only endpoint used by the order-confirmation page to reflect
// the live Tap payment status after the customer returns from the payment
// page. Returns only display data — never keys, card data or raw payloads.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      orderNumber: true,
      paymentStatus: true,
      paymentMethod: true,
      total: true,
      currency: true,
      payments: {
        select: { tapChargeId: true, status: true, paidAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const payment = order.payments[0];

  return NextResponse.json({
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    total: Number(order.total),
    currency: order.currency,
    tapChargeId: payment?.tapChargeId ?? null,
    paymentStatusDetail: payment?.status ?? null,
    paidAt: payment?.paidAt ?? null,
  });
}
