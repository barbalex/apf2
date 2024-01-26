-- basic method:
-- 1 import if obs_id doesn't exist yet
-- 2 update data where obs_id exists already
-- 3 ignore where tpop guid is in external_id field
--
-- Some notes to the data:
-- - copyright: dieses feld fehlt diesmal
-- - mehrere neue Felder: citation, project_id, project_name, external_id, image_1_url, image_2_url, image_3_url, modified_when, timestamp
-- - timestamp feld nicht importiert, macht keinen Sinn (Daten in den drei Datums-Feldern enthalten)
-- - guid Feld fehlt, scheint vom external_id ersetzt zu werden
-- - xy-radius ist jetzt numeric statt integer
-- - obs_id 2984237 ist doppelt vorhanden!!!! Entfernt > 53'625 Beobachtungen
--
-- TODO: BEWARE info flora delivers some uuid's with CAPITAL letters!!!!!!
-- Next time: lowercase all strings in the external_id field before importing!
-- Maybe: remove all non uuid like values (numbers!) beforehand
--
-- 1 create temporary table for import data
CREATE TABLE apflora.infoflora20240117original(
  interpretation_note text,
  sisf_id integer, -- was: no_isfs
  tax_id_intern integer, -- was named taxon_id in delevered list
  taxon text,
  doubt_status text,
  determinavit_cf text,
  presence text,
  introduction text,
  obs_day integer,
  obs_month integer,
  obs_year integer,
  date_expert text,
  observers text,
  country text,
  canton text,
  municipality text,
  region_biogeo text,
  spatial_resolution text,
  -- DANGER: is now numeric instead of integer
  x_swiss numeric,
  -- DANGER: is now numeric instead of integer
  y_swiss numeric,
  xy_type text,
  xy_radius numeric,
  geo_expert text,
  locality_descript text,
  altitude_min integer,
  altitude_max integer,
  altitude_expert text,
  abundance_cat text,
  count_unit text,
  abundance text,
  remarks text,
  typo_ch integer,
  phenology_code integer,
  obs_id integer PRIMARY KEY,
  citation text, -- new
  project_id integer, -- new
  project_name text, -- new
  external_id text, -- new
  obs_type text,
  specimen_type text,
  herbarium_localization text,
  herbarium_collection text,
  external_uid text,
  reference text,
  native_status text,
  redlist text,
  regional_redlist text,
  priority text,
  measures integer,
  monitoring integer,
  ch_protection integer,
  cantonal_protection integer,
  uzl text,
  wzl text,
  invasive text,
  taxon_link text,
  family text,
  name_de text,
  name_fr text,
  name_it text,
  original_taxon text,
  taxon_expert text,
  determinavit text,
  locality_id integer,
  releve_type text,
  releve_stratum text,
  cover_code text,
  cover_abs real,
  cover_rem text,
  image_1_url text, -- new
  image_2_url text, -- new
  image_3_url text, -- new
  modified_when text -- new
);

CREATE INDEX ON apflora.infoflora20240117original USING btree(sisf_id);

CREATE INDEX ON apflora.infoflora20240117original USING btree(tax_id_intern);

CREATE INDEX ON apflora.infoflora20240117original USING btree(obs_id);

-- 2 import into apflora.infoflora20240117original
--   using pgAdmin from csv
--   xxx von 53'625 (was: 710)
--
-- 2.1: add human readable value to doubt_status
UPDATE
  apflora.infoflora20240117original
SET
  doubt_status = '0 (validiert)'
WHERE
  doubt_status = '0';

UPDATE
  apflora.infoflora20240117original
SET
  doubt_status = '1 (zu validieren)'
WHERE
  doubt_status = '1';

UPDATE
  apflora.infoflora20240117original
SET
  doubt_status = '2 (zweifelhaft)'
WHERE
  doubt_status = '2';

UPDATE
  apflora.infoflora20240117original
SET
  doubt_status = '3 (falsch)'
WHERE
  doubt_status = '3';

