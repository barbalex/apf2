WITH nr_of_kontr AS (
  SELECT
    apflora.tpop.id,
    count(apflora.tpopkontr.id) AS anzahl
  FROM
    apflora.tpop
    LEFT JOIN apflora.tpopkontr ON apflora.tpopkontr.tpop_id = apflora.tpop.id
  WHERE
    apflora.tpop.apber_relevant IS TRUE
    AND apflora.tpopkontr.apber_nicht_relevant IS NOT TRUE
  GROUP BY
    apflora.tpop.id
),
letzte_ansiedlungen AS (
  SELECT DISTINCT ON (tpop1.id)
    tpop1.id AS tpop_id,
    massn1.id AS massn_id
  FROM
    apflora.tpopmassn massn1
    INNER JOIN apflora.tpop tpop1 ON tpop1.id = massn1.tpop_id
    INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn_typ_werte.code = massn1.typ
  WHERE
    tpop1.apber_relevant IS TRUE
    AND massn1.jahr IS NOT NULL
    AND tpopmassn_typ_werte.ansiedlung = TRUE
    AND (massn1.anz_triebe IS NOT NULL
      OR massn1.anz_pflanzen IS NOT NULL
      OR massn1.anz_pflanzstellen IS NOT NULL
      OR massn1.zieleinheit_anzahl IS NOT NULL)
  ORDER BY
    tpop1.id,
    massn1.jahr DESC,
    massn1.datum DESC
),
kontr_und_ansiedlungen AS (
  -- 1. DO NOT get zieleinheit from massnahmen counts
  -- 2. get anz_triebe from massnahmen counts
  SELECT
    *
  FROM ( SELECT DISTINCT ON (tpop2.id)
      tpop2.id AS tpop_id,
      massn2.jahr,
      'Triebe total' AS zaehleinheit,
      massn2.anz_triebe AS anzahl
    FROM
      apflora.tpopmassn massn2
      INNER JOIN letzte_ansiedlungen ON letzte_ansiedlungen.massn_id = massn2.id
        AND letzte_ansiedlungen.tpop_id = massn2.tpop_id
      INNER JOIN apflora.tpop tpop2
      INNER JOIN nr_of_kontr ON nr_of_kontr.id = tpop2.id ON tpop2.id = massn2.tpop_id
    WHERE
      tpop2.apber_relevant IS TRUE
      AND massn2.jahr IS NOT NULL
      AND tpop2.status IN (200, 201)
      AND nr_of_kontr.anzahl = 0
      AND massn2.anz_triebe IS NOT NULL
    ORDER BY
      tpop2.id,
      massn2.jahr DESC,
      massn2.datum DESC) AS triebe
UNION ALL
-- 3. get anz_pflanzen from massnahmen counts
SELECT
  *
FROM ( SELECT DISTINCT ON (tpop3.id)
    tpop3.id AS tpop_id,
    massn3.jahr,
    'Pflanzen total' AS zaehleinheit,
    massn3.anz_pflanzen AS anzahl
  FROM
    apflora.tpopmassn massn3
    INNER JOIN letzte_ansiedlungen ON letzte_ansiedlungen.massn_id = massn3.id
      AND letzte_ansiedlungen.tpop_id = massn3.tpop_id
    INNER JOIN apflora.tpop tpop3
    INNER JOIN nr_of_kontr ON nr_of_kontr.id = tpop3.id ON tpop3.id = massn3.tpop_id
  WHERE
    tpop3.apber_relevant IS TRUE
    AND massn3.jahr IS NOT NULL
    AND tpop3.status IN (200, 201)
    AND nr_of_kontr.anzahl = 0
    AND massn3.anz_pflanzen IS NOT NULL
  ORDER BY
    tpop3.id,
    massn3.jahr DESC,
    massn3.datum DESC) AS pflanzen
UNION ALL
-- 3. get anz_pflanzstellen from massnahmen counts
SELECT
  *
FROM ( SELECT DISTINCT ON (tpop4.id)
    tpop4.id AS tpop_id,
    massn4.jahr,
    'Pflanzstellen' AS zaehleinheit,
    massn4.anz_pflanzstellen AS anzahl
  FROM
    apflora.tpopmassn massn4
    INNER JOIN letzte_ansiedlungen ON letzte_ansiedlungen.massn_id = massn4.id
      AND letzte_ansiedlungen.tpop_id = massn4.tpop_id
    INNER JOIN apflora.tpop tpop4
    INNER JOIN nr_of_kontr ON nr_of_kontr.id = tpop4.id ON tpop4.id = massn4.tpop_id
  WHERE
    tpop4.apber_relevant IS TRUE
    AND massn4.jahr IS NOT NULL
    AND tpop4.status IN (200, 201)
    AND nr_of_kontr.anzahl = 0
    AND massn4.anz_pflanzstellen IS NOT NULL
  ORDER BY
    tpop4.id,
    massn4.jahr DESC,
    massn4.datum DESC) AS pflanzstellen
-- 3. get all einheits from tpopkontr counts
UNION ALL
SELECT
  *
FROM ( SELECT DISTINCT ON (tpop5.id,
    apflora.tpopkontrzaehl_einheit_werte.text)
    tpop5.id AS tpop_id,
    kontr5.jahr,
    apflora.tpopkontrzaehl_einheit_werte.text AS zaehleinheit,
    zaehl5.anzahl
  FROM
    apflora.tpopkontrzaehl zaehl5
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte ON apflora.tpopkontrzaehl_einheit_werte.code = zaehl5.einheit
    INNER JOIN apflora.tpopkontr kontr5
    INNER JOIN apflora.tpop tpop5 ON tpop5.id = kontr5.tpop_id ON zaehl5.tpopkontr_id = kontr5.id
  WHERE
    tpop5.apber_relevant IS TRUE
    -- nur Kontrollen mit Jahr berücksichtigen
    AND kontr5.jahr IS NOT NULL
    AND kontr5.apber_nicht_relevant IS NOT TRUE
    -- nur Zählungen mit Anzahl berücksichtigen
    AND zaehl5.anzahl IS NOT NULL
    AND kontr5.id = (
      SELECT
        kontr6.id
      FROM
        apflora.tpopkontrzaehl zaehl6
        INNER JOIN apflora.tpopkontr kontr6
        INNER JOIN apflora.tpop tpop6 ON tpop6.id = kontr6.tpop_id ON zaehl6.tpopkontr_id = kontr6.id
      WHERE
        tpop6.apber_relevant IS TRUE
        AND kontr6.jahr IS NOT NULL
        AND kontr6.apber_nicht_relevant IS NOT TRUE
        AND zaehl6.anzahl IS NOT NULL
        AND kontr6.tpop_id = tpop5.id
      ORDER BY
        kontr6.jahr DESC,
        kontr6.datum DESC
      LIMIT 1)
  ORDER BY
    tpop5.id,
    apflora.tpopkontrzaehl_einheit_werte.text,
    kontr5.jahr DESC,
    kontr5.datum DESC) AS kontrs)
-- sum all kontr and anpflanzung
SELECT
  tpop_id,
  jahr,
  zaehleinheit,
  sum(anzahl) AS anzahl_summiert
FROM
  kontr_und_ansiedlungen
GROUP BY
  tpop_id,
  jahr,
  zaehleinheit
ORDER BY
  tpop_id,
  jahr,
  zaehleinheit
