# Devroast — guia para agentes

Referência concisa para humanos e agentes de código.

## O que é

App Next.js: o utilizador cola código e recebe feedback (roast mode vs feedback direto). UI escura; Pencil (`.pen`) como referência de design.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Biome, **@base-ui/react** (primitivos interativos), **Shiki** (highlight no servidor, tema Vesper), **tRPC** (API layer), **@number-flow/react** (animated numbers).

## Convenções globais

- **Código e comentários**: inglês.
- **Commits Git**: inglês, [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, …).
- **Copy de interface**: inglês para alinhar às telas e ao design atuais; alterar se o produto tiver outro idioma.
- **Lint / format**: `pnpm lint`, `pnpm format` (Biome).

## Estrutura da app

- Código em [`src/`](src): [`src/app`](src/app) para rotas e [`layout.tsx`](src/app/layout.tsx) (`SiteHeader` global, `lang` no `<html>`).
- Copy estática da home e dados de exemplo: [`src/lib/home-static.ts`](src/lib/home-static.ts).
- Showcase de componentes: rota **`/components`** → [`src/app/components/page.tsx`](src/app/components/page.tsx).

## Componentes de interface

Padrões, exports e convenções para `src/components/ui` estão documentados em **[`src/components/ui/AGENTS.md`](src/components/ui/AGENTS.md)**.

## tRPC / Backend

Padrões para API e Server Components estão documentados em **[`src/server/AGENTS.md`](src/server/AGENTS.md)**.

## Especificações (Specs)

Padrão para criar especificações antes de implementar features está em **[`specs/AGENTS.md`](specs/AGENTS.md)**.
