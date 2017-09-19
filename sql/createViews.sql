DROP VIEW IF EXISTS apflora.v_beobzuordnung CASCADE;
CREATE OR REPLACE VIEW apflora.v_beobzuordnung AS
SELECT
  apflora.beobzuordnung.*,
  beob.beob."ArtId" AS "ApArtId"
FROM
  apflora.beobzuordnung
  INNER JOIN
    beob.beob
    ON beob.beob.id = apflora.beobzuordnung."BeobId";

DROP VIEW IF EXISTS apflora.v_tpop_for_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_for_ap AS
SELECT
  apflora.tpop.*,
  apflora.ap."ApArtId" AS "ApArtId"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId";

DROP VIEW IF EXISTS apflora.v_tpopkoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkoord AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopXKoord" Is Not Null
  AND apflora.tpop."TPopYKoord" Is Not Null;

DROP VIEW IF EXISTS apflora.v_pop_berundmassnjahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_berundmassnjahre AS
SELECT
  apflora.pop."PopId",
  apflora.popber."PopBerJahr" AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId"
UNION DISTINCT SELECT
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerJahr" AS "Jahr"
FROM
  apflora.pop
  INNER JOIN
    apflora.popmassnber
    ON apflora.pop."PopId" = apflora.popmassnber."PopId"
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn0 AS
SELECT
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr",
  count(apflora.tpopmassn."TPopMassnId") AS "AnzahlvonTPopMassnId"
FROM
  apflora.popmassnber
  INNER JOIN
    (apflora.tpop
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.popmassnber."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" = apflora.popmassnber."PopMassnBerJahr"
  Or apflora.tpopmassn."TPopMassnJahr" IS NULL
GROUP BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr"
ORDER BY
  apflora.popmassnber."PopId",
  apflora.popmassnber."PopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_massn_jahre CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_jahre AS
SELECT
  apflora.tpopmassn."TPopMassnJahr"
FROM
  apflora.tpopmassn
GROUP BY
  apflora.tpopmassn."TPopMassnJahr"
HAVING
  apflora.tpopmassn."TPopMassnJahr" BETWEEN 1900 AND 2100
ORDER BY
  apflora.tpopmassn."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassnprojahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassnprojahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.tpopmassn."TPopMassnJahr",
  count(apflora.tpopmassn."TPopMassnId") AS "AnzahlvonTPopMassnId"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.ap."ApArtId",
  apflora.tpopmassn."TPopMassnJahr"
HAVING
  apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.tpopmassn."TPopMassnJahr";

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
      ON apflora.pop."PopId" = apflora.tpop."PopId")
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
  min(apflora.tpopmassn."TPopMassnJahr") AS "MinvonTPopMassnJahr"
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
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
GROUP BY
  apflora.ap."ApArtId";

DROP VIEW IF EXISTS apflora.v_tpop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_verwaist AS
SELECT
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
  apflora.tpop."TPopHoehe" AS "TPop Hoehe ueM",
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
  apflora.tpop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.tpop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId"
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_massn CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.tpopmassn."TPopMassnId",
  apflora.tpopmassn."TPopMassnGuid" AS "Massn Guid",
  apflora.tpopmassn."TPopMassnGuid_alt" AS "Massn GUID alt",
  apflora.tpopmassn."TPopMassnJahr" AS "Massn Jahr",
  apflora.tpopmassn."TPopMassnDatum" AS "Massn Datum",
  tpopmassn_typ_werte."MassnTypTxt" AS "Massn Typ",
  apflora.tpopmassn."TPopMassnTxt" AS "Massn Massnahme",
  apflora.adresse."AdrName" AS "Massn BearbeiterIn",
  CAST(apflora.tpopmassn."TPopMassnBemTxt" AS CHAR) AS "Massn Bemerkungen",
  apflora.tpopmassn."TPopMassnPlan" AS "Massn Plan vorhanden",
  apflora.tpopmassn."TPopMassnPlanBez" AS "Massn Plan Bezeichnung",
  apflora.tpopmassn."TPopMassnFlaeche" AS "Massn Flaeche m2",
  apflora.tpopmassn."TPopMassnAnsiedForm" AS "Massn Form der Ansiedlung",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung" AS "Massn Pflanzanordnung",
  apflora.tpopmassn."TPopMassnMarkierung" AS "Massn Markierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe" AS "Massn Anz Triebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl" AS "Massn Pflanzen",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen" AS "Massn Anz Pflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl" AS "Massn Wirtspflanze",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop" AS "Massn Herkunftspopulation",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm" AS "Massn Sammeldatum",
  apflora.tpopmassn."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.tpopmassn."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
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
    ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnJahr",
  apflora.tpopmassn."TPopMassnDatum",
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_massn_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_write AS
SELECT
  apflora.tpopmassn."TPopMassnId" AS "tpopmassnid",
  CAST(apflora.tpopmassn."TPopMassnGuid" AS varchar(50)) AS "massnguid",
  apflora.tpopmassn."TPopId" AS "tpopid",
  apflora.tpopmassn."TPopMassnTyp" AS "tpopmassntyp",
  apflora.tpopmassn."TPopMassnJahr" AS "massnjahr",
  apflora.tpopmassn."TPopMassnDatum"::timestamp AS "massndatum",
  apflora.tpopmassn."TPopMassnBearb" AS "tpopmassnbearb",
  apflora.tpopmassn."TPopMassnTxt" AS "massnmassnahme",
  apflora.tpopmassn."TPopMassnPlan" AS "massnplanvorhanden",
  apflora.tpopmassn."TPopMassnPlanBez" AS "massnplanbezeichnung",
  apflora.tpopmassn."TPopMassnFlaeche" AS "massnflaeche",
  apflora.tpopmassn."TPopMassnAnsiedForm" AS "massnformderansiedlung",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung" AS "massnpflanzanordnung",
  apflora.tpopmassn."TPopMassnMarkierung" AS "massnmarkierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe" AS "massnanztriebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl" AS "massnpflanzen",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen" AS "massnanzpflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl" AS "massnwirtspflanze",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop" AS "massnherkunftspopulation",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm" AS "massnsammeldatum",
  apflora.tpopmassn."TPopMassnBemTxt" AS "tpopmassnbemtxt",
  apflora.tpopmassn."MutWann"::timestamp AS "massnmutwann",
  apflora.tpopmassn."MutWer" AS "massnmutwer"
FROM
  apflora.tpopmassn;

