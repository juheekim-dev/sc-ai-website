"use client";

import { useEffect, useRef } from "react";

// 문제 → 해결 세 쌍(.pair-list) — AI 면접·AI 역량검사 공용 문제 띠. 스타일·모션은 app/landing.css(.pair-list).
// 2026-11-25 A안("가독성이 떨어진다"는 피드백으로 다시 짬): 한 줄에 '문제(흐린 글씨) → 해결(흰 굵은 글씨)'을 나란히 두고 세 줄을 위아래로 쌓는다.
// 문제와 해결이 늘 함께 보인다(예전 C안은 흰 체크 박스가 문제 카드를 덮어 하나씩만 보였다).
// 화면에 들어오면(.inview) 한 번만 움직인다: 위 줄부터 화살표가 그어지고 해결 문장이 나타난다. 그 전에는 첫 장면에서 멈춰 있다.
// 움직임 줄이기 설정이면 CSS가 모션 없이 다 보여 준다. 모바일은 문제 아래에 해결이 온다(화살표 없음).
export type Pair = { problem: string; solution: string };

export default function PairGrid({ pairs }: { pairs: Pair[] }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = ref.current;
    if (!ul) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      ul.classList.add("inview");
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(ul);
    return () => io.disconnect();
  }, []);

  return (
    <ul className="pair-list" ref={ref}>
      {pairs.map((p) => (
        <li key={p.problem}>
          <span className="pl-prob"><i className="pl-x" aria-hidden="true"></i>{p.problem}</span>
          <i className="pl-arrow" aria-hidden="true"></i>
          <span className="pl-sol"><i className="pl-ck" aria-hidden="true"></i>{p.solution}</span>
        </li>
      ))}
    </ul>
  );
}
