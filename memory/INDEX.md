# INDEX

> Context router for Redrise. Start with `memory/BOOT.md`, then load only the context needed for the task.

## Task Complexity Routing

| Task type | Read | Action |
|---|---|---|
| Technical question only, no code change | `AGENTS.md`, `memory/BOOT.md`, relevant module if needed | Use graphify only for cross-file relationships; do not update memory unless drift is found |
| Point fix or fine adjustment | `AGENTS.md`, `memory/BOOT.md`, this file, prompt-named files | Prefer grep/glob before broad graph traversal; update only affected memory if facts changed |
| Medium feature or cross-file change | `AGENTS.md`, `memory/BOOT.md`, this file, relevant module, graphify query output | Update affected memory and graph after changes |
| Architecture/schema/billing/auth/deploy change | `AGENTS.md`, `memory/BOOT.md`, this file, `memory/DECISIONS.md`, relevant module, migrations/functions, graphify path/explain output | Update memory, graph, and task log after changes |

## Domain Routing

| Domain | Module | Inspect | Graphify query |
|---|---|---|---|
| Auth | `memory/modules/auth.md` | `src/components/login-form.tsx`, `src/components/signup-form.tsx`, `src/lib/user-profile.ts`, `src/lib/supabase.ts` | `auth flow login signup profile active sessions` |
| Billing | `memory/modules/billing.md` | `src/lib/billing.ts`, `src/app/(dashboard)/settings/billing/page.tsx`, `supabase/functions/billing-*`, billing migrations | `billing subscriptions checkout webhook corporate plan` |
| Settings | `memory/modules/settings.md` | settings page, sidebar links, profile/team/settings types, timezone options | `settings profile team notification integration accordion language timezone` |
| Workstation | `memory/modules/workstation.md` | workstation routes, workspace/flow/task libs and hooks | `workstation workspace flows tasks actions` |
| Agents | `memory/modules/agents.md` | agents routes, agent libs, provider functions | `agents models engine analytics tasks execution` |
| Supabase/schema | `memory/modules/supabase.md` | relevant migrations, RLS, Edge Functions | table/function-specific query or path |
| Testing/deploy | `memory/modules/testing-deploy.md` | `package.json`, `render.yaml`, `.env.example`, Supabase deploy notes | `testing deploy render supabase build validation` |

## Context Files

| File | Use |
|---|---|
| `memory/BOOT.md` | Short always-read facts |
| `memory/INDEX.md` | Routing by task and domain |
| `memory/modules/*.md` | Focused current behavior maps |
| `memory/DECISIONS.md` | Durable product and technical decisions |
| `memory/HANDOFF.md` | Current blockers, open work, and next steps |
| `memory/TASK_LOG.md` | Recent work, validation, and graph status |
| `memory/TECHNICAL.md` | PT-BR overview and module index |
| `docs/PR_GUIDE.md` | Canonical PR, review, and prompt guidance |

## End-Of-Work Checklist

- Update `memory/BOOT.md` if stack, commands, source-of-truth rules, blockers, or current state changed.
- Update this file if routing, module ownership, or graph queries changed.
- Update affected module maps when source files, backend contracts, routes, or behavior changed.
- Update `memory/DECISIONS.md` when a durable decision was made.
- Update `memory/HANDOFF.md` when work remains or blockers changed.
- Update `memory/TASK_LOG.md` with changes, validation, blockers, and graph status.
- Run `python -m graphify update . --force` after relevant code, architecture, schema, or behavior changes when feasible.
