# Agents

## Current Behavior
- Agents are Supabase-backed and loaded through `src/lib/agents.ts` and `src/hooks/use-agents.ts`.
- Agent provider connections are stored as `integrations.category = agent_provider`.
- Admin-created Agents use the organization owner context and are configurable only by Admin function.
- Active non-Viewer roles can use organization Agents.
- Agents execute Tasks and return structured output; they do not create or modify Workspaces, Flows, Tasks, or orchestration.
- Provider testing is handled through the `agent-provider-test` Edge Function.

## Source Files
| Concern | Path |
|---|---|
| Agents routes | `src/app/(dashboard)/agents/` |
| Agents lib | `src/lib/agents.ts` |
| Agents hook | `src/hooks/use-agents.ts` |
| Provider test function | `supabase/functions/agent-provider-test/index.ts` |
| Agent provider PRD | `docs/product/agent-provider-wizard-prd.md` |
| Execution responsibility PRD | `docs/product/agent-task-execution-responsibility-prd.md` |

## Backend / Tables / Functions
- `agents` stores agent records and organization scope.
- `integrations` stores provider connection metadata and safe config.
- Migration 045 adds Agent provider connection fields, organization Agent RLS, and Admin-only provider integration policies.
- `agent-provider-test` validates provider configuration.

## UI / Routes
- `/agents` is the Agent overview.
- `/agents/models` covers model/provider configuration surfaces.
- `/agents/engine` covers engine configuration surfaces.
- `/agents/analytics` covers Agent analytics.

## Known Blockers
- Authenticated provider smoke with real Admin session and provider credentials remains pending.
- Browser/headless profiles validate runtime selection, not full account automation.

## Graphify Queries
- `agents models engine analytics tasks execution`
- `agents provider integrations Admin RLS agent-provider-test`
- `path agents task-execute structured output`

## Update Rules
- Update this module after Agent routes, provider wizard, Agent RLS, provider functions, or task execution responsibility changes.
- Update `memory/DECISIONS.md` if Agent scope or authority changes.
- Update `docs/product/agent-task-execution-responsibility-prd.md` only when the product responsibility contract changes.
