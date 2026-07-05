# Update 7.1 - Auth Layout & Language Contract Adjustment

> Addendum to `prd7.md`. This document narrows and updates the Sign Up and Login layout/language requirements before implementation.

## Overview

Update the Sign Up and Login experiences to follow the shadcn `signup-02` and `login-02` layout patterns. Sign Up must use a single `Full Name` field instead of separate first/middle/last name fields, keep only the password length rule, and add a language selector directly under the Redrise logo. Login must use the matching `login-02` layout and the same language selector behavior. Changing the language should briefly show skeleton loading before rendering the translated UI.

This PRD supersedes the Sign Up field/layout requirements and the Login layout requirements from `prd7.md`. Login authentication behavior, Sidebar Logout, and dashboard guard requirements from `prd7.md` remain valid unless explicitly changed here.

---

## Phase 1 — Specification

### Screen 1: Sign Up (`/signup`)

**Route:** `/signup`
**Objective:** Allow a new user to create a Redrise account with a simplified shadcn `signup-02` layout, language selection, and Supabase-backed account creation.
**Reference Layout:** `npx shadcn@latest add signup-02`
**Access Points:**
- Public route: `/signup`
- Link from Sign In
- External invite links containing `?invited=1&email=...&invite_token=...`

**User Actions:**
- View Redrise logo/brand at the top of the form column
- Select interface language under the logo
- Enter Full Name
- Enter Email
- Enter Password
- Enter Confirm Password
- Submit Create Account
- Navigate to Sign In when account already exists
- See translated UI after changing language
- See skeleton loading briefly while the language changes

**Form Fields:**
- `fullName`: string, required
- `email`: string, required, valid email, prefilled from URL when present
- `password`: string, required, minimum 8 characters
- `confirmPassword`: string, required, must match password
- `language`: enum `'pt-BR' | 'en-US'`, required, selected through the language button/dropdown
- `inviteToken`: string, optional, read from URL query `invite_token`

**Removed Fields From PRD7:**
- `firstName`
- `middleName`
- `lastName`

**Password Rules:**
- Must be at least 8 characters long.

No letter requirement. No number requirement.

**Language Selector:**
- Label/button text: `Select Your Language`
- Position: directly under the Redrise logo/brand in the Sign Up layout
- Options:
  - `🇧🇷 Português` → `pt-BR`
  - `🇺🇸 English` → `en-US`
- Selection changes all Sign Up screen copy to the selected language
- Selection should be reflected in the new account profile/backend contract
- Selection should be saved to local auth UI preference storage so `/login` opens in the same language after signup redirects there
- Language selector should use the same available language options as Settings > General

**Language Change Loading Behavior:**
- When the user selects a different language, the form should briefly enter a skeleton loading state
- Skeleton should replace the text/form content enough to communicate loading without layout jump
- After a brief delay, translated labels/help text/buttons render in the selected language
- The selected language must remain active for the rest of the Sign Up session

**Data Displayed:**
```ts
type SignupFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  language: 'pt-BR' | 'en-US'
  inviteToken?: string
}

type SignupMetadata = {
  full_name: string
  language: 'pt-BR' | 'en-US'
  invite_token?: string
}
```

**States:**
- **Empty:** Full Name, Email, Password, Confirm Password are blank unless invite URL prefills email
- **Invite:** Show invited-account notice when `invited=1` is present
- **Language changing:** Skeleton loading state after selecting a different language
- **Loading:** Submit button disabled with spinner while `signUp()` runs
- **Validation error:** Required fields, invalid email, password shorter than 8 characters, or password mismatch
- **Backend error:** Friendly toast for duplicate email, rate limit, weak password, network failure, or Supabase error
- **Success:** Redirect to `/login?created=1`
- **Authenticated after signup:** Immediately call `supabase.auth.signOut()` before redirecting to `/login?created=1`

