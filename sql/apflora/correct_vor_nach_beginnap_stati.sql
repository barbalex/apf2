-- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

-- angesiedelt, erloschen/nicht etabliert
UPDATE apflora.tpop
SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" IS NULL
);

UPDATE apflora.pop
SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" IS NULL
);

UPDATE apflora.tpop
SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" <= apflora.tpop.bekannt_seit
);

UPDATE apflora.pop
SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" <= "PopBekanntSeit"
);

UPDATE apflora.tpop
SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" > apflora.tpop.bekannt_seit
);

UPDATE apflora.pop
SET "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" > "PopBekanntSeit"
);

-- angesiedelt, aktuell
UPDATE apflora.tpop
SET status = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 210 -- angesiedelt vor Beginn AP, aktuell
    AND "ApJahr" IS NULL
);

UPDATE apflora.pop
SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
    AND "ApJahr" IS NULL
);

UPDATE apflora.tpop
SET status = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 210 -- angesiedelt vor Beginn AP, aktuell
    AND "ApJahr" <= apflora.tpop.bekannt_seit
);

UPDATE apflora.pop
SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
    AND "ApJahr" <= "PopBekanntSeit"
);

UPDATE apflora.tpop
SET status = 210 -- angesiedelt vor Beginn AP, aktuell
WHERE id IN (
  SELECT
    tpop.id
  FROM
    apflora.tpop
    INNER JOIN apflora.pop
    ON apflora.tpop.pop_id = apflora.pop.id
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 200  -- angesiedelt nach Beginn AP, aktuell
    AND "ApJahr" > apflora.tpop.bekannt_seit
);

UPDATE apflora.pop
SET "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
    AND "ApJahr" > "PopBekanntSeit"
);
