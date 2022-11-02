CREATE TABLE apflora.infoflora20220925korrektur (
  guid text,
  obs_id integer PRIMARY KEY
);

SELECT
  *
FROM
  apflora.infoflora20220925korrektur korr
  INNER JOIN apflora.beob beob ON beob.obs_id = korr.obs_id;

SELECT
  *
FROM
  apflora.infoflora20220925korrektur korr
  INNER JOIN apflora.tpopkontr kontr ON korr.guid = kontr.id;

-- show and export the beob
SELECT
  tax.artname,
  pop.nr,
  tpop.nr,
  beob.*
FROM
  apflora.infoflora20220925korrektur korr
  INNER JOIN apflora.tpopkontr kontr ON korr.guid::uuid = kontr.id
  INNER JOIN apflora.tpop tpop ON tpop.id = kontr.tpop_id
  INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
  INNER JOIN apflora.ap ON ap.id = pop.ap_id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  INNER JOIN apflora.beob beob ON beob.obs_id = korr.obs_id
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr;

-- delete them
DELETE FROM apflora.beob
WHERE id IN (
    SELECT
      beob.id
    FROM
      apflora.infoflora20220925korrektur korr
      INNER JOIN apflora.beob beob ON beob.obs_id = korr.obs_id);

-- 1060
