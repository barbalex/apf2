DROP VIEW IF EXISTS apflora.v_tpop_last_count_with_massn CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_last_count_with_massn AS
SELECT
  tax.artname,
  ap.id AS ap_id,
  pop.nr AS pop_nr,
  pop.name AS pop_name,
  pop.id AS pop_id,
  psw.text AS pop_status,
  tpop.nr AS tpop_nr,
  tpop.gemeinde AS tpop_gemeinde,
  tpop.flurname AS tpop_flurname,
  tpsw.text AS tpop_status,
  anzahl.*
FROM
  crosstab ($$
    SELECT
      tpop_id, jahr, zaehleinheit, anzahl FROM ( WITH letzte_kontrollen AS ( SELECT DISTINCT ON (tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text)
  tpop5.id AS tpop_id, kontr5.jahr, apflora.tpopkontrzaehl_einheit_werte.text AS zaehleinheit, zaehl5.anzahl FROM apflora.tpopkontrzaehl zaehl5
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
    -- letzte zu berücksichtigende Kontrolle dieser tpop
    AND kontr5.id = (
      SELECT
        kontr6.id FROM apflora.tpopkontrzaehl zaehl6
        INNER JOIN apflora.tpopkontr kontr6
        INNER JOIN apflora.tpop tpop6 ON tpop6.id = kontr6.tpop_id ON zaehl6.tpopkontr_id = kontr6.id
      WHERE
        -- nur Berichts-relevante tpop
        tpop6.apber_relevant IS TRUE
        -- nur Kontrollen mit Jahr berücksichtigen
        AND kontr6.jahr IS NOT NULL
        -- nur Berichts-relevante kontrollen
        AND kontr6.apber_nicht_relevant IS NOT TRUE
        -- nur Zählungen mit Anzahl berücksichtigen
        AND zaehl6.anzahl IS NOT NULL
        -- derselben tpop
        AND kontr6.tpop_id = tpop5.id ORDER BY
        -- nur die jüngste
        kontr6.jahr DESC, kontr6.datum DESC LIMIT 1)
ORDER BY tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text, kontr5.jahr DESC, kontr5.datum DESC
), massn_triebe AS ( SELECT DISTINCT ON (tpop2.id)
    tpop2.id AS tpop_id, massn2.jahr, 'Triebe total' AS zaehleinheit, massn2.anz_triebe AS anzahl FROM apflora.tpopmassn massn2
    INNER JOIN apflora.tpop tpop2
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop2.id ON tpop2.id = massn2.tpop_id
  WHERE
    tpop2.apber_relevant IS TRUE
    AND massn2.jahr IS NOT NULL
    AND tpop2.status IN (200, 201)
    AND massn2.anz_triebe IS NOT NULL
    AND (massn2.jahr > letzte_kontrolle.jahr
      OR letzte_kontrolle.tpop_id IS NULL)
  ORDER BY tpop2.id, massn2.jahr DESC, massn2.datum DESC
), massn_pflanzen AS ( SELECT DISTINCT ON (tpop3.id)
    tpop3.id AS tpop_id, massn3.jahr, 'Pflanzen total' AS zaehleinheit, massn3.anz_pflanzen AS anzahl FROM apflora.tpopmassn massn3
    INNER JOIN apflora.tpop tpop3
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop3.id ON tpop3.id = massn3.tpop_id
  WHERE
    tpop3.apber_relevant IS TRUE
    AND massn3.jahr IS NOT NULL
    AND tpop3.status IN (200, 201)
  AND massn3.anz_pflanzen IS NOT NULL
  AND (massn3.jahr > letzte_kontrolle.jahr
    OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop3.id, massn3.jahr DESC, massn3.datum DESC
), massn_pflanzstellen AS ( SELECT DISTINCT ON (tpop4.id)
    tpop4.id AS tpop_id, massn4.jahr, 'Pflanzstellen' AS zaehleinheit, massn4.anz_pflanzstellen AS anzahl FROM apflora.tpopmassn massn4
    INNER JOIN apflora.tpop tpop4
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop4.id ON tpop4.id = massn4.tpop_id
  WHERE
    tpop4.apber_relevant IS TRUE
    AND massn4.jahr IS NOT NULL
    AND tpop4.status IN (200, 201)
    AND massn4.anz_pflanzstellen IS NOT NULL
    AND (massn4.jahr > letzte_kontrolle.jahr
      OR letzte_kontrolle.tpop_id IS NULL)
  ORDER BY tpop4.id, massn4.jahr DESC, massn4.datum DESC
), letzte_kontrolle_und_ansiedlungen AS (
  SELECT
    * FROM massn_triebe
  UNION ALL
  SELECT
    * FROM massn_pflanzen
  UNION ALL
  SELECT
    * FROM massn_pflanzstellen
    -- 3. get all einheits from tpopkontr counts
  UNION ALL
  SELECT
    * FROM letzte_kontrollen)
  -- sum all kontr and anpflanzung
  SELECT
    tpop_id, max(jahr) AS jahr, zaehleinheit, sum(anzahl) AS anzahl FROM letzte_kontrolle_und_ansiedlungen GROUP BY tpop_id, zaehleinheit ORDER BY tpop_id, jahr, zaehleinheit) AS tbl ORDER BY 1, 2, 3 $$, $$
  SELECT
    unnest('{Pflanzen total, Pflanzen (ohne Jungpflanzen), Triebe total, Triebe Beweidung, Keimlinge, davon Rosetten, Jungpflanzen, Blätter, davon blühende Pflanzen, davon blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[]) $$) AS anzahl ("tpop_id" uuid,
    "jahr" integer,
    "Pflanzen total" integer,
    "Pflanzen (ohne Jungpflanzen)" integer,
    "Triebe total" integer,
    "Triebe Beweidung" integer,
    "Keimlinge" integer,
    "davon Rosetten" integer,
    "Jungpflanzen" integer,
    "Blätter" integer,
    "davon blühende Pflanzen" integer,
    "davon blühende Triebe" integer,
    "Blüten" integer,
    "Fertile Pflanzen" integer,
    "fruchtende Triebe" integer,
    "Blütenstände" integer,
    "Fruchtstände" integer,
    "Gruppen" integer,
    "Deckung (%)" integer,
    "Pflanzen/5m2" integer,
    "Triebe in 30 m2" integer,
    "Triebe/50m2" integer,
    "Triebe Mähfläche" integer,
    "Fläche (m2)" integer,
    "Pflanzstellen" integer,
    "Stellen" integer,
    "andere Zaehleinheit" integer,
    "Art ist vorhanden" text)
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop_status_werte tpsw ON tpsw.code = tpop.status
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.pop_status_werte psw ON psw.code = pop.status
    INNER JOIN apflora.ap
    INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON apflora.ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = anzahl.tpop_id
  ORDER BY
    tax.artname,
    pop.nr,
    tpop.nr;

COMMENT ON VIEW apflora.v_tpop_last_count_with_massn IS '@foreignKey (tpop_id) references tpop (id)';

