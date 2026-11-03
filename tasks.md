---
---

---

can we use https://github.com/pgrls/pgrls to test/analyze Postgres Row-Level Security?

resolved 2026-11-03: yes, as a local lint tool (pgrls.toml, run against
backend-dev; verify's tenant model does not fit our membership-subquery
policies). It found a real hole: 95 legacy views ran as owner postgres
and bypassed RLS (ap_reader saw all 600 aps via v_ap_anzkontr) — fixed
in sql/migration/0064-views-security-invoker.sql; all 26 api-tests and
testCompileFilter still pass. Remaining review backlog in its output:
5 SECURITY DEFINER functions with EXECUTE to PUBLIC (SEC042, incl.
encrypt_pass/set_password — needed by anon login, check owner/search_path)
and unpinned search_paths (SEC014/015). Also fixed invalid CHECK syntax
in sql/apflora/createTables.sql (user table, lines 642-643).

backlog done 2026-11-03 in sql/migration/0065-rpc-hardening.sql, applied
to dev and production (pgrls now clean: 0 errors, 0 warnings): pinned
search_path (pg_temp last) on all SECURITY DEFINER functions, revoked
PUBLIC's default EXECUTE on historize/historize_for_ap/
correct_vornach_beginnap_stati (anon could call them as rpc!), revoked
all EXECUTE on encrypt_pass (trigger-only), dropped duplicate qk writer
policy, hid require_new_password_on_next_login from anon. set_password
stays anon-executable: passless pre-provisioned accounts (18/91) cannot
log in, so it is their only onboarding path — meaning anyone knowing a
passless username can claim the account. If that worries us, move
onboarding to invite tokens (design decision pending).

---

---

I see there are still a few useCallback and useMemo (and others?) usages. Are they still needed considering this app uses react compiler?

---

---

We need to finisch the graphql > postgrest migration. you once said:

"When you're confident it's settled in with real users — a few days of normal traffic is the usual bar — the remaining work is the phase-6 teardown in tasks.md: removing the PostGraphile container and backend/ dirs, the graphql/ dir, apollo.config.cjs, codegen.ts, the @apollo/client/graphql/rxjs deps, src/apolloClient.ts/apolloGql.ts/src/gql//fragments.ts, and the /graphql Caddy route. Until then PostGraphile stays up as the rollback path, which is exactly where you want it right now.

Just say the word when you want the teardown started, or if anything else surfaces in the meantime."

(some of this has probably already been done)

---

---

Something I noticed when looking at this example (may not be part of this issue): it seems Zuordnungs-Linien are not always drawn: I saw the line right after assigning the beob to the tpop. but then it disappeared. Actually: I can see a pink/yellow (when beob is active) point. clicking on it opens a zuordnung window. but instead of a line connecting the beob to the tpop I only see a point at the position of the beob

---

Maybe we should query for beob assigned to tpops that do not belong to the same species. Remember: Same AP can have multiple taxa (species) it deals with. So beob of multiple taxa can belong to the ap but they have to be listed on the 'Taxa' node in the nav tree.
