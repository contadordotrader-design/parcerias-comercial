"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { FormEvent, useEffect, useState } from "react";

export function CommissionFormModal({
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
  const [clienteNome, setClienteNome] = useState("");
  const [servico, setServico] = useState("");
  const [valorVenda, setValorVenda] = useState("");
  const [percentual, setPercentual] = useState("");
  const [valorComissao, setValorComissao] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("AGUARDANDO_CALCULO");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setClienteNome("");
    setServico("");
    setValorVenda("");
    setPercentual("");
    setValorComissao("");
    setData("");
    setStatus("AGUARDANDO_CALCULO");
    setErro(null);
  }, [open]);

  function calcularComissao(novoPercentual: string, novoValorVenda: string) {
    const percentualNum = parseFloat(novoPercentual);
    const valorVendaNum = parseFloat(novoValorVenda);
    if (!isNaN(percentualNum) && !isNaN(valorVendaNum)) {
      setValorComissao(((valorVendaNum * percentualNum) / 100).toFixed(2));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErro(null);

    const res = await fetch("/api/commissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parceiroId,
        clienteNome,
        servico,
        valorVenda,
        percentual: percentual || null,
        valorComissao,
        data,
        status,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      setErro("Não foi possível salvar a comissão. Verifique os valores informados.");
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova comissão">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Cliente">
            <Input required value={clienteNome} onChange={(e) => setClienteNome(e.target.value)} />
          </Field>
          <Field label="Serviço">
            <Input required value={servico} onChange={(e) => setServico(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Valor da venda (R$)">
            <Input
              type="number"
              step="0.01"
              required
              value={valorVenda}
              onChange={(e) => {
                setValorVenda(e.target.value);
                calcularComissao(percentual, e.target.value);
              }}
            />
          </Field>
          <Field label="% comissão (opcional)">
            <Input
              type="number"
              step="0.01"
              value={percentual}
              onChange={(e) => {
                setPercentual(e.target.value);
                calcularComissao(e.target.value, valorVenda);
              }}
            />
          </Field>
          <Field label="Valor da comissão (R$)">
            <Input
              type="number"
              step="0.01"
              required
              value={valorComissao}
              onChange={(e) => setValorComissao(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Data">
            <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="AGUARDANDO_PAGAMENTO_CLIENTE">Aguardando pagamento do cliente</option>
              <option value="AGUARDANDO_CALCULO">Aguardando cálculo</option>
              <option value="AGUARDANDO_PAGAMENTO">Aguardando pagamento</option>
              <option value="PAGO">Pago</option>
            </Select>
          </Field>
        </div>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Salvar comissão
          </Button>
        </div>
      </form>
    </Modal>
  );
}