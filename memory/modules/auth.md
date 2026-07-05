# Auth

## Current Behavior
- Public auth routes are `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx`.
- Login uses Supabase `signInWithPassword()`, registers `active_sessions`, loads profile context, and redirects to `redirectTo` or `/workstation`.
- Sign Up sends `full_name`, `language`, and optional `invite_token`, signs out the automatic signup session, and redirects to `/login?created=1`.
- Login and Sign Up use a split layout on desktop; the right panel shows only the `@shadcn-space/orbiting-circles-01` orbiting circles animation centered in the panel.
- Public auth language uses `localStorage['redrise:preferred-language']` only as UI preference before authentication.
- Authenticated app language uses `profiles.language` from Supabase.
- Root redirect and dashboard route guard run as Server Components using `src/lib/supabase-server.ts` and Supabase `getUser()`.
- Logout in `src/components/nav-user.tsx` revokes the current active session best-effort and signs out through Supabase.

## Source Files
| Concern | Path |
|---|---|
| Login route | `src/app/(auth)/login/page.tsx` |
| Signup route | `src/app/(auth)/signup/page.tsx` |
| Login form | `src/components/login-form.tsx` |
| Signup form | `src/components/signup-form.tsx` |
| Auth visual animation | `src/components/shadcn-space/orbiting-circles/orbiting-circles-01.tsx` |
| Auth language helper | `src/lib/auth-language.ts` |
| Supabase browser client | `src/lib/supabase.ts` |
| Supabase server client | `src/lib/supabase-server.ts` |
| Profile/session helpers | `src/lib/user-profile.ts` |
| Active sessions | `src/lib/active-sessions.ts` |
| Logout menu | `src/components/nav-user.tsx` |

## Backend / Tables / Functions
- Supabase Auth is the session source of truth.
- `profiles` stores profile identity and authenticated language.
- `active_sessions` stores remembered/revoked session metadata.
- `external_member_invites` supports signup invite activation by token.
- Migration `047_auth_full_name_language_contract.sql` updates the profile trigger for `full_name` and `language` metadata.

## UI / Routes
- `/login` renders the public login form.
- `/signup` renders the public signup form.
- `/auth/callback` and real OAuth remain archived until provider credentials exist.
- `/` redirects on the server to `/workstation` for signed-in users or `/login` for signed-out users.
- `(dashboard)` routes redirect signed-out users on the server before rendering `AppLayout`.

## Known Blockers
- Migration 047 may still need remote application if not already pushed.
- OAuth and e-mail confirmation are future work until official provider/sender configuration exists.

## Graphify Queries
- `auth flow login signup profile active sessions`
- `path login-form active_sessions profiles`
- `explain create_profile_for_auth_user`

## Update Rules
- Update this module after auth route, profile trigger, active session, signup metadata, language, or logout changes.
- Update `memory/DECISIONS.md` for durable auth decisions.
- Update `memory/BOOT.md` when auth blockers or source-of-truth rules change.
