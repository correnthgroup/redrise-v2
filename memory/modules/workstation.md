# Workstation

## Current Behavior

- Workstation is organization-scoped under `/:organizationSlug/workstation`.
- Root overview is implemented with typed mock data.
- Spaces overview is implemented with typed mock data.
- Create Space Wizard validates required fields with Zod.
- Add Member and Role Assignment dialogs list accepted members only.
- Space Role does not alter Organization Role.
- Process and Actions routes remain skeletons.

## Source Files

| Concern | Path |
|---|---|
| Workstation routes | `src/app/(app)/[organizationSlug]/workstation/` |
| Workstation components | `src/domains/workstation/components/` |
| Workstation mock data | `src/domains/workstation/data/mock-workstation.tsx` |
| Workstation types | `src/domains/workstation/types/workstation.types.ts` |
| Spaces components | `src/domains/workstation/spaces/components/` |
| Spaces dialogs | `src/domains/workstation/spaces/dialogs/` |
| Spaces mock data | `src/domains/workstation/spaces/data/mock-spaces.ts` |
| Spaces schemas/types | `src/domains/workstation/spaces/schemas/`, `src/domains/workstation/spaces/types/` |

## Implemented Routes

- `/:organizationSlug/workstation`
- `/:organizationSlug/workstation/spaces`

## Pending

- Process List.
- Process Canvas.
- Actions Kanban.
- Realtime execution.
- Final Supabase persistence.
