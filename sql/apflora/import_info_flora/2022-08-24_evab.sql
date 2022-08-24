-- list all info flora beob with evab id
SELECT
  beob_from_evab.id_evab_lc AS guid,
  beob.id AS if_id,
  beob.quelle AS if_quelle,
  beob.tpop_id AS if_tpop_id,
  beob_from_evab.id AS evab_id,
  beob_from_evab.quelle AS evab_quelle,
  beob_from_evab.tpop_id AS evab_tpop_id
FROM
  apflora.beob beob
  INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
WHERE
  beob.quelle <> 'EvAB 2016'
  AND beob_from_evab.quelle = 'EvAB 2016'
  --AND beob.id <> beob_from_evab.id
ORDER BY
  beob_from_evab.id_evab_lc;

-- 3891 guids
--
-- 5 cases:
-- 1 both tpop_id null
--   delete evab beob
WITH dat AS (
  SELECT
    beob_from_evab.id_evab_lc AS guid,
    beob.id AS if_id,
    beob.quelle AS if_quelle,
    beob.tpop_id AS if_tpop_id,
    beob_from_evab.id AS evab_id,
    beob_from_evab.quelle AS evab_quelle,
    beob_from_evab.tpop_id AS evab_tpop_id
  FROM
    apflora.beob beob
    INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
  WHERE
    beob.quelle <> 'EvAB 2016'
    AND beob_from_evab.quelle = 'EvAB 2016'
    --AND beob.id <> beob_from_evab.id
  ORDER BY
    beob_from_evab.id_evab_lc
),
todelete AS (
  SELECT
    evab_id
  FROM
    dat
  WHERE
    if_tpop_id IS NULL
    AND evab_tpop_id IS NULL)
DELETE FROM apflora.beob
WHERE id IN (
    SELECT
      *
    FROM
      todelete);

-- 373
--
-- 2 both tpop_id set - same tpop
--   delete evab beob
WITH dat AS (
  SELECT
    beob_from_evab.id_evab_lc AS guid,
    beob.id AS if_id,
    beob.quelle AS if_quelle,
    beob.tpop_id AS if_tpop_id,
    beob_from_evab.id AS evab_id,
    beob_from_evab.quelle AS evab_quelle,
    beob_from_evab.tpop_id AS evab_tpop_id
  FROM
    apflora.beob beob
    INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
  WHERE
    beob.quelle <> 'EvAB 2016'
    AND beob_from_evab.quelle = 'EvAB 2016'
    --AND beob.id <> beob_from_evab.id
  ORDER BY
    beob_from_evab.id_evab_lc
),
todelete AS (
  SELECT
    evab_id
  FROM
    dat
  WHERE
    if_tpop_id IS NOT NULL
    AND evab_tpop_id IS NOT NULL
    AND if_tpop_id = evab_tpop_id)
DELETE FROM apflora.beob
WHERE id IN (
    SELECT
      *
    FROM
      todelete);

