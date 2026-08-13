"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { OrderStatus } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
  monthlyRevenue: { month: string; revenue: number }[];
  lowStock: { id: string; name: string; sku: string; stockTotal: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    shipFullName: string;
    total: number;
    createdAt: string;
  }[];
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <>
        <AdminTopbar title="Overview" />
        <div className="p-8 text-sm text-stone">Loading dashboard...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Overview" />
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={formatPrice(data.totalRevenue)} change={data.revenueChange} icon={DollarSign} />
          <StatCard label="Orders" value={data.totalOrders.toString()} change={data.ordersChange} icon={ShoppingCart} />
          <StatCard label="Customers" value={data.totalCustomers.toString()} change={data.customersChange} icon={Users} />
          <StatCard label="Products" value={data.totalProducts.toString()} change={data.productsChange} icon={Package} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="border border-hairline bg-white p-6 lg:col-span-2">
            <h2 className="mb-6 font-display text-lg tracking-wide">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#161616" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#161616" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8C8A84" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#8C8A84" }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => formatPrice(value)}
                  contentStyle={{ border: "1px solid #E4E2DC", borderRadius: 0, fontSize: 13 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#161616" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-hairline bg-white p-6">
            <h2 className="mb-6 font-display text-lg tracking-wide">Low Stock Alert</h2>
            <div className="space-y-4">
              {data.lowStock.length === 0 && <p className="text-sm text-stone">All products are well stocked.</p>}
              {data.lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">{p.name}</p>
                    <p className="text-xs text-stone">{p.sku}</p>
                  </div>
                  <span className="bg-red-100 px-2.5 py-1 text-xs text-red-700">{p.stockTotal} left</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-hairline bg-white">
          <div className="flex items-center justify-between border-b border-hairline p-6">
            <h2 className="font-display text-lg tracking-wide">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs tracking-widest2 uppercase text-charcoal hover:opacity-60">
              View All
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs tracking-widest2 uppercase text-stone">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-stone">
                    No orders yet.
                  </td>
                </tr>
              )}
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-hairline last:border-0">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-graphite">{order.shipFullName}</td>
                  <td className="px-6 py-4 text-graphite">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td className="px-6 py-4 text-right">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
