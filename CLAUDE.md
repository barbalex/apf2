# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**apflora.ch** — a German-language web app for managing *Aktionspläne Flora* (flora action plans) for the Fachstelle Naturschutz of the Canton of Zürich. The UI, route segments, and domain terms are German (e.g. *Projekte, Arten, Populationen, Teil-Populationen, Beobachtungen, Erfolgskontrollen*). Preserve German terms when editing UI/paths.

It is a client-side SPA (Vite + React 19, **no SSR** — see [src/react-router.config.ts](src/react-router.config.ts)) talking to a **PostgREST** API over **PostgreSQL + PostGIS**. Frontend deploys to Vercel; the production API lives at `api.apflora.ch`. It is also packaged as an Electron app and a PWA (`vite-plugin-pwa`).

## Commands

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
npm run deploy       # deploy production: bump patch version + date, push master, update apflora branch (Vercel deploys apflora)
npm run deploy minor # same with a minor bump (or: major)

# single test file / pattern:
npx playwright test tests/forms/population.spec.ts
npx playwright test population
npx playwright test --project=chromium   # or firefox
```

Playwright tests require a running dev server and a credentials file at `playwright/.auth/user.json` (copy from `playwright/.auth/user.json.example`). The config auto-starts `npm run dev` on :5173 and reuses an existing server. WebKit is disabled by default (needs `playwright install-deps webkit`). See [QUICKSTART.md](QUICKSTART.md) and [MIGRATION.md](MIGRATION.md).

> Unit tests (`npm run test:unit`, vitest) cover the pure logic: the `tree*GqlFilterAtom` filter cascade in [src/store/gqlFilter.test.ts](src/store/gqlFilter.test.ts) (the jsonb contract with `apflora.compile_filter`) and helpers in `src/modules/`. They run in a node environment — `localStorage` (which the store reads at module scope) is stubbed in [src/testing/localStorageStub.ts](src/testing/localStorageStub.ts), registered as a vitest setup file in `vitest.config.unit.ts`. Test files live next to the code under test (`src/**/*.test.ts`) so they are typechecked and linted like everything else.

Local backend stack (Postgres + PostgREST + Caddy) lives in [backend/](backend/) — see [PRODUCTION.md](PRODUCTION.md) for the production VM, its docker stack and how to apply DB migrations there (`scripts/apply-production-sql.sh`):

```bash
cd backend
# backend/.env must define: POSTGRES_USER, POSTGRES_PASSWORD, AUTHENTICATOR_PASSWORD,
# JWT_SECRET, DATABASE_URL (it already exists in this checkout)
docker compose up      # db on :5432, postgrest on :3000
```

The dev frontend (`postgrestUri()` in [src/modules/api.ts](src/modules/api.ts)) points at `http://localhost:3000`, so **`npm run dev` is only useful with the backend stack running**. ([backend-dev/](backend-dev/) is a parallel copy of the stack; after recreating its db volume run `npm run db:apply-sql`.)

## Architecture

### Frontend state is the heart of the app

The store lives in [src/store/](src/store/) as per-domain modules re-exported through the [src/store/index.ts](src/store/index.ts) barrel — import from `'../store/index.ts'` as before. Almost everything routes through atoms here:

- `store.ts` — the `store` singleton and the storage helpers (`createUnsubscribedStorage`, `atomWithToggleAndStorage`). `createUnsubscribedStorage` must be used for storage atoms whose getters must not widen to `T | Promise<T>`.
- `tree.ts` — navigation as data + node label filter + tree2. The current location is `treeActiveNodeArrayAtom` — an array of path/label segments like `['Projekte', <projId>, 'Arten', <apId>, 'Populationen', <popId>, ...]`. Derived atoms (`treeApIdInActiveNodeArrayAtom`, `treePopIdInActiveNodeArrayAtom`, …) extract UUIDs by index, and `treeSetActiveNodeArrayAtom` keeps `treeOpenNodesAtom` in sync. URL ↔ tree sync happens in [src/components/Router/ActiveNodeArraySetter.tsx](src/components/Router/ActiveNodeArraySetter.tsx) and [src/modules/navigateToLastActiveNodeArray.ts](src/modules/navigateToLastActiveNodeArray.ts).
- `filters.ts` — the filter cascade. `tree*GqlFilterAtom` atoms build jsonb filter objects (compiled server-side by `apflora.compile_filter` inside the `query_*` RPCs) from three sources — hierarchy (parent filters, e.g. population filter restricts the tpop query), the user's form data filter (`treeDataFilterAtom`, multi-"OR" tabs in [src/store/DataFilter/](src/store/DataFilter/)), and label/map filters. Parent filters compose into both an `all` variant (unfiltered children) and a `filtered` variant. **Intended**: the `all` variant (the "X von Y" totals in the Filter panels) is scoped by the parent's *form* filter — a consequence of es-toolkit's mutating `merge` that is pinned in [src/store/gqlFilter.test.ts](src/store/gqlFilter.test.ts). When touching filter logic, read the whole `filters.ts` filter section — the `...ForTree` variants and `all`/`filtered` split are easy to get wrong.
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

The "second tree" (`tree2`) is the same app embedded in an iframe (see `tree2SrcAtom`, [src/modules/openTree2WithActiveNodeArray.ts](src/modules/openTree2WithActiveNodeArray.ts)) to show two tree panes side by side.

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
- **Error telemetry is opt-in**: [src/modules/errorTelemetry.ts](src/modules/errorTelemetry.ts) posts client errors (global handlers + error boundaries) to `VITE_ERROR_TELEMETRY_URL` — a self-hosted collector (Sentry/GlitchTip/own RPC). Without the env var it is a complete no-op; the payload carries message/stack/url/user-agent/release only (no user identity). Stacks symbolicate against the deployed sourcemaps.
- App version: `npm run deploy [patch|minor|major]` bumps `version` + `versionDate` in [package.json](package.json) automatically (default: patch) — don't bump manually. Deploys go through the `apflora` branch: the script merges master into apflora and pushes, which triggers the Vercel production deploy. The version is shown in the hamburger menu. `npm run build` also emits `version.json` (never cached — excluded from the sw precache in [vite.config.ts](vite.config.ts), `no-cache` header in [vercel.json](vercel.json)); `src/components/VersionCheck/` compares it against the running bundle and offers a cache-clearing reload so stale PWA clients surface instead of failing silently.
