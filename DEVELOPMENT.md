# Development machines — setup and staying up to date

How to get `npm run dev` working on a machine (e.g. the notebook) and keep it
working after pulling. Everything here complements [AGENTS.md](AGENTS.md)
(architecture, commands) and [QUICKSTART.md](QUICKSTART.md) (Playwright tests).

## One-time setup on a new machine

1. **Node 22** ([.nvmrc](.nvmrc)) — `nvm use`; Node 24 also works.
2. **`npm install`** — also runs `postinstall` ([scripts/patch-leaflet2.mjs](scripts/patch-leaflet2.mjs)).
3. **Playwright browsers** — `npx playwright install` (WebKit additionally
   needs `npx playwright install-deps webkit`).
4. **Copy the machine-local files** — all gitignored, so they don't travel
   with the repo; copy them from the other machine:
   - `backend-dev/.env` — db/JWT secrets the docker stack needs
     (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `AUTHENTICATOR_PASSWORD`,
     `JWT_SECRET`, `DATABASE_URL`; consumed by
     [backend-dev/docker-compose.yml](backend-dev/docker-compose.yml))
   - root `.env` — provides `VITE_UPLOADCARE_PUBLIC_KEY` (uploads in dev)
   - `playwright/.auth/user.json` — copy from
     `playwright/.auth/user.json.example`, fill in a user of the local dev db
5. **Seed backup** — `npm run fetchBackup` downloads a fresh production
   backup into `backend-dev/db/apflora.backup`. The docker build fails
   without this file (the Dockerfile copies it). Needs ssh key access to
   the production VM (`root@139.162.172.88`, see [PRODUCTION.md](PRODUCTION.md)).
6. **Start the backend stack** — see below. The first `up -d --build`
   restores the backup into a fresh volume (takes a few minutes; the
   healthcheck's `start_period` allows for it), then `npm run db:apply-sql`
   applies the SQL the backup predates.

## After each pull

1. `npm install` (dependency or `postinstall` changes).
2. If `@playwright/test` was bumped: `npx playwright install`.
3. Start/rebuild the backend stack:

   ```bash
   docker compose -f backend-dev/docker-compose.yml up -d --build
   ```

   `--build` picks up changes to the Dockerfile, init scripts or compose
   file; with an unchanged context the rebuild is cached and cheap.

4. If anything under [sql/](sql/) or [scripts/sql-files.sh](scripts/sql-files.sh)
   changed (new migrations get added to that list over time):

   ```bash
   npm run db:apply-sql
   ```

   Applies the file list to the running dev db. The files use
   `CREATE OR REPLACE` / `DROP … IF EXISTS`, so re-running on an already
   migrated db is safe — when in doubt, just run it.

5. If you'll run e2e and the storage state is older than 24 h (tests
   suddenly meet the Anmeldung dialog): `node scripts/refresh-auth-state.mjs`
   (needs the backend on :3000).
6. Sanity check: `npm run check`, then `npm run dev` and log in.

## Optional: reseed the dev db from current production (destructive)

Replaces local dev data with a fresh production snapshot:

```bash
npm run fetchBackup
docker compose -f backend-dev/docker-compose.yml down -v
docker compose -f backend-dev/docker-compose.yml up -d --build
npm run db:apply-sql
```

## Symptoms → fix

| Symptom | Fix |
| --- | --- |
| Login seems to succeed but every migrated query 404s (token is the raw secret) | `npm run db:apply-sql` was forgotten |
| `docker compose build` fails on `COPY ./apflora.backup` | `npm run fetchBackup` first |
| Dev page loads but shows no data / Anmeldung loops | Backend stack not running, PostgREST not on `localhost:3000` |
| Playwright tests meet the Anmeldung dialog | `node scripts/refresh-auth-state.mjs` |
| `npm run dev` talks to the production api | Open the app on `localhost:5173`, not via an IP/IDE preview host ([src/modules/api.ts](src/modules/api.ts) keys off the hostname) |
