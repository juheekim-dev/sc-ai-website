"use client";

import { useEffect, useRef } from "react";

// 문제 → 해결 세 쌍(.pair-list) — AI 면접·AI 역량검사 공용 문제 띠. 스타일·모션은 app/landing.css(.pair-list).
// 2026-11-26 카드형("이게 더 잘 읽힌다" — 시안 C안의 카드): 카드 하나에 문제(x, 흐린 글씨) 한 줄과 해결(체크, 흰 굵은 글씨) 한 줄을 위아래로, 카드 세 장을 쌓는다.
// (그 전 A안은 한 줄에 '문제 → 해결'을 화살표로 나란히 뒀다. 처음 C안은 흰 체크 박스가 문제 카드를 덮어 하나씩만 보였다.)
// 화면에 들어오면(.inview) 한 번만 움직인다: 카드가 한 장씩 차례로 떠올라 문제와 해결 문장이 함께 나타난다. 그 전에는 첫 장면에서 멈춰 있다.
// 움직임 줄이기 설정이면 CSS가 모션 없이 다 보여 준다.
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
          <span className="pl-sol"><i className="pl-ck" aria-hidden="true"></i>{p.solution}</span>
        </li>
      ))}
    </ul>
  );
}
