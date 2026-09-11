"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-400 text-lg font-bold text-slate-900">
            CDT
          </div>
          <h1 className="text-lg font-semibold text-white">CDT Tarefas</h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestão de Comercial e Parcerias — Grupo CDT
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-900/5"
        >
          <div className="space-y-4">
            <Field label="E-mail">
              <Input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.nome@grupocdt.com.br"
              />
            </Field>
            <Field label="Senha">
              <Input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>

          {erro && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          <Button type="submit" className="mt-5 w-full" loading={loading}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Acesso restrito à equipe do Grupo CDT.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
