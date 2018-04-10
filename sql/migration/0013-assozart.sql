ALTER TABLE apflora.assozart RENAME "AaId" TO id_old;
ALTER TABLE apflora.assozart ADD COLUMN id UUID DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.assozart RENAME "AaApArtId" TO ap_id;
ALTER TABLE apflora.assozart RENAME "AaSisfNr" TO ae_taxid;
ALTER TABLE apflora.assozart ADD COLUMN ae_id UUID DEFAULT NULL REFERENCES apflora.adb_eigenschaften ("GUID") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE apflora.assozart RENAME "AaBem" TO bemerkungen;
ALTER TABLE apflora.assozart RENAME "MutWann" TO changed;
ALTER TABLE apflora.assozart RENAME "MutWer" TO changed_by;

-- special: update ae_id
update apflora.assozart set ae_id = (
  select "GUID" from apflora.adb_eigenschaften
  where "TaxonomieId" = apflora.assozart.ae_taxid
)
where ae_taxid is not null;

-- change primary key
ALTER TABLE apflora.assozart DROP CONSTRAINT assozart_pkey;
ALTER TABLE apflora.assozart ADD PRIMARY KEY (id);
ALTER TABLE apflora.assozart ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.assozart ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.assozart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.assozart.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.assozart.bemerkungen IS 'Bemerkungen zur Assoziation';
COMMENT ON COLUMN apflora.assozart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.assozart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."assozart_AaApArtId_idx";
DROP index apflora.apflora."assozart_AaId_idx";
DROP index apflora.apflora."assozart_AaSisfNr_idx";
-- add new
CREATE INDEX ON apflora.assozart USING btree (id);
CREATE INDEX ON apflora.assozart USING btree (ap_id);
CREATE INDEX ON apflora.assozart USING btree (ae_id);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS assozart_on_update_set_mut ON apflora.assozart;
DROP FUNCTION IF EXISTS assozart_on_update_set_mut();
CREATE FUNCTION assozart_on_update_set_mut() RETURNS trigger AS $assozart_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$assozart_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER assozart_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.assozart
  FOR EACH ROW EXECUTE PROCEDURE assozart_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_assozart;
CREATE OR REPLACE VIEW apflora.v_assozart AS
SELECT
  apflora.ap."ApArtId",
  apflora.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Bearbeitungsstand",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP verantwortlich",
  apflora.assozart.id AS "AA Id",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart.bemerkungen AS "AA Bemerkungen",
  apflora.assozart.changed AS "AA MutWann",
  apflora.assozart.changed_by AS "AA MutWer"
FROM
  apflora.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.adb_eigenschaften
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
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1"."GUID" = apflora.assozart.ae_id
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_assozart_verwaist;
CREATE OR REPLACE VIEW apflora.v_assozart_verwaist AS
SELECT
  apflora.ap."ApArtId" AS "AP ApArtId",
  apflora.assozart.id AS "AA Id",
  apflora.assozart.ap_id AS "AA ApArtId",
  "ArtenDb_Arteigenschaften_1"."Artname" AS "AA Art",
  apflora.assozart.bemerkungen AS "AA Bemerkungen",
  apflora.assozart.changed AS "AA MutWann",
  apflora.assozart.changed_by AS "AA MutWer"
FROM
  apflora.adb_eigenschaften AS "ArtenDb_Arteigenschaften_1"
  RIGHT JOIN
    (((((apflora.adb_eigenschaften
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
    RIGHT JOIN
      apflora.assozart
      ON apflora.ap."ApArtId" = apflora.assozart.ap_id)
    ON "ArtenDb_Arteigenschaften_1"."GUID" = apflora.assozart.ae_id
WHERE
  apflora.ap."ApArtId" IS NULL
ORDER BY
  apflora.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart;
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

-- drop ae_taxid
ALTER TABLE apflora.assozart DROP COLUMN ae_taxid cascade;