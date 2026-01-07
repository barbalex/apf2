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
      AND massn.jahr <= $2
      AND tpop.status IN(200, 201)
      AND tpop.apber_relevant = TRUE
      AND massn.zieleinheit_einheit = ze.code
      AND massn.zieleinheit_anzahl IS NOT NULL
      AND ap.id = $1
    ORDER BY
      tpop.id,
      massn.jahr DESC,
      massn.datum DESC
),
zaehlungen AS(
  SELECT
    tpop.id AS tpop_id,
    kontr.jahr,
    CASE WHEN kontr.datum IS NOT NULL THEN
      kontr.datum
    ELSE
      to_date(concat(kontr.jahr, '-01-01'), 'YYYY-MM-DD')
    END AS datum,
    zaehlungen.anzahl
  FROM
    apflora.tpopkontrzaehl zaehlungen
    INNER JOIN apflora.tpopkontr kontr
    INNER JOIN apflora.tpop_history tpop
    INNER JOIN apflora.pop_history pop
    INNER JOIN apflora.ap_history ap
    INNER JOIN apflora.ekzaehleinheit ekze
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = ekze.zaehleinheit_id ON ekze.ap_id = ap.id
      AND ekze.zielrelevant = TRUE ON ap.id = pop.ap_id
      AND ap.year = pop.year ON pop.id = tpop.pop_id
      AND pop.year = tpop.year ON tpop.id = kontr.tpop_id
      AND tpop.year = kontr.jahr ON zaehlungen.tpopkontr_id = kontr.id
      AND zaehlungen.einheit = ze.code
  WHERE
    kontr.jahr IS NOT NULL
    AND kontr.jahr <= $2
    AND (kontr.apber_nicht_relevant IS NOT TRUE)
    AND tpop.status IN(100, 200, 201)
    AND tpop.apber_relevant = TRUE
    AND zaehlungen.anzahl IS NOT NULL
    -- nur Zählungen mit der Ziel-Einheit
    AND ze.code = zaehlungen.einheit
    AND ap.id = $1
  ORDER BY
    tpop.id,
    kontr.jahr DESC,
    kontr.datum DESC
),
tpop_letzte_anzahlen AS(
  SELECT
    tpop.id AS tpop_id,
    tpop.year AS jahr,
    zaehl.anzahl AS letzte_zaehlung_anzahl,
    zaehl.datum AS datum,
    massn.anzahl AS massn_anz_seither
  FROM
    apflora.tpop_history AS tpop
    INNER JOIN apflora.pop_history pop ON pop.id = tpop.pop_id
      AND pop.year = tpop.year
    INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
      AND ap.year = pop.year
    LEFT JOIN zaehlungen zaehl ON zaehl.tpop_id = tpop.id
      AND zaehl.datum =(
        SELECT
          max(datum)
        FROM
          zaehlungen
      WHERE
        tpop_id = tpop.id
        AND datum <= to_date(concat(tpop.year, '-12-31'), 'YYYY-MM-DD'))
      LEFT JOIN massnahmen massn ON massn.tpop_id = tpop.id
        AND massn.datum <= to_date(concat(tpop.year, '-12-31'), 'YYYY-MM-DD')
        AND massn.datum >= coalesce(zaehl.datum, to_date(concat(tpop.year, '-01-01'), 'YYYY-MM-DD'))
    WHERE
      ap.id = $1
      AND tpop.year <= $2
    ORDER BY
      tpop.id,
      tpop.year
),
tpop_letzte_anzahl AS(
  SELECT
    tpop_id,
    la.jahr,
    datum,
    CASE WHEN la.tpop_id IS NULL THEN
      NULL
    WHEN la.letzte_zaehlung_anzahl IS NOT NULL
      AND la.massn_anz_seither IS NOT NULL THEN
      la.letzte_zaehlung_anzahl + la.massn_anz_seither
    WHEN la.letzte_zaehlung_anzahl IS NULL
      AND la.massn_anz_seither IS NOT NULL THEN
      la.massn_anz_seither
    WHEN la.letzte_zaehlung_anzahl IS NOT NULL
      AND la.massn_anz_seither IS NULL THEN
      la.letzte_zaehlung_anzahl
    ELSE
      NULL
    END AS anzahl
  FROM
    tpop_letzte_anzahlen la
),
pop_data AS(
  SELECT
    pop.year AS jahr,
    pop.id AS pop_id,
    sum(anzahl) AS anzahl
FROM
  tpop_letzte_anzahl tpla
  INNER JOIN apflora.tpop_history tpop
  INNER JOIN apflora.pop_history pop
  INNER JOIN apflora.ap_history ap ON ap.id = pop.ap_id
    AND ap.year = pop.year ON pop.id = tpop.pop_id
    AND pop.year = tpop.year ON tpop.id = tpla.tpop_id
    AND tpop.year = tpla.jahr
  WHERE
    pop.status IN(100, 200, 201)
    AND tpla.anzahl IS NOT NULL
    AND pop.bekannt_seit <= pop.year
    AND tpop.bekannt_seit <= tpop.year
    AND tpop.apber_relevant = TRUE
    AND ap.id = $1
  GROUP BY
    ap.id,
    pop.year,
    pop.id
  ORDER BY
    ap.id,
    pop.year
)
SELECT
  pop_data.jahr,
  json_object_agg(pop_id, anzahl) AS
VALUES
  FROM pop_data
GROUP BY
  pop_data.jahr
ORDER BY
  pop_data.jahr;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER STABLE;

ALTER FUNCTION apflora.ap_ausw_pop_menge(apid uuid, jahr integer) OWNER TO postgres;

