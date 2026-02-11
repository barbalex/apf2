-- graphql name: popAuswTpopMenge
CREATE OR REPLACE FUNCTION apflora.pop_ausw_tpop_menge(popid uuid)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN QUERY WITH massnahmen AS(
    SELECT
      tpop.id AS tpop_id,
      massn.jahr,
      massn.zieleinheit_anzahl AS anzahl
    FROM
      apflora.tpopmassn massn
      INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = massn.typ
        AND tw.anpflanzung = TRUE
      INNER JOIN apflora.tpop_history tpop ON tpop.id = massn.tpop_id
        AND tpop.year = massn.jahr
      INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id
        AND pop.year = tpop.year
      INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
        AND ap.year = pop.year
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
        AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
    WHERE
      massn.jahr IS NOT NULL
      AND massn.jahr <= EXTRACT(YEAR FROM CURRENT_DATE)
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND massn.zieleinheit_einheit = ze.code
      AND massn.zieleinheit_anzahl IS NOT NULL
      AND pop.id = $1
    ORDER BY
      tpop.id,
      massn.jahr DESC
),
zaehlungen AS(
  SELECT
    tpop.id AS tpop_id,
    kontr.jahr AS jahr,
    zaehlungen.anzahl
  FROM
    apflora.tpopkontrzaehl zaehlungen
    INNER JOIN apflora.tpopkontr kontr ON zaehlungen.tpopkontr_id = kontr.id
    INNER JOIN apflora.tpop_history tpop ON tpop.id = kontr.tpop_id
      AND tpop.year = kontr.jahr
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id
      AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
      AND ap.year = pop.year
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
  WHERE
    kontr.jahr IS NOT NULL
    AND kontr.jahr <= EXTRACT(YEAR FROM CURRENT_DATE)
    -- we want false or null, but not true
    -- https://stackoverflow.com/a/46474204/712005
    AND kontr.apber_nicht_relevant IS NOT TRUE
    AND tpop.status IN(100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehlungen.anzahl IS NOT NULL
    AND zaehlungen.einheit = ze.code
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehlungen.einheit
    AND tpop.pop_id = $1
  ORDER BY
    kontr.jahr DESC,
    tpop.id
),
zaehlungen_summe_pro_jahr AS(
  SELECT
    tpop_id,
    jahr,
    sum(anzahl) AS sum
  FROM
    zaehlungen
  GROUP BY
    tpop_id,
    jahr
  ORDER BY
    jahr DESC
),
massnahmen_summe_pro_jahr AS(
  SELECT
    tpop_id,
    jahr,
    sum(anzahl) AS sum
  FROM
    massnahmen
  GROUP BY
    tpop_id,
    jahr
  ORDER BY
    jahr DESC
),
letzte_anzahl_pro_jahr AS(
  SELECT
    tpop.id AS tpop_id,
    tpop.year AS jahr,
    coalesce((
      SELECT
        sum
      FROM zaehlungen_summe_pro_jahr zspj
    WHERE
      zspj.tpop_id = tpop.id
      AND zspj.jahr <= tpop.year ORDER BY zspj.jahr DESC LIMIT 1), 0) + coalesce((
      SELECT
        sum
      FROM massnahmen_summe_pro_jahr mspj
    WHERE
      mspj.tpop_id = tpop.id
      AND mspj.jahr <= tpop.year ORDER BY mspj.jahr DESC LIMIT 1), 0) AS anzahl
  FROM
    apflora.tpop_history tpop
  WHERE
    tpop.pop_id = $1
)
SELECT
  jahr,
  json_object_agg(tpop_id, anzahl) AS
VALUES
  FROM letzte_anzahl_pro_jahr
GROUP BY
  jahr
ORDER BY
  jahr;
END;
$$
LANGUAGE plpgsql
STABLE;

ALTER FUNCTION apflora.pop_ausw_tpop_menge(popid uuid) OWNER TO postgres;

