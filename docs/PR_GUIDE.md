# Guia de PR e Prompt - Redrise

Documento canonico para autores, revisores e agentes. O roteamento operacional fica em `AGENTS.md`; o contexto curto fica em `memory/BOOT.md` e `memory/INDEX.md`.

## Stack Atual

- Next.js 16 App Router, React 19 e TypeScript ~5.7.
- Tailwind CSS v4 via `@tailwindcss/postcss`, `tailwind-merge` e `tw-animate-css`.
- shadcn components em `src/components/ui/`, usando Radix primitives, CVA e estilo local base-nova.
- Supabase Auth, PostgreSQL, RLS, migrations e Edge Functions como backend.
- npm como package manager local.
- i18n atual em `src/lib/i18n.ts`; preserve o padrao existente da tela alterada.
- Icones disponiveis incluem `lucide-react` e `@tabler/icons-react`; siga o padrao local da area alterada.
- Toasts usam Sonner; nao use `window.alert`.

## Estrutura De Arquivos

| Camada | Onde fica |
|---|---|
| Pagina dashboard | `src/app/(dashboard)/<rota>/page.tsx` |
| Pagina auth | `src/app/(auth)/<rota>/page.tsx` |
| Componente de feature | `src/components/<feature>/` ou co-localizado quando pequeno |
| Hook de dados | `src/hooks/use-<recurso>.ts` |
| Lib Supabase/domain | `src/lib/<recurso>.ts` |
| Tipos | `src/types/<recurso>.ts` |
| UI primitivos | `src/components/ui/<componente>.tsx` |
| Migrations/funcoes | `supabase/migrations/`, `supabase/functions/` |

Aliases TS principais: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/types`.

## PR Body Template

```md
## Contexto
<Por que esta mudanca existe? Link para issue/PRD/task.>

## Decisoes
- Layout/comportamento escolhido: <resumo>
- Dados/backend tocados: <Supabase tabelas, migrations, Edge Functions, libs>
- Como o usuario acessa: <rota/sidebar/topbar>

## Mudancas
- <mudanca 1>
- <mudanca 2>

## Validacao
- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm run build
- [ ] Checks manuais relevantes descritos abaixo

## Como testar
<Passos manuais para QA reproduzir o fluxo principal e o fluxo de erro.>

## Screenshots
<Desktop/mobile e temas quando a UI mudou.>
```

## Checklist De Review

- Funcionalidade principal e fluxos de erro funcionam.
- Empty, loading e error states existem quando aplicavel.
- Acessibilidade: foco visivel, teclado, `aria-label` em icon-only, contraste adequado.
- Visual consistente com a area alterada e com os componentes existentes.
- Textos visiveis seguem o padrao de i18n local.
- Tipos especificos; evitar `any`, `// @ts-ignore` e `// @ts-expect-error` sem justificativa.
- Sem `console.log` ou debug no diff.
- Acoes create/update/delete chamam `logAuditEvent()` quando o dominio ja usa auditoria.
- Eventos relevantes chamam `createNotification()` ou agregadores existentes quando aplicavel.
- Domain data nao foi movido para `localStorage`.
- Billing nao desbloqueia recursos pagos a partir de estado frontend-only.
- Migrations Supabase novas sao append-only quando comportamento ja pode existir remotamente.

## Componentes E Intencao

| Voce quer | Use |
|---|---|
| Confirmar acao importante | `Dialog` |
| Confirmar acao destrutiva | `AlertDialog` |
| Editar sem sair do contexto | `Sheet` |
| Substituir modal no mobile | `Drawer` |
| Menu curto contextual | `DropdownMenu` ou `Popover` |
| Busca/quick actions | `Command` |
| Preview ao hover | `HoverCard` |
| Dica em icon-only | `Tooltip` |
| Lista vazia | `Empty` |
| Loading de cards/lista | `Skeleton` |
| Loading de acao pontual | `Spinner` |
| Toast | `sonner` |
| Banner persistente | `Alert` |
| Status | `Badge` |
| Separador | `Separator` |
| Lista com midia/titulo/descricao | `Item` |
| Tabela rica | `DataTable` de `src/components/data-table.tsx` |
| Tabela simples | `Table` de `src/components/ui/table.tsx` |
| KPI/metrica | `Card` |
| Grafico | `Chart` |

## i18n

- Adicione textos visiveis ao sistema de i18n usado pela area alterada.
- Mantenha `en-US` e `pt-BR` sincronizados quando adicionar chaves.
- Use namespaces claros, por exemplo `settings.billing.errors.checkoutFailed`.
- Inclua placeholders, `aria-label`, titulos e mensagens de erro.
- Nao introduza mojibake; use UTF-8 valido.

## Auditoria E Notificacoes

- Acoes de escrita devem chamar `logAuditEvent({ action, entityType, entityId, ... })` quando o dominio ja tem auditoria.
- Acoes relevantes para o usuario devem chamar `createNotification({ userId, type, ... })` quando o dominio ja usa notificacoes.
- Para eventos de Flow, prefira agregadores existentes como `notifyFlowOwner(...)` quando aplicavel.

## Prompt Para Nova Tela Ou Mudanca

```txt
Leia AGENTS.md e execute conforme o roteamento dele. Nao resuma o AGENTS.md.

Task: <mudanca concreta>
Domain: <auth | settings | billing | workstation | agents | supabase | testing-deploy>
Route/UI: <rota, sidebar/topbar, estados esperados>
Data: <tabelas/libs/hooks envolvidos; mock apenas se aprovado>
Acceptance: <criterios objetivos>
Validation: <comandos e checks manuais>
```

## Especificacao Para Tela

- Rota: `<ex: /settings/integrations>`.
- Objetivo: `<uma frase>`.
- Acessos: `<sidebar, topbar, link interno>`.
- Acoes do usuario: `<3-7 acoes principais>`.
- Dados exibidos: `<tipos/tabelas/libs>`.
- Empty state: `<texto e CTA>`.
- Loading state: `<Skeleton/Spinner esperado>`.
- Error state: `<toast, inline error, retry>`.
- Formularios: `<campos e validacao>`.
- Audit events: `<eventos esperados>`.
- Notifications: `<eventos persistentes esperados>`.
- i18n: `<chaves novas>`.

## Entregaveis

- Arquivos criados/modificados.
- Migrations e Edge Functions tocadas.
- Componentes shadcn adicionados, se houver.
- Chaves i18n adicionadas.
- Audit log e notificacoes disparadas.
- Validacao executada e blockers.
- Graphify atualizado ou motivo registrado para nao atualizar.

## Validacao Local

- Use `npm run lint`, `npm run typecheck` e `npm run build` conforme o escopo.
- Se `npm run typecheck` falhar apenas pelo blocker conhecido de `vitest` em `src/lib/workspaces.test.ts`, registre isso no resultado.
- Use validações direcionadas (`npx eslint <files>`) quando o baseline global tiver problemas fora do escopo.
- Execute E2E apenas quando o escopo exigir e a suite estiver configurada para o fluxo atual.

## Onde Buscar Contexto

- Roteamento operacional: `AGENTS.md`.
- Contexto curto: `memory/BOOT.md`.
- Roteamento por dominio: `memory/INDEX.md`.
- Modulos: `memory/modules/*.md`.
- Decisoes duraveis: `memory/DECISIONS.md`.
- Handoff e blockers: `memory/HANDOFF.md`.
- Registro de validacao: `memory/TASK_LOG.md`.
