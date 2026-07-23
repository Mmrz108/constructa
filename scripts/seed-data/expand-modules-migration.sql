-- Expansion migration: Users (multi-project), NCR / Defect / Daily Report fields

ALTER TABLE ncr ADD COLUMN IF NOT EXISTS "stageId" integer;
ALTER TABLE ncr ADD COLUMN IF NOT EXISTS "violatedStandard" text;
ALTER TABLE ncr ADD COLUMN IF NOT EXISTS "location" text;
ALTER TABLE ncr ADD COLUMN IF NOT EXISTS "priority" text NOT NULL DEFAULT 'medium';
ALTER TABLE ncr ADD COLUMN IF NOT EXISTS "attachments" jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE defect ADD COLUMN IF NOT EXISTS "stageId" integer;
ALTER TABLE defect ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE defect ADD COLUMN IF NOT EXISTS "beforePhotoUrls" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE defect ADD COLUMN IF NOT EXISTS "afterPhotoUrls" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE defect ADD COLUMN IF NOT EXISTS "closeApprovedBy" text;
ALTER TABLE defect ADD COLUMN IF NOT EXISTS "closeApprovedAt" timestamp without time zone;

ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "stageId" integer;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "tomorrowPlan" text;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "equipment" text;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "problemsRisks" text;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "incidents" text;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "photoUrls" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "supervisorSignature" text;
ALTER TABLE daily_report ADD COLUMN IF NOT EXISTS "signedAt" timestamp without time zone;

CREATE TABLE IF NOT EXISTS project_membership (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "userId" text NOT NULL,
  role text NOT NULL DEFAULT 'supervisor',
  "createdAt" timestamp without time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS project_membership_unique
  ON project_membership ("orgId", "projectId", "userId", role);

-- Normalize legacy org roles toward the new set
UPDATE membership SET role = 'client' WHERE role = 'owner';
UPDATE membership SET role = 'project_manager' WHERE role = 'manager';
UPDATE membership SET role = 'supervisor' WHERE role = 'inspector';
