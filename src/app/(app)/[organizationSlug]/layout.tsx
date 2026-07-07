import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { createSupabaseServerClient } from "@/lib/supabase-server"

type OrganizationLayoutProps = {
  children: ReactNode
  params: Promise<{ organizationSlug: string }>
}

export default async function OrganizationLayout({ children, params }: OrganizationLayoutProps) {
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/sign-in")

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/sign-in")

  const { organizationSlug } = await params

  return <AppShell organizationSlug={organizationSlug}>{children}</AppShell>
}
