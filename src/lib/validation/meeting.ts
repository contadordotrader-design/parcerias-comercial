import { z } from "zod";

export const meetingInputSchema = z.object({
  parceiroId: z.string().uuid("Selecione um parceiro."),
  data: z.string().min(1, "Informe a data da reunião."),
  participantes: z.string().optional().nullable(),
  objetivo: z.string().optional().nullable(),
  resumo: z.string().optional().nullable(),
  decisoes: z.string().optional().nullable(),
  pendencias: z.string().optional().nullable(),
  proximosPassos: z.string().optional().nullable(),
});

export type MeetingInput = z.infer<typeof meetingInputSchema>;

