--
-- PostgreSQL database dump
--



-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS "session_userId_user_id_fk";
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS "account_userId_user_id_fk";
DROP INDEX IF EXISTS public.project_membership_unique;
DROP INDEX IF EXISTS public.audit_log_org_created_idx;
ALTER TABLE IF EXISTS ONLY public.verification DROP CONSTRAINT IF EXISTS verification_pkey;
ALTER TABLE IF EXISTS ONLY public.variation_order DROP CONSTRAINT IF EXISTS variation_order_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_unique;
ALTER TABLE IF EXISTS ONLY public.site_visit_request DROP CONSTRAINT IF EXISTS site_visit_request_pkey;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_token_unique;
ALTER TABLE IF EXISTS ONLY public.session DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.rfi DROP CONSTRAINT IF EXISTS rfi_pkey;
ALTER TABLE IF EXISTS ONLY public.project DROP CONSTRAINT IF EXISTS project_pkey;
ALTER TABLE IF EXISTS ONLY public.project_membership DROP CONSTRAINT IF EXISTS project_membership_pkey;
ALTER TABLE IF EXISTS ONLY public.progress_snapshot DROP CONSTRAINT IF EXISTS progress_snapshot_pkey;
ALTER TABLE IF EXISTS ONLY public.organization DROP CONSTRAINT IF EXISTS organization_pkey;
ALTER TABLE IF EXISTS ONLY public.org_settings DROP CONSTRAINT IF EXISTS org_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.ncr DROP CONSTRAINT IF EXISTS ncr_pkey;
ALTER TABLE IF EXISTS ONLY public.membership DROP CONSTRAINT IF EXISTS membership_pkey;
ALTER TABLE IF EXISTS ONLY public.ipc DROP CONSTRAINT IF EXISTS ipc_pkey;
ALTER TABLE IF EXISTS ONLY public.inspection DROP CONSTRAINT IF EXISTS inspection_pkey;
ALTER TABLE IF EXISTS ONLY public.inspection_item DROP CONSTRAINT IF EXISTS inspection_item_pkey;
ALTER TABLE IF EXISTS ONLY public.finance_account DROP CONSTRAINT IF EXISTS finance_account_pkey;
ALTER TABLE IF EXISTS ONLY public.error_report DROP CONSTRAINT IF EXISTS error_report_pkey;
ALTER TABLE IF EXISTS ONLY public.email_message DROP CONSTRAINT IF EXISTS email_message_pkey;
ALTER TABLE IF EXISTS ONLY public.directory_contact DROP CONSTRAINT IF EXISTS directory_contact_pkey;
ALTER TABLE IF EXISTS ONLY public.defect DROP CONSTRAINT IF EXISTS defect_pkey;
ALTER TABLE IF EXISTS ONLY public.data_transfer_job DROP CONSTRAINT IF EXISTS data_transfer_job_pkey;
ALTER TABLE IF EXISTS ONLY public.daily_report DROP CONSTRAINT IF EXISTS daily_report_pkey;
ALTER TABLE IF EXISTS ONLY public.checklist_template DROP CONSTRAINT IF EXISTS checklist_template_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_log DROP CONSTRAINT IF EXISTS audit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.account DROP CONSTRAINT IF EXISTS account_pkey;
ALTER TABLE IF EXISTS public.variation_order ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_visit_request ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rfi ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.project_membership ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.project ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.progress_snapshot ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.organization ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ncr ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.membership ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ipc ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inspection_item ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.inspection ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.finance_account ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.error_report ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.email_message ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.directory_contact ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.defect ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.data_transfer_job ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.daily_report ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.checklist_template ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_log ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.verification;
DROP SEQUENCE IF EXISTS public.variation_order_id_seq;
DROP TABLE IF EXISTS public.variation_order;
DROP TABLE IF EXISTS public."user";
DROP SEQUENCE IF EXISTS public.site_visit_request_id_seq;
DROP TABLE IF EXISTS public.site_visit_request;
DROP TABLE IF EXISTS public.session;
DROP SEQUENCE IF EXISTS public.rfi_id_seq;
DROP TABLE IF EXISTS public.rfi;
DROP SEQUENCE IF EXISTS public.project_membership_id_seq;
DROP TABLE IF EXISTS public.project_membership;
DROP SEQUENCE IF EXISTS public.project_id_seq;
DROP TABLE IF EXISTS public.project;
DROP SEQUENCE IF EXISTS public.progress_snapshot_id_seq;
DROP TABLE IF EXISTS public.progress_snapshot;
DROP SEQUENCE IF EXISTS public.organization_id_seq;
DROP TABLE IF EXISTS public.organization;
DROP TABLE IF EXISTS public.org_settings;
DROP SEQUENCE IF EXISTS public.ncr_id_seq;
DROP TABLE IF EXISTS public.ncr;
DROP SEQUENCE IF EXISTS public.membership_id_seq;
DROP TABLE IF EXISTS public.membership;
DROP SEQUENCE IF EXISTS public.ipc_id_seq;
DROP TABLE IF EXISTS public.ipc;
DROP SEQUENCE IF EXISTS public.inspection_item_id_seq;
DROP TABLE IF EXISTS public.inspection_item;
DROP SEQUENCE IF EXISTS public.inspection_id_seq;
DROP TABLE IF EXISTS public.inspection;
DROP SEQUENCE IF EXISTS public.finance_account_id_seq;
DROP TABLE IF EXISTS public.finance_account;
DROP SEQUENCE IF EXISTS public.error_report_id_seq;
DROP TABLE IF EXISTS public.error_report;
DROP SEQUENCE IF EXISTS public.email_message_id_seq;
DROP TABLE IF EXISTS public.email_message;
DROP SEQUENCE IF EXISTS public.directory_contact_id_seq;
DROP TABLE IF EXISTS public.directory_contact;
DROP SEQUENCE IF EXISTS public.defect_id_seq;
DROP TABLE IF EXISTS public.defect;
DROP SEQUENCE IF EXISTS public.data_transfer_job_id_seq;
DROP TABLE IF EXISTS public.data_transfer_job;
DROP SEQUENCE IF EXISTS public.daily_report_id_seq;
DROP TABLE IF EXISTS public.daily_report;
DROP SEQUENCE IF EXISTS public.checklist_template_id_seq;
DROP TABLE IF EXISTS public.checklist_template;
DROP SEQUENCE IF EXISTS public.audit_log_id_seq;
DROP TABLE IF EXISTS public.audit_log;
DROP TABLE IF EXISTS public.account;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp without time zone,
    "refreshTokenExpiresAt" timestamp without time zone,
    scope text,
    password text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "userId" text,
    action text NOT NULL,
    module text NOT NULL,
    "entityType" text,
    "entityId" text,
    summary text,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- Name: checklist_template; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.checklist_template (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    discipline text,
    version integer DEFAULT 1 NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "projectId" integer,
    "supervisorUserId" text
);


--
-- Name: checklist_template_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.checklist_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: checklist_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.checklist_template_id_seq OWNED BY public.checklist_template.id;


--
-- Name: daily_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_report (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    "reportDate" date NOT NULL,
    weather text,
    manpower integer,
    summary text,
    "workDone" text,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "stageId" integer,
    "tomorrowPlan" text,
    equipment text,
    "problemsRisks" text,
    incidents text,
    "photoUrls" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "supervisorSignature" text,
    "signedAt" timestamp without time zone
);


--
-- Name: daily_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_report_id_seq OWNED BY public.daily_report.id;


