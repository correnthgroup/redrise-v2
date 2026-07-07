# Testing And Deploy

## Commands

```bash
npm run typecheck
npm run build
npm run lint
npm run test:e2e
python -m graphify update . --force
```

## Current Validation Baseline

- Run `npm run typecheck` after TypeScript or route changes.
- Run `npm run build` after App Router/component changes.
- Run graphify structural update after architecture or structural code changes when feasible.

## Known Blockers

- Full graph extraction/rebuild requires an LLM API key.
- E2E coverage for the new foundation has not been implemented yet.
