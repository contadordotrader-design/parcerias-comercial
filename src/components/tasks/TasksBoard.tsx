"use client";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskTable } from "@/components/tasks/TaskTable";
import { CategoryOption, CollaboratorOption, PartnerOption, TaskListItem } from "@/components/tasks/types";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { LayoutList, KanbanSquare, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Setor = TaskListItem["setor"];

export function TasksBoard({
  title,
  subtitle,
  fixedSetor,
  onlyMine = false,
  showSetorColumn = true,
  showPrazoQuickFilters = false,
  showCategoryFilter = false,
}: {
  title: string;
  subtitle?: string;
  fixedSetor?: Setor;
  onlyMine?: boolean;
  showSetorColumn?: boolean;
  showPrazoQuickFilters?: boolean;
  showCategoryFilter?: boolean;
}) {
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [colaboradores, setColaboradores] = useState<CollaboratorOption[]>([]);
  const [parceiros, setParceiros] = useState<PartnerOption[]>([]);
  const [categorias, setCategorias] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskListItem | null>(null);

  const [status, setStatus] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [prazoFiltro, setPrazoFiltro] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [busca, setBusca] = useState("");
  const [visao, setVisao] = useState<"lista" | "kanban">("lista");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fixedSetor) params.set("setor", fixedSetor);
    if (onlyMine) params.set("mine", "1");
    if (status) params.set("status", status);
    if (prioridade) params.set("prioridade", prioridade);
    if (prazoFiltro) params.set("prazo", prazoFiltro);
    if (categoriaId) params.set("categoriaId", categoriaId);
    if (busca) params.set("q", busca);

    const categoryParams = fixedSetor ? `?setor=${fixedSetor}` : "";

    const [tasksRes, usersRes, partnersRes, categoriesRes] = await Promise.all([
      fetch(`/api/tasks?${params.toString()}`),
      fetch("/api/users"),
      fetch("/api/partners"),
      fetch(`/api/categories${categoryParams}`),
    ]);

    if (tasksRes.ok) setTasks(await tasksRes.json());
    if (usersRes.ok) {
      const users = await usersRes.json();
      setColaboradores(users.filter((u: { status: string }) => u.status === "ATIVO"));
    }
    if (partnersRes.ok) setParceiros(await partnersRes.json());
    if (categoriesRes.ok) setCategorias(await categoriesRes.json());

    setLoading(false);
  }, [fixedSetor, onlyMine, status, prioridade, prazoFiltro, categoriaId, busca]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(task: TaskListItem) {
    if (!confirm(`Excluir a tarefa "${task.titulo}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function handleStatusChange(task: TaskListItem, novoStatus: TaskListItem["status"]) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: novoStatus } : t)));
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    if (!res.ok) {
      load();
      return;
    }
    const atualizada = await res.json();
    if (atualizada.proximaOcorrenciaId) {
      load();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setVisao("lista")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
                visao === "lista" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Lista
            </button>
            <button
              onClick={() => setVisao("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${
                visao === "kanban" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <KanbanSquare className="h-3.5 w-3.5" />
              Kanban
            </button>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nova tarefa
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tarefa..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm focus:border-slate-400 focus:outline-none"
          />
        </div>

        {showPrazoQuickFilters && (
          <Select value={prazoFiltro} onChange={(e) => setPrazoFiltro(e.target.value)} className="w-auto">
            <option value="">Todos os prazos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta semana</option>
            <option value="atrasadas">Atrasadas</option>
          </Select>
        )}

        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="AGUARDANDO_TERCEIRO">Aguardando terceiro</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="CANCELADO">Cancelado</option>
        </Select>

        {showCategoryFilter && (
          <Select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-auto">
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </Select>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          Carregando tarefas...
        </div>
      ) : visao === "kanban" ? (
        <KanbanBoard
          tasks={tasks}
          onEdit={(task) => {
            setEditing(task);
            setModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={(task) => {
            setEditing(task);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          showSetor={showSetorColumn}
        />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        task={editing}
        colaboradores={colaboradores}
        parceiros={parceiros}
        defaultSetor={fixedSetor}
      />
    </div>
  );
}

