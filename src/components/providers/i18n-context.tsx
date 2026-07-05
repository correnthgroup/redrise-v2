"use client"

import { createContext, useContext } from "react"
import { t as translate, type Locale } from "@/lib/i18n"

type I18nContextValue = {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  t: (key) => key,
  locale: "en-US",
  setLocale: () => {},
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const t = (key: string, params?: Record<string, string | number>) => {
    return translate("en-US", key, params)
  }

  const setLocale = () => {}

  return (
    <I18nContext.Provider value={{ t, locale: "en-US", setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export { I18nContext }
