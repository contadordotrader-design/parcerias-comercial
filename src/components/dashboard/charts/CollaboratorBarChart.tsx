"use client";

import { EmptyChart } from "@/components/dashboard/charts/StatusPieChart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function CollaboratorBarChart({
  data,
}: {
  data: { nome: string; abertas: number; concluidas: number; atrasadas: number }[];
}) {
  if (data.length === 0) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="nome" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip cursor={{ fill: "#f8fafc" }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="abertas" name="Abertas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="concluidas" name="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="atrasadas" name="Atrasadas" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
