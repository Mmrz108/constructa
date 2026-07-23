BEGIN;
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: 3per month |'
)
WHERE code = 'BONYAN_2026-068';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: 3per month | Client: mdnajsdh@gmail.com' ||
           CASE WHEN 'https://maps.app.goo.gl/UCB4bMyUptYHXiRz7' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2026-068';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Monthly 4 Times |'
)
WHERE code = 'BONYAN_2026-104';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Monthly 4 Times | Client: talal@test.com' ||
           CASE WHEN 'https://maps.app.goo.gl/iAceUDTg4Yf9G47v7' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/iAceUDTg4Yf9G47v7' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2026-104';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Monthly 4 Times |'
)
WHERE code = 'BONYAN_2026-066';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Monthly 4 Times | Client: BONYAN_2026-001@gmail.com' ||
           CASE WHEN 'gujranwala punjab' ~ '^https?' THEN ' | Map: gujranwala punjab' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2026-066';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Monthly 4 Times |'
)
WHERE code = 'BONYAN_2026-070';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Monthly 4 Times | Client: alajmi@test.com' ||
           CASE WHEN 'https://maps.app.goo.gl/vKvc4GpNDpJ7CTEi6?g_st=iw' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/vKvc4GpNDpJ7CTEi6?g_st=iw' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2026-070';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Commercial |'),
  'Supervision:\s*\|', 'Supervision: 2 per mponth |'
)
WHERE code = 'BONYAN_2025-064';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Commercial | Supervision: 2 per mponth | Client: ismail@test.com' ||
           CASE WHEN 'https://maps.app.goo.gl/UCB4bMyUptYHXiRz7' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/UCB4bMyUptYHXiRz7' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-064';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Lum Sum |'
)
WHERE code = 'BONYAN_2025-063';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Lum Sum | Client: BONYAN_2025-117@gmail.com' ||
           CASE WHEN 'mohllah dera man singh ,qila didar singh gujranwala' ~ '^https?' THEN ' | Map: mohllah dera man singh ,qila didar singh gujranwala' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-063';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: 3per month |'
)
WHERE code = 'BONYAN_2025-062';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: 3per month | Client: BONYAN_2025-117@gmail.com' ||
           CASE WHEN '' ~ '^https?' THEN ' | Map: ' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-062';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Monthly 6 Times |'
)
WHERE code = 'BONYAN_2025-060';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Monthly 6 Times | Client: BONYAN_2026-001@gmail.com' ||
           CASE WHEN 'gujranwala punjab' ~ '^https?' THEN ' | Map: gujranwala punjab' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-060';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Lum Sum |'
)
WHERE code = 'BONYAN_2026-035';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Lum Sum | Client: BONYAN_2026-035@gmail.com' ||
           CASE WHEN 'https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/x1fip3qv6Psn7Ltv7?g_st=iw' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2026-035';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Residents |'),
  'Supervision:\s*\|', 'Supervision: Visit Basis |'
)
WHERE code = 'BONYAN_2025-180';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Residents | Supervision: Visit Basis | Client: BONYAN_2025-180@gmail.com' ||
           CASE WHEN 'Al Seeb, Al Khoudh Village' ~ '^https?' THEN ' | Map: Al Seeb, Al Khoudh Village' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-180';
UPDATE project SET description = regexp_replace(
  regexp_replace(description, 'Type:\s*\|', 'Type: Commercial |'),
  'Supervision:\s*\|', 'Supervision: Visit Basis |'
)
WHERE code = 'BONYAN_2025-117';
-- if still empty prefixes, prepend
UPDATE project SET description =
  CASE
    WHEN description NOT LIKE 'Type: %' OR description LIKE 'Type:  |%'
      THEN 'Type: Commercial | Supervision: Visit Basis | Client: BONYAN_2025-117@gmail.com' ||
           CASE WHEN 'https://maps.app.goo.gl/cnSfrGL3hUevdrGDA?g_st=iw' ~ '^https?' THEN ' | Map: https://maps.app.goo.gl/cnSfrGL3hUevdrGDA?g_st=iw' ELSE '' END ||
           CASE WHEN description LIKE '%Phone:%' OR description LIKE '%Supervisor:%' OR description LIKE '%CR:%'
             THEN ' | ' || regexp_replace(description, '^.*?Client:[^|]*\|?\s*', '')
             ELSE ''
           END
    ELSE description
  END
WHERE code = 'BONYAN_2025-117';
COMMIT;
SELECT code, left(description,100) FROM project ORDER BY code;

