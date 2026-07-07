# AGENTS

> Operational router for RedRise. If a prompt says `Read AGENTS.md`, `Leia AGENTS.md`, or equivalent, follow this file and execute the task. Do not summarize this file unless explicitly asked.

## Execution Rule

1. Classify the task.
2. Read `memory/BOOT.md` and `memory/INDEX.md`.
3. Read the relevant v1 docs and memory module.
4. Execute the requested task.
5. Report outcome, changed files, validation, and blockers.

## Current Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS v4 through `@tailwindcss/postcss`.
- shadcn primitives in `src/components/ui/`.
- Layout components in `src/components/layout/`.
- Domain code in `src/domains/`.
- Supabase Auth is reused for foundation auth; final business persistence is pending.
- Package manager: npm.

## Active Sources Of Truth

- Product architecture: `docs/01_PRODUCT_ARCHITECTURE_MAP_v1.md`.
- UI references: `docs/02_UI_BLOCKS_REFERENCE_MAP_v1.md`.
- Roadmap: `docs/03_ROADMAP_v1.md`.
- PRD index: `docs/04_PRD_INDEX_v1.md`.
- Memory startup: `memory/BOOT.md`.
- Memory router: `memory/INDEX.md`.

When older code, graph output, migrations, or memory conflict with these files, these files win.

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test:e2e
python -m graphify update . --force
```

## Current Entry Points

- Root layout: `src/app/layout.tsx`.
- Root redirect: `src/app/page.tsx`.
- Auth routes: `src/app/(auth)/sign-in`, `sign-up`, `forgot-password`, `reset-password`.
- Authenticated layout: `src/app/(app)/[organizationSlug]/layout.tsx`.
- App Shell: `src/components/layout/app-shell.tsx`.
- Sidebar: `src/components/layout/app-sidebar.tsx`.
- Breadcrumb: `src/components/layout/app-breadcrumb.tsx`.
- Notification Popover: `src/components/layout/notification-popover.tsx`.
- Organization Switcher: `src/components/layout/organization-switcher.tsx`.
- Workstation Root: `src/domains/workstation/components/workstation-overview.tsx`.
- Spaces: `src/domains/workstation/spaces/components/spaces-page.tsx`.

## Implemented Scope

- PRD-000 Foundation Architecture.
- PRD-001 Auth UI Blocks and Supabase Auth foundation.
- PRD-003 App Shell Navigation.
- PRD-004 Organization Selector.
- PRD-005 Notification Bell Base.
- PRD-014 Workstation Root Overview.
- PRD-015 Spaces List.
- PRD-016 Create Space Wizard.
- PRD-017 Space Members and Space Roles.

## Current Invariants

- Authenticated routes are organization-scoped: `/:organizationSlug/...`.
- Sidebar and breadcrumb are always present in authenticated screens.
- No visible Separator between breadcrumb/header and useful page content.
- Collapsed sidebar shows icons with tooltips; clicking the logo expands it.
- Menus without permission should be hidden once RBAC is wired.
- Actions without permission should block with a clear Sonner message once RBAC is wired.
- Use Dialogs/Modals, not side panels, for creation/configuration flows.
- Sonner visual styling must remain default.
- Domain data must not be persisted in `localStorage`.

## Documentation Policy

- Do not create broad duplicate guides.
- Update only active docs and focused memory files.
- Legacy docs were removed; do not reintroduce `PR_GUIDE.md`, `PROMPT_GUIDE.md`, or old PRD update files.

## Graphify

- Use graphify for cross-file relationship questions and after structural changes when feasible.
- Structural graph update command: `python -m graphify update . --force`.
- Full semantic rebuild needs an LLM API key and may be blocked when no key is configured.
