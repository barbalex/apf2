DROP FUNCTION IF EXISTS apflora.pop_nach_status_for_jber (apid uuid, year int);

CREATE OR REPLACE FUNCTION apflora.pop_nach_status_for_jber (apid uuid, year int)
  RETURNS SETOF apflora.pop_nach_status_for_jber
  AS $$
  WITH years AS (
    SELECT DISTINCT
      pop.year
    FROM
      apflora.pop_history pop
      INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
        AND tpop.year = pop.year
    WHERE
      pop.ap_id = $1
      AND pop.year <= $2
      AND pop.bekannt_seit <= pop.year
      AND tpop.year <= $2
      AND tpop.apber_relevant = TRUE
      AND tpop.bekannt_seit <= tpop.year
    ORDER BY
      pop.year
),
a3lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a3lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND pop.status = 100
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.year
),
a4lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a4lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND pop.status = 200
    AND ap.start_jahr IS NOT NULL
    AND pop.bekannt_seit < ap.start_jahr
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.year
),
a5lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a5lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND pop.status = 200
    AND ap.start_jahr IS NOT NULL
    AND pop.bekannt_seit >= ap.start_jahr
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.year
),
a7lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a7lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
    AND (pop.status = 101
      OR (pop.status = 202
        AND ap.start_jahr IS NOT NULL
        AND (pop.bekannt_seit IS NULL
          OR pop.bekannt_seit < ap.start_jahr)))
  GROUP BY
    pop.year
),
a8lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a8lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND pop.status = 202
    AND ap.start_jahr IS NOT NULL
    AND pop.bekannt_seit >= ap.start_jahr
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.year
),
a9lpop AS (
  SELECT
    pop.year,
    count(DISTINCT pop.id) AS a9lpop
FROM
  apflora.pop_history pop
  INNER JOIN apflora.tpop_history tpop ON tpop.pop_id = pop.id
    AND tpop.year = pop.year
  WHERE
    pop.ap_id = $1
    AND pop.year <= $2
    AND pop.bekannt_seit <= pop.year
    AND pop.status = 201
    AND tpop.year <= $2
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= tpop.year
  GROUP BY
    pop.year
)
SELECT
  years.year::int,
  a3lpop.a3lpop::int,
  a4lpop.a4lpop::int,
  a5lpop.a5lpop::int,
  a7lpop.a7lpop::int,
  a8lpop.a8lpop::int,
  a9lpop.a9lpop::int
FROM
  years
  LEFT JOIN a3lpop ON a3lpop.year = years.year
  LEFT JOIN a4lpop ON a4lpop.year = years.year
  LEFT JOIN a5lpop ON a5lpop.year = years.year
  LEFT JOIN a7lpop ON a7lpop.year = years.year
  LEFT JOIN a8lpop ON a8lpop.year = years.year
  LEFT JOIN a9lpop ON a9lpop.year = years.year
WHERE
  years.year <= $2
ORDER BY
  years.year
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.pop_nach_status_for_jber (apid uuid, year int) OWNER TO postgres;

