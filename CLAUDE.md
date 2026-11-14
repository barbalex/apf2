# CLAUDE.md

This file provides guidance to AI coding agents (Claude Code, ZCode, …) working with code in this repository. `AGENTS.md` is a symlink to this file — edit this one.

## What this is

**apflora.ch** — a German-language web app for managing _Aktionspläne Flora_ (flora action plans) for the Fachstelle Naturschutz of the Canton of Zürich. The UI, route segments, and domain terms are German (e.g. _Projekte, Arten, Populationen, Teil-Populationen, Beobachtungen, Erfolgskontrollen_). Preserve German terms when editing UI/paths.

It is a client-side SPA (Vite + React 19, **no SSR** — see [src/react-router.config.ts](src/react-router.config.ts)) talking to a **PostgREST** API over **PostgreSQL + PostGIS**. Frontend deploys to Vercel; the production API lives at `api.apflora.ch`. It is also packaged as an Electron app and a PWA (`vite-plugin-pwa`).

## Commands

Node 22 ([.nvmrc](.nvmrc)) — what CI runs; the dev machine's 24 also works.

Frontend (run from repo root):

```bash
npm run dev          # vite dev server on :5173 (talks to PostgREST at localhost:3000 — see below)
npm run build        # vite build -> dist/
npm run preview      # serve the production build
npm run typecheck    # tsc --noEmit (CI hard-fails on any error — the baseline mechanism was removed once the count reached zero)
npm run lint         # eslint src (flat config in eslint.config.mjs)
npm test             # cross-env NODE_ENV=dev playwright test
npm run test:ui      # playwright UI mode (recommended for debugging)
npm run test:headed  # run tests in a visible browser
npm run test-report  # open the last html report
npm run test:unit    # vitest unit tests for pure logic (filter cascade, modules helpers)
npm run test:api     # vitest api tests: role/permission matrix against the local backend (see "Testing user roles")
npm run check        # typecheck + lint + unit tests — the CI subset; run before declaring work done
npm run deploy       # deploy production: bump patch version + date, push master, update apflora branch (Vercel deploys apflora)
npm run deploy minor # same with a minor bump (or: major)

# single test file / pattern:
npx playwright test tests/forms/population.spec.ts
npx playwright test population
npx playwright test --project=chromium   # or firefox
```

> ⚠️ `npm run deploy` ships production immediately (no prompt), and `scripts/apply-production-sql.sh` writes the production database. Never run either unless the user explicitly asks.

Playwright tests require a running dev server and a credentials file at `playwright/.auth/user.json` (copy from `playwright/.auth/user.json.example`; the name/password must be a user of the local dev db). The config auto-starts `npm run dev` on :5173 and reuses an existing server. WebKit is disabled by default (needs `playwright install-deps webkit`). The storage state expires with the login token after 24 h — when tests suddenly meet the Anmeldung dialog, run `node scripts/refresh-auth-state.mjs` (needs the local backend). E2E does not run in CI: the Playwright workflow is disabled on purpose (it would need the backend stack and real credentials); CI runs lint, typecheck, unit tests and selects freshness only. See [QUICKSTART.md](QUICKSTART.md) and [MIGRATION.md](MIGRATION.md).

> Unit tests (`npm run test:unit`, vitest) cover the pure logic: the `tree*GqlFilterAtom` filter cascade in [src/store/gqlFilter.test.ts](src/store/gqlFilter.test.ts) (the jsonb contract with `apflora.compile_filter`) and helpers in `src/modules/`. They run in a node environment — `localStorage` (which the store reads at module scope) is stubbed in [src/testing/localStorageStub.ts](src/testing/localStorageStub.ts), registered as a vitest setup file in `vitest.config.unit.ts`. Test files live next to the code under test (`src/**/*.test.ts`) so they are typechecked and linted like everything else.

### Testing user roles

`npm run test:api` (vitest, [api-tests/](api-tests/)) answers role/permission questions. It talks to the local PostgREST directly and mints per-role JWTs with the dev secret ([api-tests/helpers.ts](api-tests/helpers.ts): `mintToken`, `getTestUser`), so no per-role passwords are needed. The five app roles: `apflora_reader`, `apflora_ap_reader`, `apflora_ap_writer`, `apflora_freiwillig`, `apflora_manager`.

