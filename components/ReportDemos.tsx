"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// AI 면접 리포트 02~04 그림(2026-11-27 "리포트 01처럼 나머지도 같은 무드로") — 옛 SVG 도식(motionDiagrams grade·competency·strength) 대신
// 리포트 01(SummaryDemo)과 같은 판(.ask-demo) 안에 흰 카드. 화면에 보일 때만(.play) 움직이고, 움직임 줄이기 설정이면 완성된 모습 한 장.
// 등급·항목 이름은 실제 리포트 구성(5단계 종합 등급 최적합·적합·양호·재검토 필요·부적합, 역량별 평가, 강점·약점)을 따르고, 글은 예시(히어로·면접 진행·인터뷰 요약과 같은 장면).
// 점수·가중치 숫자는 넣지 않는다(근거·금지 표현: _docs/홈페이지 개편/AI면접_AI역량검사_차이_소개자료.md). 스타일은 app/landing.css(.rg-*·.rc-*·.rs-*).

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// 화면에 들어오면 .play를 붙였다 떼는 공용 훅 — CSS 애니메이션은 .play일 때만 돈다
function usePlay(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.classList.add("still");
      return;
    }
    const io = new IntersectionObserver(([e]) => el.classList.toggle("play", e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

// ── 리포트 02 · 종합평가: 등급 원 그래프(적합) + 5단계 눈금 + 항목별 등급 막대
const LEVELS = ["최적합", "적합", "양호", "재검토 필요", "부적합"];
const ITEMS = [
  { name: "직무 적합도", grade: "적합", w: 82 },
  { name: "문제 해결", grade: "적합", w: 76 },
  { name: "의사소통", grade: "양호", w: 64 },
];
export function GradeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref);
  return (
    <div className="ask-demo rx rg" ref={ref} role="img" aria-label="종합평가 예시: 종합 등급 적합(5단계 중 두 번째), 직무 적합도 적합·문제 해결 적합·의사소통 양호">
      {/* 11/27 "종합평가와 역량평가 그래픽이 비슷하지 않다" — 두 리포트를 같은 틀로: 카드 한 장, 왼쪽 그래픽(같은 크기) + 오른쪽 항목 목록(이름·배지·막대) */}
      <div className="rx-in rx-solo" aria-hidden="true">
        <div className="rx-card">
          <span className="rx-hd">종합 평가</span>
          <div className="rx-body">
            <div className="rx-fig rg-main">
              <div className="rg-ring">
                <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" className="rg-bg" /><circle cx="60" cy="60" r="50" className="rg-fg" pathLength={100} /></svg>
                <b>적합<small>종합 등급</small></b>
              </div>
              <div className="rg-scale">{LEVELS.map((l) => <span key={l} className={l === "적합" ? "on" : undefined}>{l}</span>)}</div>
            </div>
            <ul className="rx-rows">
              {ITEMS.map((it, i) => (
                <li key={it.name} style={{ ["--w" as string]: `${it.w}%`, ["--d" as string]: `${0.3 + i * 0.25}s` }}>
                  <span className="rx-n">{it.name}<em>{it.grade}</em></span>
                  <span className="rx-bar"><b></b></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 리포트 03 · 역량평가: 여섯 역량 육각형(평균 점선 vs 지원자 블루 면) + 강·약 역량 표시
const AXES = ["의사소통", "문제해결", "태도", "직무 지식", "협업", "성실성"];
const AVG = [62, 60, 64, 58, 62, 60];
const ME = [78, 86, 70, 82, 56, 74];
const pts = (v: number[]) =>
  v.map((r, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    return `${(100 + Math.cos(a) * r * 0.72).toFixed(1)},${(100 + Math.sin(a) * r * 0.72).toFixed(1)}`;
  }).join(" ");
// 오른쪽 목록 — 지원자 값(막대)과 평균(눈금), 차트 ME·AVG와 같은 값
const ROWS3 = [
  { name: "문제해결", me: ME[1], avg: AVG[1], tag: "가장 높음", low: false },
  { name: "직무 지식", me: ME[3], avg: AVG[3], tag: "", low: false },
  { name: "협업", me: ME[4], avg: AVG[4], tag: "평균보다 낮음", low: true },
];
export function CompetencyDemo() {
  const ref = useRef<HTMLDivElement>(null);
  usePlay(ref);
  return (
    <div className="ask-demo rx rc" ref={ref} role="img" aria-label="역량평가 예시: 여섯 역량(의사소통·문제해결·태도·직무 지식·협업·성실성)에서 평균과 지원자를 비교한 육각형 차트, 문제해결이 가장 높고 협업이 평균보다 낮음">
      {/* 11/27 "둘로 나누지 말고 하나의 박스로" + 종합평가와 같은 틀(왼쪽 그래픽 + 오른쪽 항목 목록). 오른쪽은 지원자 막대 + 평균 눈금 */}
      <div className="rx-in rx-solo" aria-hidden="true">
        <div className="rx-card">
          <span className="rx-hd">역량 평가<span className="rc-lg"><i className="me"></i>지원자<i className="avg"></i>평균</span></span>
          <div className="rx-body">
            <div className="rx-fig">
              <svg viewBox="-14 -6 228 212" className="rc-svg">
                {[1, 0.66, 0.33].map((k) => <polygon key={k} points={pts(AXES.map(() => 100 * k))} className="rc-grid" />)}
                {AXES.map((_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3; return <line key={i} x1="100" y1="100" x2={100 + Math.cos(a) * 72} y2={100 + Math.sin(a) * 72} className="rc-grid" />; })}
                <polygon points={pts(AVG)} className="rc-avg" />
                <polygon points={pts(ME)} className="rc-me" />
                {AXES.map((t, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3; return <text key={t} x={100 + Math.cos(a) * 88} y={100 + Math.sin(a) * 88 + 3} className="rc-lb">{t}</text>; })}
              </svg>
            </div>
            <ul className="rx-rows">
              {ROWS3.map((r, i) => (
                <li key={r.name} style={{ ["--w" as string]: `${r.me}%`, ["--a" as string]: `${r.avg}%`, ["--d" as string]: `${0.3 + i * 0.25}s` }}>
                  <span className="rx-n">{r.name}{r.tag && <em className={r.low ? "low" : undefined}>{r.tag}</em>}</span>
                  <span className="rx-bar"><b></b><i></i></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 리포트 04 · 강점·약점: 두 카드, 항목 제목이 뜨고 설명이 한 글자씩 써진다(예시 글)
const STRONG = [
  { t: "근거 있는 우선순위", d: "사용자 인터뷰와 이탈 데이터를 함께 보고 일정과 품질의 우선순위를 정했습니다." },
  { t: "협업 조율", d: "개발·디자인과 일정을 맞추며 범위를 조정한 과정을 구체적으로 설명했습니다." },
];
const WEAK = [
  { t: "결과 검증 부족", d: "개편 뒤 지표로 결과를 다시 확인한 과정은 구체적이지 않았습니다." },
  { t: "대안 비교 부족", d: "선택하지 않은 대안과 비교한 근거는 제시하지 못했습니다." },
];
const SEQ = [...STRONG.map((x, i) => ({ side: 0, i, ...x })), ...WEAK.map((x, i) => ({ side: 1, i, ...x }))];
export function StrengthDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const full = SEQ.map((x) => x.d);
  const [typed, setTyped] = useState<string[]>(SEQ.map(() => ""));
  const [cur, setCur] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setTyped(full);
      return;
    }
    let run = 0;
    const sleep = (ms: number, id: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run ? res() : rej()), ms));
    const loop = async (id: number) => {
      try {
        for (;;) {
          setTyped(SEQ.map(() => ""));
          setCur(-1);
          await sleep(700, id);
          // 강점·약점을 번갈아(강점 01 → 약점 01 → 강점 02 → 약점 02) 써서 두 카드가 함께 채워진다
          for (const k of [0, 2, 1, 3]) {
            setCur(k);
            for (let n = 1; n <= full[k].length; n++) {
              setTyped((t) => t.map((v, j) => (j === k ? full[k].slice(0, n) : v)));
              await sleep(30, id);
            }
            await sleep(260, id);
          }
          setCur(-1);
          await sleep(3200, id);
        }
      } catch {
        /* 멈춤 */
      }
    };
    const io = new IntersectionObserver(([e]) => { run++; if (e.isIntersecting) loop(run); }, { threshold: 0.3 });
    io.observe(el);
    return () => { run++; io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const card = (side: 0 | 1) => (
    <div className={side ? "rx-card rs-card weak" : "rx-card rs-card strong"}>
      <span className="rx-hd">{side ? "약점" : "강점"}</span>
      {SEQ.map((x, k) => x.side === side && (
        <div key={k} className={typed[k] ? "rs-it on" : "rs-it"}>
          <b><em>0{x.i + 1}</em>{x.t}</b>
          <p>{typed[k]}{cur === k && <i className="sd-caret"></i>}</p>
        </div>
      ))}
    </div>
  );
  return (
    <div className="ask-demo rx rs" ref={ref} role="img" aria-label={`강점·약점 분석 예시: 강점 ${STRONG.map((x) => x.t).join(", ")} / 약점 ${WEAK.map((x) => x.t).join(", ")}`}>
      <div className="rx-in" aria-hidden="true">{card(0)}{card(1)}</div>
    </div>
  );
}

// ── AI 역량검사 '평가와 리포트' 그림(2026-11-27 "여기도 가짜 텍스트가 써지는 모션") — 옛 SVG 도식(motionDiagrams 'scorecard') 대신.
// 응시 화면 색(#1E1E1E) 창 안에 왼쪽 AI 추천 원 그래프('추천' — 4단계 중 하나), 오른쪽 흰 카드 '항목별 점수와 근거':
// 실제 평가 항목 이름 + 막대가 차오르고, 항목마다 근거 한 줄이 한 글자씩 써진다. 근거는 예시(AI 어시스턴트 카드의 파일 1·2·3 비교 과제와 같은 장면). 점수 숫자는 넣지 않는다.
const SC = [
  { name: "AI 활용", w: 84, why: "파일 비교는 AI에 맡기고 결론은 직접 썼습니다" },
  { name: "AI 결과 검증", w: 78, why: "AI가 만든 비교표를 원본과 대조해 두 곳을 고쳤습니다" },
  { name: "문제 이해 · 결과 정확성", w: 72, why: "요구한 세 묶음을 빠짐없이 정리했습니다" },
];
export function ScorecardDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const full = SC.map((x) => x.why);
  const [typed, setTyped] = useState<string[]>(SC.map(() => ""));
  const [cur, setCur] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.classList.add("still");
      setTyped(full);
      return;
    }
    let run = 0;
    const sleep = (ms: number, id: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run ? res() : rej()), ms));
    const loop = async (id: number) => {
      try {
        for (;;) {
          el.classList.remove("play");
          setTyped(SC.map(() => ""));
          setCur(-1);
          await sleep(60, id);
          el.classList.add("play"); // 원 그래프·막대가 차오르기 시작
          await sleep(900, id);
          for (let k = 0; k < SC.length; k++) {
            setCur(k);
            for (let n = 1; n <= full[k].length; n++) {
              setTyped((t) => t.map((v, j) => (j === k ? full[k].slice(0, n) : v)));
              await sleep(32, id);
            }
            await sleep(280, id);
          }
          setCur(-1);
          await sleep(3000, id);
        }
      } catch {
        /* 멈춤 */
      }
    };
    const io = new IntersectionObserver(([e]) => { run++; if (e.isIntersecting) loop(run); else el.classList.remove("play"); }, { threshold: 0.3 });
    io.observe(el);
    return () => { run++; io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="ask-demo rx sc" ref={ref} role="img" aria-label={`AI 역량검사 리포트 예시: AI 추천 '추천', 항목별 점수와 근거 — ${SC.map((x) => `${x.name}: ${x.why}`).join(" / ")}`}>
      <div className="sc-win" aria-hidden="true">
        <div className="sc-bar"><i></i><i></i><i></i><b>AI 역량검사 리포트</b></div>
        <div className="sc-body">
          <div className="rg-ring sc-ring">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" className="rg-bg" /><circle cx="60" cy="60" r="50" className="rg-fg" pathLength={100} /></svg>
            <b>추천<small>AI 추천</small></b>
          </div>
          <div className="rx-card sc-card">
            <span className="rx-hd">항목별 점수와 근거</span>
            <ul className="rx-rows sc-rows">
              {SC.map((x, k) => (
                <li key={x.name} style={{ ["--w" as string]: `${x.w}%`, ["--d" as string]: `${0.2 + k * 0.2}s` }}>
                  <span className="rx-n">{x.name}</span>
                  <span className="rx-bar"><b></b></span>
                  <p className="sc-why"><em>근거</em>{typed[k]}{cur === k && <i className="sd-caret"></i>}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
