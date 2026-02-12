-- derived from pop_ausw_tpop_menge.sql
CREATE OR REPLACE FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN QUERY
  WITH massnahmen_anzahl_per_tpop_id_and_year AS(
    SELECT
      tpop.pop_id,
      mi.tpop_id,
      mi.jahr,
      mi.zieleinheit_anzahl AS anzahl
    FROM apflora.tpopmassn mi
    INNER JOIN apflora.tpop_history tpop ON tpop.id = mi.tpop_id AND tpop.year = mi.jahr
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id AND ap.year = pop.year
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
      AND ze.code = mi.zieleinheit_einheit
    INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = mi.typ
      AND tw.anpflanzung = TRUE
    WHERE
      mi.zieleinheit_anzahl IS NOT NULL
      AND mi.jahr <= $2
      AND tpop.year <= $2
      AND pop.year <= $2
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND ap.id = $1
    ORDER BY
      mi.tpop_id,
      mi.jahr DESC
  ),
  massnahmen_sum_per_tpop_id_and_year AS(
    SELECT
      massnahmen.tpop_id,
      massnahmen.jahr,
      sum(massnahmen.anzahl) AS sum
    FROM massnahmen_anzahl_per_tpop_id_and_year massnahmen
    GROUP BY
      massnahmen.tpop_id,
      massnahmen.jahr
    ORDER BY
      massnahmen.jahr DESC
  ),
  zaehlungen_per_tpop_id_and_year AS(
    SELECT
      tpop.pop_id,
      tpop.id AS tpop_id,
      kontr.jahr,
      zaehl.anzahl
    FROM apflora.tpopkontrzaehl zaehl
    INNER JOIN apflora.tpopkontr kontr ON kontr.id = zaehl.tpopkontr_id
    INNER JOIN apflora.tpop_history tpop ON tpop.id = kontr.tpop_id AND tpop.year = kontr.jahr
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id AND ap.year = pop.year
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
      AND ze.code = zaehl.einheit
    WHERE
      zaehl.anzahl IS NOT NULL
      AND kontr.jahr <= $2
      AND tpop.year <= $2
      AND pop.year <= $2
      AND kontr.apber_nicht_relevant IS NOT TRUE
      AND tpop.status IN(100, 200, 201)
      AND tpop.apber_relevant = TRUE
      AND ap.id = $1
  ),
  zaehlungen_sum_per_tpop_id_and_year AS(
    SELECT
      zaehlungen.tpop_id,
      zaehlungen.jahr,
      sum(zaehlungen.anzahl) AS sum
    FROM zaehlungen_per_tpop_id_and_year zaehlungen
    GROUP BY
      zaehlungen.tpop_id,
      zaehlungen.jahr
    ORDER BY
      zaehlungen.jahr DESC
  ),
  tpop_latest_sums_separate AS(
    SELECT
      pop.id AS pop_id,
      tpop.id AS tpop_id,
      tpop.year AS jahr,
      COALESCE(zaehlungen.sum, 0) AS anzahl_zaehlungen,
      COALESCE(massnahmen.sum, 0) AS anzahl_massnahmen
    FROM apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id AND ap.year = pop.year
    LEFT JOIN LATERAL (
      SELECT sum
      FROM zaehlungen_sum_per_tpop_id_and_year zaehlungen
      WHERE
        zaehlungen.tpop_id = tpop.id
        AND zaehlungen.jahr <= tpop.year
      ORDER BY zaehlungen.jahr DESC
      LIMIT 1
    ) AS zaehlungen ON true
    LEFT JOIN LATERAL (
      SELECT sum
      FROM massnahmen_sum_per_tpop_id_and_year massnahmen
      WHERE
        massnahmen.tpop_id = tpop.id
        AND (
          (COALESCE(zaehlungen.sum, 0) > 0 AND massnahmen.jahr = tpop.year)
          OR (COALESCE(zaehlungen.sum, 0) <= 0 AND massnahmen.jahr <= tpop.year)
        )
      ORDER BY massnahmen.jahr DESC
      LIMIT 1
    ) AS massnahmen ON true
    WHERE
      ap.id = $1
      AND tpop.apber_relevant = TRUE
      AND tpop.status IN(100, 200, 201)
      AND tpop.year <= $2
    ORDER BY
      tpop.id,
      tpop.year DESC
  ),
  tpop_latest_sums AS(
    SELECT
      pop_id,
      tpop_id,
      tpop_latest_sums_separate.jahr,
      anzahl_zaehlungen + anzahl_massnahmen AS anzahl
    FROM tpop_latest_sums_separate
  ),
  pop_latest_sums AS(
    SELECT
      tpop_latest_sums.pop_id,
      tpop_latest_sums.jahr,
      sum(tpop_latest_sums.anzahl) AS anzahl
    FROM tpop_latest_sums
    GROUP BY
      tpop_latest_sums.pop_id,
      tpop_latest_sums.jahr
  )
  SELECT
    pop_latest_sums.jahr,
    json_object_agg(pop_latest_sums.pop_id, pop_latest_sums.anzahl) AS values
  FROM pop_latest_sums
  GROUP BY pop_latest_sums.jahr
  ORDER BY pop_latest_sums.jahr;
END;
$$
LANGUAGE plpgsql
STABLE;

ALTER FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer) OWNER TO postgres;
