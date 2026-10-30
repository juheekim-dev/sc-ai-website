#!/usr/bin/env node
// supercoder-aiview Storage 버킷(blog-covers·brochures 등)을 로컬로 미러링한다(증분).
// 필요: .env.local 의 NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// 산출: ~/Backups/supercoder-aiview/storage/<bucket>/<path>  — 같은 크기면 건너뛴다.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = parseEnv(await fs.readFile(path.join(ROOT, ".env.local"), "utf8"));
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error("ERROR: .env.local 에 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 필요합니다");
  process.exit(1);
}
const BASE = process.env.BACKUP_DIR || path.join(os.homedir(), "Backups", "supercoder-aiview");
const DEST = path.join(BASE, "storage");
const sb = createClient(URL_, KEY, { auth: { persistSession: false } });

function parseEnv(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

// 폴더는 id === null 로 내려오므로 재귀로 펼친다
async function listAll(bucket, prefix = "") {
  const files = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const { data, error } = await sb.storage.from(bucket).list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw new Error(`${bucket}/${prefix}: ${error.message}`);
    for (const e of data) {
      const p = prefix ? `${prefix}/${e.name}` : e.name;
      if (e.id === null) files.push(...(await listAll(bucket, p)));
      else files.push({ path: p, size: e.metadata?.size ?? null });
    }
    if (data.length < limit) break;
  }
  return files;
}

const { data: buckets, error: bErr } = await sb.storage.listBuckets();
if (bErr) { console.error("ERROR listBuckets:", bErr.message); process.exit(1); }

let downloaded = 0, skipped = 0, failed = 0, bytes = 0;
for (const b of buckets) {
  const files = await listAll(b.name);
  for (const f of files) {
    const local = path.join(DEST, b.name, f.path);
    if (existsSync(local) && f.size != null && statSync(local).size === f.size) { skipped++; continue; }
    const { data, error } = await sb.storage.from(b.name).download(f.path);
    if (error) { failed++; console.error(`FAIL ${b.name}/${f.path}: ${error.message}`); continue; }
    await fs.mkdir(path.dirname(local), { recursive: true });
    const buf = Buffer.from(await data.arrayBuffer());
    await fs.writeFile(local, buf);
    downloaded++; bytes += buf.length;
  }
  console.log(`${b.name}: ${files.length}개`);
}

const d = new Date();
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;  // 로컬 시각(backup-db.sh 와 맞춤)
const line = `${stamp} storage OK downloaded=${downloaded} (${(bytes / 1048576).toFixed(1)}MB) skipped=${skipped} failed=${failed}`;
console.log(line);
await fs.mkdir(BASE, { recursive: true });
await fs.appendFile(path.join(BASE, "backup.log"), line + "\n");
process.exit(failed ? 2 : 0);
