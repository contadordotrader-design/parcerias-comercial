export type TaskListItem = {
  id: string;
  titulo: string;
  descricao: string | null;
  setor: "COMERCIAL" | "PARCERIAS" | "DEMANDAS_RECEBIDAS" | "GERAL";
  status: "PENDENTE" | "EM_ANDAMENTO" | "AGUARDANDO_TERCEIRO" | "CONCLUIDO" | "CANCELADO";
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
  prazo: string | null;
  dataInicio: string | null;
  dataConclusao: string | null;
  proximaAcao: string | null;
  clienteNome: string | null;
  observacoes: string | null;
  responsavelId: string | null;
  responsavel: { id: string; nome: string } | null;
  criador: { id: string; nome: string };
  categoria: { id: string; nome: string } | null;
  parceiro: { id: string; nome: string } | null;
  parceiroId: string | null;
  categoriaId: string | null;
  subtarefas: { id: string; concluida: boolean }[];
};

export type CollaboratorOption = {
  id: string;
  nome: string;
};

export type PartnerOption = {
  id: string;
  nome: string;
};
