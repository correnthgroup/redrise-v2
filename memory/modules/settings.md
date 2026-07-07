# Settings And App Shell

## Current Behavior

- App Shell is implemented in `src/components/layout/`.
- Settings routes currently exist as skeletons under `/:organizationSlug/settings`.
- Notification Popover links to `/:organizationSlug/settings/notification`.
- Organization Switcher uses typed mock organization data.

## Source Files

| Concern | Path |
|---|---|
| App Shell | `src/components/layout/app-shell.tsx` |
| Sidebar | `src/components/layout/app-sidebar.tsx` |
| Breadcrumb | `src/components/layout/app-breadcrumb.tsx` |
| Notification Popover | `src/components/layout/notification-popover.tsx` |
| Organization Switcher | `src/components/layout/organization-switcher.tsx` |
| Settings routes | `src/app/(app)/[organizationSlug]/settings/` |

## Pending

- Settings Profile implementation.
- Settings Team implementation.
- Settings Notification implementation.
- Settings Integration implementation.
- RBAC-backed menu visibility.