**Layout:**
- Pattern: **shadcn signup-02 split layout**
- Left/form column:
  - Redrise logo/brand
  - `Select Your Language` dropdown/button
  - Title: `Create your account`
  - Subtitle: `Fill in the form below to create your account`
  - Full Name field
  - Email field
  - Email helper text
  - Password field
  - Password helper text: `Must be at least 8 characters long.`
  - Confirm Password field
  - Confirm Password helper text
  - Create Account button
  - Divider: `Or continue with`
  - Social provider button remains Coming Soon only
  - Existing account link: `Already have an account? Sign in`
- Right/visual column:
  - Preserve the signup-02 visual split area concept
  - Use Redrise-compatible branding/assets
  - No external CDN assets
- Mobile:
  - Form column should become full width
  - Visual column can collapse or hide according to the signup-02 responsive pattern

---

### Screen 2: Login (`/login`)

**Route:** `/login`
**Objective:** Allow an existing user to sign in with a layout matching shadcn `login-02`, including the same language selector and skeleton translation behavior as Sign Up.
**Reference Layout:** `npx shadcn@latest add login-02`
**Access Points:**
- Public route: `/login`
- Root redirect for unauthenticated users
- Auth guard redirects from dashboard routes
- Link from Sign Up

**User Actions:**
- View Redrise logo/brand at the top of the form column
- Select interface language under the logo
- Enter Email
- Enter Password
- Click Forgot your password link if present
- Submit Login
- Navigate to Sign Up when the user does not have an account
- See translated UI after changing language
- See skeleton loading briefly while the language changes

**Form Fields:**
- `email`: string, required, valid email
- `password`: string, required
- `language`: enum `'pt-BR' | 'en-US'`, required, selected through the language button/dropdown
- `redirectTo`: string, optional, read from URL query `redirectTo`

**Language Selector:**
- Label/button text: `Select Your Language`
- Position: directly under the Redrise logo/brand in the Login layout
- Options:
  - `🇧🇷 Português` → `pt-BR`
  - `🇺🇸 English` → `en-US`
- Selection changes all Login screen copy to the selected language
- Selection should be saved to local auth UI preference storage
- After successful login, the selected Login language should overwrite `profiles.language` for that account
- Language selector should use the same available language options as Settings > General and Sign Up

**Language Change Loading Behavior:**
- When the user selects a different language, the form should briefly enter a skeleton loading state
- Skeleton should replace the text/form content enough to communicate loading without layout jump
- After a brief delay, translated labels/help text/buttons render in the selected language
- The selected language must remain active for the rest of the Login session
- Skeleton must only be triggered by explicit language selection, never by typing or changing the email field

**Data Displayed:**
```ts
type LoginFormValues = {
  email: string
  password: string
  language: 'pt-BR' | 'en-US'
  redirectTo?: string
}
```

**States:**
- **Empty:** Email and Password are blank
- **Created:** Show account-created success notice when URL contains `created=1`
- **Language changing:** Skeleton loading state after selecting a different language
- **Loading:** Submit button disabled with spinner while `signInWithPassword()` runs
- **Validation error:** Required fields or invalid email
- **Backend error:** Friendly toast for invalid credentials, rate limit, network failure, or Supabase error
- **Success:** Redirect to `redirectTo` or `/workstation`

**Layout:**
- Pattern: **shadcn login-02 split layout**
- Left/form column:
  - Redrise logo/brand
  - `Select Your Language` dropdown/button
  - Title: `Login to your account`
  - Subtitle: `Enter your email below to login to your account`
  - Email field
  - Password field
  - Forgot your password link
  - Login button
  - Divider: `Or continue with`
  - Social provider button remains Coming Soon only
  - New account link: `Don't have an account? Sign up`
- Right/visual column:
  - Preserve the login-02 visual split area concept
  - Use Redrise-compatible branding/assets
  - No external CDN assets
- Mobile:
  - Form column should become full width
  - Visual column can collapse or hide according to the login-02 responsive pattern

---

## Phase 1.5 — Component Mapping (shadcn)

