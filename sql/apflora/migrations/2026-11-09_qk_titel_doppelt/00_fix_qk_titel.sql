-- apflora.qk contains two checks with the same titel:
--
--   anpflanzungZielrelevanteEinheitFalsch
--   anpflanzungOhneZielrelevanteEinheit
--
-- Both carry "Anpflanzung: Die zielrelevante Einheit entspricht nicht
-- (mehr) der Einstellung bei den EK-Zähleinheiten". The rows were written
-- in one shot (identical created_at), so the titel of
-- anpflanzungOhneZielrelevanteEinheit was clobbered with the other
-- check's titel; the one-off 2021-01-31_qk_anpflanzung_ohne_
-- zielrelevante_einheit.sql defines it differently.
--
-- Consequence in the app: Qualitätskontrollen keyed the result groups by
-- titel, so React warned about duplicate keys and could omit one of the
-- two groups. The app now keys by name (primary key), but the wrong
-- titel still mislabels the results of anpflanzungOhneZielrelevante
-- Einheit, so correct the data too.

UPDATE apflora.qk
SET titel = 'Anpflanzung: Es wurde kein Wert im Feld der zielrelevanten Einheit erfasst'
WHERE name = 'anpflanzungOhneZielrelevanteEinheit'
  AND titel = 'Anpflanzung: Die zielrelevante Einheit entspricht nicht (mehr) der Einstellung bei den EK-Zähleinheiten';

-- verify afterwards (must return 0 rows):
--   SELECT name, titel
--   FROM apflora.qk
--   GROUP BY name, titel
--   HAVING count(*) > 1;
-- and (must return exactly 1 row):
--   SELECT titel FROM apflora.qk
--   WHERE name = 'anpflanzungOhneZielrelevanteEinheit';
