DROP VIEW IF EXISTS apflora.v_q_tpop_erste_massn_vor_bekannt_seit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpop_erste_massn_vor_bekannt_seit AS SELECT
  ap.proj_id,
  pop.ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id,
  tpop.nr,
  'Erste Massnahme: ' || min(massn.jahr) || ', Tpop bekannt seit: ' || tpop.bekannt_seit  as bemerkung
FROM
  apflora.ap ap
  INNER JOIN apflora.pop pop ON pop.ap_id = ap.id
  INNER JOIN apflora.tpop tpop on tpop.pop_id = pop.id
  inner join apflora.tpopmassn massn on massn.tpop_id = tpop.id and massn.jahr < tpop.bekannt_seit
group by
  ap.proj_id,
  pop.ap_id,
  pop.id,
  pop.nr,
  tpop.id,
  tpop.nr
ORDER BY
  pop.nr,
  tpop.nr;


UPDATE
  apflora.qk
SET
  sort = sort + 1
WHERE
  sort > 87;

INSERT INTO apflora.qk(name, titel, sort)
  VALUES ('tpopErsteMassnVorBekanntSeit', 'Teilpopulation ist jünger als die erste Massnahme', 88);

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT
  id,
  'tpopErsteMassnVorBekanntSeit'
FROM
  apflora.ap;