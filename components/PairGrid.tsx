"use client";

import { useEffect, useRef } from "react";

// 문제 → 해결 세 쌍(.pair-grid) — AI 역량검사 02 문제 섹션(2026-11-25 C안). 스타일·모션은 app/landing.css(.pair-grid).
// 처음엔 01~03 문제 카드만 보이고(화살표 없음), 흰 체크 박스가 01→02→03 차례로 아래에서 올라와 같은 자리의 문제 카드를 덮는다.
// 셋 다 덮인 뒤 차례로 내려가고 다시 반복. 화면에 보일 때만(.moving) 움직이고, 들어올 때마다 처음부터 시작한다.
// 움직임 줄이기 설정이면 CSS가 체크 박스를 문제 카드 아래에 그대로 보여 준다.
export type Pair = { problem: string; solution: string };

export default function PairGrid({ pairs }: { pairs: Pair[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const io = new IntersectionObserver(([e]) => ol.classList.toggle("moving", e.isIntersecting), { threshold: 0.3 });
    io.observe(ol);
    return () => io.disconnect();
  }, []);

  return (
    <ol className="pair-grid" ref={ref}>
      {pairs.map((p, i) => (
        <li className="pair" key={p.problem}>
          <div className="pair-prob"><span className="n">{String(i + 1).padStart(2, "0")}</span><p>{p.problem}</p></div>
          <p className="pair-sol"><span className="pair-sol-in"><span className="pair-ck" aria-hidden="true"></span>{p.solution}</span></p>
        </li>
      ))}
    </ol>
  );
}
