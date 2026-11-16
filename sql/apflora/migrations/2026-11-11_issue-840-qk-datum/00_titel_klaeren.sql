-- #840: the titel "… ohne Jahr, ohne oder mit verdächtigem Datum" reads as
-- if BOTH the year and the date had to be missing/suspicious for a message
-- to appear. The check actually reports when EITHER is missing or the date
-- is suspicious (> 100 years before/after today) — reword to make the
-- or-relationship explicit.

UPDATE apflora.qk
SET titel = 'Massnahme ohne Jahr oder ohne bzw. mit verdächtigem Datum'
WHERE name = 'tpopmassnDatum'
  AND titel = 'Massnahme ohne Jahr, ohne oder mit verdächtigem Datum';

UPDATE apflora.qk
SET titel = 'Feldkontrolle ohne Jahr oder ohne bzw. mit verdächtigem Datum'
WHERE name = 'tpopfeldkontrDatum'
  AND titel = 'Feldkontrolle ohne Jahr, ohne oder mit verdächtigem Datum';

UPDATE apflora.qk
SET titel = 'Freiwilligen-Kontrolle ohne Jahr oder ohne bzw. mit verdächtigem Datum'
WHERE name = 'tpopfreiwkontrDatum'
  AND titel = 'Freiwilligen-Kontrolle ohne Jahr, ohne oder mit verdächtigem Datum';

-- verify afterwards (must return exactly 3 rows):
--   SELECT name, titel FROM apflora.qk
--   WHERE name IN ('tpopmassnDatum','tpopfeldkontrDatum','tpopfreiwkontrDatum');
