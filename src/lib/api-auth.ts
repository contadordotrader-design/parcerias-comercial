import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    return { user: null, unauthorized: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  }
  return { user: session.user, unauthorized: null };
}
