SELECT
  jahr,
  datum
FROM
  apflora.tpopmassn
WHERE (datum IS NULL
  AND jahr IS NOT NULL)
  OR (jahr IS NULL
    AND datum IS NOT NULL);

-- 612 rows
--
SELECT
  jahr,
  datum
FROM
  apflora.tpopmassn
WHERE
  datum IS NULL
  AND jahr IS NOT NULL;

-- 612 rows
--
SELECT
  jahr,
  datum
FROM
  apflora.tpopmassn
WHERE
  jahr IS NULL
  AND datum IS NOT NULL;

-- 0 rows
--
SELECT
  tax.artname,
  massn.*
FROM
  apflora.tpopmassn massn
  INNER JOIN apflora.tpop tpop ON tpop.id = massn.tpop_id
  INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
  INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
WHERE
  massn.jahr IS NULL
  AND massn.datum IS NULL
  AND tax.artname NOT IN ('Abies alba Mill. (Edel-Tanne, Weiss-Tanne)', 'Abutilon theophrasti Medik.');

-- 3 rows
--
SELECT
  jahr,
  datum
FROM
  apflora.tpopkontr
WHERE (datum IS NULL
  AND jahr IS NOT NULL)
  OR (jahr IS NULL
    AND datum IS NOT NULL);

-- 1441 rows
--
SELECT
  jahr,
  datum
FROM
  apflora.tpopkontr
WHERE
  datum IS NULL
  AND jahr IS NOT NULL;

-- 1441 rows
--
SELECT
  jahr,
  datum
FROM
  apflora.tpopkontr
WHERE
  jahr IS NULL
  AND datum IS NOT NULL;

-- 0 rows
--
SELECT
  tax.artname,
  kontr.*
FROM
  apflora.tpopkontr kontr
  INNER JOIN apflora.tpop tpop ON tpop.id = kontr.tpop_id
  INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
  INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
WHERE
  kontr.jahr IS NULL
  AND kontr.datum IS NULL
  AND tax.artname NOT IN ('Abies alba Mill. (Edel-Tanne, Weiss-Tanne)', 'Abutilon theophrasti Medik.')
ORDER BY
  tax.artname;

-- 4 rows
--
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
  tpop5.id AS tpop_id, kontr5.jahr, kontr5.datum, apflora.tpopkontrzaehl_einheit_werte.text AS zaehleinheit, zaehl5.anzahl FROM apflora.tpopkontrzaehl zaehl5
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
), massn_triebe AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Triebe total' AS zaehleinheit, massn.anz_triebe AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
    -- bei denen anz_triebe gezählt wurde
    AND massn.anz_triebe IS NOT NULL
    AND (((massn.datum IS NOT NULL
      AND letzte_kontrolle.datum IS NOT NULL
      AND massn.datum > letzte_kontrolle.datum)
    OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
), massn_pflanzen AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Pflanzen total' AS zaehleinheit, massn.anz_pflanzen AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
  -- bei denen anz_pflanzen gezählt wurde
  AND massn.anz_pflanzen IS NOT NULL
  AND (((massn.datum IS NOT NULL
    AND letzte_kontrolle.datum IS NOT NULL
    AND massn.datum > letzte_kontrolle.datum)
  OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
), massn_pflanzstellen AS ( SELECT DISTINCT ON (tpop.id)
    tpop.id AS tpop_id, massn.jahr, 'Pflanzstellen' AS zaehleinheit, massn.anz_pflanzstellen AS anzahl FROM apflora.tpopmassn massn
    INNER JOIN apflora.tpop tpop
    LEFT JOIN letzte_kontrollen letzte_kontrolle ON letzte_kontrolle.tpop_id = tpop.id ON tpop.id = massn.tpop_id
  WHERE
    tpop.apber_relevant IS TRUE
    AND massn.jahr IS NOT NULL
    -- nur Ansiedlungen
    AND tpop.status IN (200, 201)
    -- bei denen anz_pflanzstellen gezählt wurde
    AND massn.anz_pflanzstellen IS NOT NULL
    AND (((massn.datum IS NOT NULL
      AND letzte_kontrolle.datum IS NOT NULL
      AND massn.datum > letzte_kontrolle.datum)
    OR massn.jahr > letzte_kontrolle.jahr)
  OR letzte_kontrolle.tpop_id IS NULL)
ORDER BY tpop.id, massn.jahr DESC, massn.datum DESC
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
    tpop_id, jahr, zaehleinheit, anzahl FROM letzte_kontrollen)
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
  WHERE
    -- keine Testarten
    tax.taxid > 150
  ORDER BY
    tax.artname,
    pop.nr,
    tpop.nr;

COMMENT ON VIEW apflora.v_tpop_last_count_with_massn IS '@foreignKey (tpop_id) references tpop (id)';