| Component | Usage |
|---|---|
| `button` | Create Account, Login, language selector trigger, social provider buttons |
| `card` | Optional if retained by adapted layout; login-02/signup-02 may not require a Card shell |
| `input` | Full Name, Email, Password, Confirm Password |
| `label` | Field labels |
| `required-label` | Required field indicators if consistent with existing auth forms |
| `dropdown-menu` or `select` | Language options |
| `skeleton` | Brief language-change loading state |
| `spinner` | Submit loading state |
| `sonner` | Error/success toasts |
| `separator` | `Or continue with` divider |
| `dialog` | Coming Soon social provider modal |

**shadcn Command Reference:**
```bash
npx shadcn@latest add login-02
npx shadcn@latest add signup-02
```

Use these as layout references. Do not blindly overwrite existing app structure if generated files conflict with the current route/component organization.

---

## Phase 2 — Database & Backend Contract

### Required Contract Adjustment

The previous PRD7 metadata contract assumed separate profile names. This PRD changes signup metadata to a single full name plus language.

**New signup metadata contract:**
```ts
type SignupMetadata = {
  full_name: string
  language: 'pt-BR' | 'en-US'
  invite_token?: string
}
```

### Profile Name Handling

Backend/profile creation must support signup events where only `full_name` is provided.

Options:
- Preferred: update the profile creation trigger/function to parse `full_name` into existing profile fields.
- Acceptable: store `full_name` in the existing first/last name fields using a deterministic split until schema is revisited.

**Recommended parsing behavior:**
```ts
const parts = fullName.trim().split(/\s+/)
const firstName = parts[0] ?? ''
const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ''
const middleName = ''
```

### Language Handling

- Persist selected language to the user profile during signup.
- Existing profile type already supports `language: 'en-US' | 'pt-BR'`.
- Backend trigger/function should read `raw_user_meta_data.language`.
- If language is missing, default to `en-US`.

### Language Persistence Contract

Language has two sources depending on authentication state:

```ts
type PublicAuthLanguagePreference = 'en-US' | 'pt-BR'

const AUTH_LANGUAGE_STORAGE_KEY = 'redrise:preferred-language'
```

- **Authenticated source of truth:** `profiles.language`
- **Public auth screen preference:** `localStorage['redrise:preferred-language']`
- **Default fallback:** `en-US`
- **Do not use browser locale fallback in this PRD**
- **Do not query account/profile language before authentication**
- **Do not query language by email on Login**

Rules:
- Sign Up language selection updates `localStorage['redrise:preferred-language']` immediately.
- Sign Up sends selected language in Supabase Auth metadata as `language`.
- Backend persists Sign Up language into `profiles.language`.
- After Sign Up redirects to `/login?created=1`, Login reads `localStorage['redrise:preferred-language']` and opens in the same language.
- Login language selection updates `localStorage['redrise:preferred-language']` immediately.
- After successful Login, update `profiles.language` to the language selected on the Login screen.
- After the authenticated app loads, Settings > General displays `profiles.language`.
- If Settings > General changes language, update both `profiles.language` and `localStorage['redrise:preferred-language']`.
- Logout must not clear `localStorage['redrise:preferred-language']`.
- If the user is on another device, private window, new browser, or cleared storage, Login starts in English.
- Typing an email on Login must not trigger any backend language lookup.
- Skeleton loading for language must only happen when the user explicitly selects another language from the language control.

Privacy/security rule:
- Never fetch a user's saved account language from email before authentication, because that can leak account existence or profile metadata.

### Invite Handling

- Continue sending `invite_token` when URL contains it.
- Existing external invite flow must continue to work with the new metadata shape.

### Migration Expectation

- A database migration may be required if the current trigger only reads `first_name`, `middle_name`, and `last_name`.
- No new table is expected.
- No frontend-only workaround should be used if the backend contract rejects or drops `full_name`/`language`.

---

## Phase 3 — Frontend

### Files Created
| Path | Purpose |
|---|---|
| None expected | Adapt existing login/signup forms instead of adding parallel auth flows |

