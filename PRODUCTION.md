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

## Backups

Nightly db backup via cron on the VM (23:00, root): `/root/backup/backup.sh`
(in-repo copy: [backend/db/host-backup.sh](backend/db/host-backup.sh)) runs
[backend/db/backup.sh](backend/db/backup.sh) inside the `apf_db` container:

1. computes a deterministic data fingerprint — per `apflora`-schema base
   table the row count plus an order-independent sum of per-row md5
   hashes. The table list comes from the catalog, so future migration
   tables are covered automatically; `error_report` is excluded (client
   telemetry changes almost daily without real data changing — it stays
   in the dump itself). Unchanged fingerprint → no dump at all.
2. bundles globals + env into a second, small encrypted file
   `<datetime>_apflora.meta.age` — a tar of `pg_dumpall
   --globals-only` (roles with their passwords) and the VM's compose
   `.env` (mounted read-only at `/backup-env/.env`, see
   [backend/docker-compose.yml](backend/docker-compose.yml)):
   everything a lost-VM restore needs besides the dump itself. Same
   timestamp prefix as the dump, so retention pruning can treat them
   as a pair; uploaded first so a dead nextcloud fails the run before
   the expensive dump is built. Refreshes only when the fingerprint
   changed — roles/env rarely change, and the repo SQL recreates the
   roles anyway.
3. `pg_dump -Fc -Z9 apflora` → `/sik_data/dump.tmp` (transient
   plaintext — deleted immediately after encryption)
4. age-encrypts it with the committed public key →
   `/sik_data/<datetime>_apflora.backup.age`. A failed dump or
   encryption aborts the run — plaintext is never uploaded.
5. uploads both to nextcloud via rclone (config at `/root/backup/rclone.conf`,
   mounted into the container read-only)
6. only after a successful upload moves them to `/sik_data/last.backup.age`
   and `/sik_data/last.meta.age`, and writes `/sik_data/last.fingerprint`
   — a failed upload is retried by the next run

The fingerprint replaces the old size-equality check, which silently
skipped backups when the size happened to match despite changed
content (and always built a full 145MB dump first).

Encryption (2026-11-20): backups are age-encrypted inside the
container, before they touch nextcloud — every hop after the VM
(nextcloud instance, NAS, backblaze account) only ever sees
ciphertext. Key model:

- only the PUBLIC key lives on the VM (committed in
  [backend/db/backup.sh](backend/db/backup.sh) — creating backups is
  all it can do)
- the private key lives on the notebook at `~/.config/age/keys.txt`
  (mode 600) — plus a printout as the offline copy. If it is lost, the
  encrypted backups are cryptographically garbage; the printout is
  part of the system, not optional.
- ransomware model: a compromised or wiped VM cannot decrypt the
  offsite copies.
- the same keypair is intended to be reused for ps
  (arten-fördern.app) backups — one key to print, one to keep.
- manual decrypt: `age -d -i ~/.config/age/keys.txt -o out.backup
  file.backup.age`
- the meta bundle restores a lost VM self-contained: decrypt it the
  same way, `tar -xf` → `env` goes to `/root/apf/.env`, `globals.sql`
  only if roles drifted from the repo SQL (the init path recreates
  them anyway).

Dead-man's switch (2026-11-20): the host wrapper pings healthchecks.io
after every run — the plain URL on success (a fingerprint skip counts as
success: nothing to back up is healthy), `/fail` on a non-zero exit
(alerts immediately), and no ping within the check's period alerts too.
That last case is the point: a cron that silently dies (expired
nextcloud password, full disk, broken rclone) gets noticed instead of
writing to `backup.log` for weeks. One-time setup: create a check at
healthchecks.io (schedule "period 24h, grace 1h" — cron runs 23:00
nightly), then on the VM:

```bash
printf "HEALTHCHECK_URL='https://hc-ping.com/<uuid>'\n" > /root/backup/healthcheck.env
chmod 600 /root/backup/healthcheck.env
```

The uuid is the secret — anyone knowing it can send false "all fine"
pings — which is why it lives in the env file, not in this repo.

Retention (2026-11-20): after every successful upload, backup.sh runs
[backend/db/prune-backups.sh](backend/db/prune-backups.sh) — keep 7
daily + 4 weekly (newest per ISO week) + 12 monthly (newest per
month) + the OLDEST backup of each calendar year forever (the
year-start snapshot contains the complete passed year; reports
evaluate the passed year). Everything timestamped beyond that is
deleted from the nextcloud folder, purely server-side — deleted files
land in the nextcloud trashbin. `.meta.age` files follow their pair;
nextcloud conflict copies ("… (1)", "… (copy)") count as duplicates
of their base name; non-dump artifacts (the access-era archive, beob
dumps, ArtenDb zips, the 2012 v0) are never touched. Run it manually
with `--dry-run` to preview. Initial application on 2026-11-20
reduced the folder from 2087 files / 257 GB to 57 files / 5 GB
(37 scheme keeps + the unique artifacts).

Restore test (verify the backups actually restore): since encryption
the VM holds no private key, so the ongoing drill runs notebook-side —
`npm run fetchBackup` + dev-stack rebuild exercises download → decrypt
→ init-from-dump, and every fetch re-proves the notebook key still
decrypts current backups. The in-container test
([backend/db/test-restore.sh](backend/db/test-restore.sh)) still works
for plaintext dumps (the pre-2026-11-20 backups, or a locally decrypted
dump passed explicitly) and refuses `.age` files by design:

```bash
ssh root@api.apflora.ch 'docker exec -it apf_db bash ./test-restore.sh'
```

Last VM-side pass 14.11.2026 against the 02.11. dump (0 errors; 600 ap /
21'457 tpop / 28'360 tpopkontr / 500'775 beob) — port these sanity
counts into the notebook drill eventually.

Deploying changes to these scripts: `/root/apf` on the VM is a plain
copy of this repo's `backend/` (not a git checkout). `scp` the changed
files (e.g. `backend/db/backup.sh`, `backend/db/test-restore.sh`,
`backend/db/Dockerfile`) to `root@api.apflora.ch:/root/apf/db/`, then
`cd /root/apf && docker compose build db && docker compose up -d db`
(volumes survive the container recreation). The host wrapper at
`/root/backup/backup.sh` is copied manually — keep it in sync with
`backend/db/host-backup.sh`. The 2026-11-20 changes (encryption, meta
bundle, retention) touched `Dockerfile` + `backup.sh` +
`test-restore.sh` + `prune-backups.sh` (image rebuild path) and `docker-compose.yml` (the `.env` mount —
scp to `root@api.apflora.ch:/root/apf/`, a plain `up -d db` applies
it). Order: rebuild + recreate → trigger one backup manually
(`/root/backup/backup.sh`) → confirm `.backup.age` + `.meta.age`
appear in nextcloud → `npm run fetchBackup` on the notebook to prove
the decrypt path. Pre-encryption plaintext dumps stay in the
nextcloud folder until a retention step prunes them.

Seeding the dev stack from production: `npm run fetchBackup`
([scripts/fetchBackup.mjs](scripts/fetchBackup.mjs)) runs the
production backup (fingerprint-skips when unchanged), copies
`/sik_data/last.backup.age` out of the container, downloads it and
decrypts it with the local age key into
`backend-dev/db/apflora.backup` (gitignored) — the file a fresh dev db
volume initializes from. Then
`docker compose -f backend-dev/docker-compose.yml down -v && up -d --build`
(deletes local dev data!) and `npm run db:apply-sql`.

Additionally, the whole VM is backed up "every few days" (see the
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