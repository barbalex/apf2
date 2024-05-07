-- 1. create table to import data to
CREATE TABLE apflora.infoflora20240507beobtodelete(
  obs_id_deleted integer,
  obs_id_kept integer,
  tpopkontr_id uuid
);

CREATE INDEX ON apflora.infoflora20240507beobtodelete USING btree(obs_id_deleted);

CREATE INDEX ON apflora.infoflora20240507beobtodelete USING btree(obs_id_kept);

CREATE INDEX ON apflora.infoflora20240507beobtodelete USING btree(tpopkontr_id);

-- 2. import data (manually using pgadmin)
-- 1839
--
-- 3. find rows in apflora.beob where obs_id equals obs_id_deleted
SELECT
  count(*)
FROM
  apflora.beob
  INNER JOIN apflora.infoflora20240507beobtodelete ON beob.obs_id = obs_id_deleted;

-- 1708
-- 3a find rows in apflora.beob where data-->obs_id equals obs_id_deleted
SELECT
  count(*)
FROM
  apflora.beob
  INNER JOIN apflora.infoflora20240507beobtodelete ON (data ->> 'obs_id')::integer = obs_id_deleted;

-- 1708
--
-- 4. find rows in apflora.beob where obs_id equals obs_id_kept
SELECT
  count(*)
FROM
  apflora.beob
  INNER JOIN apflora.infoflora20240507beobtodelete ON beob.obs_id = obs_id_kept;

-- 9
--
-- 4b find rows in apflora.beob where data-->obs_id equals obs_id_kept
SELECT
  count(*)
FROM
  apflora.beob
  INNER JOIN apflora.infoflora20240507beobtodelete ON (data ->> 'obs_id')::integer = obs_id_kept;

-- 9
--
-- 5. find rows in apflora.tpopkontr where tpopkontr_id equals tpopkontr_id
SELECT
  count(*)
FROM
  apflora.tpopkontr
  INNER JOIN apflora.infoflora20240507beobtodelete ON tpopkontr.id = tpopkontr_id;

-- 1830
-- So it seems not all beob were imported or some were since deleted
--
-- 6. find apflora.beob where obs_id_deleted or obs_id_kept is beob.obs_id and tpop_id is not null
SELECT
  count(*)
FROM
  apflora.beob
WHERE (obs_id IN (
    SELECT
      obs_id_deleted
    FROM
      apflora.infoflora20240507beobtodelete)
    OR obs_id IN (
      SELECT
        obs_id_kept
      FROM
        apflora.infoflora20240507beobtodelete))
  AND tpop_id IS NOT NULL;

-- 420
-- wtf?
-- 6b list them and add tpop_nr, pop_nr, ap.art_id and ae_taxonomies.artname
SELECT
  tax.artname,
  pop.nr AS pop_nr,
  tpop.nr AS tpop_nr,
  beob.datum,
  beob.autor,
  beob.obs_id
FROM
  apflora.beob
  INNER JOIN apflora.tpop ON beob.tpop_id = tpop.id
  INNER JOIN apflora.pop ON tpop.pop_id = pop.id
  INNER JOIN apflora.ap ON pop.ap_id = ap.id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
WHERE (obs_id IN (
    SELECT
      obs_id_deleted
    FROM
      apflora.infoflora20240507beobtodelete)
    OR obs_id IN (
      SELECT
        obs_id_kept
      FROM
        apflora.infoflora20240507beobtodelete))
  AND tpop_id IS NOT NULL
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr,
  beob.datum,
  beob.autor;

-- 7. delete beob where obs_id_deleted or obs_id_kept is beob.obs_id
SELECT
  count(*)
FROM
  apflora.beob
WHERE (obs_id IN (
    SELECT
      obs_id_deleted
    FROM
      apflora.infoflora20240507beobtodelete)
    OR obs_id IN (
      SELECT
        obs_id_kept
      FROM
        apflora.infoflora20240507beobtodelete));

-- 1717
DELETE FROM apflora.beob
WHERE (obs_id IN (
      SELECT
        obs_id_deleted
      FROM
        apflora.infoflora20240507beobtodelete)
      OR obs_id IN (
        SELECT
          obs_id_kept
        FROM
          apflora.infoflora20240507beobtodelete));

-- 1717
