-- basic method:
-- 1 import if obs_id doesn't exist yet
-- TODO: next time: replace EVAB beobs with incoming by updating av's data, see 2022-08-24 pt. 5
-- 2 update data where obs_id exists already
-- 3 ignore where tpop guid is in guid field
--
-- 1 create temporary table for import data
CREATE TABLE apflora.infoflora20220401original (
  GUID text,
  interpretation_note text,
  no_isfs integer,
  tax_id_intern integer,
  taxon text,
  validation_status integer,
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
  x_swiss integer,
  y_swiss integer,
  xy_type text,
  xy_radius integer,
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
  copyright text,
  obs_id integer PRIMARY KEY,
  obs_type text,
  specimen_type text,
  herbarium_localization text,
  herbarium_collection text,
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
  black_list text,
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
  control_type text,
  eradication text
);

CREATE INDEX ON apflora.infoflora20220401original USING btree (no_isfs);

CREATE INDEX ON apflora.infoflora20220401original USING btree (tax_id_intern);

CREATE INDEX ON apflora.infoflora20220401original USING btree (obs_id);

-- 2 import into apflora.infoflora20220401original
--   using pgAdmin from csv
--   2'064 Beobachtungen
--
-- 3 build temp beob table
CREATE TABLE apflora.infoflora20220401beob (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc (),
  guid uuid DEFAULT NULL,
  obs_id integer,
  is_apflora_ek boolean DEFAULT FALSE,
  already_imported boolean DEFAULT FALSE,
  quelle text DEFAULT NULL,
  -- this field in data contains this datasets id
  id_field varchar(38) DEFAULT NULL,
  art_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies (id) ON DELETE NO action ON UPDATE CASCADE,
  -- art_id can be changed. art_id_original documents this change
  art_id_original uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies (id) ON DELETE NO action ON UPDATE CASCADE,
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

CREATE INDEX ON apflora.infoflora20220401beob USING btree (obs_id);

CREATE INDEX ON apflora.infoflora20220401beob USING btree (already_imported);

-- 4 insert importdata into temp beob table
INSERT INTO apflora.infoflora20220401beob (guid, obs_id, id_field, datum, autor, data, art_id, art_id_original, changed_by, geom_point, quelle)
SELECT
  uuid_or_null (guid),
  obs_id,
  'obs_id',
  format('%s-%s-%s', obs_year, coalesce(obs_month, '01'), coalesce(obs_day, '01'))::date,
  observers,
  row_to_json(ROW),
  -- TODO: next time: use COALESCE(expression,replacement) to choose from sisf 2005 for Makroalgen
  -- https://www.postgresqltutorial.com/postgresql-isnull/
  COALESCE((
    SELECT
      id
    FROM apflora.ae_taxonomies tax
    WHERE
      tax.taxid_intern = tax_id_intern
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'), (
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
      AND tax.taxonomie_name = 'DB-TAXREF (2017)'), (
    SELECT
      id
    FROM apflora.ae_taxonomies tax
  WHERE
    tax.taxid = tax_id_intern::bigint
    AND tax.taxonomie_name = 'SISF (2005)')),
  'ag (import)',
  ST_Transform (ST_SetSRID (ST_MakePoint (x_swiss, y_swiss), 2056), 4326),
  'Info Flora 2022.04'
FROM
  apflora.infoflora20220401original ROW;

-- 2'064
--
-- 5 mark apflora kontrollen with is_apflora_ek = TRUE
UPDATE
  apflora.infoflora20220401beob
SET
  is_apflora_ek = TRUE
WHERE
  guid IN (
    SELECT
      id
    FROM
      apflora.tpopkontr);

-- 0
--
-- 6 mark beob already imported with already_imported = TRUE
SELECT
  *
FROM
  apflora.infoflora20220401beob
WHERE
  id IN (
    SELECT
      info.id
    FROM
      apflora.infoflora20220401beob info
      INNER JOIN apflora.beob beob ON beob.obs_id = info.obs_id);

UPDATE
  apflora.infoflora20220401beob
SET
  already_imported = TRUE
WHERE
  id IN (
    SELECT
      info.id
    FROM
      apflora.infoflora20220401beob info
      INNER JOIN apflora.beob beob ON beob.obs_id = info.obs_id);

-- 917
--
-- 7 check infoflora20220401beob
--
-- 8 insert new temp beob into beob
INSERT INTO apflora.beob (id, id_field, obs_id, datum, autor, data, art_id, art_id_original, changed_by, geom_point, quelle)
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
  apflora.infoflora20220401beob
WHERE
  is_apflora_ek = FALSE
  AND already_imported = FALSE;

-- 1'147
--
-- 9 update data for already_imported = true (NOT this time)
-- TODO: next time export previous state of these to compare
--       and list where species changed
SELECT
  outerbeob.id,
  outerbeob.data,
  (
    SELECT
      data
    FROM
      apflora.infoflora20220401beob
    WHERE
      outerbeob.obs_id = obs_id) AS new_data
FROM
  apflora.beob outerbeob
WHERE
  obs_id IS NOT NULL
  AND obs_id IN (
    SELECT
      obs_id
    FROM
      apflora.infoflora20220401beob
    WHERE
      already_imported = TRUE);

UPDATE
  apflora.beob
SET
  data = (
    SELECT
      data
    FROM
      apflora.infoflora20220401beob
    WHERE
      apflora.beob.obs_id = obs_id)
WHERE
  obs_id IS NOT NULL
  AND obs_id IN (
    SELECT
      obs_id
    FROM
      apflora.infoflora20220401beob
    WHERE
      already_imported = TRUE);

-- 21'630
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

-- "EvAB 2016"	        232595
-- "Info Flora 2017"	  192606
-- "FloZ 2017"	         30935
-- "Info Flora 2021.05"  17638
-- "Info Flora 2022.03"	 15012
-- "Info Flora 2022.04"	  1147
-- "Info Flora 2022.01"	   459
-- Beachte: viele Arten haben keine Taxref-AP-Art. Daher erscheinen die Beob nicht
--
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

-- ? rows
