-- Fix "permission denied for table user" for non-manager roles (#823 follow-up)
--
-- The computed field apflora.user_label(u) takes the whole row as its
-- argument. Passing a whole-row composite requires SELECT privilege on
-- EVERY column of apflora.user - column grants on name/role alone are
-- not enough. Only apflora_manager had SELECT on
-- require_new_password_on_next_login, so for all other roles every
-- query returning UserFields { ... label ... } failed, e.g. the
-- EKF-Benutzer dialog's password change: the UPDATE itself succeeded
-- but the mutation's RETURNING (which selects label) was denied and
-- rolled the whole transaction back - the password was never saved.
--
-- createTables.sql always intended anon to have this column; these
-- grants restore that intent for every app role. The column is a
-- boolean flag, not sensitive data.

GRANT SELECT (require_new_password_on_next_login) ON TABLE apflora.user TO anon;
GRANT SELECT (require_new_password_on_next_login) ON TABLE apflora.user TO apflora_reader;
GRANT SELECT (require_new_password_on_next_login) ON TABLE apflora.user TO apflora_ap_reader;
GRANT SELECT (require_new_password_on_next_login) ON TABLE apflora.user TO apflora_ap_writer;
GRANT SELECT (require_new_password_on_next_login) ON TABLE apflora.user TO apflora_freiwillig;
