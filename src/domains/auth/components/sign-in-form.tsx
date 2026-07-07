"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { signInSchema } from "@/domains/auth/schemas/auth.schemas"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signInSchema.safeParse({ email, password })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your login details.")
      return
    }

    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured.")
      return
    }

    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword(parsed.data)

    if (authError) {
      setLoading(false)
      setError("Invalid email or password.")
      toast.error("Invalid email or password.")
      return
    }

    toast.success("Welcome back.")
    router.replace("/my-business/workstation")
    router.refresh()
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-balance text-sm text-muted-foreground">Login to your RedRise account</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner className="mr-1" /> : null}
        {loading ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
