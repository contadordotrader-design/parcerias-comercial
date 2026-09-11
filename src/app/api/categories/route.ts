import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { Setor } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const categoryInputSchema = z.object({
  nome: z.string().min(1, "Informe o nome da categoria."),
  setor: z.enum(["COMERCIAL", "PARCERIAS", "DEMANDAS_RECEBIDAS", "GERAL"]).optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const setor = searchParams.get("setor");

  const categories = await prisma.category.findMany({
    where: setor
      ? {
          OR: [{ setor: setor as Setor }, { setor: null }],
        }
      : undefined,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const parsed = categoryInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: parsed.data,
  });

  return NextResponse.json(category, { status: 201 });
}