-- 1485
--
-- 3 both tpop_id set - different tpop
--   list and tell topos
WITH dat AS (
  SELECT
    beob_from_evab.id_evab_lc AS guid,
    beob.id AS if_id,
    beob.quelle AS if_quelle,
    beob.tpop_id AS if_tpop_id,
    beob_tpop.nr AS if_tpop_nr,
    beob_pop.nr AS if_pop_nr,
    beob_ae_taxonomies.artname AS if_artname,
    beob_from_evab.id AS evab_id,
    beob_from_evab.quelle AS evab_quelle,
    beob_from_evab.tpop_id AS evab_tpop_id,
    beob_from_evab_tpop.nr AS evab_tpop_nr,
    beob_from_evab_pop.nr AS evab_pop_nr,
    beob_from_evab_ae_taxonomies.artname AS evab_artname
  FROM
    apflora.beob beob
    INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
    INNER JOIN apflora.tpop beob_tpop ON beob_tpop.id = beob.tpop_id
    INNER JOIN apflora.pop beob_pop ON beob_pop.id = beob_tpop.pop_id
    INNER JOIN apflora.ap beob_ap ON beob_ap.id = beob_pop.ap_id
    INNER JOIN apflora.ae_taxonomies beob_ae_taxonomies ON beob_ae_taxonomies.id = beob_ap.art_id
    --
    INNER JOIN apflora.tpop beob_from_evab_tpop ON beob_from_evab_tpop.id = beob_from_evab.tpop_id
    INNER JOIN apflora.pop beob_from_evab_pop ON beob_from_evab_pop.id = beob_from_evab_tpop.pop_id
    INNER JOIN apflora.ap beob_from_evab_ap ON beob_from_evab_ap.id = beob_from_evab_pop.ap_id
    INNER JOIN apflora.ae_taxonomies beob_from_evab_ae_taxonomies ON beob_from_evab_ae_taxonomies.id = beob_from_evab_ap.art_id
  WHERE
    beob.quelle <> 'EvAB 2016'
    AND beob_from_evab.quelle = 'EvAB 2016'
    --AND beob.id <> beob_from_evab.id
  ORDER BY
    beob_from_evab.id_evab_lc
)
SELECT
  guid AS evab_guid,
  if_id,
  if_quelle,
  if_artname,
  if_pop_nr,
  if_tpop_nr,
  evab_id,
  evab_quelle,
  evab_artname,
  evab_pop_nr,
  evab_tpop_nr
FROM
  dat
WHERE
  if_tpop_id IS NOT NULL
  AND evab_tpop_id IS NOT NULL
  AND if_tpop_id <> evab_tpop_id
ORDER BY
  if_artname,
  if_pop_nr,
  if_tpop_nr;

-- 86
--
-- 4 only if_tpop_id set
--   delete evab beob
WITH dat AS (
  SELECT
    beob_from_evab.id_evab_lc AS guid,
    beob.id AS if_id,
    beob.quelle AS if_quelle,
    beob.tpop_id AS if_tpop_id,
    beob_from_evab.id AS evab_id,
    beob_from_evab.quelle AS evab_quelle,
    beob_from_evab.tpop_id AS evab_tpop_id
  FROM
    apflora.beob beob
    INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
  WHERE
    beob.quelle <> 'EvAB 2016'
    AND beob_from_evab.quelle = 'EvAB 2016'
    --AND beob.id <> beob_from_evab.id
  ORDER BY
    beob_from_evab.id_evab_lc
),
todelete AS (
  SELECT
    evab_id
  FROM
    dat
  WHERE
    if_tpop_id IS NOT NULL
    AND evab_tpop_id IS NULL)
DELETE FROM apflora.beob
WHERE id IN (
    SELECT
      *
    FROM
      todelete);

-- 69
--
-- 5 only evab_tpop_id set
--   set tpop_id (and other fields) in if
--   delete evab beob
-- TODO: first set tpop_id (and other fields) in if
WITH dat AS (
  SELECT
    beob_from_evab.id_evab_lc AS guid,
    beob.id AS if_id,
    beob.quelle AS if_quelle,
    beob.tpop_id AS if_tpop_id,
    beob_from_evab.id AS evab_id,
    beob_from_evab.quelle AS evab_quelle,
    beob_from_evab.tpop_id AS evab_tpop_id
  FROM
    apflora.beob beob
    INNER JOIN apflora.beob beob_from_evab ON beob_from_evab.id_evab_lc = beob.data ->> 'guid'
  WHERE
    beob.quelle <> 'EvAB 2016'
    AND beob_from_evab.quelle = 'EvAB 2016'
    --AND beob.id <> beob_from_evab.id
  ORDER BY
    beob_from_evab.id_evab_lc
),
todelete AS (
  SELECT
    evab_id
  FROM
    dat
  WHERE
    if_tpop_id IS NULL
    AND evab_tpop_id IS NOT NULL)
DELETE FROM apflora.beob
WHERE id IN (
    SELECT
      *
    FROM
      todelete);

-- 1878
