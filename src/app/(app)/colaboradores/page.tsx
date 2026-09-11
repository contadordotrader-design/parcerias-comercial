"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CollaboratorFormModal,
  ColaboradorItem,
} from "@/components/users/CollaboratorFormModal";
import { PERFIL_LABELS, SETOR_LABELS } from "@/lib/utils";
import { Plus, Pencil, Ban } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<ColaboradorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ColaboradorItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) setColaboradores(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDeactivate(colaborador: ColaboradorItem) {
    if (!confirm(`Desativar o acesso de ${colaborador.nome}?`)) return;
    const res = await fetch(`/api/users/${colaborador.id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Colaboradores</h1>
          <p className="text-sm text-slate-500">Equipe com acesso ao sistema e seus perfis.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Novo colaborador
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          Carregando...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Setor</th>
                <th className="px-4 py-3">Perfil</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {colaboradores.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.cargo ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.setor ? SETOR_LABELS[c.setor] : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{PERFIL_LABELS[c.perfil]}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        c.status === "ATIVO"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }
                    >
                      {c.status === "ATIVO" ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditing(c);
                          setModalOpen(true);
                        }}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {c.status === "ATIVO" && (
                        <button
                          onClick={() => handleDeactivate(c)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Desativar"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CollaboratorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        colaborador={editing}
      />
    </div>
  );
}
