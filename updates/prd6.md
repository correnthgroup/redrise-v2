# Update 6.0 - Settings Sub-Pages (General, Team, Billing, Limits)

> Generated via "grill me" session based on `PROMPT_GUIDE.md`. This file is being filled in interactically.

## Overview

Implement the four Settings sub-pages that currently exist only as empty stubs. Each page will have its own data model, forms, and actions.

---

## Phase 1 — Specification

### Screen 1: General (`/settings/general`)

**Route:** `/settings/general`
**Objective:** Allow the user to view and edit their account profile (name, username, email, avatar, birth date, language) and see their role and team assignments.
**Access Points:**
- **Sidebar group:** `Settings` (`nav-main`)
- **Sidebar label & icon:** `General` / `SlidersHorizontalIcon` (lucide-react)

**User Actions:**
- View profile fields (Full Name, Username, Email, Avatar, Birth Date, Language, Role, Team)
- Edit Full Name (first + middle + last)
- Edit Username
- Email is read-only (display only)
- Upload/change Avatar (same dimensions as sidebar avatar — `size-8` / 32px round)
- Pick Birth Date via calendar with year/month/day navigation
- Select Language via dropdown (🇧🇷 Português / 🇺🇸 English)
- Role is read-only (display only — Admin, Owner, Board, Staff, Member, Viewer)
- Team is read-only (display only — shows teams the account belongs to)
- Save profile changes

**Data Displayed:**
```ts
// From src/lib/user-profile.ts — UserProfile type
type UserProfile = {
  userId: string
  firstName: string
  middleName: string
  lastName: string
  username: string
  email: string
  avatarUrl: string | null
  gender: string
  birthDate: string
  language: 'en-US' | 'pt-BR'
  location: string
  timezone: string
  phone: string
}

// Role & Team come from team-members.ts
type TeamMember = {
  role: TeamMemberRole  // 'owner' | 'admin' | 'member' | 'viewer'
  function: string      // 'Admin' | 'Owner' | 'Board' | 'Staff' | 'Member' | 'Viewer'
  team: string          // comma-separated team names
}
```

**States:**
- **Empty:** N/A — profile always exists after onboarding
- **Loading:** Skeleton placeholders for each field row while `loadUserProfile()` runs
- **Error:** Toast (sonner) with retry on save failure
- **Empty filtered:** N/A

**Forms:**
- Fields:
  - `firstName`: string, required
  - `middleName`: string, optional
  - `lastName`: string, required
  - `username`: string, required, unique
  - `email`: string, read-only
  - `avatarUrl`: file upload → stored in Supabase Storage
  - `birthDate`: date picker (calendar with year/month/day navigation)
  - `language`: enum `'en-US' | 'pt-BR'`, dropdown with flag icons
  - `role`: read-only display (from team_members)
  - `team`: read-only display (from team_assignments → teams)
- Validation: `firstName` and `lastName` required; `username` min 3 chars
- Save: calls `saveUserProfile()` from `src/lib/user-profile.ts`

**Layout:**
- Pattern: **Card-based form sections**
- Section 1 — "Personal Information": avatar upload + Full Name (first/middle/last) + Username + Birth Date
- Section 2 — "Account": Email (read-only) + Language dropdown
- Section 3 — "Role & Team": Role (read-only badge) + Team (read-only badges)
- Save button at bottom-right
- Avatar upload: circular preview (32px match sidebar), click to open file picker, upload to Supabase Storage, update `avatar_url` in profiles
- After save: dispatch `PROFILE_UPDATED_EVENT` so sidebar avatar updates in real-time

---

### Screen 2: Team (`/settings/team`)

**Route:** `/settings/team`
**Objective:** Allow the user to manage team members (list, invite, edit roles/teams, remove) and manage teams (list, create), with role-based permissions.
**Access Points:**
- **Sidebar group:** `Settings` (`nav-main`)
- **Sidebar label & icon:** `Team` / `UsersIcon` (lucide-react)

**User Actions:**
- View list of all members (joined + invited but pending)
- See real-time online/offline status and time since last activity
- Invite new member via email (Admin only; Owner/Board see restricted popup)
- Edit member Role (admin/member/viewer) and Team assignment
- Remove member from organization (with AlertDialog confirmation)
- View list of teams with member count
- Create new team (name + description + assign members)
- Edit team details
- Delete team (with AlertDialog confirmation)

