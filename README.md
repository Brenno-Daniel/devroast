# 🔥 Devroast

Mini SaaS para quem quer feedback de código com humor **ou** com pé no chão — você escolhe o tom.

## ✨ O que é

O **Devroast** é uma aplicação onde a pessoa cola um trecho de código e recebe uma avaliação gerada com base no modo escolhido:

- **🌶️ Roast mode** — avaliação sarcástica do código (efeito viral, entretenimento).
- **📋 Modo real** — mesma ideia, mas **sem sarcasmo**: feedback mais direto e útil.

No fim das contas, a ideia é misturar **viralidade** (quem não gosta de ver o próprio código sendo “assado”?) com **educação**: pontos de melhoria reais, sugestões acionáveis e a possibilidade de **compartilhar** o resultado nas redes sociais. Também entra no roadmap um **ranking** dos trechos mais mal avaliados — para dar aquela competitividade saudável (ou não tão saudável).

## 🧰 Stack (até o momento)

| Camada | Tecnologia |
|--------|------------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | [React](https://react.dev) 19 |
| Linguagem | [TypeScript](https://www.typescriptlang.org) 5 |
| Estilização | [Tailwind CSS](https://tailwindcss.com) v4 + [@tailwindcss/postcss](https://tailwindcss.com/docs/installation/using-postcss) |
| Componentes (comportamento) | [Base UI](https://base-ui.com/react) (`@base-ui/react`) |
| Syntax highlight | [Shiki](https://shiki.style) (servidor, tema Vesper) |
| Lint / format | [Biome](https://biomejs.dev) |
| Dados | [PostgreSQL](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| Estrutura de código | Diretório [`src/`](./src) (ex.: `src/app`) |

## 🛠️ Ferramentas de desenvolvimento

- **[Pencil](https://pencil.dev)** — design do app e conceito de layout (arquivos `.pen`).
- **OpenCode CLI** — usado na fase inicial do projeto.
- **[Cursor](https://cursor.com)** — editor principal daqui em diante, com **Composer 2**.
- **MCP Context7** — documentação e referências atualizadas de bibliotecas no fluxo do assistente.
- **MCP Pencil** — leitura e edição integradas dos designs `.pen` no editor.

## 📁 Estrutura

O código da aplicação vive em **`src/`** (por exemplo, `src/app` para rotas e layout do App Router).

**Estado atual (desenvolvimento):** layout global com navbar (`SiteHeader`), home em `/` com dados estáticos e preview de leaderboard, biblioteca de componentes em **`/components`**. Convenções do projeto: [`AGENTS.md`](./AGENTS.md).

## 🚀 Começando

**Pré-requisitos:** [Node.js](https://nodejs.org) e [pnpm](https://pnpm.io) (o projeto declara a versão em `packageManager` no `package.json`; recomenda-se [Corepack](https://nodejs.org/api/corepack.html) para alinhar o pnpm).

Instale dependências e suba o servidor de desenvolvimento:

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📦 Base de dados local

1. Copie [`.env.example`](./.env.example) para `.env.local` (gitignored) e ajuste `DATABASE_URL` se necessário.
2. Suba o Postgres com Docker:

```bash
docker compose up -d
```

3. Aplique o schema (migrações em [`drizzle/`](./drizzle)):

```bash
pnpm db:migrate
```

`DATABASE_URL` de exemplo (alinhada ao Compose): `postgresql://devroast:devroast@localhost:5432/devroast`

Para validar a ligação: `GET /api/health/db` (responde `{ "ok": true }` quando o DB está acessível).

## 📜 Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia o servidor após `build` |
| `pnpm lint` | `biome check` |
| `pnpm format` | Formata e corrige com Biome (`biome check --write`) |
| `pnpm db:generate` | Gera migrações Drizzle a partir do schema |
| `pnpm db:migrate` | Aplica migrações |
| `pnpm db:push` | Empurra o schema para o DB (desenvolvimento) |
| `pnpm db:studio` | Abre o Drizzle Studio |

## 📚 Saiba mais

- [Documentação Next.js](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)

## Deploy

A forma mais simples de publicar um app Next.js é a [Vercel](https://vercel.com/new). Veja também [deploy na documentação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

Projeto originalmente criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
