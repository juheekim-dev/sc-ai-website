#!/usr/bin/env bash
# DB(pg_dump) + Storage(미러링) 백업을 순서대로 실행한다. launchd 주간 작업이 이 파일을 호출.
# 수동 실행: bash scripts/backup-all.sh
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/opt/homebrew/bin:/opt/homebrew/opt/libpq/bin:/usr/local/bin:/usr/bin:/bin"
DEST="${BACKUP_DIR:-$HOME/Backups/supercoder-aiview}"
mkdir -p "$DEST"
rc=0
bash "$ROOT/scripts/backup-db.sh" || rc=1
node "$ROOT/scripts/backup-storage.mjs" || rc=1
if [ $rc -ne 0 ]; then echo "$(date '+%F %T') WARN 일부 실패 — 위 로그 확인" | tee -a "$DEST/backup.log" >&2; fi
exit $rc
