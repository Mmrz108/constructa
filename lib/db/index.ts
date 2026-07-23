import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

/**
 * Single shared pool for the whole app (Drizzle + Better Auth).
 * Cached on globalThis so Next.js HMR does not open a new pool every reload.
 */
const globalForDb = globalThis as unknown as { __bonyanPgPool?: Pool }

export const pool =
  globalForDb.__bonyanPgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDb.__bonyanPgPool = pool
}

export const db = drizzle(pool, { schema })
