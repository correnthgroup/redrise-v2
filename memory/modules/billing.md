# Billing

## Current Behavior
- Billing state is persisted in Supabase `billing_subscriptions`.
- Plans UI must read persisted billing state and must not unlock paid features from frontend-only state.
- Stripe checkout starts through `billing-checkout` Edge Function.
- Stripe events are persisted by `billing-webhook`, not by frontend redirects.
- Current plan set is Free and Corporate only.
- Projects create/edit/delete are gated to active or trialing Corporate billing state.

## Source Files
| Concern | Path |
|---|---|
| Billing lib | `src/lib/billing.ts` |
| Billing settings page | `src/app/(dashboard)/settings/billing/page.tsx` |
| Limits lib | `src/lib/limits.ts` |
| Projects lib | `src/lib/projects.ts` |
| Billing checkout function | `supabase/functions/billing-checkout/index.ts` |
| Billing webhook function | `supabase/functions/billing-webhook/index.ts` |
| Billing migration | `supabase/migrations/044_create_billing_subscriptions.sql` |

## Backend / Tables / Functions
- `billing_subscriptions` stores customer, subscription, plan, status, period, and cancellation state.
- `has_active_corporate_plan()` is used for Corporate-gated project writes.
- `billing-checkout` validates authenticated checkout intent.
- `billing-webhook` verifies Stripe signatures and persists checkout/subscription events.

## UI / Routes
- `/settings/billing` shows current plan and starts checkout.
- `/settings/limits` displays usage against plan limits.
- `/projects` and project mutation routes enforce Corporate availability.

## Known Blockers
- Configure Supabase secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price IDs before live checkout smoke.
- Create the Stripe webhook endpoint pointing to `/functions/v1/billing-webhook`.

## Graphify Queries
- `billing subscriptions checkout webhook corporate plan`
- `path billing_subscriptions projects has_active_corporate_plan`
- `billing settings limits stripe edge functions`

## Update Rules
- Update this module after billing schema, Edge Function, Settings Billing, Limits, or plan matrix changes.
- Update `memory/DECISIONS.md` for durable plan or payment decisions.
- Update `memory/modules/supabase.md` after billing migrations or RLS changes.
