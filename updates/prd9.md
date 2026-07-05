# Update 9.0 - Settings Single-Page Accordion Redesign

> PRD for rebuilding Settings from scratch as one single Settings screen composed of accordion blocks. Current Settings backend/UI behavior may be disregarded for this redesign; future work will rebuild backend connections for the new data model.

## Overview

Replace the current multi-subpage Settings structure with a single `/settings` screen. The page must use shadcn `accordion` blocks for each Settings area.

The new Settings screen will be organized into these top-level accordion sections:

| Order | Accordion | Purpose |
|---|---|---|
| 1 | `Profile` | User profile, avatar, language, timezone |
| 2 | `Team` | Team management and organization details |
| 3 | `Notification` | User notification preferences |
| 4 | `Integration` | Connected integrations |

Billing and Limits are removed only from the authenticated app frontend/Settings surface. Backend billing, plan state, Stripe contracts, limits logic, migrations, Edge Functions, and related domain code must remain preserved because pricing, plans, checkout, and billing will be handled by the public site or future non-Settings surfaces. Integration replaces Billing/Limits only as the visible Settings section inside the app.

---

## Strategic Direction

- Treat this Settings redesign as a new product structure, not as a patch over the current PRD6 Settings implementation.
- Existing Settings backend can be ignored for screen design decisions.
- Billing, plans, and limits remain valid product/backend domains; this PRD only removes their Settings frontend entry points.
- Future backend work will connect these forms and tables to the final data contracts.
- The implementation should favor small micro-tasks so Profile, Team, Notification, and Integration can ship independently.
- Keep the authenticated dashboard invariant: Settings remains inside AppLayout with sidebar and breadcrumb.

---

## Phase 1 - Navigation & Page Structure

### Screen: Settings (`/settings`)

**Route:** `/settings`
**Objective:** Present all Settings surfaces in one screen, separated by accordion sections.
**shadcn Command:**
```bash
npx shadcn@latest add accordion
```

**Sidebar Changes:**
- Keep `Settings` as a sidebar group/menu entry.
- Remove Settings frontend submenus for `General`, `Billing`, and `Limits`.
- Rename `General` concept to `Profile` inside the Settings accordion.
- Add `Notification` as a Settings shortcut/submenu if the sidebar keeps Settings child links.
- Add `Integration` as the Settings frontend replacement for Billing/Limits.
- Do not delete billing/limits backend code, migrations, Stripe functions, or domain libraries as part of this PRD.
- Preferred sidebar behavior: one `Settings` route with anchor/deep-link support to each accordion section.

**Accordion Sections:**
- `Profile`
- `Team`
- `Notification`
- `Integration`

**Deep Link Behavior:**
- `/settings?section=profile` opens Profile.
- `/settings?section=team` opens Team.
- `/settings?section=notification` opens Notification.
- `/settings?section=integration` opens Integration.
- If no section is provided, Profile opens by default.

**States:**
- Loading: skeleton per accordion content area.
- Error: toast plus inline retry for the affected accordion section.
- Empty: section-specific empty states.
- Disabled backend: use typed mock/client state until final backend contracts exist.

---

## Phase 2 - Profile Accordion

### Section: Profile

**Accordion Title:** `Profile`
**Objective:** Replace old `General` with a profile settings block based on `@shadcnblocks/settings-profile1`, extended with Language and Timezone controls.
**Reference Command:**
```bash
npx shadcn add @shadcnblocks/settings-profile1
```

**Reference Layout:** settings-profile1 card pattern with:
- Avatar upload
- Full Name
- Username
- Email
- Bio
- Cancel button
- Save Changes button

**Required Adaptations:**
- Replace external avatar URL defaults with local data or current user avatar.
- No external CDN assets.
- Use current Redrise avatar/profile conventions.
- Email should remain read-only unless a future account email-change flow is specified.
- Bio max length: 160 characters.
- Avatar upload max size: 2MB.
- Avatar accepted formats: JPG, PNG, GIF.
- Add `Language` button/control.
- Add `Timezone` button/control.

