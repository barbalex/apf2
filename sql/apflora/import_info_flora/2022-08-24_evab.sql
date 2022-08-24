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

-- 1000 guids
--
-- 5 cases:
-- 1 both tpop_id null
--   delete evab beob
-- 2 both tpop_id set - same tpop
--   delete evab beob
-- 3 both tpop_id set - different tpop
--   list and tell topos
-- 4 if_tpop_id set
--   delete evab beob
-- 5 evab_tpop_id set
--   set tpop_id (and other fields) in if
--   delete evab beob
