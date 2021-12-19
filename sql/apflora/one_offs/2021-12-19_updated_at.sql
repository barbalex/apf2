SELECT
  changed,
  updated_at
FROM
  apflora.ap
ORDER BY
  updated_at DESC;

-- most: '2021-11-18 19:08:01.245206+00'
SELECT
  changed,
  updated_at
FROM
  apflora.ap
WHERE
  updated_at = '2021-11-18 19:08:01.245206+00'
ORDER BY
  updated_at DESC;

UPDATE
  apflora.ap
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-11-18 19:08:01.245206+00';

-- now updated_at is '2021-12-19 11:22:30.845034+00'
UPDATE
  apflora.ap
SET
  updated_at = changed::timestamp
WHERE
  updated_at = '2021-12-19 11:22:30.845034+00';

-- bingo
-- TODO:
-- 1. do this for all tables with updated_at
-- 2. drop changed field
