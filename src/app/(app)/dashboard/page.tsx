import { getDashboardData } from "@/lib/dashboard-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatusPieChart } from "@/components/dashboard/charts/StatusPieChart";
import { AreaBarChart } from "@/components/dashboard/charts/AreaBarChart";
import { CompletedOverTimeChart } from "@/components/dashboard/charts/CompletedOverTimeChart";
import { CollaboratorBarChart } from "@/components/dashboard/charts/CollaboratorBarChart";
import { PriorityPieChart } from "@/components/dashboard/charts/PriorityPieChart";
import { DeadlineList, OverdueList, RecentActivityList } from "@/components/dashboard/Lists";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Flame,
  Handshake,
  ListTodo,
  PauseCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { cards } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Visão geral das rotinas de Comercial e Parcerias.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Abertas" value={cards.totalAbertas} icon={ListTodo} />
        <StatCard label="Em andamento" value={cards.emAndamento} icon={Clock} tone="default" />
        <StatCard label="Concluídas" value={cards.concluidas} icon={CheckCircle2} tone="success" />
        <StatCard label="Atrasadas" value={cards.atrasadas} icon={AlertTriangle} tone="danger" />
        <StatCard label="Aguardando terceiro" value={cards.aguardandoTerceiro} icon={PauseCircle} tone="warning" />
        <StatCard label="Alta prioridade" value={cards.altaPrioridade} icon={Flame} tone="danger" />
        <StatCard label="Comercial" value={cards.comercialAbertas} icon={Building2} />
        <StatCard label="Parcerias" value={cards.parceriasAbertas} icon={Handshake} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Tarefas por status">
          <StatusPieChart data={data.porStatus} />
        </ChartCard>
        <ChartCard title="Tarefas por área">
          <AreaBarChart data={data.porArea} />
        </ChartCard>
        <ChartCard title="Tarefas por prioridade">
          <PriorityPieChart data={data.porPrioridade} />
        </ChartCard>
        <ChartCard title="Concluídas ao longo do tempo">
          <CompletedOverTimeChart data={data.concluidasPorMes} />
        </ChartCard>
        <div className="lg:col-span-2 xl:col-span-1">
          <ChartCard title="Tarefas por colaborador">
            <CollaboratorBarChart data={data.porColaborador} />
          </ChartCard>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-700">Próximos vencimentos</h3>
          <DeadlineList tasks={data.proximosVencimentos} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-700">Tarefas atrasadas</h3>
          <OverdueList tasks={data.tarefasAtrasadas} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-slate-700">Atividades recentes</h3>
          <RecentActivityList items={data.atividadesRecentes} />
        </div>
      </div>
    </div>
  );
}
