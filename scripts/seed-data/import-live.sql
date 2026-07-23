BEGIN;
UPDATE organization SET name = 'Bonyan Construction' WHERE id = 1;
DELETE FROM directory_contact WHERE "orgId" = 1;
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'MR. HAMED KHALFAN MOHAMED AL AMRI', NULLIF('BONYAN_2026-001@gmail.com',''), NULLIF('645',''), NULLIF('Since 10 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', NULLIF('BONYAN_2025-117@gmail.com',''), NULLIF('647',''), NULLIF('Since 23 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', NULLIF('BONYAN_2025-180@gmail.com',''), NULLIF('648',''), NULLIF('Since 25 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'Mr. Abdullah Al Balushi', NULLIF('BONYAN_2026-035@gmail.com',''), NULLIF('649',''), NULLIF('Since 11 Apr 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'jothis', NULLIF('asffmij@test.com',''), NULLIF('655',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'ismail', NULLIF('ismail@test.com',''), NULLIF('659',''), NULLIF('Since 04 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'ster', NULLIF('ster@test.com',''), NULLIF('662',''), NULLIF('Since 09 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'NAJEEB AL AJMI', NULLIF('alajmi@test.com',''), NULLIF('664',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'talal al salmi', NULLIF('talal@test.com',''), NULLIF('667',''), NULLIF('Since 05 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'client', 'mohammad', NULLIF('mdnajsdh@gmail.com',''), NULLIF('669',''), NULLIF('Since 22 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'DREAM VILLA', NULLIF('none@gmail.com',''), NULLIF('646',''), NULLIF('Since 10 Jan 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'thdtysres', NULLIF('asffmin@test.com',''), NULLIF('650',''), NULLIF('Since 20 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'Najam ur rehman', NULLIF('cnt88@gmail.com',''), NULLIF('652',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'gsdfg', NULLIF('fsadf@test.com',''), NULLIF('654',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'DREAM VILLA', NULLIF('asfgdtj@test.com',''), NULLIF('657',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'ismail', NULLIF('ismail2@test.com',''), NULLIF('661',''), NULLIF('Since 04 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'ERJUAN QURAYAT TRADING', NULLIF('abdullahessa84@gmail.com',''), NULLIF('666',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'contractor', 'integrated plans', NULLIF('integrated@test.com',''), NULLIF('668',''), NULLIF('Since 05 Jul 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'supervisor', 'jothis', NULLIF('jothis@test.com',''), NULLIF('653',''), NULLIF('Since 31 May 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'supervisor', 'ahmed', NULLIF('asffghj@test.com',''), NULLIF('656',''), NULLIF('Since 01 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'supervisor', 'sterr', NULLIF('sterr@test.com',''), NULLIF('663',''), NULLIF('Since 09 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, "refCode", notes) VALUES (1, 'supervisor', 'rajesh', NULLIF('rajesh@test.com',''), NULLIF('665',''), NULLIF('Since 16 Jun 26',''));
INSERT INTO directory_contact ("orgId", type, name, email, notes) VALUES (1, 'leader', 'Admin Leader', 'admin@test.com', 'Imported from legacy portal');
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'BONYAN_2025-117', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'Plot 738 PHASE 05', 'active', 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Phone: 9581 8855 | Map: https://maps.app.goo.gl/cnSfrGL3hUevdrGDA?g_st=iw | CR: 1529522', 'M/S. TASHTIBAT CONSTRUCTION LLC', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-117');
UPDATE project SET
  name = 'MR. MOHAMMED ALI MOHAMMED AL KALBANI',
  client = 'MR. MOHAMMED ALI MOHAMMED AL KALBANI',
  location = CASE WHEN 'Plot 738 PHASE 05' <> '' THEN 'Plot 738 PHASE 05' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Phone: 9581 8855 | Map: https://maps.app.goo.gl/cnSfrGL3hUevdrGDA?g_st=iw | CR: 1529522',
  contractor = 'M/S. TASHTIBAT CONSTRUCTION LLC',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-117';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI', 'BONYAN_2025-180', 'MR. MOHAMMED ALI MOHAMMED AL KALBANI', 'Plot 4477 | Al Seeb, Al Khoudh Village', 'active', 'Type:  | Supervision:  | Client: BONYAN_2025-180@gmail.com', 'h', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-180');
UPDATE project SET
  name = 'MR. MAHMOOD RASHID MOHAMMED AL RIYAMI',
  client = 'MR. MOHAMMED ALI MOHAMMED AL KALBANI',
  location = CASE WHEN 'Plot 4477 | Al Seeb, Al Khoudh Village' <> '' THEN 'Plot 4477 | Al Seeb, Al Khoudh Village' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2025-180@gmail.com',
  contractor = 'h',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-180';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Mr. Abdullah Al Balushi', 'BONYAN_2026-035', 'Mr. Abdullah Al Balushi', '', 'active', 'Type:  | Supervision:  | Client: BONYAN_2026-035@gmail.com | Map: https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw', 'h', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2026-035');
UPDATE project SET
  name = 'Mr. Abdullah Al Balushi',
  client = 'Mr. Abdullah Al Balushi',
  location = CASE WHEN '' <> '' THEN '' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2026-035@gmail.com | Map: https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw',
  contractor = 'h',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2026-035';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Najam ur rehman', 'BONYAN_2025-060', 'nsn', 'Plot 54554 | gujranwala punjab', 'active', 'Type:  | Supervision:  | Client: BONYAN_2026-001@gmail.com | Phone: 03466230975', '', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-060');
UPDATE project SET
  name = 'Najam ur rehman',
  client = 'nsn',
  location = CASE WHEN 'Plot 54554 | gujranwala punjab' <> '' THEN 'Plot 54554 | gujranwala punjab' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2026-001@gmail.com | Phone: 03466230975',
  contractor = '',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-060';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'SALMAN VILLA', 'BONYAN_2025-062', 'SALMAN', 'Plot 24165', 'active', 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Supervisor: jothis@test.com | CR: 1355428', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-062');
UPDATE project SET
  name = 'SALMAN VILLA',
  client = 'SALMAN',
  location = CASE WHEN 'Plot 24165' <> '' THEN 'Plot 24165' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Supervisor: jothis@test.com | CR: 1355428',
  contractor = 'ERJUAN QURAYAT TRADING',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-062';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'raza', 'BONYAN_2025-063', 'raza', 'Plot 12 | mohllah dera man singh ,qila didar singh gujranwala', 'active', 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Phone: 1243325 | CR: 6230975', 'SPFTWARE ENG', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-063');
UPDATE project SET
  name = 'raza',
  client = 'raza',
  location = CASE WHEN 'Plot 12 | mohllah dera man singh ,qila didar singh gujranwala' <> '' THEN 'Plot 12 | mohllah dera man singh ,qila didar singh gujranwala' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2025-117@gmail.com | Phone: 1243325 | CR: 6230975',
  contractor = 'SPFTWARE ENG',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-063';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'htedhgj', 'BONYAN_2025-064', 'ismail', '', 'active', 'Type:  | Supervision:  | Client: ismail@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 1355428', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2025-064');
UPDATE project SET
  name = 'htedhgj',
  client = 'ismail',
  location = CASE WHEN '' <> '' THEN '' ELSE location END,
  description = 'Type:  | Supervision:  | Client: ismail@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 1355428',
  contractor = 'ERJUAN QURAYAT TRADING',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2025-064';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'AJMI''S VILLA', 'BONYAN_2026-070', 'Mr. Najeeb ali hassan al AJMI', 'Plot 3168', 'active', 'Type:  | Supervision:  | Client: alajmi@test.com | Supervisor: rajesh@test.com | Phone: 92822838 | Map: https://maps.app.goo.gl/vKvc4GpNDpJ7CTEi6?g_st=iw | CR: 1355428', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2026-070');
UPDATE project SET
  name = 'AJMI''S VILLA',
  client = 'Mr. Najeeb ali hassan al AJMI',
  location = CASE WHEN 'Plot 3168' <> '' THEN 'Plot 3168' ELSE location END,
  description = 'Type:  | Supervision:  | Client: alajmi@test.com | Supervisor: rajesh@test.com | Phone: 92822838 | Map: https://maps.app.goo.gl/vKvc4GpNDpJ7CTEi6?g_st=iw | CR: 1355428',
  contractor = 'ERJUAN QURAYAT TRADING',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2026-070';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Najam ur rehman', 'BONYAN_2026-066', 'nsn', 'Plot 54554 | gujranwala punjab', 'active', 'Type:  | Supervision:  | Client: BONYAN_2026-001@gmail.com | Supervisor: jothis@test.com | Phone: 03466230975 | CR: 1355428', 'ERJUAN QURAYAT TRADING', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2026-066');
UPDATE project SET
  name = 'Najam ur rehman',
  client = 'nsn',
  location = CASE WHEN 'Plot 54554 | gujranwala punjab' <> '' THEN 'Plot 54554 | gujranwala punjab' ELSE location END,
  description = 'Type:  | Supervision:  | Client: BONYAN_2026-001@gmail.com | Supervisor: jothis@test.com | Phone: 03466230975 | CR: 1355428',
  contractor = 'ERJUAN QURAYAT TRADING',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2026-066';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'talal villa', 'BONYAN_2026-104', 'talal', 'Plot 717', 'active', 'Type:  | Supervision:  | Client: talal@test.com | Supervisor: jothis@test.com | Phone: 99378444 | Map: https://maps.app.goo.gl/iAceUDTg4Yf9G47v7 | CR: 1122406', 'integrated plans', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2026-104');
UPDATE project SET
  name = 'talal villa',
  client = 'talal',
  location = CASE WHEN 'Plot 717' <> '' THEN 'Plot 717' ELSE location END,
  description = 'Type:  | Supervision:  | Client: talal@test.com | Supervisor: jothis@test.com | Phone: 99378444 | Map: https://maps.app.goo.gl/iAceUDTg4Yf9G47v7 | CR: 1122406',
  contractor = 'integrated plans',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2026-104';
INSERT INTO project ("orgId", "userId", name, code, client, location, status, description, contractor, consultant, "ownerUserId", "progressPlanned", "progressActual")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'mohammad', 'BONYAN_2026-068', 'mohammad', '', 'active', 'Type:  | Supervision:  | Client: mdnajsdh@gmail.com | Supervisor: asffghj@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 54353', 'sdegfr', 'Bonyan Construction', 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM project WHERE "orgId"=1 AND code='BONYAN_2026-068');
UPDATE project SET
  name = 'mohammad',
  client = 'mohammad',
  location = CASE WHEN '' <> '' THEN '' ELSE location END,
  description = 'Type:  | Supervision:  | Client: mdnajsdh@gmail.com | Supervisor: asffghj@test.com | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7 | CR: 54353',
  contractor = 'sdegfr',
  consultant = 'Bonyan Construction'
WHERE "orgId"=1 AND code='BONYAN_2026-068';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Earthwork Excavation', 'Structural', 1, '["Approved drawings available at site","Benchmarks and reference levels identified","Excavation depth as per approved drawings","Excavation width and length as per foundation size","Excavation sides stable (no loose soil)","Bottom level properly trimmed and leveled","Formation level approved before PCC","Work ready for next activity (PCC / footing works)"]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='Earthwork Excavation');
UPDATE checklist_template SET items = '["Approved drawings available at site","Benchmarks and reference levels identified","Excavation depth as per approved drawings","Excavation width and length as per foundation size","Excavation sides stable (no loose soil)","Bottom level properly trimmed and leveled","Formation level approved before PCC","Work ready for next activity (PCC / footing works)"]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='Earthwork Excavation';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Foundation steel fabrication and formwork', 'Structural', 1, '["Approved drawings available at site"]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='Foundation steel fabrication and formwork');
UPDATE checklist_template SET items = '["Approved drawings available at site"]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='Foundation steel fabrication and formwork';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Ground floor columns', 'Structural', 1, '["Approved drawings available at site"]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='Ground floor columns');
UPDATE checklist_template SET items = '["Approved drawings available at site"]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='Ground floor columns';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'Plinth beams', 'Structural', 1, '[]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='Plinth beams');
UPDATE checklist_template SET items = '[]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='Plinth beams';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'gf slab', 'Structural', 1, '[]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='gf slab');
UPDATE checklist_template SET items = '[]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='gf slab';
INSERT INTO checklist_template ("orgId", "userId", name, discipline, version, items, "isActive")
SELECT 1, 'FEKdfq6C25PpDPEOAbBVktpBg5JyoiPs', 'FF slab', 'Structural', 1, '[]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM checklist_template WHERE "orgId"=1 AND name='FF slab');
UPDATE checklist_template SET items = '[]'::jsonb, discipline = 'Structural', "isActive" = true
WHERE "orgId"=1 AND name='FF slab';
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, m.role
FROM project p
CROSS JOIN membership m
JOIN "user" u ON u.id = m."userId"
WHERE p."orgId"=1 AND m."orgId"=1
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role=m.role
);
COMMIT;
SELECT code, name, left(description,70) d FROM project ORDER BY code;
SELECT type, count(*) FROM directory_contact GROUP BY type ORDER BY type;
SELECT name, jsonb_array_length(items) q FROM checklist_template WHERE "isActive" ORDER BY id;

