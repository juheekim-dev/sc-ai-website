"use client";

import Tabs from "./Tabs";
import TypeDemo, { type DemoKind } from "./TypeDemo";

// 유형 섹션 — 탭으로 고르기(2026-11-26 시안 D안). AI 면접 '면접 유형'(2개)·AI 역량검사 '과제 유형'(3개) 공용.
// 아이콘 대신 도입 단계 이미지와 같은 결의 화면 이미지(흰 창, 채용공고 작성·이력서·코드 편집기 등 — 원본은 _docs/홈페이지 개편/도식/캡처가공 type-*).
// 탭 동작은 공용 Tabs. 스타일은 app/landing.css(.tt-*).
// demo: 이미지 대신 글이 써지고 차례로 나타나는 HTML 그림(TypeDemo — 면접 유형 jd·cv, 과제 유형 dev·doc·code, 11/26)
export type TypeItem = { title: string; body: string; tags: string[]; img: string; alt: string; demo?: DemoKind };

export default function TypeTabs({ items, label }: { items: TypeItem[]; label: string }) {
  return (
    <Tabs
      label={label}
      panelClass="tt-panel"
      items={items.map((t) => ({
        label: t.title,
        panel: (
          <>
            <div className="tt-text">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <div className="tt-tags">{t.tags.map((g) => <span key={g}>{g}</span>)}</div>
            </div>
            <div className="tt-shot">{t.demo ? <TypeDemo kind={t.demo} label={t.alt} /> : <img src={t.img} alt={t.alt} width={720} height={480} loading="lazy" />}</div>
          </>
        ),
      }))}
    />
  );
}
