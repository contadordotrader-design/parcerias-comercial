"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export function ActionFormModal({
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
  const [tipo, setTipo] = useState("OUTRO");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("PLANEJADA");
  const [descricao, setDescricao] = useState("");
  const [resultado, setResultado] = useState("");
  const [proximoPasso, setProximoPasso] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setNome("");
    setTipo("OUTRO");
    setData("");
    setStatus("PLANEJADA");
    setDescricao("");
    setResultado("");
    setProximoPasso("");
    setErro(null);
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const res = await fetch("/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parceiroId,
        nome,
        tipo,
        data: data || null,
        status,
        descricao: descricao || null,
        resultado: resultado || null,
        proximoPasso: proximoPasso || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar a ação.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova ação em conjunto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome da ação">
          <Input
            required
            placeholder="Ex.: Live com o parceiro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo">
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="LIVE">Live</option>
              <option value="PODCAST">Podcast</option>
              <option value="MASTERCLASS">Masterclass</option>
              <option value="EVENTO">Evento</option>
              <option value="CAMPANHA">Campanha</option>
              <option value="CONTEUDO">Conteúdo</option>
              <option value="DIVULGACAO">Divulgação</option>
              <option value="MATERIAL_CONJUNTO">Material conjunto</option>
              <option value="OUTRO">Outro</option>
            </Select>
          </Field>
          <Field label="Data">
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </Field>
        </div>

        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PLANEJADA">Planejada</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </Select>
        </Field>

        <Field label="Descrição">
          <Textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </Field>

        <Field label="Resultado">
          <Input value={resultado} onChange={(e) => setResultado(e.target.value)} />
        </Field>

        <Field label="Próximo passo">
          <Input value={proximoPasso} onChange={(e) => setProximoPasso(e.target.value)} />
        </Field>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Salvar ação
          </Button>
        </div>
      </form>
    </Modal>
  );
}