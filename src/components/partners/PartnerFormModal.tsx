"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export type PartnerFormValues = {
  nome: string;
  empresa: string | null;
  tipo: string;
  segmento: string;
  status: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  id: string;
};

export function PartnerFormModal({
  open,
  onClose,
  onSaved,
  partner,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  partner?: PartnerFormValues | null;
}) {
  const isEdit = !!partner;

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [tipo, setTipo] = useState("OUTRO");
  const [segmento, setSegmento] = useState("OUTRO");
  const [status, setStatus] = useState("PROSPECT");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (partner) {
      setNome(partner.nome);
      setEmpresa(partner.empresa ?? "");
      setTipo(partner.tipo);
      setSegmento(partner.segmento);
      setStatus(partner.status);
      setTelefone(partner.telefone ?? "");
      setWhatsapp(partner.whatsapp ?? "");
      setEmail(partner.email ?? "");
      setInstagram(partner.instagram ?? "");
      setObservacoes("");
    } else {
      setNome("");
      setEmpresa("");
      setTipo("OUTRO");
      setSegmento("OUTRO");
      setStatus("PROSPECT");
      setTelefone("");
      setWhatsapp("");
      setEmail("");
      setInstagram("");
      setObservacoes("");
    }
    setErro(null);
  }, [open, partner]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const payload = {
      nome,
      empresa: empresa || null,
      tipo,
      segmento,
      status,
      telefone: telefone || null,
      whatsapp: whatsapp || null,
      email: email || null,
      instagram: instagram || null,
      observacoes: observacoes || null,
    };

    const res = isEdit
      ? await fetch(`/api/partners/${partner!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/partners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar o parceiro.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar parceiro" : "Novo parceiro"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nome">
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
          <Field label="Empresa">
            <Input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Tipo">
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="INFLUENCIADOR">Influenciador</option>
              <option value="CONTADOR">Contador</option>
              <option value="CONSULTOR">Consultor</option>
              <option value="ASSESSOR">Assessor</option>
              <option value="EDUCADOR">Educador</option>
              <option value="OUTRO">Outro</option>
            </Select>
          </Field>
          <Field label="Segmento">
            <Select value={segmento} onChange={(e) => setSegmento(e.target.value)}>
              <option value="B3">B3</option>
              <option value="CRIPTO">Cripto</option>
              <option value="INTERNACIONAL">Internacional</option>
              <option value="FOREX">Forex</option>
              <option value="MESA_PROPRIETARIA">Mesa Proprietária</option>
              <option value="EMPRESARIAL">Empresarial</option>
              <option value="OUTRO">Outro</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PROSPECT">Prospect</option>
              <option value="EM_CONTATO">Em contato</option>
              <option value="NEGOCIACAO">Negociação</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Telefone">
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="E-mail">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Instagram">
            <Input
              placeholder="@usuario"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Observações">
          <Textarea rows={2} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        </Field>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Salvar alterações" : "Cadastrar parceiro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