### Files Modified
| Path | Purpose |
|---|---|
| `src/components/login-form.tsx` | Replace current Login layout with `login-02`, language selector, skeleton language loading |
| `src/components/signup-form.tsx` | Replace PRD7 field model with `signup-02` layout, Full Name, language selector, skeleton language loading |
| `src/app/(dashboard)/settings/general/page.tsx` | Ensure Settings language changes sync to public auth language preference storage |
| `src/app/(auth)/login/page.tsx` | Pass `redirectTo` and account-created query state if needed |
| `src/app/(auth)/signup/page.tsx` | Pass invite/email query state if needed |
| `src/lib/i18n.ts` or `src/i18n/terms.json` | Add/update Login and Sign Up language strings |
| `src/lib/user-profile.ts` | Align signup/profile assumptions if needed |
| `supabase/migrations/*` | Update profile creation trigger/function if needed |
| `memory/TECHNICAL.md` | Document simplified signup contract and auth language selector behavior |
| `memory/TASK_LOG.md` | Record implementation and validation results |

### i18n Keys
Namespace: `auth.signIn.*`, `auth.signUp.*`, and shared `auth.*`.

| Key | en-US | pt-BR |
|---|---|---|
| `auth.language.select` | `Select Your Language` | `Selecione seu idioma` |
| `auth.language.portuguese` | `🇧🇷 Português` | `🇧🇷 Português` |
| `auth.language.english` | `🇺🇸 English` | `🇺🇸 Inglês` |
| `auth.signIn.title` | `Login to your account` | `Entre na sua conta` |
| `auth.signIn.subtitle` | `Enter your email below to login to your account` | `Digite seu e-mail abaixo para entrar na sua conta` |
| `auth.signIn.submit` | `Login` | `Entrar` |
| `auth.signIn.loading` | `Logging in...` | `Entrando...` |
| `auth.signIn.continueWith` | `Or continue with` | `Ou continue com` |
| `auth.signIn.socialProvider` | `Login with GitHub` | `Entrar com GitHub` |
| `auth.signIn.forgotPassword` | `Forgot your password?` | `Esqueceu sua senha?` |
| `auth.signIn.noAccount` | `Don't have an account?` | `Não tem uma conta?` |
| `auth.signIn.signUp` | `Sign up` | `Cadastre-se` |
| `auth.signIn.created` | `Account created. Sign in to continue.` | `Conta criada. Entre para continuar.` |
| `auth.signIn.invalidCredentials` | `Invalid email or password` | `E-mail ou senha inválidos` |
| `auth.signUp.title` | `Create your account` | `Crie sua conta` |
| `auth.signUp.subtitle` | `Fill in the form below to create your account` | `Preencha o formulário abaixo para criar sua conta` |
| `auth.fullName` | `Full Name` | `Nome completo` |
| `auth.fullNamePlaceholder` | `John Doe` | `João Silva` |
| `auth.email` | `Email` | `E-mail` |
| `auth.emailPlaceholder` | `m@example.com` | `m@exemplo.com` |
| `auth.emailHelp` | `We'll use this to contact you. We will not share your email with anyone else.` | `Usaremos isso para entrar em contato com você. Não compartilharemos seu e-mail com ninguém.` |
| `auth.password` | `Password` | `Senha` |
| `auth.passwordRuleLength` | `Must be at least 8 characters long.` | `Deve ter pelo menos 8 caracteres.` |
| `auth.confirmPassword` | `Confirm Password` | `Confirmar senha` |
| `auth.confirmPasswordHelp` | `Please confirm your password.` | `Confirme sua senha.` |
| `auth.signUp.submit` | `Create Account` | `Criar conta` |
| `auth.signUp.loading` | `Creating account...` | `Criando conta...` |
| `auth.signUp.continueWith` | `Or continue with` | `Ou continue com` |
| `auth.signUp.socialProvider` | `Sign up with GitHub` | `Entrar com GitHub` |
| `auth.signUp.alreadyHaveAccount` | `Already have an account?` | `Já tem uma conta?` |
| `auth.signUp.signIn` | `Sign in` | `Entrar` |
| `auth.signUp.invited` | `Complete your invited account` | `Conclua sua conta convidada` |
| `auth.signUp.success` | `Account created` | `Conta criada` |
| `auth.passwordTooShort` | `Password must be at least 8 characters long.` | `A senha deve ter pelo menos 8 caracteres.` |
| `auth.passwordMismatch` | `Passwords do not match` | `As senhas não coincidem` |
| `auth.requiredField` | `This field is required` | `Este campo é obrigatório` |
| `auth.invalidEmail` | `Enter a valid email` | `Digite um e-mail válido` |

