# Update 7.0 - Auth Flow Backend Integration (Sign In, Sign Up, Logout)

> Generated via auth/backend alignment session based on the current Supabase backend and the PRD6 structure.

## Overview

Make the current authentication screens work end-to-end with the active Supabase backend. Sign In must create a real Supabase session, register an active session, load profile context, and enter the app. Sign Up must create a real Supabase Auth user with correct profile metadata, support invite-token account creation, and return the user to Sign In. The Sidebar Logout action must terminate the current session and redirect to `/login`.

This update focuses only on the authentication entry and exit flow: `/login`, `/signup`, authenticated dashboard access, and the profile dropdown logout action in the sidebar.

---

## Phase 1 — Specification

### Screen 1: Sign In (`/login`)

**Route:** `/login`
**Objective:** Allow existing users to authenticate with Supabase email/password and enter the dashboard.
**Access Points:**
- Public route: `/login`
- Root redirect for unauthenticated users
- Auth guard redirects from dashboard routes
- Link from Sign Up

**User Actions:**
- Enter email
- Enter password
- Toggle Remember Me
- Submit Sign In
- See friendly validation and backend errors
- Open Apple/Google Coming Soon dialog
- Navigate to Sign Up
- If already authenticated, redirect to `/workstation`

**Data Displayed:**
```ts
// Supabase Auth session
type AuthSession = {
  user: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
  }
  access_token: string
}

// From src/lib/user-profile.ts
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
```

**States:**
- **Empty:** N/A — this is an input form
- **Loading:** Button disabled with spinner while `signInWithPassword()` and session registration run
- **Error:** Toast (sonner) with retry by resubmitting the form
- **Invalid credentials:** Friendly error message without exposing backend details
- **Authenticated:** Redirect to `redirectTo` query parameter or `/workstation`
- **Supabase unavailable:** Friendly error, no app crash

**Forms:**
- Fields:
  - `email`: string, required, valid email
  - `password`: string, required
  - `remembered`: boolean, optional
- Validation:
  - Email must be present and valid
  - Password must be present
- Submit:
  - Calls `supabase.auth.signInWithPassword({ email, password })`
  - Calls `registerActiveSession()` from `src/lib/user-profile.ts`
  - Calls `loadUserProfile()` from `src/lib/user-profile.ts`
  - Redirects to `redirectTo` or `/workstation`

**Layout:**
- Pattern: **Auth Card Form**
- Keep current centered auth layout from `src/app/(auth)/layout.tsx`
- Keep current shadcn Card structure
- Use `RequiredLabel` for required fields
- Use existing i18n patterns from `src/lib/i18n.ts` or `src/i18n/terms.json`
- Apple and Google buttons remain visible but open Coming Soon dialog; no real OAuth in this PRD

---

### Screen 2: Sign Up (`/signup`)

**Route:** `/signup`
**Objective:** Allow new users to create a Supabase Auth account with complete profile metadata, then return to Sign In.
**Access Points:**
- Public route: `/signup`
- Link from Sign In
- External invite links containing `?invited=1&email=...&invite_token=...`

**User Actions:**
- Enter First Name
- Enter optional Middle Name
- Enter Last Name
- Enter Email
- Enter Password
- Enter Confirm Password
- See password rule feedback
- Submit Create Account
- See friendly validation and backend errors
- Open Apple/Google Coming Soon dialog
- Navigate back to Sign In
- If already authenticated, redirect to `/workstation`

**Data Displayed:**
```ts
type SignupMetadata = {
  first_name: string
  middle_name?: string
  last_name: string
  full_name: string
  invite_token?: string
}
```

**States:**
- **Empty:** Form fields are blank unless URL includes prefilled `email`
- **Invite:** Show invited-account notice when `invited=1` is present
- **Loading:** Button disabled with spinner while `signUp()` runs
- **Validation error:** Toast or inline feedback for required fields, invalid email, password rules, and mismatch
- **Backend error:** Friendly toast for duplicate email, weak password, rate limits, or network failure
- **Success:** Redirect to `/login?created=1`
- **Authenticated after signup:** Immediately call `supabase.auth.signOut()` before redirecting to `/login?created=1`

**Forms:**
- Fields:
  - `firstName`: string, required, min 2 chars
  - `middleName`: string, optional
  - `lastName`: string, required, min 2 chars
  - `email`: string, required, valid email, prefilled from URL when present
  - `password`: string, required
  - `confirmPassword`: string, required
- Password validation:
  - Minimum 8 characters
  - At least one letter
  - At least one number
  - Confirmation must match