**Role-Based Permissions:**
| Role | Can View | Can Edit Members | Can Invite | Can Manage Teams |
|------|----------|------------------|------------|------------------|
| Admin | Yes | Yes | Yes | Yes |
| Owner | Yes | Yes | No (popup → hi.from@redrise.app) | Yes |
| Board | Yes | Yes | No (popup → hi.from@redrise.app) | Yes |
| Member | Yes | No | No | No |
| Viewer | Yes | No | No | No |

**Data Displayed:**
```ts
// From src/lib/team-members.ts
type TeamMember = {
  id: string
  ownerUserId: string
  memberUserId: string | null
  inviteEmail: string
  name: string
  email: string
  avatarUrl: string | null
  role: TeamMemberRole  // 'owner' | 'admin' | 'member' | 'viewer'
  function: string      // 'Admin' | 'Owner' | 'Board' | 'Staff' | 'Member' | 'Viewer'
  team: string
  status: 'Online' | 'Offline' | 'Invited'
  joined: string
}

// From src/lib/teams.ts
type Team = {
  id: string
  ownerUserId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  assignments: TeamAssignment[]
}
```

**States:**
- **Empty (no members):** Icon + title "No team members yet" + description "Invite your first member to get started." + "Invite Member" button
- **Loading:** 3 Skeleton rows for member list
- **Error:** Toast (sonner) with retry
- **Empty filtered:** "No results for these filters" + "Clear filters" button

**Forms:**
- **Invite Member:** email (string, required, validated), role (enum: admin/member/viewer), function (string, optional), team (string, optional)
- **Edit Member:** role (dropdown), team (multi-select from existing teams)
- **Create Team:** name (string, required), description (string, optional), members (multi-select from existing members)
- **Edit Team:** name, description, members

**Layout:**
- Pattern: **Tabs** — "Members" tab + "Teams" tab
- **Members Tab:** DataTable with columns: Avatar+Name, Email, Role (Badge), Team (Badge), Status (Badge: Online/Offline/Invited), Last Activity, Actions (DropdownMenu: Edit, Remove)
- Top-right: "Invite Member" button (hidden for Member/Viewer roles; for Owner/Board, triggers restricted popup)
- **Teams Tab:** Card grid or ItemGroup list of teams, each showing name, description, member count, actions (Edit, Delete)
- Top-right: "New Team" button
- Invite Member: opens Sheet (lateral panel) with form
- Edit Member: opens Sheet with pre-filled form
- Create/Edit Team: opens Sheet with form
- Remove Member / Delete Team: AlertDialog confirmation

---

### Screen 3: Billing (`/settings/billing`)

**Route:** `/settings/billing`
**Objective:** Allow the user to view their current plan (Free/Corporate), manage subscription, view payment method and invoices, and upgrade/downgrade.
**Access Points:**
- **Sidebar group:** `Settings` (`nav-main`)
- **Sidebar label & icon:** `Billing` / `CreditCardIcon` (lucide-react)

**User Actions:**
- View current plan (Free or Corporate) with status badge
- View subscription details: status, renewal date, payment method
- Upgrade from Free to Corporate (redirects to Stripe checkout)
- Downgrade from Corporate to Free (cancel at period end)
- Cancel subscription (with AlertDialog confirmation)
- View invoice history (list of past invoices)
- View feature comparison table (what each plan includes)

**Plans:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | Limited workspaces, flows, tasks, agents |
| Corporate | Custom pricing | Unlimited workspaces, flows, tasks, agents, priority support |

**Data Displayed:**
```ts
// From src/lib/billing.ts
type BillingSubscription = {
  ownerUserId: string
  plan: BillingPlan           // 'free' | 'corporate'
  status: BillingStatus       // 'free' | 'checkout_pending' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid'
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  updatedAt: string | null
}
```

**States:**
- **Empty (no subscription):** Shows Free plan as current, with "Upgrade to Corporate" CTA
- **Loading:** Skeleton for plan card + table rows
- **Error:** Toast (sonner) with retry
- **Empty filtered:** N/A

