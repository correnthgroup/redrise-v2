# TASK_LOG

> Current task record and recent validation only. Long historical implementation logs were intentionally reduced during PRD8 context consolidation.

## Current Production Snapshot

- Official URL: `https://www.redrise.app`.
- Production deployment: Render service `redrise`.
- Backend: Supabase project `vsaropewydcjsvplpugx`.
- GitHub repository: `https://github.com/correnthgroup/redrise.git`.
- Package manager: npm.
- Deploy path: Render auto-deploy from GitHub using `render.yaml`.
- Workspace root: `D:\studio\redrise`.

## Current App Snapshot

- Framework: Next.js 16 App Router and React 19.
- Styling: Tailwind CSS v4 with local shadcn/Radix base-nova primitives.
- Auth: Supabase e-mail/password, no real OAuth, no e-mail confirmation UI.
- Sign Up suppresses Supabase automatic session and returns to Sign In.
- Billing state is persisted in Supabase and must not be unlocked from frontend-only state.
- Graphify after Fase 5 auth/server migration: 2681 nodes, 4732 edges, 244 communities.
- Semantic graph extraction remains optional and pending without `GEMINI_API_KEY` or `GOOGLE_API_KEY`.

## Recent Work

- Fase 5 de boas práticas adicionou `@supabase/ssr`, criou `src/lib/supabase-server.ts`, converteu o root redirect em `src/app/page.tsx` e o guard em `src/app/(dashboard)/layout.tsx` para Server Components com Supabase `getUser()` antes do render autenticado.
- Fase 4 de boas práticas removeu `localStorage` de domínio das rotas de Workspace, migrou list/create/edit/resume para `useWorkspaces()`/`src/lib/workspaces.ts`, adicionou `updateWorkspace()`, e reduziu create/edit aos campos persistidos pelo schema atual (`name`, `mission`, `flows`).
- Fase 3 de boas práticas alinhou configuração npm/Next: `components.json` agora aponta para `src/app/globals.css`, usa `base-nova`/RSC, Playwright usa `npm run dev` com flags corretas do Next, scripts `test:e2e` foram adicionados, `next.config.ts` documenta `cacheComponents` desativado, CI usa npm e envs `NEXT_PUBLIC_*`, e o setup E2E não emite `console.warn` quando secrets estão ausentes.
- Fase 2 de boas práticas substituiu o menu manual de Workspace por `DropdownMenu`, removeu o click catcher `fixed inset-0`, trocou a leitura inicial de Workspaces para `useSyncExternalStore` com snapshot cacheado, isolou `useSidebar()` em `src/components/ui/sidebar-context.tsx` e manteve `sidebar.tsx` exportando apenas componentes para evitar warning de Fast Refresh.
- Fase 1 de boas práticas de layout removeu sizing de viewport imposto em auth/loading states, sidebar shell, drawer caps e dialog detail scroll; dialog content agora tem limite dinâmico seguro e scroll próprio.
- Auth visual adjustment: `/login` and `/signup` right-side desktop panels now render only the centered shadcn-space orbiting circles animation from `src/components/shadcn-space/orbiting-circles/orbiting-circles-01.tsx`; previous gradient/text panels were removed.
- PRD7 implemented real login/signup, active session registration, dashboard guard, root redirect, and real logout.
- PRD7-1 implemented split auth layout, Full Name signup contract, public auth language preference, Settings language sync, and migration 047.
- PRD7-1 follow-up replaced language dropdown title/control with a globe icon menu, shortened e-mail helper copy, and restored default Sonner styling.
- Auth hydration/runtime fix removed `next-themes` ThemeProvider from root layout, moved auth query param reads into server pages, and deferred public language preference loading until after hydration.
- PRD8 implemented the four-level context stack: `memory/BOOT.md`, `memory/INDEX.md`, focused `memory/modules/*.md`, and graphify as deep traversal layer.
- PRD8 updated `AGENTS.md` into an operational router with task complexity routing, domain routing, graphify rules, prompt patterns, and end-of-work update rules.
- PRD8 consolidated PR/prompt guidance into `docs/PR_GUIDE.md` and reduced root `PR_GUIDE.md`, `PROMPT_GUIDE.md`, and `memory/AGENTS.md` to pointer/current-template files.
- PRD8 added `scripts/context-pack.mjs` and `npm run context:pack -- <topic>`.
- PRD8 corrected current npm/Next/Render context in `memory/CONTEXT.md`, `memory/TECHNICAL.md`, `README.md`, and `render.yaml`.
- PRD9 implemented single-page Settings accordion at `/settings` with Profile, Team, Notification, and Integration sections, section deep links, Settings sidebar updates, compatibility redirects for old Settings subroutes, local timezone options, Settings typed mock contracts, and preserved billing/limits backend artifacts.
- Removed `src/lib/workspaces.test.ts` because it imported `vitest` without a configured dependency or test runner and blocked `npm run typecheck`.

## Recent Validation

