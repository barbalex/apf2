ALTER TABLE apflora.tpopkontrzaehl ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpopkontrzaehl RENAME "TPopKontrZaehlId" TO id_old;
ALTER TABLE apflora.tpopkontrzaehl RENAME "TPopKontrId" TO tpopkontr_id;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Anzahl" TO anzahl;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Zaehleinheit" TO einheit;
ALTER TABLE apflora.tpopkontrzaehl RENAME "Methode" TO methode;
ALTER TABLE apflora.tpopkontrzaehl RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopkontrzaehl.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopkontrzaehl DROP CONSTRAINT tpopkontrzaehl_pkey;
ALTER TABLE apflora.tpopkontrzaehl ADD PRIMARY KEY (id);

-- done: rename in sql
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers with tpopkontrzaehl to this file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- done: update js and run this file on server

-- views
DROP VIEW IF EXISTS apflora.v_tpopkontr_nachflurname;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_nachflurname AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGemeinde" AS "Gemeinde",
  apflora.tpop."TPopFlurname" AS "Flurname aus Teilpopulation",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.adb_eigenschaften."Artname" AS "Art",
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
  apflora.tpopkontrzaehl.id,
  apflora.tpopkontrzaehl.anzahl,
  apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt" AS einheit,
  apflora.tpopkontrzaehl_methode_werte."BeurteilTxt" AS methode
