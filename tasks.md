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

**COMPLETE: zero `apolloClient.mutate` calls remain in src/ (verified by grep).** All writes go through `apiInsert`/`apiUpdate`/`apiDelete`/`apiUpdateByVariables`/`rpc` from `src/modules/api.ts`.

- [x] mutation helpers in `src/modules/api.ts`: `apiInsert` (single row or bulk array), `apiUpdate` (PATCH by id), `apiDelete` (DELETE by id); Content-Type default for bodies; `Prefer: return=minimal` stays the default for mutations.
- [x] dynamic ones first (they got much simpler):
  - `Files/index.tsx`: read via `?select=` with camelCase aliases (FileNode unchanged for consumers), insert via `apiInsert` — the old code interpolated upload values directly into the GraphQL string (injection-prone), now a JSON body. Also: the returned row was only used for navigation; `info.uuid` is known anyway, so no return=representation needed.
  - `DeleteDatasetModal/delete`: snapshot via `select=*` (snake_case, all columns — better undelete fidelity than the old fragments), delete via `apiDelete`; the 24 generated `queries/*ById.ts` files and the werte special case are gone.
  - `Deletions/undelete`: one generic `apiInsert(table, data)` re-inserts the snapshot with the same id; the 22 `queries/create*.ts` files are gone. deletedDatasets is an in-memory atom, so the snake_case snapshot has no compatibility tail.
