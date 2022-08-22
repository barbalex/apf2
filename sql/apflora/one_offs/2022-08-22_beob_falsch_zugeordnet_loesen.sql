UPDATE
  apflora.beob
SET
  tpop_id = NULL
WHERE
  id IN (
    SELECT
      beob.id
    FROM
      apflora.beob beob
      INNER JOIN apflora.ae_taxonomies tax ON beob.art_id = tax.id
      INNER JOIN apflora.tpop tpop ON tpop.id = beob.tpop_id
      INNER JOIN apflora.pop ON pop.id = tpop.pop_id
      INNER JOIN apflora.ap ap ON ap.id = pop.ap_id
      INNER JOIN apflora.ae_taxonomies ap_tax ON ap_tax.id = ap.art_id
    WHERE
      tax.taxid > 150
      AND beob.art_id NOT IN (
        SELECT
          art_id
        FROM
          apflora.apart
        WHERE
          ap_id = ap.id)
        -- ignore the cases with a reason
        -- https://github.com/barbalex/apf2/issues/536#issuecomment-1131750267
        AND beob.id NOT IN ('982a5ff2-434e-11e8-ab21-5f04bad09dda', '982a5ff4-434e-11e8-ab21-23c850eb1de0', '982a5ff3-434e-11e8-ab21-4b3860ee97b2', '982a5ff1-434e-11e8-ab21-e39683b8fc95', '96bb2b33-434e-11e8-ab21-6b0c3a5b9e5c', '9844b0c9-434e-11e8-ab21-4b5f83c5b283', 'b90fbc67-434e-11e8-ab21-33324ec39a73', '982a5ffb-434e-11e8-ab21-bf65998c948a', '982a5ffa-434e-11e8-ab21-bf5af00202f9', '55dc32bc-b108-11ec-a125-d3ecf6c00007'));

