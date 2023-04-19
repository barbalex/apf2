UPDATE
  apflora.qk
SET
  sort = sort + 1
WHERE
  sort > 71;

INSERT INTO apflora.qk(name, titel, sort)
  VALUES ('tpopAbperNichtRelevantGrundHistorischStatusAktuell', 'Teilpopulation, Status aktuell, Begründung für AP-Bericht-Nicht-Relevanz is: historisch', 72);

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT
  id,
  'tpopAbperNichtRelevantGrundHistorischStatusAktuell'
FROM
  apflora.ap;

