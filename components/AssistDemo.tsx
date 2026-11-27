"use client";

import { useEffect, useRef, useState } from "react";
import DemoPanel from "./DemoPanel";

// AI 역량검사 '과제 화면' 그림 — 히어로의 AI 어시스턴트 카드(어두운 바탕)를 HTML로 크게 그린 것(홈 05 제품 카드·/ai-assessment 진행 방식).
// 11/26 "ChatGPT에 글을 쓰는 것처럼" 시안 A안 + "답이 길게": 아래 입력창에 지시가 한 글자씩 써지고 → 전송 → 말풍선으로 올라가고 →
// AI가 생각하다(점 세 개) 긴 답을 한 글자씩 → '완료'. 시안: _docs/홈페이지 개편/AI역량검사_어시스턴트_타이핑_시안.html
// 카드 높이는 AI 면접 카드(AskDemo)와 같게 고정 — 답이 길어지면 위 말풍선이 위로 밀려 흐려진다(ChatGPT처럼).
// 답은 AI 역량검사가 보는 'AI 결과 검증' 장면(수치가 다른 곳을 짚고 원본 확인을 권함). 글은 히어로와 같은 일반 예시(파일 1, 2, 3).
// 화면에 보일 때만 돌고, 벗어나면 멈췄다가 다시 보이면 처음부터. 움직임 줄이기 설정이면 다 쓰인 상태 한 장. 스타일은 app/landing.css(.ad-card.chat).
const ASK = "파일 1, 2, 3을 비교해서 표로 정리해 줘";
const ANS = "세 파일을 읽고 항목별 비교표를 만들어 보고서.md에 넣었어요. 파일 2와 파일 3의 수치가 서로 다른 곳이 두 군데 있어 표에 표시해 두었어요. 원본을 한 번 확인해 주세요.";

type View = { input: string; ready: boolean; press: boolean; you: boolean; ai: boolean; thinking: boolean; ans: string; done: boolean };
const EMPTY: View = { input: "", ready: false, press: false, you: false, ai: false, thinking: false, ans: "", done: false };
const FULL: View = { input: "", ready: false, press: false, you: true, ai: true, thinking: false, ans: ANS, done: true };

export default function AssistDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<View>(EMPTY);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(FULL);
      return;
    }
    let run = 0; // 화면에서 벗어나거나 언마운트되면 run이 바뀌어 진행 중인 루프가 멈춘다
    const sleep = (ms: number, id: number) =>
      new Promise<void>((res, rej) => setTimeout(() => (id === run ? res() : rej()), ms));
    const loop = async (id: number) => {
      try {
        for (;;) {
          setV(EMPTY);
          await sleep(700, id);
          // 입력창에 한 글자씩 → 전송
          for (let i = 1; i <= ASK.length; i++) {
            setV((s) => ({ ...s, input: ASK.slice(0, i), ready: true }));
            await sleep(55, id);
          }
          await sleep(350, id);
          setV((s) => ({ ...s, press: true }));
          await sleep(150, id);
          setV((s) => ({ ...s, press: false, ready: false, input: "", you: true }));
          // AI 생각 중 → 긴 답을 한 글자씩
          await sleep(450, id);
          setV((s) => ({ ...s, ai: true, thinking: true }));
          await sleep(1100, id);
          for (let i = 1; i <= ANS.length; i++) {
            setV((s) => ({ ...s, thinking: false, ans: ANS.slice(0, i) }));
            await sleep(32, id);
          }
          await sleep(250, id);
          setV((s) => ({ ...s, done: true }));
          await sleep(3600, id);
        }
      } catch {
        /* 멈춤 */
      }
    };
    const io = new IntersectionObserver(([e]) => {
      run++;
      if (e.isIntersecting) loop(run);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => {
      run++;
      io.disconnect();
    };
  }, []);

  const typing = v.ans.length > 0 && v.ans.length < ANS.length;
  return (
    <DemoPanel label={`지원자가 AI 어시스턴트 입력창에 '${ASK}'라고 지시하고, AI가 '${ANS}'라고 답하는 과제 화면 예시`}>
      <div className="ad-card dark chat" ref={ref} aria-hidden="true">
        <div className="ad-head"><b>AI 어시스턴트</b><span><i></i>Build</span></div>
        <div className="ad-msgs">
          <p className={v.you ? "ad-you on" : "ad-you"}>{ASK}</p>
          <p className={v.ai ? "ad-ai on" : "ad-ai"}>
            <span className="ad-spark">✦</span>
            {v.thinking ? <span className="ad-dots"><i></i><i></i><i></i></span> : v.ans}
            {typing && <span className="ad-caret"></span>}
            <em className={v.done ? "on" : undefined}>완료</em>
          </p>
        </div>
        <div className="ad-input">
          <span className="ad-tx">{v.input ? <>{v.input}<span className="ad-caret"></span></> : <span className="ad-ph">AI 어시스턴트에게 지시하기</span>}</span>
          <span className={`ad-send${v.ready ? " ready" : ""}${v.press ? " press" : ""}`}>↑</span>
        </div>
      </div>
    </DemoPanel>
  );
}
