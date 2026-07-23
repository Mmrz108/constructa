"use client"

import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ORG_ROLES,
  ROLE_LABELS,
  type OrgRole,
} from "@/lib/roles"
import {
  SETTING_ACTIONS,
  SETTING_MODULES,
  type OrgSettings,
  type SettingAction,
  type SettingModule,
} from "@/lib/settings/types"
import {
  saveSettingsSection,
  uploadSettingsAsset,
} from "@/app/actions/settings"
import {
  Building2,
  Bell,
  FileText,
  KeyRound,
  Languages,
  ScrollText,
  Shield,
  SlidersHorizontal,
  ArrowLeftRight,
} from "lucide-react"

type AuditRow = {
  id: number
  action: string
  module: string
  summary: string | null
  createdAt: Date | string
  userId: string | null
}

const MODULE_LABELS: Record<SettingModule, string> = {
  projects: "Projects",
  users: "Users",
  stages: "Stages",
  inspections: "Inspections",
  ncrs: "NCRs",
  defects: "Defects & Snags",
  daily_reports: "Daily Reports",
  rfis: "RFI",
  vos: "VO",
  ipcs: "IPC",
  settings: "Settings",
  import_export: "Import / Export",
}

export function SettingsHub({
  initial,
  isAdmin,
  auditLogs,
}: {
  initial: OrgSettings
  isAdmin: boolean
  auditLogs: AuditRow[]
}) {
  const [settings, setSettings] = useState(initial)
  const [pending, startTransition] = useTransition()
  const [active, setActive] = useState<
    | "general"
    | "company"
    | "permissions"
    | "notifications"
    | "reports"
    | "ai"
    | "importExport"
    | "audit"
  >("general")

  function saveSection<K extends keyof OrgSettings>(section: K, value: OrgSettings[K]) {
    startTransition(async () => {
      const res = await saveSettingsSection(section, value)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      setSettings(res.settings)
      toast.success("Settings saved")
    })
  }

  if (!isAdmin) {
    return (
      <Card className="gap-3 p-5">
        <p className="text-sm font-medium">Read-only settings</p>
        <p className="text-sm text-muted-foreground">
          Only organization admins can change the settings hub. Current defaults:
          language <strong>{settings.general.defaultLanguage}</strong>, timezone{" "}
          <strong>{settings.general.timezone}</strong>, currency{" "}
          <strong>{settings.general.currency}</strong>.
        </p>
      </Card>
    )
  }

  const sections = [
    { value: "general", label: "General", icon: SlidersHorizontal },
    { value: "company", label: "Company", icon: Building2 },
    { value: "permissions", label: "Roles", icon: Shield },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "reports", label: "Reports", icon: FileText },
    { value: "ai", label: "AI / Translation", icon: Languages },
    { value: "importExport", label: "Import / Export", icon: ArrowLeftRight },
    { value: "audit", label: "Audit logs", icon: ScrollText },
  ] as const

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
      <nav className="w-full shrink-0 rounded-lg border bg-card p-2 md:w-56">
        <ul className="flex flex-col gap-0.5">
          {sections.map((s) => {
            const Icon = s.icon
            const selected = active === s.value
            return (
              <li key={s.value}>
                <button
                  type="button"
                  onClick={() => setActive(s.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-start text-sm transition-colors",
                    selected
                      ? "bg-primary/10 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        {active === "general" && (
          <GeneralForm
            value={settings.general}
            pending={pending}
            onSave={(v) => saveSection("general", v)}
          />
        )}
        {active === "company" && (
          <CompanyForm
            value={settings.company}
            pending={pending}
            onSave={(v) => saveSection("company", v)}
            onUploaded={(url) =>
              setSettings((s) => ({
                ...s,
                company: { ...s.company, logoUrl: url },
              }))
            }
          />
        )}
        {active === "permissions" && (
          <PermissionsForm
            value={settings.permissions}
            pending={pending}
            onSave={(v) => saveSection("permissions", v)}
          />
        )}
        {active === "notifications" && (
          <NotificationsForm
            value={settings.notifications}
            pending={pending}
            onSave={(v) => saveSection("notifications", v)}
          />
        )}
        {active === "reports" && (
          <ReportsForm
            value={settings.reports}
            pending={pending}
            onSave={(v) => saveSection("reports", v)}
          />
        )}
        {active === "ai" && (
          <AiForm
            value={settings.ai}
            pending={pending}
            onSave={(v) => saveSection("ai", v)}
          />
        )}
        {active === "importExport" && (
          <ImportExportForm
            value={settings.importExport}
            pending={pending}
            onSave={(v) => saveSection("importExport", v)}
          />
        )}
        {active === "audit" && <AuditPanel logs={auditLogs} />}
      </div>
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="gap-4 p-4 sm:p-5">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      {children}
    </Card>
  )
}

function GeneralForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["general"]
  pending: boolean
  onSave: (v: OrgSettings["general"]) => void
}) {
  const [form, setForm] = useState(value)
  return (
    <SectionCard
      title="General defaults"
      description="Language, timezone, date format, measurement and currency used across the whole application."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Default language">
          <Select
            value={form.defaultLanguage}
            onValueChange={(v) =>
              setForm((f) => ({ ...f, defaultLanguage: (v as "en" | "ar") ?? "en" }))
            }
            items={[
              { value: "en", label: "English" },
              { value: "ar", label: "Arabic" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Timezone">
          <Input
            value={form.timezone}
            onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            placeholder="Asia/Muscat"
          />
        </Field>
        <Field label="Date format">
          <Select
            value={form.dateFormat}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                dateFormat: (v as OrgSettings["general"]["dateFormat"]) ?? "DD/MM/YYYY",
              }))
            }
            items={[
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Measurement unit">
          <Select
            value={form.measurementUnit}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                measurementUnit: (v as "metric" | "imperial") ?? "metric",
              }))
            }
            items={[
              { value: "metric", label: "Metric (m, m²)" },
              { value: "imperial", label: "Imperial (ft, ft²)" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (m, m²)</SelectItem>
              <SelectItem value="imperial">Imperial (ft, ft²)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Currency code">
          <Input
            value={form.currency}
            onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            placeholder="OMR"
          />
        </Field>
        <Field label="Currency symbol">
          <Input
            value={form.currencySymbol}
            onChange={(e) =>
              setForm((f) => ({ ...f, currencySymbol: e.target.value }))
            }
            placeholder="ر.ع."
          />
        </Field>
      </div>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save general defaults
      </Button>
    </SectionCard>
  )
}

function CompanyForm({
  value,
  pending,
  onSave,
  onUploaded,
}: {
  value: OrgSettings["company"]
  pending: boolean
  onSave: (v: OrgSettings["company"]) => void
  onUploaded: (url: string) => void
}) {
  const [form, setForm] = useState(value)

  function onLogo(file: File | null) {
    if (!file) return
    const fd = new FormData()
    fd.set("file", file)
    fd.set("kind", "company-logo")
    startUpload(fd, (url) => {
      setForm((f) => ({ ...f, logoUrl: url }))
      onUploaded(url)
    })
  }

  return (
    <SectionCard
      title="Company info"
      description="Applied automatically to PDF reports and document headers."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name (EN)">
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field label="Company name (AR)">
          <Input
            value={form.nameAr}
            onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
            dir="rtl"
          />
        </Field>
        <Field label="Address (EN)">
          <Textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
        </Field>
        <Field label="Address (AR)">
          <Textarea
            value={form.addressAr}
            onChange={(e) => setForm((f) => ({ ...f, addressAr: e.target.value }))}
            dir="rtl"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </Field>
        <Field label="Email">
          <Input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </Field>
        <Field label="Website">
          <Input
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
          />
        </Field>
        <Field label="CR number">
          <Input
            value={form.crNumber}
            onChange={(e) => setForm((f) => ({ ...f, crNumber: e.target.value }))}
          />
        </Field>
        <Field label="Logo">
          <div className="flex flex-col gap-2">
            {form.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.logoUrl}
                alt="Company logo"
                className="h-12 w-auto object-contain"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onLogo(e.target.files?.[0] ?? null)}
            />
          </div>
        </Field>
      </div>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save company info
      </Button>
    </SectionCard>
  )
}

