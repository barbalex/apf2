ALTER TABLE apflora.beobzuordnung RENAME id TO id_old;
ALTER TABLE apflora.beobzuordnung DROP CONSTRAINT beobzuordnung_pkey;
ALTER TABLE apflora.beobzuordnung ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beobzuordnung RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobId" TO beob_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobNichtZuordnen" TO nicht_zuordnen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobBemerkungen" TO bemerkungen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWann" TO changed;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWer" TO changed_by;

COMMENT ON COLUMN apflora.beobzuordnung.id_old IS 'frühere id';
ALTER TABLE apflora.beobzuordnung RENAME TO tpopbeob;
CREATE INDEX ON apflora.tpopbeob USING btree (id);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers with tpopber to this file
-- TODO: run migration sql in dev
-- TODO: test app
-- TODO: update js and run this file on server

DROP TRIGGER IF EXISTS beobzuordnung_on_update_set_mut ON apflora.tpopbeob;
DROP FUNCTION IF EXISTS beobzuordnung_on_update_set_mut();
CREATE FUNCTION beobzuordnung_on_update_set_mut() RETURNS trigger AS $beobzuordnung_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$beobzuordnung_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER beobzuordnung_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopbeob
  FOR EACH ROW EXECUTE PROCEDURE beobzuordnung_on_update_set_mut();

DROP VIEW IF EXISTS apflora.v_tpopbeob;
CREATE OR REPLACE VIEW apflora.v_tpopbeob AS
SELECT
  apflora.tpopbeob.*,
  apflora.beob."ArtId" AS "ApArtId"
FROM
  apflora.tpopbeob
  INNER JOIN
    apflora.beob
    ON apflora.beob.id = apflora.tpopbeob.beob_id;

DROP VIEW IF EXISTS apflora.v_beob;
CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
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
    apflora.adb_eigenschaften
    ON apflora.beob."ArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_beob__mit_data;
CREATE OR REPLACE VIEW apflora.v_beob__mit_data AS
SELECT
  apflora.beob.id,
  apflora.beob_quelle.name AS "Quelle",
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob."ArtId",
  apflora.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
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
    apflora.adb_eigenschaften
    ON apflora.beob."ArtId" = apflora.adb_eigenschaften."TaxonomieId")
  INNER JOIN
    apflora.beob_quelle
    ON beob."QuelleId" = beob_quelle.id)
  LEFT JOIN
    apflora.tpopbeob
    LEFT JOIN
      apflora.tpop
      ON apflora.tpop."TPopId" = apflora.tpopbeob.tpop_id
      LEFT JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.tpopbeob.beob_id = apflora.beob.id
WHERE
  apflora.beob."ArtId" > 150
ORDER BY
  apflora.adb_eigenschaften."Artname" ASC,
  apflora.pop."PopNr" ASC,
  apflora.tpop."TPopNr" ASC,
  apflora.beob."Datum" DESC;

DROP VIEW IF EXISTS apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr cascade;
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

DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950;
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
    SELECT apflora.tpopbeob.tpop_id
    FROM
      apflora.tpopbeob
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.tpopbeob.tpop_id = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";