# RedRise - UI Blocks Reference Map v1

## Status

Active UI reference baseline through Auth, App Shell, Workstation Root, and Spaces.

## Global Rules

- Use shadcn primitives in `src/components/ui/` only.
- Domain UI belongs in `src/domains/`.
- Use Dialogs/Modals for creation and configuration.
- Do not use side panels as default.
- Keep Sonner default visual styling.
- Do not add visible Separator between breadcrumb/header and content.

## Auth

| Screen ID | Reference | Implementation |
|---|---|---|
| AUTH-SIGNIN | `login-04` split form + visual | `src/domains/auth/components/sign-in-form.tsx` |
| AUTH-SIGNUP | `signup-04` split form + visual | `src/domains/auth/components/sign-up-form.tsx` |
| AUTH-FORGOT | Sign In visual adapted | `forgot-password-form.tsx` |
| AUTH-RESET | Forgot visual adapted | `reset-password-form.tsx` |

Auth decisions:

- Remove social login/signup.
- Use local GradientBlinds-style visual side.
- Use Zod for validation.
- Use Sonner for global action results.

## App Shell

| Section | Reference | Implementation |
|---|---|---|
| Sidebar | `@blocks-so/sidebar-03` | `src/components/layout/app-sidebar.tsx` |
| Breadcrumb | shadcn Breadcrumb | `src/components/layout/app-breadcrumb.tsx` |
| Notification Bell | Dropdown summary | `src/components/layout/notification-popover.tsx` |
| Organization Switcher | TeamSwitcher adapted | `src/components/layout/organization-switcher.tsx` |

App Shell decisions:

- Sidebar header shows RedRise logo and active organization name.
- Footer shows organization, plan, and role.
- Collapsed state shows icon-only nav with tooltips.
- Logo click expands collapsed sidebar.
- Notification CTA routes to Settings > Notification.

## Workstation Root

Reference: shadcn `dashboard-01` internal blocks only.

| Section | Use For | Implementation |
|---|---|---|
| Shortcut cards | Spaces, Process, Actions | `workstation-shortcuts.tsx` |
| Summary cards | Operational and organization metrics | `workstation-summary-cards.tsx` |
| Interactive chart | Usage over 3d/7d/30d | `workstation-usage-chart.tsx` |
| Data table | Live actions mock table | `workstation-live-actions-table.tsx` |

Do not reuse dashboard app shell or site header.

## Spaces

| Section | Reference | Implementation |
|---|---|---|
| Usage cards | `@blocks-so/stats-07` | `spaces-usage-cards.tsx` |
| Metric strip | `@blocks-so/stats-02` | `spaces-metrics-strip.tsx` |
| Spaces table | `@blocks-so/table-02` | `spaces-table.tsx` |
| Create Space | `@blocks-so/dialog-11` | `create-space-dialog.tsx` |
| Member roles | `@shadcnblocks/settings-members2` | `add-space-member-dialog.tsx`, `role-assignment-dialog.tsx` |

Spaces UI decisions:

- CTA label: `New Workspace`.
- Create wizard steps: Space Details, Members & Roles, Review.
- Add Member lists accepted organization members only.
- Role Assignment supports Admin, Owner, Board, Staff, User, Viewer.
- Row actions use dropdowns and dialogs/toasts.
