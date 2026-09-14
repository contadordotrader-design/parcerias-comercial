"use client";

import { StatusBadge, PriorityBadge } from "@/components/tasks/Badges";
import { TaskListItem } from "@/components/tasks/types";
import { formatDate, isOverdue, SETOR_LABELS } from "@/lib/utils";
import { Pencil, Repeat, Trash2 } from "lucide-react";

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
  showSetor = true,
}: {
  tasks: TaskListItem[];
  onEdit: (task: TaskListItem) => void;
  onDelete: (task: TaskListItem) => void;
  showSetor?: boolean;
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm text-slate-500">Nenhuma tarefa encontrada com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-medium text-slate-500">
          <tr>
            <th className="px-4 py-3">Tarefa</th>
            {showSetor && <th className="px-4 py-3">Área</th>}
            <th className="px-4 py-3">Responsável</th>
            <th className="px-4 py-3">Prioridade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Prazo</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const atrasada = isOverdue(task.prazo, task.status);
            const subConcluidas = task.subtarefas.filter((s) => s.concluida).length;
            return (
              <tr key={task.id} className="hover:bg-slate-50/60">
                <td className="max-w-xs px-4 py-3">
                  <p className="flex items-center gap-1.5 truncate font-medium text-slate-800">
                    {task.titulo}
                    {task.recorrencia !== "NENHUMA" && (
                      <Repeat className="h-3 w-3 shrink-0 text-slate-400" />
                    )}
                  </p>
                  {task.categoria && (
                    <p className="text-xs text-slate-400">{task.categoria.nome}</p>
                  )}
                  {task.subtarefas.length > 0 && (
                    <p className="text-xs text-slate-400">
                      {subConcluidas} de {task.subtarefas.length} subtarefas concluídas
                    </p>
                  )}
                </td>
                {showSetor && (
                  <td className="px-4 py-3 text-slate-600">{SETOR_LABELS[task.setor]}</td>
                )}
                <td className="px-4 py-3 text-slate-600">{task.responsavel?.nome ?? "—"}</td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.prioridade} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className={`px-4 py-3 ${atrasada ? "font-medium text-red-600" : "text-slate-600"}`}>
                  {formatDate(task.prazo)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

