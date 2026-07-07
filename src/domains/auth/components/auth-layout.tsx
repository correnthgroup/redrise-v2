import Link from "next/link"
import type { ReactNode } from "react"

import { AuthGradientVisual } from "@/domains/auth/components/auth-gradient-visual"

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
          <div className="grid md:grid-cols-2">
            <section className="flex min-h-[560px] flex-col p-6 md:p-10">
              <Link href="/" className="mb-10 text-sm font-semibold tracking-tight">
                RedRise
              </Link>
              <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-sm">{children}</div>
              </div>
            </section>
            <AuthGradientVisual />
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to RedRise Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
