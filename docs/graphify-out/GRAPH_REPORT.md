# Graph Report - redrise v2  (2026-07-21)

## Corpus Check
- 342 files · ~132,736 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1914 nodes · 3499 edges · 201 communities (138 shown, 63 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8e4c0bb0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- process-table.tsx
- project-snapshot.ts
- cn
- user-profile.ts
- react
- sidebar.tsx
- route-skeleton.tsx
- TASK_LOG
- compilerOptions
- menubar.tsx
- workstation.ts
- action.types.ts
- i18n-context.tsx
- task-executions.ts
- SupabaseWorkstationAdapter
- utils.ts
- InMemoryWorkstationAdapter
- logAuditEvent
- WorkstationRepository
- supabase-workstation-adapter.ts
- team-members.ts
- flow-runs.ts
- command.tsx
- process.types.ts
- flow-cards.ts
- tasks.ts
- components.json
- PRD-024 — Adaptadores Duráveis do Workstation v1
- button.tsx
- create-process-dialog.tsx
- AGENTS
- RedRise - Product Architecture Map v1
- supabase.ts
- projects.ts
- integrations.ts
- devDependencies
- scripts
- useWorkstation
- agents.ts
- notifications.ts
- billing.ts
- app.ts
- app-breadcrumb.tsx
- teams.ts
- Decisão
- 05 — WS-ACTIONS Session Spec v1
- Fonte operacional — RedRise
- redrise-ops.mjs
- alert-dialog.tsx
- process-node-config-dialog.tsx
- index.ts
- index.ts
- index.ts
- dependencies
- Decisão
- Decisão
- drawer.tsx
- sheet.tsx
- RedRise - UI Blocks Reference Map v1
- RedRise - Roadmap v1
- process-canvas-toolbar.tsx
- api-keys.ts
- ADR-003 — Idempotência e concorrência
- ADR-004 — Payload, snapshots e redação
- Vendor engagement — RedRise Workstation
- BOOT
- RedRise
- cml-server.ts
- index.ts
- audit-logs.ts
- team-invites.ts
- 11. Action Details Dialog
- PR-A1 — Bootstrap org, membership e middleware
- PR-A2 — Redaction e audit hardening
- PR-A3 — Worker durável do Workstation
- PR-A4 — Realtime Actions
- PR-A5 — Hardening operacional, DLQ e runbooks
- PR-A6 — Rollout canário do Workstation durável
- INDEX
- Workstation
- orbiting-circles-01.tsx
- settings.ts
- index.ts
- index.ts
- 19. Test Checklist
- README.md
- Handoff — série de PRs RedRise (Workstation + follow-ups)
- pg-exec.mjs
- useIsMobile
- tabs.tsx
- index.ts
- global-setup.ts
- 15. RBAC / Visibility
- 4. Header
- PR-B2 — E2E do caminho durável
- PR-B3 — Types gerados do Supabase
- PR-B4 — Cleanup do backend legado (PRD-079)
- PR-B5 — CML SDK live server-only
- PR-B6 — Settings, Team e Billing v1
- PR-C1 — CI e Definition of Done para vendor
- Auth
- Settings And App Shell
- Supabase
- Testing And Deploy
- package.json
- alert.tsx
- member-functions.ts
- timezones.ts
- index.ts
- 10. Run History Table
- 2. Selected UI References
- 7. Kanban Card
- RedRise - PRD Index v1
- DECISIONS
- clean-next.mjs
- copy-spa-fallback.mjs
- accordion.tsx
- analytics.ts
- cities.ts
- index.ts
- 12. Data Dependencies
- 6. Kanban Columns
- 8. Kanban Behavior
- next.config.ts
- page.tsx
- scroll-area.tsx
- settings-keys.ts
- @base-ui/react
- class-variance-authority
- clsx
- date-fns
- @dnd-kit/core
- @dnd-kit/modifiers
- @dnd-kit/sortable
- @dnd-kit/utilities
- eslint-plugin-react-refresh
- globals
- @hookform/resolvers
- jsdom
- lucide-react
- next
- next-env.d.ts
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-scroll-area
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- react-day-picker
- react-dom
- react-is
- recharts
- sonner
- @supabase/ssr
- @supabase/supabase-js
- @tabler/icons-react
- tailwind-merge
- @tanstack/react-table
- tw-animate-css
- vaul
- @xyflow/react
- zod
- shadcn
- tailwindcss
- @testing-library/dom
- @testing-library/jest-dom
- @types/node
- @types/react
- @types/react-dom
- typescript
- vitest
- postcss.config.mjs
- graphify-ast.sh script
- graphify-semantic.sh script
- redrise

## God Nodes (most connected - your core abstractions)
1. `cn()` - 214 edges
2. `logAuditEvent()` - 33 edges
3. `react` - 31 edges
4. `SupabaseWorkstationAdapter` - 30 edges
5. `Button` - 29 edges
6. `InMemoryWorkstationAdapter` - 29 edges
7. `supabase` - 29 edges
8. `TASK_LOG` - 29 edges
9. `useWorkstation()` - 22 edges
10. `05 — WS-ACTIONS Session Spec v1` - 21 edges

## Surprising Connections (you probably didn't know these)
- `AppSidebar()` --references--> `react`  [EXTRACTED]
  src/components/layout/app-sidebar.tsx → package.json
- `ContextMenu()` --references--> `react`  [EXTRACTED]
  src/components/ui/context-menu.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar-context.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `ToggleGroupItem()` --references--> `react`  [EXTRACTED]
  src/components/ui/toggle-group.tsx → package.json

## Import Cycles
- None detected.

## Communities (201 total, 63 thin omitted)

### Community 0 - "process-table.tsx"
Cohesion: 0.05
Nodes (70): WorkstationPageProps, Badge(), badgeVariants, Card, CardAction, CardContent, CardDescription, CardFooter (+62 more)

### Community 1 - "project-snapshot.ts"
Cohesion: 0.06
Nodes (43): ADR-0001, OrganizationLayout(), OrganizationLayoutProps, Home(), AppShell(), FixtureAuthorizationPolicy, withSession(), LoadedWorkstationSnapshot (+35 more)

### Community 2 - "cn"
Cohesion: 0.05
Nodes (51): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), BackgroundGradient(), BackgroundGradientProps (+43 more)

