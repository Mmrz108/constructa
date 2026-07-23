import "server-only"
import type { OrgSettings } from "@/lib/settings/types"

/**
 * Future report translation helper — reads OpenAI config from Settings hub.
 * Returns null when AI is not configured / auto-translate is off.
 */
export function getAiConfig(settings: OrgSettings) {
  if (!settings.ai.openaiApiKey || settings.ai.openaiApiKey.includes("•")) {
    return null
  }
  return {
    apiKey: settings.ai.openaiApiKey,
    model: settings.ai.openaiModel || "gpt-4o-mini",
    autoTranslate: settings.ai.autoTranslate,
    defaultReportLocale: settings.ai.defaultReportLocale,
  }
}
