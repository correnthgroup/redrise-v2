"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PlugZapIcon,
  PlusIcon,
  SearchIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/hooks/use-i18n"
import { saveAuthLanguagePreference } from "@/lib/auth-language"
import { supabase } from "@/lib/supabase"
import { TIMEZONE_OPTIONS, TIMEZONE_REGIONS } from "@/lib/timezones"
import { loadUserProfile, PROFILE_UPDATED_EVENT, saveUserProfile, type UserProfile } from "@/lib/user-profile"
import type { NotificationSettings, OrganizationMemberRow, SettingsIntegration, SettingsMember, SettingsRole } from "@/types/settings"

const SETTINGS_SECTIONS = ["profile", "team", "notification", "integration"] as const
type SettingsSection = (typeof SETTINGS_SECTIONS)[number]

const ROLE_OPTIONS: SettingsRole[] = ["Admin", "Owner", "Board", "User", "Viewer"]

const MOCK_MEMBERS: SettingsMember[] = [
  { id: "1", name: "Raul Vieira", email: "raul@redrise.app", role: "Owner", status: "Active", joinedAt: "2026-01-15" },
  { id: "2", name: "Ana Martins", email: "ana@redrise.app", role: "Admin", status: "Active", joinedAt: "2026-02-03" },
  { id: "3", name: "Board Seat", email: "board@company.com", role: "Board", status: "Invited", joinedAt: null },
]

const MOCK_ORG_ROWS: OrganizationMemberRow[] = [
  {
    id: "1",
    name: "Raul Vieira",
    email: "raul@redrise.app",
    globalRole: "Owner",
    workspaceRoles: [{ workspaceId: "ops", workspaceName: "Operations", role: "Owner" }],
    processes: [{ processId: "revops", processName: "Revenue Ops" }],
    teams: ["Leadership", "Operations"],
    status: "Active",
    lastActivityAt: "Today",
  },
  {
    id: "2",
    name: "Ana Martins",
    email: "ana@redrise.app",
    globalRole: "Admin",
    workspaceRoles: [{ workspaceId: "growth", workspaceName: "Growth", role: "Admin" }],
    processes: [{ processId: "onboarding", processName: "Customer Onboarding" }],
    teams: ["Growth"],
    status: "Active",
    lastActivityAt: "Yesterday",
  },
]

const MOCK_INTEGRATIONS: SettingsIntegration[] = [
  { id: "slack", provider: "Slack", category: "communication", status: "Disconnected" },
  { id: "drive", provider: "Google Drive", category: "storage", status: "Connected", connectedBy: "Raul Vieira", connectedAt: "2026-06-20", lastSyncAt: "2 hours ago" },
  { id: "openrouter", provider: "OpenRouter", category: "ai", status: "Error", connectedBy: "Ana Martins", connectedAt: "2026-06-25", lastSyncAt: "Failed yesterday" },
]

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: true,
  inApp: true,
  teamUpdates: true,
  workspaceUpdates: true,
  processUpdates: true,
  actionUpdates: true,
  productUpdates: false,
}

function getSection(value: string | null): SettingsSection {
  return SETTINGS_SECTIONS.includes(value as SettingsSection) ? (value as SettingsSection) : "profile"
}

export default function SettingsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const openSection = getSection(searchParams.get("section"))

  const handleSectionChange = (value: unknown[]) => {
    const next = getSection(String(value[0] ?? "profile"))
    router.replace(`/settings?section=${next}`, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Accordion value={[openSection]} onValueChange={handleSectionChange} className="rounded-xl border bg-card px-4 shadow-sm">
        <SettingsAccordionItem value="profile" icon={<UserIcon className="size-4" />} title={t("settings.profile.title")} description={t("settings.profile.description")}>
          <ProfileSection />
        </SettingsAccordionItem>
        <SettingsAccordionItem value="team" icon={<UsersIcon className="size-4" />} title={t("settings.team.title")} description={t("settings.team.description")}>
          <TeamSection />
        </SettingsAccordionItem>
        <SettingsAccordionItem value="notification" icon={<BellIcon className="size-4" />} title={t("settings.notification.title")} description={t("settings.notification.description")}>
          <NotificationSection />
        </SettingsAccordionItem>
        <SettingsAccordionItem value="integration" icon={<PlugZapIcon className="size-4" />} title={t("settings.integration.title")} description={t("settings.integration.description")}>
          <IntegrationSection />
        </SettingsAccordionItem>
      </Accordion>
    </div>
  )
}