- Submit:
  - Calls `supabase.auth.signUp({ email, password, options: { data } })`
  - Sends `first_name`, `middle_name`, `last_name`, and `full_name` metadata
  - Sends `invite_token` metadata when present in URL
  - Calls `supabase.auth.signOut()` after successful signup
  - Redirects to `/login?created=1`

**Layout:**
- Pattern: **Auth Card Form**
- Keep current centered auth layout
- Add Middle Name between First Name and Last Name
- Use `RequiredLabel` for First Name, Last Name, Email, Password, Confirm Password
- Show password rules below Password field
- Do not show "check your email" copy because current backend flow does not require email confirmation
- Apple and Google buttons remain Coming Soon only

---

### Screen 3: Authenticated Dashboard Guard

**Route Group:** `(dashboard)`
**Objective:** Prevent unauthenticated users from accessing authenticated dashboard routes.
**Access Points:**
- `/workstation`
- `/projects`
- `/agents`
- `/documentation`
- `/settings`
- all dashboard sub-routes

**User Actions:**
- Open a dashboard route while signed out
- Get redirected to `/login?redirectTo=<current-path>`
- Sign in successfully
- Return to the original destination

**Data Displayed:**
```ts
type DashboardSessionState =
  | { status: 'checking' }
  | { status: 'authenticated'; userId: string }
  | { status: 'unauthenticated' }
```

**States:**
- **Checking:** Minimal loading state before rendering dashboard content
- **Unauthenticated:** Redirect to `/login`
- **Authenticated:** Render `AppLayout` and route children
- **Session error:** Redirect to `/login` and clear local Supabase session state if needed

**Forms:**
- No forms

**Layout:**
- Keep Sidebar + Breadcrumb invariant for authenticated users
- Do not render dashboard content before session check completes
- Use a client-side guard in this PRD; do not introduce SSR middleware or `@supabase/ssr`

---

### Screen 4: Sidebar Logout

**Component:** `src/components/nav-user.tsx`
**Objective:** Make the profile dropdown `Log out` action terminate the active user session.
**Access Points:**
- Sidebar profile button
- Profile dropdown menu item: `Log out`

**User Actions:**
- Click profile in sidebar
- Click `Log out`
- Current active session is revoked when possible
- Supabase session is signed out
- User is redirected to `/login`

**Data Mutated:**
```ts
// From src/lib/user-profile.ts
revokeCurrentActiveSession()
supabase.auth.signOut()
```

**States:**
- **Idle:** Logout menu item is available
- **Loading:** Logout item disabled while sign-out runs
- **Success:** Redirect to `/login`
- **Failure:** Toast with generic logout error

**Forms:**
- No forms

**Layout:**
- Keep existing dropdown menu
- Make Account route to `/settings/general`
- Make Billing route to `/settings/billing`
- Notifications route remains unchanged unless a real notifications route exists

---

## Phase 1.5 — Component Mapping (shadcn)

All installed shadcn components mapped to Auth usage. ✓ = used in this PRD, — = not applicable.

