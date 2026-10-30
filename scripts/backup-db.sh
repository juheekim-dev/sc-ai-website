#!/usr/bin/env bash
# supercoder-aiview DB 백업 — pg_dump(custom format), 최근 N개만 보관.
# 필요: .env.local 의 SUPABASE_DB_URL(Session pooler URI, 비밀번호 포함) + pg_dump(brew install libpq)
# 산출: ~/Backups/supercoder-aiview/db/aiview-<날짜>-public.dump (필수)
#       ~/Backups/supercoder-aiview/db/aiview-<날짜>-auth-storage.dump (가능할 때만)
# 복원: pg_restore --no-owner --no-privileges -d "<URI>" <파일>
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"
[ -f "$ENV_FILE" ] || { echo "ERROR: $ENV_FILE 없음" >&2; exit 1; }

# .env.local 에서 SUPABASE_DB_URL 한 줄만 읽는다(다른 값은 셸에 노출하지 않음)
DB_URL="$(grep -E '^SUPABASE_DB_URL=' "$ENV_FILE" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
[ -n "$DB_URL" ] || { echo "ERROR: .env.local 에 SUPABASE_DB_URL 이 없습니다" >&2; exit 1; }

DEST="${BACKUP_DIR:-$HOME/Backups/supercoder-aiview}"
mkdir -p "$DEST/db"
LOG="$DEST/backup.log"
KEEP="${BACKUP_KEEP:-8}"

PGDUMP=""
for c in "${PG_DUMP:-}" "$(command -v pg_dump || true)" /opt/homebrew/opt/libpq/bin/pg_dump /usr/local/opt/libpq/bin/pg_dump; do
  if [ -n "$c" ] && [ -x "$c" ]; then PGDUMP="$c"; break; fi
done
[ -n "$PGDUMP" ] || { echo "ERROR: pg_dump 없음 — brew install libpq" >&2; exit 1; }

STAMP="$(date +%F)"
OUT_PUBLIC="$DEST/db/aiview-$STAMP-public.dump"
OUT_SYS="$DEST/db/aiview-$STAMP-auth-storage.dump"

# 1) public 스키마 — 블로그·리드·설정 등 서비스 데이터 전부. 실패하면 스크립트도 실패.
"$PGDUMP" "$DB_URL" --format=custom --compress=6 --no-owner --no-privileges \
  --schema=public --file="$OUT_PUBLIC.tmp"
mv "$OUT_PUBLIC.tmp" "$OUT_PUBLIC"

# 2) auth(관리자 계정)·storage(파일 메타) — 권한 문제로 실패할 수 있어 경고만 남기고 계속.
if "$PGDUMP" "$DB_URL" --format=custom --compress=6 --no-owner --no-privileges \
     --schema=auth --schema=storage \
     --exclude-table='auth.schema_migrations' --exclude-table='storage.migrations' \
     --file="$OUT_SYS.tmp" 2>"$DEST/db/.sys.err"; then
  mv "$OUT_SYS.tmp" "$OUT_SYS"
else
  rm -f "$OUT_SYS.tmp"
  echo "$(date '+%F %T') db WARN auth/storage 스키마 덤프 실패: $(tail -1 "$DEST/db/.sys.err")" | tee -a "$LOG" >&2
fi
rm -f "$DEST/db/.sys.err"

# 3) 오래된 덤프 정리 — 종류별로 최근 KEEP개만 남긴다
for kind in public auth-storage; do
  ls -1t "$DEST/db"/aiview-*-"$kind".dump 2>/dev/null | tail -n +$((KEEP+1)) | while read -r f; do rm -f "$f"; done
done

echo "$(date '+%F %T') db OK $OUT_PUBLIC ($(du -h "$OUT_PUBLIC" | cut -f1))" | tee -a "$LOG"
