DROP FUNCTION IF EXISTS apflora.jber_akt_pop (jahr int);

CREATE OR REPLACE FUNCTION apflora.jber_akt_pop (jahr int)
  RETURNS SETOF apflora.jber_akt_pop
  AS $$
  WITH pop_100 AS (
    SELECT
      pop.ap_id,
      count(DISTINCT pop.id) AS count
    FROM
      apflora.pop pop
      INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id
    WHERE
      pop.status = 100
      AND pop.bekannt_seit <= $1
      AND tpop.apber_relevant = TRUE
      AND tpop.bekannt_seit <= $1
    GROUP BY
      pop.ap_id
),
pop_200 AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status = 200
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
pop_total AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status IN (100, 200)
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
pop_100_previous AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.pop_history pop
    INNER JOIN apflora.tpop_history tpop ON pop.id = tpop.pop_id
  WHERE
    pop.year = $1 - 1
    AND pop.status = 100
    AND pop.bekannt_seit <= pop.year
    AND tpop.year = $1 - 1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.ap_id
),
pop_200_previous AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.pop_history pop
    INNER JOIN apflora.tpop_history tpop ON pop.id = tpop.pop_id
  WHERE
    pop.year = $1 - 1
    AND pop.status = 200
    AND pop.bekannt_seit <= pop.year
    AND tpop.year = $1 - 1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.ap_id
),
pop_previous_total AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.pop_history pop
    INNER JOIN apflora.tpop_history tpop ON pop.id = tpop.pop_id
  WHERE
    pop.year = $1 - 1
    AND pop.status IN (100, 200)
    AND pop.bekannt_seit <= pop.year
    AND tpop.year = $1 - 1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.ap_id
)
SELECT
  tax.artname,
  -- need this to be id, not ap_id, for apollo:
  ap.id,
  coalesce(pop_100.count, 0)::int AS pop_100,
  coalesce(pop_200.count, 0)::int AS pop_200,
  coalesce(pop_total.count, 0)::int AS pop_total,
  --coalesce(pop_100_previous.count, 0)::int as pop_100_previous,
  --coalesce(pop_200_previous.count, 0)::int as pop_200_previous,
  --coalesce(pop_previous_total.count, 0)::int as pop_previous_total,
  coalesce(pop_100.count, 0)::int - coalesce(pop_100_previous.count, 0)::int AS pop_100_diff,
  coalesce(pop_200.count, 0)::int - coalesce(pop_200_previous.count, 0)::int AS pop_200_diff,
  coalesce(pop_total.count, 0)::int - coalesce(pop_previous_total.count, 0)::int AS pop_total_diff
FROM
  apflora.ap
  LEFT JOIN pop_100 ON pop_100.ap_id = ap.id
  LEFT JOIN pop_200 ON pop_200.ap_id = ap.id
  LEFT JOIN pop_total ON pop_total.ap_id = ap.id
  LEFT JOIN pop_previous_total ON pop_previous_total.ap_id = ap.id
  LEFT JOIN pop_100_previous ON pop_100_previous.ap_id = ap.id
  LEFT JOIN pop_200_previous ON pop_200_previous.ap_id = ap.id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
WHERE
  ap.bearbeitung BETWEEN 1 AND 3 --@485
ORDER BY
  tax.artname
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.jber_akt_pop (jahr int) OWNER TO postgres;

