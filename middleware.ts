import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// O middleware usa apenas a configuração "leve" (authConfig), sem
// Credentials/bcrypt/Prisma, porque roda no runtime Edge do Next.js.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