### Community 3 - "user-profile.ts"
Cohesion: 0.07
Nodes (39): useWorkspaces(), createDefaultProfile(), decodeJwtPayload(), ensureCurrentUserTeamMember(), fromSupabaseProfile(), getSessionLocation(), getSupabaseSessionId(), loadRememberedSessions() (+31 more)

### Community 4 - "react"
Cohesion: 0.06
Nodes (35): react, react, MultiSelect(), ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent() (+27 more)

### Community 5 - "sidebar.tsx"
Cohesion: 0.09
Nodes (37): AppShellProps, AppSidebar(), AppSidebarProps, isRouteActive(), ActiveOrganization, organizations, OrganizationSwitcher(), getSidebarRoutes() (+29 more)

### Community 7 - "TASK_LOG"
Cohesion: 0.05
Nodes (36): 2026-07-06 - Foundation through WS-SPACES, 2026-07-07 - Memory Economics, 2026-07-07 - WS-ACTIONS, 2026-07-07 - WS-PROCESS, 2026-07-08 - Semantic Layer Migration, 2026-07-09 - Context Memory Layer Functional Rollout, 2026-07-09 - Context Memory Layer (PRD-CML-001), 2026-07-18 - Dev 404 and authenticated Workstation E2E (+28 more)

### Community 8 - "compilerOptions"
Cohesion: 0.06
Nodes (34): dom, dom.iterable, esnext, graphify-out, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+26 more)

