"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export function MeetingFormModal({
  open,
  onClose,
  onSaved,
  parceiroId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (tarefasCriadas: number) => void;
  parceiroId: string;
}) {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [participantes, setParticipantes] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [resumo, setResumo] = useState("");
  const [decisoes, setDecisoes] = useState("");
  const [pendencias, setPendencias] = useState("");
  const [proximosPassos, setProximosPassos] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setData("");
    setHora("");
    setParticipantes("");
    setObjetivo("");
    setResumo("");
    setDecisoes("");
    setPendencias("");
    setProximosPassos("");
    setErro(null);
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const dataHora = hora ? `${data}T${hora}` : data;

    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parceiroId,
        data: dataHora,
        participantes: participantes || null,
        objetivo: objetivo || null,
        resumo: resumo || null,
        decisoes: decisoes || null,
        pendencias: pendencias || null,
        proximosPassos: proximosPassos || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar a reunião. Verifique os campos.");
      return;
    }

    const criada = await res.json();
    onSaved(criada.tarefasCriadas ?? 0);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova reunião" width="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
          </Field>
          <Field label="Horário">
            <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </Field>
        </div>

        <Field label="Participantes">
          <Input
            placeholder="Ex.: Luis, Kerolen, parceiro"
            value={participantes}
            onChange={(e) => setParticipantes(e.target.value)}
          />
        </Field>

        <Field label="Objetivo">
          <Input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
        </Field>

        <Field label="Resumo">
          <Textarea rows={2} value={resumo} onChange={(e) => setResumo(e.target.value)} />
        </Field>

        <Field label="Decisões">
          <Textarea rows={2} value={decisoes} onChange={(e) => setDecisoes(e.target.value)} />
        </Field>

        <Field label="Pendências">
          <Textarea rows={2} value={pendencias} onChange={(e) => setPendencias(e.target.value)} />
        </Field>

        <Field label="Próximos passos">
          <Textarea
            rows={3}
            placeholder={"Uma ação por linha — cada linha vira uma tarefa automaticamente.\nEx.: Enviar proposta\nConfirmar data da live"}
            value={proximosPassos}
            onChange={(e) => setProximosPassos(e.target.value)}
          />
        </Field>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Salvar reunião
          </Button>
        </div>
      </form>
    </Modal>
  );
}

