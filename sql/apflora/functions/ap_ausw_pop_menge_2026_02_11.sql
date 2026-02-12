CREATE TYPE apflora.ausw_pop_menge AS (
  jahr integer,
VALUES
  json
);

CREATE OR REPLACE FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN QUERY 
  WITH massnahmen_anzahl_per_tpop_id_and_year AS(
    SELECT mi.tpop_id, mi.jahr, mi.zieleinheit_anzahl as anzahl
    FROM apflora.tpopmassn mi
    INNER JOIN apflora.tpop_history tpop ON tpop.id = mi.tpop_id and tpop.year = mi.jahr
    INNER JOIN apflora.pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ON ap.id = pop.ap_id
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON 
      ze.id = ekze.zaehleinheit_id 
      AND ze.code = mi.zieleinheit_einheit
    INNER JOIN apflora.tpopmassn_typ_werte tw ON 
      tw.code = mi.typ
      AND tw.anpflanzung = TRUE
    WHERE 
      mi.zieleinheit_anzahl IS NOT NULL
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND tpop.year <= $2
      AND ap.id = $1
    ORDER BY mi.jahr DESC
  ),
  massnahmen_sum_per_tpop_id_and_year AS(
    SELECT m.tpop_id, m.jahr, sum(m.anzahl) AS sum
    FROM massnahmen_anzahl_per_tpop_id_and_year m
    GROUP BY m.tpop_id, m.jahr
    ORDER BY m.jahr DESC
  ),
  zaehlungen_per_tpop_id_and_year AS(
    SELECT tpop.id AS tpop_id, kontr.jahr, zaehl.anzahl
    FROM apflora.tpopkontrzaehl zaehl
    INNER JOIN apflora.tpopkontr kontr ON kontr.id = zaehl.tpopkontr_id
    INNER JOIN apflora.tpop_history tpop ON tpop.id = kontr.tpop_id AND tpop.year = kontr.jahr
    INNER JOIN apflora.pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ON ap.id = pop.ap_id
    INNER JOIN apflora.ekzaehleinheit ekze ON 
      ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON 
      ze.id = ekze.zaehleinheit_id 
      -- nur Zählungen mit der Ziel-Einheit
      AND ze.code = zaehl.einheit
    WHERE 
      zaehl.anzahl IS NOT NULL
      AND kontr.jahr <= $2
      -- we want false or null, but not true
      -- https://stackoverflow.com/a/46474204/712005
      AND kontr.apber_nicht_relevant IS NOT TRUE
      AND tpop.status IN(100, 200, 201)
      AND tpop.apber_relevant = TRUE
      AND ap.id = $1
      AND tpop.year <= $2
  ),
  zaehlungen_sum_per_tpop_id_and_year AS(
    SELECT z.tpop_id, z.jahr, sum(z.anzahl) AS sum
    FROM zaehlungen_per_tpop_id_and_year z
    GROUP BY z.tpop_id, z.jahr
    ORDER BY z.jahr DESC
  ),
  tpops_lookback as(
    SELECT
      tpop.id AS tpop_id,
      tpop.pop_id,
      tpop.year,
      -- if status is in (100, 200, 201) and apber_relevant is true, lookback is true. else false
      CASE 
        WHEN tpop.status IN(100, 200, 201) AND tpop.apber_relevant = TRUE THEN TRUE
        ELSE FALSE
      END as lookback
    FROM apflora.tpop_history tpop
    INNER JOIN apflora.pop ON pop.id = tpop.pop_id
    WHERE tpop.year <= $2
    ORDER BY
      tpop.id,
      tpop.year DESC
  ),
  tpop_latest_sums_separate AS(
    SELECT
      tpop.pop_id,
      tpop.tpop_id,
      tpop.year AS jahr,
      -- if lookback is true, take the latest sum of zaehlungen where year is less than or equal to tpop.year. if lookback is false, take the sum of zaehlungen for the tpop.year
      COALESCE(zaehlungen.sum, 0) AS anzahl_zaehlungen,
      COALESCE(massnahmen.sum, 0) AS anzahl_massnahmen
    FROM tpops_lookback tpop
    LEFT JOIN LATERAL (
      SELECT sum
      FROM zaehlungen_sum_per_tpop_id_and_year
      WHERE
        tpop_id = tpop.tpop_id
        AND (
          (tpop.lookback AND zaehlungen_sum_per_tpop_id_and_year.jahr <= tpop.year)
          OR (NOT tpop.lookback AND zaehlungen_sum_per_tpop_id_and_year.jahr = tpop.year)
        )
      ORDER BY zaehlungen_sum_per_tpop_id_and_year.jahr DESC
      LIMIT 1
    ) AS zaehlungen ON true
    LEFT JOIN LATERAL (
      SELECT sum
      FROM massnahmen_sum_per_tpop_id_and_year
      WHERE
        tpop_id = tpop.tpop_id
        AND (
          (COALESCE(zaehlungen.sum, 0) > 0 AND massnahmen_sum_per_tpop_id_and_year.jahr = tpop.year)
          OR (
            COALESCE(zaehlungen.sum, 0) <= 0
            AND (
              (tpop.lookback AND massnahmen_sum_per_tpop_id_and_year.jahr <= tpop.year)
              OR (NOT tpop.lookback AND massnahmen_sum_per_tpop_id_and_year.jahr = tpop.year)
            )
          )
        )
      ORDER BY massnahmen_sum_per_tpop_id_and_year.jahr DESC
      LIMIT 1
    ) AS massnahmen ON true
      -- we want all tpops listed here
    ORDER BY
      tpop.tpop_id,
      tpop.year DESC
  ),
  tpop_latest_sums AS(
    SELECT
      t.pop_id,
      t.tpop_id,
      t.jahr,
      t.anzahl_zaehlungen + t.anzahl_massnahmen AS anzahl
    FROM tpop_latest_sums_separate t
  ),
  pop_latest_sums AS(
    SELECT
      pop.id AS pop_id,
      pop.year AS jahr,
      sum(t.anzahl) AS anzahl
    FROM tpop_latest_sums t
    INNER JOIN apflora.pop_history pop ON pop.id = t.pop_id
    GROUP BY pop.id, pop.year
    ORDER BY pop.year DESC
  )
  SELECT
    anz.jahr,
    json_object_agg(pop_id, anzahl) AS anzahl_pro_pop
  FROM
    pop_latest_sums anz
  GROUP BY
    anz.jahr
  ORDER BY
    anz.jahr;
  END;
$$
LANGUAGE plpgsql
SECURITY DEFINER STABLE;

ALTER FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer) OWNER TO postgres;

