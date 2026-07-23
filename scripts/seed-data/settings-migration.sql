BEGIN;

CREATE TABLE IF NOT EXISTS org_settings (
  "orgId" integer PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "updatedBy" text
);

CREATE TABLE IF NOT EXISTS audit_log (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "userId" text,
  action text NOT NULL,
  module text NOT NULL,
  "entityType" text,
  "entityId" text,
  summary text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_org_created_idx
  ON audit_log ("orgId", "createdAt" DESC);

COMMIT;