**Forms:**
- No input forms — actions are buttons (Upgrade, Cancel)
- Cancel: AlertDialog with confirmation text

**Layout:**
- Pattern: **Card-based sections**
- Section 1 — "Current Plan": Card showing plan name (Free/Corporate), status badge (Active/Trialing/Past Due/Canceled), renewal date, "Upgrade" or "Manage" button
- Section 2 — "Payment Method": Card showing card brand + last 4 digits (if Corporate), or "No payment method" (if Free)
- Section 3 — "Invoice History": DataTable with columns: Date, Amount, Status (Badge), Download link
- Section 4 — "Plan Comparison": Table with feature rows, checkmarks for Free vs Corporate
- Upgrade button: calls `startBillingCheckout()` → redirects to Stripe
- Cancel button: shows AlertDialog → calls Stripe cancel API (or sets `cancel_at_period_end`)

---

### Screen 4: Limits (`/settings/limits`)

**Route:** `/settings/limits`
**Objective:** Allow the user to view their current usage against plan limits, with progress bars, quotas, and upgrade prompts.
**Access Points:**
- **Sidebar group:** `Settings` (`nav-main`)
- **Sidebar label & icon:** `Limits` / `GaugeIcon` (lucide-react)

**User Actions:**
- View current usage for each resource (workspaces, flows, tasks, agents)
- See progress bars showing used vs limit
- See alerts when approaching or at limit
- Click "Upgrade" button to navigate to Billing page

**Plan Limits:**
| Resource | Free | Corporate |
|----------|------|-----------|
| Workspaces | 2 | 11 |
| Flows per workspace | 3 | 7 |
| Tasks per flow | 7 | 15 |
| Agents | 3 | 11 |

**Data Displayed:**
```ts
type UsageData = {
  workspaces: { used: number; limit: number }
  flowsPerWorkspace: { used: number; limit: number }[]  // per workspace
  tasksPerFlow: { used: number; limit: number }[]       // per flow
  agents: { used: number; limit: number }
}

// Plan limits config
const PLAN_LIMITS = {
  free: { workspaces: 2, flowsPerWorkspace: 3, tasksPerFlow: 7, agents: 3 },
  corporate: { workspaces: 11, flowsPerWorkspace: 7, tasksPerFlow: 15, agents: 11 },
} as const
```

**States:**
- **Empty (no usage):** All bars at 0/limit, no alerts
- **Loading:** Skeleton bars while usage data loads
- **Error:** Toast (sonner) with retry
- **At limit:** Red progress bar + alert banner "You've reached the limit for this resource"

**Forms:**
- No input forms — read-only display with action buttons

**Layout:**
- Pattern: **Card-based usage sections**
- Section 1 — "Plan Overview": Current plan name (Free/Corporate) with Badge, "Upgrade to Corporate" button (if Free)
- Section 2 — "Resource Usage": Grid of 4 Cards (Workspaces, Flows, Tasks, Agents), each showing:
  - Resource name
  - Progress bar (green < 70%, yellow 70-90%, red > 90%)
  - "X / Y used" text
  - Alert icon if at limit
- Section 3 — "Detailed Breakdown": Expandable sections per workspace showing flows and tasks counts
- Upgrade button: links to `/settings/billing`
- Alert banner: shows when any resource is at 100% — "You've reached the limit for [resource]. Upgrade to Corporate for more."

---

## Phase 1.5 — Component Mapping (shadcn)

All 44 installed shadcn components mapped to Settings usage. ✓ = used in this PRD, — = not applicable.