### Community 9 - "menubar.tsx"
Cohesion: 0.08
Nodes (24): NotificationPopover(), NotificationPopoverProps, notifications, DropdownMenuCheckboxItem(), DropdownMenuGroup(), DropdownMenuLabel(), DropdownMenuPortal(), DropdownMenuRadioGroup() (+16 more)

### Community 10 - "workstation.ts"
Cohesion: 0.09
Nodes (21): clone(), DomainErrorCode, ROLE_CAPABILITIES, WorkstationAdapterOptions, WorkstationDomainError, CanvasNodeData, mockCanvasNodes, mockNodeConnections (+13 more)

### Community 11 - "action.types.ts"
Cohesion: 0.09
Nodes (23): actionProcesses, actionSpaces, filterActions(), filterProcessRuns(), mockActionNodeRuns, mockProcessRuns, ActionNodeRun, ActionNodeRunStatus (+15 more)

### Community 12 - "i18n-context.tsx"
Cohesion: 0.10
Nodes (18): geist, metadata, AppProviders(), I18nContext, I18nContextValue, I18nProvider(), SonnerProvider(), BackButton() (+10 more)

### Community 13 - "task-executions.ts"
Cohesion: 0.10
Nodes (17): addMessage(), addOutput(), createExecution(), generateMessageId(), generateOutputId(), generateShortExecId(), loadLatestApprovedOutput(), resolveUpstreamContext() (+9 more)

### Community 14 - "SupabaseWorkstationAdapter"
Cohesion: 0.20
Nodes (4): newKey(), SupabaseWorkstationAdapter, WorkstationSnapshot, EntityRevisions

### Community 15 - "utils.ts"
Cohesion: 0.17
Nodes (16): Input, Label, labelVariants, RequiredLabelProps, Spinner(), emailSchema, ForgotPasswordInput, forgotPasswordSchema (+8 more)

### Community 16 - "InMemoryWorkstationAdapter"
Cohesion: 0.17
Nodes (3): getActionStage(), duration(), InMemoryWorkstationAdapter

### Community 17 - "logAuditEvent"
Cohesion: 0.18
Nodes (22): useFlows(), logAuditEvent(), approveFlow(), createFlow(), deleteFlow(), generateShortId(), generateUniqueId(), invalidateFlowOfficialStatus() (+14 more)

### Community 18 - "WorkstationRepository"
Cohesion: 0.11
Nodes (10): WorkstationRepository, CreateProcessInput, RedRiseNode, RedRiseProcess, AddSpaceMemberInput, addSpaceMemberSchema, CreateSpaceInput, createSpaceSchema (+2 more)

### Community 19 - "supabase-workstation-adapter.ts"
Cohesion: 0.33
Nodes (21): CommandOutcome, addSpaceMemberAction(), archiveSpaceAction(), cancelRunAction(), CommandResult, connectNodesAction(), createNodeAction(), createProcessAction() (+13 more)

### Community 20 - "team-members.ts"
Cohesion: 0.11
Nodes (13): AccessRole, AgentAccessContext, displayName(), isOnline(), loadCurrentTeamAssignment(), loadTeamMembers(), normalizeTeamName(), ProfileRow (+5 more)

### Community 21 - "flow-runs.ts"
Cohesion: 0.11
Nodes (10): addFlowRunStep(), createFlowRun(), generateShortId(), generateStepId(), CreateFlowRunInput, CreateFlowRunStepInput, FlowRun, FlowRunStatus (+2 more)

### Community 22 - "command.tsx"
Cohesion: 0.15
Nodes (17): MultiSelectProps, Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+9 more)

### Community 23 - "process.types.ts"
Cohesion: 0.11
Nodes (18): createProcessSchema, connectionTypes, failureBehaviors, inputModes, NodeConnectionType, NodeRun, NodeRunStatus, nodeRunStatuses (+10 more)