--
-- Name: data_transfer_job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_transfer_job (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "userId" text NOT NULL,
    direction text NOT NULL,
    entity text NOT NULL,
    source text DEFAULT 'file'::text NOT NULL,
    "fileName" text,
    status text DEFAULT 'completed'::text NOT NULL,
    "importedCount" integer DEFAULT 0 NOT NULL,
    "skippedCount" integer DEFAULT 0 NOT NULL,
    "errorCount" integer DEFAULT 0 NOT NULL,
    report jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: data_transfer_job_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_transfer_job_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_transfer_job_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_transfer_job_id_seq OWNED BY public.data_transfer_job.id;


--
-- Name: defect; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.defect (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    location text,
    trade text,
    status text DEFAULT 'open'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    "assignedTo" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "stageId" integer,
    category text,
    "beforePhotoUrls" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "afterPhotoUrls" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "closeApprovedBy" text,
    "closeApprovedAt" timestamp without time zone
);


--
-- Name: defect_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.defect_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: defect_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.defect_id_seq OWNED BY public.defect.id;


--
-- Name: directory_contact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_contact (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    type text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    "refCode" text,
    notes text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: directory_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.directory_contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: directory_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.directory_contact_id_seq OWNED BY public.directory_contact.id;


--
-- Name: email_message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_message (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    subject text NOT NULL,
    recipient text,
    body text,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: email_message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_message_id_seq OWNED BY public.email_message.id;


--
-- Name: error_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.error_report (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "inspectionId" integer NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: error_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.error_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: error_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.error_report_id_seq OWNED BY public.error_report.id;


--
-- Name: finance_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.finance_account (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "accountType" text,
    title text NOT NULL,
    "accountNumber" text,
    iban text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: finance_account_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.finance_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: finance_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.finance_account_id_seq OWNED BY public.finance_account.id;


--
-- Name: inspection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inspection (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'quality'::text NOT NULL,
    location text,
    discipline text,
    status text DEFAULT 'draft'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    "assignedTo" text,
    "scheduledFor" timestamp without time zone,
    notes text,
    "checklistTemplateId" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: inspection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inspection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inspection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inspection_id_seq OWNED BY public.inspection.id;


--
-- Name: inspection_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inspection_item (
    id integer NOT NULL,
    "inspectionId" integer NOT NULL,
    "userId" text NOT NULL,
    label text NOT NULL,
    result text DEFAULT 'pending'::text NOT NULL,
    comment text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "questionType" text DEFAULT 'pass_fail'::text NOT NULL,
    answer jsonb,
    "photoUrls" jsonb DEFAULT '[]'::jsonb NOT NULL,
    options jsonb DEFAULT '[]'::jsonb NOT NULL,
    "requirePhoto" boolean DEFAULT false NOT NULL,
    "allowText" boolean DEFAULT true NOT NULL
);


--
-- Name: inspection_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inspection_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inspection_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inspection_item_id_seq OWNED BY public.inspection_item.id;


--
-- Name: ipc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ipc (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    number text,
    title text NOT NULL,
    "periodFrom" date,
    "periodTo" date,
    amount text,
    status text DEFAULT 'draft'::text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: ipc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ipc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ipc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ipc_id_seq OWNED BY public.ipc.id;


--
-- Name: membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.membership (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "orgId" integer NOT NULL,
    role text DEFAULT 'supervisor'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: membership_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.membership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.membership_id_seq OWNED BY public.membership.id;


--
-- Name: ncr; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ncr (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    "inspectionId" integer,
    number text,
    title text NOT NULL,
    description text,
    severity text DEFAULT 'minor'::text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    "assignedTo" text,
    "dueDate" date,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "stageId" integer,
    "violatedStandard" text,
    location text,
    priority text DEFAULT 'medium'::text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: ncr_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ncr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ncr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ncr_id_seq OWNED BY public.ncr.id;


--
-- Name: org_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.org_settings (
    "orgId" integer NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedBy" text
);


--
-- Name: organization; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization (
    id integer NOT NULL,
    name text NOT NULL,
    "ownerUserId" text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: organization_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organization_id_seq OWNED BY public.organization.id;


--
-- Name: progress_snapshot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress_snapshot (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    label text NOT NULL,
    planned integer DEFAULT 0 NOT NULL,
    actual integer DEFAULT 0 NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


--
-- Name: progress_snapshot_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.progress_snapshot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_snapshot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_snapshot_id_seq OWNED BY public.progress_snapshot.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    code text,
    client text,
    location text,
    status text DEFAULT 'active'::text NOT NULL,
    "startDate" date,
    "endDate" date,
    description text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    contractor text,
    consultant text,
    "ownerUserId" text,
    "contractorUserId" text,
    "supervisorUserId" text,
    "developerUserId" text,
    "handoverDate" date,
    "progressPlanned" integer DEFAULT 0 NOT NULL,
    "progressActual" integer DEFAULT 0 NOT NULL,
    "imageUrl" text,
    "rejectReason" text
);


--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: project_membership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_membership (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    role text DEFAULT 'supervisor'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: project_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_membership_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_membership_id_seq OWNED BY public.project_membership.id;


--
-- Name: rfi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rfi (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "stageId" integer,
    "userId" text NOT NULL,
    number text,
    title text NOT NULL,
    description text,
    status text DEFAULT 'open'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    "assignedTo" text,
    "dueDate" date,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: rfi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rfi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rfi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rfi_id_seq OWNED BY public.rfi.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


--
-- Name: site_visit_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_visit_request (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer,
    "projectName" text,
    "requesterName" text,
    "visitDate" date,
    "visitTime" text,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: site_visit_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_visit_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_visit_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_visit_request_id_seq OWNED BY public.site_visit_request.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: variation_order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.variation_order (
    id integer NOT NULL,
    "orgId" integer NOT NULL,
    "projectId" integer NOT NULL,
    "userId" text NOT NULL,
    number text,
    title text NOT NULL,
    description text,
    amount text,
    status text DEFAULT 'draft'::text NOT NULL,
    attachments jsonb DEFAULT '[]'::jsonb NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: variation_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.variation_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: variation_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.variation_order_id_seq OWNED BY public.variation_order.id;


--
-- Name: verification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now()
);


--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: checklist_template id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_template ALTER COLUMN id SET DEFAULT nextval('public.checklist_template_id_seq'::regclass);


--
-- Name: daily_report id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_report ALTER COLUMN id SET DEFAULT nextval('public.daily_report_id_seq'::regclass);


--
-- Name: data_transfer_job id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_transfer_job ALTER COLUMN id SET DEFAULT nextval('public.data_transfer_job_id_seq'::regclass);


--
-- Name: defect id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect ALTER COLUMN id SET DEFAULT nextval('public.defect_id_seq'::regclass);


--
-- Name: directory_contact id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact ALTER COLUMN id SET DEFAULT nextval('public.directory_contact_id_seq'::regclass);


--
-- Name: email_message id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_message ALTER COLUMN id SET DEFAULT nextval('public.email_message_id_seq'::regclass);


--
-- Name: error_report id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.error_report ALTER COLUMN id SET DEFAULT nextval('public.error_report_id_seq'::regclass);


--
-- Name: finance_account id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_account ALTER COLUMN id SET DEFAULT nextval('public.finance_account_id_seq'::regclass);


--
-- Name: inspection id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection ALTER COLUMN id SET DEFAULT nextval('public.inspection_id_seq'::regclass);


--
-- Name: inspection_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_item ALTER COLUMN id SET DEFAULT nextval('public.inspection_item_id_seq'::regclass);


--
-- Name: ipc id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ipc ALTER COLUMN id SET DEFAULT nextval('public.ipc_id_seq'::regclass);


--
-- Name: membership id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membership ALTER COLUMN id SET DEFAULT nextval('public.membership_id_seq'::regclass);


--
-- Name: ncr id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ncr ALTER COLUMN id SET DEFAULT nextval('public.ncr_id_seq'::regclass);


--
-- Name: organization id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization ALTER COLUMN id SET DEFAULT nextval('public.organization_id_seq'::regclass);


--
-- Name: progress_snapshot id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_snapshot ALTER COLUMN id SET DEFAULT nextval('public.progress_snapshot_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: project_membership id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_membership ALTER COLUMN id SET DEFAULT nextval('public.project_membership_id_seq'::regclass);


--
-- Name: rfi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rfi ALTER COLUMN id SET DEFAULT nextval('public.rfi_id_seq'::regclass);


--
-- Name: site_visit_request id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visit_request ALTER COLUMN id SET DEFAULT nextval('public.site_visit_request_id_seq'::regclass);


--
-- Name: variation_order id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variation_order ALTER COLUMN id SET DEFAULT nextval('public.variation_order_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('UYZuEbpaapQYwvmligwpKQq3nclhDLtX', 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'credential', 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', NULL, NULL, NULL, NULL, NULL, NULL, '0603c4bdede3e8f24ac56ea36fde28ea:81077320ffaf88d3886dff20b0c0312e9f6fa91262803b8859328bf587d3f493d94d58de5d0b1c90e5a457b69602eda5d6a564f3d7b59ab8825a5d8f0d28dda8', '2026-07-23 13:59:02.431', '2026-07-23 13:59:02.431');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('u5B7aM0wq2Kvgxi6qL7JOJFgs8jimLbB', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'credential', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, NULL, NULL, '22f8a1cbac0651a9c844240e754e13e6:484a5dcf36ba04bcafd1c06f855a6a3dc855cce36ff0409249f0ad3b08b107ad2678d9a154cd06a2c431f8235c32b8e99aec5d10f9b9e7efafbb203ef479c4f9', '2026-07-23 16:11:05.035', '2026-07-23 16:11:05.035');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('44f7ap2uV0z0WpIzS7p0Wv1nwlYhN78D', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'credential', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', NULL, NULL, NULL, NULL, NULL, NULL, '045a06aae5604898118fea44b69bb1e8:f90e0de9f79eda3a80098ed24cf9b55befc02a436d574b19e38e9d0d7334176688af6a7c8f0b060657ad59f6bd778cdf39b3b92ddd87e658ae1b06ca579bd96f', '2026-07-24 00:09:04.679', '2026-07-24 00:09:04.679');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('s8xCLKRtsbLGiLfe10O2A0xrUzkQ5htX', 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'credential', 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', NULL, NULL, NULL, NULL, NULL, NULL, '3137bbc4820cc59d9c102f82baba334b:0d3392facf64ec2eb5d95659fcef037cced69c0727f9cb09958ce054714b9d03989c2cb0a87ad8e1119b237011bb3b7ff1793d0447804fc29b503340f433aa9a', '2026-07-24 00:09:04.851', '2026-07-24 00:09:04.851');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('hRAwGk2oMayVmpH8i3MHwZXyeQVLIUnJ', 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'credential', 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', NULL, NULL, NULL, NULL, NULL, NULL, '8938196f0355d56d34d96c9ae633b171:ad649d927c44f171207ba13cffff4b16c087b6c0920a9f02daf224a876f322178a753d80972c0fc71893f96450dc6f52e8ec2b99973a7e5592b75f9b0ec8e969', '2026-07-24 00:09:05', '2026-07-24 00:09:05');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('I8zMeNAkiebwuTcO7cfevhHYAkrnYxwO', 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'credential', 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', NULL, NULL, NULL, NULL, NULL, NULL, '55d37dbd9d1eef01a4e13a2cbcbbdb3f:cdf9fd34931f0b497afb05e02d45caaedfe9de1bc705e7318d1194079da7b535f6b8c2dfc0b176eda63e63aa46eb769ddc5703170e3952fb6ed040fe17a4eb1f', '2026-07-24 00:09:05.157', '2026-07-24 00:09:05.157');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('TK1B9m4ataANwLeoAmtyaHjPxH7WJWIc', 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'credential', 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', NULL, NULL, NULL, NULL, NULL, NULL, '230171a8f07d29ff0b5939740c299158:81d7fdc3e517d071ff132e09046120a8ea05ec7b80098c31d60ad4cc88d48a9c6377af8c1b439f9a4e9721ade247747ccfc9b50f3ee81ec27aaf3649da25dd44', '2026-07-24 00:09:05.36', '2026-07-24 00:09:05.36');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('Le0ThIDgo729NtmF1WoZGn897i0LnoLz', 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'credential', 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', NULL, NULL, NULL, NULL, NULL, NULL, '8f9b3989ca685cf99c20215fe8ec804b:0de7c7f71544bb4e20260afd1d803130c88ad1b603e84a1beb805dd08caf20b35c9d6f6e05f4e8d661c76d5b4373dd81f22f75ae7fbb3849a5065000a60cbd9e', '2026-07-24 00:09:05.487', '2026-07-24 00:09:05.487');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('ihJGa6l59Q61IkBoChg2DMhe9pq6IOtU', '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'credential', '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', NULL, NULL, NULL, NULL, NULL, NULL, '12aa605be1c5a7ac6948a8b02e022bca:6839bba6cfce70e2acf028f8a98a3523e6310fc75198419604f64dd99552b4e9ca9d69e343de43ad3e7e77cf857782fcedc1687554113a70869808da14cbfdf0', '2026-07-24 00:09:05.637', '2026-07-24 00:09:05.637');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('qbFbki2wyrp6e2HqZuuuxzLVARdum9o9', 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'credential', 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', NULL, NULL, NULL, NULL, NULL, NULL, '1a68a6d2fff5694eea6bbaaa8d1492a6:aff720b0e09c521d00ce156a06c02287f7aab8ab596fdef8b2c4ed6a7acfeac167cc3e5ce3521f98fc6b65eb0d560f67fcb878d84ac5fa293846119bc52cb650', '2026-07-24 01:27:20.594', '2026-07-24 01:27:20.594');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('e1uwXfFAVTJrkfZqgyEa1ViWnyunFsdm', 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'credential', 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', NULL, NULL, NULL, NULL, NULL, NULL, '9a81be56fb451b73ef9fdbbf2ef0fbd6:64dc214797fdc9525b2b731d592425b41f990b6631dfdbbde7a9c2e95d83dafba71b98f3f09269bbbd4f17b9892fd3f0bc69f28744aa8be30e8cddf64e2ad81f', '2026-07-24 01:27:20.703', '2026-07-24 01:27:20.703');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('nHTTGNRv1KTtf9d6tKDwk6driDQCWvfG', 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'credential', 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', NULL, NULL, NULL, NULL, NULL, NULL, 'd4e9a9dd5bd7e49c8813e43aa4c36968:2024c95f080221a9ad3215efbbd10cbe0b42b94c98499bcc237812415291683dc849665a596949fb90b666b85ee65225e064ff61d718cabfead8a3e2241cf206', '2026-07-24 01:27:20.791', '2026-07-24 01:27:20.791');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('zq8rP8NYrvByIChchZMyL7eyuRDJlyt9', '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'credential', '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', NULL, NULL, NULL, NULL, NULL, NULL, 'c40c05eca2c51c882671fca53271f87d:703ad6cecb42d341b5fad5ce09d6f5d575a64705f771f22cd509b3c526fe30b26c49b0f056171af94b9bf5779a0a65720d6c68f3d45436be8e224f04d0858e8b', '2026-07-24 01:27:20.876', '2026-07-24 01:27:20.876');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('ATEcurYn2rStatJabyaqpSsp6libVJmb', 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'credential', 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', NULL, NULL, NULL, NULL, NULL, NULL, 'a8b41e0a18054ffdaf36128511991c7d:41cce7781bce7e13d1087bee4af4faaed778e571fedaa7dec4e827a5ff175b24ba42b94a819ba0fbfd01280f18b36299c5acdd95aae55cb1b97218b70293d39d', '2026-07-24 01:27:20.96', '2026-07-24 01:27:20.96');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('nmLh4zFmBtgzyacaoRy0zb754zTOhDK8', 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'credential', 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', NULL, NULL, NULL, NULL, NULL, NULL, '3cdc3b31ff99491bed0861ebac02ddde:2a3355db253066f592a716bd38922e328d8c178387061d298673378fc92507d570600ef73987f94a0746bf18a4a487cf70edaac0ba4b633992331835aad04941', '2026-07-24 01:27:21.045', '2026-07-24 01:27:21.045');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('5Dn8nRtqsl4DYFAHgpkfMvPQramfdJom', '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'credential', '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', NULL, NULL, NULL, NULL, NULL, NULL, 'a5755d57705e19370b92dd1e7a35a57e:e0dd6767531308e8e3eed37914d139f8fc5ab1f880d4093f43e69611f8cfe1904df0c7577faf76d0470a5fd7e4dd3a0fb9e120628b38d2a46de8ce01e4808632', '2026-07-24 01:27:21.128', '2026-07-24 01:27:21.128');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('ZBYZrZcPuKNSChg5pBul0KPizgjWGwKd', 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'credential', 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', NULL, NULL, NULL, NULL, NULL, NULL, '9de756cfb76ebbd9b713375e5f543d17:33068c50fef375b985d683581d86589be7b6c0c7e68fc9a43a9e19824c9e63751792f077ccb641a2d681555c7185030c2a514e3d90dfb4337f79edf593ee4a5b', '2026-07-24 01:27:21.213', '2026-07-24 01:27:21.213');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('VwkXjOFltQWQgBkQzcKAmUYMdCAUiIhq', 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'credential', 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', NULL, NULL, NULL, NULL, NULL, NULL, '65d4f97403f920994dbe8978e537af8a:fe5192ab80f5912a47fa1f46c0a1f1ccb4d392bf771a981d99e1f2df2bdc15b7161f2c3daf30f7ff3958780d7aa6a88504a6ca018a0ee1299adb6f3ead6aa687', '2026-07-24 01:27:21.301', '2026-07-24 01:27:21.301');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('9ENvhiLTPHJEPF0hmdL0ZgqhtFpfN4LK', '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'credential', '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', NULL, NULL, NULL, NULL, NULL, NULL, '3d8e87b08f1b206cdd60a00f80961b6a:2825da631cf374e3068e3e9aa24a4c66191b3ac689784b3b49d086c9c901bfdf002f1dbf7ae5c2cd7e88d7117d92ef0f242dedbcaf1340e1ca93ab3bb52faff9', '2026-07-24 01:27:21.387', '2026-07-24 01:27:21.387');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('5GRWCxIVMH84BurXH4pE06ZQnmzUhj7I', 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'credential', 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', NULL, NULL, NULL, NULL, NULL, NULL, '8cb4276116da68886c30943d3cce02d8:f2289b1cf6c8f084cfa8d66f959c7f9795238086a65c15d71823b02c111953042807be7974c42f4f76805bbc635cf6088c92d0b5eab3dfa2a44d30ba7a2160c5', '2026-07-24 01:27:21.477', '2026-07-24 01:27:21.477');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('uDIMu4zd9JqZVdNISnsDlEGq7KvZAgtN', 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'credential', 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', NULL, NULL, NULL, NULL, NULL, NULL, 'c3ab75bc663676ce679ce47bbcef129b:9a80aba5621e638d31bddc519967fe5d62f8e27a75506c4fc62f253bc77f3392fac451390a519e3ff4e86cbbcc751610229319fa3e7d17c23e38f8d1855ba0ea', '2026-07-24 01:27:21.561', '2026-07-24 01:27:21.561');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('MtnvLc4BibsiWeij9tuFKMP6NQG1ARdi', 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'credential', 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', NULL, NULL, NULL, NULL, NULL, NULL, '2577446942296247c42100a4ff00ed8c:bdb04461d480846cdade1d8fb1cd3b6b1add0b79836ff74d56b0ef42ad79d03b7e5193a93aff7d0ea428938227c8c31e0b7153f48a629022702f55a8c861d417', '2026-07-24 01:27:21.647', '2026-07-24 01:27:21.647');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('rmWdNBVH3RBH8iTpNqC0XzLqqHdb6lAI', 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'credential', 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', NULL, NULL, NULL, NULL, NULL, NULL, 'a1e37a4722ec837e27ebe3b45e107583:f3c6562eee420a441e1dbb7d59ac507a7886535a2f6f379812118cadd5f470f33e145e12d5c6b30ac557cda10d088ccb82ed0874ee893de8a67f0868f6f43f42', '2026-07-24 01:27:21.738', '2026-07-24 01:27:21.738');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('kpabG6SokKuPmDryRhmk77wfApTeFbm1', 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'credential', 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', NULL, NULL, NULL, NULL, NULL, NULL, 'f3eda7cc21cf0900c14dca11a9c1c513:75f58b45a6550242f91f883b3213fb9d4614b32e7ba58545f54d1da099a775a86b1ea59f7c503c217f6f111a409c64f9b6ee3e2bc3f329142066ba3854a106c5', '2026-07-24 01:27:21.825', '2026-07-24 01:27:21.825');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('9juPdkbaa9oYaAel8alQmEm9NAFxUNPD', 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'credential', 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', NULL, NULL, NULL, NULL, NULL, NULL, '15df82c4283f18ed6a713f0732bf6bdd:69682ea48c891d74a7c292b8b86d7b7fb3f7784c0001c3acafa28f9dd88da841cd43dd5bef23883d6e7ffab76575b016beff05c554517d7d5934c6faa46d6284', '2026-07-24 01:27:21.909', '2026-07-24 01:27:21.909');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('5ZHgxqazTKRkQq8LOb1jfkiIutdZnsPN', 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'credential', 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', NULL, NULL, NULL, NULL, NULL, NULL, 'e7a58107b534f5b2aaaade90a222aea7:d1ea28e447726e23f83efb079d232117f85a0b4fc312ace6458062cb3bfdde4b4034967ce6b41a05c8400aa040d1d895f36ef60c3a53be6a19166012a0244fcf', '2026-07-24 01:27:21.995', '2026-07-24 01:27:21.995');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('QkUwTUJlacX1vmEAE87eXfGUIV7dSPQo', '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'credential', '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', NULL, NULL, NULL, NULL, NULL, NULL, '0d8a0a2de38819525e99c88616ef1783:077fe678c9f245deb2fd469d4b939cce922845e0faceae9a1f883bb2fed6c878d0bd2154f3702cc7b6fee2ed63cfff49b30e9b2ee61530bab9c8d298dc4f7d20', '2026-07-24 01:27:22.078', '2026-07-24 01:27:22.078');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('xnB9aXEt5EQaaaT9Rw54x1LW9oqVC6IP', 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'credential', 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', NULL, NULL, NULL, NULL, NULL, NULL, '0a48d3c8a365dfb62b9c625c84b8aa46:31c24491589ede5022ab722dd825c70dc8ca043362c18daaed65a87bf1acbe509be1b557abfabe29bc3a13d979df7e04a1a2f7e10fcc7592cb39746ea3442e1a', '2026-07-24 01:27:22.163', '2026-07-24 01:27:22.163');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('drncnGzmNZaJULxrRrhfYZvJSO9sTs4D', '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'credential', '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', NULL, NULL, NULL, NULL, NULL, NULL, '8a7be1cda053ef878e30468679555212:593c7840a9c0c0f97eb02f10222d8197e1b0b8a610cf953e658e4aff46d362de1567f2894c631f580e12e6a70ad38d0369ff00ad073c81c21d89cc5de6e69104', '2026-07-24 01:27:22.252', '2026-07-24 01:27:22.252');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('oKDlAI8biTdJ8h9H9JeewGA4D71lmFas', 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'credential', 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', NULL, NULL, NULL, NULL, NULL, NULL, '796c019e562c203718371e0cf008ab86:7575b5376b64c0b7379b9571da23f6a8956ef7b0511f92c6a5f39afc060d96f5d69a70cd02e53bf600e94c474d44f976f715be6c071cfaf9c765c7d0d58f6585', '2026-07-24 01:27:22.338', '2026-07-24 01:27:22.338');
INSERT INTO public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") VALUES ('9bNljZoJ9V25KalJQHxelZOoGjl7pc3Y', 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'credential', 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', NULL, NULL, NULL, NULL, NULL, NULL, '969240e0db608c97013c816bbe4a6dc6:1112f9c56933c6a41b16335310dd8964c6bc65c96ef354b61cd2a162c50066a62fbc29160fd21208f99dce52fcf5d15c7ec61bbbc7bfc8e49c896c930958f473', '2026-07-24 01:27:22.436', '2026-07-24 01:27:22.436');


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: checklist_template; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (7, 1, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'test1', NULL, 1, '[{"id": "q_mrxqyapa_ekzzra", "type": "checkbox", "label": "test", "options": [], "required": true, "allowText": false, "requirePhoto": false}]', true, '2026-07-23 16:52:23.325169', 8, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW');
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (1, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Earthwork Excavation', 'Structural', 1, '["Approved drawings available at site", "Benchmarks and reference levels identified", "Excavation depth as per approved drawings", "Excavation width and length as per foundation size", "Excavation sides stable (no loose soil)", "Bottom level properly trimmed and leveled", "Formation level approved before PCC", "Work ready for next activity (PCC / footing works)"]', true, '2026-07-23 12:55:29.607505', NULL, NULL);
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (2, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Foundation steel fabrication and formwork', 'Structural', 1, '["Approved drawings available at site"]', true, '2026-07-23 12:55:29.607505', NULL, NULL);
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (3, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Ground floor columns', 'Structural', 1, '["Approved drawings available at site"]', true, '2026-07-23 12:55:29.607505', NULL, NULL);
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (4, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Plinth beams', 'Structural', 1, '[]', true, '2026-07-23 12:55:29.607505', NULL, NULL);
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (5, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'gf slab', 'Structural', 1, '[]', true, '2026-07-23 12:55:29.607505', NULL, NULL);
INSERT INTO public.checklist_template (id, "orgId", "userId", name, discipline, version, items, "isActive", "createdAt", "projectId", "supervisorUserId") VALUES (6, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'FF slab', 'Structural', 1, '[]', true, '2026-07-23 12:55:29.607505', NULL, NULL);


--
-- Data for Name: daily_report; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (12, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-22', 'Hot / humid', 14, 'Daily site report for BONYAN_2025-117', 'Continued Earthwork Excavation works. Supervision as scheduled.', 'draft', '2026-07-22 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (13, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-21', 'Clear', 16, 'Daily site report for BONYAN_2025-180', 'Continued Foundation steel fabrication and formwork works. Supervision as scheduled.', 'submitted', '2026-07-21 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (14, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-20', 'Hot / humid', 18, 'Daily site report for BONYAN_2026-035', 'Continued Ground floor columns works. Supervision as scheduled.', 'draft', '2026-07-20 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (15, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-19', 'Clear', 20, 'Daily site report for BONYAN_2025-060', 'Continued Plinth beams works. Supervision as scheduled.', 'submitted', '2026-07-19 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (16, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-23', 'Hot / humid', 22, 'Daily site report for BONYAN_2025-062', 'Continued gf slab works. Supervision as scheduled.', 'draft', '2026-07-18 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (17, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-22', 'Clear', 24, 'Daily site report for BONYAN_2025-063', 'Continued FF slab works. Supervision as scheduled.', 'submitted', '2026-07-17 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (18, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-21', 'Hot / humid', 26, 'Daily site report for BONYAN_2025-064', 'Continued Earthwork Excavation works. Supervision as scheduled.', 'draft', '2026-07-16 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (19, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-20', 'Clear', 28, 'Daily site report for BONYAN_2026-070', 'Continued Foundation steel fabrication and formwork works. Supervision as scheduled.', 'submitted', '2026-07-15 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (20, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-19', 'Hot / humid', 30, 'Daily site report for BONYAN_2026-066', 'Continued Ground floor columns works. Supervision as scheduled.', 'draft', '2026-07-14 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (21, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-23', 'Clear', 32, 'Daily site report for BONYAN_2026-104', 'Continued Plinth beams works. Supervision as scheduled.', 'submitted', '2026-07-13 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);
INSERT INTO public.daily_report (id, "orgId", "projectId", "userId", "reportDate", weather, manpower, summary, "workDone", status, "createdAt", "stageId", "tomorrowPlan", equipment, "problemsRisks", incidents, "photoUrls", "supervisorSignature", "signedAt") VALUES (22, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', '2026-07-22', 'Hot / humid', 34, 'Daily site report for BONYAN_2026-068', 'Continued gf slab works. Supervision as scheduled.', 'draft', '2026-07-12 13:14:46.132278', NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL);


--
-- Data for Name: data_transfer_job; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: defect; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (13, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'Zone 2', 'Structural', 'open', 'medium', 'Supervisor', '2026-07-21 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (14, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Surface crack on blockwork', 'Logged against MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'Zone 3', 'Finishes', 'open', 'low', 'Supervisor', '2026-07-20 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (15, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against Mr. Abdullah Al Balushi', 'Zone 4', 'Structural', 'closed', 'medium', 'Supervisor', '2026-07-19 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (16, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Surface crack on blockwork', 'Logged against Najam ur rehman', 'Zone 1', 'Finishes', 'open', 'low', 'Supervisor', '2026-07-18 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (17, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against SALMAN VILLA', 'Zone 2', 'Structural', 'open', 'medium', 'Supervisor', '2026-07-17 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (18, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Surface crack on blockwork', 'Logged against raza', 'Zone 3', 'Finishes', 'closed', 'low', 'Supervisor', '2026-07-16 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (19, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against htedhgj', 'Zone 4', 'Structural', 'open', 'medium', 'Supervisor', '2026-07-15 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (20, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Surface crack on blockwork', 'Logged against AJMI''S VILLA', 'Zone 1', 'Finishes', 'open', 'low', 'Supervisor', '2026-07-14 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (21, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against Najam ur rehman', 'Zone 2', 'Structural', 'closed', 'medium', 'Supervisor', '2026-07-13 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (22, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Surface crack on blockwork', 'Logged against talal villa', 'Zone 3', 'Finishes', 'open', 'low', 'Supervisor', '2026-07-12 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);
INSERT INTO public.defect (id, "orgId", "projectId", "userId", title, description, location, trade, status, priority, "assignedTo", "createdAt", "stageId", category, "beforePhotoUrls", "afterPhotoUrls", "closeApprovedBy", "closeApprovedAt") VALUES (23, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Damaged edge of slab pour', 'Logged against mohammad', 'Zone 4', 'Structural', 'open', 'medium', 'Supervisor', '2026-07-11 13:14:46.132278', NULL, NULL, '[]', '[]', NULL, NULL);


--
-- Data for Name: directory_contact; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (27, 1, 'client', 'MR. HAMED KHALFAN MOHAMED AL AMRI', 'BONYAN_2026-001@gmail.com', NULL, '645', 'Since 10 Jan 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (28, 1, 'client', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'BONYAN_2025-117@gmail.com', NULL, '647', 'Since 23 Jan 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (29, 1, 'client', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'BONYAN_2025-180@gmail.com', NULL, '648', 'Since 25 Jan 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (30, 1, 'client', 'Mr. Abdullah Al Balushi', 'BONYAN_2026-035@gmail.com', NULL, '649', 'Since 11 Apr 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (31, 1, 'client', 'jothis', 'asffmij@test.com', NULL, '655', 'Since 01 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (32, 1, 'client', 'ismail', 'ismail@test.com', NULL, '659', 'Since 04 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (33, 1, 'client', 'ster', 'ster@test.com', NULL, '662', 'Since 09 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (34, 1, 'client', 'NAJEEB AL AJMI', 'alajmi@test.com', NULL, '664', 'Since 16 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (35, 1, 'client', 'talal al salmi', 'talal@test.com', NULL, '667', 'Since 05 Jul 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (36, 1, 'client', 'mohammad', 'mdnajsdh@gmail.com', NULL, '669', 'Since 22 Jul 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (37, 1, 'contractor', 'DREAM VILLA', 'none@gmail.com', NULL, '646', 'Since 10 Jan 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (38, 1, 'contractor', 'thdtysres', 'asffmin@test.com', NULL, '650', 'Since 20 May 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (39, 1, 'contractor', 'Najam ur rehman', 'cnt88@gmail.com', NULL, '652', 'Since 31 May 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (40, 1, 'contractor', 'gsdfg', 'fsadf@test.com', NULL, '654', 'Since 31 May 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (41, 1, 'contractor', 'DREAM VILLA', 'asfgdtj@test.com', NULL, '657', 'Since 01 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (42, 1, 'contractor', 'ismail', 'ismail2@test.com', NULL, '661', 'Since 04 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (43, 1, 'contractor', 'ERJUAN QURAYAT TRADING', 'abdullahessa84@gmail.com', NULL, '666', 'Since 16 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (44, 1, 'contractor', 'integrated plans', 'integrated@test.com', NULL, '668', 'Since 05 Jul 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (45, 1, 'supervisor', 'jothis', 'jothis@test.com', NULL, '653', 'Since 31 May 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (46, 1, 'supervisor', 'ahmed', 'asffghj@test.com', NULL, '656', 'Since 01 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (47, 1, 'supervisor', 'sterr', 'sterr@test.com', NULL, '663', 'Since 09 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (48, 1, 'supervisor', 'rajesh', 'rajesh@test.com', NULL, '665', 'Since 16 Jun 26', '2026-07-23 21:31:52.126727');
INSERT INTO public.directory_contact (id, "orgId", type, name, email, phone, "refCode", notes, "createdAt") VALUES (49, 1, 'leader', 'Admin Leader', 'admin@test.com', NULL, NULL, 'Imported from legacy portal', '2026-07-23 21:31:52.126727');


--
-- Data for Name: email_message; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.email_message (id, "orgId", subject, recipient, body, status, "createdAt") VALUES (1, 1, 'Welcome to Bonyan portal', 'admin@test.com', 'System migrated to the new supervision platform.', 'sent', '2026-07-23 13:00:26.879242');


--
-- Data for Name: error_report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: finance_account; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.finance_account (id, "orgId", "accountType", title, "accountNumber", iban, "createdAt") VALUES (1, 1, 'Bank', 'Bonyan Main Account', '0123456789', 'OM81XXXX00001234567890123456', '2026-07-23 13:00:26.879242');
INSERT INTO public.finance_account (id, "orgId", "accountType", title, "accountNumber", iban, "createdAt") VALUES (2, 1, 'Bank', 'Project Petty Cash', '9876543210', NULL, '2026-07-23 13:00:26.879242');


--
-- Data for Name: inspection; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (19, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Earthwork Excavation ? Stage inspection', 'quality', 'MR. site', 'Structural', 'approved', 'high', NULL, NULL, 'Linked stage checklist for BONYAN_2025-117', NULL, '2026-07-22 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (20, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Site visit QA ? BONYAN_2025-117', 'quality', 'General', 'QA', 'scheduled', 'medium', NULL, NULL, 'Follow-up visit', NULL, '2026-07-19 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (21, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Foundation steel fabrication and formwork ? Stage inspection', 'quality', 'MR. site', 'Structural', 'in_review', 'medium', NULL, NULL, 'Linked stage checklist for BONYAN_2025-180', NULL, '2026-07-21 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (22, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Ground floor columns ? Stage inspection', 'quality', 'Mr. site', 'Structural', 'scheduled', 'low', NULL, NULL, 'Linked stage checklist for BONYAN_2026-035', NULL, '2026-07-20 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (23, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Plinth beams ? Stage inspection', 'quality', 'Najam site', 'Structural', 'draft', 'medium', NULL, NULL, 'Linked stage checklist for BONYAN_2025-060', NULL, '2026-07-19 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (24, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'gf slab ? Stage inspection', 'quality', 'SALMAN site', 'Structural', 'approved', 'high', NULL, NULL, 'Linked stage checklist for BONYAN_2025-062', NULL, '2026-07-18 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (25, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'FF slab ? Stage inspection', 'quality', 'raza site', 'Structural', 'in_review', 'medium', NULL, NULL, 'Linked stage checklist for BONYAN_2025-063', NULL, '2026-07-17 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (26, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Site visit QA ? BONYAN_2025-063', 'quality', 'General', 'QA', 'scheduled', 'medium', NULL, NULL, 'Follow-up visit', NULL, '2026-07-14 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (27, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Earthwork Excavation ? Stage inspection', 'quality', 'htedhgj site', 'Structural', 'approved', 'high', NULL, NULL, 'Linked stage checklist for BONYAN_2025-064', NULL, '2026-07-16 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (28, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Foundation steel fabrication and formwork ? Stage inspection', 'quality', 'AJMI''S site', 'Structural', 'in_review', 'medium', NULL, NULL, 'Linked stage checklist for BONYAN_2026-070', NULL, '2026-07-15 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (29, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Site visit QA ? BONYAN_2026-070', 'quality', 'General', 'QA', 'scheduled', 'medium', NULL, NULL, 'Follow-up visit', NULL, '2026-07-12 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (30, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Ground floor columns ? Stage inspection', 'quality', 'Najam site', 'Structural', 'scheduled', 'low', NULL, NULL, 'Linked stage checklist for BONYAN_2026-066', NULL, '2026-07-14 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (31, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Site visit QA ? BONYAN_2026-066', 'quality', 'General', 'QA', 'scheduled', 'medium', NULL, NULL, 'Follow-up visit', NULL, '2026-07-11 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (32, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Plinth beams ? Stage inspection', 'quality', 'talal site', 'Structural', 'draft', 'medium', NULL, NULL, 'Linked stage checklist for BONYAN_2026-104', NULL, '2026-07-13 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (33, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'gf slab ? Stage inspection', 'quality', 'mohammad site', 'Structural', 'approved', 'high', NULL, NULL, 'Linked stage checklist for BONYAN_2026-068', NULL, '2026-07-12 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (34, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Site visit QA ? BONYAN_2026-068', 'quality', 'General', 'QA', 'scheduled', 'medium', NULL, NULL, 'Follow-up visit', NULL, '2026-07-09 13:14:46.132278', '2026-07-23 13:14:46.132278');
INSERT INTO public.inspection (id, "orgId", "projectId", "userId", title, type, location, discipline, status, priority, "assignedTo", "scheduledFor", notes, "checklistTemplateId", "createdAt", "updatedAt") VALUES (35, 1, 8, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', '┘┘┘┘┘╛', 'quality', NULL, NULL, 'draft', 'medium', NULL, NULL, NULL, 7, '2026-07-23 17:07:17.301674', '2026-07-23 17:07:17.301674');


--
-- Data for Name: inspection_item; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (61, 19, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (62, 19, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pass', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (63, 19, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pass', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (64, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (65, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pending', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (66, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (67, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (68, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (69, 21, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (70, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (71, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'fail', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (72, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (73, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (74, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (75, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (76, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Formation level approved before PCC', 'pending', NULL, 6, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (77, 22, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Work ready for next activity (PCC / footing works)', 'pending', NULL, 7, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (78, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (79, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pending', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (80, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (81, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (82, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (83, 23, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (84, 24, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (85, 24, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pass', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (86, 24, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pass', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (87, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (88, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pending', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (89, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (90, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (91, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (92, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (93, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Formation level approved before PCC', 'pending', NULL, 6, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (94, 25, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Work ready for next activity (PCC / footing works)', 'pending', NULL, 7, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (95, 27, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (96, 27, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pass', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (97, 27, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pass', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (98, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (99, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pending', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (100, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (101, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (102, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (103, 28, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (104, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (105, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'fail', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (106, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (107, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (108, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (109, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (110, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Formation level approved before PCC', 'pending', NULL, 6, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (111, 30, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Work ready for next activity (PCC / footing works)', 'pending', NULL, 7, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (112, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (113, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pending', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (114, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pending', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (115, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation width and length as per foundation size', 'pending', NULL, 3, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (116, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation sides stable (no loose soil)', 'pending', NULL, 4, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (117, 32, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Bottom level properly trimmed and leveled', 'pending', NULL, 5, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (118, 33, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Approved drawings available at site', 'pass', NULL, 0, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (119, 33, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Benchmarks and reference levels identified', 'pass', NULL, 1, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (120, 33, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Excavation depth as per approved drawings', 'pass', NULL, 2, 'pass_fail', NULL, '[]', '[]', false, true);
INSERT INTO public.inspection_item (id, "inspectionId", "userId", label, result, comment, "sortOrder", "questionType", answer, "photoUrls", options, "requirePhoto", "allowText") VALUES (121, 35, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'test', 'pass', NULL, 0, 'checkbox', 'true', '[]', '[]', false, false);


--
-- Data for Name: ipc; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: membership; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (1, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 1, 'admin', '2026-07-23 10:34:15.108448');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 1, 'admin', '2026-07-23 12:43:11.910766');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (3, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 1, 'admin', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (4, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 1, 'client', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (5, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 1, 'contractor', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (6, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 1, 'supervisor', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (7, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 1, 'developer', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (8, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 1, 'consultant', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (9, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 1, 'project_manager', '2026-07-23 20:39:05.795995');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (10, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 1, 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (11, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (12, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (13, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (14, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (15, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (16, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (17, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (18, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (19, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (20, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 1, 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (21, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (22, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (23, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (24, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (25, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (26, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (27, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 1, 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (28, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 1, 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (29, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 1, 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (30, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 1, 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.membership (id, "userId", "orgId", role, "createdAt") VALUES (31, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 1, 'supervisor', '2026-07-23 21:57:35.157239');


--
-- Data for Name: ncr; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (13, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 19, 'NCR-001', 'Honeycombing observed after pour', 'Raised during stage inspection for project BONYAN_2025-117', 'critical', 'open', 'Site engineer', '2026-07-31', '2026-07-22 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (14, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 21, 'NCR-002', 'Missing cover blocks on rebar', 'Raised during stage inspection for project BONYAN_2025-180', 'minor', 'open', 'Site engineer', '2026-08-01', '2026-07-21 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (15, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 22, 'NCR-003', 'Formwork alignment out of tolerance', 'Raised during stage inspection for project BONYAN_2026-035', 'minor', 'open', 'Site engineer', '2026-08-02', '2026-07-20 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (16, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 23, 'NCR-004', 'Honeycombing observed after pour', 'Raised during stage inspection for project BONYAN_2025-060', 'major', 'open', 'Site engineer', '2026-08-03', '2026-07-19 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (17, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 24, 'NCR-005', 'Missing cover blocks on rebar', 'Raised during stage inspection for project BONYAN_2025-062', 'critical', 'in_review', 'Site engineer', '2026-08-04', '2026-07-18 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (18, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 25, 'NCR-006', 'Formwork alignment out of tolerance', 'Raised during stage inspection for project BONYAN_2025-063', 'minor', 'in_review', 'Site engineer', '2026-08-05', '2026-07-17 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (19, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 27, 'NCR-007', 'Honeycombing observed after pour', 'Raised during stage inspection for project BONYAN_2025-064', 'minor', 'in_review', 'Site engineer', '2026-08-06', '2026-07-16 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (20, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 28, 'NCR-008', 'Missing cover blocks on rebar', 'Raised during stage inspection for project BONYAN_2026-070', 'major', 'in_review', 'Site engineer', '2026-08-07', '2026-07-15 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (21, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 30, 'NCR-009', 'Formwork alignment out of tolerance', 'Raised during stage inspection for project BONYAN_2026-066', 'critical', 'closed', 'Site engineer', '2026-08-08', '2026-07-14 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (22, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 32, 'NCR-010', 'Honeycombing observed after pour', 'Raised during stage inspection for project BONYAN_2026-104', 'minor', 'closed', 'Site engineer', '2026-08-09', '2026-07-13 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');
INSERT INTO public.ncr (id, "orgId", "projectId", "userId", "inspectionId", number, title, description, severity, status, "assignedTo", "dueDate", "createdAt", "updatedAt", "stageId", "violatedStandard", location, priority, attachments) VALUES (23, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 33, 'NCR-011', 'Missing cover blocks on rebar', 'Raised during stage inspection for project BONYAN_2026-068', 'minor', 'closed', 'Site engineer', '2026-08-10', '2026-07-12 13:14:46.132278', '2026-07-23 13:14:46.132278', NULL, NULL, NULL, 'medium', '[]');


--
-- Data for Name: org_settings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.organization (id, name, "ownerUserId", "createdAt") VALUES (1, 'Bonyan Construction', 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', '2026-07-23 10:34:15.104522');


--
-- Data for Name: progress_snapshot; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (100, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 9, 6, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (101, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 17, 16, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (102, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 26, 24, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (103, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 35, 30, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (104, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 43, 39, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (105, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 52, 47, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (106, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 61, 53, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (107, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 69, 63, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (108, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 78, 71, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (109, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 6, 3, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (110, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 12, 11, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (111, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 18, 16, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (112, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 24, 19, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (113, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 31, 27, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (114, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 37, 32, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (115, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 43, 35, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (116, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 49, 43, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (117, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 55, 48, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (118, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 5, 2, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (119, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 9, 9, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (120, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 14, 13, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (121, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 19, 16, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (122, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 23, 22, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (123, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 28, 27, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (124, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 33, 29, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (125, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 37, 36, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (126, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 42, 40, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (127, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 7, 4, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (128, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 14, 13, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (129, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 22, 19, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (130, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 29, 24, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (131, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 36, 32, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (132, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 43, 39, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (133, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 51, 43, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (134, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 58, 52, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (135, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 65, 58, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (136, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 8, 5, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (137, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 16, 15, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (138, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 23, 22, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (139, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 31, 27, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (140, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 39, 37, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (141, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 47, 44, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (142, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 54, 49, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (143, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 62, 59, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (144, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 70, 66, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (145, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 4, 1, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (146, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 8, 6, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (147, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 12, 9, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (148, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 16, 10, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (149, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 19, 16, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (150, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 23, 19, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (151, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 27, 20, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (152, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 31, 25, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (153, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 35, 28, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (154, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 6, 3, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (155, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 11, 10, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (156, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 17, 15, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (157, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 22, 18, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (158, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 28, 25, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (159, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 33, 30, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (160, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 39, 33, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (161, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 44, 40, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (162, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 50, 45, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (163, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 9, 6, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (164, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 18, 17, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (165, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 27, 25, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (166, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 36, 32, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (167, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 46, 42, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (168, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 55, 51, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (169, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 64, 57, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (170, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 73, 68, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (171, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 82, 76, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (172, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 7, 4, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (173, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 13, 12, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (174, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 20, 17, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (175, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 27, 21, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (176, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 33, 29, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (177, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 40, 35, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (178, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 47, 38, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (179, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 53, 46, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (180, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 60, 52, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (181, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 5, 3, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (182, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 11, 10, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (183, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 16, 15, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (184, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 21, 18, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (185, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 27, 24, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (186, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 32, 29, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (187, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 37, 32, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (188, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 43, 39, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (189, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 48, 44, 8);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (190, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 3, 0, 0);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (191, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 7, 5, 1);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (192, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 10, 7, 2);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (193, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 13, 8, 3);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (194, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 17, 12, 4);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (195, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 20, 15, 5);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (196, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 23, 15, 6);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (197, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 27, 20, 7);
INSERT INTO public.progress_snapshot (id, "orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (198, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 30, 22, 8);


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (6, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'SALMAN VILLA', 'BONYAN_2025-062', 'SALMAN', 'Plot 24165', 'active', NULL, NULL, 'Type: Residents | Supervision: 3per month | Client: BONYAN_2025-117@gmail.com | Supervisor: jothis@test.com | CR: 1355428', '2026-07-23 12:55:29.607505', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 70, 66, '/images/projects/salman.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (5, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Najam ur rehman', 'BONYAN_2025-060', 'nsn', 'Plot 54554 | gujranwala punjab', 'active', NULL, NULL, 'Type: Residents | Supervision: Monthly 6 Times | Client: BONYAN_2026-001@gmail.com | Phone: 03466230975', '2026-07-23 12:55:29.607505', '', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 65, 58, '/images/projects/najam.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (9, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'AJMI''S VILLA', 'BONYAN_2026-070', 'Mr. Najeeb ali hassan al AJMI', 'Plot 3168', 'active', NULL, NULL, 'Type: Residents | Supervision: Monthly 4 Times | Client: alajmi@test.com | Supervisor: rajesh@test.com | Phone: 92822838 | Map: https://maps.app.goo.gl/vKvc4GpNDpJ7CTEi6?g_st=iw | CR: 1355428', '2026-07-23 12:55:29.607505', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 82, 76, '/images/projects/ajmi.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (8, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'htedhgj', 'BONYAN_2025-064', 'ismail', 'al khoud | https://maps.app.goo.gl/UCB4bMyUptYHXiRz7', 'rejected', NULL, NULL, 'Type: Commercial | Supervision: 2 per mponth | Client: ismail@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 1355428', '2026-07-23 12:55:29.607505', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 50, 45, '/images/projects/htedhgj.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (7, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'raza', 'BONYAN_2025-063', 'raza', 'Plot 12 | mohllah dera man singh ,qila didar singh gujranwala', 'completed', NULL, NULL, 'Type: Residents | Supervision: Lum Sum | Client: BONYAN_2025-117@gmail.com | Phone: 1243325 | CR: 6230975', '2026-07-23 12:55:29.607505', 'SPFTWARE ENG', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 35, 28, '/images/projects/raza.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (2, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'BONYAN_2025-117', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'Plot 738 PHASE 05', 'active', NULL, NULL, 'Type: Commercial | Supervision: Visit Basis | Client: BONYAN_2025-117@gmail.com | Phone: 9581 8855 | Map: https://maps.app.goo.gl/cnSfrGL3hUevdrGDA?g_st=iw | CR: 1529522', '2026-07-23 12:55:29.607505', 'M/S. TASHTIBAT CONSTRUCTION LLC', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 78, 71, '/images/projects/kalbani.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (12, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'mohammad', 'BONYAN_2026-068', 'mohammad', 'mawalah | https://maps.app.goo.gl/UCB4bMyUptYHXiRz7', 'completed', NULL, NULL, 'Type: Residents | Supervision: 3per month | Client: mdnajsdh@gmail.com | Supervisor: asffghj@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 54353', '2026-07-23 12:55:29.607505', 'sdegfr', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 30, 22, '/images/projects/mohammad.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (11, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'talal villa', 'BONYAN_2026-104', 'talal', 'Plot 717', 'active', NULL, NULL, 'Type: Residents | Supervision: Monthly 4 Times | Client: talal@test.com | Supervisor: jothis@test.com | Phone: 99378444 | Map: https://maps.app.goo.gl/iAceUDTg4Yf9G47v7 | CR: 1122406', '2026-07-23 12:55:29.607505', 'integrated plans', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 48, 44, '/images/projects/talal.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (3, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'BONYAN_2025-180', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'Plot 4477 | Al Seeb, Al Khoudh Village', 'active', NULL, NULL, 'Type: Residents | Supervision: Visit Basis | Client: BONYAN_2025-180@gmail.com', '2026-07-23 12:55:29.607505', 'h', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 55, 48, '/images/projects/riyami.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (10, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Najam ur rehman', 'BONYAN_2026-066', 'nsn', 'Plot 54554 | gujranwala punjab', 'active', NULL, NULL, 'Type: Residents | Supervision: Monthly 4 Times | Client: BONYAN_2026-001@gmail.com | Supervisor: jothis@test.com | Phone: 03466230975 | CR: 1355428', '2026-07-23 12:55:29.607505', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 60, 52, '/images/projects/najam2.jpg', NULL);
INSERT INTO public.project (id, "orgId", "userId", name, code, client, location, status, "startDate", "endDate", description, "createdAt", contractor, consultant, "ownerUserId", "contractorUserId", "supervisorUserId", "developerUserId", "handoverDate", "progressPlanned", "progressActual", "imageUrl", "rejectReason") VALUES (4, 1, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mr. Abdullah Al Balushi', 'BONYAN_2026-035', 'Mr. Abdullah Al Balushi', 'https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw', 'active', NULL, NULL, 'Type: Residents | Supervision: Lum Sum | Client: BONYAN_2026-035@gmail.com | Map: https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw', '2026-07-23 12:55:29.607505', 'h', 'Bonyan Construction', 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', NULL, NULL, NULL, NULL, 42, 40, '/images/projects/balushi.jpg', NULL);


--
-- Data for Name: project_membership; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (1, 1, 8, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (2, 1, 8, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (3, 1, 8, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (4, 1, 8, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (5, 1, 8, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (6, 1, 8, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (7, 1, 8, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (8, 1, 5, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (9, 1, 5, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (10, 1, 5, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (11, 1, 5, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (12, 1, 5, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (13, 1, 5, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (14, 1, 5, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (15, 1, 7, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (16, 1, 7, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (17, 1, 7, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (18, 1, 7, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (19, 1, 7, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (20, 1, 7, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (21, 1, 7, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (22, 1, 9, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (23, 1, 9, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (24, 1, 9, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (25, 1, 9, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (26, 1, 9, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (27, 1, 9, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (28, 1, 9, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (29, 1, 2, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (30, 1, 2, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (31, 1, 2, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (32, 1, 2, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (33, 1, 2, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (34, 1, 2, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (35, 1, 2, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (36, 1, 3, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (37, 1, 3, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (38, 1, 3, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (39, 1, 3, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (40, 1, 3, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (41, 1, 3, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (42, 1, 3, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (43, 1, 4, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (44, 1, 4, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (45, 1, 4, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (46, 1, 4, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (47, 1, 4, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (48, 1, 4, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (49, 1, 4, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (50, 1, 6, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (51, 1, 6, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (52, 1, 6, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (53, 1, 6, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (54, 1, 6, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (55, 1, 6, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (56, 1, 6, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (57, 1, 11, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (58, 1, 11, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (59, 1, 11, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (60, 1, 11, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (61, 1, 11, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (62, 1, 11, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (63, 1, 11, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (64, 1, 12, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (65, 1, 12, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (66, 1, 12, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (67, 1, 12, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (68, 1, 12, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (69, 1, 12, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (70, 1, 12, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (71, 1, 10, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'admin', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (72, 1, 10, 'GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'client', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (73, 1, 10, 'QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'contractor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (74, 1, 10, 'AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'supervisor', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (75, 1, 10, 'oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'developer', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (76, 1, 10, 'f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'consultant', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (77, 1, 10, '7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'project_manager', '2026-07-23 20:39:05.806296');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (78, 1, 2, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (79, 1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (80, 1, 5, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (81, 1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (82, 1, 6, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (83, 1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (84, 1, 7, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (85, 1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (86, 1, 8, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (87, 1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (88, 1, 9, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (89, 1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (90, 1, 3, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (91, 1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (92, 1, 4, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (93, 1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (94, 1, 10, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (95, 1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (96, 1, 11, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (97, 1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (98, 1, 12, 'EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (99, 1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'admin', '2026-07-23 21:31:52.126727');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (100, 1, 2, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (101, 1, 3, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (102, 1, 4, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (103, 1, 5, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (104, 1, 5, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (105, 1, 6, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (106, 1, 6, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (107, 1, 6, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (108, 1, 7, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (109, 1, 7, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (110, 1, 8, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (111, 1, 8, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (112, 1, 9, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (113, 1, 9, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (114, 1, 9, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (115, 1, 10, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (116, 1, 10, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (117, 1, 10, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (118, 1, 11, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (119, 1, 11, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (120, 1, 11, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (121, 1, 12, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (122, 1, 12, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (123, 1, 12, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (124, 1, 2, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (125, 1, 8, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (126, 1, 11, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (127, 1, 7, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (128, 1, 7, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (129, 1, 5, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (130, 1, 3, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (131, 1, 6, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (132, 1, 9, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (133, 1, 9, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (134, 1, 7, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (135, 1, 6, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (136, 1, 6, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (137, 1, 12, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (138, 1, 2, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (139, 1, 5, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (140, 1, 2, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (141, 1, 9, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (142, 1, 10, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (143, 1, 4, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (144, 1, 12, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (145, 1, 10, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (146, 1, 7, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (147, 1, 9, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (148, 1, 5, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (149, 1, 6, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (150, 1, 11, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (151, 1, 4, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (152, 1, 3, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (153, 1, 12, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (154, 1, 10, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (155, 1, 2, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (156, 1, 5, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (157, 1, 2, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (158, 1, 11, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (159, 1, 6, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (160, 1, 3, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (161, 1, 9, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (162, 1, 2, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (163, 1, 9, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (164, 1, 6, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (165, 1, 11, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (166, 1, 5, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (167, 1, 9, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (168, 1, 7, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (169, 1, 6, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (170, 1, 11, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (171, 1, 7, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (172, 1, 10, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (173, 1, 2, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (174, 1, 4, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (175, 1, 10, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (176, 1, 12, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (177, 1, 3, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (178, 1, 7, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (179, 1, 9, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (180, 1, 3, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (181, 1, 11, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (182, 1, 10, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (183, 1, 10, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (184, 1, 3, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (185, 1, 8, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (186, 1, 12, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (187, 1, 2, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (188, 1, 12, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (189, 1, 3, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (190, 1, 6, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (191, 1, 2, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (192, 1, 3, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (193, 1, 5, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (194, 1, 4, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (195, 1, 9, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (196, 1, 5, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (197, 1, 7, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (198, 1, 4, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (199, 1, 3, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (200, 1, 12, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (201, 1, 7, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (202, 1, 11, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (203, 1, 4, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (204, 1, 6, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (205, 1, 7, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (206, 1, 2, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (207, 1, 10, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (208, 1, 12, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (209, 1, 2, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (210, 1, 4, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (211, 1, 11, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (212, 1, 6, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (213, 1, 7, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (214, 1, 2, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (215, 1, 11, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (216, 1, 3, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (217, 1, 6, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (218, 1, 8, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (219, 1, 11, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (220, 1, 3, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (221, 1, 8, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (222, 1, 6, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (223, 1, 2, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (224, 1, 10, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (225, 1, 12, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (226, 1, 8, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (227, 1, 12, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (228, 1, 10, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (229, 1, 3, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (230, 1, 3, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (231, 1, 7, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (232, 1, 12, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (233, 1, 9, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (234, 1, 4, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (235, 1, 11, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (236, 1, 11, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (237, 1, 7, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (238, 1, 8, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (239, 1, 10, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (240, 1, 12, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (241, 1, 5, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (242, 1, 2, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (243, 1, 9, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (244, 1, 8, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (245, 1, 3, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (246, 1, 11, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (247, 1, 4, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (248, 1, 6, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (249, 1, 4, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (250, 1, 9, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (251, 1, 7, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (252, 1, 5, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (253, 1, 2, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (254, 1, 5, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (255, 1, 6, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (256, 1, 5, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (257, 1, 11, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (258, 1, 7, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (259, 1, 2, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (260, 1, 3, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (261, 1, 2, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (262, 1, 5, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (263, 1, 6, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (264, 1, 8, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (265, 1, 4, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (266, 1, 7, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (267, 1, 10, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (268, 1, 12, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (269, 1, 4, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (270, 1, 10, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (271, 1, 10, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (272, 1, 7, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (273, 1, 12, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (274, 1, 9, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (275, 1, 3, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (276, 1, 8, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (277, 1, 8, 'L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (278, 1, 6, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (279, 1, 5, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (280, 1, 2, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (281, 1, 3, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (282, 1, 8, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (283, 1, 5, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (284, 1, 9, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (285, 1, 11, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (286, 1, 12, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (287, 1, 5, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (288, 1, 10, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (289, 1, 8, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (290, 1, 11, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (291, 1, 4, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (292, 1, 9, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (293, 1, 9, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (294, 1, 12, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (295, 1, 10, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (296, 1, 6, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (297, 1, 12, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (298, 1, 4, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (299, 1, 10, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (300, 1, 7, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (301, 1, 2, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (302, 1, 6, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (303, 1, 3, 'x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (304, 1, 8, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (305, 1, 5, 's9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (306, 1, 2, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (307, 1, 7, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (308, 1, 4, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (309, 1, 4, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (310, 1, 8, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (311, 1, 8, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (312, 1, 5, 'wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (313, 1, 9, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (314, 1, 8, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (315, 1, 4, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (316, 1, 5, '8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (317, 1, 4, '9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (318, 1, 9, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (319, 1, 11, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (320, 1, 11, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (321, 1, 8, 'cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (322, 1, 3, 'GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (323, 1, 9, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (324, 1, 5, 'jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (325, 1, 3, 'MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (326, 1, 2, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (327, 1, 8, '5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (328, 1, 4, 'RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (329, 1, 12, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (330, 1, 3, '8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (331, 1, 6, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (332, 1, 10, 'HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (333, 1, 5, 'j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (334, 1, 4, 'nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (335, 1, 11, 'MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (336, 1, 7, 'ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'supervisor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (337, 1, 4, '2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (338, 1, 12, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (339, 1, 10, 'oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'contractor', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (340, 1, 8, 'med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'client', '2026-07-23 21:57:35.157239');
INSERT INTO public.project_membership (id, "orgId", "projectId", "userId", role, "createdAt") VALUES (341, 1, 8, 'xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'admin', '2026-07-23 21:57:35.157239');


--
-- Data for Name: rfi; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: site_visit_request; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (12, 1, 2, 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'MR.', '2026-07-24', '14:30', 'pending', 'Linked site visit for supervision schedule', '2026-07-22 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (13, 1, 3, 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'MR.', '2026-07-25', '09:00', 'rejected', 'Linked site visit for supervision schedule', '2026-07-21 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (14, 1, 4, 'Mr. Abdullah Al Balushi', 'Mr.', '2026-07-26', '14:30', 'approved', 'Linked site visit for supervision schedule', '2026-07-20 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (15, 1, 5, 'Najam ur rehman', 'Najam', '2026-07-27', '09:00', 'pending', 'Linked site visit for supervision schedule', '2026-07-19 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (16, 1, 6, 'SALMAN VILLA', 'SALMAN', '2026-07-28', '14:30', 'rejected', 'Linked site visit for supervision schedule', '2026-07-18 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (17, 1, 7, 'raza', 'raza', '2026-07-29', '09:00', 'approved', 'Linked site visit for supervision schedule', '2026-07-17 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (18, 1, 8, 'htedhgj', 'htedhgj', '2026-07-30', '14:30', 'pending', 'Linked site visit for supervision schedule', '2026-07-16 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (19, 1, 9, 'AJMI''S VILLA', 'AJMI''S', '2026-07-31', '09:00', 'rejected', 'Linked site visit for supervision schedule', '2026-07-15 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (20, 1, 10, 'Najam ur rehman', 'Najam', '2026-08-01', '14:30', 'approved', 'Linked site visit for supervision schedule', '2026-07-14 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (21, 1, 11, 'talal villa', 'talal', '2026-08-02', '09:00', 'pending', 'Linked site visit for supervision schedule', '2026-07-13 13:14:46.132278');
INSERT INTO public.site_visit_request (id, "orgId", "projectId", "projectName", "requesterName", "visitDate", "visitTime", status, notes, "createdAt") VALUES (22, 1, 12, 'mohammad', 'mohammad', '2026-08-03', '14:30', 'rejected', 'Linked site visit for supervision schedule', '2026-07-12 13:14:46.132278');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw', 'DREAM VILLA', 'asfgdtj@test.com', false, '/uploads/avatars/oW8FTjj0XTP3Sz72EK2WBFR7VWuljcgw.svg', '2026-07-24 01:27:21.733', '2026-07-23 22:17:44.69202');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Admin User', 'admin@bonyan.test', false, '/uploads/avatars/FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs.svg', '2026-07-24 00:09:04.671', '2026-07-23 22:17:44.627585');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('GywxbT2zoHA3yZD2MX19DHoEXo07DW1A', 'Client Employer', 'client@bonyan.test', false, '/uploads/avatars/GywxbT2zoHA3yZD2MX19DHoEXo07DW1A.svg', '2026-07-24 00:09:04.847', '2026-07-23 22:17:44.637845');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF', 'Contractor User', 'contractor@bonyan.test', false, '/uploads/avatars/QF8NNJPaqC2RNxIrcVNRBAJBAxmPB4BF.svg', '2026-07-24 00:09:04.993', '2026-07-23 22:17:44.640826');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf', 'Supervisor User', 'supervisor@bonyan.test', false, '/uploads/avatars/AFL9l7u5P0VbfTaNhjXkcnHEwbOLtMzf.svg', '2026-07-24 00:09:05.152', '2026-07-23 22:17:44.643534');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0', 'Developer User', 'developer@bonyan.test', false, '/uploads/avatars/oB4U1o7E6YCF0tdftQ0mYPEttMJnndk0.svg', '2026-07-24 00:09:05.356', '2026-07-23 22:17:44.64586');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('f93hdVK0FoKDimAK1vxQd1jbM25oqo93', 'Consultant User', 'consultant@bonyan.test', false, '/uploads/avatars/f93hdVK0FoKDimAK1vxQd1jbM25oqo93.svg', '2026-07-24 00:09:05.484', '2026-07-23 22:17:44.648993');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR', 'Project Manager', 'pm@bonyan.test', false, '/uploads/avatars/7qFanG2DMP2kuTwLtCVksRdk7UbWHCWR.svg', '2026-07-24 00:09:05.63', '2026-07-23 22:17:44.651491');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC', 'Legacy Admin', 'admin@test.com', false, '/uploads/avatars/xC0jKE9VyZnrVaKl27zlowwNwiGBa6zC.svg', '2026-07-24 01:27:20.588', '2026-07-23 22:17:44.654045');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('wSimSSDYP0rKtneqjggrOugVAfNQwgw1', 'NAJEEB AL AJMI', 'alajmi@test.com', false, '/uploads/avatars/wSimSSDYP0rKtneqjggrOugVAfNQwgw1.svg', '2026-07-24 01:27:20.699', '2026-07-23 22:17:44.657514');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('med5h8PuiZkYPHAwh6faXqqxqNSmrQHL', 'jothis', 'asffmij@test.com', false, '/uploads/avatars/med5h8PuiZkYPHAwh6faXqqxqNSmrQHL.svg', '2026-07-24 01:27:20.788', '2026-07-23 22:17:44.66045');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'bonyan_2025-117@gmail.com', false, '/uploads/avatars/8OoRMt0qM8yQZJEvRDAaOWC6YmOdKPDX.svg', '2026-07-24 01:27:20.872', '2026-07-23 22:17:44.663649');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'bonyan_2025-180@gmail.com', false, '/uploads/avatars/MSj20c4QwDxPi9CzhfehXQSwT3RXgfwO.svg', '2026-07-24 01:27:20.957', '2026-07-23 22:17:44.665944');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('L5ijQLfGwCxerzhXiGkwsCidFONGqxVE', 'MR. HAMED KHALFAN MOHAMED AL AMRI', 'bonyan_2026-001@gmail.com', false, '/uploads/avatars/L5ijQLfGwCxerzhXiGkwsCidFONGqxVE.svg', '2026-07-24 01:27:21.041', '2026-07-23 22:17:44.668725');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('8eA3zdbeZrHO9v58Y7YtolvtRswryDCy', 'Mr. Abdullah Al Balushi', 'bonyan_2026-035@gmail.com', false, '/uploads/avatars/8eA3zdbeZrHO9v58Y7YtolvtRswryDCy.svg', '2026-07-24 01:27:21.123', '2026-07-23 22:17:44.671191');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj', 'ismail', 'ismail@test.com', false, '/uploads/avatars/HDUMku8uuUUxmpA5nAtsrzbgeZ4mSUcj.svg', '2026-07-24 01:27:21.21', '2026-07-23 22:17:44.673386');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('nZvEZJWvB403LRD6zpOd180bW2jhWct9', 'mohammad', 'mdnajsdh@gmail.com', false, '/uploads/avatars/nZvEZJWvB403LRD6zpOd180bW2jhWct9.svg', '2026-07-24 01:27:21.297', '2026-07-23 22:17:44.677566');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe', 'ster', 'ster@test.com', false, '/uploads/avatars/5kPB2rMYObB3RjgDZyfWJ7tc9Xg4f3Fe.svg', '2026-07-24 01:27:21.384', '2026-07-23 22:17:44.680651');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV', 'talal al salmi', 'talal@test.com', false, '/uploads/avatars/GRRgWFvwWn8yiO5NfEkEu1kKaS2QhZZV.svg', '2026-07-24 01:27:21.474', '2026-07-23 22:17:44.684061');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('j1eDIqU1kYii38VCkF2INPuFTvnTCczn', 'ERJUAN QURAYAT TRADING', 'abdullahessa84@gmail.com', false, '/uploads/avatars/j1eDIqU1kYii38VCkF2INPuFTvnTCczn.svg', '2026-07-24 01:27:21.558', '2026-07-23 22:17:44.686258');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6', 'thdtysres', 'asffmin@test.com', false, '/uploads/avatars/RpJK3mWbEP9aNKEXu1obY9EiB2czwsC6.svg', '2026-07-24 01:27:21.643', '2026-07-23 22:17:44.689059');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs', 'Najam ur rehman', 'cnt88@gmail.com', false, '/uploads/avatars/jnPwY5gWQAqNbjp0t7APd9WZjD2h5tbs.svg', '2026-07-24 01:27:21.821', '2026-07-23 22:17:44.69426');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG', 'gsdfg', 'fsadf@test.com', false, '/uploads/avatars/MRBiz2wFwtDNfPb4rkZyqErhoU73m8tG.svg', '2026-07-24 01:27:21.905', '2026-07-23 22:17:44.697182');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('x7yv4hIys5LXUekd87Fla4xfnQOrTWqC', 'integrated plans', 'integrated@test.com', false, '/uploads/avatars/x7yv4hIys5LXUekd87Fla4xfnQOrTWqC.svg', '2026-07-24 01:27:21.99', '2026-07-23 22:17:44.699715');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh', 'ismail', 'ismail2@test.com', false, '/uploads/avatars/2h0AKBIb4cgWqZWeJDARrdOJ3zTGacAh.svg', '2026-07-24 01:27:22.073', '2026-07-23 22:17:44.702093');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG', 'ahmed', 'asffghj@test.com', false, '/uploads/avatars/cfKOyrP3VUCHdfOltuHB8UKoDCf6oQdG.svg', '2026-07-24 01:27:22.158', '2026-07-23 22:17:44.705258');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('9gzgSeM3nRPfHiidptKZkt52jqdyZhl8', 'jothis', 'jothis@test.com', false, '/uploads/avatars/9gzgSeM3nRPfHiidptKZkt52jqdyZhl8.svg', '2026-07-24 01:27:22.248', '2026-07-23 22:17:44.707775');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('s9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH', 'rajesh', 'rajesh@test.com', false, '/uploads/avatars/s9MHrDZoeBuQxBegQH4wlcbwpTI7eAoH.svg', '2026-07-24 01:27:22.334', '2026-07-23 22:17:44.710676');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU', 'sterr', 'sterr@test.com', false, '/uploads/avatars/ID5mRKCy0E3Y7Jd5D03P9c1lT8Z9QdCU.svg', '2026-07-24 01:27:22.43', '2026-07-23 22:17:44.713409');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW', 'Admin', 'admin@buildsight.local', false, '/uploads/avatars/EjoR2TEIDsbRYnX8Wm2lguUOmtdxzlOW.svg', '2026-07-23 13:59:02.422', '2026-07-23 22:18:08.974245');
INSERT INTO public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") VALUES ('jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Demo User', 'demo@bonyan.local', false, '/uploads/avatars/jiffj85RR51rsrVwC2fq1aLnAqeQtCEu.svg', '2026-07-23 16:11:05.024', '2026-07-23 22:18:08.979298');


--
-- Data for Name: variation_order; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 1, false);


--
-- Name: checklist_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.checklist_template_id_seq', 7, true);


--
-- Name: daily_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_report_id_seq', 22, true);


--
-- Name: data_transfer_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.data_transfer_job_id_seq', 1, false);


--
-- Name: defect_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.defect_id_seq', 23, true);


--
-- Name: directory_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.directory_contact_id_seq', 49, true);


--
-- Name: email_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_message_id_seq', 1, true);


--
-- Name: error_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.error_report_id_seq', 1, false);


--
-- Name: finance_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.finance_account_id_seq', 2, true);


--
-- Name: inspection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inspection_id_seq', 35, true);


--
-- Name: inspection_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inspection_item_id_seq', 121, true);


--
-- Name: ipc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ipc_id_seq', 1, false);


--
-- Name: membership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.membership_id_seq', 31, true);


--
-- Name: ncr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ncr_id_seq', 23, true);


--
-- Name: organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.organization_id_seq', 1, true);


--
-- Name: progress_snapshot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_snapshot_id_seq', 198, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_id_seq', 12, true);


--
-- Name: project_membership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_membership_id_seq', 341, true);


--
-- Name: rfi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rfi_id_seq', 1, false);


--
-- Name: site_visit_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_visit_request_id_seq', 22, true);


--
-- Name: variation_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.variation_order_id_seq', 1, false);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: checklist_template checklist_template_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.checklist_template
    ADD CONSTRAINT checklist_template_pkey PRIMARY KEY (id);


--
-- Name: daily_report daily_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_report
    ADD CONSTRAINT daily_report_pkey PRIMARY KEY (id);


--
-- Name: data_transfer_job data_transfer_job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_transfer_job
    ADD CONSTRAINT data_transfer_job_pkey PRIMARY KEY (id);


--
-- Name: defect defect_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.defect
    ADD CONSTRAINT defect_pkey PRIMARY KEY (id);


--
-- Name: directory_contact directory_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact
    ADD CONSTRAINT directory_contact_pkey PRIMARY KEY (id);


--
-- Name: email_message email_message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_message
    ADD CONSTRAINT email_message_pkey PRIMARY KEY (id);


--
-- Name: error_report error_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.error_report
    ADD CONSTRAINT error_report_pkey PRIMARY KEY (id);


--
-- Name: finance_account finance_account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.finance_account
    ADD CONSTRAINT finance_account_pkey PRIMARY KEY (id);


--
-- Name: inspection_item inspection_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection_item
    ADD CONSTRAINT inspection_item_pkey PRIMARY KEY (id);


--
-- Name: inspection inspection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspection
    ADD CONSTRAINT inspection_pkey PRIMARY KEY (id);


--
-- Name: ipc ipc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ipc
    ADD CONSTRAINT ipc_pkey PRIMARY KEY (id);


--
-- Name: membership membership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (id);


--
-- Name: ncr ncr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ncr
    ADD CONSTRAINT ncr_pkey PRIMARY KEY (id);


--
-- Name: org_settings org_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.org_settings
    ADD CONSTRAINT org_settings_pkey PRIMARY KEY ("orgId");


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: progress_snapshot progress_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_snapshot
    ADD CONSTRAINT progress_snapshot_pkey PRIMARY KEY (id);


--
-- Name: project_membership project_membership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_membership
    ADD CONSTRAINT project_membership_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: rfi rfi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rfi
    ADD CONSTRAINT rfi_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: session session_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_token_unique UNIQUE (token);


--
-- Name: site_visit_request site_visit_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visit_request
    ADD CONSTRAINT site_visit_request_pkey PRIMARY KEY (id);


--
-- Name: user user_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_unique UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: variation_order variation_order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.variation_order
    ADD CONSTRAINT variation_order_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: audit_log_org_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_org_created_idx ON public.audit_log USING btree ("orgId", "createdAt" DESC);


--
-- Name: project_membership_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX project_membership_unique ON public.project_membership USING btree ("orgId", "projectId", "userId", role);


--
-- Name: account account_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: session session_userId_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--