- [api-tests/rls-matrix.test.ts](api-tests/rls-matrix.test.ts) — the role × table × action matrix on the writable hierarchy tables
- [api-tests/rls.test.ts](api-tests/rls.test.ts), [api-tests/grants.test.ts](api-tests/grants.test.ts), [api-tests/freiwillig.test.ts](api-tests/freiwillig.test.ts) — ap-scoping in depth, grant checks, volunteers restricted to their own rows

When changing RLS policies or grants, extend these — Playwright e2e runs as a single user and cannot see role differences.

Local backend stack (Postgres + PostgREST) for dev and tests is **[backend-dev/](backend-dev/)** — the only stack that publishes PostgREST on `localhost:3000`, which the dev frontend (`postgrestUri()` in [src/modules/api.ts](src/modules/api.ts)) and the api tests talk to. **`npm run dev` is only useful with it running:**

```bash
docker compose -f backend-dev/docker-compose.yml up -d
# backend-dev/.env must define: POSTGRES_USER, POSTGRES_PASSWORD,
# AUTHENTICATOR_PASSWORD, JWT_SECRET, DATABASE_URL (it already exists in this checkout)
# db on :5432, postgrest on :3000 — after recreating the db volume run npm run db:apply-sql
```

`npm run fetchBackup` seeds `backend-dev/db/apflora.backup` (gitignored) with a fresh production backup — it runs the production backup first (its fingerprint skip makes this cheap), so a `down -v && up -d --build` afterwards initializes the dev db from current production data (deletes local dev data; then `npm run db:apply-sql`). The production backup machinery (fingerprint skip, restore test, host cron wrapper) lives in [backend/db/](backend/db/) — see the Backups section of [PRODUCTION.md](PRODUCTION.md).

[backend/](backend/) mirrors the production VM stack (PostgREST behind Caddy, :3000 not published to the host) — see [PRODUCTION.md](PRODUCTION.md) for the VM and for applying DB migrations there (`scripts/apply-production-sql.sh`).

## Architecture

### Frontend state is the heart of the app

The store lives in [src/store/](src/store/) as per-domain modules re-exported through the [src/store/index.ts](src/store/index.ts) barrel — import from `'../store/index.ts'` as before. Almost everything routes through atoms here:

- `store.ts` — the `store` singleton and the storage helpers (`createUnsubscribedStorage`, `atomWithToggleAndStorage`). `createUnsubscribedStorage` must be used for storage atoms whose getters must not widen to `T | Promise<T>`.
- `tree.ts` — navigation as data + node label filter + tree2. The current location is `treeActiveNodeArrayAtom` — an array of path/label segments like `['Projekte', <projId>, 'Arten', <apId>, 'Populationen', <popId>, ...]`. Derived atoms (`treeApIdInActiveNodeArrayAtom`, `treePopIdInActiveNodeArrayAtom`, …) extract UUIDs by index, and `treeSetActiveNodeArrayAtom` keeps `treeOpenNodesAtom` in sync. URL ↔ tree sync happens in [src/components/Router/ActiveNodeArraySetter.tsx](src/components/Router/ActiveNodeArraySetter.tsx) and [src/modules/navigateToLastActiveNodeArray.ts](src/modules/navigateToLastActiveNodeArray.ts).
- `filters.ts` — the filter cascade. `tree*GqlFilterAtom` atoms build jsonb filter objects (compiled server-side by `apflora.compile_filter` inside the `query_*` RPCs) from three sources — hierarchy (parent filters, e.g. population filter restricts the tpop query), the user's form data filter (`treeDataFilterAtom`, multi-"OR" tabs in [src/store/DataFilter/](src/store/DataFilter/)), and label/map filters. Parent filters compose into both an `all` variant (unfiltered children) and a `filtered` variant. **Intended**: the `all` variant (the "X von Y" totals in the Filter panels) is scoped by the parent's _form_ filter — a consequence of es-toolkit's mutating `merge` that is pinned in [src/store/gqlFilter.test.ts](src/store/gqlFilter.test.ts). When touching filter logic, read the whole `filters.ts` filter section — the `...ForTree` variants and `all`/`filtered` split are easy to get wrong.
- `map.ts`, `viewMode.ts`, `ui.ts`, `notifications.ts`, `user.ts`, `clipboard.ts`, `deletions.ts`, `ekplan.ts`, `exports.ts` — the remaining domains.
- **Persistence**: many UI-preference atoms use `atomWithStorage` (localStorage). `createUnsubscribedStorage` disables cross-tab sync for atoms that must not propagate.

