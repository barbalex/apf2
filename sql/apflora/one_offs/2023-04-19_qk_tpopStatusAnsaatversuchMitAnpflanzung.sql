UPDATE
  apflora.qk
SET
  sort = sort + 1
WHERE
  sort > 86;

INSERT INTO apflora.qk(name, titel, sort)
  VALUES ('tpopStatusAnsaatversuchMitAnpflanzung', 'Teilpopulation, Status: "Ansaatversuch", es gibt eine Anpflanzung. Status sollte daher "angesiedelt, aktuell" sein', 87);

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT
  id,
  'tpopStatusAnsaatversuchMitAnpflanzung'
FROM
  apflora.ap;

