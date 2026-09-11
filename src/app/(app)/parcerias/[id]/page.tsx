"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/tasks/Badges";
import { PartnerFormModal } from "@/components/partners/PartnerFormModal";
import { MeetingFormModal } from "@/components/meetings/MeetingFormModal";
import {
  SEGMENTO_LABELS,
  STATUS_PARCEIRO_LABELS,
  STATUS_PARCEIRO_STYLES,
  TIPO_PARCEIRO_LABELS,
} from "@/components/partners/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type PartnerDetail = {
  id: string;
  nome: string;
  empresa: string | null;
  tipo: string;
  segmento: string;
  status: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  site: string | null;
  observacoes: string | null;
  proximaAcao: string | null;
  responsavel: { nome: string } | null;
  tarefas: {
    id: string;
    titulo: string;
    status: string;
    prioridade: string;
    prazo: string | null;
    responsavel: { nome: string } | null;
  }[];
  acoes: {
    id: string;
    nome: string;
    tipo: string;
    status: string;
    data: string | null;
    resultado: string | null;
  }[];
  reunioes: {
    id: string;
    data: string;
    objetivo: string | null;
    resumo: string | null;
    pendencias: string | null;
  }[];
  materiais: { id: string; nome: string; status: string; prazo: string | null }[];
  comissoes: {
    id: string;
    clienteNome: string;
    valorComissao: string;
    status: string;
    data: string;
  }[];
};

export default function ParceiroDetailPage() {
  const params = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/partners/${params.id}`);
    if (res.ok) setPartner(await res.json());
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-400">Carregando ficha...</div>;
  }

  if (!partner) {
    return <div className="py-16 text-center text-sm text-slate-400">Parceiro não encontrado.</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/parcerias"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Parcerias
        </Link>
        <Button variant="secondary" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{partner.nome}</h1>
            {partner.empresa && <p className="text-sm text-slate-500">{partner.empresa}</p>}
          </div>
          <Badge className={STATUS_PARCEIRO_STYLES[partner.status]}>
            {STATUS_PARCEIRO_LABELS[partner.status]}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Info label="Tipo" value={TIPO_PARCEIRO_LABELS[partner.tipo]} />
          <Info label="Segmento" value={SEGMENTO_LABELS[partner.segmento]} />
          <Info label="Responsável interno" value={partner.responsavel?.nome ?? "—"} />
          <Info label="WhatsApp" value={partner.whatsapp ?? partner.telefone ?? "—"} />
        </div>

        {partner.proximaAcao && (
          <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <span className="font-medium">Próxima ação:</span> {partner.proximaAcao}
          </div>
        )}
      </div>

      <Section title={`Tarefas abertas e concluídas (${partner.tarefas.length})`}>
        {partner.tarefas.length === 0 ? (
          <EmptyRow text="Nenhuma tarefa vinculada a este parceiro ainda." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {partner.tarefas.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{t.titulo}</p>
                  <p className="text-xs text-slate-500">{t.responsavel?.nome ?? "Sem responsável"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={t.prioridade} />
                  <StatusBadge status={t.status} />
                  <span className="w-20 text-right text-xs text-slate-500">{formatDate(t.prazo)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Ações em conjunto">
          {partner.acoes.length === 0 ? (
            <EmptyRow text="Nenhuma ação registrada." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {partner.acoes.map((a) => (
                <li key={a.id} className="py-2.5 text-sm">
                  <p className="font-medium text-slate-800">{a.nome}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.data)} {a.resultado && `· ${a.resultado}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Reuniões"
          action={
            <button
              onClick={() => setMeetingOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Nova reunião
            </button>
          }
        >
          {partner.reunioes.length === 0 ? (
            <EmptyRow text="Nenhuma reunião registrada." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {partner.reunioes.map((r) => (
                <li key={r.id} className="py-2.5 text-sm">
                  <p className="font-medium text-slate-800">{formatDate(r.data)}</p>
                  <p className="text-xs text-slate-500">{r.objetivo ?? r.resumo ?? "—"}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Materiais">
          {partner.materiais.length === 0 ? (
            <EmptyRow text="Nenhum material em produção." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {partner.materiais.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-800">{m.nome}</span>
                  <span className="text-xs text-slate-500">{formatDate(m.prazo)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Comissões">
          {partner.comissoes.length === 0 ? (
            <EmptyRow text="Nenhuma comissão registrada." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {partner.comissoes.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-800">{c.clienteNome}</span>
                  <span className="text-xs font-medium text-slate-600">
                    {formatCurrency(c.valorComissao)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <PartnerFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={load}
        partner={{
          id: partner.id,
          nome: partner.nome,
          empresa: partner.empresa,
          tipo: partner.tipo,
          segmento: partner.segmento,
          status: partner.status,
          telefone: partner.telefone,
          whatsapp: partner.whatsapp,
          email: partner.email,
          instagram: partner.instagram,
        }}
      />

      <MeetingFormModal
        open={meetingOpen}
        onClose={() => setMeetingOpen(false)}
        onSaved={(tarefasCriadas) => {
          load();
          if (tarefasCriadas > 0) {
            alert(`Reunião salva! ${tarefasCriadas} tarefa(s) criada(s) a partir dos próximos passos.`);
          }
        }}
        parceiroId={partner.id}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-slate-400">{text}</p>;
}

