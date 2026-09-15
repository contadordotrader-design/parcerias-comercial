import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { actionInputSchema } from "@/lib/validation/partner-extras";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const parceiroId = searchParams.get("parceiroId");

  const acoes = await prisma.partnerAction.findMany({
    where: parceiroId ? { parceiroId } : undefined,
    orderBy: { data: "desc" },
  });

  return NextResponse.json(acoes);
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = actionInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const acao = await prisma.partnerAction.create({
    data: {
      parceiroId: data.parceiroId,
      nome: data.nome,
      tipo: data.tipo,
      data: data.data ? new Date(data.data) : null,
      status: data.status,
      descricao: data.descricao,
      resultado: data.resultado,
      proximoPasso: data.proximoPasso,
    },
  });

  return NextResponse.json(acao, { status: 201 });
}