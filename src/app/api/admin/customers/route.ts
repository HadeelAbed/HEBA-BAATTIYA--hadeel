import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    customers: users.map((u) => ({
      id: u.id,
      name: (u.name ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()) || u.email,
      email: u.email,
      phone: u.phone,
      createdAt: u.createdAt.toISOString(),
      totalOrders: u.orders.length,
      totalSpent: u.orders.reduce((sum, o) => sum + Number(o.total), 0),
    })),
  });
}
