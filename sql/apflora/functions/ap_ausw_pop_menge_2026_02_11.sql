CREATE TYPE apflora.ausw_pop_menge AS (
  jahr integer,
VALUES
  json
);

CREATE OR REPLACE FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer)
  RETURNS SETOF apflora.ausw_pop_menge
  AS $$
BEGIN
  RETURN query WITH massnahmen AS(
    SELECT
      pop.id AS pop_id,
      massn.jahr,
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
      AND massn.jahr <= $2
      AND tpop.year <= $2
      AND pop.year <= $2
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND massn.zieleinheit_einheit = ze.code
      AND massn.zieleinheit_anzahl IS NOT NULL
      AND ap.id = $1
    ORDER BY
      tpop.id,
      massn.jahr DESC
),
zaehlungen AS(
  SELECT
    pop.id AS pop_id,
    kontr.jahr,
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
    AND kontr.jahr <= $2
    AND tpop.year <= $2
    AND pop.year <= $2
    AND (kontr.apber_nicht_relevant <> TRUE OR kontr.apber_nicht_relevant IS NULL)
    AND tpop.status IN(100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehlungen.anzahl IS NOT NULL
    AND zaehlungen.einheit = ze.code
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehlungen.einheit
    AND ap.id = $1
  ORDER BY
    tpop.id,
    kontr.jahr DESC
),
zaehlungen_summe_pro_jahr AS(
  SELECT
    z.pop_id,
    z.jahr,
    sum(z.anzahl) as sum
  FROM zaehlungen z
  GROUP BY
    z.pop_id,
    z.jahr
  ORDER BY z.jahr desc
),
massnahmen_summe_pro_jahr AS(
  SELECT
    m.pop_id,
    m.jahr,
    sum(m.anzahl) as sum
  FROM massnahmen m
  GROUP BY
    m.pop_id,
    m.jahr
  ORDER BY m.jahr desc
),
letzte_anzahl_pro_jahr AS(
  SELECT
    pop.id as pop_id,
    pop.year as jahr,
    COALESCE((
      SELECT sum
      FROM zaehlungen_summe_pro_jahr zspj
      WHERE zspj.pop_id = pop.id
        AND zspj.jahr <= pop.year
      ORDER BY zspj.jahr DESC
      LIMIT 1), 0
    ) + 
    COALESCE((
      SELECT sum
      FROM massnahmen_summe_pro_jahr mspj
      WHERE mspj.pop_id = pop.id
        AND mspj.jahr <= pop.year
      ORDER BY mspj.jahr DESC
      LIMIT 1), 0
    ) AS anzahl
  FROM
    apflora.pop_history pop
  WHERE
    pop.ap_id = $1
)
SELECT
  anz.jahr,
  json_object_agg(pop_id, anzahl) AS
VALUES
  FROM letzte_anzahl_pro_jahr anz
GROUP BY
  anz.jahr
ORDER BY
  anz.jahr;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER STABLE;

ALTER FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer) OWNER TO postgres;

