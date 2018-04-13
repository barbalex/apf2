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
SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
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
SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" <= apflora.pop.bekannt_seit
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
SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
    AND "ApJahr" > apflora.pop.bekannt_seit
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
SET status = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 210 -- angesiedelt vor Beginn AP, aktuell
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
SET status = 200  -- angesiedelt nach Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 210 -- angesiedelt vor Beginn AP, aktuell
    AND "ApJahr" <= apflora.pop.bekannt_seit
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
SET status = 210 -- angesiedelt vor Beginn AP, aktuell
WHERE id IN (
  SELECT
    pop.id
  FROM
    apflora.pop
      INNER JOIN apflora.ap
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    status = 200  -- angesiedelt nach Beginn AP, aktuell
    AND "ApJahr" > apflora.pop.bekannt_seit
);
