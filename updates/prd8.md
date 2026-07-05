# Update 8.0 - Context Stack, Agent Routing, and Memory Consolidation

> PRD for reorganizing Redrise project context so agents can start from `AGENTS.md`, load only the context needed for the task, and avoid stale or contradictory documentation.

## Overview

Create a four-level context stack for Redrise: a short boot file, a context router, focused module maps, and graphify for deep traversal. Update `AGENTS.md` so future prompts can say `Read AGENTS.md. <instruction>` and agents will know which context files, graph queries, and source files to consult based on task complexity.

This update is documentation/information-architecture work. It should reduce token usage, remove stale guidance, and make context refresh predictable before and after code or architecture changes.

---

## Diagnosis

- `memory/` is useful, but `memory/TECHNICAL.md` is too long for quick task startup.
- `graphify-out/` is working and currently reports approximately `2187 nodes`, `3990 edges`, `222 communities`, and `0` token cost.
- `graphify-out/GRAPH_REPORT.md` still has generic community labels such as `Community 1`, which weakens conceptual navigation.
- Semantic extraction for docs is pending without `GEMINI_API_KEY` or `GOOGLE_API_KEY`, so the graph is strong for structure/AST and weaker for product intent.
- There is memory drift: `memory/CONTEXT.md`, `PR_GUIDE.md`, and `PROMPT_GUIDE.md` still contain outdated package-manager/stack guidance, while `AGENTS.md` and current project rules use npm, Next.js 16, React 19, Tailwind v4, and shadcn/Radix/base-nova style.
- There are duplicate or overlapping context files, including root `PR_GUIDE.md`, `docs/PR_GUIDE.md`, `PROMPT_GUIDE.md`, `AGENTS.md`, and `memory/AGENTS.md`.

---

## Phase 1 — Specification

### Context Layer 1: `memory/BOOT.md`

**Objective:** Provide a 50-100 line file read first for almost every task.

**Contents:**
- Current stack
- Current commands
- Sources of truth
- Critical rules
- Current product state
- Real current blockers
- Current Supabase/Render/project refs
- Current memory/graph update expectations

**Rules:**
- Must be concise enough to read every time.
- Must not become another encyclopedia.
- Must cite deeper files for detail instead of duplicating them.
- Must reflect current stack: Next.js 16, React 19, TypeScript ~5.7, Tailwind v4, npm, Supabase, Render.

---

### Context Layer 2: `memory/INDEX.md`

**Objective:** Route agents to the correct context and graph queries by task type/domain.

**Required Routing Examples:**
- Auth task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/auth.md`
  - Inspect `src/components/login-form.tsx`, `src/components/signup-form.tsx`, `src/lib/user-profile.ts`, `src/lib/supabase.ts`
  - Use graphify query: `auth flow login signup profile active sessions`
- Billing task:
  - Read `memory/BOOT.md`
  - Read `memory/DECISIONS.md`
  - Read `memory/modules/billing.md`
  - Inspect billing migrations/functions/libs
  - Use graphify query: `billing subscriptions checkout webhook corporate plan`
- Settings task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/settings.md`
  - Inspect settings pages, team/profile/billing libs
  - Use graphify query: `settings general team billing limits profile language`
- Workstation task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/workstation.md`
  - Use graphify query: `workstation workspace flows tasks actions`
- Agents task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/agents.md`
  - Use graphify query: `agents models engine analytics tasks execution`
