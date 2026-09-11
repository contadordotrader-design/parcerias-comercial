"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { CollaboratorOption, PartnerOption, TaskListItem } from "@/components/tasks/types";
import { FormEvent, useEffect, useState } from "react";

type Setor = TaskListItem["setor"];

export function TaskFormModal({
  open,
  onClose,
  onSaved,
  task,
  colaboradores,
  parceiros,
  defaultSetor,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  task?: TaskListItem | null;
  colaboradores: CollaboratorOption[];
  parceiros: PartnerOption[];
  defaultSetor?: Setor;
}) {
  const isEdit = !!task;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [setor, setSetor] = useState<Setor>(defaultSetor ?? "GERAL");
  const [responsavelId, setResponsavelId] = useState("");
  const [prioridade, setPrioridade] = useState<TaskListItem["prioridade"]>("MEDIA");
  const [status, setStatus] = useState<TaskListItem["status"]>("PENDENTE");
  const [prazo, setPrazo] = useState("");
  const [parceiroId, setParceiroId] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [proximaAcao, setProximaAcao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitulo(task.titulo);
      setDescricao(task.descricao ?? "");
      setSetor(task.setor);
      setResponsavelId(task.responsavelId ?? "");
      setPrioridade(task.prioridade);
      setStatus(task.status);
      setPrazo(task.prazo ? task.prazo.slice(0, 10) : "");
      setParceiroId(task.parceiroId ?? "");
      setClienteNome(task.clienteNome ?? "");
      setProximaAcao(task.proximaAcao ?? "");
      setObservacoes(task.observacoes ?? "");
    } else {
      setTitulo("");
      setDescricao("");
      setSetor(defaultSetor ?? "GERAL");
      setResponsavelId("");
      setPrioridade("MEDIA");
      setStatus("PENDENTE");
      setPrazo("");
      setParceiroId("");
      setClienteNome("");
      setProximaAcao("");
      setObservacoes("");
    }
    setErro(null);
  }, [open, task, defaultSetor]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const payload = {
      titulo,
      descricao: descricao || null,
      setor,
      responsavelId: responsavelId || null,
      prioridade,
      status,
      prazo: prazo || null,
      parceiroId: parceiroId || null,
      clienteNome: clienteNome || null,
      proximaAcao: proximaAcao || null,
      observacoes: observacoes || null,
    };

    const res = await fetch(isEdit ? `/api/tasks/${task!.id}` : "/api/tasks", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar a tarefa. Verifique os campos.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar tarefa" : "Nova tarefa"} width="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Título">
          <Input required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </Field>

        <Field label="Descrição">
          <Textarea rows={2} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Área">
            <Select value={setor} onChange={(e) => setSetor(e.target.value as Setor)}>
              <option value="COMERCIAL">Comercial</option>
              <option value="PARCERIAS">Parcerias</option>
              <option value="DEMANDAS_RECEBIDAS">Demandas Recebidas</option>
              <option value="GERAL">Geral</option>
            </Select>
          </Field>
          <Field label="Responsável">
            <Select value={responsavelId} onChange={(e) => setResponsavelId(e.target.value)}>
              <option value="">Sem responsável</option>
              {colaboradores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Prioridade">
            <Select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as TaskListItem["prioridade"])}
            >
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as TaskListItem["status"])}>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="AGUARDANDO_TERCEIRO">Aguardando terceiro</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </Select>
          </Field>
          <Field label="Prazo">
            <Input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Parceiro relacionado">
            <Select value={parceiroId} onChange={(e) => setParceiroId(e.target.value)}>
              <option value="">Nenhum</option>
              {parceiros.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cliente relacionado">
            <Input value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} />
          </Field>
        </div>

        <Field label="Próxima ação">
          <Input
            placeholder="Ex.: Cobrar retorno do parceiro na sexta-feira"
            value={proximaAcao}
            onChange={(e) => setProximaAcao(e.target.value)}
          />
        </Field>

        <Field label="Observações">
          <Textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </Field>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
