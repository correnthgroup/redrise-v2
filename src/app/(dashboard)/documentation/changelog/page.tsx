"use client"

import { useI18n } from "@/hooks/use-i18n"

export default function ChangelogPage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("documentation.changelog.header.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("documentation.changelog.header.subtitle")}</p>
      </div>
    </div>
  )
}
