import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [totalRevenueAgg, totalOrders, totalCustomers, totalProducts, orders, lowStockProducts, salesByCategory] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        include: { items: true, user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: { variants: true },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.product.groupBy({
        by: ["categoryId"],
        _sum: { price: true },
      }),
    ]);

  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Other";

  const lowStock = lowStockProducts
    .map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stockTotal: p.variants.reduce((sum, v) => sum + v.stock, 0),
    }))
    .filter((p) => p.stockTotal < 10)
    .sort((a, b) => a.stockTotal - b.stockTotal)
    .slice(0, 5);

  const salesByCategoryData = salesByCategory
    .map((row) => ({
      category: categoryName(row.categoryId),
      sales: Number(row._sum.price ?? 0),
    }))
    .sort((a, b) => b.sales - a.sales);

  // Recent orders serialized
  const recentOrders = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    shipFullName: o.shipFullName,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
    user: o.user,
  }));

  // Monthly revenue from all orders in the last 12 months
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const yearOrders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfYear }, paymentStatus: "PAID" },
    select: { createdAt: true, total: true },
  });

  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS[i],
    revenue: 0,
  }));
  for (const o of yearOrders) {
    const month = o.createdAt.getMonth();
    monthlyRevenue[month].revenue += Number(o.total);
  }

  const monthlyOrders = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS[i],
    orders: 0,
  }));
  const allYearOrders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfYear } },
    select: { createdAt: true },
  });
  for (const o of allYearOrders) {
    monthlyOrders[o.createdAt.getMonth()].orders += 1;
  }

  const totalRevenue = Number(totalRevenueAgg._sum.total ?? 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Repeat purchase rate: share of customers with more than one order
  const customersWithOrders = await prisma.user.findMany({
    where: { role: "CUSTOMER", orders: { some: {} } },
    select: { _count: { select: { orders: true } } },
  });
  const repeatCustomers = customersWithOrders.filter((c) => c._count.orders > 1).length;
  const repeatPurchaseRate =
    customersWithOrders.length > 0
      ? Math.round((repeatCustomers / customersWithOrders.length) * 100)
      : 0;

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newCustomersThisMonth = await prisma.user.count({
    where: { role: "CUSTOMER", createdAt: { gte: startOfMonth } },
  });

  // Top products by quantity sold
  const topProductRows = await prisma.orderItem.groupBy({
    by: ["productName"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });
  const topProducts = topProductRows.map((r) => ({
    name: r.productName,
    quantity: r._sum.quantity ?? 0,
  }));

  // Real change percentages — last 30 days vs the previous 30 days
  const curStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const prevStart = new Date(curStart.getTime() - 30 * 24 * 60 * 60 * 1000);

  const pctChange = (current: number, previous: number) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  };

  const [curRevenueAgg, prevRevenueAgg, curOrders, prevOrders, curCustomers, prevCustomers, curProducts, prevProducts] =
    await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: curStart } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID", createdAt: { gte: prevStart, lt: curStart } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: curStart } } }),
      prisma.order.count({ where: { createdAt: { gte: prevStart, lt: curStart } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: curStart } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: prevStart, lt: curStart } } }),
      prisma.product.count({ where: { createdAt: { gte: curStart } } }),
      prisma.product.count({ where: { createdAt: { gte: prevStart, lt: curStart } } }),
    ]);

  const curRevenue = Number(curRevenueAgg._sum.total ?? 0);
  const prevRevenue = Number(prevRevenueAgg._sum.total ?? 0);
  const curAvgOrderValue = curOrders > 0 ? curRevenue / curOrders : 0;
  const prevAvgOrderValue = prevOrders > 0 ? prevRevenue / prevOrders : 0;

  async function repeatRateSince(start: Date, end: Date) {
    const rows = await prisma.order.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { _all: true },
    });
    if (rows.length === 0) return 0;
    const repeat = rows.filter((r) => r._count._all > 1).length;
    return Math.round((repeat / rows.length) * 100);
  }

  const [curRepeatRate, prevRepeatRate] = await Promise.all([
    repeatRateSince(curStart, now),
    repeatRateSince(prevStart, curStart),
  ]);

  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
  const newCustomersPrevMonth = await prisma.user.count({
    where: { role: "CUSTOMER", createdAt: { gte: prevMonthStart, lt: prevMonthEnd } },
  });

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    avgOrderValue,
    repeatPurchaseRate,
    newCustomersThisMonth,
    revenueChange: pctChange(curRevenue, prevRevenue),
    ordersChange: pctChange(curOrders, prevOrders),
    customersChange: pctChange(curCustomers, prevCustomers),
    productsChange: pctChange(curProducts, prevProducts),
    avgOrderValueChange: pctChange(curAvgOrderValue, prevAvgOrderValue),
    repeatPurchaseRateChange: pctChange(curRepeatRate, prevRepeatRate),
    newCustomersChange: pctChange(newCustomersThisMonth, newCustomersPrevMonth),
    topProducts,
    monthlyRevenue,
    monthlyOrders,
    salesByCategory: salesByCategoryData,
    lowStock,
    recentOrders,
  });
}
