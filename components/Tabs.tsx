"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

// 공용 탭 — 가운데 알약 탭 줄(.tt-list·.tt-tab) + 패널. TypeTabs(유형 섹션)·IntegritySection(부정행위 감지)이 같이 쓴다(2026-11-26).
// 패널은 모두 서버에서 그려 두고(검색엔진이 다 읽게) 고르지 않은 것만 hidden. 좌우 화살표·Home·End로 탭을 옮긴다.
// 패널 안 배치는 panelClass로 쓰는 쪽이 정한다(스타일은 app/landing.css).
export type TabItem = { label: string; panel: ReactNode };

export default function Tabs({ items, label, panelClass }: { items: TabItem[]; label: string; panelClass: string }) {
  const [cur, setCur] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    const j = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    setCur(j);
    tabs.current[j]?.focus();
  };

  return (
    <div className="ttabs">
      <div className="tt-list" role="tablist" aria-label={label}>
        {items.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${base}-t${i}`}
            aria-controls={`${base}-p${i}`}
            aria-selected={i === cur}
            tabIndex={i === cur ? 0 : -1}
            className="tt-tab"
            onClick={() => setCur(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div key={t.label} className={panelClass} role="tabpanel" id={`${base}-p${i}`} aria-labelledby={`${base}-t${i}`} hidden={i !== cur}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}
