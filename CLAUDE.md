# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**apflora.ch** — a German-language web app for managing *Aktionspläne Flora* (flora action plans) for the Fachstelle Naturschutz of the Canton of Zürich. The UI, route segments, and domain terms are German (e.g. *Projekte, Arten, Populationen, Teil-Populationen, Beobachtungen, Erfolgskontrollen*). Preserve German terms when editing UI/paths.

It is a client-side SPA (Vite + React 19, **no SSR** — see [src/react-router.config.ts](src/react-router.config.ts)) talking to a **PostGraphile** GraphQL API over **PostgreSQL + PostGIS**. Frontend deploys to Vercel; the production API lives at `api.apflora.ch`. It is also packaged as an Electron app and a PWA (`vite-plugin-pwa`).

## Commands

Frontend (run from repo root):

```bash
npm run dev          # vite dev server on :5173 (talks to backend at localhost:5000 — see below)
npm run build        # vite build -> dist/
npm run preview      # serve the production build
npx eslint .         # lint (flat config in eslint.config.mjs; no npm script defined)
npm test             # cross-env NODE_ENV=dev playwright test
npm run test:ui      # playwright UI mode (recommended for debugging)
npm run test:headed  # run tests in a visible browser
npm run test-report  # open the last html report

# single test file / pattern:
npx playwright test tests/forms/population.spec.ts
npx playwright test population
npx playwright test --project=chromium   # or firefox
```

Playwright tests require a running dev server and a credentials file at `playwright/.auth/user.json` (copy from `playwright/.auth/user.json.example`). The config auto-starts `npm run dev` on :5173 and reuses an existing server. WebKit is disabled by default (needs `playwright install-deps webkit`). See [QUICKSTART.md](QUICKSTART.md) and [MIGRATION.md](MIGRATION.md).

> There is **no unit-test runner in active use** — `vitest`/`jsdom` are installed but the suite is Playwright E2E only.

Local backend stack (Postgres + PostGraphile + Caddy) lives in [backend/](backend/):

```bash
cd backend
# backend/.env must define: POSTGRES_USER, POSTGRES_PASSWORD, AUTHENTICATOR_PASSWORD,
# JWT_SECRET, DATABASE_URL (it already exists in this checkout)
docker compose up      # db on :5432, graphql (PostGraphile) on :5000
```

The dev frontend (`graphQlUri()`) points at `http://localhost:5000/graphql`, so **`npm run dev` is only useful with the backend stack running**. ([backend-dev/](backend-dev/) is a parallel copy of the stack.)

## Architecture

### Frontend state is the heart of the app

[src/store/index.ts](src/store/index.ts) is a large Jotai store and the central nervous system. Almost everything routes through atoms here:

- **Navigation as data**: the current location is `treeActiveNodeArrayAtom` — an array of path/label segments like `['Projekte', <projId>, 'Arten', <apId>, 'Populationen', <popId>, ...]`. Derived atoms (`treeApIdInActiveNodeArrayAtom`, `treePopIdInActiveNodeArrayAtom`, …) extract UUIDs by index, and `treeSetActiveNodeArrayAtom` keeps `treeOpenNodesAtom` in sync. URL ↔ tree sync happens in [src/components/Router/ActiveNodeArraySetter.tsx](src/components/Router/ActiveNodeArraySetter.tsx) and [src/modules/navigateToLastActiveNodeArray.ts](src/modules/navigateToLastActiveNodeArray.ts).
- **Filter cascade**: `tree*GqlFilterAtom` atoms build PostGraphile connection-filter objects from three sources — hierarchy (parent filters, e.g. population filter restricts the tpop query via `popByPopId`), the user's form data filter (`treeDataFilterAtom`, multi-"OR" tabs in [src/store/DataFilter/](src/store/DataFilter/)), and label/map filters. Parent filters compose into both an `all` variant (unfiltered children) and a `filtered` variant. When touching filter logic, read the whole `store/index.ts` filter section — the `...ForTree` variants and `all`/`filtered` split are easy to get wrong.
- **Persistence**: many UI-preference atoms use `atomWithStorage` (localStorage). `unsubscribedStorage` disables cross-tab sync for atoms that must not propagate.

Other global state: TanStack Query (`QueryClient` with `refetchOnWindowFocus:false`, set in [src/App.tsx](src/App.tsx)), and `apolloClientAtom`/`tsQueryClientAtom` exposing the clients to non-React code via `store.get(...)`.

### Apollo Client — read [src/apolloClient.ts](src/apolloClient.ts) before changing GraphQL behavior

