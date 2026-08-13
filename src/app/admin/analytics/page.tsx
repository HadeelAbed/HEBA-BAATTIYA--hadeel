"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { StatCard } from "@/components/admin/stat-card";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AnalyticsData {
  avgOrderValue: number;
  repeatPurchaseRate: number;
  newCustomersThisMonth: number;
  totalProducts: number;
  avgOrderValueChange: number;
  repeatPurchaseRateChange: number;
  newCustomersChange: number;
  productsChange: number;
  monthlyOrders: { month: string; orders: number }[];
  salesByCategory: { category: string; sales: number }[];
  topProducts: { name: string; quantity: number }[];
}

const COLORS = ["#161616", "#3A3A38", "#8C8A84", "#D9D7D0", "#B48A5A"];

export default function AdminAnalyticsPage() {
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
        <AdminTopbar title="Analytics" />
        <div className="p-8 text-sm text-stone">Loading analytics...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Analytics" />
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Avg. Order Value" value={formatPrice(data.avgOrderValue)} change={data.avgOrderValueChange} icon={TrendingUp} />
          <StatCard label="New Customers (Month)" value={data.newCustomersThisMonth.toString()} change={data.newCustomersChange} icon={Users} />
          <StatCard label="Repeat Purchase Rate" value={`${data.repeatPurchaseRate}%`} change={data.repeatPurchaseRateChange} icon={ShoppingBag} />
          <StatCard label="Products Live" value={data.totalProducts.toString()} change={data.productsChange} icon={Package} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="border border-hairline bg-white p-6">
            <h2 className="mb-6 font-display text-lg tracking-wide">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesByCategory} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8C8A84" }} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#3A3A38" }} width={80} />
                <Tooltip formatter={(value: number) => formatPrice(value)} contentStyle={{ border: "1px solid #E4E2DC", borderRadius: 0, fontSize: 13 }} />
                <Bar dataKey="sales" fill="#161616" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-hairline bg-white p-6">
            <h2 className="mb-6 font-display text-lg tracking-wide">Top Products</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.topProducts} dataKey="quantity" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.topProducts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: "1px solid #E4E2DC", borderRadius: 0, fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            {data.topProducts.length === 0 && (
              <p className="mt-4 text-center text-sm text-stone">No sales data yet.</p>
            )}
          </div>
        </div>

        <div className="border border-hairline bg-white p-6">
          <h2 className="mb-6 font-display text-lg tracking-wide">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.monthlyOrders}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#161616" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#161616" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DC" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8C8A84" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8C8A84" }} />
              <Tooltip contentStyle={{ border: "1px solid #E4E2DC", borderRadius: 0, fontSize: 13 }} />
              <Area type="monotone" dataKey="orders" stroke="#161616" strokeWidth={2} fill="url(#ordersGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
