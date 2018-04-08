ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilCode" TO code;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilTxt" TO text;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilOrd" TO sort;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "MutWer" TO changed_by;

-- done: rename in sql
-- done: add all views, functions, triggers with tpopkontrzaehl to this file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- done: update js and run this file on server

-- views:
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
  apflora.tpopkontrzaehl_einheit_werte.text AS einheit,
  apflora.tpopkontrzaehl_methode_werte.text AS methode
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
    ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
  LEFT JOIN
    apflora.tpopkontrzaehl_methode_werte
    ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
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
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "Zaehlungen Einheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "Zaehlungen Methoden"
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
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
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
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
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
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
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
  apflora.tpopkontrzaehl_einheit_werte.text AS "Zaehlung einheit",
  apflora.tpopkontrzaehl_methode_werte.text AS "Zaehlung Methode",
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
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
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
        apflora.tpopmassn."TPopId"
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn."TPopId" = apflora.tpopkontr."TPopId"
        AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
        AND apflora.tpopmassn."TPopMassnJahr" <= apflora.tpopkontr."TPopKontrJahr"
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

DROP TRIGGER IF EXISTS tpopkontrzaehl_einheit_werte_on_update_set_mut ON apflora.tpopkontrzaehl_einheit_werte;
DROP FUNCTION IF EXISTS tpopkontrzaehl_einheit_werte_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_einheit_werte_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_einheit_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_einheit_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_einheit_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl_einheit_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_einheit_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontrzaehl_methode_werte_on_update_set_mut ON apflora.tpopkontrzaehl_methode_werte;
DROP FUNCTION IF EXISTS tpopkontrzaehl_methode_werte_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_methode_werte_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_methode_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_methode_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_methode_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl_methode_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_methode_werte_on_update_set_mut();