- `fetchPolicy: 'no-cache'` for queries/watchQueries — the app re-fetches rather than reading cache.
- **Auth**: a JWT from `userTokenAtom` is sent as `Authorization: Bearer …`. PostGraphile reads it as `jwt.claims.*`; Postgres RLS policies then key off `CURRENT_USER`/the role. See [sql/auth/](sql/auth/) for the `auth.jwt_token` type and login function.
- **Permission errors are swallowed on purpose** — the `User` component (login dialog) opens instead of logging out, to avoid a reload loop. Don't "fix" this by logging out in the error link.
- **`dataIdFromObject` gotcha**: history types are keyed `${id}/${year}`; a long allowlist of `VQ…`/view `__typename`s is forced to `defaultDataIdFromObject` because those rows reuse real ids and would otherwise overwrite cached models. If you add a new computed/view type that mirrors a base table, add its `__typename` to that allowlist or you'll get cache-clobbering bugs.
- Requests are batched (`BatchHttpLink`).

### Routing

[src/components/Router/index.tsx](src/components/Router/index.tsx) defines a deeply nested `react-router` v8 tree that mirrors the data hierarchy under `/Daten`. Top-level areas: `/Daten/Projekte/…` (the main tree/forms), `/Daten/Benutzer/…` (users + EKF), `/Daten/Daten…/Werte-Listen` (value lists), `/Daten/Mitteilungen`, `/Daten/Aktuelle-Fehler`, `/Dokumentation/…` (docs). Nearly every route is `lazy()`-loaded; each collection route pairs a `handle` (a `bookmarkFetcher` hook + a nav `Menu`) with a detail route. A protected wrapper ([ProtectedRoute.tsx](src/components/Router/ProtectedRoute.tsx)) gates `/Daten`. Every route has an `errorElement={<RouterErrorBoundary/>}`.

The "second tree" (`tree2`) is the same app embedded in an iframe (see `tree2SrcAtom`, [src/modules/openTree2WithActiveNodeArray.ts](src/modules/openTree2WithActiveNodeArray.ts)) to show two tree panes side by side.

### Feature modules

- [src/components/Projekte/](src/components/Projekte/) — the main workspace: `Daten` (tree + forms), `Karte` (Leaflet map, Swiss LV95/WGS84 via proj4), `Filter`, `Exporte`, `TreeContainer`.
- [src/components/Ekf/](src/components/Ekf/) — "Erfolgs-Kontrollen Freiwillige" volunteer mode.
- [src/components/EkPlan/](src/components/EkPlan/) — success-control planning.
- [src/components/Print/](src/components/Print/) — printable reports (serverless; print state via `isPrintAtom`).
- [src/modules/](src/modules/) — hooks (`use*NavData.ts` fetch nav data per node type) and pure helpers (coordinate conversions, exports CSV/KML/XLSX, GraphQL filter builders, `historize`).
- [src/models/](src/models/) — per-table TS types, grouped by DB schema (`apflora`, `auth`, `public`, `request`).
- [sql/](sql/) — the DB: [sql/apflora/createTables.sql](sql/apflora/createTables.sql), views/triggers/functions, [sql/migration/](sql/migration/) (numbered one-offs), [sql/auth/](sql/auth/) (JWT + login). PostGraphile exposes the `apflora` schema; views (`v_…`/`VQ…`) become queryable types.

### Auth flow

Login is a GraphQL mutation in [src/components/User.tsx](src/components/User.tsx); the returned JWT is stored in `userAtom` (`{ name, token, id }`). `apolloClient.ts`'s `authLink` injects and validates the token's `exp` on every request. Logout ([src/modules/logout.ts](src/modules/logout.ts)) reloads the window.

## Conventions

- **Always include file extensions in imports** (`.ts`/`.tsx`) — enforced by `eslint-plugin-import` (`import/extensions`) and used everywhere. MUI/Emotion is a dependency only because `@mui/material` needs it.
- **React Compiler is on** (`babel-plugin-react-compiler` via `@rolldown/plugin-babel` in [vite.config.ts](vite.config.ts)); write compiler-friendly components (stable refs, no manual memoization hacks).
- **CSS Modules** use `localsConvention: 'camelCaseOnly'` — import as `styles.someClass`.
- **Vite chunking**: `manualChunks` splits `mui`, `react-vendor`, `apollo`, `tanstack`. `cssMinify: 'esbuild'` is a workaround for a Vite 8 bug — don't remove it or `esbuild` without a reason.
- **German UI**: keep labels, notifications, and route path segments in German unless explicitly asked to translate.
- App version is bumped in [package.json](package.json) (`version` + `versionDate`) and shown in the document title.
