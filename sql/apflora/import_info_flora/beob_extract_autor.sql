CREATE OR REPLACE FUNCTION beob_extract_autor(_beob apflora.beob)
  RETURNS text
  AS $$
BEGIN
  CASE WHEN _beob.quelle IN('EvAB 2016', 'Info Flora 2017') THEN
    RETURN _beob.data ->> 'NOM_PERSONNE_OBS' || ' ' || _beob.data ->> 'PRENOM_PERSONNE_OBS';
  WHEN 'FloZ 2017' THEN
    RETURN _beob.data ->> 'COLLECTOR';
  WHEN _beob.quelle IN('Info Flora 2021.05', 'Info Flora 2022.03', 'Info Flora 2022.12 gesamt', 'Info Flora 2022.01', 'Info Flora 2023.02 Utricularia', 'Info Flora 2022.08', 'Info Flora 2022.04', 'Info Flora 2022.12 Auszug') THEN
    RETURN _beob.data ->> 'observers';
  ELSE
    RETURN _beob.autor;
  END CASE;
END;
$$
LANGUAGE plpgsql;

-- test:
SELECT
  *
FROM
  apflora.beob
WHERE
  quelle = 'EvAB 2016';