| # | Component | General | Team | Billing | Limits | Usage Context |
|---|-----------|---------|------|---------|--------|---------------|
| 1 | `avatar` | ✓ | ✓ | — | — | Profile picture display, member list avatars |
| 2 | `badge` | ✓ | ✓ | ✓ | ✓ | Role badges, status badges (Online/Offline/Invited), plan badges, limit status |
| 3 | `button` | ✓ | ✓ | ✓ | ✓ | Save, Invite, Upgrade, Cancel, Delete, Create actions |
| 4 | `card` | ✓ | ✓ | ✓ | ✓ | Form sections, plan cards, resource usage cards, payment method card |
| 5 | `separator` | ✓ | ✓ | ✓ | ✓ | Visual separation between all sections |
| 6 | `input` | ✓ | ✓ | — | — | Name, username, email, team name, invite email fields |
| 7 | `label` | ✓ | ✓ | — | — | Form field labels |
| 8 | `required-label` | ✓ | ✓ | — | — | Required field indicators (firstName, lastName, invite email) |
| 9 | `textarea` | — | ✓ | — | — | Team description field |
| 10 | `select` | ✓ | ✓ | — | — | Language dropdown, role selection |
| 11 | `native-select` | — | — | — | — | — |
| 12 | `calendar` | ✓ | — | — | — | Birth date picker with year/month/day navigation |
| 13 | `checkbox` | — | ✓ | — | — | Multi-select team members for team assignments |
| 14 | `switch` | — | — | — | — | — |
| 15 | `slider` | — | — | — | — | — |
| 16 | `tabs` | — | ✓ | — | — | Members tab + Teams tab navigation |
| 17 | `table` | — | ✓ | ✓ | — | Member list (DataTable), invoice history, plan comparison |
| 18 | `sheet` | — | ✓ | — | — | Invite member form, edit member form, create/edit team form (lateral panel) |
| 19 | `dialog` | ✓ | ✓ | — | — | Avatar crop/preview dialog, restricted invite popup |
| 20 | `alert-dialog` | — | ✓ | ✓ | — | Remove member confirmation, delete team confirmation, cancel subscription |
| 21 | `dropdown-menu` | — | ✓ | — | — | Row actions menu (Edit, Remove) on member list |
| 22 | `context-menu` | — | — | — | — | — |
| 23 | `popover` | — | — | — | — | — |
| 24 | `tooltip` | ✓ | ✓ | ✓ | ✓ | Info icons, field hints, action explanations |
| 25 | `command` | — | — | — | — | — |
| 26 | `skeleton` | ✓ | ✓ | ✓ | ✓ | Loading states for all pages |
| 27 | `spinner` | ✓ | ✓ | ✓ | — | Inline loading for save/invite actions |
| 28 | `sonner` | ✓ | ✓ | ✓ | ✓ | Success/error toasts for all operations |
| 29 | `empty` | — | ✓ | ✓ | ✓ | No members, no invoices, no workspaces states |
| 30 | `progress` | — | — | — | ✓ | Usage bars for workspaces, flows, tasks, agents |
| 31 | `scroll-area` | — | ✓ | — | ✓ | Scrollable member list, scrollable detailed breakdown |
| 32 | `collapsible` | — | — | — | ✓ | Expandable detailed breakdown per workspace |
| 33 | `toggle` | — | — | — | — | — |
| 34 | `toggle-group` | — | — | — | — | — |
| 35 | `menubar` | — | — | — | — | — |
| 36 | `breadcrumb` | — | — | — | — | Already in AppLayout |
| 37 | `sidebar` | — | — | — | — | Already in AppLayout |
| 38 | `kbd` | — | — | — | — | — |
| 39 | `input-group` | — | — | — | — | — |
| 40 | `chart` | — | — | — | — | — |
| 41 | `item` | ✓ | ✓ | — | ✓ | Profile field rows, team list items, workspace breakdown items |
| 42 | `background-gradient` | — | — | — | — | — |
| 43 | `back-button` | — | — | — | — | — |
| 44 | `required-label` | ✓ | ✓ | — | — | Required field indicators |

**Summary:** 28 of 44 components used (64% utilization)

**Components NOT used in Settings (with rationale):**
- `native-select` — `select` is sufficient for dropdowns
- `switch` — no toggle settings in current scope
- `slider` — no range inputs needed
- `context-menu` — `dropdown-menu` covers row actions
- `popover` — not needed for current forms
- `command` — no global search in Settings
- `toggle` / `toggle-group` — no view mode switching
- `menubar` — sidebar handles navigation
- `breadcrumb` — already in AppLayout
- `sidebar` — already in AppLayout
- `kbd` — no keyboard shortcuts displayed
- `input-group` — no input addons needed
- `chart` — no charts in Settings
- `background-gradient` — no visual effects needed
- `back-button` — breadcrumb handles navigation

---

## Phase 2 — Database & Backend

