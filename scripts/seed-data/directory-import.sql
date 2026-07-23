BEGIN;
CREATE TABLE IF NOT EXISTS directory_contact (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  "refCode" text,
  notes text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS site_visit_request (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "projectId" integer,
  "projectName" text,
  "requesterName" text,
  "visitDate" date,
  "visitTime" text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS finance_account (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  "accountType" text,
  title text NOT NULL,
  "accountNumber" text,
  iban text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS email_message (
  id serial PRIMARY KEY,
  "orgId" integer NOT NULL,
  subject text NOT NULL,
  recipient text,
  body text,
  status text NOT NULL DEFAULT 'draft',
  "createdAt" timestamp NOT NULL DEFAULT now()
);
DELETE FROM directory_contact WHERE "orgId" = 1;
DELETE FROM site_visit_request WHERE "orgId" = 1;
DELETE FROM finance_account WHERE "orgId" = 1;
DELETE FROM email_message WHERE "orgId" = 1;
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'NAJEEB AL AJMI', NULLIF('alajmi@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'jothis', NULLIF('asffmij@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', NULLIF('BONYAN_2025-117@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 23 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', NULLIF('BONYAN_2025-180@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 25 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'MR. HAMED KHALFAN MOHAMED AL AMRI', NULLIF('BONYAN_2026-001@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 10 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'Mr. Abdullah Al Balushi', NULLIF('BONYAN_2026-035@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 11 Apr 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'ismail', NULLIF('ismail@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 04 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'mohammad', NULLIF('mdnajsdh@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 22 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'ster', NULLIF('ster@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 09 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'client', 'talal al salmi', NULLIF('talal@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 05 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'ERJUAN QURAYAT TRADING', NULLIF('abdullahessa84@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'thdtysres', NULLIF('asffmin@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 20 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'DREAM VILLA', NULLIF('asfgdtj@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'Najam ur rehman', NULLIF('cnt88@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'gsdfg', NULLIF('fsadf@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'integrated plans', NULLIF('integrated@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 05 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'ismail', NULLIF('ismail2@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 04 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'contractor', 'DREAM VILLA', NULLIF('none@gmail.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 10 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'ahmed', NULLIF('asffghj@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'ismail', NULLIF('ismail1@test.com',''), NULLIF('',''), NULLIF('CII845',''), NULLIF('Since 04 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'jothis', NULLIF('jothis@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'Najam ur rehman', NULLIF('nsn18061@gmail.com',''), NULLIF('',''), NULLIF('CYF871',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'rajesh', NULLIF('rajesh@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'sterr', NULLIF('sterr@test.com',''), NULLIF('',''), NULLIF('',''), NULLIF('Since 09 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, phone, "refCode", notes) VALUES (1, 'supervisor', 'sgsehd', NULLIF('tgwtgaawr@test.com',''), NULLIF('',''), NULLIF('EL3661',''), NULLIF('Since 03 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, notes) VALUES (1, 'leader', 'Admin Leader', 'admin@test.com', 'Imported from legacy portal');
INSERT INTO finance_account ("orgId", "accountType", title, "accountNumber", iban) VALUES (1, 'Bank', 'Bonyan Main Account', '0123456789', 'OM81XXXX00001234567890123456');
INSERT INTO finance_account ("orgId", "accountType", title, "accountNumber", iban) VALUES (1, 'Bank', 'Project Petty Cash', '9876543210', NULL);
INSERT INTO email_message ("orgId", subject, recipient, body, status) VALUES (1, 'Welcome to Bonyan portal', 'admin@test.com', 'System migrated to the new supervision platform.', 'sent');
COMMIT;
SELECT type, count(*) FROM directory_contact GROUP BY type ORDER BY type;
