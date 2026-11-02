---
---

---

can we use https://github.com/pgrls/pgrls to test/analyze Postgres Row-Level Security?

---

---

I see there are still a few useCallback and useMemo (and others?) usages. Are they still needed considering this app uses react compiler?

---

---

When you're confident it's settled in with real users — a few days of normal traffic is the usual bar — the remaining work is the phase-6 teardown in tasks.md: removing the PostGraphile container and backend/ dirs, the graphql/ dir, apollo.config.cjs, codegen.ts, the @apollo/client/graphql/rxjs deps, src/apolloClient.ts/apolloGql.ts/src/gql//fragments.ts, and the /graphql Caddy route. Until then PostGraphile stays up as the rollback path, which is exactly where you want it right now.

Just say the word when you want the teardown started, or if anything else surfaces in the meantime.

---

---

---
