# Workstation

## Current Behavior
- Workstation groups the operational workspace, workflow/flow, and workaction/task surfaces.
- Workspaces, flows, tasks, flow cards, and task executions are Supabase-backed.
- Workspace list/create/edit/resume routes use `useWorkspaces()` and `src/lib/workspaces.ts`; workspace domain data is not stored in `localStorage`.
- Workspace create/edit currently persists the schema-backed fields `name`, `mission`, and `flows`; team/image/action UI details need schema support before they can return as persisted fields.
- Member selectors in Flow and Task creation use Settings > Team Members.
- Flow approval and official status are persisted fields on `flows`.
- Task execution is deterministic by `tasks.execution_path` and no automatic fallback is attempted.
- Notifications and audit logs are emitted for relevant flow/task/workspace actions.

## Source Files
| Concern | Path |
|---|---|
| Workstation routes | `src/app/(dashboard)/workstation/` |
| Workspace lib | `src/lib/workspaces.ts` |
| Workspace hook | `src/hooks/use-workspaces.ts` |
| Flow lib | `src/lib/flows.ts` |
| Flow hooks | `src/hooks/use-flows.ts` |
| Flow cards lib | `src/lib/flow-cards.ts` |
| Task lib | `src/lib/tasks.ts` |
| Task hook | `src/hooks/use-tasks.ts` |
| Notifications lib | `src/lib/notifications.ts` |
| Audit log lib | `src/lib/audit-logs.ts` |

## Backend / Tables / Functions
- `workspaces` stores operational spaces.
- `flows`, `flow_cards`, and `flow_edges` store workflow structure.
- `tasks`, `task_executions`, `task_execution_messages`, and `task_execution_outputs` store task execution history.
- `notifications` stores operational notifications.
- `task-execute` runs deterministic execution paths and adapters.

## UI / Routes
- `/workstation` is the authenticated landing surface.
- `/workstation/workspace` lists workspaces.
- `/workstation/workspace/new` creates workspaces.
- `/workstation/workspace/[id]/edit` updates persisted workspace fields.
- `/workstation/workspace/[id]/resume` reads persisted workspace fields.
- `/workstation/workflow` covers process/flow list behavior.
- `/workstation/workaction` covers action/task list behavior.

## Known Blockers
- Role-scoped RLS should continue to be validated with real multi-role accounts.
- External runtime paths require active HTTPS integrations configured in Settings.

## Graphify Queries
- `workstation workspace flows tasks actions`
- `flow approval official status notifications audit logs`
- `task execution_path task-execute adapters no fallback`

## Update Rules
- Update this module after workspace, flow, task, execution, adapter, audit, or notification behavior changes.
- Update `memory/modules/settings.md` if member picker contracts change.
- Update `memory/modules/supabase.md` after workstation schema/RLS changes.
