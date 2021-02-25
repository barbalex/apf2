-- 1. update app side code
-- 2. update version
-- 3. run these queries:
DROP TYPE apflora.jber_abc CASCADE;

CREATE TYPE apflora.jber_abc AS (
  artname text,
  id uuid,
  start_jahr integer,
  bearbeiter text,
  bearbeitung integer,
  a_3_l_pop integer,
  a_3_l_tpop integer,
  a_4_l_pop integer,
  a_4_l_tpop integer,
  a_5_l_pop integer,
  a_5_l_tpop integer,
  a_7_l_pop integer,
  a_7_l_tpop integer,
  a_8_l_pop integer,
  a_8_l_tpop integer,
  a_9_l_pop integer,
  a_9_l_tpop integer,
  b_1_l_pop integer,
  b_1_l_tpop integer,
  b_1_first_year integer,
  b_1_r_pop integer,
  b_1_r_tpop integer,
  c_1_l_pop integer,
  c_1_l_tpop integer,
  c_1_r_pop integer,
  c_1_r_tpop integer,
  c_1_first_year integer,
  first_massn integer,
  c_2_r_pop integer,
  c_2_r_tpop integer,
  c_3_r_pop integer,
  c_3_r_tpop integer,
  c_4_r_pop integer,
  c_4_r_tpop integer,
  c_5_r_pop integer,
  c_5_r_tpop integer,
  c_6_r_pop integer,
  c_6_r_tpop integer,
  c_7_r_pop integer,
  c_7_r_tpop integer,
  erfolg integer,
  erfolg_vorjahr integer
);

DROP FUNCTION IF EXISTS apflora.jber_abc (jahr int);

CREATE OR REPLACE FUNCTION apflora.jber_abc (jahr int)
  RETURNS SETOF apflora.jber_abc
  AS $$
  WITH a_3_l_pop AS (
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
a_3_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status = 100
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
a_4_l_pop AS (
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
    AND pop.bekannt_seit < ap.start_jahr
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND tpop.bekannt_seit < ap.start_jahr
  GROUP BY
    pop.ap_id
),
a_4_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status = 200
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND tpop.bekannt_seit < ap.start_jahr
  GROUP BY
    pop.ap_id
),
a_5_l_pop AS (
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
    AND pop.bekannt_seit >= ap.start_jahr
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND tpop.bekannt_seit >= ap.start_jahr
  GROUP BY
    pop.ap_id
),
a_5_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status = 200
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND tpop.bekannt_seit >= ap.start_jahr
  GROUP BY
    pop.ap_id
),
a_7_l_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE (pop.status = 101
    OR (pop.status = 202
      AND pop.bekannt_seit < ap.start_jahr))
  AND pop.bekannt_seit <= $1
  AND tpop.apber_relevant = TRUE
  AND tpop.bekannt_seit <= $1
