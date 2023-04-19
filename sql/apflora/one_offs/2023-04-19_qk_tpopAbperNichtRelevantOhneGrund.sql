UPDATE
  apflora.qk
SET
  sort = sort + 1
WHERE
  sort > 70;

INSERT INTO apflora.qk(name, titel, sort)
  VALUES ('tpopAbperNichtRelevantOhneGrund', 'Teilpopulation, für AP-Bericht nicht relevant, ohne Begründung', 71);

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT
  id,
  'tpopAbperNichtRelevantOhneGrund'
FROM
  apflora.ap;

