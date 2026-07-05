# Testing And Deploy

## Current Behavior
- Package manager is npm.
- Primary validation commands are `npm run lint`, `npm run typecheck`, `npm run build`, and targeted `npm run test:e2e` when browser behavior is in scope.
- Playwright uses `npm run dev -- --hostname 127.0.0.1 --port 5173` through `playwright.config.ts`.
- GitHub Actions CI uses npm (`npm ci`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:e2e`).
- CI and E2E env names use `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- No Vitest/unit runner is currently configured.
- Render is the production frontend deployment path.
- Supabase Edge Functions are deployed with Supabase CLI against the active Redrise project.
- Graphify updates use `python -m graphify update . --force` when feasible.

## Source Files
| Concern | Path |
|---|---|
| npm scripts | `package.json` |
| Render config | `render.yaml` |
| Supabase config | `supabase/config.toml` |
| Env example | `.env.example` |
| Playwright config | `playwright.config.ts` |
| GitHub CI | `.github/workflows/ci.yml` |
| PR guide | `docs/PR_GUIDE.md` |
| Ops MCP | `scripts/mcp/redrise-ops.mjs` |
| Context pack | `scripts/context-pack.mjs` |

## Backend / Tables / Functions
- Deploy-sensitive functions include `billing-checkout`, `billing-webhook`, `invite-member`, `task-execute`, `agent-provider-test`, `rise-insider-terminal`, and `rise-insider-filesystem`.
- Required Edge Function secrets include `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, Stripe secrets, and `APP_BASE_URL` where applicable.

## UI / Routes
- Build validates all App Router routes.
- E2E coverage runs through npm and the current Next.js dev server.

## Known Blockers
- Global lint may include pre-existing baseline issues outside a focused change.
- Render config should stay aligned with npm/Next output when deploy settings change.

## Graphify Queries
- `testing deploy render supabase build validation`
- `package scripts next build render config`
- `supabase functions deploy secrets validation`

## Update Rules
- Update this module after scripts, validation baseline, Render config, Supabase deploy flow, testing dependencies, or graph workflow changes.
- Update `memory/BOOT.md` when blockers or commands change.
- Update `docs/PR_GUIDE.md` when validation expectations change.
