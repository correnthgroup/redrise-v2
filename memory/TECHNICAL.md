# TECHNICAL

> Visao geral em PT-BR para humanos e agentes. Para comecar tarefas, use `memory/BOOT.md`; para roteamento, use `memory/INDEX.md`; para detalhes por dominio, use `memory/modules/*.md`.

## Como Usar

- Leia `memory/BOOT.md` primeiro para stack, comandos, fontes de verdade, bloqueios e regras criticas.
- Leia `memory/INDEX.md` para decidir quais modulos e arquivos consultar.
- Use este arquivo apenas quando precisar de uma explicacao humana geral do produto.
- Nao trate planos futuros como comportamento existente sem confirmar no codigo ou nos modulos.

## Visao Geral Do App

- Redrise e um SaaS operacional com workspaces, flows, tasks, agents, analytics, settings, billing e notificacoes.
- O app usa Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/Radix e Supabase.
- A URL oficial e `https://www.redrise.app`.
- A hospedagem publica atual e Render.
- A navegacao autenticada usa Sidebar e breadcrumb.
- Dados de dominio usam Supabase; `localStorage` e permitido apenas para preferencias de UI.

## Fontes De Verdade

| Dominio | Fonte | Modulo |
|---|---|---|
| Auth, perfil e sessoes | Supabase Auth, `profiles`, `active_sessions` | `memory/modules/auth.md` |
| Settings e equipe | `profiles`, `team_members`, `teams`, `team_assignments` | `memory/modules/settings.md` |
| Billing | `billing_subscriptions`, Stripe Edge Functions | `memory/modules/billing.md` |
| Workstation | workspaces, flows, tasks e execucoes | `memory/modules/workstation.md` |
| Agents | `agents`, provider integrations | `memory/modules/agents.md` |
| Schema e funcoes | migrations, RLS, Edge Functions | `memory/modules/supabase.md` |
| Validacao e deploy | npm, Render, Supabase CLI, graphify | `memory/modules/testing-deploy.md` |

## Jornada Principal

- Usuarios publicos entram por `/login` ou `/signup`.
- Login autentica com Supabase e leva para `/workstation` ou `redirectTo`.
- Sign Up cria a conta com metadata, encerra a sessao automatica e retorna ao login.
- Usuarios autenticados navegam por Workstation, Agents, Documentation e Settings.
- Workstation concentra workspaces, flows e tasks.
- Settings concentra perfil, equipe, billing e limites.
- Agents executam Tasks e nao alteram Workspaces, Flows ou orquestracao.

## Regras Criticas

- Nao persistir dados de dominio em `localStorage`.
- Member pickers devem usar Settings > Team Members.
- Billing deve ler estado persistido no Supabase.
- Migrations Supabase sao append-only quando comportamento antigo pode ja estar aplicado remotamente.
- Graphify e a camada de travessia profunda para relacoes entre arquivos.

## Indice De Modulos

- Auth: `memory/modules/auth.md`.
- Settings: `memory/modules/settings.md`.
- Billing: `memory/modules/billing.md`.
- Workstation: `memory/modules/workstation.md`.
- Agents: `memory/modules/agents.md`.
- Supabase/schema: `memory/modules/supabase.md`.
- Testing/deploy: `memory/modules/testing-deploy.md`.

## Guias Relacionados

- Roteador operacional: `AGENTS.md`.
- PR, review e prompts: `docs/PR_GUIDE.md`.
- Decisoes duraveis: `memory/DECISIONS.md`.
- Estado atual e pendencias: `memory/HANDOFF.md`.
- Registro de trabalho e validacao: `memory/TASK_LOG.md`.
