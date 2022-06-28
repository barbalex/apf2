-- new table:
-- CREATE TABLE IF NOT EXISTS apflora.detailplaene (
--   id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc (),
--   data jsonb DEFAULT NULL,
--   geom geometry(MultiPolygon, 4326) DEFAULT NULL,
--   created_at timestamptz NOT NULL DEFAULT now(),
--   updated_at timestamptz NOT NULL DEFAULT now(),
--   changed_by varchar(20) DEFAULT NULL
-- );
-- old table
-- CREATE TABLE IF NOT EXISTS apflora.detailplaene (
--   ogc_fid integer NOT NULL DEFAULT nextval('apflora.detailplaene_ogc_fid_seq'::regclass),
--   wkb_geometry geometry(MultiPolygon, 4326),
--   shape_leng double precision,
--   shape_area double precision,
--   pflege_szp character varying COLLATE pg_catalog."default",
--   substrat character varying COLLATE pg_catalog."default",
--   fleachennu character varying COLLATE pg_catalog."default",
--   gebiet character varying COLLATE pg_catalog."default",
--   CONSTRAINT detailplaene_pk PRIMARY KEY (ogc_fid)
-- );
-- 1. clean up data
UPDATE
  apflora.detailplaene0
SET
  fleachennu = NULL
WHERE
  fleachennu = '<Null>';

UPDATE
  apflora.detailplaene0
SET
  pflege_szp = NULL
WHERE
  pflege_szp = '<Null>';

-- 2. insert
INSERT INTO apflora.detailplaene (data, geom, changed_by)
SELECT
  CASE WHEN dp.pflege_szp IS NULL THEN
    CASE WHEN dp.substrat IS NULL THEN
      CASE WHEN dp.fleachennu IS NULL THEN
        jsonb_build_object('gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      ELSE
        jsonb_build_object('flaechennu', dp.fleachennu, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      END
    ELSE
      CASE WHEN dp.fleachennu IS NULL THEN
        jsonb_build_object('substrat', dp.substrat, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      ELSE
        jsonb_build_object('substrat', dp.substrat, 'flaechennu', dp.fleachennu, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      END
    END
  ELSE
    CASE WHEN dp.substrat IS NULL THEN
      CASE WHEN dp.fleachennu IS NULL THEN
        jsonb_build_object('pflege_szp', dp.pflege_szp, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      ELSE
        jsonb_build_object('pflege_szp', dp.pflege_szp, 'flaechennu', dp.fleachennu, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      END
    ELSE
      CASE WHEN dp.fleachennu IS NULL THEN
        jsonb_build_object('pflege_szp', dp.pflege_szp, 'substrat', dp.substrat, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      ELSE
        jsonb_build_object('pflege_szp', dp.pflege_szp, 'substrat', dp.substrat, 'flaechennu', dp.fleachennu, 'gebiet', dp.gebiet, 'ogc_fid', dp.ogc_fid)
      END
    END
  END AS data,
  wkb_geometry AS geom,
  'ag' AS changed_by
FROM
  apflora.detailplaene0 dp;

