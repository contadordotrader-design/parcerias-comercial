"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export type ColaboradorItem = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  cargo: string | null;
  setor: string | null;
  perfil: string;
  status: string;
};

export function CollaboratorFormModal({
  open,
  onClose,
  onSaved,
  colaborador,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  colaborador?: ColaboradorItem | null;
}) {
  const isEdit = !!colaborador;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [perfil, setPerfil] = useState("COLABORADOR");
  const [status, setStatus] = useState("ATIVO");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (colaborador) {
      setNome(colaborador.nome);
      setEmail(colaborador.email);
      setSenha("");
      setTelefone(colaborador.telefone ?? "");
      setCargo(colaborador.cargo ?? "");
      setSetor(colaborador.setor ?? "");
      setPerfil(colaborador.perfil);
      setStatus(colaborador.status);
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setTelefone("");
      setCargo("");
      setSetor("");
      setPerfil("COLABORADOR");
      setStatus("ATIVO");
    }
    setErro(null);
  }, [open, colaborador]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const res = isEdit
      ? await fetch(`/api/users/${colaborador!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            telefone: telefone || null,
            cargo: cargo || null,
            setor: setor || null,
            perfil,
            status,
          }),
        })
      : await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            email,
            senha,
            telefone: telefone || null,
            cargo: cargo || null,
            setor: setor || null,
            perfil,
          }),
        });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar. Verifique os campos e tente novamente.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Editar colaborador" : "Novo colaborador"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome">
          <Input required value={nome} onChange={(e) => setNome(e.target.value)} />
        </Field>
        <Field label="E-mail">
          <Input
            type="email"
            required
            disabled={isEdit}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        {!isEdit && (
          <Field label="Senha inicial">
            <Input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cargo">
            <Input value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </Field>
          <Field label="Telefone">
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Setor">
            <Select value={setor} onChange={(e) => setSetor(e.target.value)}>
              <option value="">Sem setor definido</option>
              <option value="COMERCIAL">Comercial</option>
              <option value="PARCERIAS">Parcerias</option>
              <option value="DEMANDAS_RECEBIDAS">Demandas Recebidas</option>
              <option value="GERAL">Geral</option>
            </Select>
          </Field>
          <Field label="Perfil de acesso">
            <Select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="COLABORADOR">Colaborador</option>
              <option value="GESTOR">Gestor</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </Select>
          </Field>
        </div>
        {isEdit && (
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </Select>
          </Field>
        )}

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
