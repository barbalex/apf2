-- Bei den dieses Jahr neu erloschenen Teilpopulationen die EK-Frequenz "nie" setzen
DROP VIEW IF EXISTS apflora.v_tpop_ekfrequenz_to_set_nie CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_ekfrequenz_to_set_nie AS
SELECT
  tax.artname,
  pop.nr AS pop_nr,
  tpop.id,
  tpop.nr,
  tpop.status AS status_code,
  status_werte.text AS status_text,
  tpophist.status AS status_code_2019,
  status_werte_hist.text AS status_text_2019,
  tpop.ekfrequenz AS ekfrequenz_id,
  ekfrequenz.code AS ekfrequenz_code,
  ekfrequenz_to_set.id AS ekfrequenz_to_set_id,
  ekfrequenz_to_set.code AS ekfrequenz_to_set_code
FROM
  apflora.tpop tpop
  INNER JOIN apflora.tpop_history tpophist
  -- reset year every time this query is run:
  INNER JOIN apflora.pop_status_werte status_werte_hist ON tpophist.status = status_werte_hist.code ON tpop.id = tpophist.id
    AND tpophist.year = 2020
  LEFT JOIN apflora.ekfrequenz ekfrequenz ON ekfrequenz.id = tpop.ekfrequenz
  INNER JOIN apflora.pop_status_werte status_werte ON tpop.status = status_werte.code
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  -- get this ap's ekfrequenz with 'nie (EK)' (not %nie% because would double result rows)
  INNER JOIN apflora.ekfrequenz ekfrequenz_to_set ON ekfrequenz_to_set.ap_id = ap.id
    AND ekfrequenz_to_set.code = 'nie (EK)' ON ap.id = pop.ap_id ON pop.id = tpop.pop_id
WHERE
  tpop.status IN (101, 202)
  AND tpophist.status NOT IN (101, 202)
  AND (
    -- ensure they are still named like this:
    ekfrequenz.code NOT LIKE '%nie%'
    OR tpop.ekfrequenz IS NULL)
  AND ap.id IN ( SELECT DISTINCT
      pop.ap_id AS id
    FROM
      apflora.tpop tpop
      INNER JOIN apflora.pop pop ON tpop.pop_id = pop.id
    WHERE
      tpop.ekfrequenz IS NOT NULL)
ORDER BY
  tax.artname,
  pop.nr,
  tpop.id,
  tpop.nr;

-- ensure ekfrequenz are still named like this:
SELECT
  code,
  count(id) AS anzahl
FROM
  apflora.ekfrequenz
GROUP BY
  code
ORDER BY
  code ASC;

UPDATE
  apflora.tpop tpop
SET
  ekfrequenz = ( SELECT DISTINCT
      ekfrequenz_to_set_id
    FROM
      apflora.v_tpop_ekfrequenz_to_set_nie nie
    WHERE
      nie.id = tpop.id)
WHERE
  tpop.id IN ( SELECT DISTINCT
      id
    FROM
      apflora.v_tpop_ekfrequenz_to_set_nie);

-- need to remove ekplan:
WITH tpop_id_to_unplan AS (
  SELECT
    tpop.id
  FROM
    apflora.tpop tpop
    LEFT JOIN apflora.ekfrequenz ekfrequenz ON ekfrequenz.id = tpop.ekfrequenz
  WHERE
    ekfrequenz.code LIKE '%nie%')
DELETE FROM apflora.ekplan
WHERE tpop_id IN (
    SELECT
      id
    FROM
      tpop_id_to_unplan)
  -- reset year every time this query is run:
  AND jahr > 2021;

