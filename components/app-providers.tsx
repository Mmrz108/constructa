"use client"

import { LocaleProvider } from "@/components/locale-provider"
import type { Locale } from "@/lib/i18n/dictionary"
import { DEFAULT_ORG_SETTINGS } from "@/lib/settings/defaults"
import type { OrgSettings } from "@/lib/settings/types"
import {
  createContext,
  useContext,
  type ReactNode,
} from "react"

const OrgSettingsContext = createContext<OrgSettings>(DEFAULT_ORG_SETTINGS)

export function useOrgSettings() {
  return useContext(OrgSettingsContext)
}

export function AppProviders({
  children,
  settings,
}: {
  children: ReactNode
  /** When omitted (e.g. sign-in), built-in defaults are used. */
  settings?: OrgSettings
}) {
  const value = settings ?? DEFAULT_ORG_SETTINGS
  return (
    <OrgSettingsContext.Provider value={value}>
      <LocaleProvider defaultLocale={value.general.defaultLanguage as Locale}>
        {children}
      </LocaleProvider>
    </OrgSettingsContext.Provider>
  )
}
