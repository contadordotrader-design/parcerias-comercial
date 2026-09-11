"use client";

import { EmptyChart } from "@/components/dashboard/charts/StatusPieChart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function CompletedOverTimeChart({
  data,
}: {
  data: { mes: string; total: number }[];
}) {
  if (data.length === 0) return <EmptyChart />;

  const chartData = data.map((d) => ({
    mes: new Date(d.mes + "-02").toLocaleDateString("pt-BR", {
      month: "short",
      year: "2-digit",
    }),
    total: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="mes" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#d4a017"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