- Supabase/schema task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/supabase.md`
  - Inspect relevant migrations and Edge Functions
  - Use graphify query/path for affected tables/functions
- Testing/deploy task:
  - Read `memory/BOOT.md`
  - Read `memory/modules/testing-deploy.md`
  - Inspect `package.json`, Playwright config, Render config, Supabase deploy notes

**Task Complexity Routing:**
- Technical question only, no code change:
  - Read `AGENTS.md`, `memory/BOOT.md`, and the specific `memory/modules/*.md` file if needed.
  - Use graphify query only if the question spans multiple files or asks about relationships.
  - Do not update memory/graph unless the answer discovers a factual drift.
- Point fix or fine adjustment:
  - Read `AGENTS.md`, `memory/BOOT.md`, `memory/INDEX.md`, and the specific files named by the prompt.
  - Use grep/glob before broad graph traversal.
  - Update only affected memory files if product behavior, schema, architecture, commands, or source-of-truth facts changed.
- Medium feature or cross-file change:
  - Read `AGENTS.md`, `memory/BOOT.md`, `memory/INDEX.md`, relevant module map, and graphify query output.
  - Update memory and graph after changes.
- Architecture/schema/billing/auth/deploy change:
  - Read `AGENTS.md`, `memory/BOOT.md`, `memory/INDEX.md`, `memory/DECISIONS.md`, relevant module map, relevant migrations/functions, and graphify path/explain output.
  - Update memory, graph, and task log after changes.

---

### Context Layer 3: `memory/modules/*.md`

**Objective:** Break the long `memory/TECHNICAL.md` into focused maps.

**Required Module Files:**
- `memory/modules/auth.md`
- `memory/modules/settings.md`
- `memory/modules/billing.md`
- `memory/modules/workstation.md`
- `memory/modules/agents.md`
- `memory/modules/supabase.md`
- `memory/modules/testing-deploy.md`

**Module Format:**
```md
# <Module Name>

## Current Behavior
- One fact per line.
- Cite source paths.

## Source Files
| Concern | Path |
|---|---|

## Backend / Tables / Functions
- Relevant Supabase tables, migrations, Edge Functions, RLS, triggers.

## UI / Routes
- Relevant App Router paths and components.

## Known Blockers
- Current issues only.

## Graphify Queries
- Suggested queries/path/explain prompts.

## Update Rules
- What to update after changing this module.
```

**Rules:**
- Modules must be concise and factual.
- Modules must cite source files, not duplicate implementation details.
- `memory/TECHNICAL.md` should become an index/overview instead of the only encyclopedic map.

---

### Context Layer 4: `graphify-out/`

**Objective:** Keep graphify as the deep traversal layer for architecture and cross-file questions.

**Use For:**
- What calls X?
- What is the path between billing and projects?
- Which files connect settings/team to Supabase?
- Which abstractions are god nodes?
- Which modules form a cross-file workflow?

**Required Updates:**
- Rename generic graphify communities to useful labels where supported by `.graphify_labels.json` or graphify workflow.
- Keep `graphify-out/GRAPH_REPORT.md` useful for navigation.
- Run graph updates after relevant code, architecture, schema, flow, or product behavior changes.
- Semantic extraction with Gemini should be occasional, not required for every graph update.

---

## Phase 2 — `AGENTS.md` Routing Guide

### Objective

Update root `AGENTS.md` so agents can start from it and know exactly how to gather context based on prompt type.

### Required Sections

`AGENTS.md` must include:
- Current stack and commands.
- Context startup rules.
- Task complexity routing.
- Domain routing table.
- Operational execution rule: do not summarize `AGENTS.md` unless explicitly asked.
- Graphify usage rules.
- Memory update rules at the end of work.
- Rules for deleting stale/ambiguous context files after consolidation.
- Pointer to `memory/BOOT.md` and `memory/INDEX.md`.
- Pointer to PR/prompt guidance now consolidated from `PR_GUIDE.md` and `PROMPT_GUIDE.md`.

### Operational Router Rule

`AGENTS.md` should be an operational router, not a narrative reference document. It should tell an agent what to do next based on the user's request type.

Required behavior:
- If a prompt says `Read AGENTS.md`, `Leia AGENTS.md`, or equivalent, the agent must treat `AGENTS.md` as instructions to execute, not as content to summarize.
- The agent must not summarize `AGENTS.md` unless the user explicitly asks for a summary.
- The agent must classify the task first, then read the context files indicated by the routing table.
- The agent must execute the user's actual task after loading the routed context.
- The final answer should report outcome, changed files, validation, and blockers; it should not restate the full context that was read.

Recommended text to include in `AGENTS.md`:

```md
## Execution Rule

If the prompt says "Read AGENTS.md", "Leia AGENTS.md", or equivalent, do not summarize this file unless the user explicitly asks for a summary.

Instead:
1. Classify the user's task.
2. Read the routed context files.
3. Execute the requested task.
4. Report only outcome, changed files, validation, and blockers.
```

Recommended prompt pattern for users:

```txt
Leia AGENTS.md e execute conforme o roteamento dele. Não resuma o AGENTS.md. <tarefa>
```

Short prompt pattern:

```txt
Leia AGENTS.md e execute conforme o roteamento dele: <tarefa>
```

### End-Of-Work Update Rules

For any prompt that changes code, schema, app structure, commands, product behavior, deploy behavior, permissions, or architecture, agents must update the affected context files before finishing.

**Required update checklist:**
- Update `memory/BOOT.md` if stack, commands, source-of-truth rules, blockers, or current state changed.
- Update `memory/INDEX.md` if routing, module ownership, or recommended graph queries changed.
- Update affected `memory/modules/*.md` file when behavior/source files/backend contracts changed.
- Update `memory/DECISIONS.md` when a durable product/technical decision was made.
- Update `memory/HANDOFF.md` when there is a new blocker, next step, or incomplete work.
- Update `memory/TASK_LOG.md` with what changed, validation run, blockers, and graph status.
- Update `AGENTS.md` if operating rules, commands, or context routing changed.
- Run `python -m graphify update . --force` after relevant code/architecture/schema/product changes.
- If graph update cannot run, record the reason in `memory/TASK_LOG.md` or `memory/HANDOFF.md`.

---

## Phase 3 — PR/Prompt Guidance Consolidation

### Objective

The content from `PR_GUIDE.md` and `PROMPT_GUIDE.md` must remain available, but it must be aligned with the current stack and routed through the new context system.

### Required Consolidation

- Preserve useful PR body template, review checklist, component usage guidance, i18n checklist, audit/notification rules, and deliverables guidance.
- Update stale stack facts:
  - Next.js 16, not Next.js 15
  - React 19
  - Tailwind CSS v4, not v3
  - npm, not pnpm/Yarn/Corepack for local project commands
  - shadcn primitives under `src/components/ui/` with current project style
- Remove duplicate or contradictory instructions.
- Add route from `AGENTS.md` to the consolidated PR/prompt guide content.

### Proposed Destination

Preferred:
- `docs/PR_GUIDE.md` remains the canonical detailed PR/review guide.
- `memory/modules/testing-deploy.md` summarizes PR validation and command expectations.
- `AGENTS.md` links to the canonical guide instead of duplicating all checklist content.

Acceptable alternative:
- Keep root `PR_GUIDE.md` only if it becomes a short pointer to `docs/PR_GUIDE.md`.
- Keep `PROMPT_GUIDE.md` only if it becomes a short pointer/template and no longer contains stale stack details.

---

## Phase 4 — Stale File Cleanup Policy

### Objective

After the new context stack is created and cross-references are updated, remove or reduce files that contain stale, ambiguous, duplicate, or contradictory facts already covered by canonical sources.

### Deletion/Reduction Rules

Files may be deleted or replaced with short pointer files when all are true:
- Their useful content has been migrated into canonical files.
- They contain stale or ambiguous information that conflicts with `AGENTS.md`, `memory/BOOT.md`, `memory/INDEX.md`, module maps, or canonical docs.
- They are not required by tooling or external references.
- A search confirms no active source depends on the old path, or the old path is replaced by a pointer file.

Potential candidates for deletion/reduction after migration:
- Root `PR_GUIDE.md` if `docs/PR_GUIDE.md` becomes canonical.
- `PROMPT_GUIDE.md` if its useful prompt template is migrated into canonical docs or a short current template.
- `memory/AGENTS.md` if root `AGENTS.md` becomes the single agent operating guide and memory-specific rules move into `memory/INDEX.md`.
- Long sections of `memory/TECHNICAL.md` after they are split into `memory/modules/*.md`.

**Important:** Do not delete first. Migrate, verify references, then delete/reduce.

---

## Phase 5 — Context Pack Script

### Objective

Add an optional command for producing a minimal context bundle by topic.

### Proposed Command

```bash
npm run context:pack -- <topic>
```

### Expected Behavior

- Reads `memory/BOOT.md`.
- Uses `memory/INDEX.md` to resolve module/source paths for `<topic>`.
- Includes relevant module map.
- Includes short excerpts or path lists from relevant source files.
- Optionally includes graphify query suggestions.
- Does not call LLM APIs.

### Possible Implementation

- `scripts/context-pack.mjs`
- `package.json` script: `"context:pack": "node scripts/context-pack.mjs"`

This script is useful but lower priority than BOOT/INDEX/modules and `AGENTS.md` routing.

---

## Phase 6 — Complementary Tooling

### Recommended Tools

- `ast-grep`: structural TS/TSX search for refactors.
- `dependency-cruiser` or `madge`: frontend import graph/cycle detection.
- `ts-prune`: dead exports.
- `knip`: unused files/deps/exports.
- SQLite FTS for fast local docs/memory search.
- Local embeddings or Qdrant only for long docs/product retrieval, not as primary source of code truth.

### Rule

Do not add these tools in this PRD unless implementation scope explicitly includes them. Document them as future optional improvements.

---

## Phase 7 — Acceptance Criteria

### Context Stack
- `memory/BOOT.md` exists and is concise.
- `memory/INDEX.md` exists and routes by domain and task complexity.
- `memory/modules/` exists with the seven required module files.
- `memory/TECHNICAL.md` is reduced to an overview/index or clearly points to module files.

### AGENTS Routing
- `AGENTS.md` tells agents what to consult for:
  - technical questions with no code changes
  - point fixes/fine adjustments
  - medium cross-file changes
  - architecture/schema/billing/auth/deploy changes
- `AGENTS.md` explicitly says it is an execution router, not a file to summarize by default.
- `AGENTS.md` includes the rule: do not summarize `AGENTS.md` unless explicitly asked.
- `AGENTS.md` includes recommended prompt patterns for users.
- `AGENTS.md` tells agents what to update at the end of work that changes code or structure.
- `AGENTS.md` points to `memory/BOOT.md`, `memory/INDEX.md`, and canonical PR/prompt guidance.

### Stale Docs
- `memory/CONTEXT.md`, `AGENTS.md`, PR guides, prompt guides, and task logs no longer disagree about npm/Yarn/pnpm/Corepack for local project commands.
- Stale stack references are corrected or removed.
- Duplicate files with migrated content are deleted or reduced to pointer files when safe.
- Any deleted file has either no active references or a replacement pointer/reference path.

### Graphify
- Graphify remains the deep traversal layer.
- Generic community labels are improved where feasible.
- Graph update instructions are clear and consistent.
- Lack of Gemini/Google API key is documented as optional semantic extraction limitation, not a blocker for normal updates.

### PR/Prompt Guides
- PR/review checklist content remains available.
- Prompt guide content remains available.
- Both are aligned with the current stack and linked from `AGENTS.md`.

---

## Phase 8 — Validation

- [ ] Search for stale package manager references: `yarn`, `pnpm`, `Corepack`, `package-lock`, `npm`.
- [ ] Search for stale stack references: `Next.js 15`, `Tailwind CSS v3`, `@base-ui/react` if no longer accurate.
- [ ] Verify `AGENTS.md` has task-complexity routing.
- [ ] Verify `AGENTS.md` says not to summarize itself unless explicitly asked.
- [ ] Verify `AGENTS.md` has recommended prompt patterns for execution.
- [ ] Verify `AGENTS.md` has end-of-work update rules.
- [ ] Verify `memory/BOOT.md` is 50-100 lines.
- [ ] Verify `memory/INDEX.md` routes all required modules.
- [ ] Verify each `memory/modules/*.md` file has source paths and graphify queries.
- [ ] Verify deleted/reduced files have no broken references.
- [ ] Run `python -m graphify update . --force` after context structure changes if graphify should track docs.
- [ ] Record final status in `memory/TASK_LOG.md`.

---

## Files Changed (Expected)

### New Files
- `memory/BOOT.md` — short always-read context.
- `memory/INDEX.md` — context router.
- `memory/modules/auth.md` — auth module map.
- `memory/modules/settings.md` — settings module map.
- `memory/modules/billing.md` — billing module map.
- `memory/modules/workstation.md` — workstation module map.
- `memory/modules/agents.md` — agents module map.
- `memory/modules/supabase.md` — Supabase module map.
- `memory/modules/testing-deploy.md` — testing/deploy module map.
- `scripts/context-pack.mjs` — optional context pack generator if included.

### Modified Files
- `AGENTS.md` — agent startup, routing, end-of-work update rules.
- `memory/CONTEXT.md` — correct npm/current command drift.
- `memory/TECHNICAL.md` — reduce to overview/index or point to module maps.
- `memory/DECISIONS.md` — record context architecture decision.
- `memory/HANDOFF.md` — record blockers/follow-ups.
- `memory/TASK_LOG.md` — record work and validation.
- `docs/PR_GUIDE.md` — make canonical PR guide current.
- `PR_GUIDE.md` — delete, reduce, or convert to pointer if duplicated/stale.
- `PROMPT_GUIDE.md` — update, delete, reduce, or convert to pointer after migration.
- `memory/AGENTS.md` — merge into root `AGENTS.md`, delete, or convert to pointer if safe.
- `package.json` — add `context:pack` only if script is implemented.
- `graphify-out/.graphify_labels.json` — update community labels if feasible.

---

## Risks & Mitigations

- **Deleting useful context:** Migrate content first, search references, then delete/reduce.
- **Creating another large memory file:** Keep `BOOT.md` short and use module maps for detail.
- **Context drift returns:** Add end-of-work update rules to `AGENTS.md` and `memory/INDEX.md`.
- **Graph labels become manual busywork:** Improve high-value communities first; do not block core memory consolidation on perfect labels.
- **PR guide loses useful checklist detail:** Keep `docs/PR_GUIDE.md` canonical and link from `AGENTS.md`.
- **Agents over-read again:** `AGENTS.md` must explicitly route simple questions to minimal context.
- **Agents summarize AGENTS.md instead of executing:** Add a direct execution rule to `AGENTS.md` and recommended prompt patterns saying not to summarize unless explicitly asked.
- **LocalStorage/domain-source confusion:** Preserve current invariant: `localStorage` only for UI preferences, Supabase for domain data.

---

## Pending

- [x] Define context stack — CONCLUÍDO
- [x] Define AGENTS routing updates — CONCLUÍDO
- [x] Define stale-file cleanup policy — CONCLUÍDO
- [x] Define end-of-work update rules — CONCLUÍDO
- [x] Implementação
- [x] Validação