---

## Phase 4 — Acceptance Criteria

### Sign Up Layout
- Sign Up visually follows the shadcn `signup-02` pattern.
- Sign Up has a Redrise logo/brand at the top of the form column.
- Language selector appears directly under the logo/brand.
- The form contains exactly these visible account fields: Full Name, Email, Password, Confirm Password.
- First Name, Middle Name, and Last Name are not shown.
- Mobile layout remains usable and does not require horizontal scrolling.

### Login Layout
- Login visually follows the shadcn `login-02` pattern.
- Login has a Redrise logo/brand at the top of the form column.
- Language selector appears directly under the logo/brand.
- The form contains Email and Password fields.
- Forgot your password link appears beside/near the Password label according to the `login-02` pattern.
- The new-account link reads `Don't have an account? Sign up` in English and the equivalent in Portuguese.
- Mobile layout remains usable and does not require horizontal scrolling.

### Language Selector
- Selector shows Português and English options with Brazil and US flags.
- Selecting a different language triggers a brief skeleton loading state.
- After loading, all Login or Sign Up texts render in the selected language.
- Selected language is included in signup metadata.
- Selected language on Login updates the authenticated account profile after successful login.
- Selected language is stored locally for public auth screens using `redrise:preferred-language`.
- Settings language changes update both `profiles.language` and `redrise:preferred-language`.
- Logout does not clear `redrise:preferred-language`.
- If no local preference exists, Login and Sign Up default to English.
- Login and Sign Up use the same language options and behavior.
- Language options match Settings > General supported languages.

### Sign Up Validation
- Full Name is required.
- Email is required and must be valid.
- Password is required and must be at least 8 characters long.
- Confirm Password is required and must match Password.
- No letter or number password rule is enforced.

### Login Validation
- Email is required and must be valid.
- Password is required.
- Invalid credentials show a friendly translated error.
- Successful login keeps the PRD7 behavior: register active session, load profile, redirect to `redirectTo` or `/workstation`.

### Backend Contract
- Signup sends `full_name` and `language` metadata.
- Backend profile creation handles `full_name` without requiring separate first/middle/last metadata.
- Profile language is persisted as `pt-BR` or `en-US`.
- Login-selected language updates `profiles.language` after authentication.
- Invite token flow continues working.

---

## Phase 5 — Validation

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Manual Login test in English
- [ ] Manual Login test in Portuguese
- [ ] Manual Login language switch skeleton test
- [ ] Manual Login default language test with empty localStorage: English
- [ ] Manual Sign Up test in English
- [ ] Manual Sign Up test in Portuguese
- [ ] Manual Sign Up language switch skeleton test
- [ ] Manual Sign Up to Login language persistence test
- [ ] Manual Login selected language persists to Settings profile test
- [ ] Manual Settings language change persists back to Login after logout test
- [ ] Manual password shorter than 8 validation test
- [ ] Manual password mismatch validation test
- [ ] Manual invalid Login credentials test
- [ ] Manual invite-token signup smoke test
- [ ] Verify profile row stores selected language
- [ ] Verify profile row is populated from Full Name

**Known Baseline Blockers:**
- `npm run typecheck` may still fail because `src/lib/workspaces.test.ts` imports `vitest`, which is missing from project dependencies.
- Global lint may include pre-existing issues outside this PRD scope.

---

## Files Changed (Complete List)

### New Files
- `updates/prd7-1.md` — this PRD addendum

