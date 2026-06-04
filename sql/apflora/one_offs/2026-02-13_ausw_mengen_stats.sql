SELECT
  'tpopmassn' AS table_name,
  count(*) AS total_count,
  count(*) FILTER (WHERE massn.jahr IS NOT NULL) AS count_with_jahr,
  count(*) FILTER (WHERE massn.datum IS NOT NULL) AS count_with_datum
FROM apflora.tpopmassn massn
JOIN apflora.tpop tpop ON tpop.id = massn.tpop_id
JOIN apflora.pop pop ON pop.id = tpop.pop_id
JOIN apflora.ap ap ON ap.id = pop.ap_id
WHERE ap.bearbeitung BETWEEN 1 AND 3

UNION ALL

SELECT
  'tpopkontr' AS table_name,
  count(*) AS total_count,
  count(*) FILTER (WHERE kontr.jahr IS NOT NULL) AS count_with_jahr,
  count(*) FILTER (WHERE kontr.datum IS NOT NULL) AS count_with_datum
FROM apflora.tpopkontr kontr
JOIN apflora.tpop tpop ON tpop.id = kontr.tpop_id
JOIN apflora.pop pop ON pop.id = tpop.pop_id
JOIN apflora.ap ap ON ap.id = pop.ap_id
WHERE ap.bearbeitung BETWEEN 1 AND 3;