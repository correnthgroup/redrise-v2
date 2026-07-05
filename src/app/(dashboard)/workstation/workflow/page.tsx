"use client"

import { useI18n } from "@/hooks/use-i18n"

export default function WorkflowPage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("workstation.workflow.header.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("workstation.workflow.header.subtitle")}</p>
      </div>
    </div>
  )
}
