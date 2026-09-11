"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";
import {
  PartnerListItem,
  SEGMENTO_LABELS,
  STATUS_PARCEIRO_LABELS,
  STATUS_PARCEIRO_STYLES,
  TIPO_PARCEIRO_LABELS,
} from "@/components/partners/types";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ParceriasPage() {
  const [partners, setPartners] = useState<PartnerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/partners");
    if (res.ok) setPartners(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Parcerias</h1>
          <p className="text-sm text-slate-500">
            Prospects e parceiros ativos — ações, materiais e reuniões em cada ficha.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo parceiro
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          Carregando...
        </div>
      ) : partners.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
          Nenhum parceiro cadastrado ainda.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((p) => (
            <Link
              key={p.id}
              href={`/parcerias/${p.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900">{p.nome}</p>
                  {p.empresa && <p className="text-xs text-slate-500">{p.empresa}</p>}
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge className={STATUS_PARCEIRO_STYLES[p.status]}>
                  {STATUS_PARCEIRO_LABELS[p.status]}
                </Badge>
                <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                  {TIPO_PARCEIRO_LABELS[p.tipo]}
                </Badge>
                <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                  {SEGMENTO_LABELS[p.segmento]}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{p.responsavel?.nome ?? "Sem responsável"}</span>
                <span>
                  {p._count.tarefas} tarefa(s) · {p._count.acoes} ação(ões)
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <PartnerFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={load} />
    </div>
  );
}
