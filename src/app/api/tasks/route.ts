import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { taskInputSchema } from "@/lib/validation/task";
import { Prisma, PrioridadeTarefa, Setor, StatusTarefa } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const setor = searchParams.get("setor");
  const status = searchParams.get("status");
  const prioridade = searchParams.get("prioridade");
  const responsavelId = searchParams.get("responsavelId");
  const categoriaId = searchParams.get("categoriaId");
  const mine = searchParams.get("mine");
  const search = searchParams.get("q");
  const prazoFiltro = searchParams.get("prazo"); // hoje | semana | atrasadas

  const where: Prisma.TaskWhereInput = {};

  if (setor) where.setor = setor as Setor;
  if (status) where.status = status as StatusTarefa;
  if (prioridade) where.prioridade = prioridade as PrioridadeTarefa;
  if (responsavelId) where.responsavelId = responsavelId;
  if (categoriaId) where.categoriaId = categoriaId;
  if (mine === "1") where.responsavelId = user!.id;
  if (search) {
    where.titulo = { contains: search, mode: "insensitive" };
  }

  if (prazoFiltro) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date(hoje);
    fimHoje.setHours(23, 59, 59, 999);

    if (prazoFiltro === "hoje") {
      where.prazo = { gte: hoje, lte: fimHoje };
    } else if (prazoFiltro === "semana") {
      const fimSemana = new Date(hoje);
      fimSemana.setDate(fimSemana.getDate() + 7);
      where.prazo = { gte: hoje, lte: fimSemana };
    } else if (prazoFiltro === "atrasadas") {
      where.prazo = { lt: hoje };
      where.status = { notIn: [StatusTarefa.CONCLUIDO, StatusTarefa.CANCELADO] };
    }
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ prazo: "asc" }, { createdAt: "desc" }],
    include: {
      responsavel: { select: { id: true, nome: true } },
      criador: { select: { id: true, nome: true } },
      categoria: { select: { id: true, nome: true } },
      parceiro: { select: { id: true, nome: true } },
      subtarefas: { select: { id: true, concluida: true } },
    },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = taskInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const task = await prisma.task.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      setor: data.setor,
      categoriaId: data.categoriaId,
      responsavelId: data.responsavelId,
      criadorId: user!.id,
      prioridade: data.prioridade,
      status: data.status,
      dataInicio: data.dataInicio ? new Date(data.dataInicio) : null,
      prazo: data.prazo ? new Date(data.prazo) : null,
      parceiroId: data.parceiroId,
      clienteNome: data.clienteNome,
      observacoes: data.observacoes,
      proximaAcao: data.proximaAcao,
    },
  });

  await prisma.taskHistory.create({
    data: {
      taskId: task.id,
      autorId: user!.id,
      acao: "criou a tarefa",
    },
  });

  return NextResponse.json(task, { status: 201 });
}
