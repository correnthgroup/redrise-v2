"use client"

import { useI18n } from "@/hooks/use-i18n"

export default function EnginePage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("agents.engine.header.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("agents.engine.header.subtitle")}</p>
      </div>
    </div>
  )
}
