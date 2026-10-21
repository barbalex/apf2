-- One-time data migration: rewrite existing ids from uuid v1 to uuid v7.
-- Run in a maintenance window: single transaction, blocks writes while it runs.
-- (measured locally on the 2026-10 backup: ~80 s, ~1.2 GB database)
--
-- How it works:
-- - new ids are deterministic uuidv7: timestamp bits from created_at
--   (message: "time"; currentissue/user/usermessage: epoch),
--   random bits from md5(old_id). Collision-free, time-ordered.
-- - each rewritten table gets an old_id column with the previous id.
--   apflora.tpopkontr.old_id is PERMANENT: info flora correlates
--   kontrollen by it (see export_info_flora / import_info_flora).
--   The old_id columns of the other tables can be dropped after
--   a year, once it is clear they are no longer needed (-> ~2027-10).
-- - ae_taxonomies and beob keep their ids (externally owned:
--   arteigenschaften.ch / Info Flora-Evab imports). Their FK columns
--   pointing at rewritten tables are updated automatically (ON UPDATE CASCADE).
--   BEWARE: contrary to the intention, beob WAS included in the generated
--   table list below (its inert uuid default made it slip in) and got
--   rewritten. Corrected the same day in 0062: ids restored from old_id.
-- - *_history snapshot ids are synced to the new ids so the next historize
--   run does not create duplicate (id, year) rows. History rows of
--   since-deleted entities keep their old ids (consistent among themselves).
-- - user triggers are disabled during the rewrite and re-enabled afterwards:
--   the business-rule validators would fire per row and ap_update_add_apart
--   would insert rows.
--
-- Afterwards: VACUUM (ANALYZE); regenerate models/graphql types at leisure
-- (oldId fields are added). Drop public.uuidv7_from_ts together with the
-- old_id columns.

BEGIN;

-- abort if there is nothing to migrate
DO $$
DECLARE
  r record;
  c bigint;
  non_v7 bigint := 0;
BEGIN
  FOR r IN
    SELECT c2.relname
    FROM pg_class c2
    JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
    JOIN pg_attribute a ON a.attrelid = c2.oid AND a.attname = 'id' AND a.atttypid = 'uuid'::regtype AND NOT a.attisdropped
    JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    WHERE n2.nspname = 'apflora' AND c2.relkind = 'r'
      AND pg_get_expr(d.adbin, d.adrelid) IN ('uuid_generate_v1mc()', 'uuidv7()')
  LOOP
    EXECUTE format('SELECT count(*) FROM apflora.%I WHERE substr(id::text, 15, 1) <> ''7''', r.relname) INTO c;
    non_v7 := non_v7 + c;
  END LOOP;
  IF non_v7 = 0 THEN
    RAISE EXCEPTION 'no non-v7 ids found - already migrated?';
  END IF;
END
$$;

-- deterministic uuidv7: 48 bit unix-ms timestamp, version 7,
-- 12 bit rand_a and 62 bit rand_b from md5(old_id)
CREATE OR REPLACE FUNCTION public.uuidv7_from_ts(ts timestamptz, seed uuid)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT (
    lpad(to_hex(greatest((extract(epoch FROM ts) * 1000)::bigint, 0)), 12, '0')
    || '7' || substr(md5(seed::text), 1, 3)
    || '8' || substr(md5(seed::text), 4, 15)
  )::uuid
$$;

ALTER TABLE apflora.adresse ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_bearbstand_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_erfbeurtkrit_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_erfkrit_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_umsetzung_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ap_user ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.apart ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.apber ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.apberuebersicht ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.assozart ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.beob ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.currentissue ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.detailplaene ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ek_abrechnungstyp_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ekfrequenz ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ekplan ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ekzaehleinheit ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.erfkrit ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.idealbiotop ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.idealbiotop_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.message ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.pop ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.pop_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.pop_status_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.popber ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.popmassnber ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.projekt ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpop ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpop_apberrelevant_grund_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpop_entwicklung_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpop_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopber ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontr ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontr_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontr_typ_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontrzaehl ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopmassn ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopmassn_file ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopmassn_typ_werte ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.tpopmassnber ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora."user" ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.usermessage ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ziel ADD COLUMN IF NOT EXISTS old_id uuid;
ALTER TABLE apflora.ziel_typ_werte ADD COLUMN IF NOT EXISTS old_id uuid;

-- info flora matches kontrollen by old_id (see import_info_flora)
CREATE INDEX IF NOT EXISTS tpopkontr_old_id_idx ON apflora.tpopkontr (old_id);

-- disable user triggers on apflora tables (remember which ones)
CREATE TEMP TABLE _disabled_triggers ON COMMIT DROP AS
SELECT t.tgrelid, t.tgname
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'apflora' AND NOT t.tgisinternal AND t.tgenabled = 'O';

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT tgrelid::regclass AS tbl, tgname FROM _disabled_triggers LOOP
    EXECUTE format('ALTER TABLE %s DISABLE TRIGGER %I', r.tbl, r.tgname);
  END LOOP;
