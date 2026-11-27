"use client";

import { useEffect, useRef, useState } from "react";

// AI 면접 '리포트 01 · 인터뷰 요약' 그림(2026-11-27 "실제 인터뷰 정면 이미지로, 인터뷰 요약도 텍스트가 써지게") — 옛 SVG 도식(motionDiagrams 'interview') 대신.
// 왼쪽: 면접 영상 카드(실제 정면 사진 integrity-report-front.webp — 감지 리포트와 같은 지원자, REC·재생 막대가 흐른다).
// 오른쪽: 인터뷰 요약 카드 — 질문 아래 요약 세 줄이 한 글자씩 써지고 잠시 머문 뒤 다시(반복). 요약은 예시 문장(히어로·면접 진행 카드의 질문·꼬리질문과 같은 장면).
// 화면에 보일 때만 돌고, 움직임 줄이기 설정이면 다 쓰인 상태 한 장. 판(.ask-demo)은 AskDemo·AssistDemo와 같다. 스타일은 app/landing.css(.sd-*).
const Q = "최근 프로젝트에서 가장 어려웠던 결정";
const LINES = [
  "결제 화면 개편에서 일정과 품질 사이 우선순위를 정한 경험을 설명함",
  "사용자 인터뷰와 이탈 데이터를 근거로 결정했다고 답함",
  "결정 뒤 지표로 결과를 다시 확인한 과정은 구체적이지 않음",
];

export default function SummaryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState<string[]>(["", "", ""]);
  const [cur, setCur] = useState(-1); // 지금 써지는 줄(커서 위치)

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(LINES);
      return;
    }
    let run = 0;
    const sleep = (ms: number, id: number) => new Promise<void>((res, rej) => setTimeout(() => (id === run ? res() : rej()), ms));
    const loop = async (id: number) => {
      try {
        for (;;) {
          setTyped(["", "", ""]);
          setCur(-1);
          await sleep(900, id);
          for (let l = 0; l < LINES.length; l++) {
            setCur(l);
            for (let i = 1; i <= LINES[l].length; i++) {
              setTyped((t) => t.map((v, k) => (k === l ? LINES[l].slice(0, i) : v)));
              await sleep(38, id);
            }
            await sleep(380, id);
          }
          setCur(-1);
          await sleep(3200, id);
        }
      } catch {
        /* 멈춤 */
      }
    };
    const io = new IntersectionObserver(([e]) => {
      run++;
      el.classList.toggle("play", e.isIntersecting);
      if (e.isIntersecting) loop(run);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => {
      run++;
      io.disconnect();
    };
  }, []);

  return (
    <div className="ask-demo sd" ref={ref} role="img" aria-label={`인터뷰 요약 예시: 면접 영상 옆에 '${Q}' 질문의 답변 요약이 한 줄씩 써지는 모습 — ${LINES.join(" / ")}`}>
      <div className="sd-in" aria-hidden="true">
        <div className="sd-vid">
          <div className="sd-frame">
            <img src="/integrity-report-front.webp" alt="" width={1120} height={630} loading="lazy" />
            <span className="sd-rec"><i></i>REC</span>
          </div>
          <div className="sd-bar"><span className="sd-play"></span><span className="sd-track"><b></b></span><span className="sd-t">00:42</span></div>
        </div>
        <div className="sd-card">
          <span className="sd-hd">인터뷰 요약</span>
          <p className="sd-q">Q. {Q}</p>
          <ul>
            {LINES.map((l, k) => (
              <li key={k} className={typed[k] ? "on" : undefined}>
                <span>{typed[k]}{cur === k && <i className="sd-caret"></i>}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
