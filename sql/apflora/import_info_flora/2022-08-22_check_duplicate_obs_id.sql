SELECT
  obs_id,
  count(*)
FROM
  apflora.beob
GROUP BY
  obs_id
HAVING
  count(*) > 1;

-- result: none
select * from apflora.beob where obs_id = 10767584;