| # | Component | Sign In | Sign Up | Guard | Logout | Usage Context |
|---|-----------|---------|---------|-------|--------|---------------|
| 1 | `avatar` | — | — | — | ✓ | Sidebar profile display |
| 2 | `badge` | — | — | — | — | Not needed |
| 3 | `button` | ✓ | ✓ | — | ✓ | Submit actions, OAuth coming soon, logout action |
| 4 | `card` | ✓ | ✓ | — | — | Auth form containers |
| 5 | `separator` | ✓ | ✓ | — | ✓ | Auth provider divider, dropdown sections |
| 6 | `input` | ✓ | ✓ | — | — | Email, password, name fields |
| 7 | `label` | ✓ | ✓ | — | — | Form field labels |
| 8 | `required-label` | ✓ | ✓ | — | — | Required form indicators |
| 9 | `textarea` | — | — | — | — | Not needed |
| 10 | `select` | — | — | — | — | Not needed |
| 11 | `native-select` | — | — | — | — | Not needed |
| 12 | `calendar` | — | — | — | — | Not needed |
| 13 | `checkbox` | ✓ | — | — | — | Remember Me |
| 14 | `switch` | — | — | — | — | Not needed |
| 15 | `slider` | — | — | — | — | Not needed |
| 16 | `tabs` | — | — | — | — | Not needed |
| 17 | `table` | — | — | — | — | Not needed |
| 18 | `sheet` | — | — | — | — | Not needed |
| 19 | `dialog` | ✓ | ✓ | — | — | Coming Soon for OAuth providers |
| 20 | `alert-dialog` | — | — | — | — | Not needed |
| 21 | `dropdown-menu` | — | — | — | ✓ | Sidebar profile actions |
| 22 | `context-menu` | — | — | — | — | Not needed |
| 23 | `popover` | — | — | — | — | Not needed |
| 24 | `tooltip` | — | — | — | — | Optional only |
| 25 | `command` | — | — | — | — | Not needed |
| 26 | `skeleton` | — | — | ✓ | — | Guard loading state if needed |
| 27 | `spinner` | ✓ | ✓ | ✓ | ✓ | Submit/loading indicators |
| 28 | `sonner` | ✓ | ✓ | — | ✓ | Success/error toasts |
| 29 | `empty` | — | — | — | — | Not needed |
| 30 | `progress` | — | — | — | — | Not needed |
| 31 | `scroll-area` | — | — | — | — | Not needed |
| 32 | `collapsible` | — | — | — | — | Not needed |
| 33 | `toggle` | — | — | — | — | Not needed |
| 34 | `toggle-group` | — | — | — | — | Not needed |
| 35 | `menubar` | — | — | — | — | Not needed |
| 36 | `breadcrumb` | — | — | ✓ | — | Already in AppLayout after auth passes |
| 37 | `sidebar` | — | — | ✓ | ✓ | Already in AppLayout; profile logout lives here |
| 38 | `kbd` | — | — | — | — | Not needed |
| 39 | `input-group` | — | — | — | — | Not needed |
| 40 | `chart` | — | — | — | — | Not needed |
| 41 | `item` | — | — | — | — | Not needed |
| 42 | `background-gradient` | — | — | — | — | Not needed |
| 43 | `back-button` | — | — | — | — | Not needed |
| 44 | `required-label` | ✓ | ✓ | — | — | Required form indicators |

**Summary:** 13 of 44 components used directly or indirectly in this PRD.

**Components NOT used in Auth (with rationale):**
- `badge` — auth does not need status labels in MVP
- `textarea` — no long-form text input
- `select` / `native-select` — no dropdown fields
- `calendar` — no date selection in auth flow
- `switch` / `slider` — no preferences in auth forms
- `tabs` — Sign In and Sign Up are separate routes
- `table` — no tabular auth data
- `sheet` — no lateral auth panel
- `alert-dialog` — errors are handled by toast/form feedback
- `context-menu` / `popover` / `command` — not needed
- `empty` / `progress` / `scroll-area` / `collapsible` — not needed
- `toggle` / `toggle-group` / `menubar` / `kbd` / `input-group` / `chart` / `item` / `background-gradient` / `back-button` — not needed

---

## Phase 2 — Database & Backend

### Sign In
- No new migrations
- Uses existing Supabase Auth email/password
- Uses existing `active_sessions` table through `registerActiveSession()`
- Uses existing `profiles` table through `loadUserProfile()`
- Uses existing `team_members` profile/team context where applicable

### Sign Up
- No new migrations expected
- Uses existing Supabase Auth signup
- Uses existing profile trigger `create_profile_for_auth_user()`
- Sends metadata expected by the trigger:
  - `first_name`
  - `middle_name`
  - `last_name`
  - `full_name`
  - `invite_token` when present
- Existing external invite acceptance flow should activate pending invite when `invite_token` is valid
- Email confirmation remains disabled for this PRD unless production backend settings change

### Dashboard Guard
- No new migrations
- Session is checked through `supabase.auth.getSession()`
- Route protection is client-side only in this PRD
- SSR middleware with `@supabase/ssr` is out of scope

### Logout
- No new migrations
- Uses existing Supabase Auth `signOut()`
- Revokes current row in `active_sessions` when helper exists or can be minimally added to `src/lib/user-profile.ts`

---

## Phase 3 — Frontend

### Files Created
| Path | Purpose |
|---|---|
| None expected | This PRD should use existing auth routes and components |

