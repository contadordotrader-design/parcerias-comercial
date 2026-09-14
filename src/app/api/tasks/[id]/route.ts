import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { taskInputSchema } from "@/lib/validation/task";
import { STATUS_LABELS } from "@/lib/utils";
import { Recorrencia } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function proximaData(base: Date, recorrencia: Recorrencia): Date {
  const proxima = new Date(base);
  switch (recorrencia) {
    case "DIARIA":
      proxima.setDate(proxima.getDate() + 1);
      break;
    case "SEMANAL":
      proxima.setDate(proxima.getDate() + 7);
      break;
    case "QUINZENAL":
      proxima.setDate(proxima.getDate() + 14);
      break;
    case "MENSAL":
      proxima.setMonth(proxima.getMonth() + 1);
      break;
  }
  return proxima;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      responsavel: { select: { id: true, nome: true } },
      criador: { select: { id: true, nome: true } },
      categoria: true,
      parceiro: { select: { id: true, nome: true } },
      subtarefas: { orderBy: { ordem: "asc" } },
      checklist: { orderBy: { ordem: "asc" } },
      comentarios: {
        orderBy: { createdAt: "desc" },
        include: { autor: { select: { nome: true } } },
      },
      historico: {
        orderBy: { createdAt: "desc" },
        include: { autor: { select: { nome: true } } },
      },
      anexos: true,
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const parsed = taskInputSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
  }

  const data = parsed.data;
  const historyEntries: {
    taskId: string;
    autorId: string;
    acao: string;
    campo?: string;
    valorAntigo?: string;
    valorNovo?: string;
  }[] = [];

  if (data.status && data.status !== existing.status) {
    historyEntries.push({
      taskId: id,
      autorId: user!.id,
      acao: `alterou o status de "${STATUS_LABELS[existing.status]}" para "${STATUS_LABELS[data.status]}"`,
      campo: "status",
      valorAntigo: existing.status,
      valorNovo: data.status,
    });
  }

  if (data.responsavelId !== undefined && data.responsavelId !== existing.responsavelId) {
    historyEntries.push({
      taskId: id,
      autorId: user!.id,
      acao: "alterou o responsável da tarefa",
      campo: "responsavelId",
      valorAntigo: existing.responsavelId ?? undefined,
      valorNovo: data.responsavelId ?? undefined,
    });
  }

  if (data.prazo !== undefined) {
    const novoPrazo = data.prazo ? new Date(data.prazo).toISOString() : undefined;
    const prazoAntigo = existing.prazo?.toISOString();
    if (novoPrazo !== prazoAntigo) {
      historyEntries.push({
        taskId: id,
        autorId: user!.id,
        acao: "alterou o prazo da tarefa",
        campo: "prazo",
        valorAntigo: prazoAntigo,
        valorNovo: novoPrazo,
      });
    }
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(data.titulo !== undefined && { titulo: data.titulo }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
      ...(data.setor !== undefined && { setor: data.setor }),
      ...(data.categoriaId !== undefined && { categoriaId: data.categoriaId }),
      ...(data.responsavelId !== undefined && { responsavelId: data.responsavelId }),
      ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.dataInicio !== undefined && {
        dataInicio: data.dataInicio ? new Date(data.dataInicio) : null,
      }),
      ...(data.prazo !== undefined && {
        prazo: data.prazo ? new Date(data.prazo) : null,
      }),
      ...(data.parceiroId !== undefined && { parceiroId: data.parceiroId }),
      ...(data.clienteNome !== undefined && { clienteNome: data.clienteNome }),
      ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
      ...(data.proximaAcao !== undefined && { proximaAcao: data.proximaAcao }),
      ...(data.recorrencia !== undefined && { recorrencia: data.recorrencia }),
      ...(data.recorrenciaAte !== undefined && {
        recorrenciaAte: data.recorrenciaAte ? new Date(data.recorrenciaAte) : null,
      }),
      ...(data.status === "CONCLUIDO" &&
        existing.status !== "CONCLUIDO" && { dataConclusao: new Date() }),
    },
  });

  if (historyEntries.length > 0) {
    await prisma.taskHistory.createMany({ data: historyEntries });
  }

  // Tarefa recorrente: ao concluir, gera automaticamente a próxima ocorrência
  // com o prazo avançado conforme a recorrência configurada.
  let proximaOcorrencia = null;
  if (
    data.status === "CONCLUIDO" &&
    existing.status !== "CONCLUIDO" &&
    existing.recorrencia !== "NENHUMA"
  ) {
    const baseData = existing.prazo ?? new Date();
    const novoPrazo = proximaData(baseData, existing.recorrencia);
    const dentroDoLimite = !existing.recorrenciaAte || novoPrazo <= existing.recorrenciaAte;

    if (dentroDoLimite) {
      proximaOcorrencia = await prisma.task.create({
        data: {
          titulo: existing.titulo,
          descricao: existing.descricao,
          setor: existing.setor,
          categoriaId: existing.categoriaId,
          responsavelId: existing.responsavelId,
          criadorId: existing.criadorId,
          prioridade: existing.prioridade,
          status: "PENDENTE",
          prazo: novoPrazo,
          parceiroId: existing.parceiroId,
          clienteNome: existing.clienteNome,
          observacoes: existing.observacoes,
          proximaAcao: existing.proximaAcao,
          recorrencia: existing.recorrencia,
          recorrenciaAte: existing.recorrenciaAte,
        },
      });

      await prisma.taskHistory.create({
        data: {
          taskId: proximaOcorrencia.id,
          autorId: user!.id,
          acao: `criada automaticamente como recorrência de "${existing.titulo}"`,
        },
      });
    }
  }

  return NextResponse.json({ ...task, proximaOcorrenciaId: proximaOcorrencia?.id });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

