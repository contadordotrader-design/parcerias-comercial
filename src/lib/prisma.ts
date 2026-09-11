import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Usamos o driver adapter do node-postgres (pg) em vez do query engine nativo
// do Prisma. Isso evita problemas de compatibilidade de binário entre
// ambientes (ex.: build local vs. runtime do Railway) e deixa a conexão
// inteiramente sob controle da pool do `pg`.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL não definida. Configure a variável de ambiente antes de iniciar o servidor."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
