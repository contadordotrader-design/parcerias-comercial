import { prisma } from "@/lib/prisma";
import { PrioridadeTarefa, Setor, StatusTarefa } from "@prisma/client";

const OPEN_STATUSES: StatusTarefa[] = [
  StatusTarefa.PENDENTE,
  StatusTarefa.EM_ANDAMENTO,
  StatusTarefa.AGUARDANDO_TERCEIRO,
];

export async function getDashboardData() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [
    totalAbertas,
    emAndamento,
    concluidas,
    atrasadas,
    aguardandoTerceiro,
    altaPrioridade,
    comercialAbertas,
    parceriasAbertas,
    porStatus,
    porArea,
    porPrioridade,
    proximosVencimentos,
    tarefasAtrasadas,
    atividadesRecentes,
    colaboradores,
  ] = await Promise.all([
    prisma.task.count({ where: { status: { in: OPEN_STATUSES } } }),
    prisma.task.count({ where: { status: StatusTarefa.EM_ANDAMENTO } }),
    prisma.task.count({ where: { status: StatusTarefa.CONCLUIDO } }),
    prisma.task.count({
      where: { status: { in: OPEN_STATUSES }, prazo: { lt: hoje } },
    }),
    prisma.task.count({
      where: { status: StatusTarefa.AGUARDANDO_TERCEIRO },
    }),
    prisma.task.count({
      where: { status: { in: OPEN_STATUSES }, prioridade: PrioridadeTarefa.ALTA },
    }),
    prisma.task.count({
      where: { status: { in: OPEN_STATUSES }, setor: Setor.COMERCIAL },
    }),
    prisma.task.count({
      where: { status: { in: OPEN_STATUSES }, setor: Setor.PARCERIAS },
    }),
    prisma.task.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.task.groupBy({ by: ["setor"], _count: { _all: true } }),
    prisma.task.groupBy({
      by: ["prioridade"],
      where: { status: { in: OPEN_STATUSES } },
      _count: { _all: true },
    }),
    prisma.task.findMany({
      where: { status: { in: OPEN_STATUSES }, prazo: { gte: hoje } },
      orderBy: { prazo: "asc" },
      take: 6,
      include: { responsavel: { select: { nome: true } } },
    }),
    prisma.task.findMany({
      where: { status: { in: OPEN_STATUSES }, prazo: { lt: hoje } },
      orderBy: { prazo: "asc" },
      take: 6,
      include: { responsavel: { select: { nome: true } } },
    }),
    prisma.taskHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { autor: { select: { nome: true } }, task: { select: { titulo: true } } },
    }),
    prisma.user.findMany({
      where: { status: "ATIVO" },
      select: {
        id: true,
        nome: true,
        _count: {
          select: { tarefasResponsavel: true },
        },
      },
      take: 8,
    }),
  ]);

  const porColaborador = await Promise.all(
    colaboradores.map(async (colaborador) => {
      const [abertas, concluidasCol, atrasadasCol] = await Promise.all([
        prisma.task.count({
          where: { responsavelId: colaborador.id, status: { in: OPEN_STATUSES } },
        }),
        prisma.task.count({
          where: { responsavelId: colaborador.id, status: StatusTarefa.CONCLUIDO },
        }),
        prisma.task.count({
          where: {
            responsavelId: colaborador.id,
            status: { in: OPEN_STATUSES },
            prazo: { lt: hoje },
          },
        }),
      ]);
      return {
        nome: colaborador.nome.split(" ")[0],
        abertas,
        concluidas: concluidasCol,
        atrasadas: atrasadasCol,
      };
    })
  );

  const concluidasPorMes = await prisma.$queryRaw<
    { mes: string; total: bigint }[]
  >`
    SELECT to_char(date_trunc('month', "dataConclusao"), 'YYYY-MM') AS mes,
           COUNT(*) AS total
    FROM "tasks"
    WHERE "dataConclusao" IS NOT NULL
      AND "dataConclusao" >= (CURRENT_DATE - INTERVAL '6 months')
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  return {
    cards: {
      totalAbertas,
      emAndamento,
      concluidas,
      atrasadas,
      aguardandoTerceiro,
      altaPrioridade,
      comercialAbertas,
      parceriasAbertas,
    },
    porStatus,
    porArea,
    porPrioridade,
    porColaborador,
    concluidasPorMes: concluidasPorMes.map((r) => ({
      mes: r.mes,
      total: Number(r.total),
    })),
    proximosVencimentos,
    tarefasAtrasadas,
    atividadesRecentes,
  };
}

export type DashboardData = ReturnType<typeof getDashboardData> extends Promise<infer T>
  ? T
  : never;