- [x] `historize` (rpc + PATCH apberuebersicht.history_date), `historizeForAp` (rpc historize_for_ap), `uploadSignature` (rpc upload_signature) → `/rpc/`.
- [x] verified: insert→select=*→delete→undelete round-trip via dev PostgREST (201/204/201); 13 Playwright specs green (auth, prefetch, forms).
- test infrastructure fixed along the way (all pre-existing breakage): `playwright/.auth/user.json` contained only credentials, no auth state — protected tests always ran logged-out. `scripts/refresh-auth-state.mjs` now logs in via `rpc('login')` and writes fresh storage state (token lives 24 h — re-run when tests meet the Anmeldung dialog). Also updated stale expectations: uuidv1 ids in `forms/aktionsplan.spec.ts` (0061 rewrote them), route segment `Aktionspläne`→`Arten`, form title `Aktionsplan`→`Art`.
- [x] form field-save mutations (26 files: the `update<X>ById` + `${field}` + `changedBy` family): codemodded to `apiUpdateByVariables('<table>', variables)` (transitional adapter in api.ts: camel→snake keys, resolves dbTable via tables.ts, adds changed_by). Field-level saves verified against dev PostgREST (tpop: flurname/apber_relevant/changed_by; user table path works too). Removed ~1,100 lines of dynamicGql update boilerplate.
- [x] copyTo: one generic implementation — read `select=*` (GeoJSON geometry round-trips natively through PostgREST, no more JSON.parse special case), insert with a client-generated uuidv7 id (children-copy cascades need the id; matches the DB's uuidv7 default), strip system columns. The 12 per-table query/create files are gone. Handles all tables generically now, not just the five special-cased before.
- [x] moveTo: one `apiUpdate(dbTable, id, {[parentIdField]: newParentId})`; the 4 update mutation files are gone.
- [x] HistoryForms (ap/pop/tpop): composite-key `PATCH/DELETE /<x>_history?id=eq.X&year=eq.Y`, create via `apiInsert` (id = parent id, no uuid). Field saves snake-cased via camelToSnake.
- [x] verified against dev PostgREST: tpop copy (geom preserved, fresh created_at, new uuidv7), ap_history composite PATCH incl. changed_by trigger; 13 Playwright specs green.
- [x] all ~45 `Menu.tsx` "Neu" create buttons (Daten incl. werte lists): codemodded to `const newId = uuidv7()` + `apiInsert('<table>', { id: newId, <parent> })`; the Menus navigate to `newId`. Specials by hand: `Tpopfeldkontr(s)` (double create: tpopkontr + tpopkontrzaehl with two ids), `User/Menu` (empty create + EKF tpopkontr create), `Werte/Menu` (dynamic table name via `camelToSnake(table)`). Verified live: pop-create 201 with ap_id set, cleanup 204; 13 Playwright specs green. Note: the werte tables all have uuid id PKs (not integer codes) — no special casing needed.
- [x] the rest (30.10.2026): EkPlan (setEkplans became bulk DELETE + bulk INSERT; setStartjahr; CellFor* processChanges; CellForYearMenu), Tpopfreiwkontr/EKF forms (counts via apiUpdateByVariables, bulk zaehl-insert on new kontr), Beobzuordnung saves, Karte layers, coordinate copiers, createNewPop/TpopFromBeob (client uuids replace returned ids), Messages (usermessage inserts), Werte forms, insertDataset (all per-menuType create templates collapsed into one row object — the tree's generic "Neu"), Choose* copiers (bulk delete + bulk insert), Coordinates, Files delete/update, Qk apqk (composite key `?ap_id=eq.X&qk_name=eq.Y`), ApUsers, EkfBar user updates, User password via `rpc('set_password')`.
- [x] **enum gotcha found and fixed (ae3 knew it): PostgREST returns/accepts enum LABELS, graphql returned uppercased VALUES.** `ek_type` labels are `ek`/`ekf`, `ek_kontrolljahre_ab` are `ek`/`ansiedlung`. Writes now send lowercase; reads comparing enum values must expect lowercase when migrated to PostgREST (phase 4!). `tpopkontr.typ` is a plain varchar (werte texts) — unaffected. Verified: bulk ekplan insert 201 with labels, 400 with the old uppercase values.

## Phase 4 — Reads (191 static + nav data hooks)

Foundation laid (30.10.2026, second session):

- **`sql/postgrest/createComputedViews.sql`**: `v_<table>` views (24 + v_tpopkontr) exposing base table + the computed columns reads need (`label`, `label_ek`/`label_ekf` on tpopkontr, `lv95_x/lv95_y/wgs84_lat/wgs84_long` on pop/tpop/beob). `security_invoker = true` keeps RLS applied — verified: ap_reader/moser sees exactly 2860 of 21455 tpops through `v_tpopkontr`/`v_tpop`. Applied to the dev DB; apply to prod with the next deploy.
- **`src/modules/selects.ts`** (generated by `npm run selects:generate` from fragments.ts): per-table PostgREST select strings with camelCase aliases (`popId:pop_id`, `labelEk:label_ek`, `geomPoint:geom_point`). **All 55 validated live** against views/base tables. Includes app→db table aliases (tpopfeldkontr/tpopfreiwkontr→tpopkontr, currentIssue→currentissue).
- **pattern proven (Pop + Tpop forms migrated)**: since views expose no FKs, relations the forms read are **jsonb columns in the v\_ views** with camelCase keys matching the client types exactly (`ap_by_ap_id`, `pop_by_pop_id` incl. nested `apByApId`, `pop_status_werte_by_status`, `tpop_apberrelevant_grund_werte_by_apber_relevant_grund` on v_tpop). Form load = one `GET /v_<table>?id=eq.X&select=<x>Select,<relations>` returning the row in the old GraphQL shape. Verified in the browser: both forms render with live data, zero HTTP errors; query keys unchanged so invalidations keep working. When migrating a form, check whether its `query.ts` is still imported by prefetchers/other modules (Tpop's is — keep the file until those migrate).
- remembered from phase 3: enum comparisons expect lowercase labels (`ek`, `ansiedlung`) once reads come from PostgREST.
- `geomPoint` arrives as a GeoJSON object directly (no `.geojson` wrapper, no x/y) — client code accessing `row.geomPoint.geojson` or `.x/.y` must adapt (lv95X/wgs84Lat computed columns cover the x/y cases).

**createComputedViews.sql applied to PRODUCTION on 31.10.2026** (user-confirmed) — dev and prod are in sync; phase 5 RPCs can build on it directly.

Status (31.10.2026):

- [x] form main loads — ALL of them: Pop, Tpop, Popber, Popmassnber, Tpopmassn, Tpopmassnber, Apart, Assozart, Apber, Ekfrequenz, Ekzaehleinheit, Ap, Erfkrit, Ziel, Tpopber, Apberuebersicht, User, Idealbiotop (keyed by apId), Tpopfeldkontr + Tpopfreiwkontr (deep jsonb chain on v_tpopkontr: tpop→pop→ap→FDW taxonomy→zielrelevante Ekzaehleinheiten, zaehlungen collection, bearbeiter user count), Dateien ×3, Historien indexes ×3 (new v_ap_history/v_pop_history/v_tpop_history views), Print simple lookups.
- recipe per form: one `GET /v_<table>?id=eq.X&select=<x>Select,<relation aliases>` (+ parallel `value:/label:`-aliased option lists in the same queryFn, returning the old result shape so components don't change). Watch for: each form's id variable name differs (`apberId`, `userId`…); untyped `Promise.all` fetches degrade to `{}` — annotate from the form's result interface; `exactOptionalPropertyTypes` bites when passing whole result objects into components with narrower optional-prop interfaces.
- v_ap now also carries ap_bearbstand_werte_by_bearbeitung, ap_umsetzung_werte_by_umsetzung, adresse_by_bearbeiter, projekt_by_proj_id, ae_taxonomy_by_art_id (full fields, FDW); v_tpop also ekfrequenz_by_ekfrequenz, adresse_by_ekf_kontrolleur.
- intentionally deferred to phase 5 RPCs (parameterized by jahr / tree-shaped, awkward as jsonb): the print deep trees (`Print/ApberForYear/query.ts` ap_history→pop_history→tpop_history→massnahmen/kontrollen chains, `jberQuery.ts`), `ApberForApFromAp`'s `apByIdJahr`, Beobzuordnung and Qk query trees.
- remaining phase-4 stragglers (small, or also fold into phase 5): ApAuswertung (5 files), Ekf/EkPlan read queries (~7), `SelectLoadingOptions`/`SelectLoadingOptionsTypable` autocomplete, modules (`getNearestTpop`, `getAndValidateCoordinatesOfBeob/Tpop`, `prefetchNodeData`/`prefetchRouteData`, `copyTpopsOfPop`, `copyZaehlOfTpopKontr`), Beob form, CurrentIssue/Messages reads.

## Phase 5 opening move (when continuing)

Build the `query_<table>(p_filter jsonb)` RPC family from the spike (`sql/postgrest/compileFilter.sql`) — returning rows from the v_ views so labels/coordinates come along. That unlocks: the 44 `use*NavData` tree hooks (filter-cascade atoms serialize their filter jsonb straight into the RPC body), the ~40 Exporte, the Karte layers, the filter components — plus the deferred print/Beob/Qk trees as fixed-shape parameterized RPCs. Remember: enum labels are lowercase through PostgREST; compile_filter resolves relations from the base tables' FKs (works because the RPC controls its own SQL even when selecting from views).

## Phase 5 — Filter cascade + PostGIS

Opened (31.10.2026):

- [x] **`sql/postgrest/createQueryRpcs.sql`** (generated by `scripts/generate-query-rpcs.py`): slim `q_<table>` views (base + label + lv95/wgs84 for pop/tpop/beob — deliberately without the v_ views' heavy jsonb chains) + `query_<table>(p_filter, p_order, p_limit, p_offset)` RPCs for 24 tables. Key detail: the RPC joins the base table (alias `tb`) for filter compilation and label functions — view rowtypes don't cast to base rowtypes — while selecting from the view. **After applying: `NOTIFY pgrst, 'reload schema';`** (PostgREST caches the schema).
- [x] 15 nav hooks migrated (31.10.2026, second batch): useApsNavData, useTpopsNavData, usePopsNavData + the 12 mid-tree lists (tpopmassn, tpopkontr as feldkontr/freiwkontr with `label:label_ek`/`label_ekf` aliases, tpopber, popber, tpopmassnber, popmassnber, erfkrit, apart, assozart, ekzaehleinheit, ekfrequenz with `label:code`, apber). All 12 RPC shapes verified with their exact parent-contract requests (counts cross-checked against SQL). `resolve_forward_relation` now also accepts unique-key FKs (erfkrit.erfolg → ap_erfkrit_werte.code) for the werte-sort ordering; `q_tpopmassn` carries the zieleinheit-werte jsonb the tree label appends.
- [x] first two nav hooks migrated (useApsNavData, useTpopsNavData): the cascade filter jsonb goes straight into the RPC body; the former `XByYId` relation constraint merges client-side (`{...filter, popByPopId: {...existing, id: {equalTo: popId}}}` — compile_filter ANDs siblings); unfiltered totals via `apiCount('/q_<table>...')`; query keys unchanged (invalidations + prefetch cache keep working — verified: prefetch served the tpop folder with zero extra network). Verified live: `Arten (92/600)` through query_ap (label order), active-ap fallback via GET /q_ap, `Teil-Populationen (3/3)`; RLS through query_tpop = exactly 2860 for the restricted user; spike suite (T0–T7) green on the new RPCs.

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

One pre-existing gap surfaced honestly: ekfrequenz has no label function (its fragment never had one), so v_ekfrequenz simply doesn't expose a label — no invented behavior

---
