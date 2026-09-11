"use client";

import { PriorityBadge } from "@/components/tasks/Badges";
import { Modal } from "@/components/ui/Modal";
import { SETOR_LABELS } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type CalendarTask = {
  id: string;
  titulo: string;
  prazo: string;
  status: string;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
  setor: string;
  responsavel: { nome: string } | null;
  parceiro: { nome: string } | null;
};

type CalendarMeeting = {
  id: string;
  data: string;
  objetivo: string | null;
  parceiro: { id: string; nome: string };
};

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export default function CalendarioPage() {
  const [mesAtual, setMesAtual] = useState(() => new Date());
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [meetings, setMeetings] = useState<CalendarMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

  const inicioGrade = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 });
  const fimGrade = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 });
  const dias = eachDayOfInterval({ start: inicioGrade, end: fimGrade });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      inicio: inicioGrade.toISOString(),
      fim: fimGrade.toISOString(),
    });
    const res = await fetch(`/api/calendar?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
      setMeetings(data.meetings);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesAtual]);

  useEffect(() => {
    load();
  }, [load]);

  function tasksDoDia(dia: Date) {
    return tasks.filter((t) => t.prazo && isSameDay(new Date(t.prazo), dia));
  }

  function meetingsDoDia(dia: Date) {
    return meetings.filter((m) => isSameDay(new Date(m.data), dia));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Calendário</h1>
          <p className="text-sm text-slate-500">
            Prazos de tarefas e reuniões de parcerias, tudo em um só lugar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMesAtual((m) => subMonths(m, 1))}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMesAtual(new Date())}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Hoje
          </button>
          <button
            onClick={() => setMesAtual((m) => addMonths(m, 1))}
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="ml-2 text-sm font-medium capitalize text-slate-700">
            {format(mesAtual, "MMMM yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-medium uppercase text-slate-500">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {dias.map((dia) => {
            const doMes = isSameMonth(dia, mesAtual);
            const hoje = isToday(dia);
            const tarefasDia = tasksDoDia(dia);
            const reunioesDia = meetingsDoDia(dia);
            const itens = [...reunioesDia, ...tarefasDia];
            const visiveis = itens.slice(0, 3);
            const restantes = itens.length - visiveis.length;

            return (
              <button
                key={dia.toISOString()}
                onClick={() => setDiaSelecionado(dia)}
                className={`min-h-[100px] border-b border-r border-slate-100 p-1.5 text-left align-top transition-colors hover:bg-slate-50 ${
                  doMes ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    hoje
                      ? "bg-slate-900 text-white"
                      : doMes
                      ? "text-slate-700"
                      : "text-slate-300"
                  }`}
                >
                  {format(dia, "d")}
                </span>

                <div className="mt-1 space-y-1">
                  {reunioesDia.slice(0, visiveis.length).map((m) => (
                    <div
                      key={`m-${m.id}`}
                      className="flex items-center gap-1 truncate rounded bg-purple-50 px-1 py-0.5 text-[11px] text-purple-700"
                    >
                      <Users className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{m.parceiro.nome}</span>
                    </div>
                  ))}
                  {tarefasDia
                    .slice(0, Math.max(0, visiveis.length - reunioesDia.length))
                    .map((t) => (
                      <div
                        key={`t-${t.id}`}
                        className="truncate rounded bg-blue-50 px-1 py-0.5 text-[11px] text-blue-700"
                      >
                        {t.titulo}
                      </div>
                    ))}
                  {restantes > 0 && (
                    <p className="px-1 text-[11px] text-slate-400">+{restantes} mais</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <p className="text-center text-xs text-slate-400">Atualizando calendário...</p>
      )}

      <Modal
        open={!!diaSelecionado}
        onClose={() => setDiaSelecionado(null)}
        title={diaSelecionado ? format(diaSelecionado, "dd 'de' MMMM", { locale: ptBR }) : ""}
      >
        {diaSelecionado && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase text-slate-400">Reuniões</h4>
              {meetingsDoDia(diaSelecionado).length === 0 ? (
                <p className="text-sm text-slate-400">Nenhuma reunião neste dia.</p>
              ) : (
                <ul className="space-y-2">
                  {meetingsDoDia(diaSelecionado).map((m) => (
                    <li key={m.id} className="rounded-lg bg-purple-50 px-3 py-2 text-sm">
                      <p className="font-medium text-purple-800">{m.parceiro.nome}</p>
                      <p className="text-xs text-purple-600">
                        {format(new Date(m.data), "HH:mm")} {m.objetivo && `· ${m.objetivo}`}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="mb-1.5 text-xs font-semibold uppercase text-slate-400">Tarefas</h4>
              {tasksDoDia(diaSelecionado).length === 0 ? (
                <p className="text-sm text-slate-400">Nenhuma tarefa com prazo neste dia.</p>
              ) : (
                <ul className="space-y-2">
                  {tasksDoDia(diaSelecionado).map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium text-blue-900">{t.titulo}</p>
                        <p className="text-xs text-blue-600">
                          {SETOR_LABELS[t.setor]} · {t.responsavel?.nome ?? "Sem responsável"}
                        </p>
                      </div>
                      <PriorityBadge priority={t.prioridade} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

