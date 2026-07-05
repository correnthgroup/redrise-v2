"use client"

import { useI18n } from "@/hooks/use-i18n"

export default function IntroductionPage() {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("documentation.introduction.header.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("documentation.introduction.header.subtitle")}</p>
      </div>
    </div>
  )
}
