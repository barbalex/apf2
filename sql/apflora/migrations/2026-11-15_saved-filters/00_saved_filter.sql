-- Saved data filters: the complete form-data filter state of the Filter
-- panel (treeDataFilterAtom: per-table multi-"oder" filter objects) is
-- persisted as jsonb, so a filter view is linkable via ?savedFilter=<id>
-- and shareable across users.
--
-- Access model: every authenticated role may read and load every saved
-- filter (filters describe views, not data changes). Creating is the
-- same privilege as creating file records: apflora_ap_writer,
-- apflora_freiwillig, apflora_manager. Renaming, overwriting and
-- deleting are the owner's (or a manager's) alone. id, created_at and
-- created_by are forced server-side, so a client cannot pose as someone
-- else when saving.

CREATE TABLE IF NOT EXISTS apflora.saved_filter (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  name text NOT NULL CHECK (char_length(name) <= 100),
  filter jsonb NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_filter_name_idx ON apflora.saved_filter USING btree(name);

COMMENT ON TABLE apflora.saved_filter IS 'Gespeicherte Daten-Filter der Filter-Auswahl: der komplette Formulardaten-Filter (treeDataFilterAtom) als jsonb, verlinkbar via ?savedFilter=<id>';

COMMENT ON COLUMN apflora.saved_filter.name IS 'Name des gespeicherten Filters';

COMMENT ON COLUMN apflora.saved_filter.filter IS 'Kompletter Formulardaten-Filter: { ap: [...], pop: [...], tpop: [...], tpopmassn: [...], tpopfeldkontr: [...], tpopfreiwkontr: [...] }';

COMMENT ON COLUMN apflora.saved_filter.created_by IS 'Kontoname des Erstellers (serverseitig erzwungen)';

CREATE OR REPLACE FUNCTION apflora.saved_filter_force_defaults()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.id := uuidv7();
    NEW.created_at := now();
    -- unqualified like the RLS policies call it: the function lives in
    -- public on backup-based databases and in apflora on fresh ones
    NEW.created_by := current_user_name();
  ELSE
    NEW.updated_at := now();
    NEW.created_at := OLD.created_at;
    NEW.created_by := OLD.created_by;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS saved_filter_force_defaults ON apflora.saved_filter;
CREATE TRIGGER saved_filter_force_defaults
  BEFORE INSERT OR UPDATE ON apflora.saved_filter
  FOR EACH ROW EXECUTE FUNCTION apflora.saved_filter_force_defaults();

ALTER TABLE apflora.saved_filter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reader ON apflora.saved_filter;
CREATE POLICY reader ON apflora.saved_filter
  FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS writer ON apflora.saved_filter;
CREATE POLICY writer ON apflora.saved_filter
  FOR INSERT
  WITH CHECK (CURRENT_USER IN ('apflora_ap_writer', 'apflora_freiwillig', 'apflora_manager'));

DROP POLICY IF EXISTS owner_or_manager ON apflora.saved_filter;
CREATE POLICY owner_or_manager ON apflora.saved_filter
  FOR UPDATE
  USING (
    created_by = current_user_name()
    OR CURRENT_USER = 'apflora_manager'
  )
  WITH CHECK (
    created_by = current_user_name()
    OR CURRENT_USER = 'apflora_manager'
  );

DROP POLICY IF EXISTS owner_or_manager_delete ON apflora.saved_filter;
CREATE POLICY owner_or_manager_delete ON apflora.saved_filter
  FOR DELETE
  USING (
    created_by = current_user_name()
    OR CURRENT_USER = 'apflora_manager'
  );

GRANT SELECT ON apflora.saved_filter TO
  apflora_reader, apflora_ap_reader, apflora_ap_writer,
  apflora_freiwillig, apflora_manager;
GRANT INSERT, UPDATE, DELETE ON apflora.saved_filter TO
  apflora_ap_writer, apflora_freiwillig, apflora_manager;
