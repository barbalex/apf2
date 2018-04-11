ALTER TABLE apflora.tpop_apberrelevant_werte RENAME "DomainCode" TO code;
ALTER TABLE apflora.tpop_apberrelevant_werte RENAME "DomainTxt" TO text;
ALTER TABLE apflora.tpop_apberrelevant_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpop_apberrelevant_werte RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.tpop_apberrelevant_werte ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.tpop_apberrelevant_werte DROP CONSTRAINT tpop_apberrelevant_werte_pkey CASCADE;
ALTER TABLE apflora.tpop_apberrelevant_werte ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpop_apberrelevant_werte ALTER COLUMN code DROP NOT NULL;
ALTER TABLE apflora.tpop_apberrelevant_werte ALTER COLUMN code SET DEFAULT null;
ALTER TABLE apflora.tpop_apberrelevant_werte ADD UNIQUE (code);
CREATE INDEX ON apflora.tpop_apberrelevant_werte USING btree (id);
COMMENT ON COLUMN apflora.tpop_apberrelevant_werte.id IS 'Primärschlüssel';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: update js and run this file on server
-- done: restart postgrest

DROP TRIGGER IF EXISTS tpop_apberrelevant_werte_on_update_set_mut ON apflora.tpop_apberrelevant_werte;
DROP FUNCTION IF EXISTS tpop_apberrelevant_werte_on_update_set_mut();
CREATE FUNCTION tpop_apberrelevant_werte_on_update_set_mut() RETURNS trigger AS $tpop_apberrelevant_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_apberrelevant_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_apberrelevant_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop_apberrelevant_werte
  FOR EACH ROW EXECUTE PROCEDURE tpop_apberrelevant_werte_on_update_set_mut();

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
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte.code)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    INNER JOIN
      (apflora.tpopmassnber
      INNER JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON apflora.tpopmassnber.beurteilung = tpopmassn_erfbeurt_werte.code)
      ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopmassnber.jahr;

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
        ON apflora.tpop."TPopApBerichtRelevant"  = apflora.tpop_apberrelevant_werte.code)
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

-- add missing constraints:
ALTER TABLE apflora.tpop 
   ADD CONSTRAINT tpop_fk_tpop_apberrelevant_werte
   FOREIGN KEY ("TPopApBerichtRelevant") 
   REFERENCES apflora.tpop_apberrelevant_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.popber 
   ADD CONSTRAINT popber_fk_tpop_entwicklung_werte
   FOREIGN KEY ("PopBerEntwicklung") 
   REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopber 
   ADD CONSTRAINT tpopber_fk_tpop_entwicklung_werte
   FOREIGN KEY (entwicklung) 
   REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontr 
   ADD CONSTRAINT tpopkontr_fk_tpop_entwicklung_werte
   FOREIGN KEY ("TPopKontrEntwicklung") 
   REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontr 
   ADD CONSTRAINT tpopkontr_fk_tpopkontr_idbiotuebereinst_werte
   FOREIGN KEY ("TPopKontrIdealBiotopUebereinst") 
   REFERENCES apflora.tpopkontr_idbiotuebereinst_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.ziel 
   ADD CONSTRAINT ziel_fk_ziel_typ_werte
   FOREIGN KEY (typ) 
   REFERENCES apflora.ziel_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.popmassnber 
   ADD CONSTRAINT popmassnber_fk_tpopmassn_erfbeurt_werte
   FOREIGN KEY ("PopMassnBerErfolgsbeurteilung") 
   REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassnber 
   ADD CONSTRAINT tpopmassnber_fk_tpopmassn_erfbeurt_werte
   FOREIGN KEY (beurteilung) 
   REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassn 
   ADD CONSTRAINT tpopmassn_fk_tpopmassn_typ_werte
   FOREIGN KEY (typ) 
   REFERENCES apflora.tpopmassn_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontrzaehl 
   ADD CONSTRAINT tpopkontrzaehl_fk_tpopkontrzaehl_methode_werte
   FOREIGN KEY (methode) 
   REFERENCES apflora.tpopkontrzaehl_methode_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
--ALTER TABLE apflora.tpop DROP CONSTRAINT tpopkontrzaehl_fk_tpopkontrzaehl_einheit_werte CASCADE;
ALTER TABLE apflora.tpopkontrzaehl 
   ADD CONSTRAINT tpopkontrzaehl_fk_tpopkontrzaehl_einheit_werte
   FOREIGN KEY (einheit) 
   REFERENCES apflora.tpopkontrzaehl_einheit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;