### General Screen
- No new migrations — `profiles` table already has all needed columns
- Avatar upload: use existing Supabase Storage bucket (or create `avatars` bucket if not exists)
- Role & Team: read from existing `team_members` + `team_assignments` tables

### Team Screen
- No new migrations — `team_members`, `teams`, `team_assignments` tables already exist
- Real-time status: Supabase Realtime on `profiles.last_seen_at` or presence channel
- Invite: uses existing `addTeamMember()` → Edge Function `invite-member`
- Role check: `loadSettingsAdminContext()` from `src/lib/team-members.ts` determines `isAdmin`, `isTeamManager`

### Billing Screen
- **Type change:** `BillingPlan` in `src/lib/billing.ts` must be updated from `'free' | 'business' | 'corporate'` to `'free' | 'corporate'` — remove `'business'` everywhere
- **Edge Function update:** `billing-checkout/index.ts` must remove `'business'` from `PLAN_PRICE_ENV` and plan validation
- **Edge Function update:** `billing-webhook/index.ts` must remove `'business'` from `planFromMetadata()`
- No new migrations — `billing_subscriptions` table already exists
- Invoice list: needs new Supabase function or Stripe API call to fetch invoice history (currently not implemented)
- Payment method display: needs Stripe Customer object or a stored payment method field (currently only `stripe_customer_id` exists)

### Limits Screen
- No new migrations — usage is calculated from existing tables
- Need new count functions in `src/lib/`:
  - `countWorkspaces(ownerUserId)` → uses `supabase.from('workspaces').select('*', { count: 'exact', head: true })`
  - `countFlowsByWorkspace(workspaceId)` → uses `supabase.from('flows').select('*', { count: 'exact', head: true })`
  - `countTasksByFlow(flowId)` → uses `supabase.from('tasks').select('*', { count: 'exact', head: true })`
  - `countAgents(ownerUserId)` → uses `supabase.from('agents').select('*', { count: 'exact', head: true })`
- Or: single `loadUsageData(ownerUserId)` function that returns all counts in parallel
- Plan limits are hardcoded in a config object (no DB table needed — limits are static per plan)

---

## Phase 3 — Frontend

### Files Created
| Path | Purpose |
|---|---|
| `src/lib/limits.ts` | Usage count functions + plan limits config |

### Files Modified
| Path | Purpose |
|---|---|
| `src/app/(dashboard)/settings/general/page.tsx` | Replace stub with full profile form |
| `src/app/(dashboard)/settings/team/page.tsx` | Replace stub with Members+Teams tabs |
| `src/app/(dashboard)/settings/billing/page.tsx` | Replace stub with plan card, payment, invoices, comparison |
| `src/app/(dashboard)/settings/limits/page.tsx` | Replace stub with usage bars, quotas, alerts |
| `src/lib/billing.ts` | Remove `'business'` from `BillingPlan` type |
| `src/components/app-sidebar.tsx` | Wire real user data (name, email, avatar) instead of hardcoded |
| `src/components/nav-user.tsx` | Accept real user data from profile |
| `src/i18n/terms.json` | New keys for General + Team + Billing + Limits pages |

### shadcn Commands
```bash
npx shadcn@latest add calendar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add alert-dialog
npx shadcn@latest add progress
npx shadcn@latest add avatar  # already present — verify
npx shadcn@latest add badge   # already present — verify
```

### i18n Keys
Namespace: `settings.general.*` + `settings.team.*` + `settings.billing.*` in `src/i18n/terms.json`.

