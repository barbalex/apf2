-- TPOP
-- clear bad data
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  ("TPopXKoord" IS NOT NULL AND "TPopYKoord" IS NULL)
  OR ("TPopYKoord" IS NOT NULL AND "TPopXKoord" IS NULL);

-- correct bad data
UPDATE
  apflora.tpop
SET
  "TPopXKoord" = NULL
WHERE
  "TPopXKoord" IS NOT NULL AND "TPopYKoord" IS NULL;

UPDATE
  apflora.tpop
SET
  "TPopYKoord" = NULL
WHERE
  "TPopYKoord" IS NOT NULL AND "TPopXKoord" IS NULL;

-- too high coordinates
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  "TPopXKoord" > 1000000
  OR "TPopYKoord" > 1000000;

-- find datasets
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
    INNER JOIN apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  apflora.tpop."TPopId" IN (-1989923291, 2146455501, 2146450441, 2146453832, 2146453833, 2146453855, 2146453864);

-- select data
SELECT
  "TPopId",
  "TPopXKoord",
  "TPopYKoord",
  1 AS "VirtHoehe"
FROM
 apflora.tpop
WHERE
  "TPopXKoord" < 1000000
  AND "TPopYKoord" < 1000000;


-- POP
-- clear bad data
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  ("PopXKoord" IS NOT NULL AND "PopYKoord" IS NULL)
  OR ("PopYKoord" IS NOT NULL AND "PopXKoord" IS NULL);

-- correct bad data
UPDATE
  apflora.pop
SET
  "PopXKoord" = NULL
WHERE
  "PopXKoord" IS NOT NULL AND "PopYKoord" IS NULL;

UPDATE
  apflora.pop
SET
  "PopYKoord" = NULL
WHERE
  "PopYKoord" IS NOT NULL AND "PopXKoord" IS NULL;

-- too high koordinates
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  apflora.pop."PopXKoord" > 1000000
  OR apflora.pop."PopYKoord" > 1000000;

-- find datasets
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopId",
  apflora.pop."PopNr",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
FROM
  apflora.ap
  INNER JOIN apflora.pop
  ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
  INNER JOIN beob.adb_eigenschaften
  ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  apflora.pop."PopId" IN (-615235276, 2146170533, 2146170518, 2146170519, 2146170527);

-- select data
SELECT
  "PopId",
  "PopXKoord",
  "PopYKoord",
  1 AS "VirtHoehe"
FROM
 apflora.pop
WHERE
  "PopXKoord" < 1000000
  AND "PopYKoord" < 1000000;