Other global state: TanStack Query (`QueryClient` with `refetchOnWindowFocus:false`, set in [src/App.tsx](src/App.tsx)), exposed to non-React code via `tsQueryClientAtom`/`store.get(...)`.

### PostgREST — read [src/modules/api.ts](src/modules/api.ts) before changing data fetching

- All data flows through `apiFetch`/`apiInsert`/`apiUpdate`/`apiDelete`/`rpc` in [src/modules/api.ts](src/modules/api.ts), orchestrated by TanStack Query. Column select strings live in [src/modules/selects.ts](src/modules/selects.ts) (`npm run selects:generate` — derived from the field manifest in [src/components/shared/fragments.ts](src/components/shared/fragments.ts); regeneration is byte-identical. Dropdown `{ value, label }` key aliases are declared in the generator's `aliasTweaks`, not in the manifest).
- Tree/filter queries go through the `query_<table>` RPC family (generated by [scripts/generate-query-rpcs.py](scripts/generate-query-rpcs.py) from [sql/postgrest/createQueryRpcs.sql](sql/postgrest/createQueryRpcs.sql)); filters compile server-side via `apflora.compile_filter` ([sql/postgrest/compileFilter.sql](sql/postgrest/compileFilter.sql)). After changing SQL: `npm run db:apply-sql` applies it to the local dev db.
- **Auth**: a JWT from `userTokenAtom` is sent as `Authorization: Bearer …`. PostgREST reads it as `request.jwt.claims`; Postgres RLS policies then key off `CURRENT_USER`/the role (username via `apflora.current_user_name()`). See [sql/auth/](sql/auth/) and [sql/migration/0063-postgrest-login.sql](sql/migration/0063-postgrest-login.sql). An expired/malformed token or a 401 answer logs the session out (`logoutDeadSession`).
- **Permission errors must not log the user out** in the `Error` component path — the login dialog opens instead, to avoid a reload loop. Don't "fix" this by logging out.

### Routing

[src/components/Router/index.tsx](src/components/Router/index.tsx) defines a deeply nested `react-router` v8 tree that mirrors the data hierarchy under `/Daten`. Top-level areas: `/Daten/Projekte/…` (the main tree/forms), `/Daten/Benutzer/…` (users + EKF), `/Daten/Daten…/Werte-Listen` (value lists), `/Daten/Mitteilungen`, `/Daten/Aktuelle-Fehler`, `/Dokumentation/…` (docs). Nearly every route is `lazy()`-loaded; each collection route pairs a `handle` (a `bookmarkFetcher` hook + a nav `Menu`) with a detail route. A protected wrapper ([ProtectedRoute.tsx](src/components/Router/ProtectedRoute.tsx)) gates `/Daten`. Every route has an `errorElement={<RouterErrorBoundary/>}`.

The "second tree" (`tree2`) is an in-app pane: the app's `/Daten` route tree rendered against its own React root, jotai store ([src/store/tree2.ts](src/store/tree2.ts)) and memory router ([src/components/Projekte/Tree2](src/components/Projekte/Tree2/index.tsx)) — the successor of the former whole-app iframe. Imperative helpers that touch navigation/tree state take an explicit `store` parameter (call sites pass `useStore()`), so pane-2 interactions drive pane-2 state; shared atoms (user, query client, notifications) are mirrored/bridged from the root store.

### Feature modules

- [src/components/Projekte/](src/components/Projekte/) — the main workspace: `Daten` (tree + forms), `Karte` (Leaflet map, Swiss LV95/WGS84 via proj4), `Filter`, `Exporte`, `TreeContainer`.
- [src/components/Ekf/](src/components/Ekf/) — "Erfolgs-Kontrollen Freiwillige" volunteer mode.
- [src/components/EkPlan/](src/components/EkPlan/) — success-control planning.
- [src/components/Print/](src/components/Print/) — printable reports (serverless; print state via `isPrintAtom`).
- [src/modules/](src/modules/) — hooks (`use*NavData.ts` fetch nav data per node type) and pure helpers (coordinate conversions, exports CSV/KML/XLSX, gql-shaped jsonb filter builders consumed by the `query_*` RPCs, `historize`).
- [src/models/](src/models/) — per-table TS types, grouped by DB schema (`apflora`, `auth`, `public`, `request`).
- [sql/](sql/) — the DB: [sql/apflora/createTables.sql](sql/apflora/createTables.sql), views/triggers/functions, [sql/migration/](sql/migration/) (numbered one-offs), [sql/auth/](sql/auth/) (JWT + login). PostgREST exposes the `apflora` schema; views (`v_…`/`VQ…`) become queryable tables/functions.

### Auth flow

Login calls the `login` rpc in [src/components/User.tsx](src/components/User.tsx) (signs the JWT in the database); the returned JWT is stored in `userAtom` (`{ name, token, id }`). `api.ts`'s `authHeaders` injects and validates the token's `exp` on every request. Logout ([src/modules/logout.ts](src/modules/logout.ts)) reloads the window.

Uploadcare uploads are signed server-side: the `Uploader` component ([src/components/shared/Uploader/index.tsx](src/components/shared/Uploader/index.tsx)) resolves signatures via the `upload_signature` rpc, backed by `apflora.upload_signature()` — EXECUTE is granted only to the roles that may create file records (`apflora_freiwillig`, `apflora_ap_writer`, `apflora_manager`), not to readers or anon. The secret lives in the `app.uploadcare_secret` database setting — never compute signatures in the client.

## Conventions

- **Always include file extensions in imports** (`.ts`/`.tsx`) — enforced by `eslint-plugin-import` (`import/extensions`) and used everywhere. MUI/Emotion is a dependency only because `@mui/material` needs it.
- **Prettier config lives in the repo** ([.prettierrc.json](.prettierrc.json), previously only in VS Code user settings): single quotes, no semicolons, `experimentalTernaries`, `singleAttributePerLine`. Generated dir `src/models/` is ignored via [.prettierignore](.prettierignore).
- **React Compiler is on** (`babel-plugin-react-compiler` via `@rolldown/plugin-babel` in [vite.config.ts](vite.config.ts)); write compiler-friendly components (stable refs, no manual memoization hacks).
- **CSS Modules** use `localsConvention: 'camelCaseOnly'` — import as `styles.someClass`.
- **Vite chunking**: `manualChunks` splits `mui`, `react-vendor`, `tanstack`. `cssMinify: 'esbuild'` is a workaround for a Vite 8 bug — don't remove it or `esbuild` without a reason.
- **`overrides` pins `next` to a patched release**: `next` enters the lockfile as an (unused) peer dependency of `@uploadcare/react-uploader`/`@vercel/analytics` but is never imported or bundled. Unpinned it kept a vulnerable version in the lockfile, which lit up ~44 Dependabot alerts (incl. critical Next.js RCEs that can't apply — this is not a Next.js app). Keep the pin at or above the patched range; remove it entirely once the uploaders drop the peer dep.
- **German UI**: keep labels, notifications, and route path segments in German unless explicitly asked to translate.
- **Error telemetry is active**: [src/modules/errorTelemetry.ts](src/modules/errorTelemetry.ts) posts client errors (global handlers + error boundaries) to the `apflora.error_report` PostgREST table on the production api (endpoint from [.env.production](.env.production); dev builds without the env var stay no-op). Payload: message/stack/url/user-agent/release only — no user identity, capped and deduped client-side, CHECK-capped and `created_at`-stamped server-side. Anyone may append, only `apflora_manager` may read — view reports in pgAdmin or via the api.
- Working files: [tasks.md](tasks.md) is the user's running scratch/task list; [issues/](issues/) holds per-issue write-ups; [messages/](messages/) holds the user-facing German release notes per released version (`<major>-<minor>-<patch>.txt`).
- App version: `npm run deploy [patch|minor|major]` bumps `version` + `versionDate` in [package.json](package.json) automatically (default: patch) — don't bump manually. Deploys go through the `apflora` branch: the script merges master into apflora and pushes, which triggers the Vercel production deploy. The version is shown in the hamburger menu. `npm run build` also emits `version.json` (never cached — excluded from the sw precache in [vite.config.ts](vite.config.ts), `no-cache` header in [vercel.json](vercel.json)); `src/components/VersionCheck/` compares it against the running bundle and offers a cache-clearing reload so stale PWA clients surface instead of failing silently.
