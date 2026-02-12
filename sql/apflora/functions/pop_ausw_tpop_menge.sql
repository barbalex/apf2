-- graphql name: popAuswTpopMenge
CREATE OR REPLACE FUNCTION apflora.pop_ausw_tpop_menge(popid uuid)
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
      AND tpop.pop_id = $1
    ORDER BY mi.jahr DESC
  ),
  massnahmen_sum_per_tpop_id_and_year AS(
    SELECT tpop_id, jahr, sum(anzahl) AS sum
    FROM massnahmen_anzahl_per_tpop_id_and_year
    GROUP BY tpop_id, jahr
    ORDER BY jahr DESC
  ),
  zaehlungen_per_tpop_id_and_year AS(
    SELECT tpop.id AS tpop_id, jahr, anzahl
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
      AND kontr.jahr <= EXTRACT(YEAR FROM CURRENT_DATE)
      -- we want false or null, but not true
      -- https://stackoverflow.com/a/46474204/712005
      AND kontr.apber_nicht_relevant IS NOT TRUE
      AND tpop.status IN(100, 200, 201)
      AND tpop.apber_relevant = TRUE
      AND tpop.pop_id = $1
  ),
  zaehlungen_sum_per_tpop_id_and_year AS(
    SELECT tpop_id, jahr, sum(anzahl) AS sum
    FROM zaehlungen_per_tpop_id_and_year
    GROUP BY tpop_id, jahr
    ORDER BY jahr DESC
  ),
  tpops_lookback as(
    SELECT
      tpop.id AS tpop_id,
      tpop.pop_id,
      tpop.year,
      TRUE as lookback
    FROM apflora.tpop_history tpop
    WHERE 
      tpop.pop_id = $1
      AND tpop.apber_relevant = TRUE
      AND tpop.status IN(100, 200, 201)
    ORDER BY
      tpop.id,
      tpop.year DESC
  ),
  tpop_latest_sums_separate AS(
    SELECT
      tpop.tpop_id,
      tpop.year AS jahr,
      COALESCE(zaehlungen.sum, 0) AS anzahl_zaehlungen,
      COALESCE(massnahmen.sum, 0) AS anzahl_massnahmen
    FROM tpops_lookback tpop
    LEFT JOIN LATERAL (
      SELECT sum
      FROM zaehlungen_sum_per_tpop_id_and_year
      WHERE
        tpop_id = tpop.tpop_id
        AND jahr <= tpop.year
      ORDER BY jahr DESC
      LIMIT 1
    ) AS zaehlungen ON true
    LEFT JOIN LATERAL (
      SELECT sum
      FROM massnahmen_sum_per_tpop_id_and_year
      WHERE
        tpop_id = tpop.tpop_id
        AND (
          (COALESCE(zaehlungen.sum, 0) > 0 AND jahr = tpop.year)
          OR (
            COALESCE(zaehlungen.sum, 0) <= 0
            AND jahr <= tpop.year
          )
        )
      ORDER BY jahr DESC
      LIMIT 1
    ) AS massnahmen ON true
      -- we want all tpops listed here
    WHERE tpop.pop_id = $1
    ORDER BY
      tpop.tpop_id,
      tpop.year DESC
  ),
  tpop_latest_sums AS(
    SELECT
      tpop_id,
      jahr,
      anzahl_zaehlungen + anzahl_massnahmen AS anzahl
    FROM tpop_latest_sums_separate
  )
SELECT
  jahr,
  json_object_agg(tpop_id, anzahl) AS
VALUES
  FROM tpop_latest_sums
GROUP BY
  jahr
ORDER BY
  jahr;
END;
$$
LANGUAGE plpgsql
STABLE;

ALTER FUNCTION apflora.pop_ausw_tpop_menge(popid uuid) OWNER TO postgres;

