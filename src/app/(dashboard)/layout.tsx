import * as React from "react"
import { redirect } from "next/navigation"

import { AppLayout } from "@/components/app-layout"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return <AppLayout>{children}</AppLayout>
}
