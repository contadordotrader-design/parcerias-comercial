import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { materialInputSchema } from "@/lib/validation/partner-extras";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const parceiroId = searchParams.get("parceiroId");

  const materiais = await prisma.partnerMaterial.findMany({
    where: parceiroId ? { parceiroId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(materiais);
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = materialInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const material = await prisma.partnerMaterial.create({
    data: {
      parceiroId: data.parceiroId,
      nome: data.nome,
      tipo: data.tipo,
      status: data.status,
      prazo: data.prazo ? new Date(data.prazo) : null,
      observacao: data.observacao,
    },
  });

  return NextResponse.json(material, { status: 201 });
}