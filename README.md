# CDT Tarefas — Gestão Comercial & Parcerias

Sistema interno de gestão operacional para os setores **Comercial** e
**Parcerias** do Grupo CDT: tarefas, subtarefas, colaboradores, parceiros,
ações, reuniões, materiais, comissões e um dashboard com indicadores.

> **Status do projeto:** Fase 1 (fundação) concluída — autenticação, banco de
> dados completo, dashboard, CRUD de tarefas, colaboradores e parcerias.
> Calendário, Kanban, Relatórios avançados e Notificações estão previstos
> para o próximo ciclo (as telas já existem como placeholders no menu).

---

## Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Backend:** API Routes do próprio Next.js
- **Banco de dados:** PostgreSQL + Prisma ORM (via driver adapter `@prisma/adapter-pg`,
  usando `pg` diretamente — evita problemas de binário nativo entre ambientes)
- **Autenticação:** NextAuth v5 (Credentials + JWT), senhas com bcrypt
- **Gráficos:** Recharts
- **Ícones:** lucide-react

---

## Como rodar localmente

### 1. Pré-requisitos

- Node.js 20+
- Um banco PostgreSQL (local, Docker, ou um banco de testes no Railway/Supabase)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus valores:

```bash
cp .env.example .env
```

- `DATABASE_URL`: string de conexão do seu PostgreSQL
- `NEXTAUTH_SECRET`: gere com `openssl rand -base64 32`
- `NEXTAUTH_URL`: `http://localhost:3000` em desenvolvimento
- `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD`: usados pelo script de seed
  para criar o primeiro usuário administrador

### 4. Gerar o Prisma Client e criar as tabelas

```bash
npx prisma generate
npx prisma migrate dev --name init
```

O comando `migrate dev` cria o banco (se necessário), gera a primeira
migration em `prisma/migrations/` e já deixa tudo versionado.

### 5. Popular o banco com o usuário administrador inicial

```bash
npm run db:seed
```

Isso cria o usuário administrador definido no `.env` (e algumas categorias
iniciais do Comercial). **Troque a senha padrão depois do primeiro login.**

### 6. Rodar em modo desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000` e entre com o e-mail/senha do administrador.

---

## Estrutura do projeto

```
prisma/
  schema.prisma        # modelo de dados completo (tarefas, parcerias, etc.)
  seed.ts               # cria o admin inicial e categorias
src/
  app/
    login/               # tela de login (pública)
    (app)/                # área autenticada (sidebar + topbar)
      dashboard/
      minhas-tarefas/
      comercial/
      parcerias/[id]/
      demandas/
      colaboradores/
      calendario/         # placeholder — próxima etapa
      relatorios/         # placeholder — próxima etapa
      configuracoes/      # placeholder — próxima etapa
    api/
      auth/[...nextauth]/
      tasks/, tasks/[id]/
      users/, users/[id]/
      partners/, partners/[id]/
  components/            # UI, tarefas, parceiros, dashboard, layout
  lib/                   # prisma client, auth, validação, utils
  middleware.ts          # protege todas as rotas exceto /login
```

---

## Banco de dados (visão geral do schema)

Principais modelos em `prisma/schema.prisma`:

- **User** — colaboradores, com perfil de acesso (Administrador, Gestor,
  Colaborador) e setor
- **Task / Subtask / ChecklistItem / TaskComment / TaskHistory /
  TaskAttachment** — tarefas e tudo que gira em torno delas, incluindo o
  histórico automático de alterações de status/responsável/prazo
- **Partner / PartnerAction / PartnerMeeting / PartnerMaterial / Commission**
  — ficha completa de cada parceiro
- **Category / Tag / Notification** — apoio e configuração

Todas as tabelas usam UUID como chave primária e têm `createdAt`/`updatedAt`.

---

## Subindo no GitHub

```bash
git init
git add .
git commit -m "Fundação do CDT Tarefas: auth, banco, dashboard, tarefas, parcerias, colaboradores"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cdt-tarefas.git
git push -u origin main
```

> O `.gitignore` já está configurado para não subir `node_modules`, `.next`
> e o arquivo `.env` (com suas senhas e string de conexão).

---

## Deploy no Railway

### 1. Criar o projeto no Railway

- Acesse railway.app → **New Project** → **Deploy from GitHub repo**
- Selecione o repositório `cdt-tarefas` que você acabou de subir

### 2. Criar o banco PostgreSQL

- Dentro do projeto no Railway, clique em **New** → **Database** → **PostgreSQL**
- O Railway provisiona o banco automaticamente

### 3. Copiar a `DATABASE_URL`

- Clique no serviço PostgreSQL → aba **Variables** → copie o valor de
  `DATABASE_URL` (ou `DATABASE_PUBLIC_URL`, se for conectar de fora do Railway)

### 4. Configurar as variáveis de ambiente do app

No serviço do seu app Next.js (não no banco), vá em **Variables** e adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a mesma URL copiada do serviço PostgreSQL |
| `NEXTAUTH_SECRET` | gere um valor forte (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | a URL pública que o Railway vai gerar para o app |
| `ADMIN_NAME` | nome do administrador inicial |
| `ADMIN_EMAIL` | e-mail do administrador inicial |
| `ADMIN_PASSWORD` | senha inicial (troque após o primeiro login) |

### 5. Conectar o GitHub (deploy automático)

Se você criou o projeto a partir do GitHub no passo 1, o Railway já fica
configurado para fazer deploy automático a cada `git push` na branch `main`.

### 6. Build e start

O Railway detecta automaticamente que é um projeto Next.js. Os comandos já
estão configurados no `package.json`:

- **Build:** `npm run build` (que já executa `prisma generate` antes do
  build do Next.js)
- **Start:** `npm run start`

### 7. Rodar as migrations no banco do Railway

Depois do primeiro deploy, rode as migrations contra o banco de produção.
A forma mais simples é abrir um shell do Railway (**Settings → Deploy →
Run Command**, ou via `railway run`) e executar:

```bash
npx prisma migrate deploy
```

### 8. Criar o usuário administrador inicial

Ainda no shell do Railway (ou localmente, apontando `DATABASE_URL` para o
banco de produção):

```bash
npm run db:seed
```

Depois disso, acesse a URL pública do app e entre com o e-mail/senha do
administrador configurados nas variáveis de ambiente.

---

## Sobre a validação deste projeto

O ambiente onde este projeto foi construído bloqueia o download automático
do binário de engine do Prisma (`binaries.prisma.sh`), então não foi possível
rodar `npx prisma generate` / `npm run build` até o final aqui. O schema e o
código foram revisados manualmente com cuidado, mas **o primeiro passo ao
abrir este projeto deve ser rodar `npm install`, `npx prisma generate` e
`npm run build` localmente** (ou deixar o Railway fazer isso no deploy) para
confirmar que tudo compila no seu ambiente, que não tem essa restrição de
rede. Se aparecer algum erro, cole a mensagem que eu ajudo a corrigir.

## Próximas etapas (ciclos seguintes)

- Calendário (mensal/semanal/diário) integrando tarefas, prazos e reuniões
- Visual Kanban com drag and drop
- Relatórios com seleção de período e exportação
- Central de notificações (tarefa atribuída, prazo próximo, menção, etc.)
- Subtarefas e checklist com interface dedicada dentro do detalhe da tarefa
- Upload de anexos com armazenamento externo
- Módulo de Comissões com fechamento mensal por parceiro
