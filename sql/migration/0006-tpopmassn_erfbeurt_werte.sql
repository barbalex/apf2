ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilId" TO code;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilTxt" TO text;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilOrd" TO sort;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "MutWer" TO changed_by;

-- done: rename in sql
-- done: add all views, functions, triggers with tpopmassn_erfbeurt_werte
-- done: make sure createTable is correct
-- done: rename in js
-- TODO: test app
-- TODO: update js and run this file on server

-- views:

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
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_webgisbun;
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
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read;
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
          ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
  tpopmassn_typ_werte.text;

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
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
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
  tpopmassn_typ_werte.text;

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
        ON apflora.tpopmassn.typ = tpopmassn_typ_werte.code)
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn.bearbeiter = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  tpopmassn_typ_werte.text;

DROP VIEW IF EXISTS apflora.v_popmassnber;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.pop
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
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popmassnber_verwaist;
CREATE OR REPLACE VIEW apflora.v_popmassnber_verwaist AS
SELECT
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopId" AS "PopMassnBer PopId",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId")
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popmassnber."PopMassnBerJahr",
  tpopmassn_erfbeurt_werte.text;

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan-Status",
  apflora.ap."ApJahr" AS "Aktionsplan-Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Aktionsplan-Umsetzung",
  apflora.pop."PopNr" AS "Population-Nr",
  apflora.pop."PopName" AS "Population-Name",
  pop_status_werte."HerkunftTxt" AS "Population-Herkunft",
  apflora.pop."PopBekanntSeit" AS "Population - bekannt seit",
  apflora.tpop."TPopNr" AS "Teilpopulation-Nr",
  apflora.tpop."TPopGemeinde" AS "Teilpopulation-Gemeinde",
  apflora.tpop."TPopFlurname" AS "Teilpopulation-Flurname",
  apflora.tpop."TPopXKoord" AS "Teilpopulation-X-Koodinate",
  apflora.tpop."TPopYKoord" AS "Teilpopulation-Y-Koordinate",
  apflora.tpop."TPopRadius" AS "Teilpopulation-Radius",
  apflora.tpop."TPopHoehe" AS "Teilpopulation-Hoehe",
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
  apflora.tpopmassnber."TPopMassnBerJahr" AS "Massnahmenbericht-Jahr",
  tpopmassn_erfbeurt_werte.text AS "Massnahmenbericht-Erfolgsberuteilung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "Massnahmenbericht-Interpretation"
FROM
  (((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  INNER JOIN
    (((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
      LEFT JOIN
        apflora.tpop_apberrelevant_werte
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte."DomainCode")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      (apflora.tpopmassnber
      INNER JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code)
      ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_tpopmassnber;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
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
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft"."HerkunftTxt" AS "TPop Status",
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
  apflora.tpopmassnber."TPopMassnBerId" AS "TPopMassnBer Id",
  apflora.tpopmassnber."TPopMassnBerJahr" AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte.text AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber."MutWann" AS "TPopMassnBer MutWann",
  apflora.tpopmassnber."MutWer" AS "TPopMassnBer MutWer"
FROM
  apflora.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
        INNER JOIN
          (apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr";

DROP TRIGGER IF EXISTS tpopmassn_typ_werte_on_update_set_mut ON apflora.tpopmassn_typ_werte;
DROP FUNCTION IF EXISTS tpopmassn_typ_werte_on_update_set_mut();
CREATE FUNCTION tpopmassn_typ_werte_on_update_set_mut() RETURNS trigger AS $tpopmassn_typ_werte_on_update_set_mut$
  BEGIN
    NEW."MutWer" = current_setting('request.jwt.claim.username', true);
    NEW."MutWann" = NOW();
    RETURN NEW;
  END;
$tpopmassn_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassn_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopmassn_typ_werte_on_update_set_mut();