FROM
  ((((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
  LEFT JOIN
    apflora.tpopkontrzaehl_einheit_werte
    ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
  LEFT JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte."BeurteilCode"
WHERE
  apflora.tpopkontr."TPopKontrTyp" NOT IN ('Ziel', 'Zwischenziel')
ORDER BY
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrTyp";

DROP VIEW IF EXISTS apflora.v_tpopkontr CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
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
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "Zaehlungen Anzahlen",
  string_agg(apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt", ', ') AS "Zaehlungen Einheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte."BeurteilTxt", ', ') AS "Zaehlungen Methoden"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
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
  apflora.adb_eigenschaften."TaxonomieId" > 150
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Familie",
  apflora.adb_eigenschaften."Artname",
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
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

-- dependes on previous:
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzter AS
SELECT
  apflora.v_tpop_letzteKontrId."TPopId",
  apflora.v_tpop."ApArtId",
  apflora.v_tpop."Familie",
  apflora.v_tpop."AP Art",
  apflora.v_tpop."AP Status",
  apflora.v_tpop."AP Start im Jahr",
  apflora.v_tpop."AP Stand Umsetzung",
  apflora.v_tpop."AP verantwortlich",
  apflora.v_tpop."PopId",
  apflora.v_tpop."Pop Guid",
  apflora.v_tpop."Pop Nr",
  apflora.v_tpop."Pop Name",
  apflora.v_tpop."Pop Status",
  apflora.v_tpop."Pop bekannt seit",
  apflora.v_tpop."Pop Status unklar",
  apflora.v_tpop."Pop Begruendung fuer unklaren Status",
  apflora.v_tpop."Pop X-Koordinaten",
  apflora.v_tpop."Pop Y-Koordinaten",
  apflora.v_tpop."TPop ID",
  apflora.v_tpop."TPop Guid",
  apflora.v_tpop."TPop Nr",
  apflora.v_tpop."TPop Gemeinde",
  apflora.v_tpop."TPop Flurname",
  apflora.v_tpop."TPop Status",
  apflora.v_tpop."TPop bekannt seit",
  apflora.v_tpop."TPop Status unklar",
  apflora.v_tpop."TPop Begruendung fuer unklaren Status",
  apflora.v_tpop."TPop X-Koordinaten",
  apflora.v_tpop."TPop Y-Koordinaten",
  apflora.v_tpop."TPop Radius (m)",
  apflora.v_tpop."TPop Hoehe",
  apflora.v_tpop."TPop Exposition",
  apflora.v_tpop."TPop Klima",
  apflora.v_tpop."TPop Hangneigung",
  apflora.v_tpop."TPop Beschreibung",
  apflora.v_tpop."TPop Kataster-Nr",
  apflora.v_tpop."TPop fuer AP-Bericht relevant",
  apflora.v_tpop."TPop EigentuemerIn",
  apflora.v_tpop."TPop Kontakt vor Ort",
  apflora.v_tpop."TPop Nutzungszone",
  apflora.v_tpop."TPop BewirtschafterIn",
  apflora.v_tpop."TPop Bewirtschaftung",
  apflora.v_tpop."Teilpopulation zuletzt geaendert",
  apflora.v_tpop."Teilpopulation zuletzt geaendert von",
  apflora.v_tpop_letzteKontrId."AnzTPopKontr" AS "TPop Anzahl Kontrollen",
  apflora.v_tpopkontr."TPopKontrId",
  apflora.v_tpopkontr."Kontr Guid",
  apflora.v_tpopkontr."Kontr Jahr",
  apflora.v_tpopkontr."Kontr Datum",
  apflora.v_tpopkontr."Kontr Typ",
  apflora.v_tpopkontr."Kontr BearbeiterIn",
  apflora.v_tpopkontr."Kontr Ueberlebensrate",
  apflora.v_tpopkontr."Kontr Vitalitaet",
  apflora.v_tpopkontr."Kontr Entwicklung",
  apflora.v_tpopkontr."Kontr Ursachen",
  apflora.v_tpopkontr."Kontr Erfolgsbeurteilung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.v_tpopkontr."Kontr X-Koord",
  apflora.v_tpopkontr."Kontr Y-Koord",
  apflora.v_tpopkontr."Kontr Bemerkungen",
  apflora.v_tpopkontr."Kontr Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr angrenzender Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr Vegetationstyp",
  apflora.v_tpopkontr."Kontr Konkurrenz",
  apflora.v_tpopkontr."Kontr Moosschicht",
  apflora.v_tpopkontr."Kontr Krautschicht",
  apflora.v_tpopkontr."Kontr Strauchschicht",
  apflora.v_tpopkontr."Kontr Baumschicht",
  apflora.v_tpopkontr."Kontr Bodentyp",
  apflora.v_tpopkontr."Kontr Boden Kalkgehalt",
  apflora.v_tpopkontr."Kontr Boden Durchlaessigkeit",
  apflora.v_tpopkontr."Kontr Boden Humusgehalt",
  apflora.v_tpopkontr."Kontr Boden Naehrstoffgehalt",
  apflora.v_tpopkontr."Kontr Oberbodenabtrag",
  apflora.v_tpopkontr."Kontr Wasserhaushalt",
  apflora.v_tpopkontr."Kontr Uebereinstimmung mit Idealbiotop",
  apflora.v_tpopkontr."Kontr Handlungsbedarf",
  apflora.v_tpopkontr."Kontr Ueberpruefte Flaeche",
  apflora.v_tpopkontr."Kontr Flaeche der Teilpopulation m2",
  apflora.v_tpopkontr."Kontr auf Plan eingezeichnet",
  apflora.v_tpopkontr."Kontr Deckung durch Vegetation",
  apflora.v_tpopkontr."Kontr Deckung nackter Boden",
  apflora.v_tpopkontr."Kontr Deckung durch ueberpruefte Art",
  apflora.v_tpopkontr."Kontr auch junge Pflanzen",
  apflora.v_tpopkontr."Kontr maximale Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr mittlere Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr Gefaehrdung",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert von",
  apflora.v_tpopkontr."Zaehlungen Anzahlen",
  apflora.v_tpopkontr."Zaehlungen Einheiten",
  apflora.v_tpopkontr."Zaehlungen Methoden"
FROM
  (apflora.v_tpop_letzteKontrId
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId."MaxTPopKontrId" = apflora.v_tpopkontr."TPopKontrId")
  INNER JOIN
    apflora.v_tpop
    ON apflora.v_tpop_letzteKontrId."TPopId" = apflora.v_tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
  AND apflora.tpop."TPopId" IN (
    SELECT apflora.beobzuordnung."TPopId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beobzuordnung."TPopId" = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."TPopId"
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

-- depends on previous:
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzterundletztertpopber AS
SELECT
	apflora.v_tpop_anzkontrinklletzter."ApArtId" AS "ApArtId",
	apflora.v_tpop_anzkontrinklletzter."Familie",
	apflora.v_tpop_anzkontrinklletzter."AP Art",
	apflora.v_tpop_anzkontrinklletzter."AP Status",
	apflora.v_tpop_anzkontrinklletzter."AP Start im Jahr",
	apflora.v_tpop_anzkontrinklletzter."AP Stand Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."AP verantwortlich",
	apflora.v_tpop_anzkontrinklletzter."PopId",
	apflora.v_tpop_anzkontrinklletzter."Pop Guid",
	apflora.v_tpop_anzkontrinklletzter."Pop Nr",
	apflora.v_tpop_anzkontrinklletzter."Pop Name",
	apflora.v_tpop_anzkontrinklletzter."Pop Status",
	apflora.v_tpop_anzkontrinklletzter."Pop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop ID",
	apflora.v_tpop_anzkontrinklletzter."TPop Guid",
	apflora.v_tpop_anzkontrinklletzter."TPop Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop Gemeinde",
	apflora.v_tpop_anzkontrinklletzter."TPop Flurname",
	apflora.v_tpop_anzkontrinklletzter."TPop Status",
	apflora.v_tpop_anzkontrinklletzter."TPop bekannt seit",
	apflora.v_tpop_anzkontrinklletzter."TPop Status unklar",
	apflora.v_tpop_anzkontrinklletzter."TPop Begruendung fuer unklaren Status",
	apflora.v_tpop_anzkontrinklletzter."TPop X-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Y-Koordinaten",
	apflora.v_tpop_anzkontrinklletzter."TPop Radius (m)",
	apflora.v_tpop_anzkontrinklletzter."TPop Hoehe",
	apflora.v_tpop_anzkontrinklletzter."TPop Exposition",
	apflora.v_tpop_anzkontrinklletzter."TPop Klima",
	apflora.v_tpop_anzkontrinklletzter."TPop Hangneigung",
	apflora.v_tpop_anzkontrinklletzter."TPop Beschreibung",
	apflora.v_tpop_anzkontrinklletzter."TPop Kataster-Nr",
	apflora.v_tpop_anzkontrinklletzter."TPop fuer AP-Bericht relevant",
	apflora.v_tpop_anzkontrinklletzter."TPop EigentuemerIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Kontakt vor Ort",
	apflora.v_tpop_anzkontrinklletzter."TPop Nutzungszone",
	apflora.v_tpop_anzkontrinklletzter."TPop BewirtschafterIn",
	apflora.v_tpop_anzkontrinklletzter."TPop Bewirtschaftung",
	apflora.v_tpop_anzkontrinklletzter."TPop Anzahl Kontrollen",
	apflora.v_tpop_anzkontrinklletzter."TPopKontrId",
	apflora.v_tpop_anzkontrinklletzter."TPopId",
	apflora.v_tpop_anzkontrinklletzter."Kontr Guid",
	apflora.v_tpop_anzkontrinklletzter."Kontr Jahr",
	apflora.v_tpop_anzkontrinklletzter."Kontr Datum",
	apflora.v_tpop_anzkontrinklletzter."Kontr Typ",
	apflora.v_tpop_anzkontrinklletzter."Kontr BearbeiterIn",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberlebensrate",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vitalitaet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Entwicklung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ursachen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Erfolgsbeurteilung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Umsetzung",
	apflora.v_tpop_anzkontrinklletzter."Kontr Aenderungs-Vorschlaege Kontrolle",
	apflora.v_tpop_anzkontrinklletzter."Kontr X-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Y-Koord",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bemerkungen",
	apflora.v_tpop_anzkontrinklletzter."Kontr Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr angrenzender Lebensraum Delarze",
	apflora.v_tpop_anzkontrinklletzter."Kontr Vegetationstyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Konkurrenz",
	apflora.v_tpop_anzkontrinklletzter."Kontr Moosschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Krautschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Strauchschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Baumschicht",
	apflora.v_tpop_anzkontrinklletzter."Kontr Bodentyp",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Kalkgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Durchlaessigkeit",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Humusgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Boden Naehrstoffgehalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Oberbodenabtrag",
	apflora.v_tpop_anzkontrinklletzter."Kontr Wasserhaushalt",
	apflora.v_tpop_anzkontrinklletzter."Kontr Uebereinstimmung mit Idealbiotop",
	apflora.v_tpop_anzkontrinklletzter."Kontr Handlungsbedarf",
	apflora.v_tpop_anzkontrinklletzter."Kontr Ueberpruefte Flaeche",
	apflora.v_tpop_anzkontrinklletzter."Kontr Flaeche der Teilpopulation m2",
	apflora.v_tpop_anzkontrinklletzter."Kontr auf Plan eingezeichnet",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch Vegetation",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung nackter Boden",
	apflora.v_tpop_anzkontrinklletzter."Kontr Deckung durch ueberpruefte Art",
	apflora.v_tpop_anzkontrinklletzter."Kontr auch junge Pflanzen",
	apflora.v_tpop_anzkontrinklletzter."Kontr maximale Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr mittlere Veg-hoehe cm",
	apflora.v_tpop_anzkontrinklletzter."Kontr Gefaehrdung",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert",
	apflora.v_tpop_anzkontrinklletzter."Kontrolle zuletzt geaendert von",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Anzahlen",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Einheiten",
	apflora.v_tpop_anzkontrinklletzter."Zaehlungen Methoden",
	apflora.v_tpopber_mitletzterid."AnzTPopBer",
	apflora.v_tpopber_mitletzterid."TPopBerId",
	apflora.v_tpopber_mitletzterid."TPopBer Jahr",
	apflora.v_tpopber_mitletzterid."TPopBer Entwicklung",
	apflora.v_tpopber_mitletzterid."TPopBer Bemerkungen",
	apflora.v_tpopber_mitletzterid."TPopBer MutWann",
	apflora.v_tpopber_mitletzterid."TPopBer MutWer"
FROM
	apflora.v_tpop_anzkontrinklletzter
  LEFT JOIN
    apflora.v_tpopber_mitletzterid
    ON apflora.v_tpop_anzkontrinklletzter."TPop ID" = apflora.v_tpopber_mitletzterid."TPopId";

CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "APARTID",
  apflora.adb_eigenschaften."Artname" AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpopkontr."TPopKontrId" AS "TPOPKONTRID",
  apflora.tpopkontr."TPopKontrGuid" AS "KONTRGUID",
  apflora.tpopkontr."TPopKontrJahr" AS "KONTRJAHR",
  --TODO: convert?
  apflora.tpopkontr."TPopKontrDatum" AS "KONTRDAT",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "KONTRTYP",
  apflora.adresse."AdrName" AS "KONTRBEARBEITER",
  apflora.tpopkontr."TPopKontrUeberleb" AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "KONTRVITALITAET",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "KONTRENTWICKLUNG",
  apflora.tpopkontr."TPopKontrUrsach" AS "KONTRURSACHEN",
  apflora.tpopkontr."TPopKontrUrteil" AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr."TPopKontrAendUms" AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr."TPopKontrAendKontr" AS "KONTRAENDKONTROLLE",
  apflora.tpop."TPopXKoord" AS "KONTR_X",
  apflora.tpop."TPopYKoord" AS "KONTR_Y",
  apflora.tpopkontr."TPopKontrTxt" AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr."TPopKontrLeb" AS "KONTRLRMDELARZE",
  apflora.tpopkontr."TPopKontrLebUmg" AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr."TPopKontrVegTyp" AS "KONTRVEGTYP",
  apflora.tpopkontr."TPopKontrKonkurrenz" AS "KONTRKONKURRENZ",
  apflora.tpopkontr."TPopKontrMoosschicht" AS "KONTRMOOSE",
  apflora.tpopkontr."TPopKontrKrautschicht" AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr."TPopKontrStrauchschicht" AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr."TPopKontrBaumschicht" AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr."TPopKontrBodenTyp" AS "KONTRBODENTYP",
  apflora.tpopkontr."TPopKontrBodenKalkgehalt" AS "KONTRBODENKALK",
  apflora.tpopkontr."TPopKontrBodenDurchlaessigkeit" AS "KONTRBODENDURCHLAESSIGK",
  apflora.tpopkontr."TPopKontrBodenHumus" AS "KONTRBODENHUMUS",
  apflora.tpopkontr."TPopKontrBodenNaehrstoffgehalt" AS "KONTRBODENNAEHRSTOFF",
  apflora.tpopkontr."TPopKontrBodenAbtrag" AS "KONTROBERBODENABTRAG",
  apflora.tpopkontr."TPopKontrWasserhaushalt" AS "KONTROBODENWASSERHAUSHALT",
  apflora.tpopkontr_idbiotuebereinst_werte."DomainTxt" AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr."TPopKontrHandlungsbedarf" AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr."TPopKontrUebFlaeche" AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr."TPopKontrFlaeche" AS "KONTRFLAECHETPOP",
  apflora.tpopkontr."TPopKontrPlan" AS "KONTRAUFPLAN",
  apflora.tpopkontr."TPopKontrVeg" AS "KONTRDECKUNGVEG",
  apflora.tpopkontr."TPopKontrNaBo" AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr."TPopKontrUebPfl" AS "KONTRDECKUNGART",
  apflora.tpopkontr."TPopKontrJungPflJN" AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr."TPopKontrVegHoeMax" AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr."TPopKontrVegHoeMit" AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "KONTRGEFAEHRDUNG",
  -- TODO: convert
  apflora.tpopkontr."MutWann" AS "KONTRCHANGEDAT",
  apflora.tpopkontr."MutWer" AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt", ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte."BeurteilTxt", ', ') AS "METHODEN"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.adb_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
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
  apflora.adb_eigenschaften."TaxonomieId" > 150
GROUP BY
  apflora.adb_eigenschaften."TaxonomieId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
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
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr."TPopKontrId",
  max(apflora.tpopkontrzaehl.anzahl) AS anzahl
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
GROUP BY
  apflora.tpopkontr."TPopKontrId"
ORDER BY
  apflora.tpopkontr."TPopKontrId";

-- evab-views depend on previous:
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  apflora.ap."ApGuid" AS "idProjekt",
  concat('AP Flora ZH: ', apflora.adb_eigenschaften."Artname") AS "Name",
  CASE
    WHEN apflora.ap."ApJahr" IS NOT NULL
    THEN concat('01.01.', apflora.ap."ApJahr")
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
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
    apflora.adb_eigenschaften
    ON apflora.ap."ApArtId" = apflora.adb_eigenschaften."TaxonomieId")
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
GROUP BY
  apflora.adb_eigenschaften."Artname",
  apflora.ap."ApGuid",
  apflora.ap."ApJahr",
  apflora.ap."ApUmsetzung",
  apflora.ap_bearbstand_werte."DomainTxt",
  apflora.ap_umsetzung_werte."DomainTxt";

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
  -- ensure all idProjekt are contained in higher level
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
GROUP BY
  apflora.ap."ApGuid",
  apflora.pop."PopGuid",
  apflora.pop."PopName",
  apflora.pop."PopNr",
  apflora.pop."PopHerkunft",
  "popHerkunft"."HerkunftTxt",
  apflora.pop."PopBekanntSeit";

CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  apflora.tpop."TPopGuid",
  apflora.pop."PopGuid" AS "fkRaum",
  apflora.tpop."TPopGuid" AS "idOrt",
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
        (((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr."TPopKontrLeb" = apflora.evab_typologie."TYPO")
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

CREATE OR REPLACE VIEW apflora.v_exportevab_zeit AS
SELECT
  apflora.tpop."TPopGuid" AS "fkOrt",
  apflora.tpopkontr."ZeitGuid" AS "idZeitpunkt",
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
    THEN 'T'::varchar(10)
    ELSE 'J'::varchar(10)
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr."TPopKontrDatum" IS NOT NULL
    THEN 'P'::varchar(10)
    ELSE 'X'::varchar(10)
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
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort);

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
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
  apflora.tpopkontrzaehl.id AS "Zaehlung id",
  apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt" AS "Zaehlung einheit",
  apflora.tpopkontrzaehl_methode_werte."BeurteilTxt" AS "Zaehlung Methode",
  apflora.tpopkontrzaehl.anzahl AS "Zaehlung Anzahl"
FROM
  apflora.adb_eigenschaften
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
          LEFT JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
            ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
          ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";

CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr")]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr."TPopKontrId",
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr."TPopKontrId", 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr."TPopKontrJahr"), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
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
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr";

CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
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
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr."TPopId"
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr."TPopKontrId"
          )
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  );

CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP TRIGGER IF EXISTS tpopkontrzaehl_on_update_set_mut ON apflora.tpopkontrzaehl;
DROP FUNCTION IF EXISTS tpopkontrzaehl_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_on_update_set_mut();