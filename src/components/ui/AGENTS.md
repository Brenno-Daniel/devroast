# Padrões — componentes UI (`src/components/ui`)

Este guia define como criar e manter componentes visuais reutilizáveis no Devroast. Novos componentes devem seguir estes pontos para manter consistência com o que já existe (ex.: [`button.tsx`](./button.tsx)).

## Estrutura de arquivos

- Um componente por arquivo: `nome-do-componente.tsx` em minúsculas com hífen ou camelCase consistente com o projeto (hoje: `button.tsx`).
- Tipos exportados no mesmo arquivo quando forem específicos do componente (ex.: `ButtonProps`).
- Reexportar componentes públicos em [`index.ts`](./index.ts) com **named exports** apenas.

## Exports

- Usar **sempre named exports**: `export { Foo, fooVariants }` e `export type { FooProps }`.
- **Não usar** `export default`.

## Estilo e tokens

- Estilização com **Tailwind**; variantes com **`tailwind-variants`** (`tv`).
- Mesclar classes externas com o helper [`cn`](../../lib/cn.ts) de `@/lib/cn` (baseado em `tailwind-merge`).
- Preferir **tokens do tema** definidos em [`src/app/globals.css`](../../app/globals.css): `bg-background`, `text-foreground`, `bg-primary`, `ring-ring`, etc., em vez de cores soltas, salvo exceção documentada.
- **Família tipográfica:** usar apenas os utilitários padrão do Tailwind (`font-sans`, `font-serif`, `font-mono`), configurados em `@theme` via `--font-sans` / `--font-serif` / `--font-mono`. Não introduzir classes ou variáveis de tema do tipo `font-primary` / `font-secondary` para família (isso não confundir com `bg-primary`, que é cor).

## Tipagem (TypeScript)

- Estender as props nativas do elemento HTML correspondente com `React.ComponentPropsWithoutRef<'elemento'>`.
- Combinar com `VariantProps<typeof xxxVariants>` exportado pelo `tv`.
- Exportar o tipo de props quando for útil para consumidores: `export type FooProps = ...`.

## Comportamento React

- **`forwardRef`**: quando o elemento DOM precisar de `ref`, envolver com `forwardRef` e tipar `HTMLElement` correto (ex.: `HTMLButtonElement`).
- Definir **`displayName`** no componente exportado (útil para DevTools).
- **`"use client"`** apenas quando for necessário: hooks, estado, listeners que exigem cliente, ou APIs do browser. Se o componente for só marcação estática e aceitar `children` sem interação obrigatória no cliente, pode ser Server Component; componentes interativos (ex.: botão com `onClick`) são Client Components.

## Base UI e Shiki

- **Base UI** (`@base-ui/react`): usar primitivos para comportamento (ex.: [`switch.tsx`](./switch.tsx) com `Switch.Root` / `Switch.Thumb`).
- **Shiki**: realçar código apenas no **servidor** — [`highlight-code.ts`](../../lib/highlight-code.ts) com `codeToHtml` e tema `vesper`; [`code-block.tsx`](./code-block.tsx) é **Server Component** (sem `"use client"`). Não mover o highlight para o cliente salvo requisito novo.

## Padrão `tailwind-variants`

- Extrair estilos para `const xxxVariants = tv({ base, variants: { variant: { ... }, size: { ... } }, defaultVariants: { ... } })`.
- No JSX: `className={cn(xxxVariants({ variant, size, className }))}` para permitir override via `className`.
- Repassar `...props` para o elemento nativo depois de retirar props controladas (`variant`, `size`, `className`), mantendo atributos HTML válidos.

## Acessibilidade

- Usar elemento semântico correto (`button`, não `div` clicável, salvo casos muito específicos com teclado e roles).
- Estados desabilitados: `disabled` nativo quando aplicável; estilos `disabled:*` nas classes base.
- Foco visível: alinhar com `focus-visible:ring-*` e tokens `--ring` quando fizer sentido.

## Formatação e lint

- O projeto usa **Biome**; após alterações, execute `pnpm format` ou `pnpm lint` na raiz.

## Showcase

- Ao adicionar um componente novo, incluir exemplos na página [`src/app/components/page.tsx`](../../app/components/page.tsx) (todas as variantes e tamanhos relevantes) para revisão visual.

## Idioma no repositório

- **Código e comentários** (`.ts`, `.tsx`, `.css`, etc.): **inglês**.
- **Copy de interface** (texto visível ao usuário): **português (pt-BR)** quando fizer sentido para o produto.
- Este arquivo **AGENTS.md** permanece em **português** como convenção da equipe.
