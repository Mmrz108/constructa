"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  LOCALES,
  NAV_SECTION_KEYS,
  NAV_TITLE_KEYS,
  t as translate,
  type Locale,
} from "@/lib/i18n/dictionary"

const STORAGE_KEY = "bonyan-locale"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  navTitle: (englishTitle: string) => string
  navSection: (englishLabel: string) => string
  dir: "ltr" | "rtl"
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return
  document.documentElement.lang = locale
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
}

export function LocaleProvider({
  children,
  defaultLocale = "en",
}: {
  children: ReactNode
  /** Org default from Settings hub when user has no personal preference. */
  defaultLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved)
      applyDocumentLocale(saved)
    } else if (defaultLocale === "en" || defaultLocale === "ar") {
      setLocaleState(defaultLocale)
      applyDocumentLocale(defaultLocale)
    }
  }, [defaultLocale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    applyDocumentLocale(next)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translate(locale, key),
      navTitle: (englishTitle: string) => {
        const key = NAV_TITLE_KEYS[englishTitle]
        return key ? translate(locale, key) : englishTitle
      },
      navSection: (englishLabel: string) => {
        const key = NAV_SECTION_KEYS[englishLabel]
        return key ? translate(locale, key) : englishLabel
      },
      dir: locale === "ar" ? "rtl" : "ltr",
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return ctx
}

export { LOCALES }
