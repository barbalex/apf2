SELECT
  ap."ApArtId",
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
WHERE
  "TPopHerkunft" = 210 AND
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
  "TPopHerkunft" = 210 AND
  "ApJahr" IS NULL;

UPDATE apflora.tpop
SET "TPopHerkunft" = 200
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
    "TPopHerkunft" = 210 AND
    "ApJahr" IS NULL
)
