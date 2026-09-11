import { formatDate, formatDateTime } from "@/lib/utils";
import { Task, TaskHistory } from "@prisma/client";
import { AlertTriangle, CalendarClock, Clock } from "lucide-react";

type TaskWithResponsavel = Task & { responsavel: { nome: string } | null };
type HistoryItem = TaskHistory & {
  autor: { nome: string };
  task: { titulo: string };
};

export function DeadlineList({ tasks }: { tasks: TaskWithResponsavel[] }) {
  if (tasks.length === 0) {
    return <EmptyState text="Nenhum prazo próximo. Tudo em dia por aqui." />;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {task.titulo}
            </p>
            <p className="text-xs text-slate-500">
              {task.responsavel?.nome ?? "Sem responsável"}
            </p>
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-slate-500">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDate(task.prazo)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function OverdueList({ tasks }: { tasks: TaskWithResponsavel[] }) {
  if (tasks.length === 0) {
    return <EmptyState text="Nenhuma tarefa atrasada. Ótimo trabalho!" />;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {task.titulo}
            </p>
            <p className="text-xs text-slate-500">
              {task.responsavel?.nome ?? "Sem responsável"}
            </p>
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            {formatDate(task.prazo)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function RecentActivityList({ items }: { items: HistoryItem[] }) {
  if (items.length === 0) {
    return <EmptyState text="Sem atividades registradas ainda." />;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2.5 py-2.5">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">{item.autor.nome}</span>{" "}
              {item.acao} em{" "}
              <span className="font-medium text-slate-900">{item.task.titulo}</span>
            </p>
            <p className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-slate-400">{text}</p>;
}