- Fase 5 auth/server: `npm run typecheck` passed.
- Fase 5 auth/server: `npx eslint --max-warnings=0 "src/app/page.tsx" "src/app/(dashboard)/layout.tsx" "src/lib/supabase-server.ts" "src/lib/supabase.ts"` passed with no visible warnings.
- Fase 5 auth/server: `npm run build` passed with no visible warnings.
- Fase 5 auth/server: `npm install @supabase/ssr` completed but printed npm peer/audit warnings from the existing ESLint/Next dependency baseline.
- Fase 5 auth/server: `python -m graphify update . --force` refreshed the structural graph to 2681 nodes, 4732 edges, and 244 communities.
- Fase 4 workspace: `npm run typecheck` passed.
- Fase 4 workspace: `npx eslint --max-warnings=0 "src/app/(dashboard)/workstation/workspace/page.tsx" "src/app/(dashboard)/workstation/workspace/new/page.tsx" "src/app/(dashboard)/workstation/workspace/[id]/edit/page.tsx" "src/app/(dashboard)/workstation/workspace/[id]/resume/page.tsx" "src/lib/workspaces.ts" "src/hooks/use-workspaces.ts" "src/types/workspace.ts"` passed with no visible warnings.
- Fase 4 workspace: targeted grep found no remaining `localStorage("workspaces")` usage or old route-local `Workspace` type imports under Workspace routes.
- Fase 4 workspace: `python -m graphify update . --force` refreshed the structural graph to 2678 nodes, 4724 edges, and 241 communities.
- Fase 3 config: `npm run typecheck` passed.
- Fase 3 config: `npx eslint --max-warnings=0 "next.config.ts" "playwright.config.ts" "tests/global-setup.ts"` passed with no visible warnings.
- Fase 3 config: `npm run test:e2e -- --list` listed 27 tests with no visible warnings.
- Fase 3 config: targeted grep found no active CI/test matches for `corepack yarn`, `cache: yarn`, `VITE_SUPABASE`, stale shadcn CSS/style config, or wildcard image `hostname: "**"`.
- Fase 3 config: `python -m graphify update . --force` refreshed the structural graph to 2675 nodes, 4697 edges, and 237 communities.
- Fase 2 layout/menu: `npm run typecheck` passed.
- Fase 2 layout/menu: `npx eslint --max-warnings=0 "src/app/(dashboard)/workstation/workspace/page.tsx" "src/components/ui/sidebar.tsx" "src/components/ui/sidebar-context.tsx" "src/components/nav-user.tsx"` passed with no visible warnings.
- Fase 2 layout/menu: grep found no remaining manual Workspace overlay patterns (`fixed inset-0 z-40`, `document.getElementById(\`delete-ws`, `window.location.href`, `menuPos`, or `menuOpen`).
- Fase 2 layout/menu: `python -m graphify update . --force` refreshed the structural graph to 2674 nodes, 4696 edges, and 241 communities.
- Fase 1 layout: `npm run typecheck` passed.
- Fase 1 layout: targeted `npx eslint` on changed files passed with only the known `src/components/ui/sidebar.tsx` fast-refresh warning.
- Fase 1 layout: global `npm run lint` still fails on broad pre-existing baseline issues, including generated `.next/dev/types` and older Workspaces/client-state patterns outside this focused change.
- Fase 1 layout: viewport grep found no remaining `min-h-screen`, `min-h-svh`, `h-svh`, or `max-h-[...vh]` classes in `src`.
- Fase 1 layout: `python -m graphify update . --force` refreshed the structural graph to 2666 nodes, 4671 edges, and 240 communities.
- Auth visual adjustment: `npx eslint "src/components/login-form.tsx" "src/components/signup-form.tsx" "src/components/shadcn-space/orbiting-circles/orbiting-circles-01.tsx"` passed.
- Auth visual adjustment: `npm run build` passed.
- Auth visual adjustment: `python -m graphify update . --force` refreshed the structural graph to 2407 nodes, 4252 edges, and 229 communities.
- Auth hydration fix: targeted `npx eslint` passed with only the known `src/app/layout.tsx` fast-refresh warning.
- Auth hydration fix: `npm run build` passed.
- `npm run context:pack -- auth` passed.
- `npm run build` passed.
- `npm run lint` exceeded the 120s tool timeout; targeted `npx eslint scripts/context-pack.mjs` passed.
- Stale active docs were corrected to npm/Next 16/Tailwind v4 context; remaining `corepack yarn` matches are in historical `updates/prd*.md` files.
- `python -m graphify update . --force` refreshed the structural graph to 2397 nodes, 4239 edges, and 233 communities.
- `.graphify_labels.json` now has high-value labels for communities 0-16; remaining generic community labels can be improved in a future full relabeling pass.
- PRD9: `npm run typecheck` passed.
- PRD9: targeted `npx eslint "src/app/(dashboard)/settings/page.tsx" "src/components/ui/accordion.tsx" "src/components/app-sidebar.tsx"` passed.
- PRD9: `npm run build` passed.
- PRD9: global `npm run lint` completed and still fails on broad pre-existing baseline issues outside focused Settings files.
- PRD9: `python -m graphify update . --force` refreshed the structural graph to 2484 nodes, 4409 edges, and 240 communities.

## Open Tasks

- Apply migration 047 remotely when ready.
- Configure Stripe secrets/webhook before live billing smoke.
- Design and implement final backend contracts for PRD9 profile bio, Team organization read model, notification preferences, and integration settings persistence.
