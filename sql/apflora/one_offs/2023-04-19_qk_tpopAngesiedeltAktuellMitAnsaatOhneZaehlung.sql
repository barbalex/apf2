UPDATE
  apflora.qk
SET
  sort = sort + 1
WHERE
  sort > 85;

INSERT INTO apflora.qk(name, titel, sort)
  VALUES ('tpopStatusAngesiedeltAktuellMitAnsaatOhneZaehlung', 'Teilpopulation, Status: "angesiedelt aktuell", Massnahme ist Ansaat, aber noch ohne Zählung. Status sollte daher "Ansaatversuch" sein', 86);

INSERT INTO apflora.apqk(ap_id, qk_name)
SELECT
  id,
  'tpopStatusAngesiedeltAktuellMitAnsaatOhneZaehlung'
FROM
  apflora.ap;

