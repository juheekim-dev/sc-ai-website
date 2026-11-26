"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// 유형 탭 그림(2026-11-26) — 이미지 대신 HTML로 그려 글이 써지고 요소가 차례로 나타난다. 모양은 도입 단계 이미지와 같은 창(오른쪽 아래로 넘침,
// 원본 _docs/홈페이지 개편/도식/캡처가공 type-*). 면접 유형: 채용공고 작성(jd)·이력서(cv) — 흰 창. 과제 유형: AI 개발 과제(dev)·AI 업무 과제(doc)·
// 코딩 테스트(code) — 실제 응시 화면 색의 어두운 창. 좌표는 360×240 캔버스 기준(px)을 cqw로 바꿔 칸 폭에 맞춰 늘고 준다(u).
// 순서는 SCRIPTS(글자 단위로 써지는 type, 한 번에 나타나는 show). 보일 때만 움직이고(다른 탭이거나 화면 밖이면 멈춤) 다 끝나면 잠시 머물렀다 처음부터.
// 움직임 줄이기 설정이면 다 나온 모습 그대로. 스타일은 app/landing.css(.tdemo·.td-*).
const u = (px: number) => `${(px / 3.6).toFixed(3)}cqw`;
const at = (left: number, top: number, extra: CSSProperties = {}): CSSProperties => ({ left: u(left), top: u(top), ...extra });

type Seg = [string, string?]; // 글, 코드 색(k 키워드·c 흐름·f 함수·v 변수·n 숫자)
type Ev = { id: string; segs?: Seg[]; gap?: number }; // segs가 있으면 한 글자씩, 없으면 한 번에 나타남
const S = (text: string): Seg[] => [[text]];

const SCRIPTS = {
  jd: [
    { id: "role", segs: S("서비스 기획자") },
    { id: "j1", segs: S("· 서비스 개선 과제를 정의하고 우선순위를 정합니다") },
    { id: "j2", segs: S("· 데이터로 문제를 찾고 개선안을 냅니다") },
    { id: "j3", segs: S("· 개발·디자인과 일정을 맞춥니다") },
  ],
  cv: [
    { id: "c0", segs: S("누리커머스 · 서비스 기획") }, { id: "d0", gap: 4 },
    { id: "c1", segs: S("결제 화면 개편 프로젝트를 이끌었습니다") }, { id: "chip", gap: 10 },
    { id: "c2", segs: S("고객 문의 데이터로 개선 과제를 정했습니다") },
    { id: "c3", segs: S("신규 회원 온보딩 개편") }, { id: "d1", gap: 4 },
    { id: "c4", segs: S("사용자 인터뷰로 요구사항을 정리했습니다") },
  ],
  dev: [
    { id: "me", gap: 16 },
    { id: "ai", segs: S("쿠폰이 없으면 합계를 그대로 돌려주게 고쳤어요") },
    { id: "fix", segs: [["  "], ["if", "c"], [" (!"], ["cart", "v"], ["."], ["coupon", "v"], [") "], ["return", "c"], [" "], ["sum", "v"], [";"]] },
    { id: "pass", gap: 4 },
  ],
  doc: [
    { id: "m1", segs: S("# 자료 분석 보고서") },
    { id: "m2", segs: S("## 1. 핵심 내용 비교") },
    { id: "m3", segs: S("| 항목 | 파일 1 | 파일 2 |") },
    { id: "m4", segs: S("| 신규 가입 | 늘었음 | 줄었음 |") },
    { id: "q", gap: 14 },
    { id: "a", segs: S("신규 가입을 늘리는 것이었어요.") },
    { id: "m5", segs: S("## 2. 다음 분기 계획") },
    { id: "m6", segs: S("- 가입 단계를 하나로 줄인다") },
  ],
  code: [
    { id: "k1", segs: [["def", "k"], [" "], ["solution", "f"], ["("], ["nums", "v"], ["):"]] },
    { id: "k2", segs: [["    "], ["seen", "v"], [" = "], ["set", "f"], ["()"]] },
    { id: "k3", segs: [["    "], ["for", "c"], [" "], ["n", "v"], [" "], ["in", "c"], [" "], ["nums", "v"], [":"]] },
    { id: "k4", segs: [["        "], ["if", "c"], [" "], ["n", "v"], [" "], ["in", "c"], [" "], ["seen", "v"], [":"]] },
    { id: "k5", segs: [["            "], ["return", "c"], [" "], ["n", "v"]] },
    { id: "k6", segs: [["        "], ["seen", "v"], ["."], ["add", "f"], ["("], ["n", "v"], [")"]] },
    { id: "grade", gap: 4 },
  ],
} satisfies Record<string, Ev[]>;
export type DemoKind = keyof typeof SCRIPTS;