**Profile Fields:**
```ts
type SettingsProfileFormData = {
  fullName: string
  email: string
  username: string
  avatarUrl?: string | null
  bio?: string
  language: 'pt-BR' | 'en-US'
  timezone: string
}
```

**Language Control:**
- Button label: `Language`.
- Use the same language icon style used in Sign In/Login and Sign Up.
- Options:
  - `🇧🇷 Português` -> `pt-BR`
  - `🇺🇸 English` -> `en-US`
- Selection persists to the same language contract used by Login and Sign Up.
- Settings language change updates `profiles.language` when backend is connected.
- Settings language change also updates `localStorage['redrise:preferred-language']` for public auth screens.
- Login and Sign Up selected language must remain compatible with this Settings control.

**Timezone Control:**
- Button label: `Timezone`.
- Icon: clock icon from `lucide-react`.
- Opens a grouped timezone combobox.
- Use the provided combobox pattern with grouped regions and separators.
- Include all major world-city timezones grouped by region.
- Store selected value as an IANA timezone id, not only display label.

**Timezone Type:**
```ts
type TimezoneOption = {
  value: string // IANA timezone id, e.g. "America/Sao_Paulo"
  label: string // e.g. "(GMT-3) Sao Paulo"
  region: 'Americas' | 'Europe' | 'Africa' | 'Middle East' | 'Asia' | 'Pacific'
}
```

**Required Timezone Groups:**
- Americas: New York, Los Angeles, Chicago, Toronto, Vancouver, Mexico City, Bogota, Lima, Santiago, Buenos Aires, Sao Paulo.
- Europe: London, Dublin, Lisbon, Paris, Berlin, Rome, Madrid, Amsterdam, Zurich, Stockholm, Athens, Istanbul.
- Africa: Casablanca, Lagos, Cairo, Johannesburg, Nairobi.
- Middle East: Dubai, Riyadh, Jerusalem, Doha.
- Asia: Mumbai/New Delhi, Bangkok, Jakarta, Shanghai, Hong Kong, Singapore, Taipei, Tokyo, Seoul.
- Pacific: Perth, Sydney, Melbourne, Auckland.

**Backend Contract Direction:**
- Future `profiles` contract should support `full_name`, `username`, `avatar_url`, `bio`, `language`, and `timezone`.
- If the current table lacks `bio`, future backend micro-task should add it.
- Timezone should persist as IANA id.

---

## Phase 3 - Team Accordion

### Section: Team

**Accordion Title:** `Team`
**Objective:** Group team settings into two nested accordions: Management and Organization.

**Nested Accordions:**
- `Management`
- `Organization`

### Team > Management

**Objective:** Manage organization/team members using the `settings-members5` shadcn block.
**Reference Command:**
```bash
npx shadcn add @shadcnblocks/settings-members5
```

**Roles:**
- `Admin`
- `Owner`
- `Board`
- `User`
- `Viewer`

**User Actions:**
- View member list.
- Invite member.
- Edit member role.
- Remove member.
- See pending invites.
- See role/status badges.

**Data Direction:**
```ts
type SettingsMember = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  role: 'Admin' | 'Owner' | 'Board' | 'User' | 'Viewer'
  status: 'Active' | 'Invited' | 'Suspended'
  joinedAt?: string | null
}
```

### Team > Organization

**Objective:** Provide a detailed organization table showing members, workspace roles, process participation, and organizational scope.
**Reference Command:**
```bash
npx shadcn@latest add @shadcnblocks/data-table14
```

**Data Table Requirements:**
- Member name and avatar.
- Email.
- Global role.
- Workspace roles.
- Processes they participate in.
- Teams/groups.
- Status.
- Last activity.
- Actions menu if needed.

**Data Direction:**
```ts
type OrganizationMemberRow = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
  globalRole: 'Admin' | 'Owner' | 'Board' | 'User' | 'Viewer'
  workspaceRoles: Array<{
    workspaceId: string
    workspaceName: string
    role: 'Admin' | 'Owner' | 'Board' | 'User' | 'Viewer'
  }>
  processes: Array<{
    processId: string
    processName: string
  }>
  teams: string[]
  status: 'Active' | 'Invited' | 'Suspended'
  lastActivityAt?: string | null
}
```

