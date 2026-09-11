import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { meetingInputSchema } from "@/lib/validation/meeting";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const parceiroId = searchParams.get("parceiroId");
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");

  const meetings = await prisma.partnerMeeting.findMany({
    where: {
      ...(parceiroId && { parceiroId }),
      ...(inicio &&
        fim && {
          data: { gte: new Date(inicio), lte: new Date(fim) },
        }),
    },
    orderBy: { data: "asc" },
    include: {
      parceiro: { select: { id: true, nome: true } },
    },
  });

  return NextResponse.json(meetings);
}

export async function POST(req: NextRequest) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = meetingInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const meeting = await prisma.partnerMeeting.create({
    data: {
      parceiroId: data.parceiroId,
      data: new Date(data.data),
      participantes: data.participantes,
      objetivo: data.objetivo,
      resumo: data.resumo,
      decisoes: data.decisoes,
      pendencias: data.pendencias,
      proximosPassos: data.proximosPassos,
    },
  });

  // Cada linha do campo "próximos passos" vira automaticamente uma tarefa
  // de Parcerias vinculada ao parceiro e a esta reunião.
  const linhas = (data.proximosPassos ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let tarefasCriadas = 0;
  if (linhas.length > 0) {
    await prisma.task.createMany({
      data: linhas.map((linha) => ({
        titulo: linha,
        setor: "PARCERIAS" as const,
        parceiroId: data.parceiroId,
        reuniaoId: meeting.id,
        criadorId: user!.id,
        status: "PENDENTE" as const,
        prioridade: "MEDIA" as const,
      })),
    });
    tarefasCriadas = linhas.length;
  }

  return NextResponse.json({ ...meeting, tarefasCriadas }, { status: 201 });
}

