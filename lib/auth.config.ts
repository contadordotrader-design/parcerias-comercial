import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Configuração "leve" da autenticação, sem provedores nem dependências
// de Node.js (bcrypt, Prisma). É a única parte carregada pelo middleware,
// que roda no runtime Edge do Next.js e não suporta essas bibliotecas.
// O restante (Credentials provider, bcrypt, Prisma) fica em lib/auth.ts,
// usado pelas rotas de API e pelos componentes de servidor.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = request.nextUrl.pathname.startsWith("/login");

      if (!isLoggedIn && !isLoginPage) {
        const loginUrl = new URL("/login", request.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
      }

      return true;
    },
  },
};
