"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import TypeDemo, { type DemoKind } from "./TypeDemo";

// 유형 섹션 — 탭으로 고르기(2026-11-26 시안 D안). AI 면접 '면접 유형'(2개)·AI 역량검사 '과제 유형'(3개) 공용.
// 아이콘 대신 도입 단계 이미지와 같은 결의 화면 이미지(흰 창, 채용공고 작성·이력서·코드 편집기 등 — 원본은 _docs/홈페이지 개편/도식/캡처가공 type-*).
// 패널은 모두 서버에서 그려 두고(검색엔진이 다 읽게) 고르지 않은 것만 hidden. 좌우 화살표·Home·End로 탭을 옮긴다. 스타일은 app/landing.css(.tt-*).
// demo: 이미지 대신 글이 써지고 차례로 나타나는 HTML 그림(TypeDemo — 면접 유형 jd·cv, 과제 유형 dev·doc·code, 11/26)
export type TypeItem = { title: string; body: string; tags: string[]; img: string; alt: string; demo?: DemoKind };

export default function TypeTabs({ items, label }: { items: TypeItem[]; label: string }) {
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
            key={t.title}
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
            {t.title}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div key={t.title} className="tt-panel" role="tabpanel" id={`${base}-p${i}`} aria-labelledby={`${base}-t${i}`} hidden={i !== cur}>
          <div className="tt-text">
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <div className="tt-tags">{t.tags.map((g) => <span key={g}>{g}</span>)}</div>
          </div>
          <div className="tt-shot">{t.demo ? <TypeDemo kind={t.demo} label={t.alt} /> : <img src={t.img} alt={t.alt} width={720} height={480} loading="lazy" />}</div>
        </div>
      ))}
    </div>
  );
}
