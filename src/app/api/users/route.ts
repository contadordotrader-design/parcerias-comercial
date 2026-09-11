import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const userInputSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional(),
  telefone: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  setor: z.enum(["COMERCIAL", "PARCERIAS", "DEMANDAS_RECEBIDAS", "GERAL"]).optional().nullable(),
  perfil: z.enum(["ADMINISTRADOR", "GESTOR", "COLABORADOR"]).default("COLABORADOR"),
});

export async function GET() {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const users = await prisma.user.findMany({
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      cargo: true,
      setor: true,
      perfil: true,
      status: true,
      foto: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  if (user!.perfil !== "ADMINISTRADOR") {
    return NextResponse.json(
      { error: "Apenas administradores podem cadastrar colaboradores." },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = userInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (!data.senha) {
    return NextResponse.json({ error: "Senha inicial obrigatória para novo colaborador." }, { status: 400 });
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const novoUsuario = await prisma.user.create({
    data: {
      nome: data.nome,
      email: data.email.toLowerCase().trim(),
      senhaHash,
      telefone: data.telefone,
      cargo: data.cargo,
      setor: data.setor,
      perfil: data.perfil,
    },
    select: { id: true, nome: true, email: true },
  });

  return NextResponse.json(novoUsuario, { status: 201 });
}
