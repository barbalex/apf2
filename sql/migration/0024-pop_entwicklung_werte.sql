ALTER TABLE apflora.popber DROP CONSTRAINT popber_fk_pop_entwicklung_werte;
ALTER TABLE apflora.popber 
   ADD CONSTRAINT popber_fk_tpop_entwicklung_werte
   FOREIGN KEY ("PopBerEntwicklung") 
   REFERENCES apflora.pop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
COMMENT ON COLUMN apflora.popber."PopBerEntwicklung" IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopkontr."TPopKontrEntwicklung" IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';

-- now run all views containing tpop_entwicklung_werte
-- and drop pop_entwicklung_werte AFTERWARDS

DROP VIEW IF EXISTS apflora.v_popber;
CREATE OR REPLACE VIEW apflora.v_popber AS
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
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  tpop_entwicklung_werte.text AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
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
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = tpop_entwicklung_werte.code
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.popber."PopBerJahr",
  tpop_entwicklung_werte.text;

-- im Gebrauch (Access):
DROP VIEW IF EXISTS apflora.v_popber_verwaist;
CREATE OR REPLACE VIEW apflora.v_popber_verwaist AS
SELECT
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopId" AS "PopBer PopId",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  tpop_entwicklung_werte.text AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  (apflora.pop
  RIGHT JOIN
    apflora.popber
    ON apflora.pop."PopId" = apflora.popber."PopId")
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = tpop_entwicklung_werte.code
WHERE
  apflora.pop."PopId" IS NULL
ORDER BY
  apflora.popber."PopBerJahr",
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.popber."PopBerId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte."HerkunftTxt" AS "PopHerkunft",
  apflora.popber."PopBerJahr",
  tpop_entwicklung_werte.text AS "PopBerEntwicklung",
  apflora.popber."PopBerTxt"
FROM
  ((apflora.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    INNER JOIN
      apflora.popber
      ON apflora.pop."PopId" = apflora.popber."PopId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber."PopBerEntwicklung" = tpop_entwicklung_werte.code;

DROP VIEW IF EXISTS apflora.v_tpopkontr;
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
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
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
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
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
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte.code)
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
      ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte.code)
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
  apflora.tpop_entwicklung_werte.text,
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
  apflora.tpopkontr_idbiotuebereinst_werte.text,
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

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun;
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
  apflora.tpop_entwicklung_werte.text AS "KONTRENTWICKLUNG",
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
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "KONTRUEBEREINSTIMMUNIDEAL",
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
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte.code)
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
      ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte.code)
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
  apflora.tpop_entwicklung_werte.text,
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
  apflora.tpopkontr_idbiotuebereinst_werte.text,
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

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS apartid,
  apflora.adb_eigenschaften."Artname" AS artname,
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
  apflora.tpop_entwicklung_werte.text AS tpopkontrentwicklung,
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
  apflora.tpopkontr_idbiotuebereinst_werte.text AS tpopkontridealbiotopuebereinst,
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
  (((((apflora.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
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
          apflora.tpop_entwicklung_werte
          ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte.code)
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
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.tpopkontr."TPopKontrDatum";

DROP VIEW IF EXISTS apflora.v_tpopkontr_verwaist;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_verwaist AS
SELECT
  apflora.tpopkontr."TPopKontrGuid" AS "Kontr Guid",
  apflora.tpopkontr."TPopKontrJahr" AS "Kontr Jahr",
  apflora.tpopkontr."TPopKontrDatum" AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr."TPopKontrUeberleb" AS "Kontr Ueberlebensrate",
  apflora.tpopkontr."TPopKontrVitalitaet" AS "Kontr Vitalitaet",
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
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
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
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
      apflora.tpop_entwicklung_werte
      ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte.code)
    ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte.code
WHERE
  apflora.tpop."TPopId" IS NULL;

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
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
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
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
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
            ON apflora.tpopkontr."TPopKontrIdealBiotopUebereinst" = apflora.tpopkontr_idbiotuebereinst_werte.code)
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr."TPopKontrTyp" = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr."TPopKontrEntwicklung" = apflora.tpop_entwicklung_werte.code)
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

DROP VIEW IF EXISTS apflora.v_tpopber;
CREATE OR REPLACE VIEW apflora.v_tpopber AS
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
  apflora.tpopber.id AS "TPopBer Id",
  apflora.tpopber.jahr AS "TPopBer Jahr",
  tpop_entwicklung_werte.text AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
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
        RIGHT JOIN
          (apflora.tpopber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopber.jahr,
  tpop_entwicklung_werte.text;




DROP TRIGGER IF EXISTS pop_entwicklung_werte_on_update_set_mut ON apflora.pop_entwicklung_werte;
DROP TABLE IF EXISTS apflora.pop_entwicklung_werte;