GROUP BY
  pop.ap_id
),
a_7_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND (tpop.status = 101
      OR (tpop.status = 202
        AND tpop.bekannt_seit < ap.start_jahr))
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
a_8_l_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status = 202
    AND pop.bekannt_seit >= ap.start_jahr
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
a_8_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status = 202
    AND tpop.bekannt_seit >= ap.start_jahr
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
a_9_l_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status = 201
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
a_9_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.bekannt_seit <= $1
    AND tpop.status = 201
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
b_1_l_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT popber.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.popber popber ON pop.id = popber.pop_id
      AND popber.jahr = $1
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
b_1_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpopber.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopber tpopber ON tpop.id = tpopber.tpop_id
      AND tpopber.jahr = $1 ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
  GROUP BY
    pop.ap_id
),
b_1_r_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.popber popber ON pop.id = popber.pop_id
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND popber.jahr IS NOT NULL
    AND popber.jahr <= $1
    AND popber.entwicklung IS NOT NULL
  GROUP BY
    pop.ap_id
),
b_1_r_tpop AS (
  SELECT
    pop.ap_id,
    min(tpopber.jahr) AS first_year,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopber tpopber ON tpop.id = tpopber.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND tpopber.jahr IS NOT NULL
    AND tpopber.jahr <= $1
    AND tpopber.entwicklung IS NOT NULL
  GROUP BY
    pop.ap_id
),
c_1_l_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn ON tpop.id = massn.tpop_id
      AND massn.jahr = $1 ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massn.typ IS NOT NULL
  GROUP BY
    pop.ap_id
),
c_1_l_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn ON tpop.id = massn.tpop_id
      AND massn.jahr = $1 ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massn.typ IS NOT NULL
  GROUP BY
    pop.ap_id
),
c_1_r_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn ON tpop.id = massn.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massn.typ IS NOT NULL
  GROUP BY
    pop.ap_id
),
c_1_r_tpop AS (
  SELECT
    pop.ap_id,
    min(massn.jahr) AS first_year,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn ON tpop.id = massn.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massn.jahr IS NOT NULL
    AND massn.jahr <= $1
    AND massn.typ IS NOT NULL
  GROUP BY
    pop.ap_id
),
c_2_r_pop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT pop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.popmassnber massnber ON pop.id = massnber.pop_id
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massnber.beurteilung BETWEEN 1 AND 5
  GROUP BY
    pop.ap_id
),
c_2_r_tpop AS (
  SELECT
    pop.ap_id,
    count(DISTINCT tpop.id) AS count
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassnber massnber ON tpop.id = massnber.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massnber.jahr IS NOT NULL
    AND massnber.jahr <= $1
    AND massnber.beurteilung BETWEEN 1 AND 5
  GROUP BY
    pop.ap_id
),
c3RPopLastBer AS (
  SELECT DISTINCT ON (pop.ap_id,
    pop.id)
    pop.ap_id,
    pop.id AS pop_id,
    massnber.beurteilung
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.popmassnber massnber ON pop.id = massnber.pop_id
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massnber.jahr IS NOT NULL
    AND massnber.jahr <= $1
    AND massnber.beurteilung BETWEEN 1 AND 5
  ORDER BY
    pop.ap_id,
    pop.id,
    massnber.jahr DESC
),
c3RTpopLastBer AS (
  SELECT DISTINCT ON (pop.ap_id,
    tpop.id)
    pop.ap_id,
    tpop.id AS tpop_id,
    massnber.beurteilung
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassnber massnber ON tpop.id = massnber.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massnber.jahr IS NOT NULL
    AND massnber.jahr <= $1
    AND massnber.beurteilung BETWEEN 1 AND 5
  ORDER BY
    pop.ap_id,
    tpop.id,
    massnber.jahr DESC
),
c_3_r_pop AS (
  SELECT
    ap_id,
    count(pop_id)
  FROM
    c3RPopLastBer
  WHERE
    beurteilung = 1
  GROUP BY
    ap_id
),
c_3_r_tpop AS (
  SELECT
    ap_id,
    count(tpop_id)
  FROM
    c3RTpopLastBer
  WHERE
    beurteilung = 1
  GROUP BY
    ap_id
),
c_4_r_pop AS (
  SELECT
    ap_id,
    count(pop_id)
  FROM
    c3RPopLastBer
  WHERE
    beurteilung = 2
  GROUP BY
    ap_id
),
c_4_r_tpop AS (
  SELECT
    ap_id,
    count(tpop_id)
  FROM
    c3RTpopLastBer
  WHERE
    beurteilung = 2
  GROUP BY
    ap_id
),
c_5_r_pop AS (
  SELECT
    ap_id,
    count(pop_id)
  FROM
    c3RPopLastBer
  WHERE
    beurteilung = 3
  GROUP BY
    ap_id
),
c_5_r_tpop AS (
  SELECT
    ap_id,
    count(tpop_id)
  FROM
    c3RTpopLastBer
  WHERE
    beurteilung = 3
  GROUP BY
    ap_id
),
c_6_r_pop AS (
  SELECT
    ap_id,
    count(pop_id)
  FROM
    c3RPopLastBer
  WHERE
    beurteilung = 4
  GROUP BY
    ap_id
),
c_6_r_tpop AS (
  SELECT
    ap_id,
    count(tpop_id)
  FROM
    c3RTpopLastBer
  WHERE
    beurteilung = 4
  GROUP BY
    ap_id
),
c_7_r_pop AS (
  SELECT
    ap_id,
    count(pop_id)
  FROM
    c3RPopLastBer
  WHERE
    beurteilung = 5
  GROUP BY
    ap_id
),
c_7_r_tpop AS (
  SELECT
    ap_id,
    count(tpop_id)
  FROM
    c3RTpopLastBer
  WHERE
    beurteilung = 5
  GROUP BY
    ap_id
),
first_massn AS (
  SELECT DISTINCT ON (pop.ap_id)
    pop.ap_id,
    massn.jahr
  FROM
    apflora.ap ap
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.tpopmassn massn ON tpop.id = massn.tpop_id ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND massn.jahr IS NOT NULL
    AND massn.jahr <= $1
  ORDER BY
    pop.ap_id,
    massn.jahr ASC
),
erfolg AS (
  SELECT DISTINCT ON (ap.id)
    ap.id,
    apber.beurteilung
  FROM
    apflora.ap ap
    INNER JOIN apflora.apber apber ON ap.id = apber.ap_id
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND apber.jahr = $1
    AND apber.beurteilung IS NOT NULL
  ORDER BY
    ap.id
),
erfolg_vorjahr AS (
  SELECT DISTINCT ON (ap.id)
    ap.id,
    apber.beurteilung
  FROM
    apflora.ap ap
    INNER JOIN apflora.apber apber ON ap.id = apber.ap_id
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.tpop tpop ON pop.id = tpop.pop_id ON pop.ap_id = ap.id
  WHERE
    pop.status < 300
    AND pop.bekannt_seit <= $1
    AND tpop.status < 300
    AND tpop.apber_relevant = TRUE
    AND tpop.bekannt_seit <= $1
    AND apber.jahr = $1 - 1
    AND apber.beurteilung IS NOT NULL
  ORDER BY
    ap.id
)
SELECT
  tax.artname,
  -- need this to be id, not ap_id, for apollo:
  ap.id,
  ap.start_jahr::int,
  adresse.name AS bearbeiter,
  coalesce(ap.bearbeitung, 0)::int AS bearbeitung,
  coalesce(a_3_l_pop.count, 0)::int AS a_3_l_pop,
  coalesce(a_3_l_tpop.count, 0)::int AS a_3_l_tpop,
  coalesce(a_4_l_pop.count, 0)::int AS a_4_l_pop,
  coalesce(a_4_l_tpop.count, 0)::int AS a_4_l_tpop,
  coalesce(a_5_l_pop.count, 0)::int AS a_5_l_pop,
  coalesce(a_5_l_tpop.count, 0)::int AS a_5_l_tpop,
  coalesce(a_7_l_pop.count, 0)::int AS a_7_l_pop,
  coalesce(a_7_l_tpop.count, 0)::int AS a_7_l_tpop,
  coalesce(a_8_l_pop.count, 0)::int AS a_8_l_pop,
  coalesce(a_8_l_tpop.count, 0)::int AS a_8_l_tpop,
  coalesce(a_9_l_pop.count, 0)::int AS a_9_l_pop,
  coalesce(a_9_l_tpop.count, 0)::int AS a_9_l_tpop,
  coalesce(b_1_l_pop.count, 0)::int AS b_1_l_pop,
  coalesce(b_1_l_tpop.count, 0)::int AS b_1_l_tpop,
  b_1_r_tpop.first_year::int AS b_1_first_year,
  coalesce(b_1_r_pop.count, 0)::int AS b_1_r_pop,
  coalesce(b_1_r_tpop.count, 0)::int AS b_1_r_tpop,
  coalesce(c_1_l_pop.count, 0)::int AS c_1_l_pop,
  coalesce(c_1_l_tpop.count, 0)::int AS c_1_l_tpop,
  coalesce(c_1_r_pop.count, 0)::int AS c_1_r_pop,
  coalesce(c_1_r_tpop.count, 0)::int AS c_1_r_tpop,
  c_1_r_tpop.first_year::int AS c_1_first_year,
  first_massn.jahr::int AS first_massn,
  coalesce(c_2_r_pop.count, 0)::int AS c_2_r_pop,
  coalesce(c_2_r_tpop.count, 0)::int AS c_2_r_tpop,
  coalesce(c_3_r_pop.count, 0)::int AS c_3_r_pop,
  coalesce(c_3_r_tpop.count, 0)::int AS c_3_r_tpop,
  coalesce(c_4_r_pop.count, 0)::int AS c_4_r_pop,
  coalesce(c_4_r_tpop.count, 0)::int AS c_4_r_tpop,
  coalesce(c_5_r_pop.count, 0)::int AS c_5_r_pop,
  coalesce(c_5_r_tpop.count, 0)::int AS c_5_r_tpop,
  coalesce(c_6_r_pop.count, 0)::int AS c_6_r_pop,
  coalesce(c_6_r_tpop.count, 0)::int AS c_6_r_tpop,
  coalesce(c_7_r_pop.count, 0)::int AS c_7_r_pop,
  coalesce(c_7_r_tpop.count, 0)::int AS c_7_r_tpop,
  erfolg.beurteilung::int AS erfolg,
  erfolg_vorjahr.beurteilung::int AS erfolg_vorjahr