### Community 24 - "flow-cards.ts"
Cohesion: 0.19
Nodes (13): useFlowCards(), createFlowCard(), createFlowEdge(), generateEdgeShortId(), generateShortId(), loadFlowCards(), loadFlowEdges(), syncFlowEditor() (+5 more)

### Community 25 - "tasks.ts"
Cohesion: 0.18
Nodes (15): useTasks(), createTask(), deleteTask(), generateShortId(), generateUniqueId(), isIdUnique(), loadTasks(), updateTaskStatus() (+7 more)

### Community 26 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 27 - "PRD-024 — Adaptadores Duráveis do Workstation v1"
Cohesion: 0.11
Nodes (18): 10. Realtime, 11. Plano de entrega e microgerenciamento, 12. Observabilidade e SLOs, 13. Rollout e rollback, 14. Critérios de aceite, 15. Pendências de decisão, 1. Resultado esperado, 2. Escopo (+10 more)

### Community 28 - "button.tsx"
Cohesion: 0.27
Nodes (11): Button, ButtonProps, DialogDescription(), DialogFooter(), SelectContent(), SelectItem(), SelectTrigger(), SelectValue() (+3 more)

### Community 29 - "create-process-dialog.tsx"
Cohesion: 0.26
Nodes (10): Dialog(), DialogClose(), DialogContent(), DialogHeader(), DialogTitle(), DialogTrigger(), Separator, ActionDetailsDialog() (+2 more)

### Community 30 - "AGENTS"
Cohesion: 0.12
Nodes (16): Active Sources Of Truth, AGENTS, Backend policy, Cache protection, Commands, Current Entry Points, Current Invariants, Current Stack (+8 more)

### Community 31 - "RedRise - Product Architecture Map v1"
Cohesion: 0.12
Nodes (16): Actions, App Shell, Auth Domain, Backend Status, Current Code Organization, Current Navigation, Implemented Screen IDs, Next Scope Boundary (+8 more)

### Community 32 - "supabase.ts"
Cohesion: 0.14
Nodes (8): AnalyticsData, AgentProviderAuthMethod, AgentProviderId, ChatCompletionResponse, ChatMessage, TaskExecuteContext, TaskExecuteResult, supabase

### Community 33 - "projects.ts"
Cohesion: 0.27
Nodes (12): useProjects(), createProject(), deleteProject(), generateShortId(), generateUniqueId(), isIdUnique(), loadProjects(), updateProject() (+4 more)

### Community 34 - "integrations.ts"
Cohesion: 0.13
Nodes (8): createIntegration(), CreateIntegrationInput, deleteIntegration(), generateShortId(), Integration, IntegrationSetupDetail, IntegrationSetupSummary, IntegrationStatus

### Community 35 - "devDependencies"
Cohesion: 0.13
Nodes (15): eslint, eslint-config-next, @eslint/js, devDependencies, eslint, eslint-config-next, @eslint/js, @playwright/test (+7 more)

### Community 36 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, clean:next, dev, dev:clean, dev:webpack, lint, mcp:redrise-ops (+7 more)

### Community 37 - "useWorkstation"
Cohesion: 0.22
Nodes (9): ActionsPage(), useWorkstation(), ProcessCanvasPage(), ProcessPage(), ProcessTable(), CreateProcessDialog(), SpacesTable(), CreateSpaceDialog() (+1 more)

### Community 38 - "agents.ts"
Cohesion: 0.26
Nodes (11): useAgents(), createAgent(), deleteAgent(), generateShortId(), generateUniqueId(), isIdUnique(), loadAgents(), updateAgent() (+3 more)

### Community 39 - "notifications.ts"
Cohesion: 0.26
Nodes (12): useNotifications(), createNotification(), generateShortId(), loadNotifications(), markNotificationRead(), markNotificationUnread(), resolveNotification(), CreateNotificationInput (+4 more)

### Community 40 - "billing.ts"
Cohesion: 0.16
Nodes (10): BillingPlan, BillingStatus, BillingSubscription, BillingSubscriptionRow, defaultBillingSubscription(), fromRow(), loadBillingSubscription(), PLAN_LIMITS (+2 more)

