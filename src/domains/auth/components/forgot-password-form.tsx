"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { forgotPasswordSchema } from "@/domains/auth/schemas/auth.schemas"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const validEmail = forgotPasswordSchema.safeParse({ email }).success

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = forgotPasswordSchema.safeParse({ email })
    if (!parsed.success) return

    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured.")
      return
    }

    setLoading(true)
    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo })
    setLoading(false)

    if (error) {
      toast.error("We couldn't send the reset link. Try again.")
      return
    }

    toast.success("If this email exists, reset instructions have been sent.")
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password?</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you instructions to reset your password
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>

      <Button type="submit" className="w-full" disabled={!validEmail || loading}>
        {loading ? <Spinner className="mr-1" /> : null}
        {loading ? "Sending reset link..." : "Send reset link"}
      </Button>

      <Link href="/sign-in" className="text-center text-sm font-medium underline-offset-4 hover:underline">
        Back to sign in
      </Link>
    </form>
  )
}
