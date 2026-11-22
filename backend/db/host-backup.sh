#!/bin/bash
# host wrapper installed at /root/backup/backup.sh on the server.
# cron (root): 0 23 * * * /root/backup/backup.sh >> /root/backup/backup.log 2>&1
# rclone config for the nextcloud upload lives at /root/backup/rclone.conf
# and is mounted into the container at /root/.config/rclone/rclone.conf
# (in-repo copy: backend/db/host-backup.sh)
#
# dead-man's switch: with HEALTHCHECK_URL set (sourced from
# /root/backup/healthcheck.env, mode 600 — the uuid is the secret),
# every run pings healthchecks.io: the plain url on success (a
# fingerprint skip counts as success — nothing to back up is healthy),
# /fail on a non-zero exit (alerts immediately). No ping at all within
# the check's period (24h + 1h grace, configured at healthchecks.io)
# alerts too — that is the point: a cron that silently dies (expired
# nextcloud password, full disk, broken rclone) gets noticed instead of
# writing to backup.log for weeks.
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S') UTC: starting apflora backup ==="
docker exec apf_db bash ./backup.sh
RC=$?
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S') UTC: backup finished with exit code $RC ==="

# ping last, and never let a ping problem alter the backup's exit code
[ -f /root/backup/healthcheck.env ] && . /root/backup/healthcheck.env
if [ -n "${HEALTHCHECK_URL:-}" ]; then
  if [ "$RC" -eq 0 ]; then
    curl -fsS --max-time 10 "$HEALTHCHECK_URL" >/dev/null \
      || echo "WARNING: success ping to healthchecks.io failed"
  else
    curl -fsS --max-time 10 "$HEALTHCHECK_URL/fail" >/dev/null \
      || echo "WARNING: failure ping to healthchecks.io failed"
  fi
fi
exit $RC