**Table Features:**
- Search by member name/email.
- Filter by global role.
- Filter by workspace.
- Filter by process.
- Sort by name, role, status, last activity.
- Responsive fallback for smaller screens.

---

## Phase 4 - Notification Accordion

### Section: Notification

**Accordion Title:** `Notification`
**Objective:** Add notification preferences to Settings and expose it as a Settings shortcut/submenu.
**Reference Command:**
```bash
npx shadcn add @shadcnblocks/settings-notifications1
```

**Sidebar Requirement:**
- Add `Notification` as a Settings shortcut/submenu.
- It should deep-link to `/settings?section=notification` if Settings is a single page.

**User Actions:**
- Toggle e-mail notifications.
- Toggle in-app notifications.
- Toggle product/activity alerts.
- Toggle team/member updates.
- Toggle workspace/process/action notifications.

**Data Direction:**
```ts
type NotificationSettings = {
  email: boolean
  inApp: boolean
  teamUpdates: boolean
  workspaceUpdates: boolean
  processUpdates: boolean
  actionUpdates: boolean
  productUpdates: boolean
}
```

---

## Phase 5 - Integration Accordion

### Section: Integration

**Accordion Title:** `Integration`
**Objective:** Replace Billing and Limits in the Settings frontend with an integrations settings surface.
**Reference Command:**
```bash
npx shadcn add @shadcnblocks/settings-integrations1
```

**Navigation Changes:**
- Remove `Billing` from Settings submenu and Settings page only.
- Remove `Limits` from Settings submenu and Settings page only.
- Add `Integration` as a Settings shortcut/submenu if child links remain.
- Deep-link to `/settings?section=integration`.

**User Actions:**
- View available integrations.
- View connected integrations.
- Connect integration.
- Disconnect integration.
- Reconnect or update credentials.
- See connection status.

**Data Direction:**
```ts
type SettingsIntegration = {
  id: string
  provider: string
  category: 'communication' | 'storage' | 'automation' | 'ai' | 'analytics' | 'other'
  status: 'Connected' | 'Disconnected' | 'Error'
  connectedBy?: string | null
  connectedAt?: string | null
  lastSyncAt?: string | null
}
```

**Backend Direction:**
- Future backend may reuse/extend existing `integrations` concepts.
- Do not keep Billing/Limits UI in Settings as part of this PRD.
- Preserve Billing/Limits backend artifacts, migrations, Edge Functions, domain libraries, and plan/checkout contracts.
- Billing, plans, and limits are expected to move to the public site or future non-Settings surfaces rather than disappear from the product.

---

## Phase 6 - Micro-Tasks

### Micro-Task 1: Add Accordion Foundation
- Add `accordion` primitive.
- Create single Settings page shell at `/settings`.
- Render top-level accordions: Profile, Team, Notification, Integration.
- Add query-param section opening.
- Keep authenticated AppLayout intact.

### Micro-Task 2: Sidebar Navigation Update
- Rename Settings `General` concept to `Profile`.
- Remove `Billing` and `Limits` from Settings navigation only.
- Add `Notification` shortcut.
- Add `Integration` shortcut.
- Ensure all shortcuts land on `/settings?section=<name>`.

### Micro-Task 3: Profile Block Layout
- Add/adapt `@shadcnblocks/settings-profile1`.
- Replace mock external avatar with local/current profile data.
- Add Full Name, Username, Email, Bio.
- Add avatar upload UI with 2MB max.
- Add Cancel and Save Changes actions.

### Micro-Task 4: Profile Language Control
- Add Language button/control with the same icon style as Login/Sign Up.
- Use `pt-BR` and `en-US` options with flags.
- Sync with `profiles.language` and `localStorage['redrise:preferred-language']` when backend is connected.
- Keep compatibility with PRD7-1 auth language persistence.

### Micro-Task 5: Profile Timezone Control
- Add clock icon Timezone button/control.
- Add grouped combobox for timezones.
- Use IANA timezone ids as values.
- Include all required major-city timezone groups.

### Micro-Task 6: Team Management
- Add/adapt `@shadcnblocks/settings-members5`.
- Implement roles Admin, Owner, Board, User, Viewer.
- Support invite/edit/remove UI states.
- Use typed mock data until final backend contract exists.