END
$$;

-- rewrite the ids. FK references follow via ON UPDATE CASCADE,
-- including ap_history.id and pop_history.ap_id
UPDATE apflora.adresse AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_bearbstand_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_erfbeurtkrit_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_erfkrit_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_umsetzung_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ap_user AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.apart AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.apber AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.apberuebersicht AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.assozart AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.beob AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.currentissue AS t SET old_id = t.id, id = public.uuidv7_from_ts(timestamptz '1970-01-01', t.id);
UPDATE apflora.detailplaene AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ek_abrechnungstyp_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ekfrequenz AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ekplan AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ekzaehleinheit AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.erfkrit AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.idealbiotop AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.idealbiotop_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.message AS t SET old_id = t.id, id = public.uuidv7_from_ts("time" AT TIME ZONE 'UTC', t.id);
UPDATE apflora.pop AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.pop_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.pop_status_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.popber AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.popmassnber AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.projekt AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpop AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpop_apberrelevant_grund_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpop_entwicklung_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpop_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopber AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontr AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontr_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontr_idbiotuebereinst_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontr_typ_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontrzaehl AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontrzaehl_einheit_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopkontrzaehl_methode_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopmassn AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopmassn_erfbeurt_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopmassn_file AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopmassn_typ_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.tpopmassnber AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora."user" AS t SET old_id = t.id, id = public.uuidv7_from_ts(timestamptz '1970-01-01', t.id);
UPDATE apflora.usermessage AS t SET old_id = t.id, id = public.uuidv7_from_ts(timestamptz '1970-01-01', t.id);
UPDATE apflora.ziel AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);
UPDATE apflora.ziel_typ_werte AS t SET old_id = t.id, id = public.uuidv7_from_ts(t.created_at, t.id);

-- pop_history.id and tpop_history.id have no FK to their entity tables:
-- sync them via old_id. tpop_history -> pop_history is the only FK
-- without ON UPDATE CASCADE, so drop and re-add it around the updates.
ALTER TABLE apflora.tpop_history DROP CONSTRAINT fk_pop_history;

UPDATE apflora.pop_history AS h
SET id = p.id
FROM apflora.pop p
WHERE p.old_id = h.id;

UPDATE apflora.tpop_history AS t
SET id = tp.id
FROM apflora.tpop tp
WHERE tp.old_id = t.id;

UPDATE apflora.tpop_history AS t
SET pop_id = p.id
FROM apflora.pop p
WHERE p.old_id = t.pop_id;

ALTER TABLE apflora.tpop_history
  ADD CONSTRAINT fk_pop_history FOREIGN KEY (year, pop_id)
  REFERENCES apflora.pop_history (year, id) ON DELETE CASCADE;

-- re-enable the triggers
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT tgrelid::regclass AS tbl, tgname FROM _disabled_triggers LOOP
    EXECUTE format('ALTER TABLE %s ENABLE TRIGGER %I', r.tbl, r.tgname);
  END LOOP;
END
$$;

-- verify
DO $$
DECLARE
  r record;
  ok boolean;
BEGIN
  FOR r IN
    SELECT c2.relname
    FROM pg_class c2
    JOIN pg_namespace n2 ON n2.oid = c2.relnamespace
    JOIN pg_attribute a ON a.attrelid = c2.oid AND a.attname = 'id' AND a.atttypid = 'uuid'::regtype AND NOT a.attisdropped
    JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    WHERE n2.nspname = 'apflora' AND c2.relkind = 'r'
      AND pg_get_expr(d.adbin, d.adrelid) IN ('uuid_generate_v1mc()', 'uuidv7()')
  LOOP
    EXECUTE format(
      'SELECT coalesce(bool_and(substr(id::text, 15, 1) = ''7''), true)
         AND coalesce(bool_and(id <> old_id), true)
         AND count(*) = count(old_id)
         AND count(*) = count(DISTINCT old_id)
       FROM apflora.%I',
      r.relname
    ) INTO ok;
    ASSERT ok, format('%s: ids not v7 / old_id not complete or not distinct', r.relname);
  END LOOP;

  -- no history row may reference a current entity by a pre-v7 id
  ASSERT NOT EXISTS (
    SELECT 1 FROM apflora.ap_history h JOIN apflora.ap e ON e.id = h.id
    WHERE substr(h.id::text, 15, 1) <> '7'
  ), 'ap_history out of sync';
  ASSERT NOT EXISTS (
    SELECT 1 FROM apflora.pop_history h JOIN apflora.pop e ON e.id = h.id
    WHERE substr(h.id::text, 15, 1) <> '7'
  ), 'pop_history out of sync';
  ASSERT NOT EXISTS (
    SELECT 1 FROM apflora.tpop_history h JOIN apflora.tpop e ON e.id = h.id
    WHERE substr(h.id::text, 15, 1) <> '7'
  ), 'tpop_history out of sync';
END
$$;

COMMIT;
