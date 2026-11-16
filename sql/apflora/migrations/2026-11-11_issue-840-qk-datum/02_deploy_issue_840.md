# Issue 840: QK für fehlendes Datum

Two findings drove this migration:

1. Rebecca's export showed > 800 records without a date that never
   appeared in the date QKs — even with the year filled. Root cause (fixed
   in the app, not here): the phase-5 QK rewrite nested the check results
   under generic keys (`tpopChildRel`/`popChildRel`) that
   `createMessageFunctions` never reads, so 21 checks silently returned
   nothing. The app fix restores the PostGraphile relation keys
   (`tpopmassnsByTpopId`, …).

2. The date QKs only flag missing or implausible values (> 100 years
   before/after today). Records where Jahr and Datum are both filled but
   contradict each other (Jahr 2020, Datum 15.03.2015) passed silently.
   Three new checks close that gap, one per family.

The titel rewording addresses the original question in #840: the old
"… ohne Jahr, ohne oder mit verdächtigem Datum" read as if both had to be
missing; the check is an OR.

## Steps

1. run the migration on the live server:
   - `00_titel_klaeren.sql`
   - `01_neue_checks_datum_jahr.sql`
2. verify the titles (3 rows):
   `SELECT name, titel FROM apflora.qk
    WHERE name IN ('tpopmassnDatum','tpopfeldkontrDatum','tpopfreiwkontrDatum');`
3. verify the sort order around the new checks:
   `SELECT sort, name FROM apflora.qk WHERE sort BETWEEN 90 AND 104 ORDER BY sort;`
4. verify activation (3 rows, ~600 each):
   `SELECT qk_name, count(*) FROM apflora.apqk
    WHERE qk_name LIKE '%DatumJahr' GROUP BY qk_name;`
5. verify messages exist for an AP with known mismatches, e.g.:
   `SELECT * FROM apflora.v_q_tpopmassn_datum_jahr;`
6. deploy the app; then in the app: Daten → Art → Qualitätskontrollen —
   the reworded checks show their messages again, and the three new
   "Datum passt nicht zum Jahr" checks appear and list mismatches.
