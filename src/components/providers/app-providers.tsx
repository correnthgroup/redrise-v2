"use client"

import type { ReactNode } from "react"

import { I18nProvider } from "@/components/providers/i18n-context"
import { SonnerProvider } from "@/components/providers/sonner-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <SonnerProvider />
    </I18nProvider>
  )
}
