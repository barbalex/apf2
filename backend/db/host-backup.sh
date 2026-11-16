#!/bin/bash
# host wrapper installed at /root/backup/backup.sh on the server.
# cron (root): 0 23 * * * /root/backup/backup.sh >> /root/backup/backup.log 2>&1
# rclone config for the nextcloud upload lives at /root/backup/rclone.conf
# and is mounted into the container at /root/.config/rclone/rclone.conf
# (in-repo copy: backend/db/host-backup.sh)
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S') UTC: starting apflora backup ==="
docker exec apf_db bash ./backup.sh
RC=$?
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S') UTC: backup finished with exit code $RC ==="
exit $RC