--
-- 3 build temp beob table
CREATE TABLE apflora.infoflora20240117beob(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id uuid DEFAULT NULL,
  obs_id integer,
  is_apflora_ek boolean DEFAULT FALSE,
  already_imported boolean DEFAULT FALSE,
  quelle text DEFAULT NULL,
  -- this field in data contains this datasets id
  id_field varchar(38) DEFAULT NULL,
  art_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  -- art_id can be changed. art_id_original documents this change
  art_id_original uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  -- data without year is not imported
  -- when no month exists: month = 01
  -- when no day exists: day = 01
  datum date DEFAULT NULL,
  -- Nachname Vorname
  autor varchar(100) DEFAULT NULL,
  -- data without coordinates is not imported
  geom_point geometry(point, 4326) DEFAULT NULL,
  -- maybe later add a geojson field for polygons?
  data jsonb,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.infoflora20240117beob USING btree(obs_id);

CREATE INDEX ON apflora.infoflora20240117beob USING btree(already_imported);

-- 4 insert importdata into temp beob table
INSERT INTO apflora.infoflora20240117beob(external_id, obs_id, id_field, datum, autor, data, art_id, art_id_original, changed_by, geom_point, quelle)
SELECT
  -- 2024.01.26: added lower because some uuid's are in CAPITAL letters
  uuid_or_null(lower(external_id::text)),
  obs_id,
  'obs_id',
  format('%s-%s-%s', obs_year, coalesce(obs_month, '01'), coalesce(obs_day, '01'))::date,
  observers,
  row_to_json(ROW),
  -- use COALESCE(expression,replacement) to choose from sisf 2005 for Makroalgen
  COALESCE((
    SELECT
      id
    FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid_intern = tax_id_intern
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
    SELECT
      id
    FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid = tax_id_intern::bigint
      AND tax.taxonomie_name = 'SISF (2005)')),
  coalesce((
    SELECT
      id
    FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid_intern = tax_id_intern
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'),(
    SELECT
      id
    FROM apflora.ae_taxonomies tax
  WHERE
    tax.taxid = tax_id_intern::bigint
    AND tax.taxonomie_name = 'SISF (2005)')),
  'ag (import)',
  ST_Transform(ST_SetSRID(ST_MakePoint(x_swiss, y_swiss), 2056), 4326),
  'Info Flora 2023.12' -- TODO: set value
FROM
  apflora.infoflora20240117original ROW;

-- 53'625 (was: 710)
--
-- 5 mark apflora kontrollen with is_apflora_ek = TRUE
UPDATE
  apflora.infoflora20240117beob
SET
  is_apflora_ek = TRUE
WHERE
  external_id IN (
    SELECT
      id
    FROM
      apflora.tpopkontr);

-- 9663 (was: 0)
--
-- 6 mark beob already imported with already_imported = TRUE
SELECT
  *
FROM
  apflora.infoflora20240117beob
WHERE
  id IN (
    SELECT
      info.id
    FROM
      apflora.infoflora20240117beob info
      INNER JOIN apflora.beob beob ON beob.obs_id = info.obs_id);

UPDATE
  apflora.infoflora20240117beob
SET
  already_imported = TRUE
WHERE
  id IN (
    SELECT
      info.id
    FROM
      apflora.infoflora20240117beob info
      INNER JOIN apflora.beob beob ON beob.obs_id = info.obs_id);

-- 38'500 (was: 495 von 710)
--
-- 7 check infoflora20240117beob
--
-- 8 insert new temp beob into beob
INSERT INTO apflora.beob(id, id_field, obs_id, datum, autor, data, art_id, art_id_original, changed_by, geom_point, quelle)
SELECT
  id,
  id_field,
  obs_id,
  datum,
  autor,
  data,
  art_id,
  art_id_original,
  changed_by,
  geom_point,
  quelle
FROM
  apflora.infoflora20240117beob
WHERE
  is_apflora_ek = FALSE
  AND already_imported = FALSE;

-- 5462 (was: 215)
--
-- 9 update data for already_imported = true
-- compare with previous state
-- and list where species changed. Well, not easy as taxonomy changed often...
SELECT
  previous.id,
  previous.data AS data_previously,
  previous.art_id AS art_id_previously,
  tax_previously.taxonomie_name AS taxonomie_name_previously,
  tax_previously.artname AS artname_previously,
  new.art_id AS art_id_new,
  tax_new.taxonomie_name AS taxonomie_name_new,
  tax_new.artname AS artname_new,
  new.data AS data_new
FROM
  apflora.beob previous
  INNER JOIN apflora.ae_taxonomies tax_previously ON tax_previously.id = previous.art_id
  INNER JOIN apflora.infoflora20240117beob new ON previous.obs_id = new.obs_id
  INNER JOIN apflora.ae_taxonomies tax_new ON tax_new.id = new.art_id
WHERE
  previous.obs_id IS NOT NULL
  AND new.already_imported = TRUE
  AND new.is_apflora_ek = FALSE;

UPDATE
  apflora.beob
SET
  data =(
    SELECT
      data
    FROM
      apflora.infoflora20240117beob
    WHERE
      apflora.beob.obs_id = obs_id)
WHERE
  obs_id IS NOT NULL
  AND obs_id IN (
    SELECT
      obs_id
    FROM
      apflora.infoflora20240117beob
    WHERE
      already_imported = TRUE
      AND is_apflora_ek = FALSE);

-- 38'499 (was: 495)
--
-- 10 get stats
SELECT
  quelle,
  count(id)
FROM
  apflora.beob
GROUP BY
  quelle
ORDER BY
  count(id) DESC;

-- result:
-- "EvAB 2016"	228791
-- "Info Flora 2017"	192606
-- "FloZ 2017"	30935
-- "Info Flora 2021.05"	17638
-- "Info Flora 2022.03"	15012
-- "Info Flora 2023.12"	5462
-- "Info Flora 2022.12 gesamt"	3029
-- "Info Flora 2022.01"	459
-- "Info Flora 2023.02 Utricularia"	215
-- "Info Flora 2022.08"	208
-- "Info Flora 2022.04"	87
-- "Info Flora 2022.12 Auszug"	16
--
-- count beob per art
SELECT
  beob.art_id,
  tax.artname,
  count(beob.id)
FROM
  apflora.beob beob
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = beob.art_id
GROUP BY
  beob.art_id,
  tax.artname
ORDER BY
  count(beob.id) DESC;

