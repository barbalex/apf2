-- list ap without apqk
SELECT
  ap.id,
  tax.artname,
  (
    SELECT
      count(*)
    FROM
      apflora.apqk
    WHERE
      ap_id = ap.id) AS count_apqk
FROM
  apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
WHERE (
  SELECT
    count(*)
  FROM
    apflora.apqk
  WHERE
    ap_id = ap.id) = 0;

-- insert missing
INSERT INTO apflora.apqk (ap_id, qk_name)
SELECT DISTINCT
  apflora.ap.id,
  apflora.qk.name
FROM
  apflora.ap,
  apflora.qk
WHERE
  apflora.ap.id IN (
    SELECT
      ap.id
    FROM
      apflora.ap ap
    WHERE (
      SELECT
        count(*)
      FROM
        apflora.apqk
      WHERE
        ap_id = ap.id) = 0);

