BEGIN;
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'admin'
FROM "user" u
WHERE lower(u.email) = 'admin@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'admin'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'admin@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'alajmi@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'alajmi@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'asffmij@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'asffmij@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'bonyan_2025-117@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'bonyan_2025-117@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'bonyan_2025-180@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'bonyan_2025-180@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'bonyan_2026-001@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'bonyan_2026-001@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'bonyan_2026-035@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'bonyan_2026-035@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'ismail@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'ismail@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'mdnajsdh@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'mdnajsdh@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'ster@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'ster@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'client'
FROM "user" u
WHERE lower(u.email) = 'talal@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'client'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'talal@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'abdullahessa84@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'abdullahessa84@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'asffmin@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'asffmin@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'asfgdtj@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'asfgdtj@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'cnt88@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'cnt88@gmail.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'fsadf@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'fsadf@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'integrated@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'integrated@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'contractor'
FROM "user" u
WHERE lower(u.email) = 'ismail2@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'contractor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'ismail2@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'supervisor'
FROM "user" u
WHERE lower(u.email) = 'asffghj@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'supervisor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'asffghj@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'supervisor'
FROM "user" u
WHERE lower(u.email) = 'jothis@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'supervisor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'jothis@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'supervisor'
FROM "user" u
WHERE lower(u.email) = 'rajesh@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'supervisor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'rajesh@test.com';
INSERT INTO membership ("userId", "orgId", role)
SELECT u.id, 1, 'supervisor'
FROM "user" u
WHERE lower(u.email) = 'sterr@test.com'
AND NOT EXISTS (
  SELECT 1 FROM membership m WHERE m."userId" = u.id AND m."orgId" = 1
);
UPDATE membership m
SET role = 'supervisor'
FROM "user" u
WHERE m."userId" = u.id AND m."orgId" = 1 AND lower(u.email) = 'sterr@test.com';
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-117' AND lower(u.email) = 'bonyan_2025-117@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-180' AND lower(u.email) = 'bonyan_2025-180@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-035' AND lower(u.email) = 'bonyan_2026-035@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-060' AND lower(u.email) = 'bonyan_2026-001@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-060' AND lower(u.email) = 'asffmin@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-062' AND lower(u.email) = 'bonyan_2025-117@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'supervisor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-062' AND lower(u.email) = 'jothis@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='supervisor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-062' AND lower(u.email) = 'abdullahessa84@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-063' AND lower(u.email) = 'bonyan_2025-117@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-063' AND lower(u.email) = 'asffmin@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-064' AND lower(u.email) = 'ismail@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2025-064' AND lower(u.email) = 'abdullahessa84@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-070' AND lower(u.email) = 'alajmi@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'supervisor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-070' AND lower(u.email) = 'rajesh@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='supervisor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-070' AND lower(u.email) = 'abdullahessa84@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-066' AND lower(u.email) = 'bonyan_2026-001@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'supervisor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-066' AND lower(u.email) = 'jothis@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='supervisor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-066' AND lower(u.email) = 'abdullahessa84@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-104' AND lower(u.email) = 'talal@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'supervisor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-104' AND lower(u.email) = 'jothis@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='supervisor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-104' AND lower(u.email) = 'integrated@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'client'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-068' AND lower(u.email) = 'mdnajsdh@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='client'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'supervisor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-068' AND lower(u.email) = 'asffghj@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='supervisor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, 'contractor'
FROM project p
CROSS JOIN "user" u
WHERE p.code = 'BONYAN_2026-068' AND lower(u.email) = 'fsadf@test.com'
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role='contractor'
);
INSERT INTO project_membership ("orgId", "projectId", "userId", role)
SELECT 1, p.id, u.id, m.role
FROM project p
JOIN membership m ON m."orgId" = 1
JOIN "user" u ON u.id = m."userId"
WHERE p."orgId" = 1
AND lower(u.email) NOT LIKE '%@bonyan.test'
AND lower(u.email) NOT IN ('demo@bonyan.local','admin@buildsight.local')
AND NOT EXISTS (
  SELECT 1 FROM project_membership pm
  WHERE pm."orgId"=1 AND pm."projectId"=p.id AND pm."userId"=u.id AND pm.role=m.role
);
COMMIT;
SELECT u.email, m.role
FROM membership m
JOIN "user" u ON u.id = m."userId"
WHERE m."orgId"=1
ORDER BY m.role, u.email;

