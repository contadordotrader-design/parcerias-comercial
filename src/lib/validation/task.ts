import { z } from "zod";

export const taskInputSchema = z.object({
  titulo: z.string().min(1, "Informe um título."),
  descricao: z.string().optional().nullable(),
  setor: z.enum(["COMERCIAL", "PARCERIAS", "DEMANDAS_RECEBIDAS", "GERAL"]),
  categoriaId: z.string().min(1).optional().nullable(),
  responsavelId: z.string().uuid().optional().nullable(),
  prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).default("MEDIA"),
  status: z
    .enum(["PENDENTE", "EM_ANDAMENTO", "AGUARDANDO_TERCEIRO", "CONCLUIDO", "CANCELADO"])
    .default("PENDENTE"),
  dataInicio: z.string().optional().nullable(),
  prazo: z.string().optional().nullable(),
  parceiroId: z.string().uuid().optional().nullable(),
  clienteNome: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  proximaAcao: z.string().optional().nullable(),
  recorrencia: z.enum(["NENHUMA", "DIARIA", "SEMANAL", "QUINZENAL", "MENSAL"]).default("NENHUMA"),
  recorrenciaAte: z.string().optional().nullable(),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