FROM
  apflora.ap
  LEFT JOIN a_3_l_pop ON a_3_l_pop.ap_id = ap.id
  LEFT JOIN a_3_l_tpop ON a_3_l_tpop.ap_id = ap.id
  LEFT JOIN a_4_l_pop ON a_4_l_pop.ap_id = ap.id
  LEFT JOIN a_4_l_tpop ON a_4_l_tpop.ap_id = ap.id
  LEFT JOIN a_5_l_pop ON a_5_l_pop.ap_id = ap.id
  LEFT JOIN a_5_l_tpop ON a_5_l_tpop.ap_id = ap.id
  LEFT JOIN a_7_l_pop ON a_7_l_pop.ap_id = ap.id
  LEFT JOIN a_7_l_tpop ON a_7_l_tpop.ap_id = ap.id
  LEFT JOIN a_8_l_pop ON a_8_l_pop.ap_id = ap.id
  LEFT JOIN a_8_l_tpop ON a_8_l_tpop.ap_id = ap.id
  LEFT JOIN a_9_l_pop ON a_9_l_pop.ap_id = ap.id
  LEFT JOIN a_9_l_tpop ON a_9_l_tpop.ap_id = ap.id
  LEFT JOIN b_1_l_pop ON b_1_l_pop.ap_id = ap.id
  LEFT JOIN b_1_l_tpop ON b_1_l_tpop.ap_id = ap.id
  LEFT JOIN b_1_r_pop ON b_1_r_pop.ap_id = ap.id
  LEFT JOIN b_1_r_tpop ON b_1_r_tpop.ap_id = ap.id
  LEFT JOIN c_1_l_pop ON c_1_l_pop.ap_id = ap.id
  LEFT JOIN c_1_l_tpop ON c_1_l_tpop.ap_id = ap.id
  LEFT JOIN c_1_r_pop ON c_1_r_pop.ap_id = ap.id
  LEFT JOIN c_1_r_tpop ON c_1_r_tpop.ap_id = ap.id
  LEFT JOIN c_2_r_pop ON c_2_r_pop.ap_id = ap.id
  LEFT JOIN c_2_r_tpop ON c_2_r_tpop.ap_id = ap.id
  LEFT JOIN c_3_r_pop ON c_3_r_pop.ap_id = ap.id
  LEFT JOIN c_3_r_tpop ON c_3_r_tpop.ap_id = ap.id
  LEFT JOIN c_4_r_pop ON c_4_r_pop.ap_id = ap.id
  LEFT JOIN c_4_r_tpop ON c_4_r_tpop.ap_id = ap.id
  LEFT JOIN c_5_r_pop ON c_5_r_pop.ap_id = ap.id
  LEFT JOIN c_5_r_tpop ON c_5_r_tpop.ap_id = ap.id
  LEFT JOIN c_6_r_pop ON c_6_r_pop.ap_id = ap.id
  LEFT JOIN c_6_r_tpop ON c_6_r_tpop.ap_id = ap.id
  LEFT JOIN c_7_r_pop ON c_7_r_pop.ap_id = ap.id
  LEFT JOIN c_7_r_tpop ON c_7_r_tpop.ap_id = ap.id
  LEFT JOIN first_massn ON first_massn.ap_id = ap.id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  LEFT JOIN erfolg ON erfolg.id = ap.id
  LEFT JOIN erfolg_vorjahr ON erfolg_vorjahr.id = ap.id
  LEFT JOIN apflora.adresse adresse ON ap.bearbeiter = adresse.id
WHERE
  ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  tax.artname
$$
LANGUAGE sql
STABLE;

ALTER FUNCTION apflora.jber_abc (jahr int) OWNER TO postgres;

DROP TYPE apflora.pop_nach_status_for_jber CASCADE;

CREATE TYPE apflora.pop_nach_status_for_jber AS (
  year integer,
  a3lpop integer,
  a4lpop integer,
  a5lpop integer,
  a7lpop integer,
  a8lpop integer,
  a9lpop integer
);

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

