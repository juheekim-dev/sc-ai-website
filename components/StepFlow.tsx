import type { ReactNode } from "react";

// 3단계 카드 줄(.flow2 > .pstep) — 제품 페이지의 도입 3단계·지원자 응시 과정 공용. 스타일은 app/landing.css(.flow2·.pstep).
// 아이콘은 lucide 선 아이콘 경로(<path …/>)를 넘긴다 — Font Awesome 서브셋에 없는 모양도 쓸 수 있게.
export type Step = { title: string; body: ReactNode; icon: ReactNode };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function StepFlow({ steps }: { steps: Step[] }) {
  return (
    <div className="flow2">
      {steps.map((s, i) => (
        <div className="pstep" key={s.title}>
          <div className="pic"><svg viewBox="0 0 24 24" {...stroke}>{s.icon}</svg></div>
          <span className="pstep-tag">STEP {String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  );
}
