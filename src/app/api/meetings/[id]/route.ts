import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { meetingInputSchema } from "@/lib/validation/meeting";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const meeting = await prisma.partnerMeeting.findUnique({
    where: { id },
    include: {
      parceiro: { select: { id: true, nome: true } },
      tarefasGeradas: true,
    },
  });

  if (!meeting) {
    return NextResponse.json({ error: "Reunião não encontrada." }, { status: 404 });
  }

  return NextResponse.json(meeting);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();
  const parsed = meetingInputSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const meeting = await prisma.partnerMeeting.update({
    where: { id },
    data: {
      ...(data.parceiroId !== undefined && { parceiroId: data.parceiroId }),
      ...(data.data !== undefined && { data: new Date(data.data) }),
      ...(data.participantes !== undefined && { participantes: data.participantes }),
      ...(data.objetivo !== undefined && { objetivo: data.objetivo }),
      ...(data.resumo !== undefined && { resumo: data.resumo }),
      ...(data.decisoes !== undefined && { decisoes: data.decisoes }),
      ...(data.pendencias !== undefined && { pendencias: data.pendencias }),
      ...(data.proximosPassos !== undefined && { proximosPassos: data.proximosPassos }),
    },
  });

  return NextResponse.json(meeting);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.partnerMeeting.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

