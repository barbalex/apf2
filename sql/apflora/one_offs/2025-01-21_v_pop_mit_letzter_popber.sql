DROP VIEW IF EXISTS apflora.v_pop_mit_letzter_popber CASCADE;

CREATE OR REPLACE VIEW apflora.v_pop_mit_letzter_popber AS
with letzter_popber AS (
  SELECT DISTINCT ON (apflora.popber.pop_id)
    apflora.popber.pop_id,
    apflora.popber.jahr
  FROM
    apflora.popber
  WHERE
    apflora.popber.jahr IS NOT NULL
  ORDER BY
    apflora.popber.pop_id,
    apflora.popber.jahr DESC
),
tpop_info AS (
  SELECT
    pop_id,
    array_to_string(array_agg(nr || ': ' || apber_relevant::text ORDER BY nr), ', ') AS apber_relevant,
  array_to_string(array_agg(nr || ': ' || gw.text ORDER BY nr), ', ') AS apber_relevant_grund
FROM
  apflora.tpop
  LEFT JOIN apflora.tpop_apberrelevant_grund_werte gw ON apflora.tpop.apber_relevant_grund = gw.code
GROUP BY
  pop_id
)
SELECT
  ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  ap_bearbstand_werte.text AS ap_bearbeitung,
  ap.start_jahr AS ap_start_jahr,
  ap_umsetzung_werte.text AS ap_umsetzung,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  pop.bekannt_seit AS pop_bekannt_seit,
  pop.status_unklar AS pop_status_unklar,
  pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  pop.lv95_x AS pop_x,
  pop.lv95_y AS pop_y,
  tpop_info.apber_relevant AS tpops_apber_relevant,
  tpop_info.apber_relevant_grund AS tpops_apber_relevant_grund,
  EXISTS ( SELECT DISTINCT
      pop_id
    FROM
      apflora.tpop tpop2
    WHERE
      pop_id = pop.id
      AND EXISTS (
        SELECT
          id
        FROM
          apflora.tpop
        WHERE
          pop_id = tpop2.pop_id
          AND apber_relevant = TRUE)
        -- not exists prevents results
        AND NOT EXISTS (
          SELECT
            id
          FROM
            apflora.tpop
          WHERE
            pop_id = tpop2.pop_id
            AND apber_relevant_grund > 3))::text AS pop_relevant_fuer_projektdoku_karten,
  pop.created_at AS pop_created_at,
  pop.updated_at AS pop_updated_at,
  pop.changed_by AS pop_changed_by,
  popber.id AS popber_id,
  popber.jahr AS popber_jahr,
  tpop_entwicklung_werte.text AS popber_entwicklung,
  popber.bemerkungen AS popber_bemerkungen,
  popber.created_at AS popber_created_at,
  popber.updated_at AS popber_updated_at,
  popber.changed_by AS popber_changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap ap ON apflora.ae_taxonomies.id = ap.art_id
  LEFT JOIN apflora.ap_bearbstand_werte ap_bearbstand_werte ON ap.bearbeitung = ap_bearbstand_werte.code
  LEFT JOIN apflora.ap_umsetzung_werte ap_umsetzung_werte ON ap.umsetzung = ap_umsetzung_werte.code
  INNER JOIN apflora.pop pop ON ap.id = pop.ap_id
  LEFT JOIN tpop_info ON pop.id = tpop_info.pop_id
  LEFT JOIN letzter_popber ON pop.id = letzter_popber.pop_id
  LEFT JOIN apflora.popber popber ON (letzter_popber.jahr = popber.jahr)
  AND (letzter_popber.pop_id = popber.pop_id)
  LEFT JOIN apflora.tpop_entwicklung_werte tpop_entwicklung_werte ON popber.entwicklung = tpop_entwicklung_werte.code
  LEFT JOIN apflora.pop_status_werte pop_status_werte ON pop.status = pop_status_werte.code
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  pop.nr,
  letzter_popber.jahr;

COMMENT ON VIEW apflora.v_pop_mit_letzter_popber IS '@foreignKey (pop_id) references pop (id)';

