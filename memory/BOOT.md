# BOOT

> Read this first for almost every Redrise task. Use `memory/INDEX.md` for routing and the module maps for domain detail.

## Current Stack

- App: Next.js 16 App Router with React 19 and TypeScript ~5.7.
- Build: `next build` through `npm run build`.
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss` and oklch CSS variables.
- UI: shadcn primitives under `src/components/ui/`, Radix, CVA, tailwind-merge, local base-nova style.
- Backend: Supabase Auth, PostgreSQL, RLS, migrations, and Edge Functions.
- Hosting: Render auto-deploy from `https://github.com/correnthgroup/redrise.git`.
- Package manager: npm. Do not add `yarn.lock` or `pnpm-lock.yaml`.

## Commands

- Install: `npm install`.
- Dev: `npm run dev`.
- Build: `npm run build`.
- Lint: `npm run lint`.
- Typecheck: `npm run typecheck`.
- E2E: `npm run test:e2e`.
- Context pack: `npm run context:pack -- <topic>`.
- Ops MCP: `npm run mcp:redrise-ops`.
- Graph update: `python -m graphify update . --force`.

## Sources Of Truth

- Auth session: Supabase Auth.
- Profile: Supabase `profiles` via `src/lib/user-profile.ts`.
- Active sessions: Supabase `active_sessions`.
- Team members: Supabase `team_members` via `src/lib/team-members.ts`.
- Workspaces: Supabase via `src/lib/workspaces.ts`.
- Flows: Supabase via `src/lib/flows.ts`.
- Tasks: Supabase via `src/lib/tasks.ts`.
- Agents: Supabase via `src/lib/agents.ts`.
- Billing: Supabase `billing_subscriptions` plus Stripe Edge Functions.
- Notifications: Supabase Realtime via `src/lib/notifications.ts`.

## Critical Rules

- `localStorage` is allowed only for UI preferences such as sidebar collapse and public auth language.
- Do not persist profile, session, team, workspace, project, flow, task, agent, or billing data in `localStorage`.
- Member pickers must load Settings > Team Members through `loadTeamMembers()` or `useTeamMemberOptions()`.
- Plans UI must not unlock paid behavior from frontend-only state.
- Supabase migrations are append-only when prior behavior may already be applied remotely.
- No external CDN assets; use local assets or `data:` URIs.
- Keep technical files in EN-US unless the file is explicitly human-facing PT-BR memory.

## Current Product State

- Public auth uses Supabase e-mail/password, no real OAuth, no e-mail confirmation UI.
- Sign Up sends `full_name`, `language`, and optional `invite_token`, then returns to Sign In.
- Authenticated dashboard routes use a server-side Supabase guard.
- Sidebar groups are Workstation, Agents, Documentation, and Settings.
- Settings is a single accordion page with Profile, Team, Notification, and Integration sections.
- Billing foundation exists, but live paid checkout depends on configured Stripe secrets and webhook.
- Agents execute Tasks only; they do not create or alter Workspaces, Flows, or orchestration.

## Current Blockers

- Global `npm run lint` may include broad pre-existing baseline issues outside targeted changes.
- Supabase migration `047_auth_full_name_language_contract.sql` exists locally and still needs remote application if not already pushed.
- Graph semantic extraction remains optional and pending without `GEMINI_API_KEY` or `GOOGLE_API_KEY`.

## Project Refs

- Owner: Correnth Group.
- Operational account: `integration@correnth.com`.
- Production URL: `https://www.redrise.app`.
- Supabase project ref: `vsaropewydcjsvplpugx`.
- Render service: `redrise` in project/workspace `Redrise`.
- GitHub repository: `https://github.com/correnthgroup/redrise.git`.

## Context And Graph Updates

- Use `memory/INDEX.md` to choose module maps and graph queries.
- Update affected memory files after code, schema, command, product, architecture, permission, billing, or deploy changes.
- Update `memory/TASK_LOG.md` with validation and blockers before finishing relevant work.
- Run `python -m graphify update . --force` after relevant structural or behavior changes when feasible.
