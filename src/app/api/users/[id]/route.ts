import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  nome: z.string().min(1).optional(),
  telefone: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  setor: z.enum(["COMERCIAL", "PARCERIAS", "DEMANDAS_RECEBIDAS", "GERAL"]).optional().nullable(),
  perfil: z.enum(["ADMINISTRADOR", "GESTOR", "COLABORADOR"]).optional(),
  status: z.enum(["ATIVO", "INATIVO"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  if (user!.perfil !== "ADMINISTRADOR") {
    return NextResponse.json(
      { error: "Apenas administradores podem editar colaboradores." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: { id: true, nome: true, status: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  if (user!.perfil !== "ADMINISTRADOR") {
    return NextResponse.json(
      { error: "Apenas administradores podem remover colaboradores." },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Desativa em vez de excluir permanentemente, preservando o histórico
  // de tarefas já vinculado a este colaborador.
  await prisma.user.update({ where: { id }, data: { status: "INATIVO" } });

  return NextResponse.json({ ok: true });
}