### Community 41 - "app.ts"
Cohesion: 0.27
Nodes (5): openSettings(), openAuthenticatedApp(), openSidebarModule(), openTopbarAction(), SidebarModule

### Community 42 - "app-breadcrumb.tsx"
Cohesion: 0.23
Nodes (11): AppBreadcrumb(), getCrumbs(), routeLabels, SidebarRoute, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink() (+3 more)

### Community 43 - "teams.ts"
Cohesion: 0.20
Nodes (11): addTeamAssignments(), AssignmentRow, createTeam(), generateShortId(), loadCurrentTeamAssignments(), loadTeams(), mapTeam(), normalizeFallbackTeam() (+3 more)

### Community 44 - "Decisão"
Cohesion: 0.15
Nodes (12): ADR-001 — Schema durável do Workstation, Alternativas rejeitadas, Consequências, Contexto, Decisão, Entidades e pontos de fidelidade ao contrato, Identidade, tempo e enums, Infraestrutura de execução (+4 more)

### Community 45 - "05 — WS-ACTIONS Session Spec v1"
Cohesion: 0.15
Nodes (12): 05 — WS-ACTIONS Session Spec v1, 13. Realtime Requirements, 14. Sonner Usage, 16. Out of Scope for WS-ACTIONS MVP, 17. MVP Layout, 18. Acceptance Criteria, 1. Objective, 20. Implementation Notes (+4 more)

### Community 46 - "Fonte operacional — RedRise"
Cohesion: 0.15
Nodes (12): Artifacts condicionais, Branch e PR, Decomposição, Fonte operacional — RedRise, Fontes ativas, Limites, Outcome do app, Relação com a Ghauss (+4 more)

### Community 47 - "redrise-ops.mjs"
Cohesion: 0.23
Nodes (10): __dirname, handle(), processMessage(), projectRoot, shell(), startServer(), toolList(), tools (+2 more)

### Community 48 - "alert-dialog.tsx"
Cohesion: 0.17
Nodes (11): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+3 more)

### Community 49 - "process-node-config-dialog.tsx"
Cohesion: 0.22
Nodes (10): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, Textarea(), jsonText, NodeForm, nodeFormSchema (+2 more)

### Community 50 - "index.ts"
Cohesion: 0.23
Nodes (10): adapterResponse(), buildStructuredResult(), DEFAULT_ALLOWED_ORIGINS, endpointLabel(), generateAdapterRunId(), getAllowedOrigins(), getCorsHeaders(), providerCandidates() (+2 more)

### Community 51 - "index.ts"
Cohesion: 0.29
Nodes (10): activeStatus(), auditId(), handleCheckoutCompleted(), planFromMetadata(), StripeObject, timingSafeEqual(), toHex(), unixToIso() (+2 more)

### Community 52 - "index.ts"
Cohesion: 0.21
Nodes (6): ALLOWED_EXTENSIONS, DEFAULT_ALLOWED_ORIGINS, extensionOf(), getAllowedOrigins(), getCorsHeaders(), safePath()

### Community 53 - "dependencies"
Cohesion: 0.18
Nodes (11): cmdk, next-themes, dependencies, cmdk, next-themes, @radix-ui/react-select, @radix-ui/react-tooltip, react-hook-form (+3 more)

### Community 54 - "Decisão"
Cohesion: 0.18
Nodes (10): ADR-002 — RLS e autorização do Workstation, Alternativas rejeitadas, Consequências, Contexto, Decisão, Funções helper, Matriz capability → RLS (leitura), Matriz capability → RPC (escrita, Fases 2–4) (+2 more)

### Community 55 - "Decisão"
Cohesion: 0.18
Nodes (10): ADR-005 — SLOs e observabilidade, Alertas, Alternativas rejeitadas, Consequências, Contexto, Correlação, Decisão, Métricas mínimas persistidas/deriváveis (+2 more)

