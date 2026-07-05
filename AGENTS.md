# AGENTS

> Operational router for agents and humans working on Redrise. If a prompt says "Read AGENTS.md", "Leia AGENTS.md", or equivalent, execute this routing guide. Do not summarize it unless the user explicitly asks for a summary.

## Execution Rule

If the prompt says "Read AGENTS.md", "Leia AGENTS.md", or equivalent, do not summarize this file unless the user explicitly asks for a summary.

Instead:
1. Classify the user's task.
2. Read the routed context files.
3. Execute the requested task.
4. Report only outcome, changed files, validation, and blockers.

Recommended prompt pattern:

```txt
Leia AGENTS.md e execute conforme o roteamento dele. Nao resuma o AGENTS.md. <tarefa>
```

Short prompt pattern:

```txt
Leia AGENTS.md e execute conforme o roteamento dele: <tarefa>
```

## Current Stack

- Build: Next.js 16 with Turbopack and `next build`.
- Framework: React 19 and TypeScript ~5.7.
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss` with oklch CSS variables.
- UI primitives: shadcn components in `src/components/ui/`, Radix primitives, CVA, and tailwind-merge using the local base-nova style.
- Routing: Next.js App Router with `(auth)` and `(dashboard)` route groups.
- State: React hooks plus Supabase-backed domain libraries; `localStorage` is only for UI preferences.
- Backend: Supabase Auth, PostgreSQL, RLS, migrations, and Edge Functions under the `integration@correnth.com` owned Redrise project.
- Hosting: Render auto-deploy from `https://github.com/correnthgroup/redrise.git`.
- Package manager: npm. Do not add `yarn.lock` or `pnpm-lock.yaml`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test:e2e
npm run context:pack -- <topic>
npm run mcp:redrise-ops
python -m graphify update . --force
```

## Context Startup

- Always start with `memory/BOOT.md` for current stack, sources of truth, blockers, and update expectations.
- Use `memory/INDEX.md` to route by domain and task complexity.
- Use `memory/modules/*.md` for focused domain maps instead of loading all of `memory/TECHNICAL.md` by default.
- Use `docs/PR_GUIDE.md` for PR body, review, prompt, component, i18n, audit, notification, and deliverables guidance.
- Use `memory/TECHNICAL.md` only when a human-readable PT-BR overview or cross-screen behavior explanation is needed.

## Task Complexity Routing

| Task type | Required context | Graphify |
|---|---|---|
| Technical question only, no code change | `memory/BOOT.md`; relevant module only if needed | Use only when question spans files or relationships |
| Point fix or fine adjustment | `memory/BOOT.md`, `memory/INDEX.md`, prompt-named files | Prefer grep/glob first |
| Medium feature or cross-file change | `memory/BOOT.md`, `memory/INDEX.md`, relevant module, affected source files | Run a focused query before editing |
| Architecture/schema/billing/auth/deploy change | `memory/BOOT.md`, `memory/INDEX.md`, `memory/DECISIONS.md`, relevant module, migrations/functions | Use query/path/explain before editing |

## Domain Routing

| Domain | Read | Inspect first | Suggested graph query |
|---|---|---|---|
| Auth | `memory/modules/auth.md` | `src/app/(auth)/*`, `src/components/login-form.tsx`, `src/components/signup-form.tsx`, `src/lib/user-profile.ts`, `src/lib/supabase.ts` | `auth flow login signup profile active sessions` |
| Settings | `memory/modules/settings.md` | `src/app/(dashboard)/settings/*`, `src/lib/team-members.ts`, `src/lib/user-profile.ts`, `src/lib/billing.ts` | `settings general team billing limits profile language` |
| Billing | `memory/DECISIONS.md`, `memory/modules/billing.md` | `src/lib/billing.ts`, `supabase/functions/billing-*`, billing migrations | `billing subscriptions checkout webhook corporate plan` |
| Workstation | `memory/modules/workstation.md` | workstation routes, `src/lib/workspaces.ts`, `src/lib/flows.ts`, `src/lib/tasks.ts` | `workstation workspace flows tasks actions` |
| Agents | `memory/modules/agents.md` | agents routes, `src/lib/agents.ts`, agent provider functions | `agents models engine analytics tasks execution` |
| Supabase/schema | `memory/modules/supabase.md`, `memory/DECISIONS.md` | relevant migrations and Edge Functions | affected tables/functions path query |
| Testing/deploy | `memory/modules/testing-deploy.md` | `package.json`, `render.yaml`, Supabase deploy notes | `testing deploy render supabase build validation` |

## Entry Points

- Root layout: `src/app/layout.tsx` with Geist font, `I18nProvider`, and Sonner.
- Root page: `src/app/page.tsx` redirects by Supabase session.
- Auth pages: `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx`.
- Dashboard layout: `src/app/(dashboard)/layout.tsx` with authenticated guard and `AppLayout`.
- Sidebar: `src/components/app-sidebar.tsx` and `src/components/nav-main.tsx`.
- App layout: `src/components/app-layout.tsx`.
- Domain libraries: `src/lib/`; hooks: `src/hooks/`; types: `src/types/`.
- Supabase migrations/functions: `supabase/`.
- Knowledge graph: `graphify-out/`.

## Sources Of Truth

| Domain | Source | Primary files |
|---|---|---|
| Auth session | Supabase Auth | `src/app/(auth)/*`, `src/lib/supabase.ts` |
| Profile | Supabase `profiles` | `src/lib/user-profile.ts` |
| Team members | Supabase `team_members` | `src/lib/team-members.ts`, `src/hooks/use-team-member-options.ts` |
| Workspaces | Supabase | `src/lib/workspaces.ts`, `src/hooks/use-workspaces.ts` |
| Flows | Supabase | `src/lib/flows.ts`, `src/hooks/use-flows.ts` |
| Tasks | Supabase | `src/lib/tasks.ts`, `src/hooks/use-tasks.ts` |
| Agents | Supabase | `src/lib/agents.ts`, `src/hooks/use-agents.ts` |
| Billing | Supabase `billing_subscriptions` and Stripe Edge Functions | `src/lib/billing.ts`, `supabase/functions/billing-*` |
| Notifications | Supabase Realtime | `src/lib/notifications.ts`, `src/hooks/use-notifications.ts` |

## Invariants

- Exactly one authenticated user per session.
- Sidebar and breadcrumb are always present when authenticated.
- No external CDN asset dependencies; assets should be local or `data:` URIs.
- Member pickers must use Settings > Team Members through `loadTeamMembers()` or `useTeamMemberOptions()`.
- Plans UI must read persisted billing state and must not unlock paid features from frontend-only state.
- Do not persist profile, session, team member, workspace, project, flow, task, agent, or billing domain data in `localStorage`.
- Public auth language preference may use `localStorage['redrise:preferred-language']` only as public UI preference.
- Supabase migrations are append-only once schema behavior may already be applied remotely.

## Graphify Rules

- If `graphify-out/graph.json` exists, use graphify before cross-file architecture, dependency, schema, billing, auth, deploy, or product behavior changes.
- Use graphify for relationship questions such as "what calls X", "path between X and Y", and "which files connect these domains".
- Normal structural updates do not require Gemini.
- Semantic extraction with `GEMINI_API_KEY` or `GOOGLE_API_KEY` is optional and only needed for richer docs/product intent extraction.
- After relevant code, architecture, schema, flow, permission, billing, deploy, or product behavior changes, run `python -m graphify update . --force` when feasible.

## End-Of-Work Updates

- Update `memory/BOOT.md` if stack, commands, source-of-truth rules, blockers, or current state changed.
- Update `memory/INDEX.md` if routing, module ownership, or recommended graph queries changed.
- Update affected `memory/modules/*.md` when behavior, source files, backend contracts, or routes changed.
- Update `memory/DECISIONS.md` when a durable product or technical decision was made.
- Update `memory/HANDOFF.md` when there is a new blocker, next step, or incomplete work.
- Update `memory/TASK_LOG.md` with what changed, validation run, blockers, and graph status.
- Update `AGENTS.md` if operating rules, commands, or context routing changed.
- If graph update cannot run, record the reason in `memory/TASK_LOG.md` or `memory/HANDOFF.md`.

## Stale Context Policy

- Do not delete context first. Migrate useful content, verify references, then delete or reduce.
- Root `PR_GUIDE.md`, `PROMPT_GUIDE.md`, and `memory/AGENTS.md` are pointer files unless a future task makes them canonical again.
- `docs/PR_GUIDE.md` is the canonical PR/review/prompt guide.
- `memory/TECHNICAL.md` is an overview and index; focused details belong in `memory/modules/*.md`.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Admin access |
| `OPENROUTER_API_KEY` | Edge Functions | AI model access |
| `STRIPE_SECRET_KEY` | Edge Functions | Payment processing |
| `STRIPE_WEBHOOK_SECRET` | Edge Functions | Stripe events |
| `APP_BASE_URL` | Edge Functions | App base URL |

## Language

- Technical files: EN-US.
- Human-facing product docs for non-technical readers may be PT-BR.
- UI copy currently mixes existing English literals and i18n keys; preserve established copy unless changing the specific screen.
- Mojibake is forbidden. Use valid UTF-8 text.
