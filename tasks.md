---
---

---

---

---

---

---

When you're confident it's settled in with real users — a few days of normal traffic is the usual bar — the remaining work is the phase-6 teardown in tasks.md: removing the PostGraphile container and backend/ dirs, the graphql/ dir, apollo.config.cjs, codegen.ts, the @apollo/client/graphql/rxjs deps, src/apolloClient.ts/apolloGql.ts/src/gql//fragments.ts, and the /graphql Caddy route. Until then PostGraphile stays up as the rollback path, which is exactly where you want it right now.

Just say the word when you want the teardown started, or if anything else surfaces in the meantime.

---

vermehrung-style api-tests harness (mints HS256 JWTs per role, vitest) to test RLS through PostgREST directly.

---

- [x] **EkPlan header filters: EK Frequenz (and Startjahr, EK-Abrechnungstyp) wrote the ART filter (01.11.2026, user-reported).** TextFilter maps column names to filter atoms; ekfrequenz/ekfrequenzStartjahr/ekAbrechnungstyp were missing from the map and silently fell back to the Art filter atom - typing in them never filtered their own column and instead set apName (hence the observed "set for EK Abrechnung Typ instead" cross-talk). Fixed by mapping the three columns; the fallback is now strict (unmapped columns render no input instead of writing another column's filter). ALL 18 header-filter request shapes replayed against dev query_tpop and cross-checked with SQL (incl. lv95X/lv95Y via the computed-function fallback and the three reverse-relation year filters) - all equivalent. New regression test tests/ekplan/header-filters.spec.ts (filters by code, Art column stays clean, clear restores 753); Playwright 32/32, typecheck 0, lint 0. NOTE: tpop status filter defaults to all statuses - counts in tests must expect that.

**Deploy gotcha (01.11.2026 go-live):** after a Vercel rollback (promoting an old deployment), apflora.ch keeps its domain aliases pinned to that promoted deployment — subsequent `npm run deploy` runs build successfully (Ready, Production) but never reclaim the domain. Fix: `npx vercel promote <newest-deployment-url> --scope gabrielsoftware`. After any rollback, the next deploy must be promoted manually. Verified live: apflora.ch serves 1.137.19/postgrest after promoting.

---
