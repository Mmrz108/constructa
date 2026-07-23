BEGIN;
DELETE FROM inspection_item;
DELETE FROM inspection;
DELETE FROM ncr;
DELETE FROM defect;
DELETE FROM daily_report;
DELETE FROM progress_snapshot;
DELETE FROM site_visit_request;
UPDATE project SET "progressPlanned" = 78, "progressActual" = 71 WHERE id = 2;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 9, 6, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 17, 16, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 26, 24, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 35, 30, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 43, 39, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 52, 47, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 61, 53, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 69, 63, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 2, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 78, 71, 8);
UPDATE project SET "progressPlanned" = 55, "progressActual" = 48 WHERE id = 3;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 6, 3, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 12, 11, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 18, 16, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 24, 19, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 31, 27, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 37, 32, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 43, 35, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 49, 43, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 3, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 55, 48, 8);
UPDATE project SET "progressPlanned" = 42, "progressActual" = 40 WHERE id = 4;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 5, 2, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 9, 9, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 14, 13, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 19, 16, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 23, 22, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 28, 27, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 33, 29, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 37, 36, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 4, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 42, 40, 8);
UPDATE project SET "progressPlanned" = 65, "progressActual" = 58 WHERE id = 5;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 7, 4, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 14, 13, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 22, 19, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 29, 24, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 36, 32, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 43, 39, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 51, 43, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 58, 52, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 5, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 65, 58, 8);
UPDATE project SET "progressPlanned" = 70, "progressActual" = 66 WHERE id = 6;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 8, 5, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 16, 15, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 23, 22, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 31, 27, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 39, 37, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 47, 44, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 54, 49, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 62, 59, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 6, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 70, 66, 8);
UPDATE project SET "progressPlanned" = 35, "progressActual" = 28 WHERE id = 7;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 4, 1, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 8, 6, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 12, 9, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 16, 10, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 19, 16, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 23, 19, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 27, 20, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 31, 25, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 7, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 35, 28, 8);
UPDATE project SET "progressPlanned" = 50, "progressActual" = 45 WHERE id = 8;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 6, 3, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 11, 10, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 17, 15, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 22, 18, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 28, 25, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 33, 30, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 39, 33, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 44, 40, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 8, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 50, 45, 8);
UPDATE project SET "progressPlanned" = 82, "progressActual" = 76 WHERE id = 9;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 9, 6, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 18, 17, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 27, 25, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 36, 32, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 46, 42, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 55, 51, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 64, 57, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 73, 68, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 9, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 82, 76, 8);
UPDATE project SET "progressPlanned" = 60, "progressActual" = 52 WHERE id = 10;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 7, 4, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 13, 12, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 20, 17, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 27, 21, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 33, 29, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 40, 35, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 47, 38, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 53, 46, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 10, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 60, 52, 8);
UPDATE project SET "progressPlanned" = 48, "progressActual" = 44 WHERE id = 11;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 5, 3, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 11, 10, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 16, 15, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 21, 18, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 27, 24, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 32, 29, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 37, 32, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 43, 39, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 11, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 48, 44, 8);
UPDATE project SET "progressPlanned" = 30, "progressActual" = 22 WHERE id = 12;
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 17', 3, 0, 0);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 24', 7, 5, 1);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Mar 31', 10, 7, 2);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 7', 13, 8, 3);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 14', 17, 12, 4);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 21', 20, 15, 5);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'Apr 28', 23, 15, 6);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 5', 27, 20, 7);
INSERT INTO progress_snapshot ("orgId", "projectId", "userId", label, planned, actual, "sortOrder") VALUES (1, 12, 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu', 'May 12', 30, 22, 8);
DO $$
DECLARE
  uid text := 'jiffj85RR51rsrVwC2fq1aLnAqeQtCEu';
  oid int := 1;
  insp_id int;
  r record;
  qidx int;
  result text;
  qs text[] := ARRAY[
    'Approved drawings available at site',
    'Benchmarks and reference levels identified',
    'Excavation depth as per approved drawings',
    'Excavation width and length as per foundation size',
    'Excavation sides stable (no loose soil)',
    'Bottom level properly trimmed and leveled',
    'Formation level approved before PCC',
    'Work ready for next activity (PCC / footing works)'
  ];
  stages text[] := ARRAY[
    'Earthwork Excavation',
    'Foundation steel fabrication and formwork',
    'Ground floor columns',
    'Plinth beams',
    'gf slab',
    'FF slab'
  ];
  statuses text[] := ARRAY['approved','in_review','scheduled','draft','approved','in_review'];
  prios text[] := ARRAY['high','medium','low','medium','high','medium'];
  idx int := 0;
BEGIN
  FOR r IN SELECT id, name, code FROM project WHERE "orgId" = oid ORDER BY id LOOP
    idx := idx + 1;
    INSERT INTO inspection ("orgId","projectId","userId",title,type,location,discipline,status,priority,notes,"createdAt","updatedAt")
    VALUES (
      oid, r.id, uid,
      stages[((idx - 1) % 6) + 1] || ' — Stage inspection',
      'quality',
      split_part(r.name, ' ', 1) || ' site',
      'Structural',
      statuses[((idx - 1) % 6) + 1],
      prios[((idx - 1) % 6) + 1],
      'Linked stage checklist for ' || coalesce(r.code, r.name),
      now() - ((idx)::text || ' days')::interval,
      now()
    ) RETURNING id INTO insp_id;

    FOR qidx IN 1..array_length(qs,1) LOOP
      IF qidx <= 3 OR ((idx % 2) = 0 AND qidx <= 6) OR ((idx % 3) = 0) THEN
        result := CASE WHEN statuses[((idx - 1) % 6) + 1] = 'approved' THEN 'pass'
                       WHEN qidx = 1 THEN 'pass'
                       WHEN qidx = 2 AND (idx % 2)=1 THEN 'fail'
                       ELSE 'pending' END;
        INSERT INTO inspection_item ("inspectionId","userId",label,result,"sortOrder")
        VALUES (insp_id, uid, qs[qidx], result, qidx - 1);
      END IF;
    END LOOP;

    IF idx IN (1,6,8,9,11) THEN
      INSERT INTO inspection ("orgId","projectId","userId",title,type,location,discipline,status,priority,notes,"createdAt","updatedAt")
      VALUES (oid, r.id, uid, 'Site visit QA — ' || coalesce(r.code, r.name), 'quality', 'General', 'QA', 'scheduled', 'medium',
              'Follow-up visit', now() - ((idx+3)::text || ' days')::interval, now());
    END IF;

    INSERT INTO ncr ("orgId","projectId","userId","inspectionId",number,title,description,severity,status,"assignedTo","dueDate","createdAt","updatedAt")
    VALUES (
      oid, r.id, uid, insp_id,
      'NCR-' || lpad(idx::text, 3, '0'),
      CASE WHEN (idx % 3)=0 THEN 'Formwork alignment out of tolerance'
           WHEN (idx % 3)=1 THEN 'Honeycombing observed after pour'
           ELSE 'Missing cover blocks on rebar' END,
      'Raised during stage inspection for project ' || coalesce(r.code, r.name),
      CASE WHEN (idx % 4)=0 THEN 'major' WHEN (idx % 4)=1 THEN 'critical' ELSE 'minor' END,
      CASE WHEN (idx % 3)=0 THEN 'closed' WHEN (idx % 3)=1 THEN 'open' ELSE 'in_review' END,
      'Site engineer',
      (CURRENT_DATE + (7+idx))::date,
      now() - ((idx)::text || ' days')::interval,
      now()
    );

    INSERT INTO defect ("orgId","projectId","userId",title,description,location,trade,status,priority,"assignedTo","createdAt")
    VALUES (
      oid, r.id, uid,
      CASE WHEN (idx % 2)=0 THEN 'Surface crack on blockwork' ELSE 'Damaged edge of slab pour' END,
      'Logged against ' || r.name,
      'Zone ' || ((idx % 4)+1)::text,
      CASE WHEN (idx % 2)=0 THEN 'Finishes' ELSE 'Structural' END,
      CASE WHEN (idx % 3)=0 THEN 'closed' ELSE 'open' END,
      CASE WHEN (idx % 2)=0 THEN 'low' ELSE 'medium' END,
      'Supervisor',
      now() - ((idx+1)::text || ' days')::interval
    );

    INSERT INTO daily_report ("orgId","projectId","userId","reportDate",weather,manpower,summary,"workDone",status,"createdAt")
    VALUES (
      oid, r.id, uid,
      (CURRENT_DATE - (idx % 5))::date,
      CASE WHEN (idx % 2)=0 THEN 'Clear' ELSE 'Hot / humid' END,
      12 + (idx * 2),
      'Daily site report for ' || coalesce(r.code, r.name),
      'Continued ' || stages[((idx - 1) % 6) + 1] || ' works. Supervision as scheduled.',
      CASE WHEN (idx % 2)=0 THEN 'submitted' ELSE 'draft' END,
      now() - ((idx)::text || ' days')::interval
    );

    INSERT INTO site_visit_request ("orgId","projectId","projectName","requesterName","visitDate","visitTime",status,notes,"createdAt")
    VALUES (
      oid, r.id, r.name, split_part(r.name, ' ', 1),
      (CURRENT_DATE + idx)::date,
      CASE WHEN (idx % 2)=0 THEN '09:00' ELSE '14:30' END,
      CASE WHEN (idx % 3)=0 THEN 'approved' WHEN (idx % 3)=1 THEN 'pending' ELSE 'rejected' END,
      'Linked site visit for supervision schedule',
      now() - ((idx)::text || ' days')::interval
    );
  END LOOP;
END $$;
COMMIT;
SELECT "projectId", count(*) FROM progress_snapshot GROUP BY 1 ORDER BY 1;
SELECT id, name, "progressPlanned", "progressActual" FROM project ORDER BY id;
SELECT i.id, i.title, p.code FROM inspection i JOIN project p ON p.id = i."projectId" ORDER BY i.id LIMIT 8;
SELECT status, count(*) FROM site_visit_request GROUP BY status;
