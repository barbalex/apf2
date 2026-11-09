# Fix the duplicated titel in apflora.qk

Reproduced on the dev stack (2026-11-09), Daten → Art →
Qualitätskontrollen:

- Browser console: `Encountered two children with the same key,
  'Anpflanzung: Die zielrelevante Einheit entspricht nicht (mehr) der
  Einstellung bei den EK-Zähleinheiten'`
- `SELECT name FROM apflora.qk GROUP BY titel HAVING count(*) > 1`
  returns the pair `anpflanzungZielrelevanteEinheitFalsch` /
  `anpflanzungOhneZielrelevanteEinheit`.

Cause: the titel of `anpflanzungOhneZielrelevanteEinheit` was written as
a copy of `anpflanzungZielrelevanteEinheitFalsch`'s titel when the qk
rows were seeded (identical created_at on all qk rows), while the
original one-off (2021-01-31) defines
"Anpflanzung: Es wurde kein Wert im Feld der zielrelevanten Einheit
erfasst". The app additionally keyed the result groups by titel, so
React could omit one of the two groups.

Fix: the app now keys groups by qk.name (primary key); this migration
restores the correct titel so the results are labeled correctly.

## Steps

1. run the migration on the live server:
   - `00_fix_qk_titel.sql`
2. verify (must return 0 rows):
   `SELECT titel FROM apflora.qk GROUP BY titel HAVING count(*) > 1;`
3. verify in the app: Daten → Art → Qualitätskontrollen - the check
   "Anpflanzung: Es wurde kein Wert im Feld der zielrelevanten Einheit
   erfasst" appears under its own (correct) title and the console no
   longer warns about duplicate keys.
