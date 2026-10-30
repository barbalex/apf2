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

- [x] `postgrest` container in `backend/docker-compose.yml` (v12.2.3, like backend-dev; expose only, no host port — Caddy fronts it)
- [x] Caddy: `api.apflora.ch/postgrest/*` → `apf_postgrest:3000` (`handle_path`, PostgREST does its own CORS); everything else stays on PostGraphile
- [x] `apflora.login` signs the JWT in the database (pgjwt `auth.sign`, 24 h lifetime, aud/iss `postgraphile` — the same claims PostGraphile minted). Previously the function returned the raw secret as "token" and **PostGraphile** signed; PostgREST has no such conversion. Verified end-to-end in dev: `POST /rpc/login` works, the token drives `query_tpop`, the same token works on PostGraphile, wrong password → clean 403 `invalid user or password`.
- [x] security fix along the way: **every token issued so far contained the signing secret as its `token` claim** (login returned `current_setting('app.jwt_secret')`, PostGraphile embedded it), so any logged-in user could forge `apflora_manager` tokens. The new login no longer emits that claim → rotate the secret at deployment, it has been handed to every user for years.
- [x] `current_user_name()` reads `request.jwt.claims` (PostgREST) with fallback to `jwt.claims.username` (PostGraphile) — both stacks work simultaneously.
- [x] `request.*` helpers: grant-only, never referenced by policies/views/frontend — no port needed.
- [x] **deployed to the VPS** (30.10.2026, 139.162.172.88, project in `~/apf`): applied 0063 + `sql/postgrest/*` to the prod DB (spike test suite green there: 21455 tpops), rotated `JWT_SECRET`/`app.jwt_secret` together (md5-verified in sync; old tokens died with the rotation — users simply re-login), `postgrest` + `graphql` up, caddy restarted. Verified via `https://api.apflora.ch`: `/postgrest/` OpenAPI 200, `/rpc/query_tpop` anonymous 401, wrong password → `invalid user or password`, GraphQL unchanged, a DB-minted token works on both APIs. VPS keeps `rollback-0063.sql` (old login + current_user_name) and `.env.backup-before-rotation-*`.
- [ ] tighten spike-era grants on the prod DB if desired (execute on `query_*`/helpers matches table-access roles; anon has nothing).

## Phase 2 — Client foundation

- [x] `src/modules/api.ts` (ae3 api.js pattern, typed): `postgrestUri()`, `apiFetch` with Bearer from `userTokenAtom` + exp check, `Prefer: return=minimal` default for mutations, `rpc()`, `apiCount()` (Prefer: count=exact + content-range), `ApiError` carrying the PostgREST error body.
- [x] kanel setup restored: `src/models/` was already Kanel-generated but the config was never committed. `kanel.config.mjs` (connects to the dev db as postgres — restricted roles crash the view parser on views they cannot read) + `scripts/kanel-generate.mjs` (rewrites `.js` imports to `.ts`, fixes verbatimModuleSyntax enum defaults, generates per-schema `index.ts` barrels incl. the `*Code` type aliases from the former hand barrel) + `npm run models:generate`. Regeneration fixed the type baseline to 0 known errors (old models were stale: `Date` instead of `string`, missing post-0061 columns).
- [x] proof of concept: login (User.tsx) migrated to `rpc('login')` — the first production path on PostgREST. `userByName` stays on Apollo until phase 4. All 9 auth login tests green (chromium); firefox browsers aren't installed locally (`npx playwright install firefox`).
- [ ] select-string helpers replacing the 55 fragments in `src/components/shared/fragments.ts` — build per migrating module instead of upfront (typed `(keyof T)[]` arrays over the kanel models).
- [ ] Apollo stays wired until phase 6 — modules migrate one at a time.
- note: `playwright/.auth/user.json`'s password had drifted from the dev db backup — resynced gabriel's dev password to it. And `npm test` sets `NODE_ENV=dev` (localhost); bare `npx playwright test` runs against **production** (baseURL apflora.ch) — careful.

## Phase 3 — Mutations (172, mechanical, lowest risk first)

- [x] mutation helpers in `src/modules/api.ts`: `apiInsert` (single row or bulk array), `apiUpdate` (PATCH by id), `apiDelete` (DELETE by id); Content-Type default for bodies; `Prefer: return=minimal` stays the default for mutations.
- [x] dynamic ones first (they got much simpler):
  - `Files/index.tsx`: read via `?select=` with camelCase aliases (FileNode unchanged for consumers), insert via `apiInsert` — the old code interpolated upload values directly into the GraphQL string (injection-prone), now a JSON body. Also: the returned row was only used for navigation; `info.uuid` is known anyway, so no return=representation needed.
  - `DeleteDatasetModal/delete`: snapshot via `select=*` (snake_case, all columns — better undelete fidelity than the old fragments), delete via `apiDelete`; the 24 generated `queries/*ById.ts` files and the werte special case are gone.
  - `Deletions/undelete`: one generic `apiInsert(table, data)` re-inserts the snapshot with the same id; the 22 `queries/create*.ts` files are gone. deletedDatasets is an in-memory atom, so the snake_case snapshot has no compatibility tail.
- [x] `historize` (rpc + PATCH apberuebersicht.history_date), `historizeForAp` (rpc historize_for_ap), `uploadSignature` (rpc upload_signature) → `/rpc/`.
- [x] verified: insert→select=*→delete→undelete round-trip via dev PostgREST (201/204/201); 13 Playwright specs green (auth, prefetch, forms).
- test infrastructure fixed along the way (all pre-existing breakage): `playwright/.auth/user.json` contained only credentials, no auth state — protected tests always ran logged-out. `scripts/refresh-auth-state.mjs` now logs in via `rpc('login')` and writes fresh storage state (token lives 24 h — re-run when tests meet the Anmeldung dialog). Also updated stale expectations: uuidv1 ids in `forms/aktionsplan.spec.ts` (0061 rewrote them), route segment `Aktionspläne`→`Arten`, form title `Aktionsplan`→`Art`.
- [ ] the remaining ~100 modules with static `apolloClient.mutate` calls (forms, copyTo/moveTo, Ekf, EkPlan) — mechanical, migrate per module.

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
