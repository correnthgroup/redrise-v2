# PROMPT_GUIDE

This root file is intentionally a short current template. Detailed prompt, PR, review, component, i18n, audit, notification, and deliverables guidance lives in `docs/PR_GUIDE.md`.

## Recommended Prompt

```txt
Leia AGENTS.md e execute conforme o roteamento dele. Nao resuma o AGENTS.md.

Task: <describe the concrete change>
Domain: <auth | settings | billing | workstation | agents | supabase | testing-deploy>
Acceptance: <what must be true when finished>
Validation: <commands or manual checks expected>
```

## Current Stack Reminder

- Next.js 16, React 19, TypeScript ~5.7, Tailwind CSS v4, npm.
- shadcn UI primitives live under `src/components/ui/` and use the local Radix/base-nova style.
- Supabase is the source of truth for domain data.
- Use `docs/PR_GUIDE.md` for full review and implementation checklist.
