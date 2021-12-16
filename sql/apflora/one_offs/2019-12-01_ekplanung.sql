WITH kontrolljahre AS (
  SELECT
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr,
    unnest(apflora.ekfrequenz.kontrolljahre) AS kontrolljahr
  FROM
    apflora.tpop tpop1
    INNER JOIN apflora.ekfrequenz ON apflora.ekfrequenz.id = tpop1.ekfrequenz
  WHERE
    tpop1.ekfrequenz IS NOT NULL
    AND tpop1.ekfrequenz_startjahr IS NOT NULL
    AND apflora.ekfrequenz.kontrolljahre IS NOT NULL
    AND (
      SELECT
        count(*)
      FROM
        apflora.ekplan
      WHERE
        tpop_id = tpop1.id) = 0
    ORDER BY
      tpop1.id,
      tpop1.ekfrequenz_startjahr
),
ekplans AS (
  SELECT
    id AS tpop_id,
    kontrolljahr + ekfrequenz_startjahr AS jahr,
    ektyp AS typ,
    '2019-12-04' AS changed,
    'ag' AS changed_by
  FROM
    kontrolljahre)
  INSERT INTO apflora.ekplan (tpop_id, jahr, typ, changed, changed_by)
  SELECT
    tpop_id,
    jahr,
    typ::ek_type,
    changed::date,
    changed_by
  FROM
    ekplans;

-- to show before updating:
WITH kontrolljahre AS (
  SELECT
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr,
    unnest(apflora.ekfrequenz.kontrolljahre) AS kontrolljahr
  FROM
    apflora.tpop tpop1
    INNER JOIN apflora.ekfrequenz ON apflora.ekfrequenz.id = tpop1.ekfrequenz
  WHERE
    tpop1.ekfrequenz IS NOT NULL
    AND tpop1.ekfrequenz_startjahr IS NOT NULL
    AND apflora.ekfrequenz.kontrolljahre IS NOT NULL
    AND (
      SELECT
        count(*)
      FROM
        apflora.ekplan
      WHERE
        tpop_id = tpop1.id) = 0
    ORDER BY
      tpop1.id,
      tpop1.ekfrequenz_startjahr
),
ekplans AS (
  SELECT
    id AS tpop_id,
    kontrolljahr + ekfrequenz_startjahr AS jahr,
    ektyp AS typ,
    '2019-12-01' AS changed,
    'ag' AS changed_by
  FROM
    kontrolljahre
)
SELECT
  tax.artname,
  pop.nr,
  tpop.nr,
  ekplans.jahr,
  ekplans.typ
FROM
  ekplans
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON tpop.id = ekplans.tpop_id
ORDER BY
  tax.artname,
  pop.nr AS pop_nr,
  tpop.nr AS tpop_nr,
  jahr;

