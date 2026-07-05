# Supabase

## Current Behavior
- Supabase is the backend source of truth for auth, profiles, sessions, teams, workspaces, projects, flows, tasks, agents, billing, notifications, and runtime files.
- Migrations are append-only once behavior may already be applied remotely.
- RLS uses helper functions for role-scoped organization access.
- Edge Functions use service role only where server-side authority is required.
- The active project ref is `vsaropewydcjsvplpugx` under `integration@correnth.com`.

## Source Files
| Concern | Path |
|---|---|
| Supabase client | `src/lib/supabase.ts` |
| Migrations | `supabase/migrations/` |
| Edge Functions | `supabase/functions/` |
| Supabase config | `supabase/config.toml` |
| Billing lib | `src/lib/billing.ts` |
| User profile lib | `src/lib/user-profile.ts` |

## Backend / Tables / Functions
- Auth/profile: `profiles`, `active_sessions`, profile trigger functions.
- Team: `team_members`, `teams`, `team_assignments`, invite tables/functions.
- Workstation: `workspaces`, `flows`, `flow_cards`, `flow_edges`, `tasks`, execution tables.
- Agents/integrations: `agents`, `integrations`, provider test function.
- Billing/projects: `billing_subscriptions`, `projects`, `has_active_corporate_plan()`.
- Ops: `notifications`, `audit_logs`, `adapter_runs`, `rise_insider_files`.

## UI / Routes
- Supabase-backed data appears across auth, dashboard, workstation, projects, agents, settings, and notifications.
- Local UI preferences may use `localStorage`; domain state must not.

## Known Blockers
- Migration 047 may need remote application if not already pushed.
- Stripe secrets/webhook are required for live billing.
- Semantic graph extraction of docs is optional and needs Gemini/Google API keys.

## Graphify Queries
- `supabase migrations rls edge functions profiles billing tasks agents`
- `path billing_subscriptions projects has_active_corporate_plan`
- `path active_sessions profiles login signup`
- `explain can_view_user_scoped_data`

## Update Rules
- Update this module after migrations, RLS policies, RPCs, Edge Functions, Supabase config, or source-of-truth changes.
- Update `memory/DECISIONS.md` for durable schema/security decisions.
- Record applied remote migrations in `memory/HANDOFF.md` or `memory/TASK_LOG.md`.
