# prunes the nextcloud sik folder (including alt/) down to the
# retention scheme:
#   7 daily    — the newest 7 backups
#   4 weekly   — the newest backup per ISO week beyond that
#   12 monthly — the newest backup per calendar month beyond that
#   yearly     — the OLDEST backup of each calendar year, forever
#                (the year-start snapshot contains the complete
#                passed year — reports evaluate the passed year)
# .meta.age files follow their .backup.age pair.
#
# scope: files whose name is a timestamped apflora dump, across all
# eras: *_apflora.sql.tar.gz (2014-2016), *_apflora.Backup (2016-2019),
# *_apflora (2025/26 interim server), *_apflora.backup (plaintext era),
# *_apflora.backup.age (encrypted era). nextcloud conflict-copy names
# ("… (1)", "… (copy)") count as their base name — duplicates of a
# kept timestamp are always deleted. everything else — access-era
# archives, beob-only dumps, sql zips, marker files — is NEVER touched.
# rclone partials (*.backup.~hex) are broken duplicate uploads and are
# always deleted.
#
# purely server-side: rclone lists and deletes, nothing is downloaded.
# deleted files land in the nextcloud trashbin (rescuable there).
#
# usage: prune-backups.sh --dry-run   (print the plan, delete nothing)
# BEWARE: rclone config is expected at /root/.config/rclone/rclone.conf
# (mounted from the host, see docker-compose.yml)

set -u
REMOTE_DIR="${REMOTE_DIR:-nextcloud:Gabriel Software/projekte/apflora/sik}"
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

DUMP_RE='^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}(-[0-9]{2})?_apflora(\.backup|\.Backup|\.sql\.tar\.gz|\.backup\.age)?$'
META_RE='^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}(-[0-9]{2})?_apflora\.meta\.age$'
# strip nextcloud conflict-copy suffixes: "name (1).ext" / "name (copy).ext"
norm_of() { printf '%s' "${1##*/}" | sed -E 's/ \((copy|[0-9]+)\)(\.[^.]+)$/\2/'; }

# rclone lsl lines: "<size> <date> <time.ns> <path>" (no spaces in paths)
declare -A SIZE GROUP
METAS=()
GARBAGE=()
while read -r size _d _t path; do
  [ -z "${path:-}" ] && continue
  SIZE[$path]=$size
  base=${path##*/}
  case "$base" in
    *.~[0-9a-f]*)
      GARBAGE+=("$path")
      continue
      ;;
  esac
  norm=$(norm_of "$path")
  if [[ "$norm" =~ $DUMP_RE ]]; then
    GROUP[$norm]="${GROUP[$norm]:-}$path
"
  elif [[ "$norm" =~ $META_RE ]]; then
    METAS+=("$path")
  fi
done < <(rclone lsl "$REMOTE_DIR")

# one representative per timestamp: prefer the plain-named file over
# its conflict copies; the copies are always-delete duplicates
REP=()
DUPES=()
declare -A RNORM
while read -r norm; do
  rep=""
  while read -r p; do
    [ -z "$p" ] && continue
    [ "$(norm_of "$p")" = "${p##*/}" ] && rep="$p" && break
  done <<< "${GROUP[$norm]}"
  if [ -z "$rep" ]; then
    while read -r p; do
      [ -z "$p" ] && continue
      rep="$p" && break
    done <<< "${GROUP[$norm]}"
  fi
  REP+=("$rep")
  RNORM[$rep]=$norm
  while read -r p; do
    [ -z "$p" ] && continue
    [ "$p" != "$rep" ] && DUPES+=("$p")
  done <<< "${GROUP[$norm]}"
done < <(printf '%s\n' "${!GROUP[@]}" | sort)

# sort representatives chronologically by their NORMALIZED basename
# (the timestamp — conflict-copy names contain spaces, so a plain path
# sort is neither chronological nor even stable); tab separator keeps
# the key split safe from the spaces in the path
mapfile -t BACKUPS < <(for r in ${REP[@]+"${REP[@]}"}; do printf '%s\t%s\n' "${RNORM[$r]}" "$r"; done | sort | cut -f2-)