function SettingsAccordionItem({ value, icon, title, description, children }: { value: SettingsSection; icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <span className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">{icon}</span>
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-semibold">{title}</span>
            <span className="text-sm font-normal text-muted-foreground">{description}</span>
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  )
}

function ProfileSection() {
  const { t } = useI18n()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [initialProfile, setInitialProfile] = React.useState<UserProfile | null>(null)
  const [bio, setBio] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  const loadProfile = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setProfile(null)
        return
      }
      const next = await loadUserProfile({ id: session.user.id, name: session.user.user_metadata?.full_name || session.user.email || "", email: session.user.email || "" })
      setProfile(next)
      setInitialProfile(next)
    } catch {
      toast.error(t("settings.profile.loadError"))
    } finally {
      setLoading(false)
    }
  }, [t])

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadProfile])

  const update = (field: keyof UserProfile, value: string) => {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
  }

  const fullName = profile ? [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") : ""
  const initials = profile ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "U" : "U"

  const handleFullNameChange = (value: string) => {
    if (!profile) return
    const [firstName = "", ...rest] = value.trimStart().split(/\s+/)
    setProfile({ ...profile, firstName, middleName: "", lastName: rest.join(" ") })
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return
    if (!/image\/(jpeg|png|gif)/.test(file.type)) {
      toast.error(t("settings.profile.avatarFormatError"))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("settings.profile.avatarSizeError"))
      return
    }
    const reader = new FileReader()
    reader.onload = () => setProfile({ ...profile, avatarUrl: String(reader.result) })
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const next = await saveUserProfile(profile)
      saveAuthLanguagePreference(next.language)
      setInitialProfile(next)
      window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: next }))
      toast.success(t("settings.profile.saved"))
    } catch {
      toast.error(t("settings.profile.saveError"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <SectionSkeleton />

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {t("settings.profile.noProfile")}
          <Button variant="outline" size="sm" className="ml-3" onClick={() => void loadProfile()}>{t("settings.actions.retry")}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{t("settings.profile.title")}</CardTitle>
        <CardDescription>{t("settings.profile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarImage src={profile.avatarUrl ?? undefined} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Label htmlFor="avatar-upload" className="w-fit">
              <span className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-accent">
                <UploadIcon className="size-4" />
                {t("settings.profile.avatarUpload")}
              </span>
            </Label>
            <Input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/gif" className="sr-only" onChange={handleAvatarUpload} />
            <p className="text-xs text-muted-foreground">{t("settings.profile.avatarHelp")}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("settings.profile.fullName")}><Input value={fullName} onChange={(e) => handleFullNameChange(e.target.value)} /></Field>
          <Field label={t("settings.profile.username")}><Input value={profile.username} onChange={(e) => update("username", e.target.value)} /></Field>
          <Field label={t("settings.profile.email")}><Input value={profile.email} readOnly className="bg-muted" /></Field>
          <Field label={t("settings.profile.language")}><LanguageSelect value={profile.language} onValueChange={(value) => update("language", value)} /></Field>
          <Field label={t("settings.profile.timezone")} className="md:col-span-2"><TimezoneSelect value={profile.timezone} onValueChange={(value) => update("timezone", value)} /></Field>
          <Field label={t("settings.profile.bio")} className="md:col-span-2">
            <Textarea value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} placeholder={t("settings.profile.bioPlaceholder")} />
            <span className="text-xs text-muted-foreground">{bio.length}/160</span>
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { if (initialProfile) setProfile(initialProfile); setBio("") }}>{t("settings.actions.cancel")}</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? t("common.saving") : t("settings.actions.save")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LanguageSelect({ value, onValueChange }: { value: "pt-BR" | "en-US"; onValueChange: (value: "pt-BR" | "en-US") => void }) {
  return (
    <Select value={value} onValueChange={(next) => next && onValueChange(next as "pt-BR" | "en-US")}>
      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="pt-BR">BR Portugues</SelectItem>
        <SelectItem value="en-US">US English</SelectItem>
      </SelectContent>
    </Select>
  )
}

function TimezoneSelect({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) {
  const { t } = useI18n()
  const selected = TIMEZONE_OPTIONS.find((option) => option.value === value)

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        <span className="flex items-center gap-2"><ClockIcon className="size-4" />{selected?.label ?? t("settings.profile.selectTimezone")}</span>
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={t("settings.profile.selectTimezone")} />
          <CommandList>
            <CommandEmpty>{t("settings.profile.noTimezones")}</CommandEmpty>
            {TIMEZONE_REGIONS.map((region, index) => (
              <React.Fragment key={region}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={region}>
                  {TIMEZONE_OPTIONS.filter((option) => option.region === region).map((option) => (
                    <CommandItem key={option.value} value={`${option.label} ${option.value}`} onSelect={() => onValueChange(option.value)}>
                      <span>{option.label}</span>
                      {value === option.value ? <CheckIcon className="ml-auto size-4" /> : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function TeamSection() {
  const { t } = useI18n()
  const [members, setMembers] = React.useState(MOCK_MEMBERS)
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")

  const filteredRows = MOCK_ORG_ROWS.filter((row) => {
    const matchesQuery = `${row.name} ${row.email}`.toLowerCase().includes(query.toLowerCase())
    const matchesRole = roleFilter === "all" || row.globalRole === roleFilter
    return matchesQuery && matchesRole
  })

  return (
    <Accordion defaultValue={["management"]} className="rounded-xl border px-4" multiple>
      <AccordionItem value="management">
        <AccordionTrigger>{t("settings.team.management")}</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{t("settings.team.members")}</CardTitle>
                <CardDescription>{t("settings.team.managementDescription")}</CardDescription>
              </div>
              <Button size="sm" onClick={() => toast.info(t("settings.team.mockAction"))}><PlusIcon className="size-4" />{t("settings.team.inviteMember")}</Button>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src={member.avatarUrl ?? undefined} /><AvatarFallback>{member.name[0]}</AvatarFallback></Avatar>
                    <div><div className="font-medium">{member.name}</div><div className="text-sm text-muted-foreground">{member.email}</div></div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={member.role} onValueChange={(role) => setMembers((items) => items.map((item) => item.id === member.id ? { ...item, role: role as SettingsRole } : item))}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>{ROLE_OPTIONS.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                    </Select>
                    <StatusBadge status={member.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}><MoreHorizontalIcon className="size-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info(t("settings.team.mockAction"))}>{t("settings.team.editMember")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setMembers((items) => items.filter((item) => item.id !== member.id))}>{t("settings.team.removeMember")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="organization">
        <AccordionTrigger>{t("settings.team.organization")}</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.team.organization")}</CardTitle>
              <CardDescription>{t("settings.team.organizationDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1"><SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("settings.team.searchMembers")} /></div>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value ?? "all")}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="all">{t("settings.team.allRoles")}</SelectItem>{ROLE_OPTIONS.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader><TableRow><TableHead>{t("settings.team.member")}</TableHead><TableHead>{t("settings.team.role")}</TableHead><TableHead>{t("settings.team.workspaceRoles")}</TableHead><TableHead>{t("settings.team.processes")}</TableHead><TableHead>{t("settings.team.teams")}</TableHead><TableHead>{t("settings.team.status")}</TableHead><TableHead>{t("settings.team.lastActivity")}</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell><div className="font-medium">{row.name}</div><div className="text-xs text-muted-foreground">{row.email}</div></TableCell>
                        <TableCell><Badge variant="secondary">{row.globalRole}</Badge></TableCell>
                        <TableCell>{row.workspaceRoles.map((role) => `${role.workspaceName}: ${role.role}`).join(", ")}</TableCell>
                        <TableCell>{row.processes.map((process) => process.processName).join(", ")}</TableCell>
                        <TableCell>{row.teams.join(", ")}</TableCell>
                        <TableCell><StatusBadge status={row.status} /></TableCell>
                        <TableCell>{row.lastActivityAt ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function NotificationSection() {
  const { t } = useI18n()
  const [settings, setSettings] = React.useState(DEFAULT_NOTIFICATIONS)
  const rows: Array<[keyof NotificationSettings, string, string]> = [
    ["email", t("settings.notification.email"), t("settings.notification.emailDesc")],
    ["inApp", t("settings.notification.inApp"), t("settings.notification.inAppDesc")],
    ["teamUpdates", t("settings.notification.teamUpdates"), t("settings.notification.teamUpdatesDesc")],
    ["workspaceUpdates", t("settings.notification.workspaceUpdates"), t("settings.notification.workspaceUpdatesDesc")],
    ["processUpdates", t("settings.notification.processUpdates"), t("settings.notification.processUpdatesDesc")],
    ["actionUpdates", t("settings.notification.actionUpdates"), t("settings.notification.actionUpdatesDesc")],
    ["productUpdates", t("settings.notification.productUpdates"), t("settings.notification.productUpdatesDesc")],
  ]

  return (
    <Card>
      <CardHeader><CardTitle>{t("settings.notification.title")}</CardTitle><CardDescription>{t("settings.notification.description")}</CardDescription></CardHeader>
      <CardContent className="divide-y p-0">
        {rows.map(([key, title, description]) => (
          <div key={key} className="flex items-center justify-between gap-4 p-4">
            <div><div className="font-medium">{title}</div><div className="text-sm text-muted-foreground">{description}</div></div>
            <Switch checked={settings[key]} onCheckedChange={(checked) => setSettings((current) => ({ ...current, [key]: checked }))} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function IntegrationSection() {
  const { t } = useI18n()
  const [integrations, setIntegrations] = React.useState(MOCK_INTEGRATIONS)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-muted"><LinkIcon className="size-4" /></span><div><CardTitle className="text-base">{integration.provider}</CardTitle><CardDescription className="capitalize">{integration.category}</CardDescription></div></div>
              <IntegrationStatus status={integration.status} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div>{t("settings.integration.connectedBy")}: {integration.connectedBy ?? "-"}</div>
            <div>{t("settings.integration.lastSync")}: {integration.lastSyncAt ?? "-"}</div>
            <Button variant={integration.status === "Connected" ? "outline" : "default"} onClick={() => setIntegrations((items) => items.map((item) => item.id === integration.id ? { ...item, status: item.status === "Connected" ? "Disconnected" : "Connected", connectedBy: item.connectedBy ?? "Current user", lastSyncAt: "Just now" } : item))}>
              {integration.status === "Connected" ? t("settings.integration.disconnect") : t("settings.integration.connect")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <div className={className}><Label className="mb-2 block">{label}</Label>{children}</div>
}

function SectionSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-40 w-full" /><Skeleton className="h-10 w-40" /></div>
}

function StatusBadge({ status }: { status: "Active" | "Invited" | "Suspended" }) {
  const variant = status === "Active" ? "default" : status === "Invited" ? "secondary" : "destructive"
  return <Badge variant={variant}>{status}</Badge>
}

function IntegrationStatus({ status }: { status: SettingsIntegration["status"] }) {
  const variant = status === "Connected" ? "default" : status === "Error" ? "destructive" : "secondary"
  return <Badge variant={variant}>{status}</Badge>
}