### Modified Files Expected During Implementation
- `src/components/login-form.tsx` — login-02 layout, language selector, skeleton loading
- `src/components/signup-form.tsx` — signup-02 layout, simplified fields, language selector, skeleton loading
- `src/app/(dashboard)/settings/general/page.tsx` — sync Settings language changes to `redrise:preferred-language`
- `src/app/(auth)/login/page.tsx` — redirect/account-created query support if needed
- `src/app/(auth)/signup/page.tsx` — query parameter support if needed
- `src/lib/i18n.ts` or `src/i18n/terms.json` — updated Login and Sign Up translations
- `supabase/migrations/*` — backend contract update for `full_name` and `language` if needed
- `memory/TECHNICAL.md` — updated auth layout/language and signup contract documentation
- `memory/TASK_LOG.md` — validation log
- `graphify-out/` — refreshed graph after implementation

---

## Risks & Mitigations

- **Backend trigger expects split names:** Current trigger may expect `first_name`, `middle_name`, and `last_name`. Mitigation: update trigger/function to accept `full_name` and parse it deterministically.
- **Profile schema lacks `full_name`:** Existing schema may store split fields only. Mitigation: do not add a new column unless required; parse `full_name` into existing fields for compatibility.
- **Language not persisted:** UI language selection could become frontend-only. Mitigation: include `language` in Supabase signup metadata and ensure profile trigger persists it.
- **Login language overrides existing account language:** User-selected Login language is intentionally persisted to `profiles.language` after successful login. Mitigation: make the language selector explicit and keep it directly visible under the logo.
- **Cannot know account language before authentication on a new device:** Without local storage, querying by email would create privacy/account-enumeration risk. Mitigation: default public auth screens to English until user selects a language or authenticates.
- **Settings language and public auth language drift:** Settings could update only `profiles.language` and leave Login stale after logout. Mitigation: Settings language save must also update `redrise:preferred-language`.
- **Skeleton feels artificial:** A too-long delay will feel slow. Mitigation: use a brief transition only, enough to show language change feedback.
- **Generated shadcn code conflicts:** `login-02` and `signup-02` may generate route/component structure not matching this app. Mitigation: use them as visual/layout references and adapt the existing `LoginForm` and `SignupForm`.
- **Login language not persisted:** Login language selection may only affect the current screen before profile load. Mitigation: keep the selected language active for the current auth session, then let profile/settings language become the source of truth after authentication.
- **Flag emoji rendering:** Emoji flags can render differently across platforms. Mitigation: acceptable for MVP; use text fallback if needed.
- **Invite signup regression:** Simplified metadata may accidentally drop invite data. Mitigation: preserve `invite_token` in metadata and smoke test invited signup.

---

## Pending

- [x] Define signup-02 layout requirement — CONCLUÍDO
- [x] Define login-02 layout requirement — CONCLUÍDO
- [x] Define simplified signup fields — CONCLUÍDO
- [x] Define language selector behavior — CONCLUÍDO
- [x] Define language persistence rules — CONCLUÍDO
- [x] Define backend contract adjustment — CONCLUÍDO
- [x] Implementação — CONCLUÍDA localmente
- [ ] Validação manual

## Implementation Result

- Login and Sign Up now use adapted split layouts based on shadcn `login-02` and `signup-02` patterns.
- Public auth language selection defaults to English when `redrise:preferred-language` is absent and only changes after explicit user selection.
- Language selection renders as a globe icon menu with fixed option labels `English` and `Português`; no visible `Select Your Language` title is shown.
- Language changes update `redrise:preferred-language` and briefly render a skeleton state before translated UI appears.
- Sign Up now uses Full Name, Email, Password, Confirm Password, and sends `full_name`, `language`, and optional `invite_token` metadata.
- Login-selected language updates `profiles.language` after successful authentication.
- Settings > General language save syncs `redrise:preferred-language`.
- Migration `047_auth_full_name_language_contract.sql` updates the auth profile trigger for `full_name` parsing and language persistence.
- Migration 047 is intentionally append-only and should not be replaced by editing prior already-applied migrations.
- Sonner uses the local shadcn wrapper with default styling and no forced color customization.
- Validation completed: targeted ESLint for changed PRD7-1 files passed; `npm run build` passed.
- Validation blocker outside PRD7-1: `npm run typecheck` still fails on missing `vitest` for `src/lib/workspaces.test.ts`.
