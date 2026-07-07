"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { signUpSchema } from "@/domains/auth/schemas/auth.schemas"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

function getSignupError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes("already") || normalized.includes("registered") || normalized.includes("exists")) {
    return "An account already exists for this email. Sign in instead."
  }
  return "We couldn't create your account. Try again."
}

export function SignUpForm() {
  const router = useRouter()
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signUpSchema.safeParse({ fullName, email, password, confirmPassword })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your account details.")
      return
    }

    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured.")
      return
    }

    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
          expected_organization_name: "My Business",
        },
      },
    })

    if (authError) {
      const message = getSignupError(authError.message)
      setLoading(false)
      setError(message)
      toast.error(message)
      return
    }

    toast.success("Account created. Setting up My Business...")
    router.replace("/my-business/documentation/onboarding")
    router.refresh()
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your RedRise account</h1>
        <p className="text-balance text-sm text-muted-foreground">Start building your AI workstation</p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner className="mr-1" /> : null}
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