### Micro-Task 7: Team Organization Table
- Add/adapt `@shadcnblocks/data-table14`.
- Create organization detail rows.
- Include workspace roles and process participation.
- Add filters/search/sort.

### Micro-Task 8: Notification Preferences
- Add/adapt `@shadcnblocks/settings-notifications1`.
- Add Notification accordion.
- Add Notification sidebar shortcut.
- Use typed mock/client state until backend contract exists.

### Micro-Task 9: Integration Settings
- Add/adapt `@shadcnblocks/settings-integrations1`.
- Add Integration accordion.
- Remove Billing/Limits from Settings frontend surface only.
- Do not delete billing/limits backend artifacts or product contracts.
- Use typed mock/client state until backend contract exists.

### Micro-Task 10: i18n, A11y, and Responsive QA
- Add all visible strings to i18n.
- Validate accordion keyboard interaction.
- Validate combobox keyboard interaction.
- Validate mobile layout for all accordions.
- Validate empty/loading/error states.

### Micro-Task 11: Future Backend Contract Design
- Design profile contract for `bio` and `timezone`.
- Design notification preferences contract.
- Design organization detail read model.
- Design integration settings contract.
- Decide how billing/limits remain available outside Settings.

---

## Phase 7 - i18n Keys

Namespace: `settings.*`.

| Key | en-US | pt-BR |
|---|---|---|
| `settings.title` | `Settings` | `Configurações` |
| `settings.subtitle` | `Manage your profile, team, notifications, and integrations` | `Gerencie seu perfil, equipe, notificações e integrações` |
| `settings.profile.title` | `Profile` | `Perfil` |
| `settings.profile.description` | `Update your personal information and profile picture` | `Atualize suas informações pessoais e foto de perfil` |
| `settings.profile.fullName` | `Full Name` | `Nome completo` |
| `settings.profile.username` | `Username` | `Nome de usuário` |
| `settings.profile.email` | `Email` | `E-mail` |
| `settings.profile.bio` | `Bio` | `Bio` |
| `settings.profile.language` | `Language` | `Idioma` |
| `settings.profile.timezone` | `Timezone` | `Fuso horário` |
| `settings.profile.selectTimezone` | `Select a timezone` | `Selecione um fuso horário` |
| `settings.profile.noTimezones` | `No timezones found.` | `Nenhum fuso horário encontrado.` |
| `settings.actions.cancel` | `Cancel` | `Cancelar` |
| `settings.actions.save` | `Save Changes` | `Salvar alterações` |
| `settings.team.title` | `Team` | `Equipe` |
| `settings.team.management` | `Management` | `Gestão` |
| `settings.team.organization` | `Organization` | `Organização` |
| `settings.notification.title` | `Notification` | `Notificação` |
| `settings.integration.title` | `Integration` | `Integração` |

---

## Phase 8 - Acceptance Criteria

### Settings Structure
- `/settings` is the primary Settings page.
- Settings content is organized as top-level accordions.
- Profile opens by default.
- Query param section deep-links open the correct accordion.
- General is renamed to Profile.
- Billing and Limits are not visible in Settings.
- Billing/Limits backend/domain code remains preserved.
- Notification and Integration are present.

### Profile
- Profile uses/adapts `@shadcnblocks/settings-profile1`.
- Avatar upload supports JPG/PNG/GIF and max 2MB.
- Full Name, Username, Email, and Bio are present.
- Language control matches auth language behavior.
- Timezone control uses grouped combobox with major world-city timezones.
- Timezone value stores IANA id.

### Team
- Team contains nested accordions Management and Organization.
- Management uses/adapts `@shadcnblocks/settings-members5`.
- Roles are Admin, Owner, Board, User, Viewer.
- Organization uses/adapts `@shadcnblocks/data-table14`.
- Organization table shows members, workspace roles, processes, teams, status, and activity.

### Notification
- Notification accordion exists.
- Notification shortcut exists under Settings navigation if child links remain.
- Notification uses/adapts `@shadcnblocks/settings-notifications1`.

