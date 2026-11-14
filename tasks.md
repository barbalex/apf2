---
---

---

---

---

---

---

---

Tree keyboard navigation as in ae3

---

Backup hardening as in vermehrung — DONE 14.11.2026: `backend/db/backup.sh` skips on a deterministic data fingerprint (per-table row count + order-independent sum of per-row md5 hashes over every apflora base table, table list generated from the catalog so migrations are covered; `error_report` excluded — telemetry noise, stays in the dump; a plain string_agg overflows the 1GB buffer on beob's 500k rows). Verified on the dev db: 12s on the 1.2GB db, skips when unchanged or telemetry-only writes, dumps on a single-row update; full script dry-run with stubbed rclone: first run dumps+uploads+writes fingerprint, second skips instantly (the old script built a full 145MB dump before every skip). Restore test (`backend/db/test-restore.sh`, in the db container): newest nextcloud backup → scratch db → sanity counts → cleanup; passed against the 02.11. dump with 0 errors (600 ap / 21'457 tpop / 28'360 tpopkontr / 500'775 beob) — no extension pre-creates needed, the dump carries its own CREATE EXTENSION. Host cron wrapper in-repo (`backend/db/host-backup.sh`, matches the installed `/root/backup/backup.sh`; cron 23:00 unchanged). `npm run fetchBackup` seeds `backend-dev/db/apflora.backup` from production (verified live, 130.5MB; rebuild: `down -v && up -d --build` + `npm run db:apply-sql`). DEPLOYED TO VM 14.11.2026 (scp + image rebuild + container recreate, in-container checksums match the repo): first prod run dumped+uploaded in 2m08s and wrote last.fingerprint; restore test on prod passed against that fresh backup (0 errors, 600 ap / 21'483 tpop / 28'415 tpopkontr / 500'775 beob, 1m07s).

---

---

---

---

---

How can we optimize this repo for agentic work on it?
Are the following things clear to an agent or do we need to document/prepare them for agents to work better on this repo?

- how to build
- how to deploy
- how to test user roles
- anything else?

---

---

---

When react-leaflet v6 (actively developed against beta.2 on the next branch) is published, you can drop the override, the patch script, and the shim in one go.

---
