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
if [ $rc -ne 0 ]; then
  echo "$(date '+%F %T') WARN 일부 실패 — 위 로그 확인" | tee -a "$DEST/backup.log" >&2
  # 실패 시 macOS 알림센터로 알린다(launchd 로그인 세션에서 동작)
  osascript -e 'display notification "DB 또는 Storage 백업이 실패했습니다. ~/Backups/supercoder-aiview/launchd.log 확인" with title "AIVIEW 백업 실패" sound name "Basso"' >/dev/null 2>&1 || true
fi
exit $rc
