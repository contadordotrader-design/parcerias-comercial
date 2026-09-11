"use client";

import { PRIORITY_LABELS } from "@/lib/utils";
import { EmptyChart } from "@/components/dashboard/charts/StatusPieChart";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS: Record<string, string> = {
  ALTA: "#ef4444",
  MEDIA: "#f59e0b",
  BAIXA: "#94a3b8",
};

export function PriorityPieChart({
  data,
}: {
  data: { prioridade: string; _count: { _all: number } }[];
}) {
  const chartData = data.map((d) => ({
    name: PRIORITY_LABELS[d.prioridade] ?? d.prioridade,
    value: d._count._all,
    color: COLORS[d.prioridade] ?? "#94a3b8",
  }));

  if (chartData.every((d) => d.value === 0)) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
