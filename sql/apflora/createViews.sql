DROP VIEW IF EXISTS apflora.v_tpopbeob CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopbeob AS
SELECT
  apflora.tpopbeob.*,
  apflora.beob."ArtId" AS "ApArtId"
FROM
  apflora.tpopbeob
  INNER JOIN
    apflora.beob
    ON apflora.beob.id = apflora.tpopbeob.beob_id;

DROP VIEW IF EXISTS apflora.v_tpop_for_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_for_ap AS
SELECT
  apflora.tpop.*,
  -- when renaming ApArtId need to rename also in fetchTpopForAp.js
  apflora.ap."ApArtId" AS "ApArtId"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id;

DROP VIEW IF EXISTS apflora.v_tpopkoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkoord AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr,
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopXKoord" Is Not Null
  AND apflora.tpop."TPopYKoord" Is Not Null;

DROP VIEW IF EXISTS apflora.v_pop_berundmassnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berundmassnjahre AS
SELECT
  apflora.pop."PopId",
  apflora.popber.jahr AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id
UNION DISTINCT SELECT
  apflora.pop."PopId",
  apflora.popmassnber.jahr AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber.pop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr,
  count(apflora.tpopmassn.id) AS "AnzahlMassnahmen"
FROM
  apflora.popmassnber
  INNER JOIN
    (apflora.tpop
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.popmassnber.pop_id = apflora.tpop.pop_id
WHERE
  apflora.tpopmassn.jahr = apflora.popmassnber.jahr
  Or apflora.tpopmassn.jahr IS NULL
GROUP BY
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr
ORDER BY
  apflora.popmassnber.pop_id,
  apflora.popmassnber.jahr;

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

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr0 CASCADE;
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
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
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

DROP VIEW IF EXISTS apflora.v_ap_apberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberrelevant AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.ap."ApArtId";

-- wird von v_apber_injahr benutzt. Dieses Wiederum in Access:
DROP VIEW IF EXISTS apflora.v_erstemassnproap CASCADE;
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
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
GROUP BY
  apflora.ap."ApArtId";

DROP VIEW IF EXISTS apflora.v_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.familie AS "Familie",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
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
  tpopmassn_typ_werte.text AS "Massn Typ",
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
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_webgisbun AS
SELECT
  apflora.ae_eigenschaften.taxid AS "APARTID",
  apflora.ae_eigenschaften.artname AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop.id AS "TPOPGUID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop."TPopXKoord" AS "TPOP_X",
  apflora.tpop."TPopYKoord" AS "TPOP_Y",
  apflora.tpopmassn.id AS "MASSNGUID",
  apflora.tpopmassn.jahr AS "MASSNJAHR",
  -- need to convert date
  apflora.tpopmassn.datum AS "MASSNDAT",
  tpopmassn_typ_werte.text AS "MASSTYP",
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
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write CASCADE;
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

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_read AS
SELECT
  apflora.ae_eigenschaften.taxid AS "apartid",
  apflora.ae_eigenschaften.artname AS "apart",
  apflora.ap_bearbstand_werte.text AS "apstatus",
  apflora.ap."ApJahr" AS "apstartimjahr",
  apflora.ap_umsetzung_werte.text AS "apstandumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte.text AS "popstatus",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopXKoord" AS "popxkoordinaten",
  apflora.pop."PopYKoord" AS "popykoordinaten",
  CAST(apflora.tpop.id AS varchar(50)) AS "tpopid",
  apflora.tpop.nr AS "tpopnr",
  apflora.tpop.gemeinde AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1".text AS "tpopstatus",
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
  tpopmassn_typ_werte.text AS "massntyp",
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
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  apflora.tpopmassn.datum,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.familie AS "Familie",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS "TPop id",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
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
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.tpopmassn
          ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
        LEFT JOIN
          apflora.pop_status_werte AS "domPopHerkunft_1"
          ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.familie,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text,
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord",
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1".text,
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
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_pop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzmassn AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text,
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopkontr.id) AS "Anzahl Kontrollen"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text,
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  count(apflora.tpopmassn.id) AS "Anzahl Massnahmen"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  count(apflora.tpopkontr.id) AS "Anzahl Kontrollen"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_pop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      (apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnekoord AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_write AS
SELECT
  apflora.pop."PopId" AS "popid",
  apflora.pop."ApArtId" AS "apartid",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  apflora.pop."PopHerkunft" AS "popherkunft",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopXKoord" AS "popxkoord",
  apflora.pop."PopYKoord" AS "popykoord",
  apflora.pop."MutWann"::timestamp AS "mutwann",
  apflora.pop."MutWer" AS "mutwer"
FROM
  apflora.pop;

DROP VIEW IF EXISTS apflora.v_pop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_fuergis_read AS
SELECT
  apflora.ae_eigenschaften.taxid AS "apartid",
  apflora.ae_eigenschaften.artname AS "artname",
  apflora.ap_bearbstand_werte.text AS "apstatus",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte.text AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte.text AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  apflora.pop."PopXKoord" AS "popxkoord",
  apflora.pop."PopYKoord" AS "popykoord",
  apflora.pop."MutWann"::timestamp AS "mutwann",
  apflora.pop."MutWer" AS "mutwer"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code
WHERE
  apflora.pop."PopXKoord" > 0
  AND apflora.pop."PopYKoord" > 0
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.popber.id AS "PopBer Id",
  apflora.popber.jahr AS "PopBer Jahr",
  tpop_entwicklung_werte.text AS "PopBer Entwicklung",
  apflora.popber.bemerkungen AS "PopBer Bemerkungen",
  apflora.popber.changed AS "PopBer MutWann",
  apflora.popber.changed_by AS "PopBer MutWer"
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.popber.jahr,
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber.id AS "PopMassnBer Id",
  apflora.popmassnber.jahr AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber.bemerkungen AS "PopMassnBer Interpretation",
  apflora.popmassnber.changed AS "PopMassnBer MutWann",
  apflora.popmassnber.changed_by AS "PopMassnBer MutWer"
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_tpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.familie AS "Familie",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS "TPop ID",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
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
  apflora.tpop.changed AS "Teilpopulation zuletzt geaendert",
  apflora.tpop.changed AS "Teilpopulation zuletzt geaendert von"
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_webgisbun AS
SELECT
  apflora.ae_eigenschaften.taxid AS "APARTID",
  apflora.ae_eigenschaften.artname AS "APART",
  apflora.ap_bearbstand_werte.text AS "APSTATUS",
  apflora.ap."ApJahr" AS "APSTARTJAHR",
  apflora.ap_umsetzung_werte.text AS "APSTANDUMSETZUNG",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.pop."PopName" AS "POPNAME",
  pop_status_werte.text AS "POPSTATUS",
  apflora.pop."PopHerkunftUnklar" AS "POPSTATUSUNKLAR",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "POPUNKLARGRUND",
  apflora.pop."PopBekanntSeit" AS "POPBEKANNTSEIT",
  apflora.pop."PopXKoord" AS "POP_X",
  apflora.pop."PopYKoord" AS "POP_Y",
  apflora.tpop.id AS "TPOPID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpop.gemeinde AS "TPOPGEMEINDE",
  apflora.tpop."TPopFlurname" AS "TPOPFLURNAME",
  "domPopHerkunft_1".text AS "TPOPSTATUS",
  apflora.tpop."TPopHerkunftUnklar" AS "TPOPSTATUSUNKLAR",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPOPUNKLARGRUND",
  apflora.tpop."TPopXKoord" AS "TPOP_X",
  apflora.tpop."TPopYKoord" AS "TPOP_Y",
  apflora.tpop."TPopRadius" AS "TPOPRADIUS",
  apflora.tpop."TPopHoehe" AS "TPOPHOEHE",
  apflora.tpop."TPopExposition" AS "TPOPEXPOSITION",
  apflora.tpop."TPopKlima" AS "TPOPKLIMA",
  apflora.tpop."TPopNeigung" AS "TPOPHANGNEIGUNG",
  apflora.tpop."TPopBeschr" AS "TPOPBESCHREIBUNG",
  apflora.tpop."TPopKatNr" AS "TPOPKATASTERNR",
  apflora.adresse."AdrName" AS "TPOPVERANTWORTLICH",
  apflora.tpop."TPopApBerichtRelevant" AS "TPOPBERICHTSRELEVANZ",
  apflora.tpop."TPopBekanntSeit" AS "TPOPBEKANNTSEIT",
  apflora.tpop."TPopEigen" AS "TPOPEIGENTUEMERIN",
  apflora.tpop."TPopKontakt" AS "TPOPKONTAKT_VO",
  apflora.tpop."TPopNutzungszone" AS "TPOP_NUTZUNGSZONE",
  apflora.tpop."TPopBewirtschafterIn" AS "TPOPBEWIRTSCHAFTER",
  apflora.tpop."TPopBewirtschaftung" AS "TPOPBEWIRTSCHAFTUNG",
  -- TODO: convert
  apflora.tpop.changed AS "TPOPCHANGEDAT",
  apflora.tpop.changed AS "TPOPCHANGEBY"
FROM
  ((((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_write AS
SELECT
  apflora.tpop.pop_id AS "popid",
  CAST(apflora.tpop.id AS varchar(50)) AS "tpopid",
  apflora.tpop.nr AS "tpopnr",
  apflora.tpop.gemeinde AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  apflora.tpop."TPopHerkunft" AS "tpopherkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopherkunftunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopherkunftunklarbegruendung",
  apflora.tpop."TPopXKoord" AS "tpopxkoord",
  apflora.tpop."TPopYKoord" AS "tpopykoord",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpopneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschr",
  apflora.tpop."TPopKatNr" AS "tpopkatnr",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopapberichtrelevant",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopEigen" AS "tpopeigen",
  apflora.tpop."TPopKontakt" AS "tpopkontakt",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  apflora.tpop."TPopTxt" AS "tpoptxt",
  apflora.tpop.changed::timestamp AS "mutwann",
  apflora.tpop.changed AS "mutwer"
FROM
  apflora.tpop;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS "apartid",
  apflora.ae_eigenschaften.artname AS "artname",
  apflora.ap_bearbstand_werte.text AS "apherkunft",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte.text AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte.text AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  CAST(apflora.tpop.id AS varchar(50)) AS "tpopid",
  apflora.tpop.nr AS "tpopnr",
  apflora.tpop.gemeinde AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1".text AS "tpopherkunft",
  apflora.tpop."TPopBekanntSeit" AS "tpopbekanntseit",
  apflora.tpop."TPopHerkunftUnklar" AS "tpopherkunftunklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "tpopherkunftunklarbegruendung",
  apflora.tpop."TPopXKoord" AS "tpopxkoord",
  apflora.tpop."TPopYKoord" AS "tpopykoord",
  apflora.tpop."TPopRadius" AS "tpopradius",
  apflora.tpop."TPopHoehe" AS "tpophoehe",
  apflora.tpop."TPopExposition" AS "tpopexposition",
  apflora.tpop."TPopKlima" AS "tpopklima",
  apflora.tpop."TPopNeigung" AS "tpopneigung",
  apflora.tpop."TPopBeschr" AS "tpopbeschr",
  apflora.tpop."TPopKatNr" AS "tpopkatnr",
  apflora.tpop."TPopApBerichtRelevant" AS "tpopapberichtrelevant",
  apflora.tpop."TPopEigen" AS "tpopeigen",
  apflora.tpop."TPopKontakt" AS "tpopkontakt",
  apflora.tpop."TPopNutzungszone" AS "tpopnutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "tpopbewirtschafterin",
  apflora.tpop."TPopBewirtschaftung" AS "tpopbewirtschaftung",
  apflora.tpop.changed::timestamp AS "mutwann",
  apflora.tpop.changed AS "mutwer"
FROM
  (((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code
WHERE
  apflora.tpop."TPopYKoord" > 0
  AND apflora.tpop."TPopXKoord" > 0
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

-- im Gebrauch durch exportPopVonApOhneStatus.php:
DROP VIEW IF EXISTS apflora.v_pop_vonapohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_vonapohnestatus AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap."ApStatus" AS "Bearbeitungsstand AP",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop."PopHerkunft" AS "Status"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" = 3
  AND apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_apber_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_zielber AS
SELECT
  apflora.zielber.*
FROM
  apflora.zielber
  INNER JOIN
    apflora._variable
    ON apflora.zielber.jahr = apflora._variable.apber_jahr;

DROP VIEW IF EXISTS apflora.v_abper_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte.text
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel.typ = ziel_typ_werte.code)
    ON apflora._variable.apber_jahr = apflora.ziel.jahr
WHERE
  apflora.ziel.typ IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel_typ_werte.sort,
  apflora.ziel.bezeichnung;

DROP VIEW IF EXISTS apflora.v_apber_artd CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_artd AS
SELECT
  apflora.ap.*,
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  apflora.adresse."AdrName" AS bearbeiter_decodiert,
  ap_erfkrit_werte.text
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber.bearbeiter = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON apflora.apber.beurteilung = apflora.ap_erfkrit_werte.code)
    INNER JOIN
      apflora._variable
      ON apflora.apber.jahr = apflora._variable.apber_jahr)
    ON apflora.ap."ApArtId" = apflora.apber.ap_id;

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn.tpop_id
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr >= apflora.ap."ApJahr"
GROUP BY
  apflora.tpopmassn.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.apber.*,
  apflora.ap_erfkrit_werte.text AS beurteilung_decodiert,
  apflora.adresse."AdrName" AS bearbeiter_decodiert
FROM
  apflora.ap
  INNER JOIN
    apflora.ae_eigenschaften
    ON (apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    ((apflora.apber
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON (apflora.apber.beurteilung = apflora.ap_erfkrit_werte.code))
    LEFT JOIN
      apflora.adresse
      ON (apflora.apber.bearbeiter = apflora.adresse."AdrId"))
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_tpop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id,
  apflora.tpopmassnber.jahr
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassnber.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable.apber_jahr
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpopmassnber.beurteilung BETWEEN 1 AND 5;

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id,
  apflora.tpopber.jahr AS tpopber_jahr
FROM
  apflora._variable,
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop.id = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

DROP VIEW IF EXISTS apflora.v_pop_letztermassnber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letztermassnber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber.jahr
FROM
  apflora._variable,
  ((apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
WHERE
  apflora.popmassnber.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn.jahr <= apflora._variable.apber_jahr
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0_overall AS
SELECT
  apflora.popber.pop_id,
  max(apflora.popber.jahr) AS jahr
FROM
  apflora.popber
WHERE
  apflora.popber.jahr IS NOT NULL
GROUP BY
  apflora.popber.pop_id;

DROP VIEW IF EXISTS apflora.v_pop_letzterpopbermassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopbermassn AS
SELECT
  apflora.popmassnber.pop_id AS "PopId",
  max(apflora.popmassnber.jahr) AS jahr
FROM
  apflora.popmassnber
WHERE
  apflora.popmassnber.jahr IS NOT NULL
GROUP BY
  apflora.popmassnber.pop_id;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  tpop_id,
  max(jahr) AS tpopber_jahr
FROM
  apflora.tpopber
WHERE
  jahr IS NOT NULL
GROUP BY
  tpop_id;

DROP VIEW IF EXISTS apflora.v_tpop_mitapaberohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_mitapaberohnestatus AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text AS "Status Population",
  apflora.tpop.nr,
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft" AS "Status Teilpopulation"
FROM
  (apflora.ap_bearbstand_werte
  INNER JOIN
    (apflora.ae_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    ON apflora.ap_bearbstand_werte.code = apflora.ap."ApStatus")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte.code)
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
  AND apflora.ap."ApStatus" = 3
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnebekanntseit AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopBekanntSeit"
FROM
  ((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnekoord AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  ((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (apflora.tpop."TPopXKoord" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3)
  OR (
    apflora.tpop."TPopYKoord" IS NULL
    AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  )
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpopber.tpop_id,
  max(apflora.tpopber.jahr) AS jahr
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_ap_ausw CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte.text AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.ap."MutWann" AS "Letzte Aenderung",
  apflora.ap."MutWer" AS "Letzte(r) Bearbeiter(in)"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_idealbiotop CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)",
  apflora.idealbiotop.ap_id AS "Ib ApArtId",
  apflora.idealbiotop.erstelldatum AS "Ib Erstelldatum",
  apflora.idealbiotop.hoehenlage AS "Ib Hoehenlage",
  apflora.idealbiotop.region AS "Ib Region",
  apflora.idealbiotop.exposition AS "Ib Exposition",
  apflora.idealbiotop.besonnung AS "Ib Besonnung",
  apflora.idealbiotop.hangneigung AS "Ib Hangneigung",
  apflora.idealbiotop.boden_typ AS "Ib Bodentyp",
  apflora.idealbiotop.boden_kalkgehalt AS "Ib Boden Kalkgehalt",
  apflora.idealbiotop.boden_durchlaessigkeit AS "Ib Boden Durchlaessigkeit",
  apflora.idealbiotop.boden_humus AS "Ib Boden Humus",
  apflora.idealbiotop.boden_naehrstoffgehalt AS "Ib Boden Naehrstoffgehalt",
  apflora.idealbiotop.wasserhaushalt AS "Ib Wasserhaushalt",
  apflora.idealbiotop.konkurrenz AS "Ib Konkurrenz",
  apflora.idealbiotop.moosschicht AS "Ib Moosschicht",
  apflora.idealbiotop.krautschicht AS "Ib Krautschicht",
  apflora.idealbiotop.strauchschicht AS "Ib Strauchschicht",
  apflora.idealbiotop.baumschicht AS "Ib Baumschicht",
  apflora.idealbiotop.bemerkungen AS "Ib Bemerkungen",
  apflora.idealbiotop.changed AS "Ib MutWann",
  apflora.idealbiotop.changed_by AS "Ib MutWer"
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((apflora.ae_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop.ap_id = apflora.ap."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.idealbiotop.erstelldatum;

DROP VIEW IF EXISTS apflora.v_ber CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ber.id AS "Ber Id",
  apflora.ber.ap_id AS "Ber ApId",
  apflora.ber.autor AS "Ber Autor",
  apflora.ber.jahr AS "Ber Jahr",
  apflora.ber.titel AS "Ber Titel",
  apflora.ber.url AS "Ber URL",
  apflora.ber.changed AS "Ber MutWann",
  apflora.ber.changed_by AS "Ber MutWer"
FROM
  ((((apflora.ae_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber.ap_id
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_assozart CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.assozart.id AS "AA Id",
  "ArtenDb_Arteigenschaften_1".artname AS "AA Art",
  apflora.assozart.bemerkungen AS "AA Bemerkungen",
  apflora.assozart.changed AS "AA MutWann",
  apflora.assozart.changed_by AS "AA MutWer"
FROM
  apflora.ae_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.ae_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1".id = apflora.assozart.ae_id
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap_ohnepop CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ohnepop AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte.text AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.pop."ApArtId" AS "Population"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."ApArtId" IS NULL
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_erfkrit CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfkrit AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.erfkrit.id AS "ErfKrit Id",
  apflora.erfkrit.id AS "ErfKrit ApId",
  ap_erfkrit_werte.text AS "ErfKrit Beurteilung",
  apflora.erfkrit.kriterien AS "ErfKrit Kriterien",
  apflora.erfkrit.changed AS "ErfKrit MutWann",
  apflora.erfkrit.changed_by AS "ErfKrit MutWer"
FROM
  (((((apflora.ae_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id)
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit.erfolg = ap_erfkrit_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap_tpopmassnjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_tpopmassnjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_auswapbearbmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswapbearbmassninjahr0 AS
SELECT
  apflora.adresse."AdrName",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde as tpop_gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
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
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adresse."AdrName",
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_ap_mitmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_mitmassninjahr0 AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde tpop_gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text AS typ,
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
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte.text AS "Aktionsplan-Umsetzung",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte.text AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop.nr AS "Teilpopulation-Nr",
  apflora.tpop.gemeinde AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Hoehe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1".text AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte.text AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassnber.jahr AS "Massnahmenbericht-Jahr",
  tpopmassn_erfbeurt_werte.text AS "Massnahmenbericht-Erfolgsberuteilung",
  apflora.tpopmassnber.bemerkungen AS "Massnahmenbericht-Interpretation"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte.code)
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte.code)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      (apflora.tpopmassnber
      INNER JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
      ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_tpopmassn_0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Aktionsplan Bearbeitungsstand",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn.id,
  apflora.tpopmassn.jahr AS "Jahr",
  tpopmassn_typ_werte.text AS "Massnahme",
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
  ((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.jahr,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_tpopmassn_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte.text AS "Aktionsplan-Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte.text AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS "Teilpopulation-Nr",
  apflora.tpop.gemeinde AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Höhe",
  apflora.tpop."TPopBeschr" AS "Teilpopulation-Beschreibung",
  apflora.tpop."TPopKatNr" AS "Teilpopulation-Kataster-Nr",
  "domPopHerkunft_1".text AS "Teilpopulation-Herkunft",
  apflora.tpop."TPopHerkunftUnklar" AS "Teilpopulation - Herkunft unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "Teilpopulation - Herkunft unklar Begruendung",
  apflora.tpop_apberrelevant_werte.text AS "Teilpopulation - Fuer Bericht relevant",
  apflora.tpop."TPopBekanntSeit" AS "Teilpopulation - bekannt seit",
  apflora.tpop."TPopEigen" AS "Teilpopulation-Eigentuemer",
  apflora.tpop."TPopKontakt" AS "Teilpopulation-Kontakt",
  apflora.tpop."TPopNutzungszone" AS "Teilpopulation-Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "Teilpopulation-Bewirtschafter",
  apflora.tpop."TPopBewirtschaftung" AS "Teilpopulation-Bewirtschaftung",
  apflora.tpop."TPopTxt" AS "Teilpopulation-Bemerkungen",
  apflora.tpopmassn.id,
  tpopmassn_typ_werte.text AS "Massnahme-Typ",
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
  (apflora.ae_eigenschaften
  INNER JOIN
    ((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte.code)
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "domPopHerkunft_1"
        ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code)
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte.code)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_apber_b1rpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.popber.jahr <= apflora._variable.apber_jahr
  AND apflora.popber.entwicklung in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id
FROM
  apflora._variable,
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpopber.jahr <= apflora._variable.apber_jahr
  AND apflora.tpopber.entwicklung in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_c1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
WHERE
  apflora.tpopmassn.jahr <= apflora._variable.apber_jahr
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a3lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND (
    apflora.pop."PopBekanntSeit" < apflora.ap."ApJahr"
    OR apflora.pop."PopBekanntSeit" IS Null
    OR apflora.ap."ApJahr" IS NULL
  )
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a4lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a4lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a5lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a5lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a10lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a10lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.pop."PopHerkunft" = 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a8lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a8lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  (
    apflora.pop."PopHerkunft" = 101
    OR (
      apflora.pop."PopHerkunft" = 211
      AND (
        apflora.pop."PopBekanntSeit" < apflora.ap."ApJahr"
        OR apflora.pop."PopBekanntSeit" IS NULL
        OR apflora.ap."ApJahr" IS NULL
      )
    )
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a9lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a9lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apbera1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apbera1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" IS NOT NULL
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" IS NOT NULL
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND (
    apflora.tpop."TPopBekanntSeit" < apflora.ap."ApJahr"
    OR apflora.tpop."TPopBekanntSeit" IS NULL
    OR apflora.ap."ApJahr" IS NULL
  )
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a10ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a10ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopHerkunft" = 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a8ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a8ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND (
    apflora.tpop."TPopHerkunft" = 101
    OR (
      apflora.tpop."TPopHerkunft" = 211
      AND (
        apflora.tpop."TPopBekanntSeit" < apflora.ap."ApJahr"
        OR apflora.tpop."TPopBekanntSeit" IS NULL
        OR apflora.ap."ApJahr" IS NULL
      )
    )
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_a9ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a9ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b2lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b3lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b4lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b5lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b6lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      apflora._variable
      ON apflora.popber.jahr = apflora._variable.apber_jahr)
    ON apflora.pop."PopId" = apflora.popber.pop_id)
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b7lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b7lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b1ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopber.entwicklung = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopber.entwicklung = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopber.entwicklung = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopber.entwicklung = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b6ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber.jahr = apflora._variable.apber_jahr)
      ON apflora.tpop.id = apflora.tpopber.tpop_id)
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpopber.entwicklung = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_b7ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b7ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop.id
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_apber_c1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_c1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    (apflora.tpopmassn
    INNER JOIN
      apflora._variable
      ON apflora.tpopmassn.jahr = apflora._variable.apber_jahr)
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id
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
  apflora.tpop.id
FROM
  ((apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id)
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
  INNER JOIN
    apflora._variable
    ON apflora.tpopmassn.jahr = apflora._variable.apber_jahr
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.id,
  apflora.ae_eigenschaften.artname AS "Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text AS "PopHerkunft",
  apflora.popber.jahr AS "PopBerJahr",
  tpop_entwicklung_werte.text AS "PopBerEntwicklung",
  apflora.popber.bemerkungen AS "PopBerTxt"
FROM
  ((apflora.ae_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber.pop_id)
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code;

DROP VIEW IF EXISTS apflora.v_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.ap_id AS "Ziel ApId",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte.text AS "Ziel Typ",
  apflora.ziel.bezeichnung AS "Ziel Beschreibung"
FROM
  (((((apflora.ae_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte.code
WHERE
  apflora.ziel.typ IN (1, 2, 1170775556)
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.ziel.jahr,
  ziel_typ_werte.text,
  apflora.ziel.typ;

DROP VIEW IF EXISTS apflora.v_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel.id AS "Ziel Id",
  apflora.ziel.jahr AS "Ziel Jahr",
  ziel_typ_werte.text AS "Ziel Typ",
  apflora.ziel.bezeichnung AS "Ziel Beschreibung",
  apflora.zielber.id AS "ZielBer Id",
  apflora.zielber.id AS "ZielBer ZielId",
  apflora.zielber.jahr AS "ZielBer Jahr",
  apflora.zielber.erreichung AS "ZielBer Erreichung",
  apflora.zielber.bemerkungen AS "ZielBer Bemerkungen",
  apflora.zielber.changed AS "ZielBer MutWann",
  apflora.zielber.changed_by AS "ZielBer MutWer"
FROM
  ((((((apflora.ae_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id)
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel.typ = ziel_typ_werte.code)
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel.id = apflora.zielber.ziel_id
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.ziel.jahr,
  ziel_typ_werte.text,
  apflora.ziel.typ,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_bertpopfuerangezeigteap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_bertpopfuerangezeigteap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id AS tpop_id,
  apflora.ae_eigenschaften.artname AS "Artname",
  apflora.ap_bearbstand_werte.text AS "ApStatus",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text AS "ApUmsetzung",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text AS "PopHerkunft",
  apflora.pop."PopBekanntSeit",
  apflora.tpop.nr AS tpop_nr,
  apflora.tpop.gemeinde as tpop_gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopBekanntSeit",
  "domPopHerkunft_1".text AS "TPopHerkunft",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1".code;

DROP VIEW IF EXISTS apflora.v_tpopkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.familie AS "Familie",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte.text AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop.id AS "TPop ID",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
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
  apflora.tpopkontr.id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id AS "Kontr id",
  apflora.tpopkontr.jahr AS "Kontr Jahr",
  apflora.tpopkontr.datum AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr.ueberlebensrate AS "Kontr Ueberlebensrate",
  apflora.tpopkontr.vitalitaet AS "Kontr Vitalitaet",
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
  apflora.tpopkontr.ursachen AS "Kontr Ursachen",
  apflora.tpopkontr.erfolgsbeurteilung AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr.umsetzung_aendern AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr.kontrolle_aendern AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr.bemerkungen AS "Kontr Bemerkungen",
  apflora.tpopkontr.lr_delarze AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr.lr_umgebung_delarze AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr.vegetationstyp AS "Kontr Vegetationstyp",
  apflora.tpopkontr.konkurrenz AS "Kontr Konkurrenz",
  apflora.tpopkontr.moosschicht AS "Kontr Moosschicht",
  apflora.tpopkontr.krautschicht AS "Kontr Krautschicht",
  apflora.tpopkontr.strauchschicht AS "Kontr Strauchschicht",
  apflora.tpopkontr.baumschicht AS "Kontr Baumschicht",
  apflora.tpopkontr.boden_typ AS "Kontr Bodentyp",
  apflora.tpopkontr.boden_kalkgehalt AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr.boden_durchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr.boden_humus AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr.boden_abtrag AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr.wasserhaushalt AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr.handlungsbedarf AS "Kontr Handlungsbedarf",
  apflora.tpopkontr.flaeche_ueberprueft AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr.flaeche AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr.plan_vorhanden AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr.deckung_vegetation AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr.deckung_nackter_boden AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr.deckung_ap_art AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr.vegetationshoehe_maximum AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr.vegetationshoehe_mittel AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr.gefaehrdung AS "Kontr Gefaehrdung",
  apflora.tpopkontr.changed AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr.changed_by AS "Kontrolle zuletzt geaendert von",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "Zaehlungen Anzahlen",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "Zaehlungen Einheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "Zaehlungen Methoden"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.ae_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1".code = apflora.tpop."TPopHerkunft"
WHERE
  apflora.ae_eigenschaften.taxid > 150
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.familie,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  "tblAdresse_1"."AdrName",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte.text,
  apflora.pop."PopBekanntSeit",
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1".text,
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
  apflora.tpop."TPopBewirtschaftung",
  apflora.tpopkontr.id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.ae_eigenschaften.taxid AS "APARTID",
  apflora.ae_eigenschaften.artname AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop.id AS "TPOPID",
  apflora.tpop.nr AS "TPOPNR",
  apflora.tpopkontr.id AS "KONTRGUID",
  apflora.tpopkontr.jahr AS "KONTRJAHR",
  --TODO: convert?
  apflora.tpopkontr.datum AS "KONTRDAT",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "KONTRTYP",
  apflora.adresse."AdrName" AS "KONTRBEARBEITER",
  apflora.tpopkontr.ueberlebensrate AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr.vitalitaet AS "KONTRVITALITAET",
  apflora.tpop_entwicklung_werte.text AS "KONTRENTWICKLUNG",
  apflora.tpopkontr.ursachen AS "KONTRURSACHEN",
  apflora.tpopkontr.erfolgsbeurteilung AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr.umsetzung_aendern AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr.kontrolle_aendern AS "KONTRAENDKONTROLLE",
  apflora.tpop."TPopXKoord" AS "KONTR_X",
  apflora.tpop."TPopYKoord" AS "KONTR_Y",
  apflora.tpopkontr.bemerkungen AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr.lr_delarze AS "KONTRLRMDELARZE",
  apflora.tpopkontr.lr_umgebung_delarze AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr.vegetationstyp AS "KONTRVEGTYP",
  apflora.tpopkontr.konkurrenz AS "KONTRKONKURRENZ",
  apflora.tpopkontr.moosschicht AS "KONTRMOOSE",
  apflora.tpopkontr.krautschicht AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr.strauchschicht AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr.baumschicht AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr.boden_typ AS "KONTRBODENTYP",
  apflora.tpopkontr.boden_kalkgehalt AS "KONTRBODENKALK",
  apflora.tpopkontr.boden_durchlaessigkeit AS "KONTRBODENDURCHLAESSIGK",
  apflora.tpopkontr.boden_humus AS "KONTRBODENHUMUS",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "KONTRBODENNAEHRSTOFF",
  apflora.tpopkontr.boden_abtrag AS "KONTROBERBODENABTRAG",
  apflora.tpopkontr.wasserhaushalt AS "KONTROBODENWASSERHAUSHALT",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr.handlungsbedarf AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr.flaeche_ueberprueft AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr.flaeche AS "KONTRFLAECHETPOP",
  apflora.tpopkontr.plan_vorhanden AS "KONTRAUFPLAN",
  apflora.tpopkontr.deckung_vegetation AS "KONTRDECKUNGVEG",
  apflora.tpopkontr.deckung_nackter_boden AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr.deckung_ap_art AS "KONTRDECKUNGART",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr.vegetationshoehe_maximum AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr.vegetationshoehe_mittel AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr.gefaehrdung AS "KONTRGEFAEHRDUNG",
  -- TODO: convert
  apflora.tpopkontr.changed AS "KONTRCHANGEDAT",
  apflora.tpopkontr.changed_by AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.ae_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1".code = apflora.tpop."TPopHerkunft"
WHERE
  apflora.ae_eigenschaften.taxid > 150
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_letztesjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letztesjahr AS
SELECT
  apflora.tpop.id,
  max(apflora.tpopkontr.jahr) AS "MaxTPopKontrJahr",
  count(apflora.tpopkontr.id) AS "AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.tpopkontr
    ON apflora.tpop.id = apflora.tpopkontr.tpop_id
WHERE
  (
    apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopkontr.jahr IS NOT NULL
  )
  OR (
    apflora.tpopkontr.typ IS NULL
    AND apflora.tpopkontr.jahr IS NULL
  )
GROUP BY
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letzteid AS
SELECT
  apflora.v_tpopkontr_letztesjahr.id,
  max(apflora.tpopkontr.id::text) AS "MaxTPopKontrId",
  max(apflora.v_tpopkontr_letztesjahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_letztesjahr
    ON
      (apflora.v_tpopkontr_letztesjahr."MaxTPopKontrJahr" = apflora.tpopkontr.jahr)
      AND (apflora.tpopkontr.tpop_id = apflora.v_tpopkontr_letztesjahr.id)
GROUP BY
  apflora.v_tpopkontr_letztesjahr.id;

DROP VIEW IF EXISTS apflora.v_tpop_letzteKontrId CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letzteKontrId AS
SELECT
  apflora.tpop.id,
  apflora.v_tpopkontr_letzteid."MaxTPopKontrId",
  apflora.v_tpopkontr_letzteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_letzteid
    ON apflora.tpop.id = apflora.v_tpopkontr_letzteid.id;

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr.tpop_id,
  (
    select id
    from apflora.tpopber
    where tpop_id = apflora.tpopkontr.tpop_id
    order by changed desc
    limit 1
  ) AS "MaxTPopBerId",
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr",
  count(apflora.tpopber.id) AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr.tpop_id = apflora.tpopber.tpop_id
WHERE
  apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr.tpop_id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.typ,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum::timestamp,
  apflora.tpopkontr.bearbeiter,
  apflora.tpopkontr.jungpflanzen_anzahl,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.entwicklung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr.idealbiotop_uebereinstimmung,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.changed::timestamp,
  apflora.tpopkontr.changed_by
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS apartid,
  apflora.ae_eigenschaften.artname AS artname,
  apflora.ap_bearbstand_werte.text AS apherkunft,
  apflora.ap."ApJahr" AS apjahr,
  apflora.ap_umsetzung_werte.text AS apumsetzung,
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS popguid,
  apflora.pop."PopNr" AS popnr,
  apflora.pop."PopName" AS popname,
  apflora.pop_status_werte.text AS popherkunft,
  apflora.pop."PopBekanntSeit" AS popbekanntseit,
  CAST(apflora.tpop.id AS varchar(50)) AS tpopid,
  apflora.tpop.nr AS tpopnr,
  apflora.tpop.gemeinde AS tpopgemeinde,
  apflora.tpop."TPopFlurname" AS tpopflurname,
  apflora.tpop."TPopXKoord" AS tpopxkoord,
  apflora.tpop."TPopYKoord" AS tpopykoord,
  apflora.tpop."TPopBekanntSeit" AS tpopbekanntseit,
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.jahr AS tpopkontrjahr,
  apflora.tpopkontr.datum::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte."DomainTxt" AS tpopkontrtyp,
  apflora.adresse."AdrName" AS tpopkontrbearb,
  apflora.tpopkontr.ueberlebensrate AS tpopkontrueberleb,
  apflora.tpopkontr.vitalitaet AS tpopkontrvitalitaet,
  apflora.tpop_entwicklung_werte.text AS tpopkontrentwicklung,
  apflora.tpopkontr.ursachen AS tpopkontrursach,
  apflora.tpopkontr.erfolgsbeurteilung AS tpopkontrurteil,
  apflora.tpopkontr.umsetzung_aendern AS tpopkontraendums,
  apflora.tpopkontr.kontrolle_aendern AS tpopkontraendkontr,
  apflora.tpopkontr.lr_delarze AS tpopkontrleb,
  apflora.tpopkontr.flaeche AS tpopkontrflaeche,
  apflora.tpopkontr.lr_umgebung_delarze AS tpopkontrlebumg,
  apflora.tpopkontr.vegetationstyp AS tpopkontrvegtyp,
  apflora.tpopkontr.konkurrenz AS tpopkontrkonkurrenz,
  apflora.tpopkontr.moosschicht AS tpopkontrmoosschicht,
  apflora.tpopkontr.krautschicht AS tpopkontrkrautschicht,
  apflora.tpopkontr.strauchschicht AS tpopkontrstrauchschicht,
  apflora.tpopkontr.baumschicht AS tpopkontrbaumschicht,
  apflora.tpopkontr.boden_typ AS tpopkontrbodentyp,
  apflora.tpopkontr.boden_kalkgehalt AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr.boden_humus AS tpopkontrbodenhumus,
  apflora.tpopkontr.boden_naehrstoffgehalt AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag AS tpopkontrbodenabtrag,
  apflora.tpopkontr.wasserhaushalt AS tpopkontrwasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr.flaeche_ueberprueft AS tpopkontruebflaeche,
  apflora.tpopkontr.plan_vorhanden AS tpopkontrplan,
  apflora.tpopkontr.deckung_vegetation AS tpopkontrveg,
  apflora.tpopkontr.deckung_nackter_boden AS tpopkontrnabo,
  apflora.tpopkontr.deckung_ap_art AS tpopkontruebpfl,
  apflora.tpopkontr.jungpflanzen_vorhanden AS tpopkontrjungpfljn,
  apflora.tpopkontr.vegetationshoehe_maximum AS tpopkontrveghoemax,
  apflora.tpopkontr.vegetationshoehe_mittel AS tpopkontrveghoemit,
  apflora.tpopkontr.gefaehrdung AS tpopkontrgefaehrdung,
  apflora.tpopkontr.changed::timestamp AS mutwann,
  apflora.tpopkontr.changed_by AS mutwer
FROM
  (((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.ae_eigenschaften.artname AS "Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.beob."X",
  apflora.beob."Y",
  CASE
    WHEN
      apflora.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND apflora.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((apflora.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((apflora.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  apflora.beob."Datum",
  apflora.beob."Autor",
  apflora.tpopbeob.nicht_zuordnen,
  apflora.tpopbeob.bemerkungen,
  apflora.tpopbeob.changed,
  apflora.tpopbeob.changed_by
FROM
  ((((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = apflora.beob."ArtId")
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.beob."ArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop.id = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.ae_eigenschaften.artname ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop.nr ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_beob__mit_data CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob__mit_data AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.ae_eigenschaften.artname AS "Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.beob."X",
  apflora.beob."Y",
  CASE
    WHEN
      apflora.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND apflora.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((apflora.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((apflora.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  apflora.beob."Datum",
  apflora.beob."Autor",
  apflora.tpopbeob.nicht_zuordnen,
  apflora.tpopbeob.bemerkungen,
  apflora.tpopbeob.changed,
  apflora.tpopbeob.changed_by,
  apflora.beob.data AS "Originaldaten"
FROM
  ((((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = apflora.beob."ArtId")
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.beob."ArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop.id = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.ae_eigenschaften.artname ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop.nr ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr.id,
  max(apflora.tpopkontrzaehl.anzahl) AS anzahl
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
GROUP BY
  apflora.tpopkontr.id
ORDER BY
  apflora.tpopkontr.id;

-- v_exportevab_beob is in viewsGenerieren2 because dependant on v_tpopkontr_maxanzahl

DROP VIEW IF EXISTS apflora.v_exportevab_projekt CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  apflora.ap."ApGuid" AS "idProjekt",
  concat('AP Flora ZH: ', apflora.ae_eigenschaften.artname) AS "Name",
  CASE
    WHEN apflora.ap."ApJahr" IS NOT NULL
    THEN concat('01.01.', apflora.ap."ApJahr")
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  concat(
    'Aktionsplan: ',
    apflora.ap_bearbstand_werte.text,
    CASE
      WHEN apflora.ap."ApJahr" IS NOT NULL
      THEN concat('; Start im Jahr: ', apflora.ap."ApJahr")
      ELSE ''
    END,
    CASE
      WHEN apflora.ap."ApUmsetzung" IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte.text)
      ELSE ''
    END,
    ''
  ) AS "Bemerkungen"
FROM
  (((apflora.ap
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
GROUP BY
  apflora.ae_eigenschaften.artname,
  apflora.ap."ApGuid",
  apflora.ap."ApJahr",
  apflora.ap."ApUmsetzung",
  apflora.ap_bearbstand_werte.text,
  apflora.ap_umsetzung_werte.text;

DROP VIEW IF EXISTS apflora.v_exportevab_raum CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_raum AS
SELECT
  apflora.ap."ApGuid" AS "fkProjekt",
  apflora.pop."PopGuid" AS "idRaum",
  concat(
    apflora.pop."PopName",
    CASE
      WHEN apflora.pop."PopNr" IS NOT NULL
      THEN concat(' (Nr. ', apflora.pop."PopNr", ')')
      ELSE ''
    END
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  CASE
    WHEN apflora.pop."PopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "popHerkunft".text,
        CASE
          WHEN apflora.pop."PopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.pop."PopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft".code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  -- ensure all idProjekt are contained in higher level
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
GROUP BY
  apflora.ap."ApGuid",
  apflora.pop."PopGuid",
  apflora.pop."PopName",
  apflora.pop."PopNr",
  apflora.pop."PopHerkunft",
  "popHerkunft".text,
  apflora.pop."PopBekanntSeit";

DROP VIEW IF EXISTS apflora.v_exportevab_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  apflora.tpop.id AS "TPopGuid",
  apflora.pop."PopGuid" AS "fkRaum",
  apflora.tpop.id AS "idOrt",
  substring(
    concat(
      apflora.tpop."TPopFlurname",
      CASE
        WHEN apflora.tpop.nr IS NOT NULL
        THEN concat(' (Nr. ', apflora.tpop.nr, ')')
        ELSE ''
      END
    ) from 1 for 40
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  substring(max(apflora.evab_typologie."TYPO") from 1 for 9)::varchar(10) AS "fkLebensraumtyp",
  1 AS "fkGenauigkeitLage",
  1 AS "fkGeometryType",
  CASE
    WHEN apflora.tpop."TPopHoehe" IS NOT NULL
    THEN apflora.tpop."TPopHoehe"
    ELSE 0
  END AS "obergrenzeHoehe",
  4 AS "fkGenauigkeitHoehe",
  apflora.tpop."TPopXKoord" AS "X",
  apflora.tpop."TPopYKoord" AS "Y",
  substring(apflora.tpop.gemeinde from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop."TPopFlurname" from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr.lr_umgebung_delarze) AS "ENV",
  CASE
    WHEN apflora.tpop."TPopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        apflora.pop_status_werte.text,
        CASE
          WHEN apflora.tpop."TPopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.tpop."TPopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.tpop."TPopHerkunft" = apflora.pop_status_werte.code)
      INNER JOIN
        (((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr.lr_delarze = apflora.evab_typologie."TYPO")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
GROUP BY
  apflora.pop."PopGuid",
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  apflora.pop_status_werte.text,
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_exportevab_zeit CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_zeit AS
SELECT
  apflora.tpop.id AS "fkOrt",
  apflora.tpopkontr.zeit_id AS "idZeitpunkt",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN to_char(apflora.tpopkontr.datum, 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        apflora.tpopkontr.jahr
      )
  END AS "Datum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'T'::varchar(10)
    ELSE 'J'::varchar(10)
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'P'::varchar(10)
    ELSE 'X'::varchar(10)
  END AS "fkGenauigkeitDatumZDSF",
  substring(apflora.tpopkontr.moosschicht from 1 for 10) AS "COUV_MOUSSES",
  substring(apflora.tpopkontr.krautschicht from 1 for 10) AS "COUV_HERBACEES",
  substring(apflora.tpopkontr.strauchschicht from 1 for 10) AS "COUV_BUISSONS",
  substring(apflora.tpopkontr.baumschicht from 1 for 10) AS "COUV_ARBRES"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "tpopHerkunft"
        ON apflora.tpop."TPopHerkunft" = "tpopHerkunft".code)
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop.id IN (SELECT "idOrt" FROM apflora.v_exportevab_ort);

DROP VIEW IF EXISTS apflora.v_tpopmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS "TPop ID",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft".text AS "TPop Status",
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
  apflora.tpopmassnber.id AS "TPopMassnBer Id",
  apflora.tpopmassnber.jahr AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber.bemerkungen AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber.changed AS "TPopMassnBer MutWann",
  apflora.tpopmassnber.changed_by AS "TPopMassnBer MutWer"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft".code)
        INNER JOIN
          (apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
          ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassnber.jahr;

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  concat(
    apflora.pop."PopNr",
    '/',
    apflora.tpop.nr
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop.nr,
      ' ',
      apflora.tpop.gemeinde,
      ' ',
      apflora.tpop."TPopFlurname"
    )
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId",
    '/Teil-Populationen/',
    apflora.tpop.id
  ) AS url
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" is not null
  AND apflora.tpop."TPopYKoord" is not null
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  concat(
    apflora.ae_eigenschaften.artname,
    ' ',
    apflora.pop."PopNr",
    '/',
    apflora.tpop.nr
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop.nr,
      ' ',
      apflora.tpop.gemeinde,
      ' ',
      apflora.tpop."TPopFlurname")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
       ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopXKoord" - 600000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000) * ((apflora.tpop."TPopYKoord" - 200000)::numeric / 1000000))
       ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId",
    '/Teil-Populationen/',
    apflora.tpop.id
  ) AS url
FROM
  (apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" is not null
  AND apflora.tpop."TPopYKoord" is not null
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  apflora.pop."PopNr" AS "Label",
  substring(
    concat('Population: ', apflora.pop."PopNr", ' ', apflora.pop."PopName")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId"
  ) AS url
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" is not null
  AND apflora.pop."PopYKoord" is not null
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName";

-- -- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  apflora.ae_eigenschaften.artname AS "Art",
  concat(
    apflora.ae_eigenschaften.artname,
    ' ',
    apflora.pop."PopNr"
  ) AS "Label",
  substring(
    concat('Population: ', apflora.pop."PopNr", ' ', apflora.pop."PopName")
    from 1 for 225
  ) AS "Inhalte",
  round(
    (
      (
        2.6779094
        + (4.728982 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        + (0.791484 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        + (0.1306 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0436 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Laengengrad",
  round(
    (
      (
        16.9023892
        + (3.238272 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.270978 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000))
        - (0.002528 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.0447 * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopXKoord" - 600000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
        - (0.014 * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000) * ((apflora.pop."PopYKoord" - 200000)::numeric / 1000000))
      ) * 100 / 36
    )::numeric, 10
  ) AS "Breitengrad",
  concat(
    'http://www.apflora.ch/Projekte/1/Arten/',
    apflora.ap."ApArtId",
    '/Populationen/',
    apflora.pop."PopId"
  ) AS url
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" is not null
  AND apflora.pop."PopYKoord" is not null
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte.text AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop.id AS "TPop ID",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft".text AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
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
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id AS "Kontr id",
  apflora.tpopkontr.jahr AS "Kontr Jahr",
  apflora.tpopkontr.datum AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr.ueberlebensrate AS "Kontr Ueberlebensrate",
  apflora.tpopkontr.vitalitaet AS "Kontr Vitalitaet",
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
  apflora.tpopkontr.ursachen AS "Kontr Ursachen",
  apflora.tpopkontr.erfolgsbeurteilung AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr.umsetzung_aendern AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr.kontrolle_aendern AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr.bemerkungen AS "Kontr Bemerkungen",
  apflora.tpopkontr.lr_delarze AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr.lr_umgebung_delarze AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr.vegetationstyp AS "Kontr Vegetationstyp",
  apflora.tpopkontr.konkurrenz AS "Kontr Konkurrenz",
  apflora.tpopkontr.moosschicht AS "Kontr Moosschicht",
  apflora.tpopkontr.krautschicht AS "Kontr Krautschicht",
  apflora.tpopkontr.strauchschicht AS "Kontr Strauchschicht",
  apflora.tpopkontr.baumschicht AS "Kontr Baumschicht",
  apflora.tpopkontr.boden_typ AS "Kontr Bodentyp",
  apflora.tpopkontr.boden_kalkgehalt AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr.boden_durchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr.boden_humus AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr.boden_abtrag AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr.wasserhaushalt AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr.handlungsbedarf AS "Kontr Handlungsbedarf",
  apflora.tpopkontr.flaeche_ueberprueft AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr.flaeche AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr.plan_vorhanden AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr.deckung_vegetation AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr.deckung_nackter_boden AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr.deckung_ap_art AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr.vegetationshoehe_maximum AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr.vegetationshoehe_mittel AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr.gefaehrdung AS "Kontr Gefaehrdung",
  apflora.tpopkontr.changed AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr.changed_by AS "Kontrolle zuletzt geaendert von",
  apflora.tpopkontrzaehl.id AS "Zaehlung id",
  apflora.tpopkontrzaehl_einheit_werte.text AS "Zaehlung einheit",
  apflora.tpopkontrzaehl_methode_werte.text AS "Zaehlung Methode",
  apflora.tpopkontrzaehl.anzahl AS "Zaehlung Anzahl"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS "tblAdresse_1"
      ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON "tpopHerkunft".code = apflora.tpop."TPopHerkunft")
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop.id AS "TPop ID",
  apflora.tpop.nr AS "TPop Nr",
  apflora.tpop.gemeinde AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft".text AS "TPop Status",
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
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  tpop_entwicklung_werte.text AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft".code)
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code)
          ON apflora.tpop.id = apflora.tpopber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop.pop_id)
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopber.jahr,
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop.id,
  apflora.tpopber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopmassnber.jahr as "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop.id,
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop.id = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopmassnber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop.id = apflora.tpopmassnber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop.id,
  apflora.tpopkontr.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop.id = apflora.tpopkontr.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_datenstruktur CASCADE;
CREATE OR REPLACE VIEW apflora.v_datenstruktur AS
SELECT
  information_schema.tables.table_schema AS "Tabelle: Schema",
  information_schema.tables.table_name AS "Tabelle: Name",
  dsql2('select count(*) from "'||information_schema.tables.table_schema||'"."'||information_schema.tables.table_name||'"') AS "Tabelle: Anzahl Datensaetze",
  -- information_schema.tables.table_comment AS "Tabelle: Bemerkungen",
  information_schema.columns.column_name AS "Feld: Name",
  information_schema.columns.column_default AS "Feld: Standardwert",
  information_schema.columns.data_type AS "Feld: Datentyp",
  information_schema.columns.is_nullable AS "Feld: Nullwerte"
  -- information_schema.columns.column_comment AS "Feld: Bemerkungen"
FROM
  information_schema.tables
  INNER JOIN
    information_schema.columns
    ON information_schema.tables.table_name = information_schema.columns.table_name
    AND information_schema.tables.table_schema = information_schema.columns.table_schema
WHERE
  information_schema.tables.table_schema IN ('apflora', 'beob')
ORDER BY
  information_schema.tables.table_schema,
  information_schema.tables.table_name,
  information_schema.columns.column_name;

DROP VIEW IF EXISTS apflora.v_apbera1lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apbera1lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_a2lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a2lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop.pop_id
WHERE
  apflora.pop."PopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_tpop_ohneapberichtrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohneapberichtrelevant AS
SELECT
  apflora.ae_eigenschaften.artname AS "Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop."PopId")
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Die TPop.-Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop.pop_id IN (
    SELECT DISTINCT pop_id
    FROM apflora.tpop
    GROUP BY "PopId", nr
    HAVING COUNT(*) > 1
  ) AND
  apflora.tpop.nr IN (
    SELECT nr
    FROM apflora.tpop
    GROUP BY pop_id, nr
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_popnrmehrdeutig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Die Nr. ist mehrdeutig:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."ApArtId" IN (
    SELECT DISTINCT "ApArtId"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  ) AND
  apflora.pop."PopNr" IN (
    SELECT DISTINCT "PopNr"
    FROM apflora.pop
    GROUP BY "ApArtId", "PopNr"
    HAVING COUNT(*) > 1
  )
ORDER BY
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnekoord AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopnr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopnr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Name): ', apflora.pop."PopName")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Name:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population: ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopName" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopstatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnebekanntseit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."PopHerkunftUnklar" = 1
  AND apflora.pop."PopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpop AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop.id IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnenr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnenr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Nr.:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop.nr IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneflurname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Flurname:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopFlurname" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnestatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Status:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "bekannt seit":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne "Fuer AP-Bericht relevant":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopApBerichtRelevant" = 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit "Status unklar", ohne Begruendung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunftUnklar" = 1
  AND apflora.tpop."TPopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnekoordinaten CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnekoordinaten AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Mindestens eine Koordinate fehlt:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopXKoord" IS NULL
  OR apflora.tpop."TPopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Massnahme: ', apflora.tpopmassn.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.jahr IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Massnahme (id): ', apflora.tpopmassn.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.bearbeiter IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.id;

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Massnahmen', apflora.tpopmassn.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Massnahme (Jahr): ', apflora.tpopmassn.jahr)]::text[] AS text,
  apflora.tpopmassn.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn.typ IS NULL
  AND apflora.tpopmassn.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassn.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassnber.jahr,
  apflora.tpopmassnber.id;

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohneerfbeurt AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Massnahmen-Berichte', apflora.tpopmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Massnahmen-Bericht (Jahr): ', apflora.tpopmassnber.jahr)]::text[] AS text,
  apflora.tpopmassnber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop.id = apflora.tpopmassnber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber.beurteilung IS NULL
  AND apflora.tpopmassnber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.jahr IS NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.bearbeiter IS NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.id;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.jahr IS NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnebearb CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.bearbeiter IS NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.bearbeiter;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (
    apflora.tpopkontr.typ IS NULL
    OR apflora.tpopkontr.typ = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id,
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id,
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Teilpopulations-Bericht (id): ', apflora.tpopber.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop.id = apflora.tpopber.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop.pop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id, 'Kontroll-Berichte', apflora.tpopber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr), concat('Teilpopulations-Bericht (Jahr): ', apflora.tpopber.jahr)]::text[] AS text,
  apflora.tpopber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop.id = apflora.tpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber.entwicklung IS NULL
  AND apflora.tpopber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop.nr,
  apflora.tpopber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber.jahr)]::text[] AS text,
  apflora.popber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.entwicklung IS NULL
  AND apflora.popber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Bericht (Jahr): ', apflora.popber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber.jahr IS NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Populations-Massnahmen-Bericht (Jahr): ', apflora.popmassnber.jahr)]::text[] AS text,
  apflora.popmassnber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber.beurteilung IS NULL
  AND apflora.popmassnber.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.popmassnber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id, 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text,
  apflora.zielber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel.id = apflora.zielber.ziel_id
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.zielber.erreichung IS NULL
  AND apflora.zielber.jahr IS NOT NULL
ORDER BY
  apflora.ziel.jahr,
  apflora.ziel.id,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id, 'Berichte', apflora.zielber.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr), concat('Ziel-Bericht (Jahr): ', apflora.zielber.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel.id = apflora.zielber.ziel_id)
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.zielber.jahr IS NULL
ORDER BY
  apflora.ziel.jahr,
  apflora.ziel.id,
  apflora.zielber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (id): ', apflora.ziel.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.jahr IS NULL
  OR apflora.ziel.jahr = 1
ORDER BY
  apflora.ziel.id;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.typ IS NULL
ORDER BY
  apflora.ziel.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohneziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel.id]::text[] AS url,
  ARRAY[concat('Ziel (Jahr): ', apflora.ziel.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel.ap_id
WHERE
  apflora.ziel.bezeichnung IS NULL
ORDER BY
  apflora.ziel.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.erfolg IS NULL
ORDER BY
  apflora.erfkrit.id;

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit.id]::text[] AS url,
  ARRAY[concat('Erfolgskriterium (id): ', apflora.erfkrit.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit.ap_id
WHERE
  apflora.erfkrit.kriterien IS NULL
ORDER BY
  apflora.erfkrit.id;

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber.id]::text[] AS url,
  ARRAY[concat('AP-Bericht (id): ', apflora.apber.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber.id
HAVING
  apflora.apber.jahr IS NULL
ORDER BY
  apflora.apber.id;

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber.id]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber.jahr)]::text[] AS text,
  apflora.apber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
WHERE
  apflora.apber.vergleich_vorjahr_gesamtziel IS NULL
  AND apflora.apber.jahr IS NOT NULL
ORDER BY
  apflora.apber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Beurteilung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber.id]::text[] AS url,
  ARRAY[concat('AP-Bericht (Jahr): ', apflora.apber.jahr)]::text[] AS text,
  apflora.apber.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber.ap_id
WHERE
  apflora.apber.beurteilung IS NULL
  AND apflora.apber.jahr IS NOT NULL
ORDER BY
  apflora.apber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_assozart_ohneart AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Assoziierte Art ohne Art:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'assoziierte-Arten', apflora.assozart.id]::text[] AS url,
  ARRAY[concat('Assoziierte Art (id): ', apflora.assozart.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.assozart
    ON apflora.ap."ApArtId" = apflora.assozart.ap_id
WHERE
  apflora.assozart.ae_id IS NULL
ORDER BY
  apflora.assozart.id;

DROP VIEW IF EXISTS apflora.v_qk2_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Koordinaten entsprechen keiner Teilpopulation:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text,
  apflora.pop."PopXKoord" AS "XKoord",
  apflora.pop."PopYKoord" AS "YKoord"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopXKoord" Is NOT Null
  AND apflora.pop."PopYKoord" IS NOT NULL
  AND apflora.pop."PopId" NOT IN (
    SELECT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopXKoord" = "PopXKoord"
      AND apflora.tpop."TPopYKoord" = "PopYKoord"
  )
  ORDER BY
    apflora.ap."ProjId",
    apflora.pop."ApArtId";

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (101, 202, 211)
      AND apflora.tpop.pop_id = apflora.pop."PopId"
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" NOT IN (101, 202, 211)
      AND apflora.tpop.pop_id = apflora.pop."PopId"
  );

  DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen CASCADE;
  CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen AS
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopHerkunft" = 201
    AND apflora.pop."PopId" IN (
      SELECT DISTINCT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopHerkunft" = 101
    );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":'::text AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 201
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" IN (200, 201, 202, 210, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 100
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuspotwuchsortmittpopanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuspotwuchsortmittpopanders AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" < 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id AS tpop_id,
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop.id IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid.id = apflora.tpopkontr.tpop_id
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr.id::text
          )
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id AS tpop_id,
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop.pop_id = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop.id IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop."PopId",
  apflora.tpop.id;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop.id AS tpop_id,
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop.id IN (
    SELECT DISTINCT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.typ < 4
  );

-- wozu wird das benutzt?
DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr AS
SELECT
  apflora.tpopber.tpop_id,
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber.tpop_id;

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS
SELECT
 apflora.tpopbeob.tpop_id as id,
  max(
    date_part('year', apflora.beob."Datum")
  ) AS "MaxJahr"
FROM
  apflora.tpopbeob
INNER JOIN
  apflora.beob
  ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."Datum" IS NOT NULL AND
  apflora.tpopbeob.tpop_id IS NOT NULL
GROUP BY
  apflora.tpopbeob.tpop_id;

DROP VIEW IF EXISTS apflora.v_apber_pop_uebersicht CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_pop_uebersicht AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "Art",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.ae_eigenschaften.taxid
      AND apflora.pop."PopHerkunft" IN (100)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop.pop_id
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellUrspruenglich",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.ae_eigenschaften.taxid
      AND apflora.pop."PopHerkunft" IN (200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop.pop_id
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuellAngesiedelt",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = apflora.ae_eigenschaften.taxid
      AND apflora.pop."PopHerkunft" IN (100, 200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop.pop_id
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuell"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname
ORDER BY
  apflora.ae_eigenschaften.artname;

-- new views beginning 2017.10.04
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr AS "Berichtjahr",
  'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.entwicklung = 3
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 3
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr AS "Berichtjahr",
  'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.entwicklung = 1
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 1
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id NOT IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung = 8
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr AS "Berichtjahr",
  'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:'::text AS hw,
  ARRAY['Projekte', apflora.ap."ProjId" , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
  apflora.pop
    INNER JOIN apflora.popber
    ON apflora.pop."PopId" = apflora.popber.pop_id
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber.entwicklung = 8
  AND apflora.popber.pop_id IN (
    SELECT DISTINCT apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN apflora.tpopber
      ON apflora.tpop.id = apflora.tpopber.tpop_id
    WHERE
      apflora.tpopber.entwicklung < 8
      AND apflora.tpopber.jahr = apflora.popber.jahr
  )
ORDER BY
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (100, 200, 210, 300)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusaktuellletzterpopbererloschen AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (100, 200, 210, 300)
  AND lastpopber.entwicklung = 8
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 3
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber.entwicklung = 3
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberstabil AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 2
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberstabil CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberstabil AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber.entwicklung = 2
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 201, 202, 211, 300)
  AND lasttpopber.entwicklung = 1
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 201, 202, 211, 300)
  AND lastpopber.entwicklung = 1
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211, 300)
  AND lasttpopber.entwicklung = 4
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberunsicher CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopberunsicher AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211, 300)
  AND lastpopber.entwicklung = 4
  AND apflora.pop."PopId" NOT IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpopmitgleichemstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpopmitgleichemstatus AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Keine Teil-Population hat den Status der Population:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  --why was this here? deactivated 2017-11-03
  --apflora.pop."PopHerkunft" = 210
  apflora.pop."PopId" NOT IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND (
          apflora.tpop."TPopHerkunft" = apflora.pop."PopHerkunft"
          -- problem: the values for erloschen and aktuell can vary
          -- depending on bekannt seit
          -- even though they are same value in status field of form
          OR (apflora.tpop."TPopHerkunft" = 200 AND apflora.pop."PopHerkunft" = 210)
          OR (apflora.tpop."TPopHerkunft" = 210 AND apflora.pop."PopHerkunft" = 200)
          OR (apflora.tpop."TPopHerkunft" = 202 AND apflora.pop."PopHerkunft" = 211)
          OR (apflora.tpop."TPopHerkunft" = 211 AND apflora.pop."PopHerkunft" = 202)
      )
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status300tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status300tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 300
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status201tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status201tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status202tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status202tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 202
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" <> 202
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status211tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status211tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 211
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210, 200, 201, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status200tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status200tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 200
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status210tpopstatusunzulaessig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status210tpopstatusunzulaessig AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 210
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" IN (100, 101)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_status101tpopstatusanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_status101tpopstatusanders AS
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" = 101
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
    WHERE
      apflora.tpop.pop_id = apflora.pop."PopId"
      AND apflora.tpop."TPopHerkunft" NOT IN (101, 300)
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung AS
WITH lastpopber AS (
  SELECT DISTINCT ON (pop_id)
    pop_id,
    jahr,
    entwicklung
  FROM
    apflora.popber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    pop_id,
    jahr DESC
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
      ON apflora.pop."PopId" = lastpopber.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND lastpopber.entwicklung = 8
  AND apflora.pop."PopId" IN (
    -- Ansiedlungen since lastpopber.jahr
    SELECT DISTINCT
      apflora.tpop.pop_id
    FROM
      apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop.id = apflora.tpopmassn.tpop_id
    WHERE
      apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr > lastpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung AS
WITH lasttpopber AS (
  SELECT DISTINCT ON (tpop_id)
    tpop_id,
    jahr,
    entwicklung
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  ORDER BY
    tpop_id,
    jahr DESC
)
SELECT
  apflora.projekt."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:'::text AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        INNER JOIN lasttpopber
        ON apflora.tpop.id = lasttpopber.tpop_id
      ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND lasttpopber.entwicklung = 8
  AND apflora.tpop.id IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > lasttpopber.jahr
  );