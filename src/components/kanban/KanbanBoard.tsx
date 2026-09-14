"use client";

import { PriorityBadge } from "@/components/tasks/Badges";
import { TaskListItem } from "@/components/tasks/types";
import { formatDate, isOverdue } from "@/lib/utils";
import { Repeat } from "lucide-react";
import { useState } from "react";

const COLUNAS: { status: TaskListItem["status"]; titulo: string }[] = [
  { status: "PENDENTE", titulo: "Pendente" },
  { status: "EM_ANDAMENTO", titulo: "Em andamento" },
  { status: "AGUARDANDO_TERCEIRO", titulo: "Aguardando terceiro" },
  { status: "CONCLUIDO", titulo: "Concluído" },
];

export function KanbanBoard({
  tasks,
  onEdit,
  onStatusChange,
}: {
  tasks: TaskListItem[];
  onEdit: (task: TaskListItem) => void;
  onStatusChange: (task: TaskListItem, novoStatus: TaskListItem["status"]) => void;
}) {
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<string | null>(null);

  function handleDrop(status: TaskListItem["status"]) {
    if (!arrastando) return;
    const task = tasks.find((t) => t.id === arrastando);
    if (task && task.status !== status) {
      onStatusChange(task, status);
    }
    setArrastando(null);
    setColunaAlvo(null);
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {COLUNAS.map((coluna) => {
        const tarefasColuna = tasks.filter((t) => t.status === coluna.status);
        const emFoco = colunaAlvo === coluna.status;
        return (
          <div
            key={coluna.status}
            onDragOver={(e) => {
              e.preventDefault();
              setColunaAlvo(coluna.status);
            }}
            onDragLeave={() => setColunaAlvo((c) => (c === coluna.status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(coluna.status);
            }}
            className={`flex flex-col rounded-xl border bg-slate-50/60 p-2 transition-colors ${
              emFoco ? "border-slate-400 bg-slate-100" : "border-slate-200"
            }`}
          >
            <div className="mb-2 flex items-center justify-between px-1.5 py-1">
              <h3 className="text-xs font-semibold text-slate-600">{coluna.titulo}</h3>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                {tarefasColuna.length}
              </span>
            </div>

            <div className="flex min-h-[120px] flex-col gap-2">
              {tarefasColuna.map((task) => {
                const atrasada = isOverdue(task.prazo, task.status);
                return (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setArrastando(task.id)}
                    onDragEnd={() => {
                      setArrastando(null);
                      setColunaAlvo(null);
                    }}
                    onClick={() => onEdit(task)}
                    className="cursor-grab rounded-lg border border-slate-200 bg-white p-2.5 text-sm shadow-sm hover:border-slate-300 active:cursor-grabbing"
                  >
                    <p className="flex items-center gap-1.5 font-medium text-slate-800">
                      {task.titulo}
                      {task.recorrencia !== "NENHUMA" && (
                        <Repeat className="h-3 w-3 shrink-0 text-slate-400" />
                      )}
                    </p>
                    {task.categoria && (
                      <p className="mt-0.5 text-xs text-slate-400">{task.categoria.nome}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <PriorityBadge priority={task.prioridade} />
                      {task.prazo && (
                        <span
                          className={`text-xs ${atrasada ? "font-medium text-red-600" : "text-slate-400"}`}
                        >
                          {formatDate(task.prazo)}
                        </span>
                      )}
                    </div>
                    {task.responsavel && (
                      <p className="mt-1.5 text-xs text-slate-400">{task.responsavel.nome}</p>
                    )}
                  </div>
                );
              })}
              {tarefasColuna.length === 0 && (
                <p className="px-1.5 py-4 text-center text-xs text-slate-400">Nenhuma tarefa</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

