---
---

---

---

🚧 in progress 30.10.2026 — PostGraphile → PostgREST migration

Assessment: migrate. The security model (`login()`, JWT claims, 58 RLS'd tables in `sql/`) already lives in Postgres and carries over unchanged — PostGraphile is just an adapter over it. It is maintenance-mode (4.14) with an alpha postgis-filter plugin pinned. ae3 (same source stack) and vermehrung both moved to PostgREST in October 2026 and left documented patterns. The one genuine redesign is the recursive tree filter cascade → server-side jsonb RPCs; phase 0 spikes it and can veto.

Decision log:

- PostgREST v12.2.3 — matches ae3's diary exactly for the auth port; revisit v16 at cutover.
- Filter strategy: the `tree*GqlFilterAtom` atoms keep emitting their current filter objects; they are JSON-serialized and POSTed to `query_<table>(p_filter jsonb)` RPCs compiled server-side by `compile_filter`. No URL-length limits, no embed-alias gotchas, PostGIS operators included.
- Reads keep TanStack Query orchestration (already the pattern); Apollo is replaced by a small typed fetch wrapper (ae3 `src/modules/api.js` pattern).
- Types: kanel (vermehrung pattern) generates row models from Postgres; graphql-codegen and per-operation types are dropped.
- Labels: `<table>_label` functions keep working by compiling `label` filter fields to the function calls; long-term they become columns of views.
- Dual-stack: PostgREST runs alongside PostGraphile (same JWT secret) so migration is module-by-module; PostGraphile is removed only in the last phase.

## Phase 0 — Spike: filter-cascade RPC + PostgREST in backend-dev (go/no-go)

- [x] `postgrest` service in `backend-dev/docker-compose.yml` (v12.2.3, schema `apflora`, anon role, `PGRST_DB_CONFIG=false`)
- [x] `sql/postgrest/compileFilter.sql`: `compile_filter(table, alias, jsonb)` — and/or, equalTo/notEqualTo/in/isNull, includes/includesInsensitive, greaterThanOrEqualTo/lessThanOrEqualTo, coveredBy (st_coveredby), label (via `<table>_label`), relations resolved from the catalog (`popByPopId` → exists-subquery, recursion nests arbitrarily deep)
- [x] `sql/postgrest/queryTpop.sql`: `query_tpop(p_filter, p_order, p_limit, p_offset)` returns setof apflora.tpop — accepts the exact jsonb `treeTpopGqlFilterAtom` emits
- [x] `sql/postgrest/testCompileFilter.sql`: 8 equivalence tests vs hand-written SQL on the 21k-tpop dev DB + RLS test — all green
- [x] curl smoke test through PostgREST incl. a bearer token minted via `auth.sign`

Spike results (30.10.2026) — **go**:

- Equivalence: same filter + same token returns the same 8 tpops via `POST /rpc/query_tpop` and via PostGraphile `allTpops(filter: …)`.
- RLS end-to-end: token with role `apflora_ap_reader` + username claim → 2860 of 21433 tpops through PostgREST, identical to the psql `SET ROLE` expectation. Unauthenticated calls get 401 (anon deliberately has no EXECUTE grant).
- Dual-stack proven: one token (with `aud: "postgraphile"`) works on both APIs simultaneously.
- Performance: PostGIS coveredBy bbox over the full table through the RPC = ~21 ms.
- `select=` shaping, `Prefer: count=exact` (Content-Range), `p_order` incl. parent columns (`popByPopId.nr`) all work on RPCs.
- Done along the way (was a phase 1 item): `current_user_name()` now reads PostgREST's single `request.jwt.claims` JSON GUC first, falling back to PostGraphile's `jwt.claims.username` (sql/apflora/createTables.sql) — both stacks keep working.
- Gotchas hit: PostGraphile requires `aud: "postgraphile"` in the token; invoker-rights `query_tpop` needs EXECUTE grants on the helper functions for the calling roles, not just on itself; `auth.sign` takes `json`, not `jsonb`.

## Phase 1 — Infra + auth (dual-stack in production)

- `postgrest` container in `backend/docker-compose.yml`; Caddy: `api.apflora.ch/postgrest/*` → `postgrest:3000` (ae3 `handle_path` pattern); PostGraphile stays at `/graphql`.
- port the rest of ae3's auth diary (`backend/db/migrations/2026-10-27-postgrest-auth.sql`): JWT secret ≥ 32 bytes (rotate — jose rejects shorter; dev secret is 36, check prod), claims aud/exp/username signed in (login already signs aud), `request.sql` helpers read the single `request.jwt.claims` JSON GUC (`current_user_name()` is done).
- login via `POST /rpc/login`; verify existing tokens keep working for PostGraphile during transition.
- tighten spike-era grants: `query_*` execute only for roles that may read the table; RLS still decides rows.

## Phase 2 — Client foundation

- `src/modules/api.ts` (ae3 api.js pattern, typed): `postgrestUri()`, `apiFetch` with Bearer from `userTokenAtom` + exp check, `Prefer: return=minimal` default for mutations, `rpc()`, `apiCount()` (Prefer: count=exact + content-range).
- kanel setup (config from vermehrung) + npm script; `src/models/` stays until parity.
- select-string helpers replacing the 55 fragments in `src/components/shared/fragments.ts`.
- Apollo stays wired until phase 6 — modules migrate one at a time.

## Phase 3 — Mutations (172, mechanical, lowest risk first)

- imperative `apolloClient.mutate` → `apiFetch` POST/PATCH/DELETE; client-generated UUIDs for inserts (ae3 pattern: RLS may hide returned rows → return=minimal).
- dynamic ones first (they get simpler): `Files/index.tsx` `create${Parent}File`, `DeleteDatasetModal`, `Deletions/undelete`.
- `historize`, `historizeForAp`, `uploadSignature` → `/rpc/`; invalidateQueries stays as-is.

## Phase 4 — Reads (191 static + nav data hooks)

- `use*NavData.ts` and form loads: `?select=` with fk-hinted embeds (ae3 patterns); totalCount (367 uses) → `apiCount`.
- order-by-related (9 uses) → `order=` via embeds (`order=pop.nr`) or the RPC `p_order`.
- query batching (BatchHttpLink) is dropped — Caddy HTTP/2 + parallel react-query fetches replace it.
- computed fields (labels etc.) in selects compile to label functions / view columns.

## Phase 5 — Filter cascade + PostGIS

- `query_<table>` RPC family for the tree-filtered tables (tpopmassn, tpopkontr, beob, ek, qk…): reuse `compile_filter`.
- serialize `tree*GqlFilterAtom` outputs into queryFn bodies — the atoms themselves stay unchanged.
- map polygon filters (coveredBy/contains/within/intersects, 29 uses) stay inside the RPC jsonb — no PostgREST URL syntax needed.
- DataFilter OR-tabs and the all/filtered variants verified against the Playwright tree tests.

## Phase 6 — Cutover & cleanup

- remove PostGraphile containers (`backend/`, `backend-dev/`), `graphql/` dir, `apollo.config.cjs`, `codegen.ts`, schema-dump script.
- remove `@apollo/client`, `graphql`, `rxjs`, graphql-codegen deps; `src/apolloClient.ts`, `src/apolloGql.ts`, `src/gql/`, `fragments.ts`; the `dataIdFromObject` allowlist logic goes with it.
- Caddy: `/graphql` gone; Playwright suite green against the PostgREST-only stack.
- optional: vermehrung-style api-tests harness (mints HS256 JWTs per role, vitest) to test RLS through PostgREST directly.

---

---