DROP VIEW IF EXISTS apflora.v_massn_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_massn_fuergis_read AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "apartid",
  beob.adb_eigenschaften."Artname" AS "apart",
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
  CAST(apflora.tpopmassn."TPopMassnGuid" AS varchar(50)) AS "massnguid",
  apflora.tpopmassn."TPopMassnJahr" AS "massnjahr",
  apflora.tpopmassn."TPopMassnDatum"::timestamp AS "massndatum",
  tpopmassn_typ_werte."MassnTypTxt" AS "massntyp",
  apflora.tpopmassn."TPopMassnTxt" AS "massnmassnahme",
  apflora.adresse."AdrName" AS "massnbearbeiterin",
  apflora.tpopmassn."TPopMassnPlan" AS "massnplanvorhanden",
  apflora.tpopmassn."TPopMassnPlanBez" AS "massnplanbezeichnung",
  apflora.tpopmassn."TPopMassnFlaeche" AS "massnflaeche",
  apflora.tpopmassn."TPopMassnAnsiedForm" AS "massnformderansiedlung",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung" AS "massnpflanzanordnung",
  apflora.tpopmassn."TPopMassnMarkierung" AS "massnmarkierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe" AS "massnanztriebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl" AS "massnpflanzen",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen" AS "massnanzpflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl" AS "massnwirtspflanze",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop" AS "massnherkunftspopulation",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm" AS "massnsammeldatum",
  apflora.tpopmassn."MutWann"::timestamp AS "massnmutwann",
  apflora.tpopmassn."MutWer" AS "massnmutwer"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      INNER JOIN
        (apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
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
    ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnJahr",
  apflora.tpopmassn."TPopMassnDatum",
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_tpop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzmassn AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  count(apflora.tpopmassn."TPopMassnId") AS "Anzahl Massnahmen"
FROM
  beob.adb_eigenschaften
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
          ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
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
  ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
GROUP BY
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname",
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
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzmassn AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  count(apflora.tpopmassn."TPopMassnId") AS "Anzahl Massnahmen"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
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
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Artname",
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
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_anzkontr AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  count(apflora.tpopkontr."TPopKontrId") AS "Anzahl Kontrollen"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
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
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  apflora.pop."PopId",
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
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_ap_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzmassn AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  count(apflora.tpopmassn."TPopMassnId") AS "Anzahl Massnahmen"
FROM
  (((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
GROUP BY
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_anzkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  count(apflora.tpopkontr."TPopKontrId") AS "Anzahl Kontrollen"
FROM
  (((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
GROUP BY
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_pop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      (apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnekoord AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname",
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
  beob.adb_eigenschaften."TaxonomieId" AS "apartid",
  beob.adb_eigenschaften."Artname" AS "artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apstatus",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  apflora.pop."PopXKoord" AS "popxkoord",
  apflora.pop."PopYKoord" AS "popykoord",
  apflora.pop."MutWann"::timestamp AS "mutwann",
  apflora.pop."MutWer" AS "mutwer"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.pop."PopXKoord" > 0
  AND apflora.pop."PopYKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_pop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_verwaist AS
SELECT
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
  apflora.ap."ApArtId"
FROM
  (apflora.ap
  RIGHT JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.pop."PopName",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_ohnetpop AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
  LEFT JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopId" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_verwaist AS
SELECT
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopId" AS "PopBer PopId",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt";

DROP VIEW IF EXISTS apflora.v_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popmassnber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_verwaist AS
SELECT
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopId" AS "PopMassnBer PopId",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
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
    ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId"
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popmassnber."PopMassnBerJahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt";

DROP VIEW IF EXISTS apflora.v_tpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
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
  apflora.tpop."MutWann" AS "Teilpopulation zuletzt geaendert",
  apflora.tpop."MutWer" AS "Teilpopulation zuletzt geaendert von"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
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
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_write AS
SELECT
  apflora.tpop."TPopId" AS "tpopid",
  apflora.tpop."PopId" AS "popid",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
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
  apflora.tpop."MutWann"::timestamp AS "mutwann",
  apflora.tpop."MutWer" AS "mutwer"
FROM
  apflora.tpop;

DROP VIEW IF EXISTS apflora.v_tpop_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS "apartid",
  beob.adb_eigenschaften."Artname" AS "artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "apherkunft",
  apflora.ap."ApJahr" AS "apjahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "apumsetzung",
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS "popguid",
  apflora.pop."PopNr" AS "popnr",
  apflora.pop."PopName" AS "popname",
  pop_status_werte."HerkunftTxt" AS "popherkunft",
  apflora.pop."PopBekanntSeit" AS "popbekanntseit",
  apflora.pop."PopHerkunftUnklar" AS "popherkunftunklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "popherkunftunklarbegruendung",
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS "tpopguid",
  apflora.tpop."TPopNr" AS "tpopnr",
  apflora.tpop."TPopGemeinde" AS "tpopgemeinde",
  apflora.tpop."TPopFlurname" AS "tpopflurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "tpopherkunft",
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
  apflora.tpop."MutWann"::timestamp AS "mutwann",
  apflora.tpop."MutWer" AS "mutwer"
FROM
  (((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
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
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId"
WHERE
  apflora.tpop."TPopYKoord" > 0
  AND apflora.tpop."TPopXKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

-- im Gebrauch durch exportPopVonApOhneStatus.php:
DROP VIEW IF EXISTS apflora.v_pop_vonapohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_vonapohnestatus AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap."ApStatus" AS "Bearbeitungsstand AP",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop."PopHerkunft" AS "Status"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" = 3
  AND apflora.pop."PopHerkunft" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_apber_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_zielber AS
SELECT
  apflora.zielber.*
FROM
  apflora.zielber
  INNER JOIN
    apflora._variable
    ON apflora.zielber."ZielBerJahr" = apflora._variable."JBerJahr";

DROP VIEW IF EXISTS apflora.v_abper_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_abper_ziel AS
SELECT
  apflora.ziel.*,
  ziel_typ_werte."ZieltypTxt"
FROM
  apflora._variable
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.ziel_typ_werte
      ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
    ON apflora._variable."JBerJahr" = apflora.ziel."ZielJahr"
WHERE
  apflora.ziel."ZielTyp" IN(1, 2, 1170775556)
ORDER BY
  apflora.ziel_typ_werte."ZieltypOrd",
  apflora.ziel."ZielBezeichnung";

DROP VIEW IF EXISTS apflora.v_apber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_verwaist AS
SELECT
  apflora.apber."JBerId" AS "JBer Id",
  apflora.apber."ApArtId" AS "JBer ApArtId",
  apflora.apber."JBerJahr" AS "JBer Jahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel" AS "JBer Vergleich Vorjahr-Gesamtziel",
  ap_erfkrit_werte."BeurteilTxt" AS "JBer Beurteilung",
  apflora.apber."JBerVeraenGegenVorjahr" AS "JBer Veraend zum Vorjahr",
  apflora.apber."JBerAnalyse" AS "JBer Analyse",
  apflora.apber."JBerUmsetzung" AS "JBer Konsequenzen Umsetzung",
  apflora.apber."JBerErfko" AS "JBer Konsequenzen Erfolgskontrolle",
  apflora.apber."JBerATxt" AS "JBer Bemerkungen zu A",
  apflora.apber."JBerBTxt" AS "JBer Bemerkungen zu B",
  apflora.apber."JBerCTxt" AS "JBer Bemerkungen zu C",
  apflora.apber."JBerDTxt" AS "JBer Bemerkungen zu D",
  apflora.apber."JBerDatum" AS "JBer Datum",
  apflora.adresse."AdrName" AS "JBer BearbeiterIn",
  apflora.apber."MutWann" AS "JBer MutWann",
  apflora.apber."MutWer" AS "JBer MutWer"
FROM
  ((apflora.ap
  RIGHT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  LEFT JOIN
    apflora.adresse
    ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.apber."JBerBeurteilung" = ap_erfkrit_werte."BeurteilId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.apber."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerDatum";

DROP VIEW IF EXISTS apflora.v_apber_artd CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_artd AS
SELECT
  apflora.ap.*,
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.apber."JBerId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel",
  apflora.apber."JBerBeurteilung",
  apflora.apber."JBerAnalyse",
  apflora.apber."JBerUmsetzung",
  apflora.apber."JBerErfko",
  apflora.apber."JBerATxt",
  apflora.apber."JBerBTxt",
  apflora.apber."JBerCTxt",
  apflora.apber."JBerDTxt",
  apflora.apber."JBerDatum",
  apflora.apber."JBerBearb",
  apflora.adresse."AdrName" AS "Bearbeiter",
  ap_erfkrit_werte."BeurteilTxt"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON apflora.apber."JBerBeurteilung" = apflora.ap_erfkrit_werte."BeurteilId")
    INNER JOIN
      apflora._variable
      ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId";

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn."TPopId"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" >= apflora.ap."ApJahr"
GROUP BY
  apflora.tpopmassn."TPopId";

DROP VIEW IF EXISTS apflora.v_apber CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  apflora.apber."JBerId" AS "JBerId",
  beob.adb_eigenschaften."Artname" AS "Name",
  apflora.apber."JBerJahr" AS "JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel" AS "JBerVergleichVorjahrGesamtziel",
  ap_erfkrit_werte."BeurteilTxt" AS "JBerBeurteilung",
  apflora.apber."JBerVeraenGegenVorjahr" AS "JBerVeraenGegenVorjahr",
  apflora.apber."JBerAnalyse" AS "JBerAnalyse",
  apflora.apber."JBerUmsetzung" AS "JBerUmsetzung",
  apflora.apber."JBerErfko" AS "JBerErfko",
  apflora.apber."JBerATxt" AS "JBerATxt",
  apflora.apber."JBerBTxt" AS "JBerBTxt",
  apflora.apber."JBerCTxt" AS "JBerCTxt",
  apflora.apber."JBerDTxt" AS "JBerDTxt",
  apflora.apber."JBerDatum" AS "JBerDatum",apflora.adresse."AdrName" AS "JBerBearb"
FROM
  apflora.ap
  INNER JOIN
    beob.adb_eigenschaften
    ON (apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.apber
    LEFT JOIN
      apflora.ap_erfkrit_werte
      ON (apflora.apber."JBerBeurteilung" = ap_erfkrit_werte."BeurteilId"))
    LEFT JOIN
      apflora.adresse
      ON (apflora.apber."JBerBearb" = apflora.adresse."AdrId"))
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname";

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
    ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn."TPopMassnJahr" <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" BETWEEN 1 AND 5;

DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerJahr"
FROM
  apflora._variable,
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber."TPopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

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
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
WHERE
  apflora.popmassnber."PopMassnBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpopmassn."TPopMassnJahr" <= apflora._variable."JBerJahr"
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0 AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerJahr"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300;

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS apflora.v_pop_letzterpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopber0_overall AS
SELECT
  apflora.popber."PopId",
  max(apflora.popber."PopBerJahr") AS "PopBerJahr"
FROM
  apflora.popber
WHERE
  apflora.popber."PopBerJahr" IS NOT NULL
GROUP BY
  apflora.popber."PopId";

DROP VIEW IF EXISTS apflora.v_pop_letzterpopbermassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_letzterpopbermassn AS
SELECT
  apflora.popmassnber."PopId",
  max(apflora.popmassnber."PopMassnBerJahr") AS "PopMassnBerJahr"
FROM
  apflora.popmassnber
WHERE
  apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
GROUP BY
  apflora.popmassnber."PopId";

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter tpopber überhaupt
DROP VIEW IF EXISTS apflora.v_tpop_letztertpopber0_overall CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letztertpopber0_overall AS
SELECT
  apflora.tpopber."TPopId",
  max(apflora.tpopber."TPopBerJahr") AS "TPopBerJahr"
FROM
  apflora.tpopber
WHERE
  apflora.tpopber."TPopBerJahr" IS NOT NULL
GROUP BY
  apflora.tpopber."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_mitapaberohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_mitapaberohnestatus AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "Status Population",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft" AS "Status Teilpopulation"
FROM
  (apflora.ap_bearbstand_werte
  INNER JOIN
    (beob.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    ON apflora.ap_bearbstand_werte."DomainCode" = apflora.ap."ApStatus")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
  AND apflora.ap."ApStatus" = 3
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnebekanntseit AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopBekanntSeit"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnekoord AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus_",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (apflora.tpop."TPopXKoord" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3)
  OR (
    apflora.tpop."TPopYKoord" IS NULL
    AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  )
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopber_letzterber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzterber AS
SELECT
  apflora.tpopber."TPopId",
  max(apflora.tpopber."TPopBerJahr") AS "MaxvonTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber."TPopId";

DROP VIEW IF EXISTS apflora.v_ap_ausw CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.ap."MutWann" AS "Letzte Aenderung",
  apflora.ap."MutWer" AS "Letzte(r) Bearbeiter(in)"
FROM
  (((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)"
FROM
  (((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_idealbiotop CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ap."MutWann" AS "AP Letzte Aenderung",
  apflora.ap."MutWer" AS "AP Letzte(r) Bearbeiter(in)",
  apflora.idealbiotop."IbApArtId" AS "Ib ApArtId",
  apflora.idealbiotop."IbErstelldatum" AS "Ib Erstelldatum",
  apflora.idealbiotop."IbHoehenlage" AS "Ib Hoehenlage",
  apflora.idealbiotop."IbRegion" AS "Ib Region",
  apflora.idealbiotop."IbExposition" AS "Ib Exposition",
  apflora.idealbiotop."IbBesonnung" AS "Ib Besonnung",
  apflora.idealbiotop."IbHangneigung" AS "Ib Hangneigung",
  apflora.idealbiotop."IbBodenTyp" AS "Ib Bodentyp",
  apflora.idealbiotop."IbBodenKalkgehalt" AS "Ib Boden Kalkgehalt",
  apflora.idealbiotop."IbBodenDurchlaessigkeit" AS "Ib Boden Durchlaessigkeit",
  apflora.idealbiotop."IbBodenHumus" AS "Ib Boden Humus",
  apflora.idealbiotop."IbBodenNaehrstoffgehalt" AS "Ib Boden Naehrstoffgehalt",
  apflora.idealbiotop."IbWasserhaushalt" AS "Ib Wasserhaushalt",
  apflora.idealbiotop."IbKonkurrenz" AS "Ib Konkurrenz",
  apflora.idealbiotop."IbMoosschicht" AS "Ib Moosschicht",
  apflora.idealbiotop."IbKrautschicht" AS "Ib Krautschicht",
  apflora.idealbiotop."IbStrauchschicht" AS "Ib Strauchschicht",
  apflora.idealbiotop."IbBaumschicht" AS "Ib Baumschicht",
  apflora.idealbiotop."IbBemerkungen" AS "Ib Bemerkungen",
  apflora.idealbiotop."MutWann" AS "Ib MutWann",
  apflora.idealbiotop."MutWer" AS "Ib MutWer"
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((beob.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop."IbApArtId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.idealbiotop."IbErstelldatum";

DROP VIEW IF EXISTS apflora.v_idealbiotop_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.idealbiotop."IbApArtId" AS "Ib ApArtId",
  apflora.idealbiotop."IbErstelldatum" AS "Ib Erstelldatum",
  apflora.idealbiotop."IbHoehenlage" AS "Ib Hoehenlage",
  apflora.idealbiotop."IbRegion" AS "Ib Region",
  apflora.idealbiotop."IbExposition" AS "Ib Exposition",
  apflora.idealbiotop."IbBesonnung" AS "Ib Besonnung",
  apflora.idealbiotop."IbHangneigung" AS "Ib Hangneigung",
  apflora.idealbiotop."IbBodenTyp" AS "Ib Bodentyp",
  apflora.idealbiotop."IbBodenKalkgehalt" AS "Ib Boden Kalkgehalt",
  apflora.idealbiotop."IbBodenDurchlaessigkeit" AS "Ib Boden Durchlaessigkeit",
  apflora.idealbiotop."IbBodenHumus" AS "Ib Boden Humus",
  apflora.idealbiotop."IbBodenNaehrstoffgehalt" AS "Ib Boden Naehrstoffgehalt",
  apflora.idealbiotop."IbWasserhaushalt" AS "Ib Wasserhaushalt",
  apflora.idealbiotop."IbKonkurrenz" AS "Ib Konkurrenz",
  apflora.idealbiotop."IbMoosschicht" AS "Ib Moosschicht",
  apflora.idealbiotop."IbKrautschicht" AS "Ib Krautschicht",
  apflora.idealbiotop."IbStrauchschicht" AS "Ib Strauchschicht",
  apflora.idealbiotop."IbBaumschicht" AS "Ib Baumschicht",
  apflora.idealbiotop."IbBemerkungen" AS "Ib Bemerkungen",
  apflora.idealbiotop."MutWann" AS "Ib MutWann",
  apflora.idealbiotop."MutWer" AS "Ib MutWer"
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((beob.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop."IbApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.idealbiotop."IbErstelldatum";

DROP VIEW IF EXISTS apflora.v_ber CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ber."BerId" AS "Ber Id",
  apflora.ber."ApArtId" AS "Ber ApId",
  apflora.ber."BerAutor" AS "Ber Autor",
  apflora.ber."BerJahr" AS "Ber Jahr",
  apflora.ber."BerTitel" AS "Ber Titel",
  apflora.ber."BerURL" AS "Ber URL",
  apflora.ber."MutWann" AS "Ber MutWann",
  apflora.ber."MutWer" AS "Ber MutWer"
FROM
  ((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_ber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ber."BerId" AS "Ber Id",
  apflora.ber."ApArtId" AS "Ber ApId",
  apflora.ber."BerAutor" AS "Ber Autor",
  apflora.ber."BerJahr" AS "Ber Jahr",
  apflora.ber."BerTitel" AS "Ber Titel",
  apflora.ber."BerURL" AS "Ber URL",
  apflora.ber."MutWann" AS "Ber MutWann",
  apflora.ber."MutWer" AS "Ber MutWer"
FROM
  ((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ber
    ON apflora.ap."ApArtId" = apflora.ber."ApArtId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_assozart CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.assozart."AaId" AS "AA Id",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart."AaBem" AS "AA Bemerkungen",
  apflora.assozart."MutWann" AS "AA MutWann",
  apflora.assozart."MutWer" AS "AA MutWer"
FROM
  beob.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((beob.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart."AaApArtId")
    ON "ArtenDb_Arteigenschaften_1"."TaxonomieId" = apflora.assozart."AaSisfNr"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_assozart_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_assozart_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.assozart."AaId" AS "AA Id",
  apflora.assozart."AaApArtId" AS "AA ApArtId",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart."AaBem" AS "AA Bemerkungen",
  apflora.assozart."MutWann" AS "AA MutWann",
  apflora.assozart."MutWer" AS "AA MutWer"
FROM
  beob.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((beob.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart."AaApArtId")
    ON "ArtenDb_Arteigenschaften_1"."TaxonomieId" = apflora.assozart."AaSisfNr"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_ohnepop CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ohnepop AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.ap."ApJahr" AS "Start AP im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "Stand Umsetzung AP",
  apflora.adresse."AdrName" AS "Verantwortlich",
  apflora.pop."ApArtId" AS "Population"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.pop."ApArtId" IS NULL
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopKontrJahr"
FROM
  (apflora.ap
  INNER JOIN
    beob.adb_eigenschaften
    ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopKontrJahr";

DROP VIEW IF EXISTS apflora.v_erfkrit CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfkrit AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.erfkrit."ErfkritId" AS "ErfKrit Id",
  apflora.erfkrit."ApArtId" AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit."ErfkritTxt" AS "ErfKrit Kriterien",
  apflora.erfkrit."MutWann" AS "ErfKrit MutWann",
  apflora.erfkrit."MutWer" AS "ErfKrit MutWer"
FROM
  (((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId")
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit."ErfkritErreichungsgrad" = ap_erfkrit_werte."BeurteilId"
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_erfktit_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_erfktit_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.erfkrit."ErfkritId" AS "ErfKrit Id",
  apflora.erfkrit."ApArtId" AS "ErfKrit ApId",
  ap_erfkrit_werte."BeurteilTxt" AS "ErfKrit Beurteilung",
  apflora.erfkrit."ErfkritTxt" AS "ErfKrit Kriterien",
  apflora.erfkrit."MutWann" AS "ErfKrit MutWann",
  apflora.erfkrit."MutWer" AS "ErfKrit MutWer"
FROM
  (((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId")
  LEFT JOIN
    apflora.ap_erfkrit_werte
    ON apflora.erfkrit."ErfkritErreichungsgrad" = ap_erfkrit_werte."BeurteilId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ap_erfkrit_werte."BeurteilTxt",
  apflora.erfkrit."ErfkritTxt";

DROP VIEW IF EXISTS apflora.v_ap_tpopmassnjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_tpopmassnjahr0 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.tpopmassn."TPopMassnId",
  apflora.tpopmassn."TPopMassnJahr"
FROM
  (apflora.ap
  INNER JOIN
    beob.adb_eigenschaften
    ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.tpopmassn."TPopMassnId",
  apflora.tpopmassn."TPopMassnJahr";

DROP VIEW IF EXISTS apflora.v_auswapbearbmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswapbearbmassninjahr0 AS
SELECT
  apflora.adresse."AdrName",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn."TPopMassnJahr",
  tpopmassn_typ_werte."MassnTypTxt" AS "TPopMassnTyp",
  apflora.tpopmassn."TPopMassnTxt",
  apflora.tpopmassn."TPopMassnDatum",
  apflora.tpopmassn."TPopMassnBemTxt",
  apflora.tpopmassn."TPopMassnPlan",
  apflora.tpopmassn."TPopMassnPlanBez",
  apflora.tpopmassn."TPopMassnFlaeche",
  apflora.tpopmassn."TPopMassnMarkierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm",
  apflora.tpopmassn."TPopMassnAnsiedForm",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId")
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  apflora.adresse."AdrName",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_ap_mitmassninjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_mitmassninjahr0 AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn."TPopMassnJahr",
  tpopmassn_typ_werte."MassnTypTxt" AS "TPopMassnTyp",
  apflora.tpopmassn."TPopMassnTxt",
  apflora.tpopmassn."TPopMassnDatum",
  apflora.adresse."AdrName" AS "TPopMassnBearb",
  apflora.tpopmassn."TPopMassnBemTxt",
  apflora.tpopmassn."TPopMassnPlan",
  apflora.tpopmassn."TPopMassnPlanBez",
  apflora.tpopmassn."TPopMassnFlaeche",
  apflora.tpopmassn."TPopMassnMarkierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm",
  apflora.tpopmassn."TPopMassnAnsiedForm",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      ((apflora.tpopmassn
      INNER JOIN
        apflora.tpopmassn_typ_werte
        ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_tpopmassnber_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
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
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "Massnahmenbericht-Erfolgsberuteilung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "Massnahmenbericht-Interpretation"
FROM
  (((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
        ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
      ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr";

DROP VIEW IF EXISTS apflora.v_tpopmassn_0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_0 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Aktionsplan Bearbeitungsstand",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopFlurname",
  apflora.tpopmassn."TPopMassnId",
  apflora.tpopmassn."TPopMassnJahr" AS "Jahr",
  tpopmassn_typ_werte."MassnTypTxt" AS "Massnahme",
  apflora.tpopmassn."TPopMassnTxt",
  apflora.tpopmassn."TPopMassnDatum",
  apflora.adresse."AdrName" AS "TPopMassnBearb",
  apflora.tpopmassn."TPopMassnBemTxt",
  apflora.tpopmassn."TPopMassnPlan",
  apflora.tpopmassn."TPopMassnPlanBez",
  apflora.tpopmassn."TPopMassnFlaeche",
  apflora.tpopmassn."TPopMassnMarkierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm",
  apflora.tpopmassn."TPopMassnAnsiedForm",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
        ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnJahr",
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_tpopmassn_fueraktap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassn_fueraktap0 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
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
  apflora.tpopmassn."TPopMassnId",
  tpopmassn_typ_werte."MassnTypTxt" AS "Massnahme-Typ",
  apflora.tpopmassn."TPopMassnTxt" AS "Massnahme-Beschreibung",
  apflora.tpopmassn."TPopMassnDatum" AS "Massnahme-Datum",
  apflora.adresse."AdrName" AS "Massnahme-BearbeiterIn",
  apflora.tpopmassn."TPopMassnBemTxt" AS "Massnahme-Bemerkungen",
  apflora.tpopmassn."TPopMassnPlan" AS "Massnahme-Plan",
  apflora.tpopmassn."TPopMassnPlanBez" AS "Massnahme-Planbezeichnung",
  apflora.tpopmassn."TPopMassnFlaeche" AS "Massnahme-Flaeche",
  apflora.tpopmassn."TPopMassnMarkierung" AS "Massnahme-Markierung",
  apflora.tpopmassn."TPopMassnAnsiedAnzTriebe" AS "Massnahme - Ansiedlung Anzahl Triebe",
  apflora.tpopmassn."TPopMassnAnsiedAnzPfl" AS "Massnahme - Ansiedlung Anzahl Pflanzen",
  apflora.tpopmassn."TPopMassnAnzPflanzstellen" AS "Massnahme - Ansiedlung Anzahl Pflanzstellen",
  apflora.tpopmassn."TPopMassnAnsiedWirtspfl" AS "Massnahme - Ansiedlung Wirtspflanzen",
  apflora.tpopmassn."TPopMassnAnsiedHerkunftPop" AS "Massnahme - Ansiedlung Herkunftspopulation",
  apflora.tpopmassn."TPopMassnAnsiedDatSamm" AS "Massnahme - Ansiedlung Sammeldatum",
  apflora.tpopmassn."TPopMassnAnsiedForm" AS "Massnahme - Ansiedlung Form",
  apflora.tpopmassn."TPopMassnAnsiedPflanzanordnung" AS "Massnahme - Ansiedlung Pflanzordnung"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
        ON apflora.tpopmassn."TPopMassnTyp" = tpopmassn_typ_werte."MassnTypCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.tpopmassn."TPopMassnBearb" = apflora.adresse."AdrId")
      ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  tpopmassn_typ_werte."MassnTypTxt";

DROP VIEW IF EXISTS apflora.v_tpopkontr_nachflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_nachflurname AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGemeinde" AS "Gemeinde",
  apflora.tpop."TPopFlurname" AS "Flurname aus Teilpopulation",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr" AS "Jahr",
  apflora.tpopkontr."TPopKontrTyp" AS "Kontrolltyp",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.adresse."AdrName" AS "TPopKontrBearb",
  apflora.tpopkontr."TPopKontrJungpfl",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpopkontr."TPopKontrEntwicklung",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontrzaehl."TPopKontrZaehlId",
  apflora.tpopkontrzaehl."TPopKontrId",
  apflora.tpopkontrzaehl."Anzahl",
  apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt" AS "Zaehleinheit",
  apflora.tpopkontrzaehl_methode_werte."BeurteilTxt" AS "Methode"
FROM
  ((((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
  LEFT JOIN
    apflora.tpopkontrzaehl_einheit_werte
    ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
  LEFT JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode"
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
ORDER BY
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrTyp";

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
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.popber."PopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.popber."PopBerEntwicklung" in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_apber_b1rtpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b1rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpopber."TPopId"
FROM
  apflora._variable,
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      apflora.tpopber
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpopber."TPopBerJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpopber."TPopBerEntwicklung" in (1, 2, 3, 4, 8)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpopber."TPopId";

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
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a3lpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3lpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
    ON apflora.pop."PopId" = apflora.tpop."PopId"
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
    ON apflora.pop."PopId" = apflora.tpop."PopId"
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
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" IS NOT NULL
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" IS NOT NULL
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
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
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopHerkunft" NOT IN (300)
  AND apflora.tpop."TPopHerkunft" IN (200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopBekanntSeit" >= apflora.ap."ApJahr"
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a10ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a10ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a8ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a8ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_a9ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_a9ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
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
  apflora.tpop."TPopId";

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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 2
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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 4
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
      ON apflora.popber."PopBerJahr" = apflora._variable."JBerJahr")
    ON apflora.pop."PopId" = apflora.popber."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
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
    ON apflora.pop."PopId" = apflora.tpop."PopId"
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
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b2ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b2ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b3ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b3ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b4ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b4ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b5ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b5ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b6ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b6ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        apflora._variable
        ON apflora.tpopber."TPopBerJahr" = apflora._variable."JBerJahr")
      ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_b7ltpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_b7ltpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
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
      ON apflora.tpopmassn."TPopMassnJahr" = apflora._variable."JBerJahr")
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
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
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
  INNER JOIN
    apflora._variable
    ON apflora.tpopmassn."TPopMassnJahr" = apflora._variable."JBerJahr"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
  AND apflora.tpop."TPopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_auswanzprotpopangezartbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_auswanzprotpopangezartbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPopHerkunft",
  apflora.tpopkontr."TPopKontrTyp",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.adresse."AdrName" AS "TPopKontrBearb",
  apflora.tpopkontrzaehl."Anzahl",
  apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt" AS "Zaehleinheit",
  apflora.tpopkontrzaehl_methode_werte."BeurteilTxt" AS "Methode",
  apflora.tpopkontr."TPopKontrJungpfl",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpop_entwicklung_werte."EntwicklungTxt" AS "TPopKontrEntwicklung",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrMutDat"
FROM
  (((((((beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    apflora.adresse
    ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte."EntwicklungCode")
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
  INNER JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
  LEFT JOIN
    apflora.tpopkontrzaehl_einheit_werte
    ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode";

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.popber."PopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBerEntwicklung",
  apflora.popber."PopBerTxt"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId";

DROP VIEW IF EXISTS apflora.v_ziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ApArtId" AS "Ziel ApId",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung"
FROM
  (((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ziel."ZielTyp" IN (1, 2, 1170775556)
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp";

DROP VIEW IF EXISTS apflora.v_ziel_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_ziel_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ApArtId" AS "Ziel ApId",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung"
FROM
  (((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp";

DROP VIEW IF EXISTS apflora.v_zielber CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.ziel."ZielJahr" AS "Ziel Jahr",
  ziel_typ_werte."ZieltypTxt" AS "Ziel Typ",
  apflora.ziel."ZielBezeichnung" AS "Ziel Beschreibung",
  apflora.zielber."ZielBerId" AS "ZielBer Id",
  apflora.zielber."ZielId" AS "ZielBer ZielId",
  apflora.zielber."ZielBerJahr" AS "ZielBer Jahr",
  apflora.zielber."ZielBerErreichung" AS "ZielBer Erreichung",
  apflora.zielber."ZielBerTxt" AS "ZielBer Bemerkungen",
  apflora.zielber."MutWann" AS "ZielBer MutWann",
  apflora.zielber."MutWer" AS "ZielBer MutWer"
FROM
  ((((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber."ZielId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.ziel."ZielJahr",
  ziel_typ_werte."ZieltypTxt",
  apflora.ziel."ZielTyp",
  apflora.zielber."ZielBerJahr";

DROP VIEW IF EXISTS apflora.v_zielber_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_zielber_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP Id",
  apflora.ziel."ZielId" AS "Ziel Id",
  apflora.zielber."ZielBerId" AS "ZielBer Id",
  apflora.zielber."ZielId" AS "ZielBer ZielId",
  apflora.zielber."ZielBerJahr" AS "ZielBer Jahr",
  apflora.zielber."ZielBerErreichung" AS "ZielBer Erreichung",
  apflora.zielber."ZielBerTxt" AS "ZielBer Bemerkungen",
  apflora.zielber."MutWann" AS "ZielBer MutWann",
  apflora.zielber."MutWer" AS "ZielBer MutWer"
FROM
  ((((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.adresse
    ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
  RIGHT JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId")
  LEFT JOIN
    apflora.ziel_typ_werte
    ON apflora.ziel."ZielTyp" = ziel_typ_werte."ZieltypId")
  RIGHT JOIN
    apflora.zielber
    ON apflora.ziel."ZielId" = apflora.zielber."ZielId"
WHERE
  apflora.ziel."ZielId" IS NULL
ORDER BY
  apflora.ziel."ZielTyp",
  apflora.zielber."ZielBerJahr";

DROP VIEW IF EXISTS apflora.v_bertpopfuerangezeigteap0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_bertpopfuerangezeigteap0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  beob.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt" AS "ApStatus",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "ApUmsetzung",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.pop."PopBekanntSeit",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopBekanntSeit",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPopHerkunft",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  ((((beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    apflora.pop_status_werte
    AS "domPopHerkunft_1" ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId";

DROP VIEW IF EXISTS apflora.v_tpopkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte."HerkunftTxt" AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop."TPopId" AS "TPop ID",
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
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Kontrolle zuletzt geaendert von",
  array_to_string(array_agg(apflora.tpopkontrzaehl."Anzahl"), ', ') AS "Anzahlen",
  string_agg(apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt", ', ') AS "Zaehleinheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte."BeurteilTxt", ', ') AS "Methoden"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((beob.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode")
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1"."HerkunftId" = apflora.tpop."TPopHerkunft"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
GROUP BY
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Familie",
  beob.adb_eigenschaften."Artname",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte."DomainTxt",
  "tblAdresse_1"."AdrName",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte."HerkunftTxt",
  apflora.pop."PopBekanntSeit",
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
  apflora.tpop."TPopBewirtschaftung",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum",
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr."TPopKontrUeberleb",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt",
  apflora.tpopkontr."TPopKontrUrsach",
  apflora.tpopkontr."TPopKontrUrteil",
  apflora.tpopkontr."TPopKontrAendUms",
  apflora.tpopkontr."TPopKontrAendKontr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr."TPopKontrTxt",
  apflora.tpopkontr."TPopKontrLeb",
  apflora.tpopkontr."TPopKontrLebUmg",
  apflora.tpopkontr."TPopKontrVegTyp",
  apflora.tpopkontr."TPopKontrKonkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt",
  apflora.tpopkontr."TPopKontrHandlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche",
  apflora.tpopkontr."TPopKontrFlaeche",
  apflora.tpopkontr."TPopKontrPlan",
  apflora.tpopkontr."TPopKontrVeg",
  apflora.tpopkontr."TPopKontrNaBo",
  apflora.tpopkontr."TPopKontrUebPfl",
  apflora.tpopkontr."TPopKontrJungPflJN",
  apflora.tpopkontr."TPopKontrVegHoeMax",
  apflora.tpopkontr."TPopKontrVegHoeMit",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."MutWann",
  apflora.tpopkontr."MutWer"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letztesjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letztesjahr AS
SELECT
  apflora.tpop."TPopId",
  max(apflora.tpopkontr."TPopKontrJahr") AS "MaxTPopKontrJahr",
  count(apflora.tpopkontr."TPopKontrId") AS "AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.tpopkontr
    ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId"
WHERE
  (
    apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  )
  OR (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    AND apflora.tpopkontr."TPopKontrJahr" IS NULL
  )
GROUP BY
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letzteid AS
SELECT
  apflora.v_tpopkontr_letztesjahr."TPopId",
  max(apflora.tpopkontr."TPopKontrId") AS "MaxTPopKontrId",
  max(apflora.v_tpopkontr_letztesjahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_letztesjahr
    ON
      (apflora.v_tpopkontr_letztesjahr."MaxTPopKontrJahr" = apflora.tpopkontr."TPopKontrJahr")
      AND (apflora.tpopkontr."TPopId" = apflora.v_tpopkontr_letztesjahr."TPopId")
GROUP BY
  apflora.v_tpopkontr_letztesjahr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_letzteKontrId CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_letzteKontrId AS
SELECT
  apflora.tpop."TPopId",
  apflora.v_tpopkontr_letzteid."MaxTPopKontrId",
  apflora.v_tpopkontr_letzteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_letzteid
    ON apflora.tpop."TPopId" = apflora.v_tpopkontr_letzteid."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr."TPopId",
  max(apflora.tpopber."TPopBerId") AS "MaxTPopBerId",
  max(apflora.tpopber."TPopBerJahr") AS "MaxTPopBerJahr",
  count(apflora.tpopber."TPopBerId") AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr."TPopId" = apflora.tpopber."TPopId"
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber."TPopBerJahr" IS NOT NULL
GROUP BY
  apflora.tpopkontr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  apflora.tpopkontr."TPopKontrId" AS tpopkontrid,
  apflora.tpopkontr."TPopId" AS tpopid,
  CAST(apflora.tpopkontr."TPopKontrGuid" AS varchar(50)) AS tpopkontrguid,
  apflora.tpopkontr."TPopKontrTyp" AS tpopkontrtyp,
  apflora.tpopkontr."TPopKontrJahr" AS tpopkontrjahr,
  apflora.tpopkontr."TPopKontrDatum"::timestamp AS tpopkontrdatum,
  apflora.tpopkontr."TPopKontrBearb" AS tpopkontrbearb,
  apflora.tpopkontr."TPopKontrJungpfl" AS tpopkontrjungpfl,
  apflora.tpopkontr."TPopKontrUeberleb" AS tpopkontrueberleb,
  apflora.tpopkontr."TPopKontrEntwicklung" AS tpopkontrentwicklung,
  apflora.tpopkontr."TPopKontrVitalitaet" AS tpopkontrvitalitaet,
  apflora.tpopkontr."TPopKontrUrsach" AS tpopkontrursach,
  apflora.tpopkontr."TPopKontrUrteil" AS tpopkontrurteil,
  apflora.tpopkontr."TPopKontrAendUms" AS tpopkontraendums,
  apflora.tpopkontr."TPopKontrAendKontr" AS tpopkontraendkontr,
  apflora.tpopkontr."TPopKontrLeb" AS tpopkontrleb,
  apflora.tpopkontr."TPopKontrFlaeche" AS tpopkontrflaeche,
  apflora.tpopkontr."TPopKontrLebUmg" AS tpopkontrlebumg,
  apflora.tpopkontr."TPopKontrVegTyp" AS tpopkontrvegtyp,
  apflora.tpopkontr."TPopKontrKonkurrenz" AS tpopkontrkonkurrenz,
  apflora.tpopkontr."TPopKontrMoosschicht" AS tpopkontrmoosschicht,
  apflora.tpopkontr."TPopKontrKrautschicht" AS tpopkontrkrautschicht,
  apflora.tpopkontr."TPopKontrStrauchschicht" AS tpopkontrstrauchschicht,
  apflora.tpopkontr."TPopKontrBaumschicht" AS tpopkontrbaumschicht,
  apflora.tpopkontr."TPopKontrBodenTyp" AS tpopkontrbodentyp,
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr."TPopKontrBodenHumus" AS tpopkontrbodenhumus,
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS tpopkontrbodenabtrag,
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS tpopkontrwasserhaushalt,
  apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr."TPopKontrUebFlaeche" AS tpopkontruebflaeche,
  apflora.tpopkontr."TPopKontrPlan" AS tpopkontrplan,
  apflora.tpopkontr."TPopKontrVeg" AS tpopkontrveg,
  apflora.tpopkontr."TPopKontrNaBo" AS tpopkontrnabo,
  apflora.tpopkontr."TPopKontrUebPfl" AS tpopkontruebpfl,
  apflora.tpopkontr."TPopKontrJungPflJN" AS tpopkontrjungpfljn,
  apflora.tpopkontr."TPopKontrVegHoeMax" AS tpopkontrveghoemax,
  apflora.tpopkontr."TPopKontrVegHoeMit" AS tpopkontrveghoemit,
  apflora.tpopkontr."TPopKontrGefaehrdung" AS tpopkontrgefaehrdung,
  apflora.tpopkontr."TPopKontrTxt" AS tpopkontrtxt,
  apflora.tpopkontr."MutWann"::timestamp AS mutwann,
  apflora.tpopkontr."MutWer" AS mutwer
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS apartid,
  beob.adb_eigenschaften."Artname" AS artname,
  apflora.ap_bearbstand_werte."DomainTxt" AS apherkunft,
  apflora.ap."ApJahr" AS apjahr,
  apflora.ap_umsetzung_werte."DomainTxt" AS apumsetzung,
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS popguid,
  apflora.pop."PopNr" AS popnr,
  apflora.pop."PopName" AS popname,
  apflora.pop_status_werte."HerkunftTxt" AS popherkunft,
  apflora.pop."PopBekanntSeit" AS popbekanntseit,
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS tpopguid,
  apflora.tpop."TPopNr" AS tpopnr,
  apflora.tpop."TPopGemeinde" AS tpopgemeinde,
  apflora.tpop."TPopFlurname" AS tpopflurname,
  apflora.tpop."TPopXKoord" AS tpopxkoord,
  apflora.tpop."TPopYKoord" AS tpopykoord,
  apflora.tpop."TPopBekanntSeit" AS tpopbekanntseit,
  CAST(apflora.tpopkontr."TPopKontrGuid" AS varchar(50)) AS tpopkontrguid,
  apflora.tpopkontr."TPopKontrJahr" AS tpopkontrjahr,
  apflora.tpopkontr."TPopKontrDatum"::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte."DomainTxt" AS tpopkontrtyp,
  apflora.adresse."AdrName" AS tpopkontrbearb,
  apflora.tpopkontr."TPopKontrUeberleb" AS tpopkontrueberleb,
  apflora.tpopkontr."TPopKontrVitalitaet" AS tpopkontrvitalitaet,
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS tpopkontrentwicklung,
  apflora.tpopkontr."TPopKontrUrsach" AS tpopkontrursach,
  apflora.tpopkontr."TPopKontrUrteil" AS tpopkontrurteil,
  apflora.tpopkontr."TPopKontrAendUms" AS tpopkontraendums,
  apflora.tpopkontr."TPopKontrAendKontr" AS tpopkontraendkontr,
  apflora.tpopkontr."TPopKontrLeb" AS tpopkontrleb,
  apflora.tpopkontr."TPopKontrFlaeche" AS tpopkontrflaeche,
  apflora.tpopkontr."TPopKontrLebUmg" AS tpopkontrlebumg,
  apflora.tpopkontr."TPopKontrVegTyp" AS tpopkontrvegtyp,
  apflora.tpopkontr."TPopKontrKonkurrenz" AS tpopkontrkonkurrenz,
  apflora.tpopkontr."TPopKontrMoosschicht" AS tpopkontrmoosschicht,
  apflora.tpopkontr."TPopKontrKrautschicht" AS tpopkontrkrautschicht,
  apflora.tpopkontr."TPopKontrStrauchschicht" AS tpopkontrstrauchschicht,
  apflora.tpopkontr."TPopKontrBaumschicht" AS tpopkontrbaumschicht,
  apflora.tpopkontr."TPopKontrBodenTyp" AS tpopkontrbodentyp,
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr."TPopKontrBodenHumus" AS tpopkontrbodenhumus,
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS tpopkontrbodenabtrag,
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS tpopkontrwasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr."TPopKontrUebFlaeche" AS tpopkontruebflaeche,
  apflora.tpopkontr."TPopKontrPlan" AS tpopkontrplan,
  apflora.tpopkontr."TPopKontrVeg" AS tpopkontrveg,
  apflora.tpopkontr."TPopKontrNaBo" AS tpopkontrnabo,
  apflora.tpopkontr."TPopKontrUebPfl" AS tpopkontruebpfl,
  apflora.tpopkontr."TPopKontrJungPflJN" AS tpopkontrjungpfljn,
  apflora.tpopkontr."TPopKontrVegHoeMax" AS tpopkontrveghoemax,
  apflora.tpopkontr."TPopKontrVegHoeMit" AS tpopkontrveghoemit,
  apflora.tpopkontr."TPopKontrGefaehrdung" AS tpopkontrgefaehrdung,
  apflora.tpopkontr."MutWann"::timestamp AS mutwann,
  apflora.tpopkontr."MutWer" AS mutwer
FROM
  (((((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        LEFT JOIN
          apflora.pop_entwicklung_werte
          ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";


DROP VIEW IF EXISTS apflora.v_tpopkontr_verwaist CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_verwaist AS
SELECT
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Datensatz zuletzt geaendert von"
FROM
  (apflora.tpop
  RIGHT JOIN
    (((apflora.tpopkontr
    LEFT JOIN
      apflora.tpopkontr_typ_werte
      ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
    LEFT JOIN
      apflora.adresse
      ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.pop_entwicklung_werte
      ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
    ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode"
WHERE
  apflora.tpop."TPopId" IS NULL;

DROP VIEW IF EXISTS apflora.v_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  beob.beob.id,
  beob.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId",
  beob.beob."ArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  beob.beob."X",
  beob.beob."Y",
  CASE
    WHEN
      beob.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND beob.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((beob.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((beob.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  beob.beob."Datum",
  beob.beob."Autor",
  apflora.beobzuordnung."BeobNichtZuordnen",
  apflora.beobzuordnung."BeobBemerkungen",
  apflora.beobzuordnung."BeobMutWann",
  apflora.beobzuordnung."BeobMutWer"
FROM
  ((((beob.beob
  INNER JOIN
    beob.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = beob.beob."ArtId")
  INNER JOIN
    beob.adb_eigenschaften
    ON beob.beob."ArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    beob.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.beobzuordnung
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.beobzuordnung."TPopId"
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.beobzuordnung."BeobId" = beob.beob.id
WHERE
  beob.beob."ArtId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  beob.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_beob__mit_data CASCADE;
CREATE OR REPLACE VIEW apflora.v_beob__mit_data AS
SELECT
  beob.beob.id,
  beob.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId",
  beob.beob."ArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  beob.beob."X",
  beob.beob."Y",
  CASE
    WHEN
      beob.beob."X" > 0
      AND apflora.tpop."TPopXKoord" > 0
      AND beob.beob."Y" > 0
      AND apflora.tpop."TPopYKoord" > 0
    THEN
      round(
        sqrt(
          power((beob.beob."X" - apflora.tpop."TPopXKoord"), 2) +
          power((beob.beob."Y" - apflora.tpop."TPopYKoord"), 2)
        )
      )
    ELSE
      NULL
  END AS "Distanz zur Teilpopulation (m)",
  beob.beob."Datum",
  beob.beob."Autor",
  apflora.beobzuordnung."BeobNichtZuordnen",
  apflora.beobzuordnung."BeobBemerkungen",
  apflora.beobzuordnung."BeobMutWann",
  apflora.beobzuordnung."BeobMutWer",
  beob.beob.data AS "Originaldaten"
FROM
  ((((beob.beob
  INNER JOIN
    beob.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ap
    ON apflora.ap."ApArtId" = beob.beob."ArtId")
  INNER JOIN
    beob.adb_eigenschaften
    ON beob.beob."ArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    beob.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.beobzuordnung
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.beobzuordnung."TPopId"
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.beobzuordnung."BeobId" = beob.beob.id
WHERE
  beob.beob."ArtId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  beob.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr."TPopKontrId",
  max(apflora.tpopkontrzaehl."Anzahl") AS "Anzahl"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
GROUP BY
  apflora.tpopkontr."TPopKontrId"
ORDER BY
  apflora.tpopkontr."TPopKontrId";

-- v_exportevab_beob is in viewsGenerieren2 because dependant on v_tpopkontr_maxanzahl

DROP VIEW IF EXISTS apflora.v_exportevab_zeit CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_zeit AS
SELECT
  concat(
    '{',
    apflora.tpop."TPopGuid",
    '}'
  ) AS "fkOrt",
  concat(
    '{',
    apflora.tpopkontr."ZeitGuid",
    '}'
  ) AS "idZeitpunkt",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN to_char(apflora.tpopkontr."TPopKontrDatum", 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        apflora.tpopkontr."TPopKontrJahr"
      )
  END AS "Datum",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN 'T'
    ELSE 'J'
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN 'P'
    ELSE 'X'
  END AS "fkGenauigkeitDatumZDSF",
  substring(apflora.tpopkontr."TPopKontrMoosschicht" from 1 for 10) AS "COUV_MOUSSES",
  substring(apflora.tpopkontr."TPopKontrKrautschicht" from 1 for 10) AS "COUV_HERBACEES",
  substring(apflora.tpopkontr."TPopKontrStrauchschicht" from 1 for 10) AS "COUV_BUISSONS",
  substring(apflora.tpopkontr."TPopKontrBaumschicht" from 1 for 10) AS "COUV_ARBRES"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS "tpopHerkunft"
        ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
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
  );

DROP VIEW IF EXISTS apflora.v_exportevab_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  concat('{', apflora.pop."PopGuid", '}') AS "fkRaum",
  concat('{', apflora.tpop."TPopGuid", '}') AS "idOrt",
  substring(
    concat(
      apflora.tpop."TPopFlurname",
      CASE
        WHEN apflora.tpop."TPopNr" IS NOT NULL
        THEN concat(' (Nr. ', apflora.tpop."TPopNr", ')')
        ELSE ''
      END
    ) from 1 for 40
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}' AS "fkAutor",
  substring(max(apflora.tpopkontr."TPopKontrLeb") from 1 for 9) AS "fkLebensraumtyp",
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
  substring(apflora.tpop."TPopGemeinde" from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop."TPopFlurname" from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr."TPopKontrLebUmg") AS "ENV",
  CASE
    WHEN apflora.tpop."TPopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "tpopHerkunft"."HerkunftTxt",
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
        AS "tpopHerkunft" ON apflora.tpop."TPopHerkunft" = "tpopHerkunft"."HerkunftId")
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
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
GROUP BY
  apflora.pop."PopGuid",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  "tpopHerkunft"."HerkunftTxt",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_exportevab_raum CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_raum AS
SELECT
  concat('{', apflora.ap."ApGuid", '}') AS "fkProjekt",
  concat('{', apflora.pop."PopGuid", '}') AS "idRaum",
  concat(
    apflora.pop."PopName",
    CASE
      WHEN apflora.pop."PopNr" IS NOT NULL
      THEN concat(' (Nr. ', apflora.pop."PopNr", ')')
      ELSE ''
    END
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}' AS "fkAutor",
  CASE
    WHEN apflora.pop."PopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "popHerkunft"."HerkunftTxt",
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
      ON apflora.pop."PopHerkunft" = "popHerkunft"."HerkunftId")
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
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
GROUP BY
  apflora.ap."ApGuid",
  apflora.pop."PopGuid",
  apflora.pop."PopName",
  apflora.pop."PopNr",
  apflora.pop."PopHerkunft",
  "popHerkunft"."HerkunftTxt",
  apflora.pop."PopBekanntSeit";

DROP VIEW IF EXISTS apflora.v_exportevab_projekt CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  concat('{', apflora.ap."ApGuid", '}') AS "idProjekt",
  concat('AP Flora ZH: ', beob.adb_eigenschaften."Artname") AS "Name",
  CASE
    WHEN apflora.ap."ApJahr" IS NOT NULL
    THEN concat('01.01.', apflora.ap."ApJahr")
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}' AS "fkAutor",
  concat(
    'Aktionsplan: ',
    apflora.ap_bearbstand_werte."DomainTxt",
    CASE
      WHEN apflora.ap."ApJahr" IS NOT NULL
      THEN concat('; Start im Jahr: ', apflora.ap."ApJahr")
      ELSE ''
    END,
    CASE
      WHEN apflora.ap."ApUmsetzung" IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte."DomainTxt")
      ELSE ''
    END,
    ''
  ) AS "Bemerkungen"
FROM
  (((apflora.ap
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  INNER JOIN
    beob.adb_eigenschaften
    ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft"."HerkunftId")
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
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
GROUP BY
  beob.adb_eigenschaften."Artname",
  apflora.ap."ApGuid",
  apflora.ap."ApJahr",
  apflora.ap."ApUmsetzung",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap_umsetzung_werte."DomainTxt";

DROP VIEW IF EXISTS apflora.v_tpopmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber."MutWann" AS "TPopMassnBer MutWann",
  apflora.tpopmassnber."MutWer" AS "TPopMassnBer MutWer"
FROM
  beob.adb_eigenschaften
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
            ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
          ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  concat(
    apflora.pop."PopNr",
    '/',
    apflora.tpop."TPopNr"
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop."TPopNr",
      ' ',
      apflora.tpop."TPopGemeinde",
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
    'http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.tpop."TPopId"
  ) AS "URL"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" > 0
  AND apflora.tpop."TPopXKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_tpop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  concat(
    beob.adb_eigenschaften."Artname",
    ' ',
    apflora.pop."PopNr",
    '/',
    apflora.tpop."TPopNr"
  ) AS "Label",
  substring(
    concat(
      'Population: ',
      apflora.pop."PopNr",
      ' ',
      apflora.pop."PopName",
      '<br /> Teilpopulation: ',
      apflora.tpop."TPopNr",
      ' ',
      apflora.tpop."TPopGemeinde",
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
    'http://www.apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.tpop."TPopId"
  ) AS "URL"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopYKoord" > 0
  AND apflora.tpop."TPopXKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kml CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
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
    'http://www.apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId"
  ) AS "URL"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" > 0
  AND apflora.pop."PopXKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName";

-- -- ::numeric is needed or else all koordinates are same value!!!
DROP VIEW IF EXISTS apflora.v_pop_kmlnamen CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  concat(
    beob.adb_eigenschaften."Artname",
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
    'http://www.apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId"
  ) AS "URL"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.pop."PopYKoord" > 0
  AND apflora.pop."PopXKoord" > 0
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte."HerkunftTxt" AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
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
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "Kontr Entwicklung",
  apflora.tpopkontr."TPopKontrUrsach" AS "Kontr Ursachen",
  apflora.tpopkontr."TPopKontrUrteil" AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr."TPopKontrAendUms" AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr."TPopKontrAendKontr" AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr."TPopKontrTxt" AS "Kontr Bemerkungen",
  apflora.tpopkontr."TPopKontrLeb" AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrLebUmg" AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr."TPopKontrVegTyp" AS "Kontr Vegetationstyp",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "Kontr Konkurrenz",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "Kontr Moosschicht",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "Kontr Krautschicht",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "Kontr Strauchschicht",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "Kontr Baumschicht",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "Kontr Bodentyp",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "Kontr Handlungsbedarf",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr."TPopKontrFlaeche" AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr."TPopKontrPlan" AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr."TPopKontrVeg" AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr."TPopKontrNaBo" AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr."TPopKontrUebPfl" AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "Kontr Gefaehrdung",
  apflora.tpopkontr."MutWann" AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr."MutWer" AS "Kontrolle zuletzt geaendert von",
  apflora.tpopkontrzaehl."TPopKontrZaehlId",
  apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt" AS "Zaehleinheit",
  apflora.tpopkontrzaehl_methode_werte."BeurteilTxt" AS "Methode",
  apflora.tpopkontrzaehl."Anzahl"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS "tblAdresse_1"
      ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
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
        ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON "tpopHerkunft"."HerkunftId" = apflora.tpop."TPopHerkunft")
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte."DomainCode")
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.pop_entwicklung_werte."EntwicklungId")
          INNER JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";

DROP VIEW IF EXISTS apflora.v_tpopber CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.tpopber."TPopBerId" AS "TPopBer Id",
  apflora.tpopber."TPopBerJahr" AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber."TPopBerTxt" AS "TPopBer Bemerkungen",
  apflora.tpopber."MutWann" AS "TPopBer MutWann",
  apflora.tpopber."MutWer" AS "TPopBer MutWer"
FROM
  beob.adb_eigenschaften
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
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId")
          ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber."TPopBerJahr",
  pop_entwicklung_werte."EntwicklungTxt";

DROP VIEW IF EXISTS apflora.v_tpop_berjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_berjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerJahr" as "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber."TPopId"
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber."TPopMassnBerJahr" as "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId"
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber."TPopId"
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber."TPopMassnBerJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId"
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrJahr" AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId"
ORDER BY
  "Jahr";

/*diese Abfrage noetig, weil in Access die "NO_NOTE" zw. beobzuordnung (Text) und beob_infospezies (Zahl) nicht verbunden werden kann*/
DROP VIEW IF EXISTS apflora.v_beobzuordnung_infospeziesapanzmut CASCADE;
CREATE OR REPLACE VIEW apflora.v_beobzuordnung_infospeziesapanzmut AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.beobzuordnung."BeobMutWer",
  apflora.beobzuordnung."BeobMutWann",
  count(apflora.beobzuordnung."BeobId") AS "AnzMut",
  'tblBeobZuordnung_Infospezies' AS "Tabelle"
FROM
  ((apflora.ap
  INNER JOIN
    beob.adb_eigenschaften
    ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    beob.beob
    ON apflora.ap."ApArtId" = beob.beob."ArtId")
  INNER JOIN
    apflora.beobzuordnung
    ON beob.beob.id = apflora.beobzuordnung."BeobId"
WHERE
  apflora.ap."ApArtId" > 150
GROUP BY
  beob.adb_eigenschaften."Artname",
  apflora.beobzuordnung."BeobMutWer",
  apflora.beobzuordnung."BeobMutWann";

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
    ON apflora.pop."PopId" = apflora.tpop."PopId"
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
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.pop."PopHerkunft" = 100
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS apflora.v_tpop_ohneapberichtrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohneapberichtrelevant AS
SELECT
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopApBerichtRelevant"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId")
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
  AND apflora.ap."ApArtId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_popnrtpopnrmehrdeutig AS
SELECT
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  count(apflora.tpop."TPopId") AS "AnzahlvonTPopId",
  array_to_string(array_agg(distinct apflora.tpop."TPopId" ORDER BY apflora.tpop."TPopId"), ', ') AS TPopIds,
  string_agg(
    distinct
    concat(
      'http://apflora.ch/index.html?ap=',
      apflora.ap."ApArtId",
      '&pop=',
      apflora.tpop."PopId",
      '&tpop=',
      apflora.tpop."TPopId"
    ),
    ', '
  ) AS "TPopUrls"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId")
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApArtId" > 150
GROUP BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr"
HAVING
  count(apflora.tpop."TPopId") > 1
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation: Die Kombination von Pop.-Nr. und TPop.-Nr. ist mehrdeutig:'::text AS "hw",
  string_agg(
    distinct
    concat(
      '<a href="http://apflora.ch/index.html?ap=',
      apflora.ap."ApArtId",
      '&pop=',
      apflora.pop."PopId",
      '&tpop=',
      apflora.tpop."TPopId",
      '" target="_blank">',
      COALESCE(
        concat('Pop: ', apflora.pop."PopNr"),
        concat('Pop: id=', apflora.pop."PopId")
      ),
      ' > TPop: ',
      apflora.tpop."TPopNr",
      ' (id=', apflora.tpop."TPopId", ')',
      '</a>'
    ),
    '<br> '
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr"
HAVING
  count(apflora.tpop."TPopId") > 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_popnrtpopnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_popnrtpopnrmehrdeutig AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Die Kombination von Pop.-Nr. und TPop.-Nr. ist mehrdeutig:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr"
HAVING
  count(apflora.tpop."TPopId") > 1;

DROP VIEW IF EXISTS apflora.v_qk_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_popnrmehrdeutig AS
SELECT
  apflora.ap."ApArtId",
  'Population: Die Nr. ist mehrdeutig:'::text AS "hw",
  string_agg(
    DISTINCT
    concat(
      '<a href="http://apflora.ch/index.html?ap=',
      apflora.ap."ApArtId",
      '&pop=',
      apflora.pop."PopId",
      '" target="_blank">',
      COALESCE(
        concat('Pop: ', apflora.pop."PopNr", ' (id=', apflora.pop."PopId", ')'),
        concat('Pop: id=', apflora.pop."PopId")
      ),
      '</a>'
    ),
    '<br> '
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr"
HAVING
  count(apflora.pop."PopId") > 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_popnrmehrdeutig CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_popnrmehrdeutig AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population: Die Nr. ist mehrdeutig:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr"
HAVING
  count(apflora.pop."PopId") > 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnekoord AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population: Mindestens eine Koordinate fehlt:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnekoord AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population: Mindestens eine Koordinate fehlt:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopXKoord" IS NULL
  OR apflora.pop."PopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnepopnr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnepopnr AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population ohne Nr.:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopName"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopnr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopnr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Nr.:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopName";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnepopname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnepopname AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population ohne Name:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Name:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopName" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnepopstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnepopstatus AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population ohne Status:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopstatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnepopstatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Status:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population ohne "bekannt seit":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=', apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnebekanntseit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne "bekannt seit":'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population mit "Status unklar", ohne Begruendung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
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

DROP VIEW IF EXISTS apflora.v_qk2_pop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population mit "Status unklar", ohne Begruendung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunftUnklar" = 1
  AND apflora.pop."PopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_ohnetpop AS
SELECT
  apflora.ap."ApArtId" AS "ApArtId",
  'Population ohne Teilpopulation:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopId" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_ohnetpop AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Population ohne Teilpopulation:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopId" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohnenr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohnenr AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne Nr.:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopFlurname"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnenr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnenr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Nr.:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopNr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohneflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohneflurname AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne Flurname:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopFlurname" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneflurname CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneflurname AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Flurname:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopFlurname" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohnestatus AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne Status:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnestatus AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne Status:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "bekannt seit":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnebekanntseit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnebekanntseit AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "bekannt seit":'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopBekanntSeit" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohneapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohneapberrelevant AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation ohne "Fuer AP-Bericht relevant":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohneapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation ohne "Fuer AP-Bericht relevant":'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopApBerichtRelevant" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_statuspotentiellfuerapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_statuspotentiellfuerapberrelevant AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopApBerichtRelevant" = 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopApBerichtRelevant" = 1
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation mit "Status unklar", ohne Begruendung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunftUnklar" = 1
  AND apflora.tpop."TPopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusunklarohnebegruendung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusunklarohnebegruendung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation mit "Status unklar", ohne Begruendung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunftUnklar" = 1
  AND apflora.tpop."TPopHerkunftUnklarBegruendung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_tpop_ohnekoordinaten CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_ohnekoordinaten AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulation: Mindestens eine Koordinate fehlt:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopXKoord" IS NULL
  OR apflora.tpop."TPopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnekoordinaten CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_ohnekoordinaten AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulation: Mindestens eine Koordinate fehlt:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopXKoord" IS NULL
  OR apflora.tpop."TPopYKoord" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_qk_massn_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_massn_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopmassn=',
    apflora.tpopmassn."TPopMassnId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    concat(' > Massn.-ID: ', apflora.tpopmassn."TPopMassnId"),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnId";

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahme ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn."TPopMassnId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopmassn."TPopMassnId"
HAVING
  apflora.tpopmassn."TPopMassnJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnId";

DROP VIEW IF EXISTS apflora.v_qk_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_massn_ohnetyp AS
SELECT
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopmassn=',
    apflora.tpopmassn."TPopMassnId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > MassnJahr: ', apflora.tpopmassn."TPopMassnJahr"),
      concat(' > Massn.-ID: ', apflora.tpopmassn."TPopMassnId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopmassn."TPopMassnJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassn."TPopMassnTyp" IS NULL
  AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnJahr",
  apflora.tpopmassn."TPopMassnId";

DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massn_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen ohne Typ:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen', apflora.tpopmassn."TPopMassnId"]::text[]) AS "url",
  apflora.tpopmassn."TPopMassnJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassn
        ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopmassn."TPopMassnId"
HAVING
  apflora.tpopmassn."TPopMassnTyp" IS NULL
  AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassn."TPopMassnJahr",
  apflora.tpopmassn."TPopMassnId";

DROP VIEW IF EXISTS apflora.v_qk_massnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_massnber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopmassnber=',
    apflora.tpopmassnber."TPopMassnBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > MassnBerJahr: ', apflora.tpopmassnber."TPopMassnBerJahr"),
      concat(' > MassnBer.-ID: ', apflora.tpopmassnber."TPopMassnBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber."TPopMassnBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr",
  apflora.tpopmassnber."TPopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber."TPopMassnBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopmassnber."TPopMassnBerId"
HAVING
  apflora.tpopmassnber."TPopMassnBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr",
  apflora.tpopmassnber."TPopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk_massnber_ohneerfbeurt CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_massnber_ohneerfbeurt AS
SELECT
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Entwicklung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopmassnber=',
    apflora.tpopmassnber."TPopMassnBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > MassnBerJahr: ', apflora.tpopmassnber."TPopMassnBerJahr"),
      concat(' > MassnBer.-ID: ', apflora.tpopmassnber."TPopMassnBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopmassnber."TPopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.tpopmassnber."TPopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr",
  apflora.tpopmassnber."TPopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_massnber_ohneerfbeurt AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Massnahmen-Bericht ohne Entwicklung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Massnahmen-Berichte', apflora.tpopmassnber."TPopMassnBerId"]::text[]) AS "url",
  apflora.tpopmassnber."TPopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopmassnber
        ON apflora.tpop."TPopId" = apflora.tpopmassnber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopmassnber."TPopMassnBerId"
HAVING
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.tpopmassnber."TPopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber."TPopMassnBerJahr",
  apflora.tpopmassnber."TPopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId"
HAVING
  apflora.tpopkontr."TPopKontrJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_freiwkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfreiwkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr."TPopKontrJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId"
HAVING
  apflora.tpopkontr."TPopKontrJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontr_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    OR apflora.tpopkontr."TPopKontrTyp" = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId"
HAVING
  (
    apflora.tpopkontr."TPopKontrTyp" IS NULL
    OR apflora.tpopkontr."TPopKontrTyp" = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."TPopKontrZaehlId" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."TPopKontrZaehlId" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_freiwkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfreiwkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."TPopKontrZaehlId" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."TPopKontrZaehlId" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Zaehleinheit" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Zaehleinheit" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_freiwkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfreiwkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Zaehleinheit" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Zaehleinheit" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Methode" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Methode" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_freiwkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfreiwkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Methode" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Methode" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_feldkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfeldkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Anzahl" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Anzahl" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_freiwkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopfreiwkontr=',
    apflora.tpopkontr."TPopKontrId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > KontrJahr: ', apflora.tpopkontr."TPopKontrJahr"),
      concat(' > Kontr.-ID: ', apflora.tpopkontr."TPopKontrId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl."Anzahl" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl."TPopKontrZaehlId"]::text[]) AS "url",
  apflora.tpopkontr."TPopKontrJahr" AS "Berichtjahr"
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl."TPopKontrZaehlId"
HAVING
  apflora.tpopkontrzaehl."Anzahl" IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrId";

DROP VIEW IF EXISTS apflora.v_qk_tpopber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpopber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopber=',
    apflora.tpopber."TPopBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > "TPopBerJahr": ', apflora.tpopber."TPopBerJahr"),
      concat(' > TPopBer.-ID: ', apflora.tpopber."TPopBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber."TPopBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber."TPopBerJahr",
  apflora.tpopber."TPopBerId";

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber."TPopBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerId"
HAVING
  apflora.tpopber."TPopBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber."TPopBerJahr",
  apflora.tpopber."TPopBerId";

DROP VIEW IF EXISTS apflora.v_qk_tpopber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpopber_ohneentwicklung AS
SELECT
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Entwicklung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '&tpopber=',
    apflora.tpopber."TPopBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop.-ID: ', apflora.tpop."TPopId")
    ),
    COALESCE(
      concat(' > "TPopBerJahr": ', apflora.tpopber."TPopBerJahr"),
      concat(' > TPopBer.-ID: ', apflora.tpopber."TPopBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.tpopber."TPopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" IS NULL
  AND apflora.tpopber."TPopBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber."TPopBerJahr",
  apflora.tpopber."TPopBerId";

DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpopber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Teilpopulations-Bericht ohne Entwicklung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Kontroll-Berichte', apflora.tpopber."TPopBerId"]::text[]) AS "url",
  apflora.tpopber."TPopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopber
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopber."TPopBerId"
HAVING
  apflora.tpopber."TPopBerEntwicklung" IS NULL
  AND apflora.tpopber."TPopBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber."TPopBerJahr",
  apflora.tpopber."TPopBerId";

DROP VIEW IF EXISTS apflora.v_qk_popber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_popber_ohneentwicklung AS
SELECT
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Entwicklung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&popber=',
    apflora.popber."PopBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > "PopBerJahr": ', apflora.popber."PopBerJahr"),
      concat(' > PopBer.-ID: ', apflora.popber."PopBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.popber."PopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" IS NULL
  AND apflora.popber."PopBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  apflora.popber."PopBerId";

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Entwicklung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[]) AS "url",
  apflora.popber."PopBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerId"
HAVING
  apflora.popber."PopBerEntwicklung" IS NULL
  AND apflora.popber."PopBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  apflora.popber."PopBerId";

DROP VIEW IF EXISTS apflora.v_qk_popber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_popber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&popber=',
    apflora.popber."PopBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > "PopBerJahr": ', apflora.popber."PopBerJahr"),
      concat(' > PopBer.-ID: ', apflora.popber."PopBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popber."PopBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  apflora.popber."PopBerId";

DROP VIEW IF EXISTS apflora.v_qk2_popber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Kontroll-Berichte', apflora.popber."PopBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerId"
HAVING
  apflora.popber."PopBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  apflora.popber."PopBerId";

DROP VIEW IF EXISTS apflora.v_qk_popmassnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_popmassnber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&popmassnber=',
    apflora.popmassnber."PopMassnBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > "PopMassnBerJahr": ', apflora.popmassnber."PopMassnBerJahr"),
      concat(' > PopMassnBer.-ID: ', apflora.popmassnber."PopMassnBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr",
  apflora.popmassnber."PopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerId"
HAVING
  apflora.popmassnber."PopMassnBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr",
  apflora.popmassnber."PopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk_popmassnber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_popmassnber_ohneentwicklung AS
SELECT
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Entwicklung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&popmassnber=',
    apflora.popmassnber."PopMassnBerId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop.-ID: ', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > "PopMassnBerJahr": ', apflora.popmassnber."PopMassnBerJahr"),
      concat(' > PopMassnBer.-ID: ', apflora.popmassnber."PopMassnBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.popmassnber."PopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr",
  apflora.popmassnber."PopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_popmassnber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Populations-Massnahmen-Bericht ohne Entwicklung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Massnahmen-Berichte', apflora.popmassnber."PopMassnBerId"]::text[]) AS "url",
  apflora.popmassnber."PopMassnBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.popmassnber
      ON apflora.pop."PopId" = apflora.popmassnber."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popmassnber."PopMassnBerId"
HAVING
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" IS NULL
  AND apflora.popmassnber."PopMassnBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.popmassnber."PopMassnBerJahr",
  apflora.popmassnber."PopMassnBerId";

DROP VIEW IF EXISTS apflora.v_qk_zielber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&apziel=',
    apflora.ziel."ZielId",
    '&zielber=',
    apflora.zielber."ZielBerId",
    '" target="_blank">',
    COALESCE(
      concat('"ZielJahr": ', apflora.ziel."ZielJahr", ' (id=', apflora.ziel."ZielId", ')'),
      concat('Ziel.-ID: ', apflora.ziel."ZielId")
    ),
    COALESCE(
      concat(' > "ZielBerJahr": ', apflora.zielber."ZielBerJahr"),
      concat(' > ZielBer.-ID: ', apflora.zielber."ZielBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.zielber."ZielBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId")
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber."ZielBerErreichung" IS NULL
  AND apflora.zielber."ZielBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr",
  apflora.zielber."ZielBerId";

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohneentwicklung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Entwicklung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber."ZielBerId"]::text[]) AS "url",
  apflora.zielber."ZielBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId")
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerId"
HAVING
  apflora.zielber."ZielBerErreichung" IS NULL
  AND apflora.zielber."ZielBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr",
  apflora.zielber."ZielBerId";

DROP VIEW IF EXISTS apflora.v_qk_zielber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_zielber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&apziel=',
    apflora.ziel."ZielId",
    '&zielber=',
    apflora.zielber."ZielBerId",
    '" target="_blank">',
    COALESCE(
      concat('"ZielJahr": ', apflora.ziel."ZielJahr", ' (id=', apflora.ziel."ZielId", ')'),
      concat('Ziel.-ID: ', apflora.ziel."ZielId")
    ),
    COALESCE(
      concat(' > "ZielBerJahr": ', apflora.zielber."ZielBerJahr"),
      concat(' > ZielBer.-ID: ', apflora.zielber."ZielBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId")
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.zielber."ZielBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr",
  apflora.zielber."ZielBerId";

DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_zielber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId", 'Berichte', apflora.zielber."ZielBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.ziel
    INNER JOIN
      apflora.zielber
      ON apflora.ziel."ZielId" = apflora.zielber."ZielId")
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerId"
HAVING
  apflora.zielber."ZielBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId",
  apflora.zielber."ZielBerJahr",
  apflora.zielber."ZielBerId";

DROP VIEW IF EXISTS apflora.v_qk_ziel_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_ziel_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&apziel=',
    apflora.ziel."ZielId",
    '" target="_blank">',
    COALESCE(
      concat('"ZielJahr": ', apflora.ziel."ZielJahr", ' (id=', apflora.ziel."ZielId", ')'),
      concat('Ziel.-ID: ', apflora.ziel."ZielId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielId"
HAVING
  apflora.ziel."ZielJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk_ziel_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_ziel_ohnetyp AS
SELECT
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&apziel=',
    apflora.ziel."ZielId",
    '" target="_blank">',
    COALESCE(
      concat('"ZielJahr": ', apflora.ziel."ZielJahr", ' (id=', apflora.ziel."ZielId", ')'),
      concat('Ziel.-ID: ', apflora.ziel."ZielId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielTyp" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Typ:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielId"
HAVING
  apflora.ziel."ZielTyp" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk_ziel_ohneziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_ziel_ohneziel AS
SELECT
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&apziel=',
    apflora.ziel."ZielId",
    '" target="_blank">',
    COALESCE(
      concat('"ZielJahr": ', apflora.ziel."ZielJahr", ' (id=', apflora.ziel."ZielId", ')'),
      concat('Ziel.-ID: ', apflora.ziel."ZielId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
WHERE
  apflora.ziel."ZielBezeichnung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_ziel_ohneziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Ziel ohne Ziel:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Ziele', apflora.ziel."ZielId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.ziel
    ON apflora.ap."ApArtId" = apflora.ziel."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielId"
HAVING
  apflora.ziel."ZielBezeichnung" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.ziel."ZielJahr",
  apflora.ziel."ZielId";

DROP VIEW IF EXISTS apflora.v_qk_erfkrit_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&erfkrit=',
    apflora.erfkrit."ErfkritId",
    '" target="_blank">',
    concat('Erfkrit.-ID: ', apflora.erfkrit."ErfkritId"),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
WHERE
  apflora.erfkrit."ErfkritErreichungsgrad" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Beurteilung:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit."ErfkritId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId"
HAVING
  apflora.erfkrit."ErfkritErreichungsgrad" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk_erfkrit_ohnekriterien CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&erfkrit=',
    apflora.erfkrit."ErfkritId",
    '" target="_blank">',
    concat('Erfkrit.-ID: ', apflora.erfkrit."ErfkritId"),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
WHERE
  apflora.erfkrit."ErfkritTxt" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_erfkrit_ohnekriterien AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Erfolgskriterium ohne Kriterien:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Erfolgskriterien', apflora.erfkrit."ErfkritId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.erfkrit
    ON apflora.ap."ApArtId" = apflora.erfkrit."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId"
HAVING
  apflora.erfkrit."ErfkritTxt" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.erfkrit."ErfkritId";

DROP VIEW IF EXISTS apflora.v_qk_apber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_apber_ohnejahr AS
SELECT
  apflora.ap."ApArtId",
  'AP-Bericht ohne Jahr:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&jber=',
    apflora.apber."JBerId",
    '" target="_blank">',
    COALESCE(
      concat('Jahr: ', apflora.apber."JBerJahr", ' (id=', apflora.apber."JBerId", ')'),
      concat('AP-Ber.-ID: ', apflora.apber."JBerId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnejahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Jahr:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber."JBerId"
HAVING
  apflora.apber."JBerJahr" IS NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk_apber_ohnevergleichvorjahrgesamtziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_apber_ohnevergleichvorjahrgesamtziel AS
SELECT
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&jber=',
    apflora.apber."JBerId",
    '" target="_blank">',
    COALESCE(
      concat('Jahr: ', apflora.apber."JBerJahr", ' (id=', apflora.apber."JBerId", ')'),
      concat('AP-Ber.-ID: ', apflora.apber."JBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerVergleichVorjahrGesamtziel" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[]) AS "url",
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber."JBerId"
HAVING
  apflora.apber."JBerVergleichVorjahrGesamtziel" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk_apber_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_apber_ohnebeurteilung AS
SELECT
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&jber=',
    apflora.apber."JBerId",
    '" target="_blank">',
    COALESCE(
      concat('Jahr: ', apflora.apber."JBerJahr", ' (id=', apflora.apber."JBerId", ')'),
      concat('AP-Ber.-ID: ', apflora.apber."JBerId")
    ),
    '</a>'
  ) AS "link",
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.apber."JBerBeurteilung" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";

DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnebeurteilung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_apber_ohnebeurteilung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'AP-Berichte', apflora.apber."JBerId"]::text[]) AS "url",
  apflora.apber."JBerJahr" AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.apber."JBerId"
HAVING
  apflora.apber."JBerBeurteilung" IS NULL
  AND apflora.apber."JBerJahr" IS NOT NULL
ORDER BY
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerId";


DROP VIEW IF EXISTS apflora.v_qk_assozart_ohneart CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_assozart_ohneart AS
SELECT
  apflora.ap."ApArtId",
  'Assoziierte Art ohne Art:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&assozarten=',
    apflora.assozart."AaId",
    '" target="_blank">',
    concat('Assoz.-Art-ID: ', apflora.assozart."AaId"),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    apflora.assozart
    ON apflora.ap."ApArtId" = apflora.assozart."AaApArtId"
WHERE
  apflora.assozart."AaSisfNr" IS NULL
  OR apflora.assozart."AaSisfNr" = 0
ORDER BY
  apflora.ap."ApArtId",
  apflora.assozart."AaId";


DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_assozart_ohneart AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Assoziierte Art ohne Art:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'assoziierte-Arten', apflora.assozart."AaId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.assozart
    ON apflora.ap."ApArtId" = apflora.assozart."AaApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.assozart."AaId"
HAVING
  apflora.assozart."AaSisfNr" IS NULL
  OR apflora.assozart."AaSisfNr" = 0
ORDER BY
  apflora.ap."ApArtId",
  apflora.assozart."AaId";

DROP VIEW IF EXISTS apflora.v_qk_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Koordinaten entsprechen keiner Teilpopulation:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link",
  apflora.pop."PopXKoord" AS "XKoord",
  apflora.pop."PopYKoord" AS "YKoord"
FROM
  apflora.pop
WHERE
  apflora.pop."PopXKoord" Is NOT Null
  AND apflora.pop."PopYKoord" IS NOT NULL
  AND apflora.pop."PopId" NOT IN (
    SELECT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopXKoord" = "PopXKoord"
      AND apflora.tpop."TPopYKoord" = "PopYKoord"
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_koordentsprechenkeinertpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_koordentsprechenkeinertpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Koordinaten entsprechen keiner Teilpopulation:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url",
  apflora.pop."PopXKoord" AS "XKoord",
  apflora.pop."PopYKoord" AS "YKoord"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopXKoord" Is NOT Null
  AND apflora.pop."PopYKoord" IS NOT NULL
  AND apflora.pop."PopId" NOT IN (
    SELECT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopXKoord" = "PopXKoord"
      AND apflora.tpop."TPopYKoord" = "PopYKoord"
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 101, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
    INNER JOIN apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.pop."PopHerkunft" = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" NOT IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchalletpoperloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchalletpoperloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.pop."PopHerkunft" = 201
  AND EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" NOT IN (101, 202, 211)
      AND apflora.tpop."PopId" = apflora.pop."PopId"
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statusansaatversuchmittpopursprerloschen CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statusansaatversuchmittpopursprerloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" = 201
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 101
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );


  DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen CASCADE;
  CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen AS
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen":'::text AS "hw",
    array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  GROUP BY
    apflora.ap."ApArtId",
    apflora.pop."PopId"
  HAVING
    apflora.pop."PopHerkunft" = 201
    AND apflora.pop."PopId" IN (
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopHerkunft" = 101
    );

DROP VIEW IF EXISTS apflora.v_qk_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):'::text AS "hw",
    array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 201
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopansaatversuch CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuserloschenmittpopansaatversuch AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":'::text AS "hw",
    array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 201
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" IN (200, 201, 202, 210, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 100
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" IN (200, 201, 202, 210, 211)
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" = 100
  );

DROP VIEW IF EXISTS apflora.v_qk_pop_statuspotwuchsortmittpopanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_pop_statuspotwuchsortmittpopanders AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
WHERE
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" < 300
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_pop_statuspotwuchsortmittpopanders CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_pop_statuspotwuchsortmittpopanders AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "potenzieller Wuchs-/Ansiedlungsort", es gibt aber eine Teilpopulation mit Status "angesiedelt" oder "urspruenglich":'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId"
HAVING
  apflora.pop."PopHerkunft" = 300
  AND apflora.pop."PopId" IN (
    SELECT DISTINCT
      apflora.tpop."PopId"
    FROM
      apflora.tpop
    WHERE
      apflora.tpop."TPopHerkunft" < 300
  );

DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr."TPopId"
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr."TPopKontrId"
          )
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  )
ORDER BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId")
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr."TPopId"
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr."TPopKontrId"
          )
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  );

DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  )
ORDER BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  );

DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopMassnTyp" < 4
  )
ORDER BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:'::text AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopMassnTyp" < 4
  );

-- wozu wird das benutzt?
DROP VIEW IF EXISTS apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_mitstatusaktuellundtpopbererloschen_maxtpopberjahr AS
SELECT
  apflora.tpopber."TPopId",
  max(apflora.tpopber."TPopBerJahr") AS "MaxTPopBerJahr"
FROM
  apflora.tpopber
GROUP BY
  apflora.tpopber."TPopId";

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr AS
SELECT
 apflora.beobzuordnung."TPopId",
  max(
    date_part('year', beob.beob."Datum")
  ) AS "MaxJahr"
FROM
  apflora.beobzuordnung
INNER JOIN
  beob.beob
  ON apflora.beobzuordnung."BeobId" = beob.beob.id
WHERE
  beob.beob."Datum" IS NOT NULL AND
  apflora.beobzuordnung."TPopId" IS NOT NULL
GROUP BY
  apflora.beobzuordnung."TPopId";

DROP VIEW IF EXISTS apflora.v_apber_pop_uebersicht CASCADE;
CREATE OR REPLACE VIEW apflora.v_apber_pop_uebersicht AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  (
    SELECT
      COUNT(*)
    FROM
      apflora.pop
    WHERE
      apflora.pop."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
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
      apflora.pop."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
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
      apflora.pop."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      AND apflora.pop."PopHerkunft" IN (100, 200, 210)
      AND apflora.pop."PopId" IN(
        SELECT
          apflora.tpop."PopId"
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."TPopApBerichtRelevant" = 1
      )
  ) AS "aktuell"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  beob.adb_eigenschaften."TaxonomieId",
  beob.adb_eigenschaften."Artname"
ORDER BY
  beob.adb_eigenschaften."Artname";