const TICK = 45; // 한 글자(ms)
const GAP = 8; // 글 사이 쉼(틱)
const HOLD = 70; // 다 끝난 뒤 머무름(틱)

function timeline(evs: Ev[]) {
  const start: Record<string, number> = {}, len: Record<string, number> = {};
  let tick = 0;
  for (const e of evs) {
    start[e.id] = tick;
    len[e.id] = e.segs ? e.segs.reduce((n, s) => n + s[0].length, 0) : 0;
    tick += len[e.id] + (e.gap ?? GAP);
  }
  return { start, len, total: tick };
}

export default function TypeDemo({ kind, label }: { kind: DemoKind; label: string }) {
  const evs: Ev[] = SCRIPTS[kind];
  const { start, len, total } = timeline(evs);
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(total); // 서버·스크립트 전에는 다 나온 모습
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setT(0);
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      setMoving(e.isIntersecting);
      if (e.isIntersecting) timer = window.setInterval(() => setT((v) => (v >= total + HOLD ? 0 : v + 1)), TICK);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); window.clearInterval(timer); };
  }, [total]);

  const on = (id: string) => t >= start[id];
  const cls = (base: string, id: string) => (on(id) ? `${base} on` : base);
  // 커서는 지금 쓰고 있거나 마지막으로 쓴 글 끝에
  let caretId = "";
  for (const e of evs) if (e.segs && t >= start[e.id]) caretId = e.id;
  const Ty = ({ id }: { id: string }): ReactNode => {
    const ev = evs.find((e) => e.id === id)!;
    let left = Math.max(0, Math.min(len[id], t - start[id]));
    return (
      <>
        {ev.segs!.map(([txt, c], i) => {
          const part = txt.slice(0, Math.max(0, left));
          left -= txt.length;
          return part ? (c ? <span key={i} className={c}>{part}</span> : <span key={i}>{part}</span>) : null;
        })}
        {moving && caretId === id && <i className="td-caret" aria-hidden="true"></i>}
      </>
    );
  };

  const dark = kind === "dev" || kind === "doc" || kind === "code";
  return (
    <div className="tdemo" ref={ref} role="img" aria-label={label}>
      <div className={dark ? "td-win dk" : "td-win"}>
        {kind === "jd" && (
          <>
            <div className="td-row" style={at(16, 14)}><b className="td-t">채용공고 작성</b></div>
            <span className="td-btn" style={at(226, 16)}>임시 저장</span>
            <i className="td-hr" style={at(0, 50)}></i>
            <span className="td-lb" style={at(16, 62)}>직무</span>
            <div className="td-in" style={at(16, 76, { width: u(300), height: u(26) })}><span className="td-line"><Ty id="role" /></span></div>
            <span className="td-lb" style={at(16, 112)}>주요 업무</span>
            <div className="td-in" style={at(16, 126, { width: u(300), height: u(96) })}></div>
            {["j1", "j2", "j3"].map((id, k) => <span key={id} className="td-line td-abs" style={at(27, 135 + k * 20)}><Ty id={id} /></span>)}
          </>
        )}
        {kind === "cv" && (
          <>
            <div className="td-row" style={at(16, 12)}>
              <img className="td-av" src="/face-avatar.webp" alt="" width={96} height={96} />
              <b className="td-t" style={{ marginLeft: u(8) }}>김지원</b>
              <span className="td-n" style={{ marginLeft: u(6) }}>서비스 기획자 지원</span>
            </div>
            <span className="td-btn" style={at(258, 14)}>이력서</span>
            <i className="td-hr" style={at(0, 50)}></i>
            <span className="td-lb" style={at(16, 62)}>경력</span>
            <span className="td-line td-abs" style={at(16, 81)}><Ty id="c0" /></span>
            <span className={cls("td-d td-abs", "d0")} style={{ right: u(104), top: u(82) }}>2021 – 현재</span>
            <div className={cls("td-pick", "c1")} style={at(16, 100, { width: u(300), height: u(26) })}>
              <span className="td-line td-strong"><Ty id="c1" /></span>
              <b className={on("chip") ? "on" : undefined}>확인할 경험</b>
            </div>
            <span className="td-line td-abs" style={at(16, 135)}><Ty id="c2" /></span>
            <span className="td-lb" style={at(16, 162)}>프로젝트</span>
            <span className="td-line td-abs" style={at(16, 181)}><Ty id="c3" /></span>
            <span className={cls("td-d td-abs", "d1")} style={{ right: u(104), top: u(182) }}>2023</span>
            <span className="td-line td-abs" style={at(16, 203)}><Ty id="c4" /></span>
          </>
        )}
        {kind === "dev" && (
          <>
            <div className="td-tabs"><span className="on">task.ts</span><span>task.test.ts</span></div>
            {[
              <><span className="k">function</span> <span className="f">total</span>(<span className="v">cart</span>) {"{"}</>,
              <>  <span className="k">let</span> <span className="v">sum</span> = <span className="n">0</span>;</>,
              <>  <span className="c">for</span> (<span className="k">const</span> <span className="v">item</span> <span className="k">of</span> <span className="v">cart</span>.<span className="v">items</span>)</>,
              <>    <span className="v">sum</span> += <span className="v">item</span>.<span className="v">price</span>;</>,
              null,
              <>  <span className="c">return</span> <span className="v">sum</span> * (<span className="n">1</span> - <span className="v">cart</span>.<span className="v">coupon</span>);</>,
              <>{"}"}</>,
            ].map((code, i) => (
              <div key={i} className={i === 4 ? cls("td-code fix", "fix") : "td-code"} style={at(0, 38 + i * 15)}>
                <em>{i + 1}</em><span>{code ?? <Ty id="fix" />}</span>
              </div>
            ))}
            <div className="td-term" style={at(0, 166, { width: u(200) })}><span className={cls("ok", "pass")}>✓ 테스트 통과</span><span>task.test.ts</span></div>
            <div className="td-side" style={{ left: u(200) }}>
              <b className="td-slb">AI 에이전트</b>
              <div className={cls("td-me", "me")}>쿠폰이 없을 때 합계가 틀려요.<br />고쳐 줘</div>
              <div className={cls("td-ai", "ai")}><i>✦</i><span><Ty id="ai" /></span></div>
            </div>
          </>
        )}
        {kind === "doc" && (
          <>
            <div className="td-tabs"><span className="on">보고서.md</span><span>파일1.csv</span></div>
            <div className="td-md" style={at(12, 40, { width: u(172) })}>
              <p className="h1"><Ty id="m1" /></p>
              <p className="h2"><Ty id="m2" /></p>
              <p className="tb"><Ty id="m3" /></p>
              <p className="tb"><Ty id="m4" /></p>
              <p className="h2"><Ty id="m5" /></p>
              <p><Ty id="m6" /></p>
            </div>
            <div className="td-side" style={{ left: u(190) }}>
              <div className="td-seg"><span>AI 어시스턴트</span><span className="on">이해관계자</span></div>
              <div className={cls("td-me", "q")}>지난 분기 목표는 무엇이었나요?</div>
              <div className={cls("td-they", "a")}><b>마케팅 팀장</b><span><Ty id="a" /></span></div>
            </div>
          </>
        )}
        {kind === "code" && (
          <>
            <div className="td-row" style={at(16, 9)}><b className="td-t">코딩 테스트</b><span className="td-chip off" style={{ marginLeft: u(8) }}>AI·검색 사용 불가</span></div>
            <span className="td-sbtn" style={at(262, 11)}>제출</span>
            <i className="td-hr" style={at(0, 40)}></i>
            <div className="td-q" style={at(0, 40, { width: u(116) })}>
              <b>문제</b>
              <p>처음으로 두 번 나온 수를 돌려주세요.</p>
              <p className="ex">입력 [2, 7, 2]<br />출력 2</p>
            </div>
            {["k1", "k2", "k3", "k4", "k5", "k6"].map((id, i) => (
              <div key={id} className="td-code" style={at(117, 46 + i * 15)}><em>{i + 1}</em><span><Ty id={id} /></span></div>
            ))}
            <div className="td-term" style={at(117, 160, { width: u(221) })}><span className={cls("ok", "grade")}>제출하면 숨은 테스트로 자동 채점합니다</span></div>
          </>
        )}
      </div>
    </div>
  );
}
