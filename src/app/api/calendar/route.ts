import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { StatusTarefa } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");

  if (!inicio || !fim) {
    return NextResponse.json({ error: "Informe inicio e fim." }, { status: 400 });
  }

  const gte = new Date(inicio);
  const lte = new Date(fim);

  const [tasks, meetings] = await Promise.all([
    prisma.task.findMany({
      where: {
        prazo: { gte, lte },
        status: { notIn: [StatusTarefa.CANCELADO] },
      },
      select: {
        id: true,
        titulo: true,
        prazo: true,
        status: true,
        prioridade: true,
        setor: true,
        responsavel: { select: { nome: true } },
        parceiro: { select: { nome: true } },
      },
      orderBy: { prazo: "asc" },
    }),
    prisma.partnerMeeting.findMany({
      where: { data: { gte, lte } },
      select: {
        id: true,
        data: true,
        objetivo: true,
        parceiro: { select: { id: true, nome: true } },
      },
      orderBy: { data: "asc" },
    }),
  ]);

  return NextResponse.json({ tasks, meetings });
}

