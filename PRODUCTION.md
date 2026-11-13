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

## Error telemetry

Client errors are collected in the `apflora.error_report` table
(anon insert-only, manager-readable — see CLAUDE.md). New reports
trigger a phone notification:

- `/root/apf/error-notify.sh` on the VM (repo copy:
  [scripts/notify-error-reports.sh](scripts/notify-error-reports.sh))
  runs from cron every 5 minutes, aggregates everything newer than its
  watermark and POSTs a summary to the webhook in
  `/root/apf/.error-notify.env` (mode 600). Delivery is at-least-once:
  the watermark only advances after a successful send.
- The default channel is ntfy: install the ntfy app (or use
  ntfy.sh in a browser) and subscribe to the topic named in
  `/root/apf/.error-notify.env`. The topic name is the secret — anyone
  who knows it can read the notifications (which carry only count,
  release and a 120-char preview; full reports stay in the database).
- To switch channels (Telegram bot, Gotify, email-to-webhook …), change
  `NOTIFY_URL` in the env file to an endpoint accepting ntfy semantics
  (`Title` header + plain-text body) and run the script once to test.
- Logs: `/root/apf/error-notify.log` (one line per notifying run).

## Database admin access (pgAdmin)

Postgres is **not reachable from the internet** — the published port is
bound to the VM's loopback only (`127.0.0.1:5432:5432` in
`/root/apf/docker-compose.yml`). Admin tools connect through an SSH
tunnel:

- pgAdmin server dialog — Connection tab: host `localhost`, port `5432`,
  maintenance db `apflora`, user `postgres`; SSH Tunnel tab: host
  `api.apflora.ch`, port `22`, user `root`, identity file `~/.ssh/id_ed25519`
- or a manual tunnel: `ssh -N -L 5433:localhost:5432 root@api.apflora.ch`,
  then connect to `localhost:5433`

Both workstation keys are authorized on the server. This also fixes the
previous plaintext exposure: `ssl = off`, so Postgres traffic must never
cross the internet directly — only inside the SSH channel. PostgREST is
unaffected (it talks to `apf_db` over the docker network, not the
published port).

## Known cautions

- Postgres was previously exposed on `0.0.0.0:5432` without TLS — closed
  on 2026-11-13 (see "Database admin access" above). If the port ever
  needs to be published again, enable TLS first (`ssl = on` + cert) or
  keep it loopback-only.
- Error telemetry is active: client errors land in the
  `apflora.error_report` table (anon insert-only, manager-readable) —
  check it in pgAdmin when investigating user reports.