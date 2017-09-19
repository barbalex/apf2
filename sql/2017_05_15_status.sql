SELECT
  ap."ApArtId",
  adb_eigenschaften."Artname",
  pop."PopId",
  pop."PopNr",
  tpop."TPopId",
  tpop."TPopNr"
FROM
  apflora.tpop
  INNER JOIN apflora.pop
  ON apflora.tpop."PopId" = apflora.pop."PopId"
    INNER JOIN apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      INNER JOIN beob.adb_eigenschaften
      ON ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
WHERE
  "TPopHerkunft" = 211 AND
  "ApJahr" IS NULL
ORDER BY
  ap."ApArtId",
  pop."PopId",
  pop."PopNr",
  tpop."TPopId",
  tpop."TPopNr";

SELECT
  tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN apflora.pop
  ON apflora.tpop."PopId" = apflora.pop."PopId"
    INNER JOIN apflora.ap
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  "TPopHerkunft" = 211 AND
  "ApJahr" IS NULL;

UPDATE apflora.tpop
SET "TPopHerkunft" = 202
WHERE "TPopId" IN (
  SELECT
    tpop."TPopId"
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
      INNER JOIN apflora.ap
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    "TPopHerkunft" = 211 AND
    "ApJahr" IS NULL
)

UPDATE apflora.pop
SET "PopHerkunft" = 202
WHERE "PopId" IN (
  SELECT
    pop."PopId"
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 211 AND
    "ApJahr" IS NULL
)
