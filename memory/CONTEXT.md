# CONTEXT

> High-level project context. For startup, read `memory/BOOT.md`; for routing, read `memory/INDEX.md`.

## Project

- Name: `Redrise`.
- Purpose: workspace-first SaaS for flows, tasks, agents, analytics, settings, team members, billing, and operational control.
- Owner: `Correnth Group`.
- Base operational account: `integration@correnth.com`.
- GitHub repository: `https://github.com/correnthgroup/redrise.git`.
- Official production URL: `https://www.redrise.app`.
- Supabase project ref: `vsaropewydcjsvplpugx`.
- Render project/workspace: `Redrise`.
- Render service: `redrise`.

## Current Product Rules

- Supabase is the source of truth for auth, profiles, active sessions, team members, workspaces, projects, flows, tasks, agents, billing, and notifications.
- Browser storage is allowed only for UI preferences such as sidebar state and public auth language.
- Do not store profile, session, team member, workspace, project, flow, task, agent, or billing domain data in `localStorage`.
- Settings > Team Members is the source for member dropdowns in Flow and Tasks.
- Settings > Plans/Billing must read persisted billing state and must not unlock paid features from frontend-only state.
- OAuth and e-mail confirmation remain future work until official provider/sender configuration exists.
- Agent behavior source: `docs/product/agent-task-execution-responsibility-prd.md`.
- Current detailed startup/routing source: `memory/BOOT.md` and `memory/INDEX.md`.

## Quality Rules

- Use npm for local project commands.
- Do not add `yarn.lock` or `pnpm-lock.yaml`.
- Run targeted validation for the changed area; prefer `npm run build` for structural app changes.
- Keep production deploys on Render through GitHub auto-deploy.
- Update affected memory/module files after relevant code, schema, product, command, or architecture changes.
- Refresh graphify with `python -m graphify update . --force` after relevant structural changes when feasible.
