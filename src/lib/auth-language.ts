import type { Locale } from '@/lib/i18n'

export const AUTH_LANGUAGE_STORAGE_KEY = 'redrise:preferred-language'

export const AUTH_LANGUAGE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en-US', label: 'English' },
  { value: 'pt-BR', label: 'Português' },
]

export function isLocale(value: unknown): value is Locale {
  return value === 'en-US' || value === 'pt-BR'
}

export function loadAuthLanguagePreference(): Locale {
  if (typeof window === 'undefined') return 'en-US'
  const stored = window.localStorage.getItem(AUTH_LANGUAGE_STORAGE_KEY)
  return isLocale(stored) ? stored : 'en-US'
}

export function saveAuthLanguagePreference(locale: Locale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_LANGUAGE_STORAGE_KEY, locale)
}