| Key | en-US | pt-BR |
|---|---|---|
| `settings.general.title` | `General` | `Geral` |
| `settings.general.subtitle` | `Account settings and preferences` | `Configurações de conta e preferências` |
| `settings.general.personalInfo` | `Personal Information` | `Informações Pessoais` |
| `settings.general.fullName` | `Full Name` | `Nome Completo` |
| `settings.general.firstName` | `First Name` | `Nome` |
| `settings.general.middleName` | `Middle Name` | `Nome do Meio` |
| `settings.general.lastName` | `Last Name` | `Sobrenome` |
| `settings.general.username` | `Username` | `Nome de Usuário` |
| `settings.general.birthDate` | `Birth Date` | `Data de Nascimento` |
| `settings.general.account` | `Account` | `Conta` |
| `settings.general.email` | `Email` | `E-mail` |
| `settings.general.language` | `Language` | `Idioma` |
| `settings.general.roleAndTeam` | `Role & Team` | `Papel & Equipe` |
| `settings.general.role` | `Role` | `Papel` |
| `settings.general.team` | `Team` | `Equipe` |
| `settings.general.save` | `Save Changes` | `Salvar Alterações` |
| `settings.general.saved` | `Profile updated successfully` | `Perfil atualizado com sucesso` |
| `settings.general.saveError` | `Failed to save profile` | `Falha ao salvar perfil` |
| `settings.general.uploadAvatar` | `Upload photo` | `Enviar foto` |
| `settings.general.removeAvatar` | `Remove photo` | `Remover foto` |
| `settings.general.language.pt` | `Portuguese` | `Português` |
| `settings.general.language.en` | `English` | `Inglês` |
| `settings.team.title` | `Team` | `Equipe` |
| `settings.team.subtitle` | `Manage team members and teams` | `Gerencie membros e equipes` |
| `settings.team.membersTab` | `Members` | `Membros` |
| `settings.team.teamsTab` | `Teams` | `Equipes` |
| `settings.team.inviteMember` | `Invite Member` | `Convidar Membro` |
| `settings.team.newTeam` | `New Team` | `Nova Equipe` |
| `settings.team.emptyTitle` | `No team members yet` | `Nenhum membro ainda` |
| `settings.team.emptyDesc` | `Invite your first member to get started.` | `Convide seu primeiro membro para começar.` |
| `settings.team.inviteTitle` | `Invite Member` | `Convidar Membro` |
| `settings.team.inviteEmail` | `Email` | `E-mail` |
| `settings.team.inviteRole` | `Role` | `Papel` |
| `settings.team.inviteFunction` | `Function` | `Função` |
| `settings.team.inviteTeam` | `Team` | `Equipe` |
| `settings.team.inviteSend` | `Send Invite` | `Enviar Convite` |
| `settings.team.inviteSent` | `Invitation sent successfully` | `Convite enviado com sucesso` |
| `settings.team.restrictedTitle` | `Request Access` | `Solicitar Acesso` |
| `settings.team.restrictedDesc` | `You don't have permission to send invites. Please request inclusion at hi.from@redrise.app` | `Você não tem permissão para enviar convites. Solicite inclusão em hi.from@redrise.app` |
| `settings.team.editMember` | `Edit Member` | `Editar Membro` |
| `settings.team.removeMember` | `Remove Member` | `Remover Membro` |
| `settings.team.removeConfirm` | `Are you sure? This action cannot be undone.` | `Tem certeza? Esta ação não pode ser desfeita.` |
| `settings.team.createTeam` | `Create Team` | `Criar Equipe` |
| `settings.team.editTeam` | `Edit Team` | `Editar Equipe` |
| `settings.team.deleteTeam` | `Delete Team` | `Excluir Equipe` |
| `settings.team.deleteConfirm` | `Are you sure? This will remove all team assignments.` | `Tem certeza? Todas as atribuições da equipe serão removidas.` |
| `settings.team.teamName` | `Team Name` | `Nome da Equipe` |
| `settings.team.teamDesc` | `Description` | `Descrição` |
| `settings.team.members` | `Members` | `Membros` |
| `settings.team.online` | `Online` | `Online` |
| `settings.team.offline` | `Offline` | `Offline` |
| `settings.team.invited` | `Invited` | `Convidado` |
| `settings.team.lastActivity` | `Last activity` | `Última atividade` |
| `settings.team.noTeam` | `No team` | `Sem equipe` |
| `settings.billing.title` | `Billing` | `Faturamento` |
| `settings.billing.subtitle` | `Manage your plan and payment` | `Gerencie seu plano e pagamento` |
| `settings.billing.currentPlan` | `Current Plan` | `Plano Atual` |
| `settings.billing.free` | `Free` | `Gratuito` |
| `settings.billing.corporate` | `Corporate` | `Corporativo` |
| `settings.billing.status` | `Status` | `Status` |
| `settings.billing.active` | `Active` | `Ativo` |
| `settings.billing.trialing` | `Trialing` | `Em trial` |
| `settings.billing.pastDue` | `Past Due` | `Atrasado` |
| `settings.billing.canceled` | `Canceled` | `Cancelado` |
| `settings.billing.renewalDate` | `Renewal Date` | `Data de Renovação` |
| `settings.billing.upgrade` | `Upgrade to Corporate` | `Fazer Upgrade para Corporativo` |
| `settings.billing.downgrade` | `Downgrade to Free` | `Fazer Downgrade para Gratuito` |
| `settings.billing.cancel` | `Cancel Subscription` | `Cancelar Assinatura` |
| `settings.billing.cancelConfirm` | `Are you sure? Your plan will remain active until the end of the billing period.` | `Tem certeza? Seu plano permanecerá ativo até o final do período de faturamento.` |
| `settings.billing.paymentMethod` | `Payment Method` | `Forma de Pagamento` |
| `settings.billing.noPayment` | `No payment method on file` | `Nenhuma forma de pagamento registrada` |
| `settings.billing.invoices` | `Invoice History` | `Histórico de Faturas` |
| `settings.billing.noInvoices` | `No invoices yet` | `Nenhuma fatura ainda` |
| `settings.billing.download` | `Download` | `Baixar` |
| `settings.billing.planComparison` | `Plan Comparison` | `Comparação de Planos` |
| `settings.billing.feature` | `Feature` | `Recurso` |
| `settings.billing.workspaces` | `Workspaces` | `Workspaces` |
| `settings.billing.flows` | `Flows` | `Flows` |
| `settings.billing.tasks` | `Tasks` | `Tasks` |
| `settings.billing.agents` | `Agents` | `Agents` |
| `settings.billing.teamMembers` | `Team Members` | `Membros da Equipe` |
| `settings.billing.analytics` | `Analytics` | `Analytics` |
| `settings.billing.prioritySupport` | `Priority Support` | `Suporte Prioritário` |
| `settings.billing.unlimited` | `Unlimited` | `Ilimitado` |
| `settings.limits.title` | `Limits` | `Limites` |
| `settings.limits.subtitle` | `Usage limits and quotas` | `Limites de uso e cotas` |
| `settings.limits.planOverview` | `Plan Overview` | `Resumo do Plano` |
| `settings.limits.currentPlan` | `Current Plan` | `Plano Atual` |
| `settings.limits.upgrade` | `Upgrade to Corporate` | `Fazer Upgrade para Corporativo` |
| `settings.limits.resourceUsage` | `Resource Usage` | `Uso de Recursos` |
| `settings.limits.workspaces` | `Workspaces` | `Workspaces` |
| `settings.limits.flowsPerWorkspace` | `Flows per Workspace` | `Flows por Workspace` |
| `settings.limits.tasksPerFlow` | `Tasks per Flow` | `Tasks por Flow` |
| `settings.limits.agents` | `Agents` | `Agents` |
| `settings.limits.used` | `used` | `usados` |
| `settings.limits.of` | `of` | `de` |
| `settings.limits.atLimit` | `At limit` | `No limite` |
| `settings.limits.nearLimit` | `Approaching limit` | `Próximo do limite` |
| `settings.limits.limitAlert` | `You've reached the limit for {resource}. Upgrade to Corporate for more.` | `Você atingiu o limite de {resource}. Fazer Upgrade para Corporativo para mais.` |
| `settings.limits.detailedBreakdown` | `Detailed Breakdown` | `Detalhamento` |
| `settings.limits.noWorkspaces` | `No workspaces yet` | `Nenhum workspace ainda` |
| `settings.limits.noFlows` | `No flows in this workspace` | `Nenhum flow neste workspace` |
| `settings.limits.noTasks` | `No tasks in this flow` | `Nenhuma task neste flow` |
| `settings.limits.noAgents` | `No agents yet` | `Nenhum agent ainda` |