function startUpload(fd: FormData, onOk: (url: string) => void) {
  void uploadSettingsAsset(fd).then((res) => {
    if (!res.ok) toast.error(res.error)
    else {
      toast.success("File uploaded")
      onOk(res.url)
    }
  })
}

function PermissionsForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["permissions"]
  pending: boolean
  onSave: (v: OrgSettings["permissions"]) => void
}) {
  const [matrix, setMatrix] = useState(value)
  const [role, setRole] = useState<OrgRole>("supervisor")

  const roleItems = useMemo(
    () =>
      ORG_ROLES.map((r) => ({
        value: r,
        label: `${ROLE_LABELS[r].en} / ${ROLE_LABELS[r].ar}`,
      })),
    [],
  )

  function toggle(module: SettingModule, action: SettingAction) {
    setMatrix((m) => {
      const current = new Set(m[role][module] ?? [])
      if (current.has(action)) current.delete(action)
      else current.add(action)
      return {
        ...m,
        [role]: {
          ...m[role],
          [module]: Array.from(current) as SettingAction[],
        },
      }
    })
  }

  return (
    <SectionCard
      title="Roles & permissions"
      description="Central access matrix. Projects, Users, Inspections, RFI, NCR, Defects, VO and IPC should follow these rules."
    >
      <Field label="Role">
        <Select
          value={role}
          onValueChange={(v) => setRole((v as OrgRole) ?? "supervisor")}
          items={roleItems}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleItems.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              {SETTING_ACTIONS.map((a) => (
                <TableHead key={a} className="text-center capitalize">
                  {a}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {SETTING_MODULES.map((mod) => (
              <TableRow key={mod}>
                <TableCell className="font-medium">{MODULE_LABELS[mod]}</TableCell>
                {SETTING_ACTIONS.map((action) => {
                  const checked = (matrix[role][mod] ?? []).includes(action)
                  return (
                    <TableCell key={action} className="text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={checked}
                        onChange={() => toggle(mod, action)}
                        aria-label={`${mod} ${action}`}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button disabled={pending} onClick={() => onSave(matrix)}>
        Save permissions
      </Button>
    </SectionCard>
  )
}

function NotificationsForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["notifications"]
  pending: boolean
  onSave: (v: OrgSettings["notifications"]) => void
}) {
  const [form, setForm] = useState(value)
  const toggles: { key: keyof OrgSettings["notifications"]; label: string }[] = [
    { key: "emailEnabled", label: "Email notifications" },
    { key: "inAppEnabled", label: "In-app notifications" },
    { key: "notifyOnInspection", label: "Inspections" },
    { key: "notifyOnNcr", label: "NCRs" },
    { key: "notifyOnDefect", label: "Defects & Snags" },
    { key: "notifyOnDailyReport", label: "Daily reports" },
    { key: "notifyOnRfi", label: "RFI" },
    { key: "notifyOnVo", label: "VO" },
    { key: "notifyOnIpc", label: "IPC" },
    { key: "digestDaily", label: "Daily digest email" },
  ]

  return (
    <SectionCard
      title="Notifications"
      description="Email and in-app alert preferences used by quality and commercial modules."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {toggles.map((t) => (
          <label
            key={t.key}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={Boolean(form[t.key])}
              onChange={(e) =>
                setForm((f) => ({ ...f, [t.key]: e.target.checked }))
              }
            />
            {t.label}
          </label>
        ))}
      </div>
      <Field label="From email">
        <Input
          value={form.fromEmail}
          onChange={(e) => setForm((f) => ({ ...f, fromEmail: e.target.value }))}
          placeholder="noreply@bonyan-om.com"
        />
      </Field>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save notifications
      </Button>
    </SectionCard>
  )
}

function ReportsForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["reports"]
  pending: boolean
  onSave: (v: OrgSettings["reports"]) => void
}) {
  const [form, setForm] = useState(value)
  return (
    <SectionCard
      title="Report templates"
      description="Logo, header/footer, signatures and PDF layout (English / English–Arabic)."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PDF template">
          <Select
            value={form.pdfTemplate}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                pdfTemplate: (v as "en" | "en_ar") ?? "en_ar",
              }))
            }
            items={[
              { value: "en", label: "English only" },
              { value: "en_ar", label: "English + Arabic" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English only</SelectItem>
              <SelectItem value="en_ar">English + Arabic</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={form.showCompanyOnPdf}
            onChange={(e) =>
              setForm((f) => ({ ...f, showCompanyOnPdf: e.target.checked }))
            }
          />
          Apply company info on PDF
        </label>
        <Field label="Header (EN)">
          <Input
            value={form.headerEn}
            onChange={(e) => setForm((f) => ({ ...f, headerEn: e.target.value }))}
          />
        </Field>
        <Field label="Header (AR)">
          <Input
            value={form.headerAr}
            onChange={(e) => setForm((f) => ({ ...f, headerAr: e.target.value }))}
            dir="rtl"
          />
        </Field>
        <Field label="Footer (EN)">
          <Input
            value={form.footerEn}
            onChange={(e) => setForm((f) => ({ ...f, footerEn: e.target.value }))}
          />
        </Field>
        <Field label="Footer (AR)">
          <Input
            value={form.footerAr}
            onChange={(e) => setForm((f) => ({ ...f, footerAr: e.target.value }))}
            dir="rtl"
          />
        </Field>
        <Field label="Signature label (EN)">
          <Input
            value={form.signatureLabelEn}
            onChange={(e) =>
              setForm((f) => ({ ...f, signatureLabelEn: e.target.value }))
            }
          />
        </Field>
        <Field label="Signature label (AR)">
          <Input
            value={form.signatureLabelAr}
            onChange={(e) =>
              setForm((f) => ({ ...f, signatureLabelAr: e.target.value }))
            }
            dir="rtl"
          />
        </Field>
        <Field label="Report logo URL">
          <Input
            value={form.logoUrl}
            onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
          />
        </Field>
        <Field label="Signature image URL">
          <Input
            value={form.signatureImageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, signatureImageUrl: e.target.value }))
            }
          />
        </Field>
      </div>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save report templates
      </Button>
    </SectionCard>
  )
}

function AiForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["ai"]
  pending: boolean
  onSave: (v: OrgSettings["ai"]) => void
}) {
  const [form, setForm] = useState(value)
  return (
    <SectionCard
      title="AI & translation"
      description="OpenAI API key and automatic English ↔ Arabic translation for generated reports."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="OpenAI API key">
          <div className="relative">
            <KeyRound className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="ps-8"
              type="password"
              value={form.openaiApiKey}
              onChange={(e) =>
                setForm((f) => ({ ...f, openaiApiKey: e.target.value }))
              }
              placeholder="sk-…"
              autoComplete="off"
            />
          </div>
        </Field>
        <Field label="Model">
          <Input
            value={form.openaiModel}
            onChange={(e) =>
              setForm((f) => ({ ...f, openaiModel: e.target.value }))
            }
            placeholder="gpt-4o-mini"
          />
        </Field>
        <Field label="Default report locale">
          <Select
            value={form.defaultReportLocale}
            onValueChange={(v) =>
              setForm((f) => ({
                ...f,
                defaultReportLocale:
                  (v as OrgSettings["ai"]["defaultReportLocale"]) ?? "en_ar",
              }))
            }
            items={[
              { value: "en", label: "English" },
              { value: "ar", label: "Arabic" },
              { value: "en_ar", label: "English + Arabic" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="en_ar">English + Arabic</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={form.autoTranslate}
            onChange={(e) =>
              setForm((f) => ({ ...f, autoTranslate: e.target.checked }))
            }
          />
          Auto-translate reports EN ↔ AR
        </label>
      </div>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save AI settings
      </Button>
    </SectionCard>
  )
}

function ImportExportForm({
  value,
  pending,
  onSave,
}: {
  value: OrgSettings["importExport"]
  pending: boolean
  onSave: (v: OrgSettings["importExport"]) => void
}) {
  const [form, setForm] = useState(value)
  return (
    <SectionCard
      title="Import / Export"
      description="Controls for the Admin Import/Export module (Excel, CSV, PDF)."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["allowCsv", "Allow CSV"],
            ["allowXlsx", "Allow Excel (XLSX)"],
            ["allowPdfExport", "Allow PDF export"],
            ["defaultUpsert", "Default upsert on import"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
        <Field label="Max rows per import">
          <Input
            type="number"
            min={100}
            max={50000}
            value={form.maxRows}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxRows: Number(e.target.value) || 5000 }))
            }
          />
        </Field>
        <Field label="Max file size (MB)">
          <Input
            type="number"
            min={1}
            max={50}
            value={form.maxFileMb}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxFileMb: Number(e.target.value) || 8 }))
            }
          />
        </Field>
      </div>
      <Button disabled={pending} onClick={() => onSave(form)}>
        Save import/export settings
      </Button>
    </SectionCard>
  )
}

function AuditPanel({ logs }: { logs: AuditRow[] }) {
  return (
    <SectionCard
      title="Audit logs"
      description="Administrative activity trail (settings changes, imports, uploads)."
    >
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No audit entries yet.</p>
      ) : (
        <div className="max-h-96 overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.summary ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
