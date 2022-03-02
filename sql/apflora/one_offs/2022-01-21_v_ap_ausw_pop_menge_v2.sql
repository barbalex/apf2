DROP MATERIALIZED VIEW IF EXISTS apflora.v_ap_ausw_pop_menge CASCADE;

CREATE MATERIALIZED VIEW apflora.v_ap_ausw_pop_menge AS
with massnjahre AS (
  SELECT
    tpop.id AS tpop_id,
    massn.jahr,
    sum(massn.zieleinheit_anzahl) AS anzahl
  FROM
    apflora.tpopmassn massn
    INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = massn.typ
      AND tw.anpflanzung = TRUE
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap
    INNER JOIN apflora.ekzaehleinheit ekze
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = massn.tpop_id
      AND tpop.year = massn.jahr
  WHERE
    massn.jahr IS NOT NULL
    AND tpop.status IN (200, 201)
    AND tpop.apber_relevant = TRUE
    AND massn.zieleinheit_einheit = ze.code
    AND massn.zieleinheit_anzahl IS NOT NULL
  GROUP BY
    tpop.id,
    massn.jahr
  ORDER BY
    tpop.id,
    massn.jahr DESC
),
zaehljahre AS (
  SELECT DISTINCT ON (tpop.id,
    kontr.jahr)
    tpop.id AS tpop_id,
    kontr.jahr,
    zaehl2.anzahl
  FROM
    apflora.tpopkontrzaehl zaehl2
    INNER JOIN apflora.tpopkontr kontr
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap
    INNER JOIN apflora.ekzaehleinheit ekze
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = kontr.tpop_id
      AND tpop.year = kontr.jahr ON zaehl2.tpopkontr_id = kontr.id
      AND zaehl2.einheit = ze.code
  WHERE
    kontr.jahr IS NOT NULL
    AND tpop.status IN (100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehl2.anzahl IS NOT NULL
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehl2.einheit
  ORDER BY
    tpop.id,
    kontr.jahr DESC,
    kontr.datum DESC
),
tpop_letzte_menge AS (
  SELECT
    tpop.id AS tpop_id,
    tpop.year AS jahr,
    CASE WHEN zj.jahr IS NOT NULL
      AND mj.jahr IS NOT NULL
      AND zj.jahr >= mj.jahr THEN
      zj.anzahl
    WHEN zj.jahr IS NOT NULL
      AND mj.jahr IS NOT NULL
      AND zj.jahr < mj.jahr THEN
      mj.anzahl
    WHEN zj.jahr IS NOT NULL THEN
      zj.anzahl
    WHEN mj.jahr IS NOT NULL THEN
      mj.anzahl
    ELSE
      NULL
    END AS anzahl
  FROM
    apflora.tpop_history AS tpop
    LEFT JOIN massnjahre AS mj ON mj.tpop_id = tpop.id
      AND mj.jahr = (
        SELECT
          max(jahr)
        FROM
          massnjahre
      WHERE
        massnjahre.jahr <= tpop.year
        AND massnjahre.tpop_id = tpop.id)
      LEFT JOIN zaehljahre AS zj ON zj.tpop_id = tpop.id
        AND zj.jahr = (
          SELECT
            max(jahr)
          FROM
            zaehljahre
        WHERE
          zaehljahre.jahr <= tpop.year
          AND zaehljahre.tpop_id = tpop.id)
      ORDER BY
        tpop.id,
        tpop.year
),
pop_data AS (
  SELECT
    ap.id AS ap_id,
    pop.year AS jahr,
    pop.id AS pop_id,
    sum(anzahl) AS anzahl
  FROM
    tpop_letzte_menge tplm
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = tplm.tpop_id
      AND tpop.year = tplm.jahr
  WHERE
    pop.status IN (100, 200, 201)
    AND tplm.anzahl IS NOT NULL
    AND pop.bekannt_seit <= pop.year
    AND tpop.bekannt_seit <= tpop.year
    AND tpop.apber_relevant = TRUE
  GROUP BY
    ap.id,
    pop.year,
    pop.id
  ORDER BY
    ap.id,
    pop.year
)
SELECT
  ap_id,
  jahr,
  json_object_agg(pop_id, anzahl) AS
VALUES
  FROM pop_data
GROUP BY
  ap_id,
  jahr
ORDER BY
  ap_id,
  jahr;