### Audit & Notifications
- **General:** `saveUserProfile()` already dispatches `PROFILE_UPDATED_EVENT` — sidebar listens and updates
- **Team — Member invited:** `logAuditEvent({ action: 'invite', entityType: 'member', entityId: teamMemberId })` + `createNotification()` for the invited user
- **Team — Member removed:** `logAuditEvent({ action: 'delete', entityType: 'member', entityId: memberId })`
- **Team — Role changed:** `logAuditEvent({ action: 'update', entityType: 'member', entityId: memberId, details: { oldRole, newRole } })`
- **Team — Team created:** `logAuditEvent({ action: 'create', entityType: 'member', entityId: teamId, entityName: teamName })` (entityType reused since no 'team' audit type exists; or add 'team' to AuditEntityType)
- **Team — Team deleted:** `logAuditEvent({ action: 'delete', entityType: 'member', entityId: teamId })`
- **Billing — Upgrade:** `logAuditEvent({ action: 'create', entityType: 'billing_subscription', entityId: checkoutId, entityName: plan })` (already in Edge Function)
- **Billing — Cancel:** `logAuditEvent({ action: 'update', entityType: 'billing_subscription', details: { cancelAtPeriodEnd: true } })`
- **Limits:** Read-only page — no audit events. Alert notifications are informational only (not persisted).

