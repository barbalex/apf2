-- #836: "Meldungen Qualitätskontrolle nicht sichtbar" for ap-writer
-- accounts (and their Mitarbeiterinnen), while manager accounts see them.
--
-- Root cause: the authenticated read roles hold only column-level SELECT
-- on apflora."user" (03_grant_require_new_password_permissions.sql /
-- 2026-10-12_issue-823-ekf-passwort / 0062's old_id grant). q_user,
-- v_user, query_user and the user_label computed function take the
-- whole row, so ONE missing column - today: old_id - denies the query:
--
--   GET /q_user  (apflora_ap_writer)
--   -> 42501 "permission denied for table user"
--
-- useRootNavData counts users via /q_user and query_user on every page
-- under /Daten, so the whole Daten workspace (incl. Qualitätskontrollen)
-- dies behind the error overlay for every non-manager role. Same failure
-- class as #825; column lists re-break on every new user column.
--
-- Durable fix: table-level SELECT for the authenticated roles (they can
-- already read every column individually, incl. pass - the whole row is
-- passed to user_label). anon stays column-level: no pass, no email
-- (see 2026-11-04_issue-835 and 05_revoke_anonymous_pass_access.sql).

GRANT SELECT ON apflora."user"
  TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_freiwillig;

-- verify afterwards (every row must be true):
--   SELECT r, has_table_privilege(r, 'apflora.user', 'SELECT')
--   FROM unnest(ARRAY['apflora_reader','apflora_ap_reader','apflora_ap_writer','apflora_freiwillig','apflora_manager']) r;
