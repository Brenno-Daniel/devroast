# Spec: tRPC Integration with Next.js App Router

## 1. Objetivo

Integrar tRPC como camada de API/backend do projeto Next.js com:
- Tipagem end-to-end entre frontend e backend
- Integração com Server Components (RSC) do Next.js
- TanStack React Query como underlying layer

## 2. Decisões (V1)

| # | Pergunta | Decisão |
|---|----------|---------|
| 1 | Stack de Client | TanStack React Query (recomendado na docs) |
| 2 | Adapter | Fetch adapter (`@trpc/server/adapters/fetch`) |
| 3 | Dados serializados | superjson para datas/datasheets |
| 4 | Estrutura de arquivos | `src/server/trpc/` para router, `src/trpc/` para client |
| 5 | Queries em Server Components | Prefetch + HydrationBoundary |

## 3. Arquitetura

### 3.1 Arquivos necessários

```
src/
├── server/
│   └── trpc/
│       ├── init.ts          # initTRPC, context, createTRPCRouter
│       ├── router.ts        # AppRouter principal
│       └── routers/
│           ├── _app.ts      # Router exports
│           └── example.ts  # Routers específicos
├── app/
│   └── api/trpc/[trpc]/route.ts  # API route handler
├── trpc/
│   ├── client.tsx           # Client Provider (use client)
│   ├── query-client.ts      # QueryClient factory
│   └── server.ts            # Server proxy + getQueryClient
```

### 3.2 Fluxo de dados

- **Server Components**: `trpc/server.ts` → `trpc.hello.queryOptions()` → prefetch → `HydrationBoundary`
- **Client Components**: `trpc/client.tsx` → `useTRPC()` → `useQuery()`/`useMutation()`
- **Direct server call**: `caller.hello()` para acesso direto em SC

### 3.3 Dependências

```bash
pnpm add @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod superjson server-only
```

## 4. Riscos

| Risco | Mitigação |
|-------|-----------|
| Bundle size | Usar `import type` para AppRouter |
| Cache sharing | QueryClient por request (cache + getQueryClient) |
| Hydration mismatch | shouldDehydrateQuery inclui pending queries |
| types circular | Server-only marker em arquivos de server |

## 5. To-dos (implementação)

1. Instalar dependências
2. Criar `src/server/trpc/init.ts` - initTRPC, context, router helpers
3. Criar router de exemplo em `src/server/trpc/routers/`
4. Criar API route em `src/app/api/trpc/[trpc]/route.ts`
5. Criar `src/trpc/query-client.ts` - QueryClient factory
6. Criar `src/trpc/client.tsx` - Provider para Client Components
7. Criar `src/trpc/server.ts` - Proxy + caller para Server Components
8. Configurar Provider no `layout.tsx`
9. Criar exemplo de query em página existente
10. Testar prefetch + hydration

## 6. Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr