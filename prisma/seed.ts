import { PrismaClient, PerfilAcesso, Setor } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@grupocdt.com.br";
  const adminSenha = process.env.ADMIN_PASSWORD ?? "Cdt@2026!";
  const adminNome = process.env.ADMIN_NAME ?? "Administrador";

  const senhaHash = await bcrypt.hash(adminSenha, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: adminNome,
      email: adminEmail,
      senhaHash,
      perfil: PerfilAcesso.ADMINISTRADOR,
      setor: Setor.GERAL,
      cargo: "Fundador",
    },
  });

  console.log(`Usuário administrador pronto: ${admin.email}`);

  const categoriasComercial = [
    "Atendimento",
    "Follow-up",
    "Prospecção",
    "Base de clientes",
    "Gestão",
  ];

  for (const nome of categoriasComercial) {
    await prisma.category.upsert({
      where: { id: `seed-comercial-${nome.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-comercial-${nome.toLowerCase().replace(/\s+/g, "-")}`,
        nome,
        setor: Setor.COMERCIAL,
      },
    });
  }

  console.log("Categorias iniciais do Comercial cadastradas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
