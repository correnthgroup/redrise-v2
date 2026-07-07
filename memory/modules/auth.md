# Auth

## Current Behavior

- Routes: `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`.
- Legacy `/login` and `/signup` redirect to the new routes.
- Forms live in `src/domains/auth/components/`.
- Schemas live in `src/domains/auth/schemas/auth.schemas.ts`.
- Supabase Auth is used for sign-in, sign-up, reset e-mail, and password update foundation.
- Social login/signup are removed.
- Sonner handles global action success/error feedback.

## Source Files

| Concern | Path |
|---|---|
| Auth routes | `src/app/(auth)/` |
| Auth domain | `src/domains/auth/` |
| Supabase browser client | `src/lib/supabase.ts` |
| Supabase server client | `src/lib/supabase-server.ts` |

## Pending

- Final My Business creation persistence.
- Final onboarding/setup flow.
- Final transactional e-mail provider behavior.
