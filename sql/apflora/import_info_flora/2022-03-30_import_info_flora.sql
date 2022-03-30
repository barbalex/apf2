-- TODO: filter as in 2021-11-19_import_info_flora.sql
-- TODO: 1. import if obs_id doesn't exist yet, 2. update data where obs_id exists already
-- 1. create temporary table for import data
CREATE TABLE apflora.infoflora20220330original (
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

CREATE INDEX ON apflora.infoflora20220330original USING btree (no_isfs);

CREATE INDEX ON apflora.infoflora20220330original USING btree (tax_id_intern);

CREATE INDEX ON apflora.infoflora20220330original USING btree (obs_id);

-- 2. import into apflora.infoflora20220330original
-- directly with pgAdmin?
--
-- 3. build temp beob table
CREATE TABLE apflora.infoflora20220330beob (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc (),
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
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE SET NULL ON UPDATE CASCADE,
  nicht_zuordnen boolean DEFAULT FALSE,
  infoflora_informiert_datum date DEFAULT NULL,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);

-- 4. insert importdata into temp beob table
INSERT INTO apflora.infoflora20220330beob (id_field, datum, autor, data, art_id, art_id_original, changed_by, geom_point, quelle)
SELECT
  'obs_id',
  format('%s-%s-%s', obs_year, coalesce(obs_month, '01'), coalesce(obs_day, '01'))::date,
  observers,
  row_to_json(ROW),
  (
    SELECT
      id
    FROM
      apflora.ae_taxonomies
    WHERE
      taxid = no_isfs
      AND taxonomie_name = 'DB-TAXREF (2017)'),
  (
    SELECT
      id
    FROM
      apflora.ae_taxonomies
    WHERE
      taxid = no_isfs
      AND taxonomie_name = 'DB-TAXREF (2017)'),
  'ag (import)',
  ST_Transform (ST_SetSRID (ST_MakePoint (x_swiss, y_swiss), 2056), 4326),
  'Info Flora 2022.01'
FROM
  apflora.infoflora20220330original ROW;

-- 5. check this table
-- 6. insert temp beob into beob
INSERT INTO apflora.beob (id_field, datum, autor, data, art_id, changed_by, geom_point, quelle)
SELECT
  id_field,
  datum,
  autor,
  data,
  art_id,
  changed_by,
  geom_point,
  quelle
FROM
  apflora.infoflora20220330beob;

