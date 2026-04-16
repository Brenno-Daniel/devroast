# Toast de Erros - Especificação

## Data: 2026-04-16

## Objetivo
Substituir `alert()` do browser por toasts estilizados com a biblioteca Sonner.

## Decisões de Design

| Decisão | Escolha |
|---------|---------|
| Biblioteca | Sonner (leve ~5kb, API simples) |
| Posição | Bottom-center |
| Tipos | Erro apenas (futuro: sucesso) |

## Arquitetura

### Arquivos a criar/modificar

| Arquivo | Ação | Propósito |
|---------|------|-----------|
| `src/components/ui/toaster.tsx` | Criar | Provider do Sonner com tema dark |
| `src/app/layout.tsx` | Modificar | Inserir `<Toaster />` |
| `src/lib/toast.ts` | Criar | Wrapper utilitário |
| `src/components/home/home-actions.tsx` | Modificar | Substituir `alert()` |

### Componentes

#### `src/components/ui/toaster.tsx`
```tsx
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      theme="dark"
      richColors
      closeButton
    />
  );
}
```

#### `src/lib/toast.ts`
```ts
import { toast as sonnerToast } from "sonner";

export const toast = {
  error: (message: string) => sonnerToast.error(message),
};
```

#### `src/app/layout.tsx`
- Importar `Toaster`
- Adicionar `<Toaster />` antes de `SiteHeader`

#### `src/components/home/home-actions.tsx`
- Importar `toast` de `@/lib/toast`
- Substituir `alert("Error submitting code...")` por `toast.error("Error submitting code...")`

## Implementação

1. [ ] Instalar `sonner`
2. [ ] Criar `src/components/ui/toaster.tsx`
3. [ ] Criar `src/lib/toast.ts`
4. [ ] Modificar `src/app/layout.tsx`
5. [ ] Modificar `src/components/home/home-actions.tsx`
6. [ ] Validar no browser
7. [ ] Commitar (após validação)
