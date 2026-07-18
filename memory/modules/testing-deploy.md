# Testing And Deploy

## Commands

```bash
npm run typecheck
npm run build
npm run lint
npm run test:e2e
npm run dev:clean      # rebuild .next before dev
npm run dev:webpack    # official bundler fallback
python -m graphify update . --force
```

## Current Validation Baseline

- Run `npm run typecheck` after TypeScript or route changes.
- Run `npm run build` after App Router/component changes.
- Run graphify structural update after architecture or structural code changes when feasible.

## Known Blockers

- Full graph extraction/rebuild requires an LLM API key.
- Authenticated Workstation E2E is implemented and requires E2E_TEST_EMAIL/E2E_TEST_PASSWORD for a confirmed account.
- next.config.ts pins turbopack.root to the repository directory so parent lockfiles cannot make dev route discovery intermittent.
- npm run dev clears only .next/dev before startup to prevent stale React Client Manifests after a production build; use npm run dev:webpack only if Turbopack still fails.
