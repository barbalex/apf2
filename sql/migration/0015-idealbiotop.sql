ALTER TABLE apflora.idealbiotop ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.idealbiotop RENAME "IbApArtId" TO ap_id;
ALTER TABLE apflora.idealbiotop RENAME "IbErstelldatum" TO erstelldatum;
ALTER TABLE apflora.idealbiotop RENAME "IbHoehenlage" TO hoehenlage;
ALTER TABLE apflora.idealbiotop RENAME "IbRegion" TO region;
ALTER TABLE apflora.idealbiotop RENAME "IbExposition" TO exposition;
ALTER TABLE apflora.idealbiotop RENAME "IbBesonnung" TO besonnung;
ALTER TABLE apflora.idealbiotop RENAME "IbHangneigung" TO hangneigung;
ALTER TABLE apflora.idealbiotop RENAME "IbBodenTyp" TO boden_typ;
ALTER TABLE apflora.idealbiotop RENAME "IbBodenKalkgehalt" TO boden_kalkgehalt;
ALTER TABLE apflora.idealbiotop RENAME "IbBodenDurchlaessigkeit" TO boden_durchlaessigkeit;
ALTER TABLE apflora.idealbiotop RENAME "IbBodenHumus" TO boden_humus;
ALTER TABLE apflora.idealbiotop RENAME "IbBodenNaehrstoffgehalt" TO boden_naehrstoffgehalt;
ALTER TABLE apflora.idealbiotop RENAME "IbWasserhaushalt" TO wasserhaushalt;
ALTER TABLE apflora.idealbiotop RENAME "IbKonkurrenz" TO konkurrenz;
ALTER TABLE apflora.idealbiotop RENAME "IbMoosschicht" TO moosschicht;
ALTER TABLE apflora.idealbiotop RENAME "IbKrautschicht" TO krautschicht;
ALTER TABLE apflora.idealbiotop RENAME "IbStrauchschicht" TO strauchschicht;
ALTER TABLE apflora.idealbiotop RENAME "IbBaumschicht" TO baumschicht;
ALTER TABLE apflora.idealbiotop RENAME "IbBemerkungen" TO bemerkungen;
ALTER TABLE apflora.idealbiotop RENAME "MutWann" TO changed;
ALTER TABLE apflora.idealbiotop RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.idealbiotop ADD PRIMARY KEY (id);
ALTER TABLE apflora.idealbiotop ALTER COLUMN ap_id DROP NOT NULL;
ALTER TABLE apflora.idealbiotop ALTER COLUMN ap_id SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.idealbiotop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.idealbiotop.ap_id IS 'Fremdschlüssel aus der Tabelle "ap (1:1-Beziehung)';
COMMENT ON COLUMN apflora.idealbiotop.erstelldatum IS 'Erstelldatum';
COMMENT ON COLUMN apflora.idealbiotop.hoehenlage IS 'Höhenlage';
COMMENT ON COLUMN apflora.idealbiotop.region IS 'Region';
COMMENT ON COLUMN apflora.idealbiotop.exposition IS 'Exposition';
COMMENT ON COLUMN apflora.idealbiotop.besonnung IS 'Besonnung';
COMMENT ON COLUMN apflora.idealbiotop.hangneigung IS 'Hangneigung';
COMMENT ON COLUMN apflora.idealbiotop.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.idealbiotop.boden_kalkgehalt IS 'Kalkgehalt im Boden';
COMMENT ON COLUMN apflora.idealbiotop.boden_durchlaessigkeit IS 'Bodendurchlässigkeit';
COMMENT ON COLUMN apflora.idealbiotop.boden_humus IS 'Bodenhumusgehalt';
COMMENT ON COLUMN apflora.idealbiotop.boden_naehrstoffgehalt IS 'Bodennährstoffgehalt';
COMMENT ON COLUMN apflora.idealbiotop.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.idealbiotop.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.idealbiotop.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.idealbiotop.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.idealbiotop.strauchschicht IS 'Strauchschicht';
COMMENT ON COLUMN apflora.idealbiotop.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.idealbiotop.bemerkungen IS 'Bemerkungen';
COMMENT ON COLUMN apflora.idealbiotop.changed IS 'Wann wurde der Datensatz zuletzt verändert?';
COMMENT ON COLUMN apflora.idealbiotop.changed_by IS 'Wer hat den Datensatz zuletzt verändert?';

-- drop existing indexes
DROP index apflora.apflora."idealbiotop_IbApArtId_idx";
-- add new
CREATE INDEX ON apflora.idealbiotop USING btree (id);
CREATE INDEX ON apflora.idealbiotop USING btree (ap_id);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS idealbiotop_on_update_set_mut ON apflora.idealbiotop;
DROP FUNCTION IF EXISTS idealbiotop_on_update_set_mut();
CREATE FUNCTION idealbiotop_on_update_set_mut() RETURNS trigger AS $idealbiotop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$idealbiotop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER idealbiotop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.idealbiotop
  FOR EACH ROW EXECUTE PROCEDURE idealbiotop_on_update_set_mut();
DROP TRIGGER IF EXISTS ap_insert_add_idealbiotop ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_idealbiotop();
CREATE FUNCTION apflora.ap_insert_add_idealbiotop() RETURNS trigger AS $ap_insert_add_idealbiotop$
BEGIN
  INSERT INTO
    apflora.idealbiotop (ap_id)
  VALUES (NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_idealbiotop$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_idealbiotop AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_idealbiotop();

DROP VIEW IF EXISTS apflora.v_idealbiotop;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
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
    ((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop.ap_id = apflora.ap."ApArtId"
ORDER BY
  apflora.adb_eigenschaften."Artname",
  apflora.idealbiotop.erstelldatum;

DROP VIEW IF EXISTS apflora.v_idealbiotop_verwaist;
CREATE OR REPLACE VIEW apflora.v_idealbiotop_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
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
    ((((apflora.adb_eigenschaften
    RIGHT JOIN
      apflora.ap
      ON apflora.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    LEFT JOIN
      apflora.adresse
      ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
    ON apflora.idealbiotop.ap_id = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.idealbiotop.erstelldatum;