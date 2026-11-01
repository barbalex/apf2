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

**Deploy gotcha (01.11.2026 go-live):** after a Vercel rollback (promoting an old deployment), apflora.ch keeps its domain aliases pinned to that promoted deployment — subsequent `npm run deploy` runs build successfully (Ready, Production) but never reclaim the domain. Fix: `npx vercel promote <newest-deployment-url> --scope gabrielsoftware`. After any rollback, the next deploy must be promoted manually. Verified live: apflora.ch serves 1.137.19/postgrest after promoting.

---
