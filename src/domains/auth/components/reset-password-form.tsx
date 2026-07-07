"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { resetPasswordSchema } from "@/domains/auth/schemas/auth.schemas"
import { isSupabaseConfigured, supabase } from "@/lib/supabase"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your password.")
      return
    }

    if (!isSupabaseConfigured) {
      toast.error("Supabase is not configured.")
      return
    }

    setError(null)
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: parsed.data.password })
    setLoading(false)

    if (updateError) {
      toast.error("We couldn't refresh your password. Try again.")
      return
    }

    toast.success("Password refreshed successfully.")
    router.replace("/sign-in")
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Time for a fresh start! Go ahead and set a new password.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="********" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" placeholder="********" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner className="mr-1" /> : null}
        {loading ? "Refreshing password..." : "Refresh Password"}
      </Button>
    </form>
  )
}
