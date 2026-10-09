-- Uploadcare "secure uploads": signature generation moved from the
-- browser to the database.
-- Before, the frontend computed md5(VITE_UPLOADCARE_SECRET_KEY + expire)
-- itself, which shipped the secret key to every browser (bundled by
-- Vite and cached by the service worker).
-- Now the uploader calls this function via GraphQL and only ever sees
-- the signature. The secret lives in the database setting
-- app.uploadcare_secret (set from UPLOADCARE_SECRET_KEY in .env by
-- backend*/db/init/05_uploadcare_secret.sh on fresh stacks, or via
-- ALTER DATABASE on existing ones - see 00_deploy_uploadcare_signature.md).
-- Signature algorithm per Uploadcare docs: md5(secret + expire),
-- expire being a unix timestamp in seconds.

CREATE TYPE apflora.uploadcare_signature AS (
  expire bigint,
  signature text
);

CREATE OR REPLACE FUNCTION apflora.upload_signature ()
  RETURNS apflora.uploadcare_signature
  LANGUAGE plpgsql
  STABLE
  -- md5 and current_setting live in pg_catalog
  SET search_path = pg_catalog
  AS $$
DECLARE
  _secret text := current_setting('app.uploadcare_secret', true);
  _expire bigint := (extract(epoch FROM now()) + 3600)::bigint;
BEGIN
  IF _secret IS NULL OR _secret = '' THEN
    RAISE EXCEPTION 'app.uploadcare_secret is not set (ALTER DATABASE apflora SET app.uploadcare_secret TO ''...'')';
  END IF;
  RETURN (_expire, md5(_secret || _expire::text));
END
$$;

COMMENT ON FUNCTION apflora.upload_signature () IS
  'Signiert Uploads für Uploadcare (secure uploads): md5(app.uploadcare_secret || expire). Nur für eingeloggte Rollen.';

-- new functions are executable by PUBLIC by default:
-- anon and the read-only roles must NOT be able to mint signatures.
-- readers have no INSERT on the *_file tables, so they cannot upload -
-- a signature would only let them push orphaned files into the
-- uploadcare account
REVOKE EXECUTE ON FUNCTION apflora.upload_signature () FROM PUBLIC, anon, apflora_reader, apflora_ap_reader;

-- only the roles that can actually create file records
-- (apflora_freiwillig has ALL on tpopkontr_file, writers and managers
-- on all file tables)
GRANT EXECUTE ON FUNCTION apflora.upload_signature () TO
  apflora_freiwillig,
  apflora_ap_writer,
  apflora_manager;
