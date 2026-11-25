import type { ReactNode } from "react";

// 3단계 카드 줄(.flow2 > .pstep) — 제품 페이지의 도입 3단계·지원자 응시 과정 공용. 스타일은 app/landing.css(.flow2·.pstep).
// 아이콘은 lucide 선 아이콘 경로(<path …/>)를 넘긴다 — Font Awesome 서브셋에 없는 모양도 쓸 수 있게.
// img를 넘기면 카드 아래에 실제 제품 화면(720×480, 가공 원본은 _docs/홈페이지 개편/도식/캡처가공)을 꽉 차게 붙이고 아이콘은 그리지 않는다
// — 아이콘과 이미지를 같이 두면 과하다는 피드백(2026-11-25). 그래서 icon은 이미지가 없는 단계에만 필요하다.
export type Step = { title: string; body: ReactNode; icon?: ReactNode; img?: string; alt?: string };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export default function StepFlow({ steps }: { steps: Step[] }) {
  return (
    <div className="flow2">
      {steps.map((s, i) => (
        <div className={s.img ? "pstep has-shot" : "pstep"} key={s.title}>
          {!s.img && s.icon && <div className="pic"><svg viewBox="0 0 24 24" {...stroke}>{s.icon}</svg></div>}
          <span className="pstep-tag">STEP {String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          {s.img && <img className="ps-shot" src={s.img} alt={s.alt ?? ""} width={720} height={480} loading="lazy" />}
        </div>
      ))}
    </div>
  );
}
