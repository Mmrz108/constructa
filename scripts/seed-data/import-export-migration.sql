BEGIN;

CREATE TABLE IF NOT EXISTS rfi (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "stageId" integer,
  "userId" text NOT NULL,
  number text,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  "assignedTo" text,
  "dueDate" date,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS variation_order (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "userId" text NOT NULL,
  number text,
  title text NOT NULL,
  description text,
  amount text,
  status text NOT NULL DEFAULT 'draft',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ipc (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "userId" text NOT NULL,
  number text,
  title text NOT NULL,
  "periodFrom" date,
  "periodTo" date,
  amount text,
  status text NOT NULL DEFAULT 'draft',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS data_transfer_job (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "userId" text NOT NULL,
  direction text NOT NULL,
  entity text NOT NULL,
  source text NOT NULL DEFAULT 'file',
  "fileName" text,
  status text NOT NULL DEFAULT 'completed',
  "importedCount" integer NOT NULL DEFAULT 0,
  "skippedCount" integer NOT NULL DEFAULT 0,
  "errorCount" integer NOT NULL DEFAULT 0,
  report jsonb NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

COMMIT;