### Files Modified
| Path | Purpose |
|---|---|
| `src/components/login-form.tsx` | Wire form to Supabase Auth sign-in, active session registration, profile loading, redirects, errors |
| `src/components/signup-form.tsx` | Wire form to Supabase Auth sign-up, metadata, invite token, password rules, post-signup sign-out |
| `src/components/nav-user.tsx` | Make Logout action functional and route Account/Billing to real settings pages |
| `src/app/(dashboard)/layout.tsx` | Add authenticated route guard before rendering AppLayout |
| `src/app/page.tsx` | Redirect based on current auth state or preserve existing redirect if guard handles unauthenticated users |
| `src/app/(auth)/login/page.tsx` | Pass/consume `redirectTo` and account-created state if needed |
| `src/app/(auth)/signup/page.tsx` | Pass/consume invite query parameters if needed |
| `src/lib/user-profile.ts` | Export or adjust active-session revoke helper only if needed |
| `src/lib/i18n.ts` or `src/i18n/terms.json` | Add missing auth/logout keys |
| `tests/auth.setup.ts` | Update auth setup for current Next/npm/Supabase flow |
| `tests/smoke-unauth.spec.ts` | Update public auth smoke tests |
| `playwright.config.ts` | Align baseURL and dev server command if outdated |

### shadcn Commands
```bash
# No new shadcn components expected.
# Verify these already exist before adding anything:
npx shadcn@latest add checkbox       # only if Remember Me needs checkbox and it is missing
npx shadcn@latest add dialog         # only if Coming Soon dialog is missing
npx shadcn@latest add dropdown-menu  # already expected for sidebar profile menu
```

### i18n Keys
Namespace: `auth.*` and `navUser.*` in the existing i18n source.

| Key | en-US | pt-BR |
|---|---|---|
| `auth.signIn.title` | `Sign in` | `Entrar` |
| `auth.signIn.subtitle` | `Welcome back to Redrise` | `Bem-vindo de volta ao Redrise` |
| `auth.signIn.submit` | `Sign in` | `Entrar` |
| `auth.signIn.loading` | `Signing in...` | `Entrando...` |
| `auth.signIn.success` | `Signed in successfully` | `Login realizado com sucesso` |
| `auth.signIn.error` | `Unable to sign in` | `Não foi possível entrar` |
| `auth.signIn.invalidCredentials` | `Invalid email or password` | `E-mail ou senha inválidos` |
| `auth.signIn.rememberMe` | `Remember me` | `Lembrar de mim` |
| `auth.signIn.created` | `Account created. Sign in to continue.` | `Conta criada. Entre para continuar.` |
| `auth.signUp.title` | `Create account` | `Criar conta` |
| `auth.signUp.subtitle` | `Start using Redrise` | `Comece a usar o Redrise` |
| `auth.signUp.submit` | `Create account` | `Criar conta` |
| `auth.signUp.loading` | `Creating account...` | `Criando conta...` |
| `auth.signUp.success` | `Account created` | `Conta criada` |
| `auth.signUp.error` | `Unable to create account` | `Não foi possível criar a conta` |
| `auth.signUp.invited` | `Complete your invited account` | `Conclua sua conta convidada` |
| `auth.firstName` | `First Name` | `Nome` |
| `auth.middleName` | `Middle Name` | `Nome do Meio` |
| `auth.lastName` | `Last Name` | `Sobrenome` |
| `auth.email` | `Email` | `E-mail` |
| `auth.password` | `Password` | `Senha` |
| `auth.confirmPassword` | `Confirm Password` | `Confirmar Senha` |
| `auth.passwordRuleLength` | `At least 8 characters` | `Pelo menos 8 caracteres` |
| `auth.passwordRuleLetter` | `At least one letter` | `Pelo menos uma letra` |
| `auth.passwordRuleNumber` | `At least one number` | `Pelo menos um número` |
| `auth.passwordMismatch` | `Passwords do not match` | `As senhas não coincidem` |
| `auth.requiredField` | `This field is required` | `Este campo é obrigatório` |
| `auth.invalidEmail` | `Enter a valid email` | `Digite um e-mail válido` |
| `auth.providerComingSoon.title` | `Coming soon` | `Em breve` |
| `auth.providerComingSoon.description` | `This sign-in provider is not available yet.` | `Este provedor de login ainda não está disponível.` |
| `navUser.logout` | `Log out` | `Sair` |
| `navUser.loggingOut` | `Logging out...` | `Saindo...` |
| `navUser.logoutError` | `Unable to log out` | `Não foi possível sair` |
| `navUser.account` | `Account` | `Conta` |
| `navUser.billing` | `Billing` | `Faturamento` |

### Audit & Sessions
- **Sign In:** Register active session with user id, session id/device metadata if available, and `remembered` preference
- **Sign Up:** No audit event required before the account has a complete app context
- **Dashboard Guard:** No audit event; route protection only
- **Logout:** Revoke current active session if helper/table supports it, then call `supabase.auth.signOut()`

---

