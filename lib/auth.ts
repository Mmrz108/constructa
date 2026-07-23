import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"

function getBaseURL() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.V0_RUNTIME_URL || "http://localhost:3000"
}

const trustedOrigins = [
  process.env.V0_RUNTIME_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  // v0 preview + Vercel deploy previews are served from these wildcard hosts.
  "http://localhost:3000",
  "https://*.vercel.run",
  "https://*.vercel.app",
].filter(Boolean) as string[]

export const auth = betterAuth({
  database: pool,
  baseURL: getBaseURL(),
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  // Local HTTP needs lax/non-secure cookies. sameSite=none+secure breaks localhost.
  advanced:
    process.env.NODE_ENV === "development"
      ? {
          defaultCookieAttributes: {
            sameSite: "lax",
            secure: false,
          },
        }
      : undefined,
})