---

## Phase 4 — Validation

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`

---

## Files Changed (Complete List)

### New Files
- `src/lib/limits.ts` — usage count functions + plan limits config

### Modified Files
- `src/app/(dashboard)/settings/general/page.tsx` — replace stub with profile form
- `src/app/(dashboard)/settings/team/page.tsx` — replace stub with Members+Teams tabs
- `src/app/(dashboard)/settings/billing/page.tsx` — replace stub with plan card, payment, invoices, comparison
- `src/app/(dashboard)/settings/limits/page.tsx` — replace stub with usage bars, quotas, alerts
- `src/lib/billing.ts` — remove `'business'` from `BillingPlan` type
- `src/components/app-sidebar.tsx` — wire real user data
- `src/components/nav-user.tsx` — accept real user props
- `src/i18n/terms.json` — add 110+ new keys (en-US + pt-BR)
- `supabase/functions/billing-checkout/index.ts` — remove `'business'` plan support
- `supabase/functions/billing-webhook/index.ts` — remove `'business'` from plan mapping

---

## Risks & Mitigations

- **Sidebar hardcoded data**: `app-sidebar.tsx` currently passes hardcoded `name/email/avatar` to `NavUser`. Must wire real profile data from `loadUserProfile()` or a context/hook. Mitigation: create `useUserProfile` hook or pass profile through layout context.
- **Avatar storage bucket**: Need to verify Supabase Storage has an `avatars` bucket with public read access. Mitigation: check existing buckets; create if missing.
- **Username uniqueness**: `saveUserProfile` must handle unique constraint on `username`. Mitigation: validate before save, show toast error if taken.
- **Real-time presence**: Online/offline status depends on `profiles.last_seen_at`. Need Supabase Realtime subscription or polling. Mitigation: use existing `touchPresence()` pattern with interval-based polling as fallback.
- **Role-based invite restriction**: Owner/Board roles must see a restricted popup instead of the invite form. Mitigation: check `loadSettingsAdminContext()` result before rendering invite button; show AlertDialog with email link for restricted roles.
- **Team limit**: `TEAM_LIMIT = 7` in `src/lib/teams.ts` — enforce on team creation UI.
- **Billing plan simplification**: Removing `'business'` plan requires updating `BillingPlan` type, Edge Functions, and webhook handler. Mitigation: update all three locations atomically; test with Stripe test mode.
- **Invoice history**: Currently no API to fetch invoices from Supabase. Mitigation: add a new Edge Function `billing-invoices` that calls Stripe API, or store invoice metadata in `billing_subscriptions` during webhook processing.
- **Payment method display**: Only `stripe_customer_id` is stored; need to fetch payment method from Stripe. Mitigation: add Edge Function or store last 4 digits + brand in `billing_subscriptions` during webhook.
- **Usage counting performance**: Counting all resources on page load could be slow. Mitigation: use `select('*', { count: 'exact', head: true })` for efficient counting; consider caching or parallel queries.
- **Limits config hardcoded**: Plan limits are in a TS config object. If limits change, code must be redeployed. Mitigation: acceptable for MVP; consider DB-backed limits config for future.

---

## Pending

- [x] Entrevista da tela General — CONCLUÍDA
- [x] Entrevista da tela Team — CONCLUÍDA
- [x] Entrevista da tela Billing — CONCLUÍDA
- [x] Entrevista da tela Limits — CONCLUÍDA
- [ ] Implementação