### Community 56 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 57 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 58 - "RedRise - UI Blocks Reference Map v1"
Cohesion: 0.20
Nodes (9): Actions, App Shell, Auth, Global Rules, Process, RedRise - UI Blocks Reference Map v1, Spaces, Status (+1 more)

### Community 59 - "RedRise - Roadmap v1"
Cohesion: 0.20
Nodes (9): Completed, Current validation baseline, Foundation and shell, Functional Workstation reference, Next milestone, Out of scope for RedRise, RedRise - Roadmap v1, RedScale and embedded CML cleanup (+1 more)

### Community 60 - "process-canvas-toolbar.tsx"
Cohesion: 0.29
Nodes (7): Collapsible(), CollapsibleContent(), CollapsibleTrigger(), Kbd(), KbdGroup(), ProcessCanvasToolbar(), ProcessCanvasToolbarProps

### Community 61 - "api-keys.ts"
Cohesion: 0.27
Nodes (8): ApiKey, createApiKey(), CreateApiKeyInput, deleteApiKey(), generateApiKeySecret(), generateShortId(), revokeApiKey(), sha256Hex()

### Community 62 - "ADR-003 — Idempotência e concorrência"
Cohesion: 0.22
Nodes (8): ADR-003 — Idempotência e concorrência, Alternativas rejeitadas, Chaves, Concorrência de execução, Consequências, Contexto, Decisão, Pipeline transacional de comando

### Community 63 - "ADR-004 — Payload, snapshots e redação"
Cohesion: 0.22
Nodes (8): ADR-004 — Payload, snapshots e redação, Alternativas rejeitadas, Consequências, Contexto, Contrato de exibição, Decisão, Limites, Redação

### Community 64 - "Vendor engagement — RedRise Workstation"
Cohesion: 0.22
Nodes (8): Como rodar, Contato de autoridade, Contratos que não podem quebrar, Definition of Done (todo PR), Objetivo do engajamento, Regras duras, Stack, Vendor engagement — RedRise Workstation

### Community 65 - "BOOT"
Cohesion: 0.22
Nodes (8): Active Sources Of Truth, BOOT, Commands, Current Entry Points, Current Invariants, Current Stack, Implemented Scope, Known Blockers

### Community 66 - "RedRise"
Cohesion: 0.22
Nodes (8): Architecture, Commands, Current Scope, Environment, Notes, RedRise, Source Of Truth, Stack

### Community 67 - "cml-server.ts"
Cohesion: 0.25
Nodes (7): CmlAdapterError, CmlAdapterErrorCode, GlobalContextStatus, loadClient(), OfficialSdk, RedRiseGlobalContextResult, searchRedRiseGlobalContext()

### Community 68 - "index.ts"
Cohesion: 0.25
Nodes (4): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders(), InvitePayload

### Community 69 - "audit-logs.ts"
Cohesion: 0.25
Nodes (5): AuditAction, AuditEntityType, AuditLog, generateShortId(), LogInput

### Community 70 - "team-invites.ts"
Cohesion: 0.32
Nodes (6): InviteRow, loadPendingTeamInvites(), profileName(), ProfileRow, singleRelation(), TeamInviteNotification

### Community 71 - "11. Action Details Dialog"
Cohesion: 0.29
Nodes (7): 11. Action Details Dialog, Dialog layout, Error content, Overview fields, Result content, Steps content, Tabs or sections

### Community 72 - "PR-A1 — Bootstrap org, membership e middleware"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A1 — Bootstrap org, membership e middleware

### Community 73 - "PR-A2 — Redaction e audit hardening"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A2 — Redaction e audit hardening

### Community 74 - "PR-A3 — Worker durável do Workstation"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A3 — Worker durável do Workstation

### Community 75 - "PR-A4 — Realtime Actions"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A4 — Realtime Actions

