-- list beob where art_id is empty
SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon,
  (
    SELECT
      id
    FROM
      apflora.ae_taxonomies
    WHERE
      taxid = (data ->> 'no_isfs')::integer) AS new_art_id
FROM
  apflora.beob
WHERE
  quelle = 'Info Flora 2021.05'
  AND art_id IS NULL
ORDER BY
  data ->> 'taxon',
  data ->> 'no_isfs';

-- now update art_id for every species without art_id
-- Chara filiformis H. Hertzsch
SELECT
  taxid
FROM
  apflora.ae_taxonomies
WHERE
  artname = 'Chara filiformis H. Hertzsch';

SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon
FROM
  apflora.beob
WHERE
  data ->> 'taxon' = 'Chara filiformis H. Hertzsch';

UPDATE
  apflora.beob
SET
  data = jsonb_set(data, '{no_isfs}'::text[], '50028'::jsonb, TRUE)
WHERE
  data ->> 'taxon' = 'Chara filiformis H. Hertzsch';

-- Chara intermedia A. Braun
SELECT
  taxid
FROM
  apflora.ae_taxonomies
WHERE
  artname = 'Chara intermedia A. Braun';

SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon,
  data
FROM
  apflora.beob
WHERE
  data ->> 'taxon' = 'Chara intermedia A. Braun';

UPDATE
  apflora.beob
SET
  data = jsonb_set(data, '{no_isfs}'::text[], '50015'::jsonb, TRUE)
WHERE
  data ->> 'taxon' = 'Chara intermedia A. Braun';

-- Nitella confervacea (Bréb.) Leonh.
SELECT
  taxid
FROM
  apflora.ae_taxonomies
WHERE
  artname = 'Nitella confervacea (Bréb.) Leonh.';

SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon,
  data
FROM
  apflora.beob
WHERE
  data ->> 'taxon' = 'Nitella confervacea (Bréb.) Leonh.';

UPDATE
  apflora.beob
SET
  data = jsonb_set(data, '{no_isfs}'::text[], '50033'::jsonb, TRUE)
WHERE
  data ->> 'taxon' = 'Nitella confervacea (Bréb.) Leonh.';

-- Nitella gracilis (Sm.) C. Agardh
SELECT
  taxid
FROM
  apflora.ae_taxonomies
WHERE
  artname = 'Nitella gracilis (Sm.) C. Agardh';

SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon,
  data
FROM
  apflora.beob
WHERE
  data ->> 'taxon' = 'Nitella gracilis (Sm.) C. Agardh';

UPDATE
  apflora.beob
SET
  data = jsonb_set(data, '{no_isfs}'::text[], '50035'::jsonb, TRUE)
WHERE
  data ->> 'taxon' = 'Nitella gracilis (Sm.) C. Agardh';

-- Nitella hyalina (DC.) C. Agardh
SELECT
  taxid
FROM
  apflora.ae_taxonomies
WHERE
  artname = 'Nitella hyalina (DC.) C. Agardh';

SELECT
  data ->> 'obs_id' AS obs_id,
  data ->> 'no_isfs' AS no_isfs,
  data ->> 'taxon' AS taxon,
  data
FROM
  apflora.beob
WHERE
  data ->> 'taxon' = 'Nitella hyalina (DC.) C. Agardh';

UPDATE
  apflora.beob
SET
  data = jsonb_set(data, '{no_isfs}'::text[], '50036'::jsonb, TRUE)
WHERE
  data ->> 'taxon' = 'Nitella hyalina (DC.) C. Agardh';

-- update art_id for beob where possible
UPDATE
  apflora.beob
SET
  art_id = (
    SELECT
      id
    FROM
      apflora.ae_taxonomies
    WHERE
      taxid = (data ->> 'no_isfs')::integer)
WHERE
  quelle = 'Info Flora 2021.05'
  AND art_id IS NULL
  AND (
    SELECT
      id
    FROM
      apflora.ae_taxonomies
    WHERE
      taxid = (data ->> 'no_isfs')::integer) IS NOT NULL;

