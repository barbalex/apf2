-- #840: new checks for records where Jahr and Datum are both filled but
-- the Datum lies in a different year than the Jahr field — e.g. Jahr 2020
-- with Datum 15.03.2015. The existing date checks only catch missing or
-- implausible (> 100 years off) values, so such mismatches passed silently.
--
-- One check per family (Massnahme / Feldkontrolle / Freiwilligen-Kontrolle),
-- each backed by a view (compile_filter cannot compare a date's year to a
-- column, so query_* RPCs are not an option).

DROP VIEW IF EXISTS apflora.v_q_tpopmassn_datum_jahr CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpopmassn_datum_jahr AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  massn.id,
  massn.jahr,
  massn.datum,
  'Jahr: ' || massn.jahr || ', Datum: ' || to_char(massn.datum, 'DD.MM.YYYY') AS bemerkung
FROM
  apflora.ap ap
  INNER JOIN apflora.pop pop ON pop.ap_id = ap.id
  INNER JOIN apflora.tpop tpop ON tpop.pop_id = pop.id
  INNER JOIN apflora.tpopmassn massn ON massn.tpop_id = tpop.id
WHERE
  massn.jahr IS NOT NULL
  AND massn.datum IS NOT NULL
  AND extract(year FROM massn.datum) <> massn.jahr
ORDER BY
  pop.nr,
  tpop.nr,
  massn.jahr;

DROP VIEW IF EXISTS apflora.v_q_tpopfeldkontr_datum_jahr CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpopfeldkontr_datum_jahr AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  kontr.id,
  kontr.jahr,
  kontr.datum,
  'Jahr: ' || kontr.jahr || ', Datum: ' || to_char(kontr.datum, 'DD.MM.YYYY') AS bemerkung
FROM
  apflora.ap ap
  INNER JOIN apflora.pop pop ON pop.ap_id = ap.id
  INNER JOIN apflora.tpop tpop ON tpop.pop_id = pop.id
  INNER JOIN apflora.tpopkontr kontr ON kontr.tpop_id = tpop.id
WHERE
  kontr.typ <> 'Freiwilligen-Kontrolle'
  AND kontr.jahr IS NOT NULL
  AND kontr.datum IS NOT NULL
  AND extract(year FROM kontr.datum) <> kontr.jahr
ORDER BY
  pop.nr,
  tpop.nr,
  kontr.jahr;

DROP VIEW IF EXISTS apflora.v_q_tpopfreiwkontr_datum_jahr CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_tpopfreiwkontr_datum_jahr AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  kontr.id,
  kontr.jahr,
  kontr.datum,
  'Jahr: ' || kontr.jahr || ', Datum: ' || to_char(kontr.datum, 'DD.MM.YYYY') AS bemerkung
FROM
  apflora.ap ap
  INNER JOIN apflora.pop pop ON pop.ap_id = ap.id
  INNER JOIN apflora.tpop tpop ON tpop.pop_id = pop.id
  INNER JOIN apflora.tpopkontr kontr ON kontr.tpop_id = tpop.id
WHERE
  kontr.typ = 'Freiwilligen-Kontrolle'
  AND kontr.jahr IS NOT NULL
  AND kontr.datum IS NOT NULL
  AND extract(year FROM kontr.datum) <> kontr.jahr
ORDER BY
  pop.nr,
  tpop.nr,
  kontr.jahr;

-- register the checks right after their siblings; insert in descending
-- target position so the sort shifts don't collide
UPDATE apflora.qk
SET sort = sort + 1
WHERE sort > 100;

INSERT INTO apflora.qk(name, titel, sort)
VALUES (
  'tpopfreiwkontrDatumJahr',
  'Freiwilligen-Kontrolle: Datum passt nicht zum Jahr',
  101
);

UPDATE apflora.qk
SET sort = sort + 1
WHERE sort > 99;

INSERT INTO apflora.qk(name, titel, sort)
VALUES (
  'tpopfeldkontrDatumJahr',
  'Feldkontrolle: Datum passt nicht zum Jahr',
  100
);

UPDATE apflora.qk
SET sort = sort + 1
WHERE sort > 91;

INSERT INTO apflora.qk(name, titel, sort)
VALUES (
  'tpopmassnDatumJahr',
  'Massnahme: Datum passt nicht zum Jahr',
  92
);

-- activate the new checks for every AP
INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT id, 'tpopmassnDatumJahr' FROM apflora.ap;

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT id, 'tpopfeldkontrDatumJahr' FROM apflora.ap;

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT id, 'tpopfreiwkontrDatumJahr' FROM apflora.ap;

-- default privileges cover new views for the read roles; grant explicitly
-- anyway so the checks work regardless of who created the views
GRANT SELECT ON
  apflora.v_q_tpopmassn_datum_jahr,
  apflora.v_q_tpopfeldkontr_datum_jahr,
  apflora.v_q_tpopfreiwkontr_datum_jahr
TO
  apflora_reader,
  apflora_ap_reader,
  apflora_ap_writer,
  apflora_freiwillig,
  apflora_manager;

-- verify afterwards:
--   sort order around the new checks:
--     SELECT sort, name FROM apflora.qk WHERE sort BETWEEN 90 AND 104 ORDER BY sort;
--   every AP activated them:
--     SELECT qk_name, count(*) FROM apflora.apqk
--     WHERE qk_name LIKE '%DatumJahr' GROUP BY qk_name;
--   messages exist (adapt one ap_id):
--     SELECT count(*) FROM apflora.v_q_tpopmassn_datum_jahr;
