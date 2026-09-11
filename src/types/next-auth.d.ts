import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      perfil: string;
      setor?: string;
      foto?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    perfil: string;
    setor?: string;
    foto?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    perfil: string;
    setor?: string;
    foto?: string;
  }
}
