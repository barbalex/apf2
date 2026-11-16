#!/bin/sh
# notifies about new rows in apflora.error_report (client error telemetry).
# Designed to run from cron on the production VM every few minutes:
#
#   */5 * * * * /root/apf/error-notify.sh >> /root/apf/error-notify.log 2>&1
#
# Expects next to itself a .error-notify.env defining the webhook:
#
#   NOTIFY_URL='https://ntfy.sh/<topic>'    # ntfy (default; phone push)
#   # any endpoint accepting ntfy semantics works: Title header + body
#
# State (the last processed created_at watermark) lives in .error-notify-last
# next to the script. Delivery is at-least-once: the watermark only advances
# after the webhook call succeeded.
set -e
cd "$(dirname "$0")"

# shellcheck disable=SC1091
. ./.error-notify.env

LOCK=.error-notify.lock
STATE=.error-notify-last
PSQL="docker exec apf_db psql -U postgres -d apflora -t -A"

exec 9>"$LOCK"
flock -n 9 || exit 0

# first run: start from the newest existing report (no historical spam)
if [ ! -f "$STATE" ]; then
  $PSQL -c "select coalesce(max(created_at)::text, now()::text) from apflora.error_report" > "$STATE"
fi
LAST=$(cat "$STATE")

# one round-trip: notification fields + the new watermark
ROW=$($PSQL -F '|' -c "
  select count(*)::text,
         coalesce(max(created_at)::text, '$LAST'),
         coalesce((array_agg(left(message, 120) order by created_at desc))[1], ''),
         coalesce((array_agg(coalesce(release, '?') order by created_at desc))[1], '?')
    from apflora.error_report
   where created_at > '$LAST'")
COUNT=${ROW%%|*}
REST=${ROW#*|}
WATERMARK=${REST%%|*}
PREVIEW=${REST#*|}
PREVIEW=${PREVIEW%%|*}
RELEASE=${REST##*|}

if [ "$COUNT" -gt 0 ]; then
  echo "$(date -Is) notifying: $COUNT new error report(s)"
  curl -fsS \
    -H "Title: apflora: $COUNT neue(r) Client-Fehler" \
    -H "Tags: warning" \
    -d "neueste Meldung (Release $RELEASE): $PREVIEW — Details: Tabelle apflora.error_report" \
    "$NOTIFY_URL" >/dev/null
fi

printf '%s' "$WATERMARK" > "$STATE"
