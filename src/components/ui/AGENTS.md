# Componentes UI (`src/components/ui`)

Guia específico desta pasta. Para contexto do projeto (stack, convenções globais, estrutura da app), ver o **[`AGENTS.md`](../../../AGENTS.md)** na raiz.

## Estrutura de ficheiros

- Um componente por ficheiro (ex.: `button.tsx`).
- Tipos exportados no mesmo ficheiro quando forem específicos do componente.
- Reexportar componentes públicos em [`index.ts`](./index.ts) com **named exports** apenas.

## Exports

- Usar **sempre named exports**; **não** usar `export default`.

## Compound components

- Para blocos com vários slots (título, descrição, colunas, label + controlo), preferir **subcomponentes nomeados** com prefixo do bloco (ex.: `AnalysisCardRoot`, `LeaderboardRowRank`, `SwitchFieldRoot` / `SwitchFieldControl` / `SwitchFieldLabel`) em vez de muitas props para texto ou slots.
- Repassar `className` e `...props` ao elemento nativo de cada peça quando fizer sentido.

## Estilo e tokens

- **Tailwind** + **`tailwind-variants`** (`tv`) + **`cn`** de `@/lib/cn`.
- Preferir **tokens de tema** em [`src/app/globals.css`](../../app/globals.css): `bg-background`, `text-foreground`, `ring-ring`, etc.
- **Família tipográfica:** apenas utilitários Tailwind (`font-sans`, `font-mono`, …). Não usar `font-primary` / `font-secondary` para família (não confundir com `bg-primary`, que é cor).

## Base UI e Shiki

- **Base UI** (`@base-ui/react`): primitivos para comportamento (ex.: switch com `SwitchFieldControl` + `Switch.Root` / `Switch.Thumb`).
- **Shiki**: highlight só no **servidor** — [`highlight-code.ts`](../../lib/highlight-code.ts) com tema Vesper; [`code-block.tsx`](./code-block.tsx) é **Server Component** (sem `"use client"`).

## Reexportação

- Componentes públicos em [`index.ts`](./index.ts).

## Showcase

- Novos componentes ou variantes: incluir exemplos na página [`src/app/components/page.tsx`](../../app/components/page.tsx).

## Padrões adicionais

Seguir ficheiros existentes (ex.: [`button.tsx`](./button.tsx)) para `forwardRef`, acessibilidade e `displayName` quando aplicável.
