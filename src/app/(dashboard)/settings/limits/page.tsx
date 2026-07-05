import { redirect } from "next/navigation"

export default function LimitsSettingsRedirect() {
  redirect("/settings?section=integration")
}