### Community 76 - "PR-A5 — Hardening operacional, DLQ e runbooks"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A5 — Hardening operacional, DLQ e runbooks

### Community 77 - "PR-A6 — Rollout canário do Workstation durável"
Cohesion: 0.29
Nodes (6): Arquivos prováveis, Escopo, Fora de escopo, Gate de aceite, Objetivo, PR-A6 — Rollout canário do Workstation durável

### Community 78 - "INDEX"
Cohesion: 0.29
Nodes (6): Always Read, Documentation Policy, Domain Routing, End Of Work, INDEX, Memory Economics

### Community 79 - "Workstation"
Cohesion: 0.29
Nodes (6): Core files, Current behavior, Durable files, Durable milestone (PRD-024) progress, State transitions, Workstation

### Community 80 - "orbiting-circles-01.tsx"
Cohesion: 0.29
Nodes (5): circle1Icons, circle2Icons, IconData, OrbitingCirclesDemo(), OrbitingCirclesProps

### Community 81 - "settings.ts"
Cohesion: 0.29
Nodes (6): NotificationSettings, OrganizationMemberRow, SettingsIntegration, SettingsMember, SettingsMemberStatus, SettingsRole

### Community 82 - "index.ts"
Cohesion: 0.33
Nodes (4): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders(), PLAN_PRICE_ENV

### Community 83 - "index.ts"
Cohesion: 0.33
Nodes (3): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders()

### Community 84 - "19. Test Checklist"
Cohesion: 0.33
Nodes (6): 19. Test Checklist, Dialog, Filters, Kanban, RBAC, Run History Table

### Community 85 - "README.md"
Cohesion: 0.33
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B1 — Organization Switcher com dados reais

### Community 86 - "Handoff — série de PRs RedRise (Workstation + follow-ups)"
Cohesion: 0.33
Nodes (6): Como usar, Estado já entregue (não refazer), Fontes de verdade, Fronteira CML vs backend RedRise, Handoff — série de PRs RedRise (Workstation + follow-ups), Índice

### Community 87 - "pg-exec.mjs"
Cohesion: 0.33
Nodes (4): args, client, sanitizedUrl, sql

### Community 88 - "useIsMobile"
Cohesion: 0.53
Nodes (5): SidebarProvider(), getServerSnapshot(), getSnapshot(), subscribe(), useIsMobile()

### Community 89 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 90 - "index.ts"
Cohesion: 0.40
Nodes (3): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders()

### Community 91 - "global-setup.ts"
Cohesion: 0.33
Nodes (3): __dirname, env, __filename

### Community 92 - "15. RBAC / Visibility"
Cohesion: 0.40
Nodes (5): 15. RBAC / Visibility, Admin / Owner / Board, Staff, User, Viewer

### Community 93 - "4. Header"
Cohesion: 0.40
Nodes (5): 4. Header, Breadcrumb, Description, Primary rule, Title

### Community 94 - "PR-B2 — E2E do caminho durável"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B2 — E2E do caminho durável

### Community 95 - "PR-B3 — Types gerados do Supabase"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B3 — Types gerados do Supabase

### Community 96 - "PR-B4 — Cleanup do backend legado (PRD-079)"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B4 — Cleanup do backend legado (PRD-079)

### Community 97 - "PR-B5 — CML SDK live server-only"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B5 — CML SDK live server-only

### Community 98 - "PR-B6 — Settings, Team e Billing v1"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-B6 — Settings, Team e Billing v1

### Community 99 - "PR-C1 — CI e Definition of Done para vendor"
Cohesion: 0.40
Nodes (4): Escopo, Gate de aceite, Objetivo, PR-C1 — CI e Definition of Done para vendor

### Community 100 - "Auth"
Cohesion: 0.40
Nodes (4): Auth, Current Behavior, Pending, Source Files

### Community 101 - "Settings And App Shell"
Cohesion: 0.40
Nodes (4): Current Behavior, Pending, Settings And App Shell, Source Files

