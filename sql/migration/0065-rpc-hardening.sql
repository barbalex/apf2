-- Hardening from the pgrls backlog (SEC042/SEC014/SEC015/SEC045/HYG003):
-- 1. Pin search_path on every SECURITY DEFINER function, with pg_temp
--    last, so caller-controlled schema resolution cannot hijack them.
-- 2. encrypt_pass is only fired as a trigger on apflora."user"; trigger
--    execution needs no EXECUTE privilege, so revoke it from everyone.
-- 3. anon no longer gets column SELECT on the login-forced-change flag.
-- 4. Drop the duplicate writer policy on qk (identical to reader).
--
-- Deliberately NOT changed here (needs a design decision, see tasks.md):
-- set_password allows claiming an account whose pass is still NULL
-- (topos pre-provisions users) and must stay executable by anon for
-- first-time onboarding. Works only because usernames of passless
-- accounts are not treated as secrets.
-- historize/historize_for_ap/correct_vornach_beginnap_stati stay
-- SECURITY DEFINER owned by postgres: they snapshot/correct data across
-- all rows regardless of the caller's RLS scope; grants are limited to
-- apflora_manager/apflora_ap_writer.

BEGIN;

-- 1. search_path pinning (pg_temp last)
ALTER FUNCTION apflora.compile_filter(text, text, jsonb) SET search_path TO pg_catalog, pg_temp;
ALTER FUNCTION apflora.resolve_forward_relation(text, text) SET search_path TO pg_catalog, pg_temp;
ALTER FUNCTION apflora.resolve_reverse_relation(text, text) SET search_path TO pg_catalog, pg_temp;
ALTER FUNCTION apflora.correct_vornach_beginnap_stati(uuid) SET search_path TO pg_catalog, pg_temp;
ALTER FUNCTION apflora.historize(integer) SET search_path TO pg_catalog, pg_temp;
ALTER FUNCTION apflora.historize_for_ap(integer, uuid) SET search_path TO pg_catalog, pg_temp;
-- crypt()/gen_salt() live in public (pgcrypto)
ALTER FUNCTION apflora.encrypt_pass() SET search_path TO pg_catalog, public, pg_temp;
ALTER FUNCTION apflora.set_password(text, text, text) SET search_path TO apflora, public, pg_temp;
-- current_user_name lives in schema public and runs inside every RLS
-- policy; its body only calls current_setting
ALTER FUNCTION public.current_user_name() SET search_path TO pg_catalog, pg_temp;

-- 2. trigger-only function: no one needs EXECUTE
REVOKE EXECUTE ON FUNCTION apflora.encrypt_pass() FROM PUBLIC, anon, authenticator, apflora_reader, apflora_ap_reader, apflora_manager, apflora_ap_writer, apflora_freiwillig;

-- 3. keep the forced-change flag away from anon
REVOKE SELECT (require_new_password_on_next_login) ON apflora."user" FROM anon;

-- 4. exact duplicate of the reader policy (permissive policies OR)
DROP POLICY IF EXISTS writer ON apflora.qk;

-- 5. EXECUTE defaults to PUBLIC unless revoked, so the explicit grants
--    below also left these callable by anon via PostgREST. The explicit
--    grants to apflora_manager/apflora_ap_writer remain.
REVOKE EXECUTE ON FUNCTION apflora.correct_vornach_beginnap_stati(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION apflora.historize(integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION apflora.historize_for_ap(integer, uuid) FROM PUBLIC;
-- set_password keeps its explicit anon grant: pre-provisioned accounts
-- without a password cannot log in (auth.user_role never matches NULL),
-- so this rpc as anon is their only onboarding path
REVOKE EXECUTE ON FUNCTION apflora.set_password(text, text, text) FROM PUBLIC;

COMMIT;
