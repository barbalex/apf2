ALTER TABLE apflora.tpopmassn RENAME "TPopMassnGuid" TO id;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnId" TO id_old;
ALTER TABLE apflora.tpopmassn RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnTyp" TO typ;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnTxt" TO beschreibung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnJahr" TO jahr;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnDatum" TO datum;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnBearb" TO bearbeiter;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnBemTxt" TO bemerkungen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnPlan" TO plan_vorhanden;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnPlanBez" TO plan_bezeichnung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnFlaeche" TO flaeche;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnMarkierung" TO markierung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedAnzTriebe" TO anz_triebe;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedAnzPfl" TO anz_pflanzen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnzPflanzstellen" TO anz_pflanzstellen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedWirtspfl" TO wirtspflanze;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedHerkunftPop" TO herkunft_pop;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedDatSamm" TO sammeldatum;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedForm" TO form;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedPflanzanordnung" TO pflanzanordnung;
ALTER TABLE apflora.tpopmassn RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopmassn.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopmassn DROP CONSTRAINT tpopmassn_pkey;
ALTER TABLE apflora.tpopmassn ADD PRIMARY KEY (id);

-- done: rename in sql
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers with tpopmassn to this file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- done: update js and run this file on server

DROP TRIGGER IF EXISTS tpopmassn_on_update_set_mut ON apflora.tpopmassn;
DROP FUNCTION IF EXISTS tpopmassn_on_update_set_mut();
CREATE FUNCTION tpopmassn_on_update_set_mut() RETURNS trigger AS $tpopmassn_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassn_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassn
  FOR EACH ROW EXECUTE PROCEDURE tpopmassn_on_update_set_mut();

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    1 AS "ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.pop."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
  FROM
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId"
  WHERE
    apflora.tpop."TPopApBerichtRelevant" = 1
    AND apflora.tpop."TPopId" IN (
      -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.typ IN (1, 2, 3)
        AND apflora.tpopmassn.jahr < $2
    )
    AND apflora.tpop."TPopId" IN (
      -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr."TPopId"
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr."TPopKontrJahr" = $2
    )
    AND apflora.tpop."TPopId" NOT IN (
      -- 3. "TPop mit TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopber.tpop_id
      FROM
        apflora.tpopmassnber
      WHERE
        apflora.tpopmassnber.jahr = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopId" IN (
      SELECT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopApBerichtRelevant" = 1
      GROUP BY
        apflora.tpop."PopId"
    )
    AND apflora.pop."PopId" IN (
      -- 3. "Pop mit TPop mit verlangten TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopId" IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ IN (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop."TPopId" IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr."TPopId"
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr."TPopKontrJahr" = $2
        )
    )
    AND apflora.pop."PopId" NOT IN (
      -- 4. "Pop mit PopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popmassnber."PopId"
      FROM
        apflora.popmassnber
      WHERE
        apflora.popmassnber."PopMassnBerJahr" = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopId" IN (
      SELECT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopApBerichtRelevant" = 1
      GROUP BY
        apflora.tpop."PopId"
    )
    AND apflora.pop."PopId" IN (
      -- 3. "Pop mit TPop mit verlangten TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopId" IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
          apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ in (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop."TPopId" IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr."TPopId"
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr."TPopKontrJahr" = $2
        )
    )
    AND apflora.pop."PopId" NOT IN (
      -- 4. "Pop mit PopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popber."PopId"
      FROM
        apflora.popber
      WHERE
        apflora.popber."PopBerJahr" = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE VIEW apflora.v_apber_c1rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          apflora.v_tpop_letztertpopber0_overall
          ON
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > apflora.tpopber."TPopBerJahr"
  );

CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  apflora.tpopkontr."ZeitGuid" AS "fkZeitpunkt",
  apflora.tpopkontr."TPopKontrGuid" AS "idBeobachtung",
  -- TODO: should EvabIdPerson be real uuid?
  COALESCE(apflora.adresse."EvabIdPerson", '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::uuid) AS fkAutor,
  apflora.ap."ApArtId" AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell):
  - Status ist ursprünglich (< 200):
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN apflora.tpop."TPopHerkunft" < 200 THEN 4
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpopkontr."TPopId"
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= apflora.tpopkontr."TPopKontrJahr"
    ) THEN 6
    WHEN apflora.tpop."TPopHerkunftUnklar" = 1 THEN 3
    ELSE 5
  END AS "fkAAINTRODUIT",
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      apflora.v_tpopkontr_maxanzahl.anzahl = 0
      AND EXISTS (
        SELECT
          "TPopId"
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber."TPopId" = apflora.tpopkontr."TPopId"
          AND apflora.tpopber."TPopBerEntwicklung" = 8
          AND apflora.tpopber."TPopBerJahr" = apflora.tpopkontr."TPopKontrJahr"
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl.anzahl = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "MENACES",
  substring(apflora.tpopkontr."TPopKontrVitalitaet" from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop."TPopBeschr" from 1 for 244) AS "STATION",
  /*
   * Zählungen auswerten für ABONDANCE
   */
  substring(
    concat(
      'Anzahlen: ',
      array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C'::TEXT AS "EXPERTISE_INTRODUIT",
  /*
   * AP-Verantwortliche oder topos als EXPERTISE_INTRODUITE_NOM setzen
   */
  CASE
    WHEN "tblAdresse_2"."EvabIdPerson" IS NOT NULL
    THEN "tblAdresse_2"."AdrName"
    ELSE 'topos Marti & Müller AG Zürich'
  END AS "EXPERTISE_INTRODUITE_NOM"
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS "tblAdresse_2"
    ON apflora.ap."ApBearb" = "tblAdresse_2"."AdrId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr."TPopKontrJahr" <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr."ZeitGuid" IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr."ZeitGuid",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl.anzahl,
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";

CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr",
  count(apflora.tpopmassn.id) AS "AnzahlvonTPopMassnId"
FROM
  apflora.popmassnber
  INNER JOIN
    (apflora.tpop
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.popmassnber."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassn.jahr = apflora.popmassnber."PopMassnBerJahr"
  Or apflora.tpopmassn.jahr IS NULL
GROUP BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr"
ORDER BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_massn_jahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_jahre AS
SELECT
  apflora.tpopmassn.jahr
FROM
  apflora.tpopmassn
GROUP BY
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr BETWEEN 1900 AND 2100
ORDER BY
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr0;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr,
  count(apflora.tpopmassn.id) AS "AnzahlvonTPopMassnId"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr
HAVING
  apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.tpopmassn.jahr;

CREATE OR REPLACE VIEW apflora.v_erstemassnproap AS
SELECT
  apflora.ap."ApArtId",
  min(apflora.tpopmassn.jahr) AS "MinvonTPopMassnJahr"
FROM
  ((apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
GROUP BY
  apflora.ap."ApArtId";

DROP VIEW IF EXISTS apflora.v_massn;
CREATE OR REPLACE VIEW apflora.v_massn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Massn Jahr",
  apflora.tpopmassn.datum AS "Massn Datum",
  tpopmassn_typ_werte."MassnTypTxt" AS "Massn Typ",
  apflora.tpopmassn.beschreibung AS "Massn Massnahme",
  apflora.adresse."AdrName" AS "Massn BearbeiterIn",
  apflora.tpopmassn.bemerkungen::char AS "Massn Bemerkungen",
  apflora.tpopmassn.plan_vorhanden AS "Massn Plan vorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "Massn Plan Bezeichnung",
  apflora.tpopmassn.flaeche AS "Massn Flaeche m2",
  apflora.tpopmassn.form AS "Massn Form der Ansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "Massn Pflanzanordnung",
  apflora.tpopmassn.markierung AS "Massn Markierung",
  apflora.tpopmassn.anz_triebe AS "Massn Anz Triebe",
  apflora.tpopmassn.anz_pflanzen AS "Massn Pflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "Massn Anz Pflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "Massn Wirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "Massn Herkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "Massn Sammeldatum",
  apflora.tpopmassn.changed AS "Datensatz zuletzt geaendert",
  apflora.tpopmassn.changed_by AS "Datensatz zuletzt geaendert von"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte."MassnTypTxt";

CREATE OR REPLACE VIEW apflora.v_massn_webgisbun AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "APARTID",
  apflora.adb_eigenschaften."Artname" AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpop."TPopXKoord" AS "TPOP_X",
  apflora.tpop."TPopYKoord" AS "TPOP_Y",
  apflora.tpopmassn.id AS "MASSNGUID",
  apflora.tpopmassn.jahr AS "MASSNJAHR",
  -- need to convert date
  apflora.tpopmassn.datum AS "MASSNDAT",
  tpopmassn_typ_werte."MassnTypTxt" AS "MASSTYP",
  apflora.tpopmassn.beschreibung AS "MASSNMASSNAHME",
  apflora.adresse."AdrName" AS "MASSNBEARBEITER",
  apflora.tpopmassn.bemerkungen::char AS "MASSNBEMERKUNG",
  apflora.tpopmassn.plan_vorhanden AS "MASSNPLAN",
  apflora.tpopmassn.plan_bezeichnung AS "MASSPLANBEZ",
  apflora.tpopmassn.flaeche AS "MASSNFLAECHE",
  apflora.tpopmassn.form AS "MASSNFORMANSIEDL",
  apflora.tpopmassn.pflanzanordnung AS "MASSNPFLANZANORDNUNG",
  apflora.tpopmassn.markierung AS "MASSNMARKIERUNG",
  apflora.tpopmassn.anz_triebe AS "MASSNANZTRIEBE",
  apflora.tpopmassn.anz_pflanzen AS "MASSNANZPFLANZEN",
  apflora.tpopmassn.anz_pflanzstellen AS "MASSNANZPFLANZSTELLEN",
  apflora.tpopmassn.wirtspflanze AS "MASSNWIRTSPFLANZEN",
  apflora.tpopmassn.herkunft_pop AS "MASSNHERKUNFTSPOP",
  apflora.tpopmassn.sammeldatum AS "MASSNSAMMELDAT",
  -- need to convert date
  apflora.tpopmassn.changed AS "MASSNCHANGEDAT",
  apflora.tpopmassn.changed_by AS "MASSNCHANGEBY"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_write AS
SELECT
  apflora.tpopmassn.id AS "tpopmassnid",
  CAST(apflora.tpopmassn.id AS varchar(50)) AS "massnguid",
  apflora.tpopmassn.tpop_id AS "tpopid",
  apflora.tpopmassn.typ AS "tpopmassntyp",
  apflora.tpopmassn.jahr AS "massnjahr",
  apflora.tpopmassn.datum::timestamp AS "massndatum",
  apflora.tpopmassn.bearbeiter AS "tpopmassnbearb",
  apflora.tpopmassn.beschreibung AS "massnmassnahme",
  apflora.tpopmassn.plan_vorhanden AS "massnplanvorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "massnplanbezeichnung",
  apflora.tpopmassn.flaeche AS "massnflaeche",
  apflora.tpopmassn.form AS "massnformderansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "massnpflanzanordnung",
  apflora.tpopmassn.markierung AS "massnmarkierung",
  apflora.tpopmassn.anz_triebe AS "massnanztriebe",
  apflora.tpopmassn.anz_pflanzen AS "massnpflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "massnanzpflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "massnwirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "massnherkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "massnsammeldatum",
  apflora.tpopmassn.bemerkungen AS "tpopmassnbemtxt",
  apflora.tpopmassn.changed::timestamp AS "massnmutwann",
  apflora.tpopmassn.changed_by AS "massnmutwer"
FROM
  apflora.tpopmassn;

CREATE OR REPLACE VIEW apflora.v_massn_fuergis_read AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "apartid",
  apflora.adb_eigenschaften."Artname" AS "apart",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apstatus",
  apflora.ap."ApJahr" AS "apstartimjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apstandumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popstatus",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopXKoord" AS "popxkoordinaten",
  apflora.pop."PopYKoord" AS "popykoordinaten",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "tpopstatus",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopstatusunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopbegruendungfuerunklarenstatus",
  apflora.tpop."TPopXKoord" AS "tpopxkoordinaten",
  apflora.tpop."TPopYKoord" AS "tpopykoordinaten",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpophangneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschreibung",
  apflora.tpop."TPopKatNr" AS "tpopkatasternr",
  apflora.adresse."AdrName" AS "tpopverantwortlich",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopfuerapberichtrelevant",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopEigen" AS "tpopeigentuemerin",
  apflora.tpop."TPopKontakt" AS "tpopkontaktvorort",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  CAST(apflora.tpopmassn.id AS varchar(50)) AS "massnguid",
  apflora.tpopmassn.jahr AS "massnjahr",
  apflora.tpopmassn.datum::timestamp AS "massndatum",
  tpopmassn_typ_werte."MassnTypTxt" AS "massntyp",
  apflora.tpopmassn.beschreibung AS "massnmassnahme",
  apflora.adresse."AdrName" AS "massnbearbeiterin",
  apflora.tpopmassn.plan_vorhanden AS "massnplanvorhanden",
  apflora.tpopmassn.plan_bezeichnung AS "massnplanbezeichnung",
  apflora.tpopmassn.flaeche AS "massnflaeche",
  apflora.tpopmassn.form AS "massnformderansiedlung",
  apflora.tpopmassn.pflanzanordnung AS "massnpflanzanordnung",
  apflora.tpopmassn.markierung AS "massnmarkierung",
  apflora.tpopmassn.anz_triebe AS "massnanztriebe",
  apflora.tpopmassn.anz_pflanzen AS "massnpflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "massnanzpflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "massnwirtspflanze",
  apflora.tpopmassn.herkunft_pop AS "massnherkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "massnsammeldatum",
  apflora.tpopmassn.changed::timestamp AS "massnmutwann",
  apflora.tpopmassn.changed_by AS "massnmutwer"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_tpop_anzmassn;
CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.tpopmassn
          ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
        LEFT JOIN
          apflora.pop_status_werte AS "domPopHerkunft_1"
          ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1"."HerkunftTxt",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopHerkunftUnklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopRadius",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopExposition",
  apflora.tpop."TPopKlima",
  apflora.tpop."TPopNeigung",
  apflora.tpop."TPopBeschr",
  apflora.tpop."TPopKatNr",
  apflora.tpop."TPopApBerichtRelevant",
  apflora.tpop."TPopEigen",
  apflora.tpop."TPopKontakt",
  apflora.tpop."TPopNutzungszone",
  apflora.tpop."TPopBewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzmassn;
CREATE OR REPLACE VIEW apflora.v_pop_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  ((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassn;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt"
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn.tpop_id
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr >= apflora.ap."ApJahr"
GROUP BY
  apflora.tpopmassn.tpop_id;

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopmassnber."TPopMassnBerJahr"
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassnber."TPopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" BETWEEN 1 AND 5;

CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber AS
SELECT
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId",
  max(apflora.v_tpop_letztermassnber0."TPopMassnBerJahr") AS "MaxvonTPopMassnBerJahr"
FROM
  apflora.v_tpop_letztermassnber0
GROUP BY
  apflora.v_tpop_letztermassnber0."ApArtId",
  apflora.v_tpop_letztermassnber0."TPopId";

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerJahr"
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.popmassnber."PopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300;

CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber AS
SELECT
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId",
  max(apflora.v_pop_letztermassnber0."PopMassnBerJahr") AS "MaxvonPopMassnBerJahr"
FROM
  apflora.v_pop_letztermassnber0
GROUP BY
  apflora.v_pop_letztermassnber0."ApArtId",
  apflora.v_pop_letztermassnber0."PopId";

DROP VIEW IF EXISTS apflora.v_ap_tpopmassnjahr0;
CREATE OR REPLACE VIEW apflora.v_ap_tpopmassnjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_auswapbearbmassninjahr0;
CREATE OR REPLACE VIEW apflora.v_auswapbearbmassninjahr0 AS
SELECT
  apflora.adresse."AdrName",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte."MassnTypTxt" AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adresse."AdrName",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_ap_mitmassninjahr0;
CREATE OR REPLACE VIEW apflora.v_ap_mitmassninjahr0 AS
SELECT
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte."MassnTypTxt" AS typ,
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse."AdrName" AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopmassn_0;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan Bearbeitungsstand",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Jahr",
  tpopmassn_typ_werte."MassnTypTxt" AS "Massnahme",
  apflora.tpopmassn.beschreibung,
  apflora.tpopmassn.datum,
  apflora.adresse."AdrName" AS bearbeiter,
  apflora.tpopmassn.bemerkungen,
  apflora.tpopmassn.plan_vorhanden,
  apflora.tpopmassn.plan_bezeichnung,
  apflora.tpopmassn.flaeche,
  apflora.tpopmassn.markierung,
  apflora.tpopmassn.anz_triebe,
  apflora.tpopmassn.anz_pflanzen,
  apflora.tpopmassn.anz_pflanzstellen,
  apflora.tpopmassn.wirtspflanze,
  apflora.tpopmassn.herkunft_pop,
  apflora.tpopmassn.sammeldatum,
  apflora.tpopmassn.form,
  apflora.tpopmassn.pflanzanordnung
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_tpopmassn_fueraktap0;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Aktionsplan-Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte."HerkunftTxt" AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr" AS "Teilpopulation-Nr",
  apflora.tpop."TPopGemeinde" AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Höhe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1"."HerkunftTxt" AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte."DomainTxt" AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassn.id,
  tpopmassn_typ_werte."MassnTypTxt" AS "Massnahme-Typ",
  apflora.tpopmassn.beschreibung AS "Massnahme-Beschreibung",
  apflora.tpopmassn.datum AS "Massnahme-Datum",
  apflora.adresse."AdrName" AS "Massnahme-BearbeiterIn",
  apflora.tpopmassn.bemerkungen AS "Massnahme-Bemerkungen",
  apflora.tpopmassn.plan_vorhanden AS "Massnahme-Plan",
  apflora.tpopmassn.plan_bezeichnung AS "Massnahme-Planbezeichnung",
  apflora.tpopmassn.flaeche AS "Massnahme-Flaeche",
  apflora.tpopmassn.markierung AS "Massnahme-Markierung",
  apflora.tpopmassn.anz_triebe AS "Massnahme - Ansiedlung Anzahl Triebe",
  apflora.tpopmassn.anz_pflanzen AS "Massnahme - Ansiedlung Anzahl Pflanzen",
  apflora.tpopmassn.anz_pflanzstellen AS "Massnahme - Ansiedlung Anzahl Pflanzstellen",
  apflora.tpopmassn.wirtspflanze AS "Massnahme - Ansiedlung Wirtspflanzen",
  apflora.tpopmassn.herkunft_pop AS "Massnahme - Ansiedlung Herkunftspopulation",
  apflora.tpopmassn.sammeldatum AS "Massnahme - Ansiedlung Sammeldatum",
  apflora.tpopmassn.form AS "Massnahme - Ansiedlung Form",
  apflora.tpopmassn.pflanzanordnung AS "Massnahme - Ansiedlung Pflanzordnung"
FROM
  (apflora.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "domPopHerkunft_1"
        ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte."DomainCode")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_apber_c1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_c1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    (apflora.tpopmassn
    INNER JOIN
      apflora._variable
      ON apflora.tpopmassn.jahr = apflora._variable."JBerJahr")
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_c1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
  INNER JOIN
    apflora._variable
    ON apflora.tpopmassn.jahr = apflora._variable."JBerJahr"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme: ', apflora.tpopmassn.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (id): ', apflora.tpopmassn.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.bearbeiter IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Massnahme (Jahr): ', apflora.tpopmassn.jahr)]::text[] AS text,
  apflora.tpopmassn.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.typ IS NULL
  AND apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusaktuellletzterpopbererloschen AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (100, 200, 210, 300)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 3
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 3
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberstabil AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 2
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberstabil AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 2
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 1
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 1
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211, 300)
  AND lasttpopber."TPopBerEntwicklung" = 4
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since "TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberunsicher AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211, 300)
  AND lastpopber."PopBerEntwicklung" = 4
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung AS
WITH lastpopber AS (
  SELECT DISTINCT ON ("PopId")
    "PopId",
    "PopBerJahr",
    "PopBerEntwicklung"
  FROM
    apflora.popber
  WHERE
    "PopBerJahr" IS NOT NULL
  ORDER BY
    "PopId",
    "PopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN lastpopber
      ON apflora.pop."PopId" = lastpopber."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND lastpopber."PopBerEntwicklung" = 8
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber."PopBerJahr"
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber."PopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
WITH lasttpopber AS (
  SELECT DISTINCT ON ("TPopId")
    "TPopId",
    "TPopBerJahr",
    "TPopBerEntwicklung"
  FROM
    apflora.tpopber
  WHERE
    "TPopBerJahr" IS NOT NULL
  ORDER BY
    "TPopId",
    "TPopBerJahr" DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop."TPopId" = lasttpopber."TPopId"
      ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND lasttpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopId" IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop."TPopId"
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber."TPopBerJahr"
  );

DROP VIEW IF EXISTS apflora.v_ap_massnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_massnjahre AS
SELECT
  apflora.ap."ApArtId",
  apflora.v_massn_jahre.jahr
FROM
  apflora.ap,
  apflora.v_massn_jahre
WHERE
  apflora.ap."ApArtId" > 0
  AND apflora.ap."ApStatus" < 4
ORDER BY
  apflora.ap."ApArtId",
  apflora.v_massn_jahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr,
  COALESCE(apflora.v_ap_anzmassnprojahr0."AnzahlvonTPopMassnId", 0) AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  LEFT JOIN
    apflora.v_ap_anzmassnprojahr0
    ON
      (apflora.v_ap_massnjahre.jahr = apflora.v_ap_anzmassnprojahr0.jahr)
      AND (apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr0."ApArtId")
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_anzmassnbisjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnbisjahr AS
SELECT
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr,
  sum(apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen") AS "AnzahlMassnahmen"
FROM
  apflora.v_ap_massnjahre
  INNER JOIN
    apflora.v_ap_anzmassnprojahr
    ON apflora.v_ap_massnjahre."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId"
WHERE
  apflora.v_ap_anzmassnprojahr.jahr <= apflora.v_ap_massnjahre.jahr
GROUP BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr
ORDER BY
  apflora.v_ap_massnjahre."ApArtId",
  apflora.v_ap_massnjahre.jahr;

DROP VIEW IF EXISTS apflora.v_ap_apberundmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberundmassn AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP Verantwortlich",
  apflora.ap."ApArtwert" AS "Artwert",
  apflora.v_ap_anzmassnprojahr.jahr AS "Jahr",
  apflora.v_ap_anzmassnprojahr."AnzahlMassnahmen" AS "Anzahl Massnahmen",
  apflora.v_ap_anzmassnbisjahr."AnzahlMassnahmen" AS "Anzahl Massnahmen bisher",
  CASE
    WHEN apflora.apber."JBerJahr" > 0
    THEN 'Ja'
    ELSE 'Nein'
  END AS "Bericht erstellt"
FROM
  apflora.adb_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
      INNER JOIN
        (apflora.v_ap_anzmassnprojahr
        INNER JOIN
          (apflora.v_ap_anzmassnbisjahr
          LEFT JOIN
            apflora.apber
            ON
              (apflora.v_ap_anzmassnbisjahr.jahr = apflora.apber."JBerJahr")
              AND (apflora.v_ap_anzmassnbisjahr."ApArtId" = apflora.apber."ApArtId"))
          ON
            (apflora.v_ap_anzmassnprojahr.jahr = apflora.v_ap_anzmassnbisjahr.jahr)
            AND (apflora.v_ap_anzmassnprojahr."ApArtId" = apflora.v_ap_anzmassnbisjahr."ApArtId"))
        ON apflora.ap."ApArtId" = apflora.v_ap_anzmassnprojahr."ApArtId")
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.v_ap_anzmassnprojahr.jahr;

-- need to remove TPopMassnGuid_alt from apflora.v_massn before dropping
ALTER TABLE apflora.tpopmassn DROP COLUMN "TPopMassnGuid_alt";