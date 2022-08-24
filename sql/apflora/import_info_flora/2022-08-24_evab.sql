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
)
SELECT
  *
FROM
  dat
WHERE
  if_tpop_id IS NOT NULL
  AND evab_tpop_id IS NOT NULL
  AND if_tpop_id <> evab_tpop_id;

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