## Phase 4 — Validation

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Targeted lint for changed auth files
- [ ] Manual Sign Up smoke test
- [ ] Manual Sign In smoke test
- [ ] Manual Sidebar Logout smoke test
- [ ] Manual unauthenticated dashboard redirect smoke test

**Known Baseline Blockers:**
- `npm run typecheck` currently fails because `src/lib/workspaces.test.ts` imports `vitest`, which is missing from project dependencies.
- Global `npm run lint` may include pre-existing baseline issues outside this PRD scope.
- Playwright config/tests may need alignment with current Next/npm commands and port before reliable E2E execution.

---

## Files Changed (Complete List)

### New Files
- None expected for implementation

### Modified Files
- `src/components/login-form.tsx` — real Supabase Sign In flow
- `src/components/signup-form.tsx` — real Supabase Sign Up flow with metadata and invite token
- `src/components/nav-user.tsx` — real Logout flow and settings links
- `src/app/(dashboard)/layout.tsx` — authenticated route guard
- `src/app/page.tsx` — root auth-aware redirect if needed
- `src/app/(auth)/login/page.tsx` — redirect/account-created query handling if needed
- `src/app/(auth)/signup/page.tsx` — invite query handling if needed
- `src/lib/user-profile.ts` — active session revoke helper only if needed
- `src/lib/i18n.ts` or `src/i18n/terms.json` — missing auth/logout keys
- `tests/auth.setup.ts` — update E2E auth setup
- `tests/smoke-unauth.spec.ts` — update unauthenticated smoke coverage
- `playwright.config.ts` — update E2E config if outdated
- `memory/TECHNICAL.md` — document final auth flow
- `memory/TASK_LOG.md` — record validation and implementation results
- `graphify-out/` — refresh knowledge graph after implementation

---

## Risks & Mitigations

- **Email confirmation setting mismatch:** If Supabase email confirmation is enabled remotely, signup may not create an immediately usable password session. Mitigation: verify Supabase Auth settings before implementation and adjust success copy only if required.
- **Automatic session after signup:** Supabase can return a session immediately after `signUp()`. Mitigation: always call `supabase.auth.signOut()` after successful signup and before redirecting to `/login?created=1`.
- **Invite token not accepted:** Invite activation depends on backend trigger/function behavior. Mitigation: include `invite_token` in metadata and smoke test a real invite URL.
- **Profile trigger metadata mismatch:** If trigger expects different key names, profile names may be blank. Mitigation: verify current trigger/migration before implementation; use `first_name`, `middle_name`, `last_name`, `full_name` unless backend says otherwise.
- **Client-side guard flash:** Dashboard may briefly show before redirect if guard is implemented incorrectly. Mitigation: render a checking state until `getSession()` resolves.
- **Logout partial failure:** Active-session revoke could fail while Supabase signOut succeeds. Mitigation: attempt revoke first, but always call `signOut()` and redirect after best-effort cleanup.
- **Redirect loops:** Auth pages and dashboard guard can fight each other if redirects are not centralized. Mitigation: define route rules explicitly and test `/`, `/login`, `/signup`, `/workstation` signed in and signed out.
- **localStorage regression:** Auth/domain state must not be added to `localStorage`. Mitigation: rely on Supabase session storage and existing UI preference storage only.

---

## Pending

- [x] Define Sign In requirements — CONCLUÍDO
- [x] Define Sign Up requirements — CONCLUÍDO
- [x] Define Dashboard Guard requirements — CONCLUÍDO
- [x] Define Sidebar Logout requirements — CONCLUÍDO
- [x] Implementação — CONCLUÍDA localmente
- [ ] Validação manual

## Implementation Result

- `/login` now uses Supabase Auth, active-session registration, profile loading, Remember Me, friendly errors, account-created notice, and `redirectTo` handling.
- `/signup` now sends complete profile metadata plus optional `invite_token`, supports invite e-mail prefill/notice, validates password rules, signs out after signup, and redirects to `/login?created=1`.
- `(dashboard)/layout.tsx` now checks Supabase session client-side before rendering authenticated layout and redirects signed-out users to `/login?redirectTo=<current-path>`.
- Sidebar profile Logout now revokes current `active_sessions` best-effort, signs out through Supabase Auth, and redirects to `/login`; Account and Billing route to real Settings pages.
- Validation completed: targeted ESLint for changed PRD7 files passed; `npm run build` passed.
- Validation blockers outside PRD7: `npm run typecheck` still fails on missing `vitest` for `src/lib/workspaces.test.ts`; full `npm run lint` still fails on existing baseline errors outside the PRD7 changed files.
