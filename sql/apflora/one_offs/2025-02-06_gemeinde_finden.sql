WITH adm AS (
  SELECT
    country, text, geom, namespace
  FROM
    apflora.ch_administrative_unit
  WHERE
	  localisedcharacterstring = 'Gemeinde'
)
SELECT
    tax.artname,
    pop.nr AS pop_nr,
    tpop.id,
    tpop.nr AS tpop_nr,
    tpop.gemeinde,
	  adm.text as gemeinde_aus_adm
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop pop ON pop.id = tpop.pop_id
    INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
    INNER JOIN apflora.ae_taxonomies tax on ap.art_id = tax.id,
    adm
  WHERE
    tpop.geom_point IS NOT NULL
    AND ST_CoveredBy(tpop.geom_point, adm.geom)
    -- and tpop.gemeinde <> adm.text
  ORDER BY
    tax.artname,
    pop.nr,
    tpop.id,
    tpop.nr;