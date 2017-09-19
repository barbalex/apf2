-- select original id
SELECT
  beob.id,
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId"
FROM
  beob.beob
  INNER JOIN beob.beob AS beob2
  ON beob2.id = beob.id
LIMIT 10

-- update beobid in beobzuordnung
-- this query took 2.46 hours!
UPDATE apflora.beobzuordnung
SET "BeobId" = (
  SELECT DISTINCT
    beob.id
  FROM
    beob.beob
    INNER JOIN beob.beob AS beob2
    ON beob2.id = beob.id
  WHERE
    beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) = apflora.beobzuordnung."NO_NOTE"
)

-- alternatives, ran 1.1 seconds
UPDATE apflora.beobzuordnung
SET "BeobId" =
  CASE WHEN beobzuordnung."QuelleId" = 1 THEN (
    SELECT DISTINCT
      beob.id
    FROM
      beob.beob
    WHERE
      beob."QuelleId" = 1 AND
      beob.data->>'NO_NOTE_PROJET' = apflora.beobzuordnung."NO_NOTE"
  )
  ELSE (SELECT DISTINCT
    beob.id
  FROM
    beob.beob
  WHERE
    beob."QuelleId" = 2 AND
    beob.data->>'NO_NOTE' = apflora.beobzuordnung."NO_NOTE")
  END;

-- check result
SELECT
  beobzuordnung."BeobId",
  beobzuordnung."NO_NOTE",
  beob.id,
  beob."QuelleId",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId"
FROM
  apflora.beobzuordnung
  LEFT JOIN beob.beob
    INNER JOIN beob.beob AS beob2
    ON beob2.id = beob.id
  ON apflora.beobzuordnung."BeobId" = beob.beob.id
WHERE beob."QuelleId" = 1
LIMIT 10;
