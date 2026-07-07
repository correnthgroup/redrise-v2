# RedRise - Product Architecture Map v1

## Status

Active architecture baseline through Workstation Root and Spaces.

## Product Vision

RedRise structures deterministic AI operations for organizations. The product cycle is:

```txt
Configure -> Build -> Activate -> Execute -> Observe -> Improve
```

## Current Navigation

```txt
Auth
├── Sign In
├── Sign Up
├── Forgot Password
└── Reset Password

App Shell / :organizationSlug
├── Workstation
│   ├── Spaces
│   ├── Process
│   └── Actions
├── Agents
│   ├── Models
│   ├── Engine
│   └── Analytics
├── Documentation
│   ├── Onboarding
│   ├── Tutorials
│   └── Changelog
├── Settings
│   ├── Profile
│   ├── Team
│   ├── Notification
│   └── Integration
├── Projects
│   ├── New Project
│   └── Design Engineer
├── Support
└── Feedbacks
```

## Implemented Screen IDs

| Screen ID | Status | Route |
|---|---|---|
| AUTH-SIGNIN | Implemented | `/sign-in` |
| AUTH-SIGNUP | Implemented | `/sign-up` |
| AUTH-FORGOT | Implemented | `/forgot-password` |
| AUTH-RESET | Implemented | `/reset-password` |
| APP-SHELL | Implemented | `/:organizationSlug/*` |
| WS-ROOT | Implemented with typed mock data | `/:organizationSlug/workstation` |
| WS-SPACES | Implemented with typed mock data | `/:organizationSlug/workstation/spaces` |

Skeleton route coverage exists for Agents, Documentation, Settings, Projects, Support, Feedbacks, Process, and Actions.

## Auth Domain

- Supabase Auth e-mail/password foundation is reused.
- Social login/signup are removed.
- Sign In copy: `Welcome back` and `Login to your RedRise account`.
- Sign Up copy: `Create your RedRise account` and `Start building your AI workstation`.
- Forgot and Reset screens use the same split auth visual pattern.
- Auth visual side uses a local RedRise implementation of the React Bits GradientBlinds reference.
- Validation uses Zod.
- Action feedback uses default Sonner styling.

## App Shell

- Authenticated routes are organization-scoped: `/:organizationSlug/...`.
- App Shell owns sidebar, breadcrumb, notification popover, organization switcher, and content inset.
- Sidebar is based on the `@blocks-so/sidebar-03` direction and uses RedRise navigation only.
- Collapsed sidebar shows icons with tooltips; clicking the RedRise logo expands it.
- Breadcrumb is global and reflects the route path.
- No visible Separator is allowed between breadcrumb/header and content.

## Workstation Root

Route: `/:organizationSlug/workstation`.

Implemented sections:

- Shortcut blocks for Spaces, Process, and Actions.
- Operational summary cards.
- Organization summary cards.
- Usage chart with 3d, 7d, and 30d filters.
- Live actions table with typed mock data.

Out of scope for current state:

- Process List implementation.
- Process Canvas.
- Actions Kanban.
- Realtime execution.

## Spaces

Route: `/:organizationSlug/workstation/spaces`.

Implemented sections:

- Header with `Spaces` and `New Workspace` CTA.
- Plan/usage cards.
- Compact metrics strip.
- Spaces table with mocked rows and action menu.
- Members list inside a Dialog.
- Create Space Dialog Wizard with 3 steps.
- Add Member and Role Assignment Dialogs.

Space roles:

```txt
Admin, Owner, Board, Staff, User, Viewer
```

Rules implemented in UI foundation:

- Only accepted organization members appear in member assignment mock data.
- Space Role does not alter Organization Role.
- Actions use Dialogs/Modals, not side panels.
- Relevant actions trigger Sonner feedback.

## Current Code Organization

```txt
src/
├── app/
│   ├── (auth)/
│   └── (app)/[organizationSlug]/
├── components/
│   ├── layout/
│   ├── providers/
│   └── ui/
└── domains/
    ├── auth/
    └── workstation/
```

## Backend Status

- Supabase Auth is active for auth foundation.
- Business persistence for Spaces and Workstation is not implemented yet.
- Legacy migrations/functions/libs remain preserved but are not active product truth unless explicitly reused.
- A later cleanup PRD must remove unused backend artifacts.

## Next Scope Boundary

Next implementation starts after WS-SPACES and should not assume Process or Actions logic exists.