### Integration
- Integration accordion exists.
- Integration replaces Billing and Limits only in the Settings frontend.
- Billing, plans, checkout, and limits remain product/backend domains outside this Settings surface.
- Integration uses/adapts `@shadcnblocks/settings-integrations1`.

---

## Phase 9 - Validation

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Targeted ESLint for changed Settings files
- [ ] Manual desktop Settings accordion smoke
- [ ] Manual mobile Settings accordion smoke
- [ ] Manual deep-link smoke for all sections
- [ ] Manual language persistence smoke with Login/Sign Up contract
- [ ] Manual timezone combobox keyboard smoke
- [ ] Manual Team nested accordion smoke
- [ ] Manual Notification shortcut smoke
- [ ] Manual Billing/Limits removal from Settings UI smoke
- [ ] Verify Billing/Limits backend/domain files were not deleted by this PRD implementation

**Known Baseline Blockers:**
- `npm run typecheck` may still fail because `src/lib/workspaces.test.ts` imports `vitest`, which is missing from project dependencies.
- Global `npm run lint` may include broad pre-existing issues outside targeted Settings files.

---

## Files Changed (Expected During Implementation)

### New Files
- `updates/prd9.md` — this PRD.
- Optional new Settings components under `src/components/settings/`.
- Optional `src/lib/timezones.ts` for timezone options.
- Optional `src/types/settings.ts` for Settings-specific typed mock/data contracts.

### Modified Files
- `src/app/(dashboard)/settings/page.tsx` — single accordion Settings page.
- `src/app/(dashboard)/settings/layout.tsx` — simplify/remove subpage layout if needed.
- `src/app/(dashboard)/settings/general/page.tsx` — remove, redirect, or replace with Profile section route compatibility if needed.
- `src/app/(dashboard)/settings/team/page.tsx` — remove, redirect, or fold into `/settings`.
- `src/app/(dashboard)/settings/billing/page.tsx` — remove from Settings navigation; redirect or retire only the route surface if safe.
- `src/app/(dashboard)/settings/limits/page.tsx` — remove from Settings navigation; redirect or retire only the route surface if safe.
- `src/components/nav-main.tsx` — Settings child navigation update.
- `src/components/app-sidebar.tsx` — Settings shortcut/deep-link update if needed.
- `src/i18n/terms.json` or current i18n source — add Settings keys.
- `memory/modules/settings.md` — update after implementation.
- `memory/TASK_LOG.md` — update after implementation/validation.
- `graphify-out/` — refresh after implementation.

---

## Risks & Mitigations

- **shadcnblocks dependency mismatch:** Blocks may reference components not present locally, such as Dice UI file upload. Mitigation: adapt block code to current primitives or add required primitives deliberately.
- **External asset leakage:** Example avatar uses CloudFront. Mitigation: replace with local/current user data or generated fallback.
- **Backend mismatch:** Current backend may not support bio/timezone/notification preferences/org detail. Mitigation: use typed mock/client state for UI PR and create future backend micro-tasks.
- **Accidentally deleting Billing/Limits backend:** Billing, plans, checkout, and limits remain valid product domains handled outside the app Settings surface. Mitigation: remove only Settings frontend navigation/routes; do not delete backend libraries, migrations, Edge Functions, Stripe contracts, or plan/limit logic in this PRD.
- **Role naming conflict:** Current backend role names may differ from Admin/Owner/Board/User/Viewer. Mitigation: define a future role migration/adapter contract.
- **Timezone labels drift with DST:** Static GMT labels can become inaccurate. Mitigation: store IANA timezone ids and treat display labels as initial UI copy; future work can format offsets dynamically.
- **Single page gets too large:** Split accordion content into components while keeping one route.

---

## Pending

- [x] Define single Settings accordion structure — CONCLUIDO
- [x] Define Profile block and language/timezone extensions — CONCLUIDO
- [x] Define Team Management and Organization blocks — CONCLUIDO
- [x] Define Notification block — CONCLUIDO
- [x] Define Integration replacement for Billing/Limits — CONCLUIDO
- [x] Define micro-task breakdown — CONCLUIDO
- [x] Implementacao
- [x] Validacao
