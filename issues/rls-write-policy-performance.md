# RLS write policies: grant checks scaled with the user's AP grants (Charlotte's 3s lag)

Reported 2026-11-17 by Charlotte Salzmann: every "saving" interaction in the
EK forms (Methode wählen, Zählung hinzufügen, Kontrollbericht Jahr) takes
~3 seconds, consistently, always at the same spots. Entering the Zählung
Einheit is instant. She fears it worsens as she enters more data. Same story
as 2025-12, when her old account (`salzmann`) became unusable-slow on every
machine and only a fresh account (fewer grants) fixed it ("es ist das
Login!!").

## Root cause

The write policies (`writer_*` on the tpopkontr family, and the `WITH CHECK`
of the FOR ALL `reader` policies on the hierarchy tables) checked ap_writer
grants like this:

```sql
tpop_id IN (
  SELECT tpop.id FROM apflora.tpop
  JOIN apflora.pop ON ... JOIN apflora.ap_user ON ...
  WHERE ap_user.user_name = current_user_name())
```

For a single-row `UPDATE ... WHERE id = eq.X` Postgres built the grant SET
instead of probing outward: seq-scan over all ~21k tpop rows, nested-looped
against the user's materialized granted pops — **10 million rejected join
rows, ~850 ms for an account with 6 grants** (measured on the dev machine
with the Nov-14 production backup). The `tpop`/`pop` reader policies nest
their own policy subqueries INTO that subquery (RLS recursion, 17 subplans
in the plan), which is what pushes the planner into this shape.

The cost scales with (number of ap_user grants) x (total row counts). That
explains everything:

- account-specific (December: same data, her login slow, test login fast)
- fresh account = few grants = fast, then it regrows as grants/data grow
- "wird es noch schlimmer?" — yes, structurally, until fixed
- why "Einheit" felt fast: that save patches the TanStack cache client-side
  (`updateTpopkontrzaehlInCaches`, issue 837) and never waits for the
  refetch — the server-side PATCH cost was equally ~250 ms, the UI just
  didn't block on it

Measured (identical data, only the account differs):

| account | grants | UPDATE tpopkontr by pk |
|---|---|---|
| superuser (no RLS) | – | 19 ms |
| chsalzmann (current) | 6 | 243 ms |
| salzmann (old, Dec 2025) | 44 | 1165 ms |

On the slower production VM plus client round trips and the post-save form
refetch, that is her measured ~3 s per interaction.

## Fix (migration 0066)

`sql/migration/0066-rls-write-policy-performance.sql`: 9 STABLE
SECURITY DEFINER probe helpers (`apflora.current_user_granted_in_ap/pop/
tpop/tpopkontr/tpopmassn/idealbiotop/pop_history`, `_for_art`,
`current_user_owns_freiwkontr`) that walk outward from the written row via
primary keys — constant cost. All 33 write-relevant policy expressions use
them; read-side USING clauses stay byte-identical (bulk reads keep the
hashable IN-subquery shape; no per-row function calls on exports).

After (same statements, same accounts):

| statement | chsalzmann | salzmann |
|---|---|---|
| UPDATE tpopkontr | 5.3 ms | 1.8 ms |
| UPDATE tpopber | 3.1 ms | 1.8 ms |
| UPDATE tpopkontrzaehl | 15 ms | 2.7 ms |
| INSERT tpopkontrzaehl | 2.2 ms | 0.6 ms |

Why the reader policies keep their IN-subqueries: for bulk SELECTs the
planner hashes the grant set once per statement — measured as granted
apflora_ap_reader, `count(*) FROM v_export_tpopkontr` (1195 rows) runs in
42 ms with the subqueries but 360 ms with per-row probe helpers (~8x
slower, scaling with row count). The probes are a write-path tool; a
future read-path optimization would need a set-returning grant function
instead.

Verified locally: all 133 api tests green (rls-matrix, rls, grants,
freiwillig, exports), forbidden writes still fail loudly with the RLS
check violation. One deliberate semantics fix rode along: the live
pop_history reader policy compared `id` (pop's pk) against ap ids —
invisible so far (no apflora_ap_reader users, historize writes as
superuser); the migration installs the canonical (correct) `ap_id` version.

Deployment: `scripts/apply-production-sql.sh` — the migration is one
transaction; policy recreation takes brief ACCESS EXCLUSIVE locks on the
affected tables.

## Follow-ups

- Charlotte's second message (2026-11-17) confirmed the diagnosis from the
  outside: "Bei den Pop-Berichten geht es immer schnell, bei den TPop-Berichten
  ist immer diese Verzögerung." Reproduced by temporarily restoring the old
  policies: popber's grant subquery is a short JOIN over ~580 pops (planner
  hashes it: **5.6-13 ms**), tpopber's is the nested IN-chain over all 21k
  tpops (**228-236 ms** locally -> ~3 s on production + refetches). Same
  table pair, same account, same data - only the subquery shape differs.
  With 0066 applied both are ~3 ms.
- Her "Kontrolle wird zuerst ohne Zählung angezeigt, dann erscheinen die
  kopierten Zählungen" is the same tax on the copy flow: copying an EK
  inserts the kontr and then each zaehlung one by one (copyZaehlOfTpopKontr),
  each insert paying the RLS tax - so the new kontr shows up first and its
  copied zaehlungen trickle in seconds later, which made her add duplicate
  zaehlungen she then had to delete. The fix removes that latency; the
  frontend follow-up below would additionally make the list update
  optimistically.
- Frontend: make the slow-to-feel forms optimistic like the Zählung form
  (cache-patch after save instead of awaiting the form-query refetch):
  Tpopfeldkontr Form, Tpopber Form, Zählung-hinzufügen navigation. With the
  RLS fix this is nice-to-have, not urgent.
- Charlotte's "moved EK deleted another EK" report (Typha shut, after
  Nov 14): code analysis says a move is a single row-scoped PATCH of
  tpop_id — no code path or trigger deletes another tpopkontr (only
  tpop deletion cascades). Most likely a display/mis-click consequence of
  the laggy UI. The Nov-14 backup predates the incident; to verify whether
  the row really vanished, diff consecutive production backups (backend/db
  keeps them) or re-test the move flow after the perf fix ships.
