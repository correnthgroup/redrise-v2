# Settings

## Current Behavior
- Settings routes live under `src/app/(dashboard)/settings/`.
- `/settings` is the primary authenticated Settings surface and renders one accordion page.
- Top-level Settings accordions are Profile, Team, Notification, and Integration.
- Deep links open sections through `/settings?section=profile`, `team`, `notification`, or `integration`; Profile is the default.
- Profile edits current profile fields available in `profiles` and saves authenticated language to `profiles.language`.
- Profile language save also syncs `localStorage['redrise:preferred-language']` for future public auth screens.
- Profile includes client-side avatar validation for JPG/PNG/GIF and max 2MB, plus bio UI pending a future backend column.
- Team, Notification, and Integration use typed client/mock state for the PRD9 frontend surface until final backend contracts exist.
- Billing and Limits are removed from the Settings frontend/navigation only; backend billing, plans, checkout, and limits artifacts remain preserved.

## Source Files
| Concern | Path |
|---|---|
| Settings hub | `src/app/(dashboard)/settings/page.tsx` |
| Settings layout | `src/app/(dashboard)/settings/layout.tsx` |
| Settings redirects | `src/app/(dashboard)/settings/{general,team,billing,limits}/page.tsx` |
| Settings types | `src/types/settings.ts` |
| Timezone options | `src/lib/timezones.ts` |
| Team members lib | `src/lib/team-members.ts` |
| Team member hook | `src/hooks/use-team-member-options.ts` |
| Profile lib | `src/lib/user-profile.ts` |
| Billing lib | `src/lib/billing.ts` |
| Limits lib | `src/lib/limits.ts` |

## Backend / Tables / Functions
- `profiles` stores user profile and language.
- `team_members`, `teams`, and `team_assignments` back team screens and member pickers.
- `active_sessions` supports session management.
- `api_keys` and integration RPCs support Settings security/integrations surfaces.
- `billing_subscriptions` remains the billing source of truth, but is no longer surfaced in Settings.

## UI / Routes
- `/settings` is the single Settings page.
- `/settings/general` redirects to `/settings?section=profile`.
- `/settings/team` redirects to `/settings?section=team`.
- `/settings/billing` and `/settings/limits` redirect to `/settings?section=integration`.
- Sidebar Settings child links are Profile, Team, Notification, and Integration.

## Known Blockers
- Role-scoped behavior should be validated with real multi-role accounts after RLS changes.
- Billing checkout requires Stripe secrets, price IDs, and webhook configuration for live paid flow.
- PRD9 Team, Notification, Integration, profile bio, and integration credentials still need final backend contracts before persistence.

## Graphify Queries
- `settings profile team notification integration accordion language timezone`
- `settings team members source picker useTeamMemberOptions`
- `settings billing persisted state checkout limits`

## Update Rules
- Update this module after Settings route, team/member, profile, session, billing, limits, or integration setup changes.
- Update `memory/modules/billing.md` when billing behavior changes outside Settings.
- Update `memory/modules/supabase.md` when Settings tables, policies, or RPCs change.
