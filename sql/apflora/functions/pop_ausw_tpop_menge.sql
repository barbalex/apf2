CREATE OR REPLACE FUNCTION apflora.pop_ausw_tpop_menge(popid uuid)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN query WITH massnahmen AS(
    SELECT
      tpop.id AS tpop_id,
      massn.jahr,
      CASE WHEN massn.datum IS NOT NULL THEN
        massn.datum
      ELSE
        to_date(concat(massn.jahr, '-01-01'), 'YYYY-MM-DD')
      END AS datum,
      massn.zieleinheit_anzahl AS anzahl
    FROM
      apflora.tpopmassn massn
      INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = massn.typ AND tw.anpflanzung = TRUE
      INNER JOIN apflora.tpop_history tpop ON tpop.id = massn.tpop_id AND tpop.year = massn.jahr
      INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id AND pop.year = tpop.year
      INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id AND ap.year = pop.year
      INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id AND ekze.zielrelevant = TRUE
      INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
    WHERE
      massn.jahr IS NOT NULL
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND massn.zieleinheit_einheit = ze.code
      AND massn.zieleinheit_anzahl IS NOT NULL
      AND pop.id = $1
    ORDER BY
      tpop.id,
      massn.jahr DESC,
      massn.datum DESC
),
zaehlungen AS(
  SELECT
    tpop.id AS tpop_id,
    tpop.year AS jahr,
    CASE WHEN kontr.datum IS NOT NULL THEN kontr.datum
    ELSE to_date(concat(kontr.jahr, '-01-01'), 'YYYY-MM-DD')
    END AS datum,
    zaehlungen.anzahl
  FROM
    apflora.tpopkontrzaehl zaehlungen
    INNER JOIN apflora.tpopkontr kontr ON zaehlungen.tpopkontr_id = kontr.id
    INNER JOIN apflora.tpop_history tpop ON tpop.id = kontr.tpop_id AND tpop.year = kontr.jahr
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id AND ap.year = pop.year
    INNER JOIN apflora.ekzaehleinheit ekze ON ekze.ap_id = ap.id AND ekze.zielrelevant = TRUE
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id
  WHERE
    kontr.jahr IS NOT NULL
    AND tpop.status IN(100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehlungen.anzahl IS NOT NULL
    AND zaehlungen.einheit = ze.code
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehlungen.einheit
    AND tpop.pop_id = $1
  ORDER BY
    tpop.id,
    kontr.jahr DESC,
    kontr.datum DESC
),
zaehlungen_summe_pro_jahr AS(
  SELECT
    tpop_id,
    jahr,
    sum(anzahl) as sum
  FROM zaehlungen
  GROUP BY
    tpop_id,
    jahr
  ORDER BY jahr desc
),
massnahmen_summe_pro_jahr AS(
  SELECT
    tpop_id,
    jahr,
    sum(anzahl) as sum
  FROM massnahmen
  GROUP BY
    tpop_id,
    jahr
  ORDER BY jahr desc
),
tpop_summe_pro_jahr AS(
  SELECT
    tpop.id as tpop_id,
    tpop.year as jahr,
    COALESCE(zspj.sum, 0) + COALESCE(mspj.sum, 0) AS anzahl
  FROM
    apflora.tpop_history tpop
    left join zaehlungen_summe_pro_jahr zspj on zspj.tpop_id = tpop.id AND zspj.jahr = tpop.year
    left join massnahmen_summe_pro_jahr mspj on mspj.tpop_id = tpop.id AND mspj.jahr = tpop.year
  WHERE
    tpop.pop_id = $1
  ORDER BY
    tpop.year DESC
)
SELECT
  jahr,
  json_object_agg(tpop_id, anzahl) AS
VALUES
  FROM tpop_summe_pro_jahr
GROUP BY
  jahr
ORDER BY
  jahr;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER STABLE;

ALTER FUNCTION apflora.pop_ausw_tpop_menge(popid uuid) OWNER TO postgres;

