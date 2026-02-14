-- graphql name: popAuswTpopMenge
CREATE OR REPLACE FUNCTION apflora.pop_ausw_tpop_menge(popid uuid)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN QUERY 
  WITH massnahmen_anzahl_per_tpop_id_and_year AS(
    SELECT 
      m.tpop_id, 
      m.datum, 
      m.jahr, 
      m.zieleinheit_anzahl as anzahl
    FROM apflora.tpopmassn m
    INNER JOIN apflora.tpop_history th ON th.id = m.tpop_id and th.year = m.jahr
    -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
    INNER JOIN apflora.tpop tpop ON tpop.id = th.id
    INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ON ap.id = pop.ap_id
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON 
      ze.id = ekze.zaehleinheit_id 
      AND ze.code = m.zieleinheit_einheit
    INNER JOIN apflora.tpopmassn_typ_werte mtw ON 
      mtw.code = m.typ
      AND mtw.anpflanzung = TRUE
    WHERE 
      m.zieleinheit_anzahl IS NOT NULL
      AND th.status = 200
      AND th.apber_relevant = TRUE
      AND tpop.pop_id = $1
    ORDER BY
      m.tpop_id,
      m.jahr DESC, 
      m.datum DESC
  ),
  massnahmen_sum_per_tpop_id_and_year AS(
    SELECT 
      tpop_id, 
      jahr, 
      datum, 
      sum(anzahl) AS sum
    FROM massnahmen_anzahl_per_tpop_id_and_year
    GROUP BY 
      tpop_id, 
      jahr, 
      datum
    -- some have no datum, only year
    ORDER BY 
      jahr DESC, 
      datum DESC
  ),
  zaehlungen_per_tpop_id_and_year AS(
    SELECT 
      tpop.id AS tpop_id, 
      kontr.jahr, 
      kontr.datum, 
      zaehl.anzahl
    FROM apflora.tpopkontrzaehl zaehl
    INNER JOIN apflora.tpopkontr kontr ON kontr.id = zaehl.tpopkontr_id
    INNER JOIN apflora.tpop_history th ON th.id = kontr.tpop_id AND th.year = kontr.jahr
    -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
    INNER JOIN apflora.tpop tpop ON tpop.id = th.id
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
      AND th.status IN(100, 200)
      AND th.apber_relevant = TRUE
      AND tpop.pop_id = $1
  ),
  zaehlungen_sum_per_tpop_id_and_year AS(
    SELECT 
      tpop_id, 
      jahr, 
      datum, 
      sum(anzahl) AS sum
    FROM zaehlungen_per_tpop_id_and_year
    GROUP BY 
      tpop_id, 
      jahr, 
      datum
    -- some kontr have no datum, only year
    ORDER BY 
      jahr DESC, 
      datum DESC
  ),
  tpop_latest_sums_separate AS(
    SELECT
      th.id AS tpop_id,
      th.year AS jahr,
      COALESCE(zaehlungen.sum, 0) AS anzahl_zaehlungen,
      COALESCE(massnahmen.sum, 0) AS anzahl_massnahmen
    FROM apflora.tpop_history th
    -- enforce tpop with same id exists (about 1000 tpop_history entries have no corresponding tpop)
    INNER JOIN apflora.tpop tpop ON tpop.id = th.id
    LEFT JOIN LATERAL (
      SELECT sum, jahr, datum
      FROM zaehlungen_sum_per_tpop_id_and_year
      WHERE
        tpop_id = th.id
        AND jahr <= th.year
      ORDER BY jahr DESC, datum DESC
      LIMIT 1
    ) AS zaehlungen ON true
    LEFT JOIN LATERAL (
      SELECT
        sum(massnahmen.sum) AS sum,
        max(massnahmen.jahr) AS jahr
      FROM massnahmen_sum_per_tpop_id_and_year massnahmen
      WHERE
        massnahmen.tpop_id = th.id
        AND (
          (
            zaehlungen.datum IS NOT NULL 
            AND massnahmen.datum > zaehlungen.datum 
            AND massnahmen.jahr <= th.year
          )
          OR (
            zaehlungen.datum IS NULL
            AND massnahmen.jahr <= th.year
          )
        )
    ) AS massnahmen ON true
    WHERE 
      tpop.pop_id = $1
      AND th.apber_relevant = TRUE
      AND th.status IN(100, 200)
    ORDER BY
      th.id,
      th.year DESC
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
  json_object_agg(tpop_id, anzahl) AS values
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