declare -A KEEP
date_of() { local b=${1##*/}; echo "${b:0:10}"; }
n=${#BACKUPS[@]}
echo "eligible: $n timestamped backups, ${#METAS[@]} meta bundles, ${#DUPES[@]} conflict-copy duplicates, ${#GARBAGE[@]} broken partials"
[ "$n" -eq 0 ] && exit 0

# 1) the 7 newest backups
for ((i = n > 7 ? n - 7 : 0; i < n; i++)); do KEEP[${BACKUPS[$i]}]=daily; done

# 2) newest per distinct ISO week, 4 weeks beyond the dailies
weeks=0
declare -A SEEN_W
for ((i = n - 1; i >= 0; i--)); do
  f=${BACKUPS[$i]}
  [ -n "${KEEP[$f]:-}" ] && continue
  wk=$(date -d "$(date_of "$f")" +%G-W%V)
  if [ -z "${SEEN_W[$wk]:-}" ]; then
    SEEN_W[$wk]=1
    KEEP[$f]=weekly
    weeks=$((weeks + 1))
  fi
  [ $weeks -ge 4 ] && break
done

# 3) newest per distinct calendar month, 12 months beyond the weeklies
months=0
declare -A SEEN_M
for ((i = n - 1; i >= 0; i--)); do
  f=${BACKUPS[$i]}
  [ -n "${KEEP[$f]:-}" ] && continue
  mo=$(date_of "$f"); mo=${mo:0:7}
  if [ -z "${SEEN_M[$mo]:-}" ]; then
    SEEN_M[$mo]=1
    KEEP[$f]=monthly
    months=$((months + 1))
  fi
  [ $months -ge 12 ] && break
done

# 4) OLDEST per calendar year, kept forever
declare -A SEEN_Y
for ((i = 0; i < n; i++)); do
  f=${BACKUPS[$i]}
  [ -n "${KEEP[$f]:-}" ] && continue
  yr=$(date_of "$f"); yr=${yr:0:4}
  if [ -z "${SEEN_Y[$yr]:-}" ]; then
    SEEN_Y[$yr]=1
    KEEP[$f]=yearly
  fi
done

# meta bundles follow their backup pair
for m in ${METAS[@]+"${METAS[@]}"}; do
  pair=${m%.meta.age}.backup.age
  if [ -n "${KEEP[$pair]:-}" ]; then KEEP[$m]=meta; fi
done

# everything eligible that is not kept gets deleted (plus dupes+garbage)
DELETE=()
for f in ${BACKUPS[@]+"${BACKUPS[@]}"} ${METAS[@]+"${METAS[@]}"}; do
  [ -n "${KEEP[$f]:-}" ] || DELETE+=("$f")
done
DELETE+=(${DUPES[@]+"${DUPES[@]}"} ${GARBAGE[@]+"${GARBAGE[@]}"})

# report
kb=0
for f in "${!KEEP[@]}"; do kb=$((kb + ${SIZE[$f]:-0})); done
kd=0
for f in ${DELETE[@]+"${DELETE[@]}"}; do kd=$((kd + ${SIZE[$f]:-0})); done
echo "--- KEEP (${#KEEP[@]} files, $(awk -v b=$kb 'BEGIN{printf "%.2f GB", b/1e9}')):"
for f in "${!KEEP[@]}"; do echo "  [${KEEP[$f]}] $f"; done | sort
echo "--- DELETE (${#DELETE[@]} files, $(awk -v b=$kd 'BEGIN{printf "%.2f GB", b/1e9}'))"

if [ $DRY_RUN -eq 1 ]; then
  echo "dry run - nothing deleted"
  exit 0
fi
printf '%s\n' ${DELETE[@]+"${DELETE[@]}"} | rclone delete "$REMOTE_DIR" --files-from -
echo "deleted ${#DELETE[@]} files"
