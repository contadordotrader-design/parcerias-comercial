import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const partnerInputSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  empresa: z.string().optional().nullable(),
  tipo: z.enum(["INFLUENCIADOR", "CONTADOR", "CONSULTOR", "ASSESSOR", "EDUCADOR", "OUTRO"]).default("OUTRO"),
  segmento: z
    .enum(["B3", "CRIPTO", "INTERNACIONAL", "FOREX", "MESA_PROPRIETARIA", "EMPRESARIAL", "OUTRO"])
    .default("OUTRO"),
  telefone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  instagram: z.string().optional().nullable(),
  site: z.string().optional().nullable(),
  status: z.enum(["PROSPECT", "EM_CONTATO", "NEGOCIACAO", "ATIVO", "INATIVO"]).default("PROSPECT"),
  responsavelId: z.string().uuid().optional().nullable(),
  dataInicio: z.string().optional().nullable(),
  proximaAcao: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const segmento = searchParams.get("segmento");
  const search = searchParams.get("q");

  const partners = await prisma.partner.findMany({
    where: {
      ...(status && { status: status as never }),
      ...(segmento && { segmento: segmento as never }),
      ...(search && { nome: { contains: search, mode: "insensitive" } }),
    },
    orderBy: { nome: "asc" },
    include: {
      responsavel: { select: { nome: true } },
      _count: { select: { tarefas: true, acoes: true } },
    },
  });

  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = partnerInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const partner = await prisma.partner.create({
    data: {
      ...data,
      email: data.email || null,
      dataInicio: data.dataInicio ? new Date(data.dataInicio) : null,
    },
  });

  return NextResponse.json(partner, { status: 201 });
}
