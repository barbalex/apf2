-- Error telemetry collector: the opt-in client reporter
-- (src/modules/errorTelemetry.ts) posts one JSON object per client error
-- to VITE_ERROR_TELEMETRY_URL = https://api.apflora.ch/postgrest/error_report
--
-- Privacy model: the payload carries message/stack/url/user-agent/release
-- only — no user identity. Anyone (anon) may append a report; only
-- apflora_manager may read them. Field caps are enforced by CHECKs and
-- id/created_at are forced server-side, so the endpoint cannot be abused
-- as arbitrary storage.

CREATE TABLE IF NOT EXISTS apflora.error_report (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  created_at timestamptz NOT NULL DEFAULT now(),
  release text CHECK (char_length(release) <= 40),
  kind text NOT NULL CHECK (
    kind IN ('window.error', 'unhandledrejection', 'boundary', 'manual')
  ),
  message text NOT NULL CHECK (char_length(message) <= 2000),
  stack text CHECK (char_length(stack) <= 5000),
  url text CHECK (char_length(url) <= 2000),
  user_agent text CHECK (char_length(user_agent) <= 1000)
);

-- force id/created_at regardless of what the client sends
CREATE OR REPLACE FUNCTION apflora.error_report_force_defaults()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.id := uuidv7();
  NEW.created_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS error_report_force_defaults ON apflora.error_report;
CREATE TRIGGER error_report_force_defaults
  BEFORE INSERT ON apflora.error_report
  FOR EACH ROW EXECUTE FUNCTION apflora.error_report_force_defaults();

ALTER TABLE apflora.error_report ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS insert_anon ON apflora.error_report;
CREATE POLICY insert_anon ON apflora.error_report
  FOR INSERT TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS read_manager ON apflora.error_report;
CREATE POLICY read_manager ON apflora.error_report
  FOR SELECT TO apflora_manager
  USING (true);

-- anon: insert only — no read/update/delete
GRANT INSERT ON apflora.error_report TO anon;
GRANT SELECT ON apflora.error_report TO apflora_manager;
