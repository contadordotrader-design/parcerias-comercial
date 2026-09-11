"use client";

import { SETOR_LABELS } from "@/lib/utils";
import { EmptyChart } from "@/components/dashboard/charts/StatusPieChart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AreaBarChart({
  data,
}: {
  data: { setor: string; _count: { _all: number } }[];
}) {
  const chartData = data.map((d) => ({
    name: SETOR_LABELS[d.setor] ?? d.setor,
    total: d._count._all,
  }));

  if (chartData.every((d) => d.total === 0)) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="total" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
