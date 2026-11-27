"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/track";

/**
 * AI 역량검사 출시 안내 팝업(2026-11-26) — 홈(app/page.tsx)에만 마운트한다.
 * 목적은 AI 역량검사 페이지 클릭 유도 하나 — "최대한 짧고 간결하게"(같은 날 사용자). 글은 제목·한 줄·버튼만 둔다.
 * 그리팅 팝업 참고(사용자 공유): 왼쪽에 제목·한 줄·버튼·'오늘 하루 보지 않기', 오른쪽에 작은 흰 리포트 카드(누르면 같은 페이지로).
 * 바탕은 AI 역량검사 응시 화면 같은 개발자 화면(11/26 "배너 팝업 배경을 AI 역검 화면같이 개발자 화면으로") — 응시 화면 색(#1E1E1E)의
 * 코드 편집기(탭·줄 번호·VS Code 색 코드)를 흐리게 깔고 천천히 위로 흐르게, 왼쪽(글 쪽)은 어둡게 눌러 글이 읽히게. 코드는 일반 예시.
 * 예전 바탕(유리 물결 FlutedGlassBg palette="assessment")은 git 70f9df9.
 * 카드는 HTML로 그린 예시 — 항목 이름은 실제 리포트와 같다(4단계 AI 추천 중 '추천', 평가 항목 4개). 점수·가중치 숫자는 넣지 않는다
 * (근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md). 모바일에서는 카드를 빼 글·버튼만 남긴다.
 * 배경 딤은 이벤트 팝업(EventPopup)의 .evp-dim(globals.css)을 그대로 쓰고, 판 스타일은 app/landing.css(.lp-*).
 *
 * - 닫기(X·ESC·바깥 클릭)는 sessionStorage — 같은 방문 안에서는 다시 뜨지 않는다.
 * - '오늘 하루 보지 않기'는 localStorage에 오늘 날짜(KST)를 적어 두고, 날짜가 바뀌면 다시 뜬다.
 * - 이벤트 팝업과 같은 시각에 뜨지 않도록, 이벤트 모집 중에 행사를 다시 열면 둘 중 하나를 내린다.
 */
const KEY = "lp-assessment-launch";

// 예시 리포트의 평가 항목 4개 — 실제 리포트의 항목 이름
const CHECKS = ["AI 활용", "AI 결과 검증", "문제 이해 · 결과 정확성", "이해도 · 직무 역량"];

// 바탕 코드(일반 예시 — 파일 세 개를 읽어 비교표를 만드는 과제, AI 어시스턴트 카드와 같은 장면). 색 class: k 키워드 · f 함수 · v 변수 · s 문자열 · c 주석 · n 숫자
const CODE = [
  '<i class="k">import</i> { readFile } <i class="k">from</i> <i class="s">"./data"</i>;',
  '',
  '<i class="c">// 파일 1, 2, 3을 읽어 항목별로 비교한다</i>',
  '<i class="k">export async function</i> <i class="f">compareFiles</i>(<i class="v">paths</i>) {',
  '  <i class="k">const</i> <i class="v">rows</i> = <i class="k">await</i> <i class="v">Promise</i>.<i class="f">all</i>(<i class="v">paths</i>.<i class="f">map</i>(<i class="f">readFile</i>));',
  '  <i class="k">const</i> <i class="v">table</i> = <i class="f">toTable</i>(<i class="v">rows</i>);',
  '  <i class="k">for</i> (<i class="k">const</i> <i class="v">r</i> <i class="k">of</i> <i class="v">table</i>) {',
  '    <i class="k">if</i> (<i class="v">r</i>.<i class="v">file2</i> !== <i class="v">r</i>.<i class="v">file3</i>) <i class="v">r</i>.<i class="v">flag</i> = <i class="s">"확인 필요"</i>;',
  '  }',
  '  <i class="k">return</i> <i class="v">table</i>;',
  '}',
  '',
  '<i class="c">// 보고서.md에 넣을 다음 분기 계획</i>',
  '<i class="k">export function</i> <i class="f">nextPlan</i>(<i class="v">table</i>) {',
  '  <i class="k">return</i> <i class="v">table</i>.<i class="f">filter</i>((<i class="v">r</i>) =&gt; <i class="v">r</i>.<i class="v">score</i> &gt; <i class="n">0.8</i>);',
  '}',
];

/** 오늘 날짜(KST) "2026-11-26" — '오늘 하루' 판정용 */
function kstToday(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export default function LaunchPopup() {
  const [open, setOpen] = useState(false);

  // 노출 판정은 마운트 후에만 — SSR HTML에 팝업을 넣지 않아 닫았던 사람에게 번쩍이지 않는다.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      if (localStorage.getItem(KEY) === kstToday()) return;
    } catch {
      /* 사생활 보호 모드 — 그냥 보여준다 */
    }
    const t = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* 저장 실패 — 이번 렌더에서만 닫힘 */
    }
  }, []);

  const hideToday = () => {
    trackEvent("launch_popup_hide_today");
    try {
      localStorage.setItem(KEY, kstToday());
    } catch {
      /* 저장 실패 — 이번 방문만 닫힘 */
    }
    close();
  };

  // ESC로 닫기 + 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (!open) return null;

  const go = () => {
    trackEvent("launch_popup_click");
    close();
  };

  return (
    <div className="evp-dim" role="presentation" onClick={close}>
      <div className="lp" role="dialog" aria-modal="true" aria-labelledby="lp-title" onClick={(e) => e.stopPropagation()}>
        <div className="lp-code" aria-hidden="true">
          <div className="lp-code-tabs"><span className="on">report.ts</span><span>compare.ts</span><span>보고서.md</span></div>
          <div className="lp-code-body">
            {/* 같은 코드를 두 번 이어 붙여 위로 흐르다 끊김 없이 되돌아온다 */}
            {[0, 1].map((k) => (
              <div className="lp-code-run" key={k}>
                {CODE.map((l, i) => <p key={i}><em>{i + 1}</em><span dangerouslySetInnerHTML={{ __html: l }} /></p>)}
              </div>
            ))}
          </div>
        </div>
        <div className="lp-text">
          <span className="lp-new">NEW</span>
          <h2 id="lp-title">AI 역량검사<br />출시</h2>
          <p>AI와 일하는 실력을 실제 과제로 확인하세요.</p>
          <div className="lp-actions">
            <Link href="/ai-assessment" className="btn btn-blue" onClick={go}>
              AI 역량검사 보기 <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <button type="button" className="lp-today" onClick={hideToday}>오늘 하루 보지 않기</button>
          </div>
        </div>
        {/* 예시 리포트 카드 — 카드 전체가 링크(버튼과 같은 곳). 항목 줄은 팝업이 뜨면 하나씩 나타난다 */}
        <Link href="/ai-assessment" className="lp-media" onClick={go} tabIndex={-1} aria-hidden="true">
          <div className="lp-card">
            <div className="lp-card-head">
              <strong><span className="lp-spark">✦</span>AI 역량검사 리포트</strong>
              <span className="lp-verdict"><span className="lp-spark">✦</span>추천</span>
            </div>
            <ul className="lp-checks">
              {CHECKS.map((k) => (
                <li key={k}><i className="fa-solid fa-check"></i>{k}</li>
              ))}
            </ul>
          </div>
        </Link>
        <button type="button" className="lp-x" aria-label="AI 역량검사 출시 안내 닫기" onClick={close}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}
