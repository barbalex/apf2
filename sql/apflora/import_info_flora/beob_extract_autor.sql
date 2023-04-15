CREATE OR REPLACE FUNCTION beob_extract_autor(_beob apflora.beob)
  RETURNS text
  AS $$
DECLARE
  result text;
BEGIN
  IF _beob.quelle IN ('EvAB 2016', 'Info Flora 2017') THEN
    result =(_beob.data ->> 'NOM_PERSONNE_OBS') || ' ' ||(_beob.data ->> 'PRENOM_PERSONNE_OBS');
    elseif _beob.quelle = 'FloZ 2017' THEN
    result = _beob.data ->> 'COLLECTOR';
    elseif _beob.quelle IN ('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    result = _beob.data ->> 'observers';
  ELSE
    result = _beob.autor;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;

-- test:
SELECT
  quelle,
  beob_extract_autor(beob) AS autor_extracted,
  autor,
  data
FROM
  apflora.beob beob
WHERE
  autor <> beob_extract_autor(beob);

-- 0 rows
--
-- TODO: correct:
UPDATE
  apflora.beob beob1
SET
  autor =(
    SELECT
      beob_extract_autor(beob2)
    FROM
      apflora.beob beob2
    WHERE
      beob1.id = beob2.id)
WHERE
  beob1.id IN (
    SELECT
      id
    FROM
      apflora.beob beob3
    WHERE
      autor <> beob_extract_autor(beob3));

-- 209 updated
