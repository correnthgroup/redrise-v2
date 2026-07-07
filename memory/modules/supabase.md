# Supabase

## Current Behavior

- Supabase Auth is reused for foundation auth.
- Business persistence for Workstation and Spaces is not implemented yet.
- Legacy migrations, functions, and libs remain preserved but are not active product truth unless explicitly reused.

## Source Files

| Concern | Path |
|---|---|
| Browser client | `src/lib/supabase.ts` |
| Server client | `src/lib/supabase-server.ts` |
| Legacy migrations/functions | `supabase/` |

## Pending

- Organization persistence.
- Spaces persistence.
- Space members and roles persistence.
- RBAC/RLS for v1 organization and Spaces model.
- PRD-079 unused backend cleanup.
