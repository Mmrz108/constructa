ALTER TABLE inspection_item ADD COLUMN IF NOT EXISTS "questionType" text NOT NULL DEFAULT 'pass_fail';
ALTER TABLE inspection_item ADD COLUMN IF NOT EXISTS "answer" jsonb;
ALTER TABLE inspection_item ADD COLUMN IF NOT EXISTS "photoUrls" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE inspection_item ADD COLUMN IF NOT EXISTS "options" jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE inspection_item ADD COLUMN IF NOT EXISTS "requirePhoto" boolean NOT NULL DEFAULT false;

ALTER TABLE checklist_template ADD COLUMN IF NOT EXISTS "projectId" integer;

CREATE TABLE IF NOT EXISTS error_report (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer NOT NULL,
  "inspectionId" integer NOT NULL,
  "userId" text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  "createdAt" timestamp without time zone NOT NULL DEFAULT now()
);
