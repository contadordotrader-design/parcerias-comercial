import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { commissionInputSchema } from "@/lib/validation/partner-extras";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const parceiroId = searchParams.get("parceiroId");

  const comissoes = await prisma.commission.findMany({
    where: parceiroId ? { parceiroId } : undefined,
    orderBy: { data: "desc" },
  });

  return NextResponse.json(comissoes);
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = commissionInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const comissao = await prisma.commission.create({
    data: {
      parceiroId: data.parceiroId,
      clienteNome: data.clienteNome,
      servico: data.servico,
      valorVenda: data.valorVenda,
      percentual: data.percentual,
      valorComissao: data.valorComissao,
      data: new Date(data.data),
      status: data.status,
    },
  });

  return NextResponse.json(comissao, { status: 201 });
}