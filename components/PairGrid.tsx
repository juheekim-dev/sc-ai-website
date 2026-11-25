"use client";

import { useEffect, useRef } from "react";

// 문제 → 해결 세 쌍(.pair-grid) — AI 역량검사 02 문제 섹션(2026-11-25 C안). 스타일·모션은 app/landing.css(.pair-grid).
// 모션: 흰 해결 카드가 바로 위 문제 카드 자리로 올라가면서 문제 카드와 같은 높이로 늘어나 덮고, 화살표는 사라졌다가
// 돌아온다(01→02→03 반 박자씩). 올라갈 거리(--d)와 늘어날 높이(--h = 문제 카드 높이)는 화면 폭에 따라 글 줄 수가 달라져 여기서 잰다. 화면에 보일 때만(.moving) 움직이고,
// 움직임 줄이기 설정이면 CSS가 멈춘다. 스크립트가 없어도 카드는 제자리에 그대로 보인다.
export type Pair = { problem: string; solution: string };

export default function PairGrid({ pairs }: { pairs: Pair[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const measure = () => {
      ol.querySelectorAll<HTMLLIElement>(".pair").forEach((li) => {
        const prob = li.querySelector<HTMLElement>(".pair-prob");
        const sol = li.querySelector<HTMLElement>(".pair-sol");
        if (!prob || !sol) return;
        li.style.setProperty("--d", `${sol.offsetTop - prob.offsetTop}px`);
        li.style.setProperty("--h", `${prob.offsetHeight}px`);
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ol);
    const io = new IntersectionObserver(([e]) => ol.classList.toggle("moving", e.isIntersecting), { threshold: 0.3 });
    io.observe(ol);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <ol className="pair-grid" ref={ref}>
      {pairs.map((p, i) => (
        <li className="pair" key={p.problem}>
          <div className="pair-prob"><span className="n">{String(i + 1).padStart(2, "0")}</span><p>{p.problem}</p></div>
          <span className="pair-arrow" aria-hidden="true"></span>
          <p className="pair-sol"><span className="pair-ck" aria-hidden="true"></span>{p.solution}</p>
        </li>
      ))}
    </ol>
  );
}
