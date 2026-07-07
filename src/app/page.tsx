import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/lib/supabase-server"

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) redirect("/sign-in")

  const { data: { user } } = await supabase.auth.getUser()

  redirect(user ? "/my-business/workstation" : "/sign-in")
}
