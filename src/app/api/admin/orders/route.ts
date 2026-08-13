import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";
import { mapOrder } from "@/lib/queries";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    include: {
      items: true,
      payments: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      ...mapOrder(o),
      user: o.user,
      payments: o.payments.map((p) => ({
        id: p.id,
        tapChargeId: p.tapChargeId,
        tapPaymentId: p.tapPaymentId,
        amount: Number(p.amount),
        currency: p.currency,
        method: p.method,
        status: p.status,
        paidAt: p.paidAt?.toISOString(),
        createdAt: p.createdAt.toISOString(),
      })),
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Order id is required" }, { status: 400 });

  const data: Record<string, string> = {};
  if (typeof body.status === "string") data.status = body.status;
  if (typeof body.paymentStatus === "string") data.paymentStatus = body.paymentStatus;
  if (typeof body.trackingNumber === "string") data.trackingNumber = body.trackingNumber;
  if (typeof body.trackingCarrier === "string") data.trackingCarrier = body.trackingCarrier;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id }, data });

  return NextResponse.json({ order });
}
