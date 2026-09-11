import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { taskInputSchema } from "@/lib/validation/task";
import { STATUS_LABELS } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

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
      ...(data.status === "CONCLUIDO" &&
        existing.status !== "CONCLUIDO" && { dataConclusao: new Date() }),
    },
  });

  if (historyEntries.length > 0) {
    await prisma.taskHistory.createMany({ data: historyEntries });
  }

  return NextResponse.json(task);
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
