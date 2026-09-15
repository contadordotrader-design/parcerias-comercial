import { z } from "zod";

export const actionInputSchema = z.object({
  parceiroId: z.string().min(1, "Selecione um parceiro."),
  nome: z.string().min(1, "Informe o nome da ação."),
  tipo: z
    .enum(["LIVE", "PODCAST", "MASTERCLASS", "EVENTO", "CAMPANHA", "CONTEUDO", "DIVULGACAO", "MATERIAL_CONJUNTO", "OUTRO"])
    .default("OUTRO"),
  data: z.string().optional().nullable(),
  status: z.enum(["PLANEJADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]).default("PLANEJADA"),
  descricao: z.string().optional().nullable(),
  resultado: z.string().optional().nullable(),
  proximoPasso: z.string().optional().nullable(),
});

export const materialInputSchema = z.object({
  parceiroId: z.string().min(1, "Selecione um parceiro."),
  nome: z.string().min(1, "Informe o nome do material."),
  tipo: z.string().optional().nullable(),
  status: z
    .enum(["SOLICITADO", "EM_CRIACAO", "REVISAO", "AGUARDANDO_PARCEIRO", "FINALIZADO"])
    .default("SOLICITADO"),
  prazo: z.string().optional().nullable(),
  observacao: z.string().optional().nullable(),
});

export const commissionInputSchema = z.object({
  parceiroId: z.string().min(1, "Selecione um parceiro."),
  clienteNome: z.string().min(1, "Informe o nome do cliente."),
  servico: z.string().min(1, "Informe o serviço."),
  valorVenda: z.coerce.number().positive("Informe um valor de venda válido."),
  percentual: z.coerce.number().optional().nullable(),
  valorComissao: z.coerce.number().positive("Informe o valor da comissão."),
  data: z.string().min(1, "Informe a data."),
  status: z
    .enum(["AGUARDANDO_PAGAMENTO_CLIENTE", "AGUARDANDO_CALCULO", "AGUARDANDO_PAGAMENTO", "PAGO"])
    .default("AGUARDANDO_CALCULO"),
});