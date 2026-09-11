"use client";

import { STATUS_LABELS } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS: Record<string, string> = {
  PENDENTE: "#94a3b8",
  EM_ANDAMENTO: "#3b82f6",
  AGUARDANDO_TERCEIRO: "#f59e0b",
  CONCLUIDO: "#10b981",
  CANCELADO: "#ef4444",
};

export function StatusPieChart({
  data,
}: {
  data: { status: string; _count: { _all: number } }[];
}) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status] ?? d.status,
    value: d._count._all,
    color: COLORS[d.status] ?? "#94a3b8",
  }));

  if (chartData.every((d) => d.value === 0)) {
    return <EmptyChart />;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function EmptyChart() {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
      Ainda não há dados suficientes.
    </div>
  );
}
