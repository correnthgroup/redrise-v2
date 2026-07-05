"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GlobeIcon, TerminalIcon } from "lucide-react"
import { toast } from "sonner"

import OrbitingCirclesDemo from "@/components/shadcn-space/orbiting-circles/orbiting-circles-01"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "@/components/ui/required-label"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { AUTH_LANGUAGE_OPTIONS, isLocale, loadAuthLanguagePreference, saveAuthLanguagePreference } from "@/lib/auth-language"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { t as translate, type Locale } from "@/lib/i18n"
import { loadUserProfile, registerActiveSession, saveUserProfile } from "@/lib/user-profile"

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function authErrorMessage(message: string, t: (key: string) => string) {
  const normalized = message.toLowerCase()
  if (normalized.includes("invalid") || normalized.includes("credentials")) return t("auth.signIn.invalidCredentials")
  if (normalized.includes("rate") || normalized.includes("too many")) return t("auth.error.rateLimit")
  if (normalized.includes("fetch") || normalized.includes("network")) return t("auth.error.network")
  return t("auth.signIn.error")
}

function AuthSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-live="polite">
      <div className="grid gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-4 w-44 justify-self-center" />
    </div>
  )
}

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  accountCreated?: boolean
  redirectTo?: string
}

export function LoginForm({ className, accountCreated = false, redirectTo = "/workstation", ...props }: LoginFormProps) {
  const router = useRouter()
  const [language, setLanguage] = React.useState<Locale>("en-US")
  const [languageChanging, setLanguageChanging] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [comingSoonOpen, setComingSoonOpen] = React.useState(false)
  const [comingSoonProvider, setComingSoonProvider] = React.useState("")
  const t = React.useCallback(
    (key: string, params?: Record<string, string | number>) => translate(language, key, params),
    [language],
  )

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const preferredLanguage = loadAuthLanguagePreference()
      if (preferredLanguage !== language) setLanguage(preferredLanguage)
    }, 0)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/workstation")
    }).catch(() => {})

    return () => window.clearTimeout(timer)
  }, [language, router])

  const handleLanguageChange = (value: string | null) => {
    if (!isLocale(value) || value === language) return
    saveAuthLanguagePreference(value)
    setLanguageChanging(true)
    window.setTimeout(() => {
      setLanguage(value)
      setLanguageChanging(false)
    }, 240)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      toast.error(t("auth.requiredField"))
      return
    }
    if (!isValidEmail(trimmedEmail)) {
      toast.error(t("auth.invalidEmail"))
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      if (error) {
        toast.error(authErrorMessage(error.message, t))
        setLoading(false)
        return
      }
      if (!data.user || !data.session) {
        toast.error(t("auth.signIn.error"))
        setLoading(false)
        return
      }

      await registerActiveSession({ user: data.user, session: data.session, remembered: false, source: "password" })
      const profile = await loadUserProfile({
        id: data.user.id,
        name: String(data.user.user_metadata?.full_name || data.user.email || ""),
        email: data.user.email || trimmedEmail,
      })
      if (profile.language !== language) await saveUserProfile({ ...profile, language })

      toast.success(t("auth.signIn.success"))
      router.replace(redirectTo)
      router.refresh()
    } catch {
      toast.error(t("auth.signIn.error"))
      setLoading(false)
    }
  }

  const handleProviderClick = (provider: string) => {
    setComingSoonProvider(provider)
    setComingSoonOpen(true)
  }

  return (
    <div className={cn("grid w-full lg:grid-cols-2", className)} {...props}>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-start justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TerminalIcon className="size-4" />
            </div>
            <span>Redrise</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={loading || languageChanging}
                  aria-label={t("auth.language.select")}
                />
              }
            >
              <GlobeIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {AUTH_LANGUAGE_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => handleLanguageChange(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {languageChanging ? <AuthSkeleton /> : (
              <form onSubmit={handleLogin} className="grid gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">{t("auth.signIn.title")}</h1>
                  <p className="text-balance text-sm text-muted-foreground">{t("auth.signIn.subtitle")}</p>
                </div>

                {accountCreated ? (
                  <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    {t("auth.signIn.created")}
                  </div>
                ) : null}

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <RequiredLabel htmlFor="email">{t("auth.email")}</RequiredLabel>
                    <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <RequiredLabel htmlFor="password">{t("auth.password")}</RequiredLabel>
                      <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                        {t("auth.signIn.forgotPassword")}
                      </Link>
                    </div>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Spinner className="mr-1" />}
                    {loading ? t("auth.signIn.loading") : t("auth.signIn.submit")}
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">{t("auth.signIn.continueWith")}</span>
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={() => handleProviderClick("GitHub")}>
                  {t("auth.signIn.socialProvider")}
                </Button>

                <div className="text-center text-sm">
                  {t("auth.signIn.noAccount")} <Link href="/signup" className="underline underline-offset-4">{t("auth.signIn.signUp")}</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="hidden items-center justify-center bg-background lg:flex">
        <OrbitingCirclesDemo />
      </div>

      <Dialog open={comingSoonOpen} onOpenChange={setComingSoonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("auth.providerComingSoon.title")}</DialogTitle>
            <DialogDescription>{t("auth.providerComingSoon.description", { provider: comingSoonProvider })}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
