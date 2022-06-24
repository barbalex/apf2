CREATE OR REPLACE VIEW apflora.v_tpop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.pop.nr, '/', apflora.tpop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name, '<br /> Teilpopulation: ', apflora.tpop.nr, ' ', apflora.tpop.gemeinde, ' ', apflora.tpop.flurname)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Arten/', apflora.ap.id, '/Populationen/', apflora.pop.id, '/Teil-Populationen/', apflora.tpop.id) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM (apflora.ae_taxonomies
  INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
INNER JOIN (apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

CREATE OR REPLACE VIEW apflora.v_tpop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.ae_taxonomies.artname, ' ', apflora.pop.nr, '/', apflora.tpop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name, '<br /> Teilpopulation: ', apflora.tpop.nr, ' ', apflora.tpop.gemeinde, ' ', apflora.tpop.flurname)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Arten/', apflora.ap.id, '/Populationen/', apflora.pop.id, '/Teil-Populationen/', apflora.tpop.id) AS url,
  apflora.tpop.id,
  apflora.tpop.wgs84_lat,
  apflora.tpop.wgs84_long
FROM (apflora.ae_taxonomies
  INNER JOIN apflora.ap ON apflora.ae_taxonomies.id = apflora.ap.art_id)
INNER JOIN (apflora.pop
  INNER JOIN apflora.tpop ON apflora.pop.id = apflora.tpop.pop_id) ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

CREATE OR REPLACE VIEW apflora.v_pop_kml AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  apflora.pop.nr AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Arten/', apflora.ap.id, '/Populationen/', apflora.pop.id) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
  INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

CREATE OR REPLACE VIEW apflora.v_pop_kmlnamen AS
SELECT
  apflora.ae_taxonomies.artname AS "art",
  concat(apflora.ae_taxonomies.artname, ' ', apflora.pop.nr) AS "label",
  substring(concat('Population: ', apflora.pop.nr, ' ', apflora.pop.name)
    FROM 1 FOR 225) AS "inhalte",
  concat('https://apflora.ch/Daten/Projekte/', apflora.ap.proj_id, '/Arten/', apflora.ap.id, '/Populationen/', apflora.pop.id) AS url,
  apflora.pop.id,
  apflora.pop.wgs84_lat,
  apflora.pop.wgs84_long
FROM
  apflora.ae_taxonomies
  INNER JOIN (apflora.ap
    INNER JOIN apflora.pop ON apflora.ap.id = apflora.pop.ap_id) ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.pop.lv95_x IS NOT NULL
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name;

DROP FUNCTION IF EXISTS apflora.ekzaehleinheit_max_3_per_ap ();

CREATE FUNCTION apflora.ekzaehleinheit_max_3_per_ap ()
  RETURNS TRIGGER
  AS $ekzaehleinheit_max_3_per_ap$
DECLARE
  count integer;
BEGIN
  -- check if 3 ekzaehleinheit already exists for this ap
  count := (
    SELECT
      count(*)
    FROM
      apflora.ekzaehleinheit
    WHERE
      ap_id = NEW.ap_id);
  IF count > 2 THEN
    RAISE EXCEPTION 'Pro Art dürfen maximal drei EK-Zähleinheiten erfasst werden';
  END IF;
  RETURN NEW;
END;
$ekzaehleinheit_max_3_per_ap$
LANGUAGE plpgsql;

