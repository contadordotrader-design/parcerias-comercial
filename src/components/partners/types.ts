export type PartnerListItem = {
  id: string;
  nome: string;
  empresa: string | null;
  tipo: string;
  segmento: string;
  status: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  responsavel: { nome: string } | null;
  _count: { tarefas: number; acoes: number };
};

export const TIPO_PARCEIRO_LABELS: Record<string, string> = {
  INFLUENCIADOR: "Influenciador",
  CONTADOR: "Contador",
  CONSULTOR: "Consultor",
  ASSESSOR: "Assessor",
  EDUCADOR: "Educador",
  OUTRO: "Outro",
};

export const SEGMENTO_LABELS: Record<string, string> = {
  B3: "B3",
  CRIPTO: "Cripto",
  INTERNACIONAL: "Internacional",
  FOREX: "Forex",
  MESA_PROPRIETARIA: "Mesa Proprietária",
  EMPRESARIAL: "Empresarial",
  OUTRO: "Outro",
};

export const STATUS_PARCEIRO_LABELS: Record<string, string> = {
  PROSPECT: "Prospect",
  EM_CONTATO: "Em contato",
  NEGOCIACAO: "Negociação",
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const STATUS_PARCEIRO_STYLES: Record<string, string> = {
  PROSPECT: "bg-slate-100 text-slate-600 border-slate-200",
  EM_CONTATO: "bg-blue-50 text-blue-700 border-blue-200",
  NEGOCIACAO: "bg-amber-50 text-amber-700 border-amber-200",
  ATIVO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INATIVO: "bg-red-50 text-red-700 border-red-200",
};