### Community 102 - "Supabase"
Cohesion: 0.40
Nodes (4): Current Behavior, Pending, Source Files, Supabase

### Community 103 - "Testing And Deploy"
Cohesion: 0.40
Nodes (4): Commands, Current Validation Baseline, Known Blockers, Testing And Deploy

### Community 104 - "package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 105 - "alert.tsx"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 106 - "member-functions.ts"
Cohesion: 0.50
Nodes (3): MEMBER_FUNCTIONS, MemberFunction, normalizeMemberFunction()

### Community 107 - "timezones.ts"
Cohesion: 0.40
Nodes (4): TIMEZONE_OPTIONS, TIMEZONE_REGIONS, TimezoneOption, TimezoneRegion

### Community 108 - "index.ts"
Cohesion: 0.50
Nodes (3): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders()

### Community 109 - "10. Run History Table"
Cohesion: 0.50
Nodes (4): 10. Run History Table, Required columns, Required table features, Row actions

### Community 110 - "2. Selected UI References"
Cohesion: 0.50
Nodes (4): 2.1 Kanban, 2.2 Runs / Actions Table, 2.3 Action Details Dialog, 2. Selected UI References

### Community 111 - "7. Kanban Card"
Cohesion: 0.50
Nodes (4): 7. Kanban Card, Adaptation from `@reui/c-kanban-5`, Required card fields, Visual content

### Community 112 - "RedRise - PRD Index v1"
Cohesion: 0.50
Nodes (3): Acceptance rules, RedRise - PRD Index v1, Status

### Community 113 - "DECISIONS"
Cohesion: 0.50
Nodes (3): Active Decisions, DECISIONS, Implemented Decisions

### Community 114 - "clean-next.mjs"
Cohesion: 0.50
Nodes (3): nextDevOutput, nextOutputRoot, workspaceRoot

### Community 115 - "copy-spa-fallback.mjs"
Cohesion: 0.50
Nodes (3): distDir, fallbackPath, indexPath

### Community 116 - "accordion.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 119 - "index.ts"
Cohesion: 0.67
Nodes (3): DEFAULT_ALLOWED_ORIGINS, getAllowedOrigins(), getCorsHeaders()

### Community 120 - "12. Data Dependencies"
Cohesion: 0.67
Nodes (3): 12. Data Dependencies, node_runs, process_runs

### Community 121 - "6. Kanban Columns"
Cohesion: 0.67
Nodes (3): 6. Kanban Columns, Column metadata, Status-to-column mapping

### Community 122 - "8. Kanban Behavior"
Cohesion: 0.67
Nodes (3): 8. Kanban Behavior, Drag and drop, Realtime movement

## Knowledge Gaps
- **662 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `css` (+657 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `class-variance-authority`, `clsx`, `date-fns`, `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `react`, `@hookform/resolvers`, `lucide-react`, `next`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `react-day-picker`, `react-dom`, `react-is`, `recharts`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `@tabler/icons-react`, `tailwind-merge`, `@tanstack/react-table`, `tw-animate-css`, `vaul`, `@xyflow/react`, `zod`, `package.json`, `@base-ui/react`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `process-table.tsx`, `sidebar.tsx`, `useWorkstation`, `dependencies`, `useIsMobile`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `process-table.tsx`, `react`, `sidebar.tsx`, `menubar.tsx`, `utils.ts`, `command.tsx`, `button.tsx`, `create-process-dialog.tsx`, `app-breadcrumb.tsx`, `alert-dialog.tsx`, `process-node-config-dialog.tsx`, `drawer.tsx`, `sheet.tsx`, `process-canvas-toolbar.tsx`, `orbiting-circles-01.tsx`, `useIsMobile`, `tabs.tsx`, `alert.tsx`, `accordion.tsx`, `scroll-area.tsx`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _662 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `process-table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05339805825242718 - nodes in this community are weakly interconnected._
- **Should `project-snapshot.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06170598911070781 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._