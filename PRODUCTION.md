# Production

How apflora.ch runs in production and how to change it. Frontend deploys
are one command; **database changes need the script below, run manually,
before the frontend that depends on them is deployed.**

## What runs where

| Piece          | Where                                                             |
| -------------- | ----------------------------------------------------------------- |
| Frontend (SPA) | Vercel, deploys from the `apflora` branch (`npm run deploy`)      |
| API            | `https://api.apflora.ch/postgrest` — PostgREST on the VM          |
| VM             | `api.apflora.ch` (139.162.172.88, Linode), ssh `root@` (key auth) |
| Docker stack   | `apf_db` (Postgres), `apf_postgrest` (internal :3000), `apf_caddy` (:80/:443, TLS) |

The API lives under the `/postgrest` path — `https://api.apflora.ch/`
itself returns 404. PostgREST connects to `apf_db` inside the docker
network; the browser only talks to caddy.

VM-level backups: the whole VM is backed up "every few days" (see the
app's Daten sichern doc). For risky data changes, additionally take a
`pg_dump` before applying.

## Applying SQL changes to production

```bash
scripts/apply-production-sql.sh                      # standard file list (scripts/sql-files.sh)
scripts/apply-production-sql.sh sql/…/migration.sql  # explicit files
scripts/apply-production-sql.sh --yes …              # skip the prompt
```

The script (mirrors `scripts/apply-postgrest-sql.sh` for the dev db, both
source the same file list):

1. prints target + files, asks for confirmation
2. snapshots every RLS policy of the `apflora` schema to
   `prod-snapshots/policies-<timestamp>.txt` (gitignored) — the rollback
   artifact
3. applies each file in a **single transaction** (`--single-transaction`
   + `ON_ERROR_STOP`) — failed files leave no partial state
4. reloads the PostgREST schema cache (`NOTIFY pgrst`) and smoke-tests
   `GET /postgrest/`

Rollback: the policy snapshot plus the git history of
`sql/apflora/createTables.sql` (e.g.
`git show <commit>~1:sql/apflora/createTables.sql`) contain the previous
definitions — recreate the old objects from there. Migration files must
be idempotent (`DROP … IF EXISTS` + `CREATE`) so re-running is safe.

Adding a migration: put it in `sql/apflora/migrations/<date>_<topic>/`,
add it to `scripts/sql-files.sh`, apply to the dev db
(`npm run db:apply-sql`), extend the api-tests, then run the production
script. **Order matters**: database first, then `npm run deploy` for the
frontend.

## Deploying the frontend

`npm run deploy [patch|minor|major]` — bumps version + date, merges
master into `apflora`, pushes; Vercel deploys the `apflora` branch. The
version is surfaced to stale PWA clients via `version.json`.

## Known cautions

- **Postgres is reachable from the internet** on `api.apflora.ch:5432`
  (docker publishes `0.0.0.0:5432`, verified open). Only password auth
  protects it. Consider firewalling the port or binding Postgres to
  localhost/the docker network only — PostgREST does not need the
  published port.
- No error telemetry is configured yet (the opt-in client reporter exists
  — set `VITE_ERROR_TELEMETRY_URL` at build time, see CLAUDE.md).
