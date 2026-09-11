import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const partnerUpdateSchema = z.object({
  nome: z.string().min(1).optional(),
  empresa: z.string().optional().nullable(),
  tipo: z.enum(["INFLUENCIADOR", "CONTADOR", "CONSULTOR", "ASSESSOR", "EDUCADOR", "OUTRO"]).optional(),
  segmento: z
    .enum(["B3", "CRIPTO", "INTERNACIONAL", "FOREX", "MESA_PROPRIETARIA", "EMPRESARIAL", "OUTRO"])
    .optional(),
  telefone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  site: z.string().optional().nullable(),
  status: z.enum(["PROSPECT", "EM_CONTATO", "NEGOCIACAO", "ATIVO", "INATIVO"]).optional(),
  responsavelId: z.string().uuid().optional().nullable(),
  proximaAcao: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const partner = await prisma.partner.findUnique({
    where: { id },
    include: {
      responsavel: { select: { nome: true } },
      tarefas: {
        orderBy: { createdAt: "desc" },
        include: { responsavel: { select: { nome: true } } },
      },
      acoes: { orderBy: { data: "desc" } },
      reunioes: { orderBy: { data: "desc" } },
      materiais: { orderBy: { createdAt: "desc" } },
      comissoes: { orderBy: { data: "desc" } },
    },
  });

  if (!partner) {
    return NextResponse.json({ error: "Parceiro não encontrado." }, { status: 404 });
  }

  return NextResponse.json(partner);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const parsed = partnerUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const partner = await prisma.partner.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(partner);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.partner.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
