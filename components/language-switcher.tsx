"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALES, useLocale } from "@/components/locale-provider"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const current = LOCALES.find((l) => l.value === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">
              {current?.native ?? t("lang.switch")}
            </span>
            <span className="sm:hidden uppercase">{locale}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.value}
            onClick={() => setLocale(l.value)}
            className={locale === l.value ? "bg-accent" : undefined}
          >
            {l.native}
            <span className="ms-auto text-xs text-muted-foreground">
              {l.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
