"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export function MaterialFormModal({
  open,
  onClose,
  onSaved,
  parceiroId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  parceiroId: string;
}) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("SOLICITADO");
  const [prazo, setPrazo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNome("");
    setTipo("");
    setStatus("SOLICITADO");
    setPrazo("");
    setObservacao("");
    setErro(null);
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parceiroId,
        nome,
        tipo: tipo || null,
        status,
        prazo: prazo || null,
        observacao: observacao || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar o material.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo material">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome do material">
          <Input
            required
            placeholder="Ex.: Folder do parceiro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo (opcional)">
            <Input
              placeholder="Ex.: Vídeo, folder, post"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </Field>
          <Field label="Prazo">
            <Input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
          </Field>
        </div>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="SOLICITADO">Solicitado</option>
            <option value="EM_CRIACAO">Em criação</option>
            <option value="REVISAO">Revisão</option>
            <option value="AGUARDANDO_PARCEIRO">Aguardando parceiro</option>
            <option value="FINALIZADO">Finalizado</option>
          </Select>
        </Field>

        <Field label="Observação">
          <Textarea rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        </Field>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Salvar material
          </Button>
        </div>
      </form>
    </Modal>
  );
}