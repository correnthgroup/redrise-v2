# HANDOFF

> Current/future handoff only. Historical implementation detail belongs in git history or PRD files, not in startup context.

## Current State

- Frontend stack: Next.js 16, React 19, TypeScript ~5.7, Tailwind CSS v4, shadcn/Radix base-nova style.
- Package manager: npm.
- Backend: Supabase project `vsaropewydcjsvplpugx` under `integration@correnth.com`.
- Hosting: Render service `redrise` from `https://github.com/correnthgroup/redrise.git`.
- Auth PRD7/PRD7-1 is implemented locally: real login/signup, dashboard guard, logout, public auth language, and migration 047.
- Auth runtime/hydration fixes are implemented locally: root layout no longer renders `next-themes` script, auth query params are passed from server pages, and auth language loads after hydration.
- PRD8 context stack is implemented locally: `memory/BOOT.md`, `memory/INDEX.md`, `memory/modules/*.md`, `AGENTS.md` router, canonical `docs/PR_GUIDE.md`, pointer files, and `npm run context:pack`.
- PRD9 Settings redesign is implemented locally: `/settings` is a single accordion page with Profile, Team, Notification, and Integration sections; old Settings subroutes redirect into section deep links.

## Current Blockers

- Global `npm run lint` may still include pre-existing baseline issues outside focused changes.
- Supabase migration `047_auth_full_name_language_contract.sql` may need remote application if not already pushed.
- Stripe live checkout requires Supabase Stripe secrets, price IDs, and webhook endpoint configuration.
- Graph semantic extraction remains optional and needs `GEMINI_API_KEY` or `GOOGLE_API_KEY`.

## Next Work

- Complete any future full graph community relabeling pass beyond the high-value labels improved in PRD8.
- Apply migration 047 remotely if the auth contract is ready for remote Supabase.
- Configure Stripe billing secrets/webhook before live checkout smoke.

## Operational Rules

- Use npm for local project commands.
- Do not add `yarn.lock` or `pnpm-lock.yaml`.
- Use `memory/BOOT.md` and `memory/INDEX.md` for task startup instead of loading all memory files.
- Keep Render, Supabase Auth redirects, and app allowed origins aligned with `https://www.redrise.app`.
- Refresh graphify after relevant code, schema, product behavior, architecture, or context structure changes.
