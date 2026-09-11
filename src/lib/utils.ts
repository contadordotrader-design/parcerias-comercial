import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function isOverdue(prazo: Date | string | null | undefined, status: string): boolean {
  if (!prazo || status === "CONCLUIDO" || status === "CANCELADO") return false;
  const d = typeof prazo === "string" ? new Date(prazo) : prazo;
  return d.getTime() < new Date().setHours(0, 0, 0, 0);
}

export const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_TERCEIRO: "Aguardando terceiro",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

export const STATUS_STYLES: Record<string, string> = {
  PENDENTE: "bg-slate-100 text-slate-600 border-slate-200",
  EM_ANDAMENTO: "bg-blue-50 text-blue-700 border-blue-200",
  AGUARDANDO_TERCEIRO: "bg-amber-50 text-amber-700 border-amber-200",
  CONCLUIDO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELADO: "bg-red-50 text-red-700 border-red-200",
};

export const PRIORITY_LABELS: Record<string, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

export const PRIORITY_STYLES: Record<string, string> = {
  ALTA: "bg-red-50 text-red-700 border-red-200",
  MEDIA: "bg-amber-50 text-amber-700 border-amber-200",
  BAIXA: "bg-slate-100 text-slate-600 border-slate-200",
};

export const SETOR_LABELS: Record<string, string> = {
  COMERCIAL: "Comercial",
  PARCERIAS: "Parcerias",
  DEMANDAS_RECEBIDAS: "Demandas Recebidas",
  GERAL: "Geral",
};

export const PERFIL_LABELS: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  GESTOR: "Gestor",
  COLABORADOR: "Colaborador",
};
